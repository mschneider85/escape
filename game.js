(() => {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const STORE_KEY = 'escape-welten-v1';

  // ---------- Speichern ----------
  const save = (() => {
    let data = { done: {}, sound: true, voice: false };
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) data = Object.assign(data, JSON.parse(raw));
    } catch (e) { /* privat-Modus o.ä. */ }
    return {
      data,
      write() { try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) { /* egal */ } },
    };
  })();

  // ---------- Klang ----------
  let audioCtx = null;
  function tone(freqs, dur = 0.12, type = 'sine', gap = 0.09) {
    if (!save.data.sound) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      freqs.forEach((f, i) => {
        const t = audioCtx.currentTime + i * gap;
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = type;
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(audioCtx.destination);
        o.start(t);
        o.stop(t + dur + 0.05);
      });
    } catch (e) { /* kein Audio */ }
  }
  const sfx = {
    tap: () => tone([520], 0.06, 'triangle'),
    item: () => tone([660, 880, 1320], 0.14, 'triangle'),
    good: () => tone([523, 659, 784], 0.16, 'sine'),
    bad: () => tone([220, 180], 0.18, 'square', 0.12),
    win: () => tone([523, 659, 784, 1047, 784, 1047], 0.2, 'triangle', 0.12),
    light: () => tone([300, 450, 600, 900], 0.15, 'sine', 0.06),
  };

  // ---------- Vorlesen ----------
  const stripEmoji = (t) => t.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{1F3FB}-\u{1F3FF}\u{1F7E0}-\u{1F7EB}]/gu, ' ')
    .replace(/\s+/g, ' ').trim();
  let germanVoice = null;
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = speechSynthesis.getVoices();
    germanVoice = voices.find((v) => v.lang === 'de-DE' && /Anna|Helena|Petra/i.test(v.name))
      || voices.find((v) => v.lang && v.lang.startsWith('de')) || null;
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(stripEmoji(text));
    u.lang = 'de-DE';
    u.rate = 0.95;
    u.pitch = 1.1;
    if (germanVoice) u.voice = germanVoice;
    speechSynthesis.speak(u);
  }
  function stopSpeaking() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  // ---------- Bildschirme ----------
  function show(id) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === 'screen-' + id));
    stopSpeaking();
  }

  let currentWorld = null;
  let currentAdv = null;
  let state = null; // { inv: [], done: Set, removed: Set, revealed: Set, lit: bool, won: bool }

  const isDone = (adv) => !!save.data.done[adv.id];
  const worldDoneCount = (w) => w.adventures.filter(isDone).length;
  const isUnlocked = (w, i) => i === 0 || isDone(w.adventures[i - 1]);

  function renderHome() {
    const list = $('#world-list');
    list.innerHTML = '';
    WORLDS.forEach((w) => {
      const n = worldDoneCount(w);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'card';
      b.style.background = w.color;
      b.innerHTML = `
        ${n === w.adventures.length ? '<span class="badge">🏆</span>' : ''}
        <span class="big">${w.e}</span>
        <span class="name">${w.name}</span>
        <span class="info">${'⭐'.repeat(n)}${'☆'.repeat(w.adventures.length - n)}</span>`;
      b.addEventListener('click', () => { sfx.tap(); openWorld(w); });
      list.appendChild(b);
    });
    $('#btn-sound').textContent = save.data.sound ? '🔊 Töne an' : '🔇 Töne aus';
    $('#btn-voice').textContent = save.data.voice ? '🗣️ Vorlesen an' : '🤐 Vorlesen aus';
  }

  function openWorld(w) {
    currentWorld = w;
    $('#world-title').textContent = `${w.e} ${w.name}`;
    const list = $('#adventure-list');
    list.innerHTML = '';
    w.adventures.forEach((adv, i) => {
      const unlocked = isUnlocked(w, i);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'card' + (unlocked ? '' : ' locked');
      b.style.background = w.color;
      b.innerHTML = `
        ${isDone(adv) ? '<span class="badge">⭐</span>' : ''}
        <span class="big">${unlocked ? adv.e : '🔒'}</span>
        <span class="name">${i + 1}. ${adv.title}</span>
        <span class="info">${isDone(adv) ? 'Geschafft!' : unlocked ? 'Los geht’s!' : 'Erst das Abenteuer davor schaffen'}</span>`;
      b.addEventListener('click', () => {
        if (!unlocked) { sfx.bad(); return; }
        sfx.tap();
        startAdventure(adv);
      });
      list.appendChild(b);
    });
    show('world');
  }

  // ---------- Spiel ----------
  const scene = $('#scene');
  const darkness = $('#darkness');
  const bubble = $('#bubble');
  const objEls = new Map();

  function startAdventure(adv) {
    currentAdv = adv;
    state = { inv: [], done: new Set(), removed: new Set(), revealed: new Set(), lit: !adv.dark, won: false };
    $('#game-title').textContent = adv.title;
    scene.style.background = adv.bg;
    scene.querySelectorAll('.obj').forEach((el) => el.remove());
    objEls.clear();

    (adv.deco || []).forEach(([e, x, y, s]) => {
      const el = document.createElement('span');
      el.className = 'obj deco';
      el.textContent = e;
      place(el, x, y, s);
      scene.appendChild(el);
    });

    adv.objects.forEach((o) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'obj tap' + (o.glow ? ' glow' : '');
      el.textContent = o.e;
      el.setAttribute('aria-label', o.name);
      place(el, o.x, o.y, o.s);
      if (o.hidden) el.hidden = true;
      el.addEventListener('click', (ev) => { ev.stopPropagation(); tapObject(o); });
      scene.appendChild(el);
      objEls.set(o.id, el);
    });

    darkness.classList.toggle('on', !!adv.dark);
    darkness.classList.remove('fade');
    const glowObj = adv.objects.find((o) => o.glow);
    if (glowObj) {
      darkness.style.setProperty('--lx', glowObj.x + '%');
      darkness.style.setProperty('--ly', glowObj.y + '%');
    }

    renderInventory();
    show('game');
    $('#btn-hint').classList.remove('pulse');
    resetHintTimer();
    say(adv.intro);
  }

  function place(el, x, y, s) {
    el.style.left = x + '%';
    el.style.top = y + '%';
    el.style.setProperty('--s', s);
  }

  function say(text, autoSpeak = true) {
    $('#bubble-text').textContent = text;
    bubble.hidden = false;
    // Animation neu starten
    bubble.style.animation = 'none';
    void bubble.offsetWidth;
    bubble.style.animation = '';
    if (save.data.voice && autoSpeak) speak(text);
  }

  function itemName(id) { return currentAdv.items[id]?.name || id; }

  function tapObject(o) {
    if (state.won) return;
    resetHintTimer();
    const el = objEls.get(o.id);

    if (state.done.has(o.id)) {
      sfx.tap();
      wiggle(el);
      say(o.doneText || o.say || o.name);
      return;
    }

    if (o.needs && o.needs.length) {
      const missing = o.needs.filter((n) => !state.inv.includes(n));
      if (missing.length) {
        sfx.bad();
        wiggle(el);
        say(o.needText || `Dafür brauchst du: ${missing.map(itemName).join(', ')}.`);
        return;
      }
    }

    if (o.puzzle) {
      sfx.tap();
      openPuzzle(o.puzzle, () => complete(o));
      return;
    }

    // Reines Hinweis-Objekt
    if (!o.give && !o.reveal && !o.remove && !o.light && !o.win && !o.needs) {
      sfx.tap();
      wiggle(el);
      say(o.say || o.name);
      return;
    }

    complete(o);
  }

  function complete(o) {
    const el = objEls.get(o.id);
    (o.needs || []).forEach((n) => {
      state.inv = state.inv.filter((i) => i !== n);
    });
    state.done.add(o.id);

    if (o.light) {
      state.lit = true;
      darkness.classList.add('fade');
      sfx.light();
    }
    if (o.become) el.textContent = o.become;
    if (o.remove) {
      el.classList.add('gone');
      state.removed.add(o.id);
    } else {
      wiggle(el);
    }
    (o.reveal || []).forEach((id) => {
      const r = objEls.get(id);
      if (r) {
        r.hidden = false;
        r.classList.add('appear');
      }
      state.revealed.add(id);
    });
    if (o.give) {
      state.inv.push(o.give);
      sfx.item();
    } else if (!o.light) {
      sfx.good();
    }
    renderInventory(o.give);

    if (o.win) {
      winAdventure();
      return;
    }
    if (o.okText) say(o.okText);
  }

  function wiggle(el) {
    if (!el) return;
    el.classList.remove('wiggle');
    void el.offsetWidth;
    el.classList.add('wiggle');
  }

  function renderInventory(fresh) {
    const box = $('#inventory');
    box.innerHTML = '';
    state.inv.forEach((id) => {
      const it = currentAdv.items[id];
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'inv-item';
      b.textContent = it.e;
      b.setAttribute('aria-label', it.name);
      if (id !== fresh) b.style.animation = 'none';
      b.addEventListener('click', () => { sfx.tap(); say(`Im Rucksack: ${it.name}. Tippe auf etwas in der Szene, um es zu benutzen.`); });
      box.appendChild(b);
    });
  }

  // Dunkelheit: Tippen ins Dunkle
  darkness.addEventListener('click', () => {
    sfx.bad();
    say('Es ist viel zu dunkel! Suche etwas, das leuchtet.');
  });

  // ---------- Tipps ----------
  let hintTimer = null;
  function resetHintTimer() {
    clearTimeout(hintTimer);
    $('#btn-hint').classList.remove('pulse');
    hintTimer = setTimeout(() => $('#btn-hint').classList.add('pulse'), 45000);
  }
  $('#btn-hint').addEventListener('click', () => {
    if (!currentAdv || state.won) return;
    resetHintTimer();
    sfx.tap();
    const h = currentAdv.hints.find((x) => !state.done.has(x.until));
    say('💡 ' + (h ? h.text : 'Schau dich gut um und tippe alles an!'));
  });

  // Sprechblase schließen: auf die Blase oder eine leere Stelle der Szene tippen
  bubble.addEventListener('click', () => { bubble.hidden = true; stopSpeaking(); });
  scene.addEventListener('click', (e) => {
    if (e.target === scene) bubble.hidden = true;
  });

  $('#bubble-say').addEventListener('click', (e) => {
    e.stopPropagation();
    speak($('#bubble-text').textContent);
  });

  // ---------- Rätsel ----------
  const modal = $('#modal');
  const modalCard = modal.querySelector('.modal-card');
  let onSolved = null;

  function openPuzzle(p, solved) {
    onSolved = solved;
    $('#modal-prompt').textContent = p.prompt;
    const body = $('#modal-body');
    body.innerHTML = '';
    if (p.type === 'code') buildCode(p, body);
    else if (p.type === 'choice') buildChoice(p, body);
    else if (p.type === 'sequence') buildSequence(p, body);
    modal.hidden = false;
    if (save.data.voice) speak(p.prompt);
  }

  function closePuzzle() {
    modal.hidden = true;
    onSolved = null;
    stopSpeaking();
  }

  function solved() {
    const cb = onSolved;
    sfx.good();
    closePuzzle();
    if (cb) cb();
  }

  function wrong() {
    sfx.bad();
    modalCard.classList.remove('shake');
    void modalCard.offsetWidth;
    modalCard.classList.add('shake');
  }

  function buildCode(p, body) {
    let entry = '';
    const disp = document.createElement('div');
    disp.className = 'code-display';
    const draw = () => {
      disp.innerHTML = '';
      for (let i = 0; i < p.answer.length; i++) {
        const s = document.createElement('span');
        s.textContent = entry[i] || '';
        disp.appendChild(s);
      }
    };
    draw();
    const pad = document.createElement('div');
    pad.className = 'keypad';
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✔'].forEach((k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = k;
      if (k === '✔') b.className = 'ok';
      b.addEventListener('click', () => {
        if (k === '⌫') { entry = entry.slice(0, -1); sfx.tap(); }
        else if (k === '✔') {
          if (entry === p.answer) return solved();
          wrong();
          entry = '';
        } else if (entry.length < p.answer.length) {
          entry += k;
          sfx.tap();
          if (entry.length === p.answer.length) {
            draw();
            if (entry === p.answer) { setTimeout(solved, 250); return; }
            setTimeout(() => { wrong(); entry = ''; draw(); }, 250);
            return;
          }
        }
        draw();
      });
      pad.appendChild(b);
    });
    body.append(disp, pad);
  }

  function buildChoice(p, body) {
    const wrap = document.createElement('div');
    wrap.className = 'choices';
    p.options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = `<span class="e">${opt.e}</span><span>${opt.label}</span>`;
      b.addEventListener('click', () => (i === p.answer ? solved() : wrong()));
      wrap.appendChild(b);
    });
    body.appendChild(wrap);
  }

  function buildSequence(p, body) {
    let pos = 0;
    const prog = document.createElement('div');
    prog.className = 'seq-progress';
    const slots = p.answer.map(() => {
      const s = document.createElement('span');
      prog.appendChild(s);
      return s;
    });
    const pad = document.createElement('div');
    pad.className = 'seq-pad';
    p.options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = `<span class="e">${opt.e}</span><span>${opt.label}</span>`;
      b.addEventListener('click', () => {
        if (i === p.answer[pos]) {
          slots[pos].textContent = opt.e;
          slots[pos].classList.add('filled');
          pos++;
          tone([440 + pos * 110], 0.12, 'triangle');
          if (pos === p.answer.length) setTimeout(solved, 350);
        } else {
          wrong();
          pos = 0;
          slots.forEach((s) => { s.textContent = ''; s.classList.remove('filled'); });
        }
      });
      pad.appendChild(b);
    });
    body.append(prog, pad);
  }

  $('#modal-close').addEventListener('click', () => { sfx.tap(); closePuzzle(); });

  // ---------- Gewonnen ----------
  function winAdventure() {
    state.won = true;
    clearTimeout(hintTimer);
    save.data.done[currentAdv.id] = true;
    save.write();
    sfx.win();
    confetti();

    const w = currentWorld;
    const idx = w.adventures.indexOf(currentAdv);
    const next = w.adventures[idx + 1];
    const allDone = WORLDS.every((ww) => ww.adventures.every(isDone));
    let text = currentAdv.outro;
    if (!next && allDone) text += ' 🎉 Wow! Du hast ALLE Welten geschafft!';
    else if (!next) text += ` Die Welt ${w.name} ist geschafft!`;

    setTimeout(() => {
      $('#win-emoji').textContent = !next ? '🏆' : '⭐';
      $('#win-text').textContent = text;
      $('#win-next').hidden = !next;
      $('#win-next').onclick = () => { sfx.tap(); $('#win').hidden = true; startAdventure(next); };
      $('#win').hidden = false;
      if (save.data.voice) speak('Geschafft! ' + text);
    }, 700);
  }

  $('#win-world').addEventListener('click', () => {
    sfx.tap();
    $('#win').hidden = true;
    openWorld(currentWorld);
  });

  function confetti() {
    const box = $('#confetti');
    const bits = ['🎉', '⭐', '✨', '🎊', '💛', '🌟'];
    for (let i = 0; i < 40; i++) {
      const c = document.createElement('i');
      c.textContent = bits[i % bits.length];
      c.style.left = Math.random() * 100 + 'vw';
      c.style.animationDuration = 2 + Math.random() * 2 + 's';
      c.style.animationDelay = Math.random() * 0.8 + 's';
      box.appendChild(c);
      setTimeout(() => c.remove(), 5000);
    }
  }

  // ---------- Navigation & Einstellungen ----------
  document.querySelectorAll('[data-back]').forEach((b) => {
    b.addEventListener('click', () => {
      sfx.tap();
      clearTimeout(hintTimer);
      if (b.dataset.back === 'home') { renderHome(); show('home'); }
      else openWorld(currentWorld);
    });
  });

  $('#btn-sound').addEventListener('click', () => {
    save.data.sound = !save.data.sound;
    save.write();
    renderHome();
    sfx.tap();
  });
  $('#btn-voice').addEventListener('click', () => {
    save.data.voice = !save.data.voice;
    save.write();
    renderHome();
    if (save.data.voice) speak('Ich lese dir jetzt alles vor!');
    else stopSpeaking();
  });
  $('#btn-reset').addEventListener('click', () => {
    if (!confirm('Wirklich alles zurücksetzen? Alle Sterne gehen verloren.')) return;
    save.data.done = {};
    save.write();
    renderHome();
  });

  // iPad: Pinch-Zoom und Doppeltipp-Zoom verhindern
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('dblclick', (e) => e.preventDefault());

  renderHome();

  // ---------- Offline (PWA) ----------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
