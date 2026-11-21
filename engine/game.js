(() => {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const STORE_KEY = 'escape-welten-v2';

  // ---------- iPad: volle Bildschirmhöhe im Home-Bildschirm-Modus ----------
  // iOS meldet als Web-App mit durchsichtiger Statusleiste einen um die Statusleiste zu kurzen
  // Viewport – das ergibt unten einen weißen Balken. Wir nehmen dann die echte Bildschirmhöhe.
  function fixAppHeight() {
    const standalone = window.navigator.standalone === true || matchMedia('(display-mode: standalone)').matches
      || matchMedia('(display-mode: fullscreen)').matches;
    if (!standalone) { document.documentElement.style.removeProperty('--app-h'); return; }
    const landscape = window.innerWidth > window.innerHeight;
    const screenH = landscape ? Math.min(screen.width, screen.height) : Math.max(screen.width, screen.height);
    document.documentElement.style.setProperty('--app-h', Math.max(window.innerHeight, screenH) + 'px');
  }
  fixAppHeight();
  window.addEventListener('resize', fixAppHeight);
  window.addEventListener('orientationchange', () => setTimeout(fixAppHeight, 300));

  // ---------- Speichern ----------
  const save = (() => {
    let data = { done: {}, progress: {}, sound: true, voice: false, music: true };
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) data = Object.assign(data, JSON.parse(raw));
    } catch (e) { /* privat-Modus o.ä. */ }
    return {
      data,
      write() { try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) { /* egal */ } },
    };
  })();

  // ---------- Icons in die Knöpfe ----------
  function fillIcons(root = document) {
    root.querySelectorAll('[data-icon]').forEach((el) => {
      if (!el.firstChild) el.innerHTML = art('icon_' + el.dataset.icon);
    });
  }
  fillIcons();

  // ---------- Klang ----------
  let audioCtx = null;
  function ctx() {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state !== 'running') audioCtx.resume();
    return audioCtx;
  }
  function tone(freqs, dur = 0.12, type = 'sine', gap = 0.09, vol = 0.22) {
    if (!save.data.sound) return;
    try {
      const ac = ctx();
      freqs.forEach((f, i) => {
        const t = ac.currentTime + i * gap;
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = type;
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(ac.destination);
        o.start(t);
        o.stop(t + dur + 0.05);
      });
    } catch (e) { /* kein Audio */ }
  }
  function swish() {
    if (!save.data.sound) return;
    try {
      const ac = ctx();
      const len = ac.sampleRate * 0.25;
      const buf = ac.createBuffer(1, len, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.sin((i / len) * Math.PI) * 0.5;
      const src = ac.createBufferSource();
      const f = ac.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.7;
      const g = ac.createGain(); g.gain.value = 0.35;
      src.buffer = buf;
      src.connect(f).connect(g).connect(ac.destination);
      src.start();
    } catch (e) { /* kein Audio */ }
  }
  const sfx = {
    tap: () => tone([520], 0.06, 'triangle', 0.09, 0.15),
    item: () => tone([660, 880, 1320], 0.14, 'triangle'),
    good: () => tone([523, 659, 784], 0.16, 'sine'),
    bad: () => tone([240, 190], 0.16, 'triangle', 0.12),
    win: () => tone([523, 659, 784, 1047, 784, 1047], 0.2, 'triangle', 0.12),
    light: () => tone([300, 450, 600, 900], 0.15, 'sine', 0.06),
    note: () => tone([880, 1175], 0.1, 'sine', 0.08, 0.15),
    page: swish,
  };

  // ---------- Musik ----------
  const music = createMusic(ctx);
  music.setEnabled(save.data.music);
  // iOS erlaubt Ton erst nach einer Berührung
  document.addEventListener('pointerdown', () => music.kick(), true);
  document.addEventListener('visibilitychange', () => {
    if (!audioCtx) return;
    if (document.hidden) audioCtx.suspend().catch(() => {});
    else audioCtx.resume().catch(() => {});
  });

  // ---------- Vorlesen ----------
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
    const u = new SpeechSynthesisUtterance(text.replace(/[„“"»«]/g, ''));
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
  let state = null;
  let winTimer = null;

  const isDone = (adv) => !!save.data.done[adv.id];
  const isUnlocked = (w, i) => i === 0 || isDone(w.adventures[i - 1]);

  function starsHtml(n, total) {
    let s = '';
    for (let i = 0; i < total; i++) s += `<span>${art(i < n ? 'icon_star' : 'icon_star_empty')}</span>`;
    return `<div class="stars">${s}</div>`;
  }

  function renderHome() {
    const list = $('#world-list');
    list.innerHTML = '';
    WORLDS.forEach((w) => {
      const n = w.adventures.filter(isDone).length;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'world-card';
      b.innerHTML = `<div class="pic">${art(w.cover)}</div><div class="name">${w.name}</div>${starsHtml(n, w.adventures.length)}`;
      b.addEventListener('click', () => { sfx.page(); openWorld(w); });
      list.appendChild(b);
    });
    music.want('home');
    $('#btn-music').textContent = save.data.music ? 'Musik: an' : 'Musik: aus';
    $('#btn-sound').textContent = save.data.sound ? 'Töne: an' : 'Töne: aus';
    $('#btn-voice').textContent = save.data.voice ? 'Vorlesen: an' : 'Vorlesen: aus';
  }

  /** Vorschaubild: Startseite eines Kapitels mit allen sichtbaren Objekten */
  function miniScene(adv) {
    const page = adv.pages[adv.start];
    if (!page) return art(adv.thumb);
    const objs = page.objects.filter((o) => !o.hidden).map((o) =>
      `<div class="mini-obj" style="left:${o.x}%;top:${o.y}%;width:${o.w}%;${o.rot ? `rotate:${o.rot}deg;` : ''}">${art(o.art)}</div>`).join('');
    return `<div class="mini">${art(page.bg)}${objs}</div>`;
  }

  function openWorld(w) {
    currentWorld = w;
    music.want(w.id);
    $('#world-title').textContent = w.name;
    const list = $('#adventure-list');
    list.innerHTML = '';
    w.adventures.forEach((adv, i) => {
      const unlocked = isUnlocked(w, i);
      const inProgress = !!save.data.progress[adv.id];
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'adv-card' + (unlocked ? '' : ' locked');
      const status = isDone(adv) ? 'Geschafft! Nochmal spielen?'
        : inProgress ? 'Weiterspielen …' : unlocked ? 'Los geht’s!' : 'Noch verschlossen';
      b.innerHTML = `
        <div class="pic">${miniScene(adv)}${unlocked ? '' : `<span class="lock">${art('icon_lock')}</span>`}</div>
        <div class="chapter">Kapitel ${i + 1}</div>
        <div class="name">${adv.title}</div>
        <div class="state">${status}</div>
        ${isDone(adv) ? `<span class="badge">${art('icon_star')}</span>` : ''}`;
      b.addEventListener('click', () => {
        if (!unlocked) { sfx.bad(); return; }
        sfx.page();
        startAdventure(adv);
      });
      list.appendChild(b);
    });
    show('world');
  }

  // ---------- Spielzustand ----------
  function freshState(adv) {
    return { page: adv.start, inv: [], done: [], removed: [], revealed: [], hidden: [], lit: [], visited: [], notes: [], become: {} };
  }
  const has = (list, x) => state[list].includes(x);
  const add = (list, x) => { if (!state[list].includes(x)) state[list].push(x); };
  function persist() {
    if (!currentAdv || !state || state.won) return;
    save.data.progress[currentAdv.id] = state;
    save.write();
  }

  function allObjects(adv) {
    const out = [];
    Object.entries(adv.pages).forEach(([pid, p]) => p.objects.forEach((o) => out.push({ ...o, _page: pid })));
    return out;
  }
  function findObj(id) {
    for (const p of Object.values(currentAdv.pages)) {
      const o = p.objects.find((x) => x.id === id);
      if (o) return o;
    }
    return null;
  }

  // ---------- Spiel ----------
  const scene = $('#scene');
  const objLayer = $('#objects');
  const darkness = $('#darkness');
  const bubble = $('#bubble');
  let objEls = new Map();
  let selected = null;

  function startAdventure(adv) {
    currentAdv = adv;
    if (!currentWorld || !currentWorld.adventures.includes(adv)) currentWorld = WORLDS.find((w) => w.adventures.includes(adv));
    music.want(currentWorld.id);
    clearTimeout(winTimer);
    closePuzzle();
    selected = null;
    const saved = save.data.progress[adv.id];
    state = saved && adv.pages[saved.page] ? Object.assign(freshState(adv), saved) : freshState(adv);
    $('#game-title').textContent = adv.title;
    show('game');
    renderPage(false);
    renderInventory();
    renderNotesCount();
    resetHintTimer();
    say(saved ? 'Willkommen zurück! Weiter geht’s.' : adv.intro);
    if (!saved) persist();
  }

  function restartAdventure(adv) {
    delete save.data.progress[adv.id];
    save.write();
  }

  function goto(pid) {
    if (!currentAdv.pages[pid]) return;
    sfx.page();
    scene.classList.remove('flip-in');
    scene.classList.add('flip-out');
    setTimeout(() => {
      state.page = pid;
      persist();
      scene.classList.remove('flip-out');
      renderPage(true);
      void scene.offsetWidth;
      scene.classList.add('flip-in');
    }, 200);
  }

  function renderPage(announce) {
    const page = currentAdv.pages[state.page];
    $('#scene-bg').innerHTML = art(page.bg);
    $('#page-label').textContent = page.name;
    objLayer.innerHTML = '';
    objEls = new Map();

    const objs = [...page.objects];
    if (page.back) {
      objs.push({ id: '_back', art: 'nav_left', x: 7, y: 91, w: 9, name: 'Zurück', goto: page.back });
    }
    objs.forEach((o) => {
      if (has('removed', o.id)) return;
      const el = document.createElement(o.static ? 'div' : 'button');
      if (!o.static) el.type = 'button';
      const isNav = o.goto && !o.needs && !o.puzzle && !o.after;
      el.className = 'obj' + (o.static ? ' static' : ' tap') + (o.glow ? ' glow' : '') + (isNav && /^nav_|^zoom/.test(o.art) ? ' nav' : '');
      el.style.left = o.x + '%';
      el.style.top = o.y + '%';
      el.style.width = o.w + '%';
      if (o.z) el.style.zIndex = o.z;
      if (o.rot) el.style.rotate = o.rot + 'deg';
      el.innerHTML = art(state.become[o.id] || o.art);
      if (el.querySelector('.eye')) {
        el.classList.add('alive');
        el.style.setProperty('--breathe-delay', (-Math.random() * 4).toFixed(2) + 's');
      }
      if (o.name) el.setAttribute('aria-label', o.name);
      if ((o.hidden && !has('revealed', o.id)) || has('hidden', o.id)) el.hidden = true;
      if (!o.static) {
        el.addEventListener('click', (ev) => { ev.stopPropagation(); tapObject(o); });
        el.addEventListener('animationend', (ev) => {
          if (ev.animationName === 'wiggle' || ev.animationName === 'appearObj') el.classList.remove('wiggle', 'appear');
        });
      }
      objLayer.appendChild(el);
      objEls.set(o.id, el);
    });

    renderFx(page.fx);

    // Dunkelheit
    const dark = page.dark && !has('lit', state.page);
    darkness.classList.add('instant');
    darkness.classList.toggle('on', !!dark);
    darkness.classList.remove('fade');
    void darkness.offsetWidth;
    darkness.classList.remove('instant');
    const glowObj = page.objects.find((o) => o.glow);
    if (glowObj) {
      darkness.style.setProperty('--lx', glowObj.x + '%');
      darkness.style.setProperty('--ly', glowObj.y + '%');
    }

    if (announce && !has('visited', state.page) && page.enter) say(page.enter);
    add('visited', state.page);
  }

  // ---------- Stimmungs-Effekte (Schnee, Staub, Glitzer, Sterne, Blasen) ----------
  const FX_COUNT = { snow: 42, dust: 18, glitter: 16, stars: 22, bubbles: 14, warm: 12, heat: 16 };
  function renderFx(kind) {
    const box = $('#fx');
    box.innerHTML = '';
    box.className = 'fx' + (kind ? ' fx-' + kind : '');
    if (!kind || !FX_COUNT[kind]) return;
    const r = (a, b) => a + Math.random() * (b - a);
    const colors = ['#ff9fb2', '#9fd8ff', '#c9a4ff', '#ffd36b', '#9ff0c8'];
    let html = '';
    for (let i = 0; i < FX_COUNT[kind]; i++) {
      const size = kind === 'bubbles' ? r(2, 5) : kind === 'snow' ? r(.5, 1.3) : kind === 'glitter' ? r(1.2, 2.6) : kind === 'stars' ? r(.8, 1.8) : r(.35, .9);
      const top = kind === 'stars' ? r(2, 55) : kind === 'snow' ? -5 : r(5, 95);
      const style = [
        `left:${r(0, 100).toFixed(1)}%`, `top:${top.toFixed(1)}%`,
        `--s:${size.toFixed(2)}`, `--dur:${r(kind === 'snow' ? 7 : 3, kind === 'snow' ? 14 : 9).toFixed(1)}s`,
        `--delay:${(-r(0, 14)).toFixed(1)}s`, `--dx:${r(-6, 6).toFixed(1)}`,
        kind === 'bubbles' ? `--c:${colors[i % colors.length]}` : '',
      ].join(';');
      html += `<i style="${style}"></i>`;
    }
    box.innerHTML = html;
  }

  // Zufällig blinzeln – immer nur kurz eine Figur, spart Akku
  setInterval(() => {
    if (!$('#screen-game').classList.contains('active') || document.hidden) return;
    const alive = [...objLayer.querySelectorAll('.obj.alive:not([hidden])')];
    if (!alive.length) return;
    const el = alive[Math.floor(Math.random() * alive.length)];
    el.classList.add('blink');
    setTimeout(() => el.classList.remove('blink'), 260);
  }, 1700);

  function say(text, autoSpeak = true) {
    $('#bubble-text').textContent = text;
    bubble.classList.remove('flash');
    void bubble.offsetWidth;
    bubble.classList.add('flash');
    if (save.data.voice && autoSpeak) speak(text);
  }

  const itemName = (id) => currentAdv.items[id]?.name || id;
  function listItems(ids) {
    const counts = new Map();
    ids.forEach((id) => counts.set(itemName(id), (counts.get(itemName(id)) || 0) + 1));
    const parts = [...counts].map(([k, n]) => (n > 1 ? `${n} × ${k}` : k));
    return parts.length > 1 ? parts.slice(0, -1).join(', ') + ' und ' + parts[parts.length - 1] : parts[0];
  }

  function addNote(o) {
    if (!o.note || state.notes.some((n) => n.id === o.id)) return false;
    state.notes.push({ id: o.id, text: o.note, page: currentAdv.pages[state.page].name });
    renderNotesCount(true);
    sfx.note();
    return true;
  }

  function tapObject(o) {
    if (state.won) return;
    resetHintTimer();
    deselect();
    const el = objEls.get(o.id);

    // reine Navigation oder schon erledigte Tür
    const pureNav = o.goto && !o.needs && !o.puzzle && !o.after && !o.give && !o.win;
    if (pureNav || (o.goto && has('done', o.id))) {
      goto(o.goto);
      return;
    }

    if (has('done', o.id)) {
      sfx.tap();
      wiggle(el);
      say(o.doneText || o.say || o.name);
      return;
    }

    if (o.after && o.after.length) {
      const open = o.after.filter((id) => !has('done', id));
      if (open.length) {
        sfx.bad();
        wiggle(el);
        say(o.afterText || o.needText || o.say || 'Das geht noch nicht.');
        if (addNote(o)) persist();
        return;
      }
    }

    if (o.needs && o.needs.length) {
      const missing = o.needs.filter((n) => !state.inv.includes(n));
      if (missing.length) {
        sfx.bad();
        wiggle(el);
        const hasSome = missing.length < o.needs.length;
        say(o.needText && !hasSome ? o.needText : `${o.name}: Es fehlt noch: ${listItems(missing)}.`);
        if (addNote(o)) persist();
        return;
      }
    }

    if (o.puzzle) {
      sfx.tap();
      openPuzzle(o.puzzle, () => complete(o));
      return;
    }

    // Hinweis-Objekt ohne Wirkung
    if (!o.give && !o.reveal && !o.hide && !o.remove && !o.light && !o.win && !o.needs && !o.become && !o.after) {
      sfx.tap();
      wiggle(el);
      say(o.say || o.name);
      if (addNote(o)) persist();
      return;
    }

    complete(o);
  }

  function complete(o) {
    const el = objEls.get(o.id);
    (o.needs || []).forEach((n) => {
      const i = state.inv.indexOf(n);
      if (i >= 0) state.inv.splice(i, 1);
    });
    add('done', o.id);
    addNote(o);

    if (o.light) {
      add('lit', state.page);
      darkness.classList.add('fade');
      sfx.light();
    }
    if (o.become) {
      state.become[o.id] = o.become;
      if (el) el.innerHTML = art(o.become);
    }
    if (o.remove) {
      add('removed', o.id);
      if (el) el.classList.add('gone');
    } else if (el) {
      wiggle(el);
    }
    (o.reveal || []).forEach((id) => {
      add('revealed', id);
      state.hidden = state.hidden.filter((x) => x !== id);
      const r = objEls.get(id);
      if (r) { r.hidden = false; r.classList.add('appear'); }
    });
    (o.hide || []).forEach((id) => {
      add('hidden', id);
      const r = objEls.get(id);
      if (r) r.hidden = true;
    });
    const gives = [].concat(o.give || []);
    gives.forEach((g) => state.inv.push(g));
    if (gives.length) sfx.item();
    else if (!o.light && !o.win) sfx.good();
    renderInventory(gives);

    if (o.win) {
      winAdventure();
      return;
    }
    persist();
    if (o.okText) say(o.okText);
    if (o.goto) setTimeout(() => goto(o.goto), o.okText ? 900 : 0);
  }

  function wiggle(el) {
    if (!el) return;
    el.classList.remove('wiggle');
    void el.offsetWidth;
    el.classList.add('wiggle');
  }

  // ---------- Rucksack & Kombinieren ----------
  function renderInventory(fresh = []) {
    const box = $('#inventory');
    box.innerHTML = '';
    state.inv.forEach((id, idx) => {
      const it = currentAdv.items[id];
      if (!it) return;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'inv-item' + (fresh.includes(id) ? ' new' : '') + (selected === idx ? ' selected' : '');
      b.innerHTML = art(it.art);
      b.setAttribute('aria-label', it.name);
      b.addEventListener('click', () => tapItem(idx));
      box.appendChild(b);
    });
  }

  function deselect() {
    if (selected === null) return;
    selected = null;
    renderInventory();
  }

  function tapItem(idx) {
    resetHintTimer();
    const id = state.inv[idx];
    if (selected === null) {
      selected = idx;
      sfx.tap();
      renderInventory();
      const canCombine = (currentAdv.combos || []).length > 0;
      say(`${itemName(id)}.` + (canCombine ? ' Tippe auf ein anderes Ding im Rucksack, um beides zu verbinden.' : ''));
      return;
    }
    if (selected === idx) { deselect(); sfx.tap(); return; }

    const other = state.inv[selected];
    const combo = (currentAdv.combos || []).find((c) => (c.a === id && c.b === other) || (c.a === other && c.b === id));
    selected = null;
    if (!combo) {
      sfx.bad();
      renderInventory();
      say(`${itemName(other)} und ${itemName(id)} passen nicht zusammen.`);
      return;
    }
    [combo.a, combo.b].forEach((n) => state.inv.splice(state.inv.indexOf(n), 1));
    state.inv.push(combo.gives);
    add('done', 'combo:' + combo.gives);
    sfx.item();
    renderInventory([combo.gives]);
    say(combo.text || `Du hast ${itemName(combo.gives)} gebaut!`);
    persist();
  }

  darkness.addEventListener('click', () => {
    sfx.bad();
    say('Es ist viel zu dunkel! Suche etwas, das leuchtet.');
  });

  // ---------- Notizbuch ----------
  function renderNotesCount(bump) {
    const c = $('#notes-count');
    c.hidden = !state.notes.length;
    c.textContent = state.notes.length;
    if (bump) {
      const b = $('#btn-notes');
      b.classList.remove('bump');
      void b.offsetWidth;
      b.classList.add('bump');
    }
  }
  $('#btn-notes').addEventListener('click', () => {
    sfx.page();
    const ul = $('#notes-list');
    ul.innerHTML = state.notes.length
      ? state.notes.map((n) => `<li><span class="pin">${art('icon_pin')}</span><span>${n.text}<span class="from">gefunden: ${n.page}</span></span></li>`).join('')
      : '<li class="empty">Noch leer. Schau dich gut um – wichtige Hinweise schreibe ich hier auf!</li>';
    $('#notes').hidden = false;
  });
  $('#notes-close').addEventListener('click', () => { sfx.tap(); $('#notes').hidden = true; });
  $('#notes').addEventListener('click', (e) => { if (e.target.id === 'notes') $('#notes').hidden = true; });

  // ---------- Tipps ----------
  let hintTimer = null;
  function resetHintTimer() {
    clearTimeout(hintTimer);
    $('#btn-hint').classList.remove('pulse');
    hintTimer = setTimeout(() => $('#btn-hint').classList.add('pulse'), 60000);
  }
  $('#btn-hint').addEventListener('click', () => {
    if (!currentAdv || state.won) return;
    resetHintTimer();
    sfx.tap();
    const h = currentAdv.hints.find((x) => !has('done', x.until) && !state.notes.some((n) => n.id === x.until));
    say(h ? h.text : 'Schau dich gut um und tippe alles an!');
  });
  $('#bubble-say').addEventListener('click', () => speak($('#bubble-text').textContent));

  // ---------- Rätsel ----------
  const modal = $('#modal');
  const modalCard = modal.querySelector('.modal-card');
  let onSolved = null;
  let puzzleRun = 0;
  let puzzleTimer = null;

  function solveLater(ms) {
    const run = puzzleRun;
    clearTimeout(puzzleTimer);
    puzzleTimer = setTimeout(() => { if (run === puzzleRun) solved(); }, ms);
  }
  function openPuzzle(p, cb) {
    puzzleRun++;
    clearTimeout(puzzleTimer);
    onSolved = cb;
    $('#modal-prompt').textContent = p.prompt;
    const body = $('#modal-body');
    body.innerHTML = '';
    ({ code: buildCode, choice: buildChoice, sequence: buildSequence, wheels: buildWheels })[p.type](p, body);
    modal.hidden = false;
    if (save.data.voice) speak(p.prompt);
  }
  function closePuzzle() {
    puzzleRun++;
    clearTimeout(puzzleTimer);
    modal.hidden = true;
    onSolved = null;
    stopSpeaking();
  }
  function solved() {
    const cb = onSolved;
    closePuzzle();
    if (cb) cb();
  }
  function wrong() {
    sfx.bad();
    modalCard.classList.remove('shake');
    void modalCard.offsetWidth;
    modalCard.classList.add('shake');
  }

  /** Darstellung einer Antwort-Option: {art}, {color} oder {text} */
  function optHtml(opt, withLabel = true) {
    let inner;
    if (opt.art) inner = `<span class="opt-art">${art(opt.art)}</span>`;
    else if (opt.color) inner = `<span class="swatch" style="background:${opt.color}"></span>`;
    else inner = `<span class="big-text">${opt.text}</span>`;
    return inner + (withLabel && opt.label ? `<span class="opt-text">${opt.label}</span>` : '');
  }

  function buildCode(p, body) {
    let entry = '';
    let locked = false;
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
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'].forEach((k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = k;
      if (k === '✓') b.className = 'ok';
      b.addEventListener('click', () => {
        if (locked) return;
        if (k === '⌫') { entry = entry.slice(0, -1); sfx.tap(); }
        else if (k === '✓') {
          if (entry === p.answer) { locked = true; return solveLater(0); }
          wrong();
          entry = '';
        } else if (entry.length < p.answer.length) {
          entry += k;
          sfx.tap();
          if (entry.length === p.answer.length) {
            draw();
            locked = true;
            if (entry === p.answer) { solveLater(300); return; }
            const run = puzzleRun;
            setTimeout(() => { if (run !== puzzleRun) return; wrong(); entry = ''; locked = false; draw(); }, 300);
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
    let locked = false;
    const wrap = document.createElement('div');
    wrap.className = 'choices';
    p.options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = optHtml(opt);
      b.addEventListener('click', () => {
        if (locked) return;
        if (i === p.answer) { locked = true; sfx.good(); solveLater(250); } else wrong();
      });
      wrap.appendChild(b);
    });
    body.appendChild(wrap);
  }

  function buildSequence(p, body) {
    let pos = 0;
    const prog = document.createElement('div');
    prog.className = 'seq-progress';
    const slots = p.answer.map(() => { const s = document.createElement('span'); prog.appendChild(s); return s; });
    const pad = document.createElement('div');
    pad.className = 'seq-pad';
    p.options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = optHtml(opt);
      b.addEventListener('click', () => {
        if (pos >= p.answer.length) return;
        if (i === p.answer[pos]) {
          slots[pos].innerHTML = optHtml(opt, false);
          slots[pos].classList.add('filled');
          pos++;
          tone([440 + pos * 110], 0.12, 'triangle');
          if (pos === p.answer.length) solveLater(400);
        } else {
          wrong();
          pos = 0;
          slots.forEach((s) => { s.innerHTML = ''; s.classList.remove('filled'); });
        }
      });
      pad.appendChild(b);
    });
    body.append(prog, pad);
  }

  function buildWheels(p, body) {
    const wheels = p.wheels || p.answer.map(() => p.options);
    const pos = wheels.map(() => 0);
    let locked = false;
    const wrap = document.createElement('div');
    wrap.className = 'wheels';
    wheels.forEach((opts, wi) => {
      const col = document.createElement('div');
      col.className = 'wheel';
      const up = document.createElement('button');
      up.type = 'button'; up.textContent = '▲'; up.setAttribute('aria-label', 'hoch');
      const face = document.createElement('div');
      face.className = 'face';
      const down = document.createElement('button');
      down.type = 'button'; down.textContent = '▼'; down.setAttribute('aria-label', 'runter');
      const drawFace = () => {
        face.innerHTML = optHtml(opts[pos[wi]], false);
        face.classList.remove('turn'); void face.offsetWidth; face.classList.add('turn');
      };
      up.addEventListener('click', () => { if (locked) return; pos[wi] = (pos[wi] + opts.length - 1) % opts.length; sfx.tap(); drawFace(); });
      down.addEventListener('click', () => { if (locked) return; pos[wi] = (pos[wi] + 1) % opts.length; sfx.tap(); drawFace(); });
      drawFace();
      col.append(up, face, down);
      wrap.appendChild(col);
    });
    const ok = document.createElement('button');
    ok.type = 'button';
    ok.className = 'chip primary';
    ok.textContent = p.button || 'Öffnen';
    ok.addEventListener('click', () => {
      if (locked) return;
      if (pos.every((v, i) => v === p.answer[i])) { locked = true; sfx.good(); solveLater(250); } else wrong();
    });
    body.append(wrap, ok);
  }

  $('#modal-close').addEventListener('click', () => { sfx.tap(); closePuzzle(); });

  // ---------- Gewonnen ----------
  function winAdventure() {
    state.won = true;
    clearTimeout(hintTimer);
    save.data.done[currentAdv.id] = true;
    delete save.data.progress[currentAdv.id];
    save.write();
    sfx.win();
    confetti();

    const w = currentWorld;
    const idx = w.adventures.indexOf(currentAdv);
    const next = w.adventures[idx + 1];
    const allDone = WORLDS.every((ww) => ww.adventures.every(isDone));
    let text = currentAdv.outro;
    if (!next && allDone) text += ' Wahnsinn – du hast ALLE Welten geschafft!';
    else if (!next) text += ` Die Welt „${w.name}“ ist komplett geschafft!`;

    const wonAdv = currentAdv;
    clearTimeout(winTimer);
    winTimer = setTimeout(() => {
      if (currentAdv !== wonAdv || !$('#screen-game').classList.contains('active')) return;
      $('#win-art').innerHTML = art(!next ? 'trophy' : 'icon_star');
      $('#win-text').textContent = text;
      $('#win-next').hidden = !next;
      $('#win-next').onclick = () => { sfx.page(); $('#win').hidden = true; startAdventure(next); };
      $('#win').hidden = false;
      if (save.data.voice) speak('Geschafft! ' + text);
    }, 800);
  }
  $('#win-world').addEventListener('click', () => {
    sfx.tap();
    $('#win').hidden = true;
    openWorld(currentWorld);
  });

  function confetti() {
    const box = $('#confetti');
    const colors = ['#f2b544', '#d9573b', '#6fa8dc', '#7fb069', '#f4a6a0', '#b48ad6'];
    for (let i = 0; i < 46; i++) {
      const c = document.createElement('i');
      c.style.background = colors[i % colors.length];
      c.style.left = Math.random() * 100 + 'vw';
      c.style.animationDuration = 2.2 + Math.random() * 2 + 's';
      c.style.animationDelay = Math.random() * 0.8 + 's';
      box.appendChild(c);
      setTimeout(() => c.remove(), 5500);
    }
  }

  // ---------- Navigation & Einstellungen ----------
  document.querySelectorAll('[data-back]').forEach((b) => {
    b.addEventListener('click', () => {
      sfx.page();
      clearTimeout(hintTimer);
      clearTimeout(winTimer);
      closePuzzle();
      if (b.dataset.back === 'home') { renderHome(); show('home'); }
      else openWorld(currentWorld);
    });
  });

  $('#btn-music').addEventListener('click', () => {
    save.data.music = !save.data.music;
    save.write();
    music.setEnabled(save.data.music);
    renderHome();
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
    if (!confirm('Wirklich alles zurücksetzen? Alle Sterne und Spielstände gehen verloren.')) return;
    save.data.done = {};
    save.data.progress = {};
    save.write();
    renderHome();
  });

  // Abenteuer neu beginnen: lange auf die Karte drücken
  let pressTimer = null;
  $('#adventure-list').addEventListener('pointerdown', (e) => {
    const card = e.target.closest('.adv-card');
    if (!card) return;
    const idx = [...card.parentNode.children].indexOf(card);
    const adv = currentWorld.adventures[idx];
    if (!save.data.progress[adv.id]) return;
    pressTimer = setTimeout(() => {
      if (confirm(`„${adv.title}“ von vorn beginnen?`)) { restartAdventure(adv); openWorld(currentWorld); }
    }, 900);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => $('#adventure-list').addEventListener(t, () => clearTimeout(pressTimer)));

  // iPad: Zoom-Gesten verhindern
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('dblclick', (e) => e.preventDefault());

  // Für Tests
  window.__escape = { get state() { return state; }, startAdventure, goto, allObjects, findObj, music, get audio() { return audioCtx; } };

  renderHome();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
