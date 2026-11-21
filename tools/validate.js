#!/usr/bin/env node
/*
 * Prüft alle Welten: fehlende Bilder, kaputte Verweise, ungültige Rätsel – und spielt jedes
 * Abenteuer automatisch durch (Löser), um sicherzugehen, dass es lösbar ist.
 *
 *   node tools/validate.js            alle Welten
 *   node tools/validate.js weltraum   nur eine Welt
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const ctx = { console };
vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8') + '\n;this.ART = ART; this.WORLDS = WORLDS;', ctx, { filename: f });
load('engine/art-common.js');
for (const f of fs.readdirSync(path.join(root, 'worlds')).sort()) {
  if (f.endsWith('.js')) load('worlds/' + f);
}
const { ART, WORLDS } = ctx;
const only = process.argv[2];

let errors = 0;
const err = (where, msg) => { errors++; console.log(`  ✗ ${where}: ${msg}`); };
const KNOWN = new Set(['id', 'art', 'x', 'y', 'w', 'name', 'static', 'hidden', 'glow', 'say', 'note', 'needs', 'needText', 'after', 'afterText',
  'puzzle', 'give', 'okText', 'doneText', 'reveal', 'hide', 'remove', 'become', 'light', 'goto', 'win', 'z', 'rot']);

function checkArt(where, name) {
  if (!ART[name]) return err(where, `Bild "${name}" fehlt`);
  const a = ART[name];
  if (!Array.isArray(a.vb) || a.vb.length !== 2) err(where, `Bild "${name}" hat kein vb [w,h]`);
  if (typeof a.svg !== 'string' || !a.svg.trim()) err(where, `Bild "${name}" hat kein svg`);
  // grobe Wohlgeformtheit
  const open = (a.svg.match(/<(?!\/)[a-zA-Z][^>]*[^/]>/g) || []).filter((t) => !/^<(path|circle|ellipse|rect|line|polyline|polygon|stop|use|image)\b/.test(t)).length;
  const close = (a.svg.match(/<\/[a-zA-Z]+>/g) || []).length;
  if (open !== close) err(where, `Bild "${name}": ${open} öffnende vs ${close} schließende Tags`);
}

function checkPuzzle(where, p) {
  if (!p.prompt) err(where, 'Rätsel ohne prompt');
  const optCheck = (o, w2) => {
    if (!o || (!o.art && !o.color && o.text === undefined)) err(w2, 'Option braucht art, color oder text');
    if (o && o.art) checkArt(w2, o.art);
  };
  switch (p.type) {
    case 'code':
      if (!/^\d+$/.test(p.answer || '')) err(where, 'code: answer muss Ziffern-String sein');
      break;
    case 'choice':
      (p.options || []).forEach((o, i) => optCheck(o, `${where} Option ${i}`));
      if (!(p.answer >= 0 && p.answer < (p.options || []).length)) err(where, 'choice: answer außerhalb');
      break;
    case 'sequence':
      (p.options || []).forEach((o, i) => optCheck(o, `${where} Option ${i}`));
      if (!Array.isArray(p.answer) || p.answer.some((a) => !(a >= 0 && a < p.options.length))) err(where, 'sequence: answer ungültig');
      break;
    case 'wheels': {
      const wheels = p.wheels || (p.answer || []).map(() => p.options);
      if (!Array.isArray(p.answer) || p.answer.length !== wheels.length) err(where, 'wheels: answer-Länge passt nicht');
      wheels.forEach((opts, wi) => {
        (opts || []).forEach((o, i) => optCheck(o, `${where} Rad ${wi} Option ${i}`));
        if (!(p.answer[wi] >= 0 && p.answer[wi] < (opts || []).length)) err(where, `wheels: answer[${wi}] außerhalb`);
      });
      if (p.answer && p.answer.every((a) => a === 0)) err(where, 'wheels: Lösung ist die Startstellung (alles 0) – zu einfach');
      break;
    }
    default: err(where, `unbekannter Rätseltyp ${p.type}`);
  }
}

function solve(adv) {
  // Spielt das Abenteuer so durch, wie ein Kind es könnte (ohne Raten).
  const st = { page: adv.start, inv: [], done: new Set(), removed: new Set(), revealed: new Set(), hidden: new Set(), lit: new Set(), reach: new Set([adv.start]) };
  const objs = [];
  for (const [pid, p] of Object.entries(adv.pages)) {
    for (const o of p.objects) objs.push({ o, pid });
    if (p.back) objs.push({ o: { id: `_back_${pid}`, goto: p.back }, pid });
  }
  const log = [];
  let won = false;
  for (let round = 0; round < 200 && !won; round++) {
    let progress = false;
    // Kombinieren
    for (const c of adv.combos || []) {
      const ia = st.inv.indexOf(c.a), ib = st.inv.indexOf(c.b);
      if (ia >= 0 && ib >= 0 && (c.a !== c.b || st.inv.filter((x) => x === c.a).length > 1)) {
        st.inv.splice(st.inv.indexOf(c.a), 1); st.inv.splice(st.inv.indexOf(c.b), 1);
        st.inv.push(c.gives); st.done.add('combo:' + c.gives); log.push(`kombiniert → ${c.gives}`); progress = true;
      }
    }
    for (const { o, pid } of objs) {
      if (!st.reach.has(pid) || o.static) continue;
      if (st.removed.has(o.id) || st.hidden.has(o.id) || (o.hidden && !st.revealed.has(o.id))) continue;
      const page = adv.pages[pid];
      const dark = page.dark && !st.lit.has(pid);
      if (dark && !o.glow) continue;
      const pureNav = o.goto && !o.needs && !o.puzzle && !o.after && !o.give && !o.win;
      if (pureNav || (o.goto && st.done.has(o.id))) {
        if (!st.reach.has(o.goto)) { st.reach.add(o.goto); progress = true; log.push(`→ Seite ${o.goto}`); }
        continue;
      }
      if (st.done.has(o.id)) continue;
      const hasEffect = o.give || o.reveal || o.hide || o.remove || o.light || o.win || o.needs || o.become || o.after || o.puzzle || o.goto;
      if (!hasEffect) continue;
      if (o.after && o.after.some((id) => !st.done.has(id))) continue;
      if (o.needs) {
        const tmp = [...st.inv];
        let ok = true;
        for (const n of o.needs) { const i = tmp.indexOf(n); if (i < 0) { ok = false; break; } tmp.splice(i, 1); }
        if (!ok) continue;
        st.inv = tmp;
      }
      st.done.add(o.id);
      if (o.light) st.lit.add(pid);
      if (o.remove) st.removed.add(o.id);
      (o.reveal || []).forEach((id) => { st.revealed.add(id); st.hidden.delete(id); });
      (o.hide || []).forEach((id) => st.hidden.add(id));
      [].concat(o.give || []).forEach((g) => st.inv.push(g));
      if (o.goto) st.reach.add(o.goto);
      log.push(`${pid}/${o.id}${o.give ? ' +' + [].concat(o.give).join('+') : ''}`);
      progress = true;
      if (o.win) { won = true; break; }
    }
    if (!progress) break;
  }
  return { won, log, st };
}

for (const w of WORLDS) {
  if (only && w.id !== only) continue;
  console.log(`\nWelt ${w.name} (${w.id})`);
  checkArt(`${w.id} cover`, w.cover);
  if (w.adventures.length !== 3) err(w.id, `soll 3 Abenteuer haben, hat ${w.adventures.length}`);
  for (const adv of w.adventures) {
    const where = `${w.id}/${adv.id}`;
    ['id', 'title', 'thumb', 'intro', 'outro', 'start', 'items', 'pages', 'hints'].forEach((k) => { if (!adv[k]) err(where, `fehlt: ${k}`); });
    checkArt(`${where} thumb`, adv.thumb);
    const pageIds = Object.keys(adv.pages || {});
    if (!adv.pages[adv.start]) err(where, `Startseite ${adv.start} fehlt`);
    if (pageIds.length < 3) err(where, `nur ${pageIds.length} Seiten – mindestens 3 für ein Escape-Buch`);
    for (const [id, it] of Object.entries(adv.items || {})) {
      if (!it.name) err(`${where} item ${id}`, 'name fehlt');
      checkArt(`${where} item ${id}`, it.art);
    }
    const ids = new Set();
    const all = [];
    for (const [pid, p] of Object.entries(adv.pages)) {
      if (!p.name) err(`${where}/${pid}`, 'Seite ohne name');
      checkArt(`${where}/${pid} bg`, p.bg);
      if (ART[p.bg] && !ART[p.bg].bg) err(`${where}/${pid}`, `Hintergrund ${p.bg} braucht bg:true`);
      if (p.back && !adv.pages[p.back]) err(`${where}/${pid}`, `back → ${p.back} fehlt`);
      for (const o of p.objects) {
        const ow = `${where}/${pid}/${o.id}`;
        if (!o.id) err(ow, 'Objekt ohne id');
        if (ids.has(o.id)) err(ow, 'doppelte id');
        ids.add(o.id);
        all.push(o);
        Object.keys(o).forEach((k) => { if (!KNOWN.has(k)) err(ow, `unbekanntes Feld "${k}"`); });
        checkArt(ow, o.art);
        if (o.become) checkArt(ow + ' become', o.become);
        if (!(o.x >= 0 && o.x <= 100 && o.y >= 0 && o.y <= 100 && o.w > 0 && o.w <= 100)) err(ow, 'x/y/w ungültig');
        if (!o.static && !o.name) err(ow, 'antippbares Objekt ohne name');
        if (o.goto && !adv.pages[o.goto]) err(ow, `goto → ${o.goto} fehlt`);
        [].concat(o.needs || [], o.give || []).forEach((it) => { if (!adv.items[it]) err(ow, `Gegenstand ${it} unbekannt`); });
        if (o.puzzle) checkPuzzle(ow, o.puzzle);
        if (!o.static && !o.say && !o.puzzle && !o.goto && !o.okText && !o.win && !o.needText) err(ow, 'Objekt sagt nichts (say/okText fehlt)');
      }
    }
    for (const o of all) {
      [...(o.reveal || []), ...(o.hide || []), ...(o.after || [])].forEach((id) => { if (!ids.has(id)) err(`${where}/${o.id}`, `Verweis auf unbekanntes Objekt ${id}`); });
    }
    (adv.combos || []).forEach((c) => [c.a, c.b, c.gives].forEach((it) => { if (!adv.items[it]) err(`${where} combo`, `Gegenstand ${it} unbekannt`); }));
    (adv.hints || []).forEach((h) => {
      if (!ids.has(h.until) && !(h.until.startsWith('combo:') && (adv.combos || []).some((c) => 'combo:' + c.gives === h.until))) err(`${where} hint`, `until ${h.until} unbekannt`);
    });
    if (!all.some((o) => o.win)) err(where, 'kein Objekt mit win');
    const notes = all.filter((o) => o.note).length;
    const puzzles = all.filter((o) => o.puzzle).length;

    const r = solve(adv);
    if (!r.won) {
      err(where, 'NICHT LÖSBAR. Bis hier gekommen:\n      ' + r.log.join('\n      ') + `\n      Rucksack: ${r.st.inv.join(', ')}`);
    } else {
      const unreached = pageIds.filter((p) => !r.st.reach.has(p));
      if (unreached.length) err(where, `Seiten nie erreicht: ${unreached.join(', ')}`);
      console.log(`  ✓ ${adv.title}: lösbar in ${r.log.length} Schritten · ${pageIds.length} Seiten · ${puzzles} Rätsel · ${notes} Notizen · ${(adv.combos || []).length} Kombis`);
    }
  }
}
console.log(errors ? `\n${errors} Fehler` : '\nAlles in Ordnung ✓');
process.exit(errors ? 1 : 0);
