/*
 * Browser-Autoplayer: spielt Abenteuer mit echten Klicks durch (inkl. Blättern, Kombinieren,
 * Rätsel-Oberflächen und Treffer-Test, ob ein Objekt wirklich antippbar ist).
 * Im Spiel ausführen:  await __autoplay('iglu')  oder  await __autoplayAll()
 */
window.__autoplay = async function (advId, { delay = 60 } = {}) {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const $ = (s) => document.querySelector(s);
  const adv = WORLDS.flatMap((w) => w.adventures).find((a) => a.id === advId);
  const world = WORLDS.find((w) => w.adventures.includes(adv));
  const E = window.__escape;
  // über die echte Oberfläche starten (damit currentWorld stimmt)
  $('[data-back="home"]')?.click();
  await wait(50);
  [...document.querySelectorAll('.world-card')][WORLDS.indexOf(world)].click();
  await wait(50);
  [...document.querySelectorAll('.adv-card')][world.adventures.indexOf(adv)].click();
  await wait(300);
  const log = [];
  const st = () => E.state;

  async function solvePuzzle(p) {
    const body = $('#modal-body');
    if (p.type === 'code') {
      for (const d of p.answer) [...body.querySelectorAll('.keypad button')].find((b) => b.textContent === d).click();
      await wait(500);
    } else if (p.type === 'choice') {
      body.querySelectorAll('.choices button')[p.answer].click();
      await wait(450);
    } else if (p.type === 'sequence') {
      for (const i of p.answer) body.querySelectorAll('.seq-pad button')[i].click();
      await wait(600);
    } else if (p.type === 'wheels') {
      const wheels = body.querySelectorAll('.wheel');
      p.answer.forEach((a, wi) => { for (let k = 0; k < a; k++) wheels[wi].querySelectorAll('button')[1].click(); });
      body.querySelector('.chip.primary').click();
      await wait(450);
    }
  }

  async function gotoPage(pid) {
    if (st().page === pid) return true;
    // Breitensuche über Navigations-Objekte
    const pages = adv.pages;
    const edges = (p) => {
      const out = [];
      for (const o of pages[p].objects) {
        const pure = o.goto && !o.needs && !o.puzzle && !o.after && !o.give && !o.win;
        if (o.goto && (pure || st().done.includes(o.id)) && !st().removed.includes(o.id)) out.push([o.goto, o.id]);
      }
      if (pages[p].back) out.push([pages[p].back, '_back']);
      return out;
    };
    const prev = { [st().page]: null };
    const q = [st().page];
    while (q.length) {
      const p = q.shift();
      for (const [n, via] of edges(p)) if (!(n in prev)) { prev[n] = [p, via]; q.push(n); }
    }
    if (!(pid in prev)) return false;
    const path = [];
    for (let p = pid; prev[p]; p = prev[p][0]) path.unshift(prev[p][1]);
    for (const via of path) {
      const el = [...document.querySelectorAll('#objects .obj')].find((e) => e.getAttribute('aria-label') === (via === '_back' ? 'Zurück' : adv.pages[st().page].objects.find((o) => o.id === via)?.name));
      if (!el) return false;
      el.click();
      await wait(650);
    }
    return st().page === pid;
  }

  function hitOk(el) {
    const r = el.getBoundingClientRect();
    const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return hit && (hit === el || el.contains(hit));
  }

  for (let round = 0; round < 60 && !st().won; round++) {
    let progress = false;
    // kombinieren
    for (const c of adv.combos || []) {
      const ia = st().inv.indexOf(c.a), ib = st().inv.indexOf(c.b);
      if (ia >= 0 && ib >= 0) {
        const items = document.querySelectorAll('#inventory .inv-item');
        items[ia].click(); await wait(delay);
        document.querySelectorAll('#inventory .inv-item')[ib].click(); await wait(delay);
        log.push('Kombi ' + c.gives); progress = true;
      }
    }
    for (const [pid, page] of Object.entries(adv.pages)) {
      for (const o of page.objects) {
        const s = st();
        if (s.won || o.static || s.done.includes(o.id) || s.removed.includes(o.id)) continue;
        if ((o.hidden && !s.revealed.includes(o.id)) || s.hidden.includes(o.id)) continue;
        const pure = o.goto && !o.needs && !o.puzzle && !o.after && !o.give && !o.win;
        if (pure) continue;
        const effect = o.give || o.reveal || o.hide || o.remove || o.light || o.win || o.needs || o.become || o.after || o.puzzle;
        if (!effect) continue;
        if (o.after && o.after.some((id) => !s.done.includes(id))) continue;
        if (o.needs && o.needs.some((n) => s.inv.filter((x) => x === n).length < o.needs.filter((x) => x === n).length)) continue;
        if (page.dark && !s.lit.includes(pid) && !o.glow) continue;
        if (!(await gotoPage(pid))) continue;
        const el = [...document.querySelectorAll('#objects .obj')].find((e) => e.getAttribute('aria-label') === o.name && !e.hidden);
        if (!el) { log.push(`! ${o.id} nicht im DOM`); continue; }
        if (!hitOk(el)) { log.push(`! ${o.id} verdeckt`); continue; }
        el.click();
        await wait(delay);
        if (!$('#modal').hidden) await solvePuzzle(o.puzzle);
        await wait(o.goto ? 1300 : delay);
        if (st().done.includes(o.id) || st().won) { log.push(`${pid}/${o.id}`); progress = true; }
        else log.push(`? ${o.id} nicht erledigt: ${$('#bubble-text').textContent}`);
      }
    }
    if (!progress) break;
  }
  await wait(1000);
  const ok = !$('#win').hidden;
  $('#win').hidden = true;
  return { adv: advId, ok, steps: log.length, problems: log.filter((l) => /^[!?]/.test(l)) };
};

window.__autoplayAll = async function () {
  localStorage.clear();
  const out = [];
  for (const w of WORLDS) for (const a of w.adventures) out.push(await window.__autoplay(a.id));
  return out;
};
