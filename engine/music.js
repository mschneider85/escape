/*
 * Hintergrundmusik – wird live im Browser erzeugt (WebAudio), keine Audiodateien nötig.
 * Jede Welt hat ihren eigenen Klang: Spieluhr (Nordpol), gezupfte Laute (Ägypten), Sphärenklang (Weltraum).
 * Die Melodie entsteht aus einem festen Zufallswert, klingt also jedes Mal gleich – wie ein richtiges Lied.
 */
function createMusic(getCtx) {
  const STYLES = {
    home: {
      bpm: 80, root: 65, scale: [0, 2, 4, 5, 7, 9, 11], chords: [[0, 'maj'], [9, 'min'], [5, 'maj'], [7, 'maj']],
      lead: 'box', density: 0.6, seed: 11, octave: 12, pad: 'soft',
    },
    nordpol: {
      bpm: 76, root: 60, scale: [0, 2, 4, 5, 7, 9, 11], chords: [[0, 'maj'], [9, 'min'], [5, 'maj'], [7, 'maj']],
      lead: 'box', density: 0.65, seed: 3, octave: 12, pad: 'soft',
    },
    aegypten: {
      bpm: 92, root: 62, scale: [0, 1, 4, 5, 7, 8, 10], chords: [[0, 'maj'], [1, 'maj'], [0, 'maj'], [-2, 'maj']],
      lead: 'pluck', density: 0.75, seed: 7, octave: 0, pad: 'drone',
    },
    weltraum: {
      bpm: 58, root: 57, scale: [0, 2, 4, 6, 7, 9, 11], chords: [[0, 'maj'], [-3, 'min'], [5, 'maj'], [2, 'maj']],
      lead: 'glass', density: 0.5, seed: 5, octave: 0, pad: 'space',
    },
  };
  const VOLUME = 0.55;

  let ac = null, out = null, echo = null;
  let style = null, wanted = null, enabled = true;
  let timer = null, nextTime = 0, step = 0, phrases = null;

  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function rng(seed) {
    let s = seed * 9301 + 49297;
    return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  }

  /** Erzeugt eine Melodie über die 4 Akkorde (je 8 Achtel = 32 Schritte). */
  function makePhrase(st, seed) {
    const r = rng(seed);
    const notes = [];
    let deg = 4; // Startton: Mitte der Tonleiter
    for (let i = 0; i < 32; i++) {
      const [croot, q] = st.chords[Math.floor(i / 8)];
      const strong = i % 2 === 0;
      if (r() > st.density && !(i % 8 === 0)) continue;
      if (strong) {
        // auf der Zählzeit: Akkordton in der Nähe
        const tones = [0, q === 'min' ? 3 : 4, 7].map((t) => croot + t);
        const cur = st.scale[((deg % 7) + 7) % 7] + 12 * Math.floor(deg / 7);
        let best = tones[0], bd = 99;
        for (const t of tones) for (const o of [-12, 0, 12]) { const d = Math.abs(t + o - cur); if (d < bd) { bd = d; best = t + o; } }
        notes.push({ i, midi: best, len: r() < 0.3 ? 3 : 1 });
        deg = Math.round(best / 12 * 7);
      } else {
        deg += [-2, -1, -1, 1, 1, 2][Math.floor(r() * 6)];
        deg = Math.max(0, Math.min(11, deg));
        notes.push({ i, midi: st.scale[deg % 7] + 12 * Math.floor(deg / 7), len: 1 });
      }
    }
    return notes;
  }

  function ensureGraph() {
    ac = getCtx();
    if (out) return;
    out = ac.createGain();
    out.gain.value = 0;
    out.connect(ac.destination);
    // Echo für den Weltraum-Klang
    echo = ac.createDelay(1);
    echo.delayTime.value = 0.42;
    const fb = ac.createGain();
    fb.gain.value = 0.38;
    const wet = ac.createGain();
    wet.gain.value = 0.5;
    echo.connect(fb).connect(echo);
    echo.connect(wet).connect(out);
  }

  // Wie lange ein Ton nach dem Anschlag noch klingt (danach wird der Oszillator beendet)
  const TAIL = { box: 1.5, pluck: 0.75, glass: 2.3 };

  function voice(kind, midi, t, dur, vol) {
    const f = mtof(midi);
    const g = ac.createGain();
    g.connect(out);
    const end = t + (TAIL[kind] || dur + 0.7) + 0.05;
    const osc = (type, freq, gain = 1) => {
      const o = ac.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      const og = ac.createGain();
      og.gain.value = gain;
      o.connect(og).connect(g);
      o.start(t);
      o.stop(end);
      return o;
    };
    if (kind === 'box') {
      // Spieluhr: Sinus + leiser Oberton, kurzer Anschlag, langes Ausklingen
      osc('sine', f); osc('sine', f * 2, 0.25);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
    } else if (kind === 'pluck') {
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 2200; lp.Q.value = 2;
      g.disconnect(); g.connect(lp).connect(out);
      osc('triangle', f);
      lp.frequency.setValueAtTime(3200, t);
      lp.frequency.exponentialRampToValueAtTime(700, t + 0.35);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.72);
    } else if (kind === 'glass') {
      osc('sine', f);
      g.connect(echo);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.25);
    } else {
      // Flächenklang (Begleitung)
      const type = kind === 'drone' ? 'triangle' : 'sine';
      osc(type, f);
      if (kind === 'space') g.connect(echo);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + Math.min(0.8, dur * 0.3));
      g.gain.setValueAtTime(vol, t + dur * 0.8);
      g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.6);
    }
  }

  function schedule() {
    const st = STYLES[style];
    const eighth = 60 / st.bpm / 2;
    while (nextTime < ac.currentTime + 1.2) {
      const loop = Math.floor(step / 32);
      const i = step % 32;
      const phrase = phrases[[0, 0, 1, 0][loop % 4]];
      // Begleitung: zu Beginn jedes Akkords
      if (i % 8 === 0) {
        const [croot, q] = st.chords[i / 8];
        const base = st.root - 12 + croot;
        const pv = st.pad === 'drone' ? 0.05 : 0.035;
        if (st.pad === 'drone') voice('drone', st.root - 24, nextTime, eighth * 8, pv);
        voice(st.pad, base, nextTime, eighth * 8, pv);
        voice(st.pad, base + (q === 'min' ? 3 : 4), nextTime, eighth * 8, pv * 0.7);
        voice(st.pad, base + 7, nextTime, eighth * 8, pv * 0.7);
      }
      for (const n of phrase) {
        if (n.i === i) voice(st.lead, st.root + st.octave + n.midi, nextTime, eighth * n.len, st.lead === 'pluck' ? 0.09 : 0.07);
      }
      nextTime += eighth;
      step++;
    }
  }

  function start(name) {
    ensureGraph();
    if (ac.state !== 'running') {
      // iOS: Ton erst nach Antippen – sobald der Kontext läuft, nochmal versuchen
      ac.resume().then(() => { if (ac.state === 'running' && enabled && wanted === name && !timer) start(name); }).catch(() => {});
      return;
    }
    if (style === name && timer) return;
    stopNow(true);
    style = name;
    const st = STYLES[name];
    phrases = [makePhrase(st, st.seed), makePhrase(st, st.seed + 100)];
    step = 0;
    nextTime = ac.currentTime + 0.15;
    out.gain.cancelScheduledValues(ac.currentTime);
    out.gain.setValueAtTime(0.0001, ac.currentTime);
    out.gain.linearRampToValueAtTime(VOLUME, ac.currentTime + 1.5);
    schedule();
    timer = setInterval(schedule, 250);
  }

  function stopNow(fadeOnly) {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
    if (out && ac) {
      // altes Ausgangssignal ausblenden und durch ein neues ersetzen
      const old = out;
      old.gain.cancelScheduledValues(ac.currentTime);
      old.gain.setValueAtTime(old.gain.value, ac.currentTime);
      old.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 0.8);
      setTimeout(() => old.disconnect(), 4000);
      out = null; echo = null;
      if (fadeOnly) ensureGraph();
    }
    style = null;
  }

  return {
    /** Diese Musik soll laufen (startet sofort oder beim nächsten Antippen). */
    want(name) {
      wanted = name;
      if (enabled) { try { start(name); } catch (e) { /* kein Audio */ } }
    },
    /** Nach einer Berührung erneut versuchen (iOS erlaubt Ton erst nach Antippen). */
    kick() {
      if (enabled && wanted && !timer) { try { start(wanted); } catch (e) { /* kein Audio */ } }
    },
    setEnabled(on) {
      enabled = on;
      if (!on) stopNow(false);
      else this.kick();
    },
    get playing() { return !!timer; },
  };
}
