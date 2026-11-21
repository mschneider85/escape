/* ===================== Welt: Nordpol ===================== */
(() => {
  const F = draw.face;
  const eyes = (cx, cy, s = 1, gap = 5) => `<g class="eye">
    <circle cx="${cx - gap * s}" cy="${cy}" r="${2 * s}" fill="#3b2c24"/><circle cx="${cx + gap * s}" cy="${cy}" r="${2 * s}" fill="#3b2c24"/>
    <circle cx="${cx - gap * s + .7 * s}" cy="${cy - .8 * s}" r="${.7 * s}" fill="#fff"/><circle cx="${cx + gap * s + .7 * s}" cy="${cy - .8 * s}" r="${.7 * s}" fill="#fff"/></g>`;
  const cheeks = (cx, cy, s = 1, gap = 8) => `
    <ellipse cx="${cx - gap * s}" cy="${cy}" rx="${2.6 * s}" ry="${1.6 * s}" fill="#f4a6a0" opacity=".85"/>
    <ellipse cx="${cx + gap * s}" cy="${cy}" rx="${2.6 * s}" ry="${1.6 * s}" fill="#f4a6a0" opacity=".85"/>`;
  const snowflakes = (n, w, h, seed = 1) => {
    let s = '', r = seed;
    const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < n; i++) s += `<circle cx="${(rnd() * w).toFixed(0)}" cy="${(rnd() * h).toFixed(0)}" r="${(2 + rnd() * 4).toFixed(1)}" fill="#fff" opacity="${(.5 + rnd() * .5).toFixed(2)}"/>`;
    return s;
  };
  // Eisblock-Mauer (für Iglu)
  const iceWall = (w, h, rowH = 58) => {
    let s = '';
    for (let y = rowH, row = 0; y < h; y += rowH, row++) {
      s += `<path class="thin" opacity=".5" d="M0 ${y} Q${w / 2} ${y - 18} ${w} ${y}"/>`;
      for (let x = (row % 2) * 60; x < w; x += 120) s += `<path class="thin" opacity=".4" d="M${x + 40} ${y - rowH + 4} l3 ${rowH - 8}"/>`;
    }
    return s;
  };
  // Nordlicht-Vorhang: weiches, welliges Lichtband mit senkrechten Strahlen
  const aurora = (x, color) => {
    let rays = '';
    for (let i = 0; i < 9; i++) rays += `<path d="M${x + 14 + i * 17} ${70 + (i % 3) * 14} q${i % 2 ? 6 : -6} 90 0 ${170 + (i % 4) * 12}" stroke="${color}" stroke-width="7" stroke-linecap="round" opacity=".55" fill="none"/>`;
    return `<path fill="${color}" opacity=".32" d="M${x} 90 Q${x + 40} 50 ${x + 80} 80 T${x + 165} 70 L${x + 170} 300 Q${x + 120} 320 ${x + 85} 300 T${x + 4} 305Z"/>${rays}`;
  };
  const planks = (x, y, w, h, n, color = '#b07a4f') => {
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"/>`;
    for (let i = 1; i < n; i++) s += `<path class="thin" opacity=".55" d="M${x} ${y + (h / n) * i} L${x + w} ${y + (h / n) * i + 4}"/>`;
    for (let i = 0; i < n; i++) s += `<path class="thin" opacity=".35" d="M${x + 40 + ((i * 137) % (w - 80))} ${y + (h / n) * i + 8} q30 -4 60 0"/>`;
    return s;
  };

  Object.assign(ART, {
    /* ---------- Hintergründe ---------- */
    cover_nordpol: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="url(#sky-night)"/>
      <path fill="#7fe0b0" opacity=".45" d="M0 170 Q200 60 400 150 T800 110 L800 200 Q600 230 400 220 T0 260Z"/>
      <path fill="#8fb3ff" opacity=".35" d="M0 230 Q220 140 420 220 T800 190 L800 260 Q600 300 400 280 T0 320Z"/>
      ${snowflakes(40, 800, 300, 4)}
      <path class="o" fill="#eaf6fb" d="M-10 420 Q200 360 420 400 Q620 360 810 410 L810 610 L-10 610Z"/>
      <path class="o" fill="#f7fcff" d="M140 440 Q140 290 280 290 Q420 290 420 440Z"/>
      ${iceWall(0, 0)}
      <path class="thin" opacity=".5" d="M160 400 Q280 380 400 400 M150 360 Q280 335 410 360 M175 320 Q280 300 385 320"/>
      <path class="o" fill="#5b4a8a" d="M245 440 Q245 385 280 385 Q315 385 315 440Z"/>
      <path class="o" fill="#3d4a5c" d="M560 470 Q560 420 585 412 Q612 420 610 470 Q600 500 585 500 Q566 500 560 470Z"/>
      <ellipse cx="585" cy="470" rx="14" ry="22" fill="#fbf3e4"/>
      ${eyes(585, 432, .9, 6)}<path class="o" fill="#f2a03b" d="M580 440 L590 440 L585 447Z"/>
      ${draw.star(680, 80, 16, '#fff3c4')}${draw.star(110, 70, 10, '#fff3c4')}` },

    bg_iglu: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="#cfe5f2"/>
      <path fill="#dff0f9" d="M-20 470 L-20 160 Q400 -110 820 160 L820 470Z"/>
      ${iceWall(800, 470)}
      <circle cx="400" cy="120" r="260" fill="url(#glow-warm)" opacity=".55"/>
      <path class="o" fill="#eef7fc" d="M-20 450 Q400 410 820 450 L820 620 L-20 620Z"/>
      <path class="thin" opacity=".35" d="M60 520 q40 -6 80 0 M600 560 q50 -8 100 0 M300 590 q40 -6 80 0"/>
      <ellipse class="o" cx="330" cy="505" rx="150" ry="38" fill="#c9905e"/>
      <ellipse cx="330" cy="505" rx="120" ry="26" fill="none" stroke="#a86f45" stroke-width="5" stroke-dasharray="10 8" opacity=".7"/>` },

    bg_shelf: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="#d7ebf6"/>
      ${iceWall(800, 600, 70)}
      <rect class="o" x="60" y="40" width="680" height="520" rx="10" fill="#9c6a43"/>
      <rect x="80" y="58" width="640" height="484" fill="#7b5033"/>
      ${planks(80, 58, 640, 484, 6, '#7b5033')}
      <rect class="o" x="70" y="230" width="660" height="22" fill="#b07a4f"/>
      <rect class="o" x="70" y="470" width="660" height="22" fill="#b07a4f"/>
      <rect class="o" x="400" y="160" width="40" height="70" fill="#d9573b"/>
      <rect class="o" x="442" y="150" width="32" height="80" fill="#7fb069"/>
      <rect class="o" x="476" y="170" width="44" height="60" fill="#f2b544"/>
      <path class="o" fill="#e9785c" d="M530 230 L540 160 L572 166 L560 230Z"/>
      <circle class="o" cx="640" cy="200" r="28" fill="#cfe9f7"/><path class="thin" d="M622 200 q18 -14 36 0"/>` },

    bg_icesea: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="url(#sky-day)"/>
      <circle cx="640" cy="110" r="60" fill="#fff6d0" opacity=".8"/>
      <path class="o" fill="#eef7fc" d="M-10 250 L120 180 L210 230 L320 150 L430 240 L560 190 L680 240 L810 200 L810 270 L-10 270Z"/>
      <path class="thin" opacity=".4" d="M320 150 L300 250 M560 190 L570 260"/>
      <rect x="-10" y="262" width="820" height="350" fill="#6fa8dc"/>
      <path class="thin" opacity=".5" stroke="#fff" d="M40 320 q30 -8 60 0 M520 300 q40 -8 80 0 M200 520 q40 -8 80 0 M640 470 q30 -8 60 0"/>
      <path class="o" fill="#f4fbff" d="M40 410 Q60 370 160 372 Q260 368 280 404 Q250 440 150 440 Q60 442 40 410Z"/>
      <path class="o" fill="#f4fbff" d="M340 330 Q360 300 450 302 Q520 300 540 330 Q510 356 440 356 Q360 358 340 330Z"/>
      <path class="o" fill="#f4fbff" d="M520 470 Q540 430 640 432 Q740 430 760 468 Q730 500 640 500 Q540 504 520 470Z"/>
      <path fill="#cfe9f7" d="M60 414 Q150 432 268 410 Q250 436 150 436 Q70 436 60 414Z"/>
      <path fill="#cfe9f7" d="M540 474 Q640 492 748 470 Q730 496 640 496 Q556 498 540 474Z"/>
      <!-- Fensterrahmen -->
      <path fill="#9c6a43" fill-rule="evenodd" d="M0 0 H800 V600 H0Z M50 50 H750 V550 H50Z"/>
      <path class="o" fill="none" d="M50 50 H750 V550 H50Z"/>
      <path class="o" fill="#b07a4f" d="M392 50 H408 V550 H392Z M50 292 H750 V308 H50Z"/>
      ${planks(0, 0, 800, 50, 1, '#9c6a43')}
      <path class="o" fill="none" d="M0 0 H800 V600 H0Z"/>` },

    bg_stable: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="#8a5a3a"/>
      ${planks(0, 0, 800, 430, 7, '#9c6a43')}
      <path class="o" fill="#6b4530" d="M0 60 L800 60 L800 86 L0 86Z"/>
      <path class="o" fill="#6b4530" d="M150 86 L172 86 L172 430 L150 430Z M630 86 L652 86 L652 430 L630 430Z"/>
      <path class="o" fill="#b9e1f5" d="M330 130 L470 130 L470 240 L330 240Z"/>
      <path class="thick line" d="M400 130 L400 240 M330 185 L470 185"/>
      ${snowflakes(8, 140, 110, 9).replace(/cx="(\d+)" cy="(\d+)"/g, (m, x, y) => `cx="${330 + +x}" cy="${130 + +y}"`)}
      <path class="o" fill="#e8c46a" d="M-10 420 Q200 400 400 418 Q600 400 810 420 L810 610 L-10 610Z"/>
      <path class="thin" stroke="#b58a2a" d="M40 470 l12 -18 M90 500 l-8 -20 M200 450 l10 -16 M260 520 l-12 -18 M380 470 l8 -22 M470 540 l-10 -16 M560 460 l12 -18 M700 500 l-8 -20 M740 450 l10 -16 M120 560 l10 -18 M640 560 l-10 -18"/>` },

    bg_hayloft: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="#7b5033"/>
      <path class="o" fill="#9c6a43" d="M-10 470 L-10 220 L400 -10 L810 220 L810 470Z"/>
      <path class="thin" opacity=".5" d="M80 175 L80 470 M200 108 L200 470 M320 40 L320 470 M480 40 L480 470 M600 108 L600 470 M720 175 L720 470"/>
      <path class="o" fill="#6b4530" d="M-10 230 L400 0 L410 14 L-10 252Z M810 230 L400 0 L390 14 L810 252Z"/>
      <path class="o" fill="#b9e1f5" d="M360 140 Q400 100 440 140 L440 220 L360 220Z"/>
      <path class="thick line" d="M400 112 L400 220 M360 180 L440 180"/>
      <path class="o" fill="#6b4530" d="M100 60 L700 60 L700 80 L100 80Z" opacity="0"/>
      <path class="o" fill="#e8c46a" d="M-10 460 Q400 430 810 460 L810 610 L-10 610Z"/>
      <path class="o" fill="#f0d27e" d="M520 470 Q560 360 660 380 Q760 370 790 470Z"/>
      <path class="thin" stroke="#b58a2a" d="M560 440 l10 -20 M600 420 l-6 -22 M650 410 l8 -20 M700 420 l-8 -20 M740 440 l6 -20 M60 520 l10 -18 M160 500 l-8 -18 M300 540 l10 -18 M420 510 l-10 -18"/>` },

    bg_workbench: { vb: [800, 600], bg: true, svg: `
      ${planks(0, 0, 800, 380, 6, '#9c6a43')}
      <path class="thick line" d="M90 70 L90 100 M250 60 L250 90 M560 70 L560 100 M700 60 L700 90"/>
      <path class="o" fill="#c9cfd6" d="M70 100 L110 100 L104 220 L76 220Z"/>
      <path class="o" fill="#8a5a3a" d="M84 220 L96 220 L96 280 L84 280Z"/>
      <path class="o" fill="#c9cfd6" d="M220 92 Q250 80 280 92 L272 140 Q250 150 228 140Z"/>
      <path class="o" fill="#8a5a3a" d="M243 140 L257 140 L257 250 L243 250Z"/>
      <path class="o" fill="#d9573b" d="M545 100 L575 100 L575 200 L545 200Z"/>
      <path class="o" fill="#c9cfd6" d="M552 200 L568 200 L562 270 L558 270Z"/>
      <path class="o" fill="#c9cfd6" d="M680 92 a22 22 0 1 0 40 0 L712 104 L700 92Z"/>
      <path class="o" fill="#8a5a3a" d="M694 112 L706 112 L706 230 L694 230Z"/>
      <path class="o" fill="#c48d5c" d="M-10 360 L810 360 L810 420 L-10 420Z"/>
      <path class="o" fill="#a8744c" d="M-10 420 L810 420 L810 610 L-10 610Z"/>
      ${draw.grain(0, 362, 800, 56, 2)}
      <ellipse cx="430" cy="372" rx="30" ry="6" fill="#3b2c24" opacity=".15"/>` },

    bg_throne: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="#bcd9f0"/>
      <path fill="#d4e8f7" d="M0 0 L800 0 L800 430 L0 430Z"/>
      <path class="o" fill="#e6f3fb" d="M60 430 L60 90 Q60 60 90 60 L110 60 Q140 60 140 90 L140 430Z"/>
      <path class="o" fill="#e6f3fb" d="M660 430 L660 90 Q660 60 690 60 L710 60 Q740 60 740 90 L740 430Z"/>
      <path class="thin" opacity=".5" d="M80 120 L80 410 M720 120 L720 410 M120 120 L120 410 M680 120 L680 410"/>
      <path class="o" fill="#a5cbe8" d="M260 0 Q400 80 540 0Z"/>
      <circle cx="400" cy="240" r="220" fill="url(#glow-cool)" opacity=".6"/>
      <path class="o" fill="#9fc4e4" d="M300 430 L300 200 Q400 120 500 200 L500 430Z"/>
      <path class="o" fill="#cfe6f6" d="M330 430 L330 230 Q400 170 470 230 L470 430Z"/>
      ${draw.star(400, 175, 18, '#e7f6ff')}
      <path class="o" fill="#e8f4fb" d="M-10 420 L810 420 L810 610 L-10 610Z"/>
      <path class="o" fill="#8a6fc4" d="M330 610 L360 420 L440 420 L470 610Z"/>
      <path class="thin" stroke="#f2b544" d="M345 600 L370 425 M455 600 L430 425"/>
      ${snowflakes(14, 800, 400, 3)}` },

    bg_mirrors: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="#c6e0f2"/>
      <path class="o" fill="#d8ebf8" d="M140 0 L660 0 L560 330 L240 330Z"/>
      <path class="thin" opacity=".5" d="M140 0 L240 330 M660 0 L560 330 M190 165 L610 165"/>
      <path class="o" fill="#e4f1fa" d="M240 330 L560 330 L810 610 L-10 610Z"/>
      <path class="o" fill="#8a6fc4" d="M330 610 L370 330 L430 330 L470 610Z"/>
      ${[40, 650].map((x) => `<path class="o" fill="#f2b544" d="M${x} 60 Q${x + 55} 20 ${x + 110} 60 L${x + 110} 270 L${x} 270Z"/>
        <path class="o" fill="#e8f6ff" d="M${x + 12} 70 Q${x + 55} 38 ${x + 98} 70 L${x + 98} 258 L${x + 12} 258Z"/>
        <path fill="#fff" opacity=".7" d="M${x + 25} 90 L${x + 50} 70 L${x + 40} 130Z"/>`).join('')}
      ${snowflakes(12, 800, 300, 11)}` },

    bg_balcony: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="url(#sky-night)"/>
      ${snowflakes(50, 800, 380, 21)}
      ${aurora(40, '#7fe0a0')}${aurora(220, '#7fb0ff')}${aurora(400, '#c49cff')}${aurora(580, '#7fb0ff')}
      <path class="o" fill="#e8f4fb" d="M-10 380 Q200 350 400 372 Q600 350 810 380 L810 610 L-10 610Z"/>
      <path class="o" fill="#cfe6f6" d="M-10 440 L810 440 L810 470 L-10 470Z"/>
      ${Array.from({ length: 14 }, (_, i) => `<path class="o" fill="#dff0fa" d="M${10 + i * 58} 470 L${34 + i * 58} 470 L${30 + i * 58} 600 L${14 + i * 58} 600Z"/>`).join('')}` },

    bg_treasury: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="#a9cbe6"/>
      <path fill="#c3dcef" d="M0 0 L800 0 L800 420 L0 420Z"/>
      ${iceWall(800, 420, 64)}
      <circle cx="400" cy="300" r="300" fill="url(#glow-warm)" opacity=".45"/>
      <path class="o" fill="#e0eef8" d="M-10 410 L810 410 L810 610 L-10 610Z"/>
      ${[[90, 420], [150, 440], [660, 430], [720, 445], [700, 410]].map(([x, y]) => `<ellipse class="o" cx="${x}" cy="${y}" rx="22" ry="9" fill="#f2b544"/>`).join('')}
      <path class="o" fill="#f2b544" d="M40 460 Q90 400 150 460Z"/><path class="o" fill="#f2b544" d="M640 470 Q700 400 770 470Z"/>
      ${draw.sparkle(100, 380, 2)}${draw.sparkle(690, 380, 2.4)}${draw.sparkle(600, 120, 1.6, '#e8fbff')}` },

    /* ---------- Kapitel 1: Iglu ---------- */
    iglu_door: { vb: [100, 130], svg: `
      <path class="o" fill="#e9f5fb" d="M4 128 L4 50 Q4 4 50 4 Q96 4 96 50 L96 128Z"/>
      <path class="o" fill="#9c6a43" d="M16 128 L16 54 Q16 18 50 18 Q84 18 84 54 L84 128Z"/>
      <path class="thin" opacity=".6" d="M38 22 L38 128 M62 22 L62 128"/>
      <path class="o" fill="#5b6b7a" d="M16 60 L84 60 L84 68 L16 68Z M16 100 L84 100 L84 108 L16 108Z"/>
      <circle class="o" cx="72" cy="84" r="7" fill="#cfe9f7"/>
      <path fill="#3b2c24" d="M70 84 h4 v8 h-4z"/>
      <path fill="#fff" opacity=".8" d="M24 30 Q36 20 46 22 Q34 28 28 40Z"/>` },
    shelf: { vb: [120, 130], svg: `
      <rect class="o" x="6" y="6" width="108" height="120" rx="4" fill="#9c6a43"/>
      <rect x="14" y="14" width="92" height="104" fill="#7b5033"/>
      <rect class="o" x="8" y="60" width="104" height="8" fill="#b07a4f"/>
      <rect class="o" x="8" y="112" width="104" height="8" fill="#b07a4f"/>
      <rect class="o" x="20" y="30" width="12" height="30" fill="#d9573b"/>
      <rect class="o" x="33" y="26" width="10" height="34" fill="#6fa8dc"/>
      <rect class="o" x="44" y="34" width="14" height="26" fill="#f2b544"/>
      <path class="o" fill="#b07a4f" d="M66 40 L102 40 L100 60 L68 60Z"/>
      <rect class="o" x="76" y="34" width="16" height="6" fill="#f2b544"/>
      <circle class="o" cx="34" cy="98" r="12" fill="#cfe9f7"/>
      <rect class="o" x="60" y="82" width="34" height="30" rx="3" fill="#e9785c"/>` },
    iglu_window: { vb: [110, 90], svg: `
      <path class="o" fill="#e9f5fb" d="M4 86 L4 40 Q4 4 55 4 Q106 4 106 40 L106 86Z"/>
      <path class="o" fill="#a9d6f0" d="M16 78 L16 42 Q16 16 55 16 Q94 16 94 42 L94 78Z"/>
      <path fill="#f4fbff" d="M16 66 Q40 58 60 64 Q80 58 94 64 L94 78 L16 78Z"/>
      <path class="thick line" d="M55 16 L55 78 M16 48 L94 48"/>
      <circle cx="30" cy="30" r="3" fill="#fff"/><circle cx="76" cy="26" r="2" fill="#fff"/>` },
    bed_fur: { vb: [200, 100], svg: `
      <path class="o" fill="#b07a4f" d="M8 50 L192 50 L192 86 L8 86Z"/>
      <path class="o" fill="#8a5a3a" d="M12 86 L24 86 L24 98 L12 98Z M176 86 L188 86 L188 98 L176 98Z"/>
      <path class="o" fill="#efe3cf" d="M4 56 Q10 28 40 32 Q60 20 90 30 Q120 18 150 30 Q186 24 196 54 Q160 64 100 62 Q40 66 4 56Z"/>
      <path class="thin" opacity=".6" d="M40 40 l4 10 M70 36 l-3 10 M110 34 l3 10 M150 38 l-4 10 M176 42 l2 8"/>
      <ellipse class="o" cx="40" cy="38" rx="26" ry="14" fill="#fbf3e4"/>` },
    ice_hole: { vb: [140, 70], svg: `
      <ellipse class="o" cx="70" cy="36" rx="66" ry="30" fill="#eef7fc"/>
      <ellipse class="o" cx="70" cy="38" rx="46" ry="18" fill="#2f6f9f"/>
      <ellipse cx="70" cy="42" rx="36" ry="11" fill="#3f85b8"/>
      <path class="thin" stroke="#fff" opacity=".6" d="M44 36 q10 -4 20 0 M80 44 q8 -3 16 0"/>
      ${draw.sparkle(86, 40, .7, '#cfe9f7')}` },
    oil_lamp: { vb: [60, 90], svg: `
      <circle cx="30" cy="30" r="28" fill="url(#glow-warm)"/>
      <path class="thin" d="M30 0 L30 12"/>
      <path class="o" fill="#f2b544" d="M18 12 L42 12 L46 60 L14 60Z"/>
      <path class="o" fill="#fff3c4" d="M22 20 L38 20 L40 52 L20 52Z"/>
      <path class="o" fill="#f2a03b" d="M30 30 Q36 40 30 46 Q24 40 30 30Z"/>
      <path class="o" fill="#c48d5c" d="M10 60 L50 60 L44 70 L16 70Z"/>` },
    fox_arctic: { vb: [110, 90], svg: `
      <path class="o" fill="#f7fbff" d="M60 72 Q100 80 104 50 Q106 34 92 38 Q96 60 70 62Z"/>
      <ellipse class="o" cx="56" cy="64" rx="30" ry="20" fill="#f7fbff"/>
      <path class="o" fill="#f7fbff" d="M14 40 L10 12 L30 28 Q40 22 50 28 L70 12 L66 40 Q66 62 40 62 Q14 62 14 40Z"/>
      <path class="o" fill="#f4c3cf" d="M15 18 L28 30 L18 32Z M65 18 L52 30 L62 32Z"/>
      ${F(40, 40, .9)}
      <ellipse cx="40" cy="46" rx="3" ry="2.2" fill="#3b2c24"/>` },
    book_blue: { vb: [110, 90], svg: `
      <path class="o" fill="#4f7fb8" d="M8 18 L54 12 L56 82 L10 86Z"/>
      <path class="o" fill="#4f7fb8" d="M102 18 L56 12 L56 82 L100 86Z"/>
      <path class="o" fill="#fffdf6" d="M14 18 L54 14 L56 78 L16 80Z"/>
      <path class="o" fill="#fffdf6" d="M96 18 L56 14 L56 78 L94 80Z"/>
      <path class="thin" opacity=".5" d="M20 30 h28 M20 40 h26 M20 50 h28 M62 30 h26 M62 40 h28 M62 50 h20"/>
      <path class="o" fill="#d9573b" d="M70 60 L80 60 L80 90 L75 84 L70 90Z"/>` },
    jar_cookies: { vb: [80, 90], svg: `
      <rect class="o" x="14" y="6" width="52" height="12" rx="4" fill="#d9573b"/>
      <path class="o" fill="#e8f6ff" d="M10 18 L70 18 L68 80 Q40 88 12 80Z"/>
      <circle class="o" cx="30" cy="54" r="12" fill="#c48d5c"/><circle class="o" cx="50" cy="64" r="12" fill="#c48d5c"/><circle class="o" cx="48" cy="40" r="10" fill="#c48d5c"/>
      <circle cx="28" cy="52" r="2" fill="#5a3b26"/><circle cx="34" cy="58" r="1.6" fill="#5a3b26"/><circle cx="52" cy="62" r="2" fill="#5a3b26"/><circle cx="46" cy="40" r="1.6" fill="#5a3b26"/>
      <path fill="#fff" opacity=".6" d="M16 24 L22 24 L20 70 L16 70Z"/>` },
    penguin: { vb: [60, 80], svg: `
      <path class="o" fill="#3d4a5c" d="M8 40 Q0 58 10 64 Q12 52 14 46Z M52 40 Q60 58 50 64 Q48 52 46 46Z"/>
      <ellipse class="o" cx="30" cy="44" rx="21" ry="30" fill="#3d4a5c"/>
      <ellipse cx="30" cy="52" rx="14" ry="21" fill="#fbf3e4"/>
      <ellipse cx="30" cy="30" rx="12" ry="9" fill="#fbf3e4"/>
      ${eyes(30, 29, .8, 5)}${cheeks(30, 34, .7, 9)}
      <path class="o" fill="#f2a03b" d="M26 33 L34 33 L30 38Z"/>
      <ellipse class="o" cx="22" cy="74" rx="7" ry="3.5" fill="#f2a03b"/><ellipse class="o" cx="38" cy="74" rx="7" ry="3.5" fill="#f2a03b"/>` },
    seal: { vb: [110, 70], svg: `
      <path class="o" fill="#9aa8b6" d="M10 56 Q4 40 20 30 Q36 18 54 26 Q80 36 96 50 L106 40 L104 62 L92 58 Q60 66 10 56Z"/>
      <path fill="#c3ced8" d="M18 52 Q40 58 70 54 Q50 48 24 46Z"/>
      ${eyes(30, 34, .8, 5)}
      <ellipse cx="30" cy="40" rx="3" ry="2" fill="#3b2c24"/>
      <path class="thin" d="M22 41 l-8 -2 M22 43 l-8 2 M38 41 l8 -2 M38 43 l8 2"/>
      <path class="o" fill="#7d8b99" d="M44 56 Q52 66 60 60 Q54 56 52 54Z"/>` },
    fish_jump: { vb: [80, 50], svg: `
      <path class="o" fill="#f2a03b" d="M8 26 Q30 2 58 20 L74 8 L70 26 L76 42 L58 32 Q30 48 8 26Z"/>
      <path class="thin" d="M44 14 Q38 26 44 36"/>
      <circle cx="22" cy="22" r="2.4" fill="#3b2c24"/>
      <path fill="#fff" opacity=".5" d="M18 30 Q30 36 44 32 Q30 30 22 28Z"/>` },
    item_stock: { vb: [100, 100], svg: `
      <path class="o" fill="#a8744c" d="M14 88 L80 10 Q86 6 90 12 L22 94 Q16 96 14 88Z"/>
      <path class="thin" d="M40 60 l-8 -4 M60 36 l6 -8"/>` },
    item_schnur: { vb: [100, 100], svg: `
      <ellipse class="o" cx="50" cy="52" rx="34" ry="30" fill="#eadfc8"/>
      <path class="thin" d="M24 40 Q50 30 76 42 M20 54 Q50 44 80 56 M24 68 Q50 58 76 70"/>
      <path class="thin" d="M76 70 Q90 84 72 92 L64 90"/>
      <path class="o" fill="#c9cfd6" d="M60 86 Q58 96 66 96 Q72 94 70 88"/>` },
    item_angel: { vb: [100, 100], svg: `
      <path class="o" fill="#a8744c" d="M10 92 L78 10 Q84 6 88 12 L18 96 Q12 98 10 92Z"/>
      <path class="thin" d="M84 10 Q96 40 92 74"/>
      <path class="o" fill="#c9cfd6" d="M92 74 Q90 88 82 84 Q80 78 86 78"/>
      <ellipse class="o" cx="30" cy="70" rx="10" ry="8" fill="#eadfc8"/>` },
    key_ice: { vb: [100, 50], svg: `
      <circle class="o" cx="22" cy="25" r="16" fill="#9fd4f2"/>
      <circle class="o" cx="22" cy="25" r="6" fill="#fbf3e4"/>
      <path class="o" fill="#9fd4f2" d="M36 21 L90 21 Q94 21 94 25 Q94 29 90 29 L84 29 L84 38 L76 38 L76 29 L70 29 L70 35 L63 35 L63 29 L36 29 Z"/>
      <path fill="#fff" opacity=".7" d="M10 18 Q16 10 26 12 Q16 16 14 24Z"/>
      ${draw.sparkle(50, 12, .6, '#fff')}` },

    /* ---------- Kapitel 2: Rentierstall ---------- */
    reindeer: { vb: [140, 140], svg: `
      <path class="thick line" stroke="#7b5033" d="M44 30 L36 8 M38 16 L28 12 M44 26 L52 10 M48 18 L58 16"/>
      <path class="thick line" d="M44 30 L36 8 M38 16 L28 12 M44 26 L52 10 M48 18 L58 16"/>
      <path class="o" fill="#a87250" d="M56 70 Q60 56 90 58 Q124 60 124 84 Q124 100 108 102 L60 102 Q50 94 56 70Z"/>
      <path class="o" fill="#a87250" d="M66 98 L74 98 L74 132 L66 132Z M104 98 L112 98 L112 132 L104 132Z"/>
      <path class="o" fill="#8a5a3a" d="M78 100 L86 100 L86 130 L78 130Z M92 100 L100 100 L100 130 L92 130Z"/>
      <path class="o" fill="#efe3cf" d="M120 70 Q132 66 130 78 Q126 82 120 80Z"/>
      <path class="o" fill="#a87250" d="M56 80 Q44 70 42 54 L58 52 Q62 66 70 72Z"/>
      <path class="o" fill="#a87250" d="M24 44 Q24 26 44 26 Q62 26 62 44 Q62 60 46 64 Q30 64 24 54Z"/>
      <path class="o" fill="#a87250" d="M22 34 Q10 28 12 38 Q16 44 24 42Z M60 30 Q72 22 72 34 Q68 40 60 40Z"/>
      ${eyes(40, 42, 1, 7)}
      <ellipse class="o" cx="36" cy="56" rx="6" ry="4.5" fill="#3b2c24"/>
      <path class="thin" d="M44 54 q4 4 10 2" opacity=".5"/>
      <path class="o" fill="#efe3cf" d="M60 72 Q70 84 80 74 Q72 70 66 68Z"/>` },
    sleigh: { vb: [180, 120], svg: `
      <path class="thick line" d="M10 108 L150 108 Q172 108 172 88"/>
      <path class="thick line" d="M40 92 L40 108 M120 92 L120 108"/>
      <path class="o" fill="#d9573b" d="M24 92 L24 52 Q24 34 44 38 L60 44 L140 44 Q150 24 168 26 Q176 40 160 50 L156 92Z"/>
      <path class="o" fill="#b8432c" d="M34 60 L148 60 L146 84 L36 84Z"/>
      <path class="thin" stroke="#f2b544" d="M40 72 q20 -10 40 0 t40 0 t28 0" style="stroke-width:3px"/>
      <path class="o" fill="#f2b544" d="M24 50 Q20 40 30 38 Q40 40 36 50Z"/>
      ${draw.star(96, 52, 6, '#f2b544')}` },
    ladder: { vb: [60, 160], svg: `
      <path class="o" fill="#c48d5c" d="M8 4 L18 4 L20 156 L10 156Z M42 4 L52 4 L50 156 L40 156Z"/>
      ${[24, 52, 80, 108, 136].map((y) => `<path class="o" fill="#b07a4f" d="M16 ${y} L44 ${y - 2} L44 ${y + 6} L16 ${y + 8}Z"/>`).join('')}` },
    workbench: { vb: [160, 110], svg: `
      <path class="o" fill="#c48d5c" d="M4 30 L156 30 L156 46 L4 46Z"/>
      <path class="o" fill="#a8744c" d="M14 46 L26 46 L26 106 L14 106Z M134 46 L146 46 L146 106 L134 106Z"/>
      <path class="o" fill="#9c6a43" d="M40 48 L120 48 L120 74 L40 74Z"/>
      <circle class="o" cx="80" cy="61" r="4" fill="#f2b544"/>
      <path class="o" fill="#c9cfd6" d="M100 12 L120 12 L118 30 L102 30Z"/>
      <path class="o" fill="#8a5a3a" d="M30 22 L70 22 L70 30 L30 30Z"/>
      <path class="o" fill="#c9cfd6" d="M70 20 L84 24 L70 30Z"/>
      <path class="thin" d="M110 12 L110 0" opacity=".6"/>` },
    lantern_hanging: { vb: [60, 110], svg: `
      <circle cx="30" cy="70" r="30" fill="url(#glow-warm)"/>
      <path class="thin" d="M30 0 L30 34"/>
      <path class="o" fill="#5b6b7a" d="M18 34 L42 34 L38 44 L22 44Z"/>
      <path class="o" fill="#fff3c4" d="M20 44 L40 44 L42 86 L18 86Z"/>
      <path class="o" fill="#f2a03b" d="M30 56 Q37 66 30 74 Q23 66 30 56Z"/>
      <path class="o" fill="#5b6b7a" d="M14 86 L46 86 L42 94 L18 94Z"/>` },
    scarves_hooks: { vb: [200, 130], svg: `
      <path class="o" fill="#8a5a3a" d="M4 10 L196 10 L196 24 L4 24Z"/>
      ${[40, 100, 160].map((x) => `<path class="thick line" d="M${x} 22 L${x} 34 Q${x} 40 ${x + 6} 38"/>`).join('')}
      <path class="o" fill="#d9573b" d="M28 34 Q40 28 52 34 L54 110 L46 120 L42 112 L38 122 L30 110Z"/>
      <path class="thin" stroke="#fbf3e4" d="M30 60 L52 58 M31 80 L53 78" style="stroke-width:3px"/>
      <path class="o" fill="#f2c94c" d="M88 34 Q100 28 112 34 L114 104 L106 114 L102 106 L98 116 L90 104Z"/>
      <path class="thin" stroke="#fbf3e4" d="M90 58 L112 56 M91 78 L113 76" style="stroke-width:3px"/>
      <path class="o" fill="#4f7fb8" d="M148 34 Q160 28 172 34 L174 116 L166 126 L162 118 L158 128 L150 116Z"/>
      <path class="thin" stroke="#fbf3e4" d="M150 60 L172 58 M151 82 L173 80" style="stroke-width:3px"/>` },
    sack_tied: { vb: [110, 120], svg: `
      <path class="o" fill="#d7b98a" d="M20 110 Q4 70 26 40 L40 32 L70 32 L84 40 Q106 70 90 110 Q55 120 20 110Z"/>
      <path class="o" fill="#d7b98a" d="M40 32 Q36 14 46 10 L64 10 Q74 14 70 32Z"/>
      <path class="thick line" stroke="#8a5a3a" d="M36 30 Q55 40 74 30"/>
      <path class="thick line" d="M36 30 Q55 40 74 30"/>
      <path class="o" fill="#c9a26b" d="M50 32 Q44 44 40 46 Q52 42 55 36 Q58 42 70 46 Q66 44 60 32Z"/>
      <path class="o" fill="#f2a03b" d="M50 10 L54 0 L58 10Z" opacity=".9"/>
      <path class="thin" opacity=".5" d="M30 70 q10 8 20 0 M60 86 q10 8 20 0"/>` },
    sack_open: { vb: [110, 120], svg: `
      <path class="o" fill="#d7b98a" d="M20 110 Q4 70 22 44 Q55 30 88 44 Q106 70 90 110 Q55 120 20 110Z"/>
      <ellipse class="o" cx="55" cy="46" rx="34" ry="10" fill="#b8955f"/>
      <path class="thin" opacity=".5" d="M30 70 q10 8 20 0 M60 86 q10 8 20 0"/>` },
    owl: { vb: [80, 90], svg: `
      <path class="o" fill="#f4f6f8" d="M12 40 Q8 10 40 8 Q72 10 68 40 L66 80 Q40 92 14 80Z"/>
      <path class="o" fill="#f4f6f8" d="M14 16 L10 2 L26 10Z M66 16 L70 2 L54 10Z"/>
      <circle class="o" cx="28" cy="34" r="10" fill="#fff"/><circle class="o" cx="52" cy="34" r="10" fill="#fff"/>
      <circle cx="29" cy="35" r="4.5" fill="#3b2c24"/><circle cx="51" cy="35" r="4.5" fill="#3b2c24"/>
      <circle cx="30.5" cy="33.5" r="1.4" fill="#fff"/><circle cx="52.5" cy="33.5" r="1.4" fill="#fff"/>
      <path class="o" fill="#f2a03b" d="M36 44 L44 44 L40 52Z"/>
      <path class="thin" opacity=".5" d="M26 60 l4 4 l4 -4 M40 66 l4 4 l4 -4 M48 58 l4 4 l4 -4 M30 72 l4 4 l4 -4"/>
      <path class="o" fill="#f2a03b" d="M28 84 l-4 6 M32 84 l0 6 M48 84 l0 6 M52 84 l4 6"/>` },
    towel: { vb: [90, 90], svg: `
      <path class="o" fill="#7fb6d9" d="M14 10 L76 10 L78 82 L12 82Z"/>
      <path class="o" fill="#fbf3e4" d="M13 60 L77 60 L77 70 L13 70Z"/>
      <path class="thin" d="M14 82 l0 6 M24 82 l0 6 M34 82 l0 6 M44 82 l0 6 M54 82 l0 6 M64 82 l0 6 M74 82 l0 6"/>
      <circle cx="30" cy="30" r="3" fill="#fbf3e4"/><circle cx="56" cy="40" r="3" fill="#fbf3e4"/><circle cx="44" cy="24" r="3" fill="#fbf3e4"/>` },
    sun: { vb: [90, 90], svg: `
      <path class="thick line" stroke="#f2a03b" d="M45 4 v12 M45 74 v12 M4 45 h12 M74 45 h12 M16 16 l8 8 M66 66 l8 8 M74 16 l-8 8 M16 74 l8 -8"/>
      <circle class="o" cx="45" cy="45" r="22" fill="#f2c94c"/>
      ${F(45, 42, .9)}` },
    umbrella: { vb: [90, 90], svg: `
      <path class="o" fill="#d9573b" d="M6 44 Q45 -4 84 44 Q74 36 64 44 Q55 36 45 44 Q35 36 26 44 Q16 36 6 44Z"/>
      <path class="thick line" d="M45 44 L45 76 Q45 86 36 84 Q32 82 32 78"/>
      <path class="thin" d="M45 8 L26 44 M45 8 L64 44"/>` },
    drawer_colors: { vb: [160, 90], svg: `
      <path class="o" fill="#b07a4f" d="M6 6 L154 6 L154 84 L6 84Z"/>
      <path class="o" fill="#c48d5c" d="M16 16 L144 16 L144 74 L16 74Z"/>
      ${draw.grain(16, 16, 128, 58, 2)}
      <rect class="o" x="40" y="30" width="80" height="30" rx="6" fill="#efe3cf"/>
      <circle class="o" cx="58" cy="45" r="9" fill="#fff"/><circle class="o" cx="80" cy="45" r="9" fill="#fff"/><circle class="o" cx="102" cy="45" r="9" fill="#fff"/>
      <path class="thin" d="M58 39 v6 M80 39 v6 M102 39 v6"/>` },
    drawer_open: { vb: [160, 110], svg: `
      <path class="o" fill="#b07a4f" d="M6 6 L154 6 L154 84 L6 84Z"/>
      <path class="o" fill="#5a3b26" d="M16 16 L144 16 L144 74 L16 74Z"/>
      <path class="o" fill="#c48d5c" d="M10 50 L150 50 L156 104 L4 104Z"/>
      <path class="o" fill="#8a5a3a" d="M14 50 L146 50 L140 60 L20 60Z"/>` },
    item_scissors: { vb: [100, 100], svg: `
      <path class="o" fill="#c9cfd6" d="M48 52 L86 10 Q92 8 90 16 L56 58Z"/>
      <path class="o" fill="#c9cfd6" d="M52 52 L14 10 Q8 8 10 16 L44 58Z"/>
      <circle class="o" cx="34" cy="74" r="14" fill="#d9573b"/><circle cx="34" cy="74" r="6" fill="#fbf3e4" class="o"/>
      <circle class="o" cx="66" cy="74" r="14" fill="#d9573b"/><circle cx="66" cy="74" r="6" fill="#fbf3e4" class="o"/>
      <circle cx="50" cy="56" r="3" fill="#3b2c24"/>` },
    item_carrots: { vb: [100, 100], svg: `
      <path class="o" fill="#7fb069" d="M30 30 Q20 6 34 10 Q38 20 40 28Z M48 24 Q46 0 60 6 Q58 18 54 26Z M66 30 Q76 8 84 18 Q74 26 70 34Z"/>
      <path class="o" fill="#f2a03b" d="M30 30 Q40 24 44 32 L40 92 Q36 96 34 90Z"/>
      <path class="o" fill="#f29a3b" d="M48 26 Q58 20 60 30 L54 96 Q50 98 48 92Z"/>
      <path class="o" fill="#f2a03b" d="M66 32 Q76 28 76 38 L62 90 Q58 92 58 86Z"/>
      <path class="thin" d="M34 50 h6 M51 46 h6 M66 52 h6 M36 70 h4 M51 72 h4"/>` },
    item_bell: { vb: [100, 100], svg: `
      <path class="thick line" stroke="#d9573b" d="M50 6 Q36 6 38 18 M50 6 Q64 6 62 18"/>
      <path class="o" fill="#f2b544" d="M20 74 Q24 22 50 20 Q76 22 80 74 Q86 78 84 84 L16 84 Q14 78 20 74Z"/>
      <circle class="o" cx="50" cy="88" r="7" fill="#e0a23a"/>
      <path fill="url(#shine)" d="M30 70 Q30 34 46 26 Q36 50 38 72Z"/>
      ${draw.sparkle(84, 30, .8)}` },

    /* ---------- Kapitel 3: Eispalast ---------- */
    princess: { vb: [120, 170], svg: `
      <path class="o" fill="#b48ad6" d="M60 70 Q30 80 22 160 Q60 172 98 160 Q90 80 60 70Z"/>
      <path class="thin" stroke="#fbf3e4" d="M34 140 q8 -6 16 0 t16 0 t16 0 t10 0" style="stroke-width:3px"/>
      ${draw.sparkle(44, 110, .7, '#fff')}${draw.sparkle(78, 124, .6, '#fff')}
      <path class="o" fill="#b48ad6" d="M42 80 Q26 96 30 112 Q36 114 40 100Z M78 80 Q94 96 90 112 Q84 114 80 100Z"/>
      <circle class="o" cx="34" cy="114" r="6" fill="#f3cdb0"/><circle class="o" cx="86" cy="114" r="6" fill="#f3cdb0"/>
      <path class="o" fill="#4a3340" d="M30 46 Q26 16 60 14 Q94 16 90 46 Q96 70 86 78 Q80 64 80 52 L40 52 Q40 64 34 78 Q24 70 30 46Z"/>
      <path class="o" fill="#f3cdb0" d="M38 44 Q38 24 60 24 Q82 24 82 44 Q82 66 60 66 Q38 66 38 44Z"/>
      <path class="o" fill="#4a3340" d="M38 40 Q46 24 62 26 Q56 34 50 36 Q70 30 82 40 Q80 22 60 20 Q40 22 38 40Z"/>
      ${eyes(60, 46, 1, 8)}${cheeks(60, 53, 1, 13)}
      <path class="thin" d="M55 58 q5 4 10 0"/>
      <path class="thin" stroke="#6fa8dc" d="M50 48 q-2 6 0 9" opacity=".8"/>` },
    fireplace: { vb: [140, 130], svg: `
      <path class="o" fill="#d9e9f5" d="M6 24 L134 24 L134 126 L6 126Z"/>
      <path class="o" fill="#bcd6ea" d="M0 12 L140 12 L140 28 L0 28Z"/>
      <path class="thin" opacity=".5" d="M6 60 h22 M112 60 h22 M6 96 h22 M112 96 h22"/>
      <path class="o" fill="#3d3540" d="M30 126 L30 66 Q70 36 110 66 L110 126Z"/>
      <circle cx="70" cy="100" r="40" fill="url(#glow-warm)"/>
      <path class="o" fill="#8a5a3a" d="M40 118 L100 112 L102 120 L42 126Z"/>
      <path class="o" fill="#f2a03b" d="M50 116 Q46 92 60 80 Q60 94 66 96 Q66 74 78 66 Q76 86 86 92 Q92 102 88 116Z"/>
      <path class="o" fill="#f2c94c" d="M60 116 Q58 102 66 96 Q68 106 74 104 Q76 96 80 94 Q84 106 80 116Z"/>` },
    tapestry: { vb: [100, 140], svg: `
      <path class="thick line" d="M6 10 L94 10"/>
      <path class="o" fill="#8a6fc4" d="M12 12 L88 12 L88 122 L72 132 L50 122 L28 132 L12 122Z"/>
      <path class="o" fill="#fbf3e4" d="M20 22 L80 22 L80 112 L20 112Z"/>
      <path class="o" fill="#cfe9f7" d="M28 104 L28 92 Q28 86 32 86 L36 86 Q40 86 40 92 L40 104Z"/>
      <path class="o" fill="#cfe9f7" d="M44 104 L44 80 Q44 72 50 72 L54 72 Q60 72 60 80 L60 104Z"/>
      <path class="o" fill="#cfe9f7" d="M64 104 L64 62 Q64 52 70 52 L72 52 Q78 52 78 62 L78 104Z"/>
      <path class="thin" d="M30 44 L72 44 M66 38 L72 44 L66 50"/>
      <path class="thin" opacity=".6" d="M28 32 h44"/>` },
    balcony_door: { vb: [100, 150], svg: `
      <path class="o" fill="#f2b544" d="M4 146 L4 50 Q4 4 50 4 Q96 4 96 50 L96 146Z"/>
      <path class="o" fill="url(#sky-night)" d="M14 146 L14 52 Q14 16 50 16 Q86 16 86 52 L86 146Z"/>
      <path fill="#7fe0a0" opacity=".6" d="M18 80 Q30 40 50 34 Q40 60 42 90Z"/>
      <path fill="#b98cff" opacity=".6" d="M54 86 Q60 50 82 40 Q72 70 74 96Z"/>
      <circle cx="30" cy="60" r="2" fill="#fff"/><circle cx="70" cy="30" r="2" fill="#fff"/><circle cx="60" cy="70" r="1.6" fill="#fff"/>
      <path class="thick line" d="M50 16 L50 146 M14 92 L86 92"/>` },
    ice_sculpt_bear: { vb: [110, 130], svg: `
      <path class="o" fill="#d9eef9" d="M14 86 Q8 50 30 44 Q26 26 40 24 Q52 24 52 36 Q74 32 92 48 Q104 62 98 86Z"/>
      <circle class="o" cx="36" cy="22" r="6" fill="#d9eef9"/>
      <circle cx="40" cy="36" r="2" fill="#3b2c24" opacity=".6"/>
      <path fill="#fff" opacity=".7" d="M24 60 Q30 48 40 46 Q30 56 28 70Z"/>
      <path class="o" fill="#b9d3e8" d="M6 86 L104 86 L100 126 L10 126Z"/>
      <text x="55" y="118" text-anchor="middle" font-family="Patrick Hand, sans-serif" font-size="34" fill="#3b2c24">5</text>` },
    ice_sculpt_penguin: { vb: [70, 110], svg: `
      <ellipse class="o" cx="35" cy="46" rx="16" ry="22" fill="#d9eef9"/>
      <path class="o" fill="#d9eef9" d="M20 46 Q14 56 20 60Z M50 46 Q56 56 50 60Z"/>
      <path class="o" fill="#b9d3e8" d="M30 34 L40 34 L35 40Z"/>
      <path fill="#fff" opacity=".7" d="M26 40 Q28 32 34 30 Q28 38 28 50Z"/>
      <path class="o" fill="#b9d3e8" d="M8 68 L62 68 L60 106 L10 106Z"/>
      <text x="35" y="99" text-anchor="middle" font-family="Patrick Hand, sans-serif" font-size="34" fill="#3b2c24">7</text>` },
    ice_sculpt_seal: { vb: [100, 120], svg: `
      <path class="o" fill="#d9eef9" d="M14 74 Q8 54 24 46 Q40 36 56 44 Q76 54 86 66 L94 58 L92 76 Q60 82 14 74Z"/>
      <circle cx="28" cy="54" r="2" fill="#3b2c24" opacity=".6"/>
      <path fill="#fff" opacity=".7" d="M24 66 Q34 52 48 50 Q36 58 34 70Z"/>
      <path class="o" fill="#b9d3e8" d="M6 76 L94 76 L90 116 L10 116Z"/>
      <text x="50" y="108" text-anchor="middle" font-family="Patrick Hand, sans-serif" font-size="32" fill="#3b2c24">2</text>` },
    crystal: { vb: [80, 110], svg: `
      <circle cx="40" cy="50" r="40" fill="url(#glow-cool)"/>
      <path class="o" fill="#c9b3f0" d="M40 4 L66 40 L40 104 L14 40Z"/>
      <path class="o" fill="#9fd4f2" d="M40 4 L52 40 L40 104 L28 40Z"/>
      <path class="thin" d="M14 40 L66 40"/>
      <path fill="#fff" opacity=".7" d="M30 30 L38 14 L36 34Z"/>
      ${draw.sparkle(68, 16, .7, '#fff')}${draw.sparkle(12, 70, .6, '#fff')}` },
    crystal_open: { vb: [80, 110], svg: `
      <path class="o" fill="#c9b3f0" d="M14 40 L30 40 L40 104Z"/>
      <path class="o" fill="#9fd4f2" d="M50 40 L66 40 L40 104Z"/>
      <path class="o" fill="#c9b3f0" d="M8 30 L24 6 L34 34Z M72 30 L56 6 L46 34Z"/>
      ${draw.sparkle(40, 50, 1, '#fff')}` },
    torch_unlit: { vb: [50, 120], svg: `
      <path class="o" fill="#5b6b7a" d="M6 70 L44 70 L40 80 L10 80Z"/>
      <path class="o" fill="#8a5a3a" d="M18 36 L32 36 L28 116 L22 116Z"/>
      <path class="o" fill="#5a4a40" d="M12 24 Q25 14 38 24 L34 40 L16 40Z"/>
      <path class="thin" opacity=".5" d="M16 30 q9 -4 18 0"/>` },
    vault_door: { vb: [130, 150], svg: `
      <path class="o" fill="#bcd6ea" d="M4 146 L4 60 Q4 4 65 4 Q126 4 126 60 L126 146Z"/>
      <path class="o" fill="#9fc4e4" d="M18 146 L18 64 Q18 18 65 18 Q112 18 112 64 L112 146Z"/>
      <circle class="o" cx="65" cy="80" r="26" fill="#e8f6ff"/>
      <circle class="o" cx="65" cy="80" r="16" fill="#cfe9f7"/>
      <path class="thick line" d="M65 64 L65 96 M49 80 L81 80"/>
      <rect class="o" x="44" y="110" width="42" height="26" rx="4" fill="#efe3cf"/>
      <text x="65" y="130" text-anchor="middle" font-family="Patrick Hand, sans-serif" font-size="18" fill="#3b2c24">_ _ _</text>
      <path fill="#fff" opacity=".7" d="M28 60 Q36 30 60 24 Q40 40 36 70Z"/>` },
    telescope: { vb: [120, 130], svg: `
      <path class="thick line" d="M60 70 L36 126 M60 70 L84 126 M60 70 L60 126"/>
      <path class="o" fill="#d9573b" d="M14 60 L92 20 L100 36 L22 76Z"/>
      <path class="o" fill="#f2b544" d="M88 16 L110 6 L118 24 L96 34Z"/>
      <path class="o" fill="#f2b544" d="M8 64 L20 58 L26 72 L14 78Z"/>
      <circle class="o" cx="60" cy="48" r="5" fill="#5b6b7a"/>` },
    snowman: { vb: [100, 140], svg: `
      <circle class="o" cx="50" cy="104" r="32" fill="#f7fbff"/>
      <circle class="o" cx="50" cy="56" r="24" fill="#f7fbff"/>
      <path class="o" fill="#d9573b" d="M30 74 Q50 84 70 74 L72 82 Q50 92 28 82Z"/>
      <path class="o" fill="#d9573b" d="M60 80 L66 100 L56 100Z"/>
      ${eyes(50, 50, 1, 7)}
      <path class="o" fill="#f2a03b" d="M50 56 L66 60 L50 62Z"/>
      <path class="o" fill="#3d4a5c" d="M30 36 L70 36 L66 30 L62 8 L38 8 L34 30Z"/>
      <circle cx="50" cy="96" r="3" fill="#3b2c24"/><circle cx="50" cy="112" r="3" fill="#3b2c24"/>
      <path class="thick line" stroke="#8a5a3a" d="M24 92 L4 76 M76 92 L96 76"/>
      <path class="thick line" d="M24 92 L4 76 M10 80 L4 86 M76 92 L96 76 M90 80 L96 86"/>` },
    ice_block_crown: { vb: [130, 120], svg: `
      <path class="o" fill="#b9dcf2" d="M84 34 L120 18 L120 92 L84 112Z"/>
      <path class="o" fill="#e3f3fc" d="M10 34 L46 16 L120 18 L84 34Z"/>
      <path class="o" fill="#cfe9f7" d="M10 34 L84 34 L84 112 L10 112Z"/>
      <g opacity=".8">
        <path class="o" fill="#f2b544" d="M24 92 L22 60 L35 74 L47 52 L59 74 L72 60 L70 92Z"/>
        <circle cx="47" cy="80" r="4.5" fill="#d9573b"/>
      </g>
      <path fill="#fff" opacity=".65" d="M16 42 L40 40 L20 70Z M90 40 L104 32 L92 60Z"/>
      <path class="thin" opacity=".4" d="M60 40 l-8 16 M30 100 l10 -8"/>
      ${draw.sparkle(118, 12, .8, '#fff')}${draw.sparkle(8, 26, .6, '#fff')}` },
    puddle: { vb: [130, 60], svg: `
      <path class="o" fill="#9fd4f2" d="M10 36 Q20 14 60 18 Q110 10 122 32 Q118 52 70 50 Q20 56 10 36Z"/>
      <path class="thin" stroke="#fff" d="M40 30 q10 -4 20 0 M80 34 q8 -3 16 0"/>` },
    item_wand: { vb: [100, 100], svg: `
      <path class="o" fill="#b48ad6" d="M16 92 L66 36 L72 42 L22 98Z"/>
      ${draw.star(74, 28, 20, '#f2c94c')}
      <path fill="url(#shine)" d="M66 14 L74 10 L70 26Z"/>
      ${draw.sparkle(30, 30, .7, '#9fd4f2')}${draw.sparkle(94, 60, .6, '#9fd4f2')}` },
    item_crown: { vb: [100, 100], svg: `
      <path class="o" fill="#f2b544" d="M14 76 L10 30 L32 52 L50 22 L68 52 L90 30 L86 76Z"/>
      <path class="o" fill="#e0a23a" d="M14 76 L86 76 L86 88 L14 88Z"/>
      <circle class="o" cx="50" cy="62" r="7" fill="#d9573b"/><circle class="o" cx="30" cy="66" r="5" fill="#6fa8dc"/><circle class="o" cx="70" cy="66" r="5" fill="#6fa8dc"/>
      <circle class="o" cx="10" cy="28" r="4" fill="#fff3c4"/><circle class="o" cx="50" cy="20" r="4" fill="#fff3c4"/><circle class="o" cx="90" cy="28" r="4" fill="#fff3c4"/>
      <path fill="url(#shine)" d="M18 72 L16 40 L30 56Z"/>` },
    item_torch: { vb: [100, 100], svg: `
      <path class="o" fill="#8a5a3a" d="M44 40 L58 40 L54 96 L48 96Z"/>
      <path class="o" fill="#5a4a40" d="M38 30 Q51 22 64 30 L60 44 L42 44Z"/>` },
    item_torch_lit: { vb: [100, 100], svg: `
      <circle cx="51" cy="26" r="26" fill="url(#glow-warm)"/>
      <path class="o" fill="#8a5a3a" d="M44 44 L58 44 L54 98 L48 98Z"/>
      <path class="o" fill="#5a4a40" d="M38 36 Q51 28 64 36 L60 48 L42 48Z"/>
      <path class="o" fill="#f2a03b" d="M40 36 Q34 16 50 4 Q50 16 56 18 Q58 8 64 6 Q70 24 62 36Z"/>
      <path class="o" fill="#f2c94c" d="M46 36 Q44 26 52 18 Q54 26 58 28 Q60 32 56 36Z"/>` },
    coins: { vb: [100, 60], svg: `
      <ellipse class="o" cx="30" cy="44" rx="20" ry="8" fill="#f2b544"/><ellipse class="o" cx="30" cy="38" rx="20" ry="8" fill="#f2b544"/>
      <ellipse class="o" cx="66" cy="46" rx="20" ry="8" fill="#f2b544"/><ellipse class="o" cx="62" cy="38" rx="20" ry="8" fill="#f2b544"/><ellipse class="o" cx="58" cy="30" rx="20" ry="8" fill="#f2b544"/>
      ${draw.sparkle(86, 16, .7)}` },
  });
  ART.princess_happy = ART.princess;
  ART.reindeer_happy = { vb: ART.reindeer.vb, svg: ART.reindeer.svg + `<path class="o" fill="#d9573b" d="M54 66 Q62 76 70 68 L68 76 Q62 82 54 76Z"/>${draw.sparkle(18, 18, .8)}${draw.sparkle(118, 40, .7)}` };

  const color = (c, label) => ({ color: c, label });
  const ROT = '#d9573b', GELB = '#f2c94c', BLAU = '#4f7fb8', GRUEN = '#7fcf8f', LILA = '#b48ad6';

  WORLDS.push({
    id: 'nordpol',
    name: 'Nordpol',
    cover: 'cover_nordpol',
    adventures: [
      /* ============ Kapitel 1 ============ */
      {
        id: 'iglu',
        title: 'Gefangen im Iglu',
        thumb: 'bg_iglu',
        intro: 'Brrr! Ein Schneesturm hat die Iglu-Tür zugeweht und jemand hat sie abgeschlossen. Du musst den Eisschlüssel finden!',
        outro: 'Die Tür springt auf und draußen glitzert der Schnee. Du bist frei!',
        start: 'iglu',
        items: {
          stock: { name: 'Stock', art: 'item_stock' },
          schnur: { name: 'Angelschnur', art: 'item_schnur' },
          angel: { name: 'Angel', art: 'item_angel' },
          schluessel: { name: 'Eisschlüssel', art: 'key_ice' },
        },
        combos: [{ a: 'stock', b: 'schnur', gives: 'angel', text: 'Du knotest die Schnur an den Stock. Fertig ist eine Angel!' }],
        pages: {
          iglu: {
            name: 'Im Iglu',
            bg: 'bg_iglu',
            fx: 'warm',
            objects: [
              { id: 'lampe', art: 'oil_lamp', x: 50, y: 14, w: 6, static: true },
              { id: 'fenster', art: 'iglu_window', x: 50, y: 37, w: 15, name: 'Fenster', goto: 'fenster' },
              { id: 'regal', art: 'shelf', x: 17, y: 46, w: 20, name: 'Regal', goto: 'regal' },
              { id: 'tuer', art: 'iglu_door', x: 85, y: 55, w: 18, name: 'Tür',
                needs: ['schluessel'], needText: 'Die Tür ist abgeschlossen. Das Schlüsselloch ist ganz vereist – hier passt nur ein Eisschlüssel.', win: true },
              { id: 'bett', art: 'bed_fur', x: 37, y: 76, w: 32, name: 'Fellbett',
                give: 'stock', okText: 'Du schaust unter das kuschelige Fellbett … da liegt ein langer Stock!', doneText: 'Ein kuscheliges Fellbett. Gähn!' },
              { id: 'eisloch', art: 'ice_hole', x: 68, y: 86, w: 19, name: 'Eisloch',
                needs: ['angel'], needText: 'Ein Eisloch! Ganz unten im Wasser glitzert etwas. Mit der Hand kommst du nicht dran – viel zu tief und zu kalt!',
                give: 'schluessel', okText: 'Du hältst die Angel ins Wasser … ein Ruck … du hast etwas! Am Haken hängt der Eisschlüssel!', doneText: 'Nur noch kaltes, dunkles Wasser.' },
              { id: 'fuchs', art: 'fox_arctic', x: 85, y: 89, w: 13, name: 'Polarfuchs',
                say: 'Der kleine Polarfuchs gähnt: „Ich hab’s gesehen! Der Schlüssel ist ins Eisloch gefallen. Plumps!“', note: 'Der Fuchs sagt: Der Schlüssel liegt im Eisloch.' },
            ],
          },
          regal: {
            name: 'Das Regal',
            bg: 'bg_shelf',
            back: 'iglu',
            enter: 'Du schaust dir das Regal ganz genau an.',
            objects: [
              { id: 'buch', art: 'book_blue', x: 30, y: 31, w: 20, name: 'Buch',
                say: 'Im Buch steht: „Mein geheimer Kisten-Code: Zähle draußen die Pinguine, dann die Robben, dann die Fische!“',
                note: 'Kisten-Code: Zähle draußen Pinguine, dann Robben, dann Fische.' },
              { id: 'kekse', art: 'jar_cookies', x: 20, y: 68, w: 11, name: 'Keksdose', say: 'Mmmh, Kekse! Lecker – aber kein Hinweis.' },
              { id: 'kiste', art: 'chest', x: 62, y: 68, w: 26, name: 'Kiste',
                puzzle: { type: 'code', prompt: 'Die Kiste hat ein Zahlenschloss mit drei Zahlen.', answer: '324' },
                give: 'schnur', become: 'chest_open', okText: 'Klick! Die Kiste ist offen. Darin liegt eine Angelschnur mit Haken.', doneText: 'Die Kiste ist leer.' },
            ],
          },
          fenster: {
            name: 'Blick aus dem Fenster',
            bg: 'bg_icesea',
            fx: 'snow',
            back: 'iglu',
            enter: 'Draußen auf dem Eismeer ist ganz schön was los!',
            objects: [
              { id: 'p1', art: 'penguin', x: 18, y: 57, w: 6, static: true },
              { id: 'p2', art: 'penguin', x: 25, y: 59, w: 5.5, static: true },
              { id: 'p3', art: 'penguin', x: 72, y: 70, w: 6, static: true },
              { id: 'r1', art: 'seal', x: 54, y: 49, w: 12, static: true },
              { id: 'r2', art: 'seal', x: 84, y: 73, w: 10, static: true },
              { id: 'f1', art: 'fish_jump', x: 36, y: 82, w: 7, static: true },
              { id: 'f2', art: 'fish_jump', x: 22, y: 41, w: 6, static: true, rot: -15 },
              { id: 'f3', art: 'fish_jump', x: 62, y: 87, w: 6, static: true, rot: 10 },
              { id: 'f4', art: 'fish_jump', x: 80, y: 47, w: 6, static: true, rot: -8 },
            ],
          },
        },
        hints: [
          { until: 'buch', text: 'Schau dir das Regal genauer an. Da liegt ein Buch.' },
          { until: 'kiste', text: 'Schau aus dem Fenster und zähle: Wie viele Pinguine? Wie viele Robben? Wie viele Fische?' },
          { until: 'bett', text: 'Hast du schon unter dem Bett nachgeschaut?' },
          { until: 'combo:angel', text: 'Tippe im Rucksack auf den Stock und danach auf die Schnur.' },
          { until: 'eisloch', text: 'Mit der Angel kommst du an den Schlüssel im Eisloch.' },
          { until: 'tuer', text: 'Du hast den Schlüssel – schnell zur Tür!' },
        ],
      },

      /* ============ Kapitel 2 ============ */
      {
        id: 'stall',
        title: 'Der Rentierstall',
        thumb: 'bg_stable',
        intro: 'Du willst mit dem Rentier-Schlitten nach Hause fahren. Aber Rentier Moritz ist hungrig und die Schlittenglocke ist weg!',
        outro: 'Klingeling! Moritz zieht den Schlitten und ihr saust durch den glitzernden Schnee davon!',
        start: 'stall',
        items: {
          schere: { name: 'Schere', art: 'item_scissors' },
          karotten: { name: 'Karotten', art: 'item_carrots' },
          glocke: { name: 'Schlittenglocke', art: 'item_bell' },
        },
        pages: {
          stall: {
            name: 'Im Stall',
            bg: 'bg_stable',
            fx: 'dust',
            objects: [
              { id: 'laterne', art: 'lantern_hanging', x: 24, y: 16, w: 6, static: true },
              { id: 'leiter', art: 'ladder', x: 90, y: 42, w: 8, name: 'Leiter zum Heuboden', goto: 'heuboden' },
              { id: 'werkbank', art: 'workbench', x: 15, y: 66, w: 24, name: 'Werkbank', goto: 'werkbank' },
              { id: 'rentier', art: 'reindeer', x: 44, y: 57, w: 30, name: 'Rentier Moritz',
                needs: ['karotten'], needText: 'Rentier Moritz lässt die Ohren hängen. Sein Bauch knurrt ganz laut: Grrrummel!',
                become: 'reindeer_happy', okText: 'Mampf, mampf! Moritz ist satt und stampft fröhlich mit den Hufen. Er ist bereit!', doneText: 'Moritz kann es kaum erwarten loszufahren.' },
              { id: 'schlitten', art: 'sleigh', x: 73, y: 77, w: 30, name: 'Schlitten',
                after: ['rentier'], afterText: 'Ohne Rentier fährt der Schlitten nicht. Und Moritz ist viel zu hungrig zum Ziehen.',
                needs: ['glocke'], needText: 'Moritz ist bereit! Aber ohne Glocke darf kein Schlitten fahren – sonst hört euch niemand kommen.', win: true },
            ],
          },
          heuboden: {
            name: 'Der Heuboden',
            bg: 'bg_hayloft',
            fx: 'dust',
            back: 'stall',
            enter: 'Oben auf dem Heuboden riecht es nach Sommer.',
            objects: [
              { id: 'schals', art: 'scarves_hooks', x: 26, y: 30, w: 30, name: 'Schals',
                say: 'An den Haken hängen drei Schals: zuerst ein roter, dann ein gelber, dann ein blauer.',
                note: 'Schals am Haken: Rot – Gelb – Blau.' },
              { id: 'eule', art: 'owl', x: 79, y: 31, w: 9, name: 'Schneeeule',
                say: 'Die Schneeeule blinzelt: „Huhu! Die Farben der Schals öffnen etwas unten im Stall.“' },
              { id: 'sack', art: 'sack_tied', x: 22, y: 76, w: 16, name: 'Sack',
                needs: ['schere'], needText: 'Ein Sack voller Karotten! Aber er ist mit einem dicken Knoten zugebunden. So geht er nicht auf.',
                give: 'karotten', become: 'sack_open', okText: 'Schnipp! Du schneidest die Schnur durch und holst ein Bund Karotten heraus.', doneText: 'Der Sack ist offen.' },
              { id: 'raetselkiste', art: 'chest', x: 54, y: 78, w: 20, name: 'Kiste',
                puzzle: { type: 'choice', prompt: 'Auf der Kiste steht ein Rätsel: Was wird nasser, je mehr es trocknet?',
                  options: [{ art: 'sun', label: 'Sonne' }, { art: 'towel', label: 'Handtuch' }, { art: 'umbrella', label: 'Schirm' }], answer: 1 },
                give: 'glocke', become: 'chest_open', okText: 'Richtig, das Handtuch! Die Kiste springt auf. Darin liegt eine goldene Schlittenglocke!', doneText: 'Die Kiste ist leer.' },
            ],
          },
          werkbank: {
            name: 'Die Werkbank',
            bg: 'bg_workbench',
            fx: 'dust',
            back: 'stall',
            objects: [
              { id: 'zettel', art: 'note', x: 82, y: 33, w: 11, name: 'Zettel', rot: 6,
                say: 'Auf dem Zettel steht: „Die Farben für die Schublade hängen oben am Haken.“',
                note: 'Die Schublade an der Werkbank braucht drei Farben.' },
              { id: 'schublade', art: 'drawer_colors', x: 50, y: 78, w: 36, name: 'Schublade',
                puzzle: { type: 'wheels', prompt: 'Die Schublade hat drei Farbräder. Stelle die richtigen Farben ein!',
                  options: [color(BLAU, 'Blau'), color(ROT, 'Rot'), color(GRUEN, 'Grün'), color(GELB, 'Gelb')], answer: [1, 3, 0] },
                give: 'schere', become: 'drawer_open', okText: 'Klack! Die Schublade geht auf. Darin liegt eine Schere.', doneText: 'Die Schublade ist leer.' },
            ],
          },
        },
        hints: [
          { until: 'zettel', text: 'Schau dir die Werkbank genauer an.' },
          { until: 'schals', text: 'Klettere die Leiter hoch auf den Heuboden.' },
          { until: 'schublade', text: 'Stelle an der Schublade die Farben der Schals ein: rot, gelb, blau.' },
          { until: 'sack', text: 'Mit der Schere kannst du den Sack auf dem Heuboden aufschneiden.' },
          { until: 'rentier', text: 'Gib Moritz die Karotten.' },
          { until: 'raetselkiste', text: 'Die Kiste auf dem Heuboden hat ein Rätsel. Womit trocknest du dich nach dem Baden ab?' },
          { until: 'schlitten', text: 'Jetzt ab zum Schlitten!' },
        ],
      },

      /* ============ Kapitel 3 ============ */
      {
        id: 'eispalast',
        title: 'Der Eispalast',
        thumb: 'bg_throne',
        intro: 'Prinzessin Flocke ist traurig: Ein frecher Schneesturm hat ihre Krone und ihren Zauberstab im Palast versteckt. Ohne sie kann sie das Palasttor nicht öffnen!',
        outro: 'Prinzessin Flocke setzt die Krone auf, schwingt den Zauberstab – und das Palasttor öffnet sich mit einem Glitzern. Danke, Held!',
        start: 'thron',
        items: {
          fackel: { name: 'Fackel (aus)', art: 'item_torch' },
          fackel_an: { name: 'Brennende Fackel', art: 'item_torch_lit' },
          zauberstab: { name: 'Zauberstab', art: 'item_wand' },
          krone: { name: 'Krone', art: 'item_crown' },
        },
        pages: {
          thron: {
            name: 'Der Thronsaal',
            bg: 'bg_throne',
            fx: 'glitter',
            objects: [
              { id: 'prinzessin', art: 'princess', x: 50, y: 59, w: 19, name: 'Prinzessin Flocke',
                needs: ['krone', 'zauberstab'], needText: 'Prinzessin Flocke schnieft: „Bitte finde meine Krone und meinen Zauberstab! Sie sind irgendwo im Palast.“', win: true },
              { id: 'kamin', art: 'fireplace', x: 16, y: 66, w: 22, name: 'Kamin',
                needs: ['fackel'], needText: 'Im Kamin knistert ein warmes Feuer. Hier könnte man etwas anzünden …',
                give: 'fackel_an', okText: 'Fwuuusch! Du hältst die Fackel ins Feuer. Jetzt brennt sie hell!', doneText: 'Das Feuer knistert gemütlich.' },
              { id: 'teppich', art: 'tapestry', x: 82, y: 33, w: 13, name: 'Wandteppich',
                say: 'Auf den Wandteppich ist gestickt: „Das Eistor öffnet, wer die Zahlen der Eisfiguren vom kleinsten zum größten Tier liest.“',
                note: 'Eistor: Zahlen der Eisfiguren vom kleinsten zum größten Tier lesen.' },
              { id: 'balkontuer', art: 'balcony_door', x: 27, y: 31, w: 11, name: 'Balkontür', goto: 'balkon' },
              { id: 'zumgang', art: 'nav_right', x: 92, y: 89, w: 9, name: 'Zum Spiegelgang', goto: 'gang' },
            ],
          },
          gang: {
            name: 'Der Spiegelgang',
            bg: 'bg_mirrors',
            fx: 'glitter',
            back: 'thron',
            enter: 'Im Spiegelgang stehen drei Eisfiguren auf Sockeln.',
            objects: [
              { id: 'fackel', art: 'torch_unlit', x: 13, y: 47, w: 5, name: 'Fackel',
                give: 'fackel', remove: true, okText: 'Du nimmst die Fackel von der Wand. Leider brennt sie nicht.' },
              { id: 'kristall', art: 'crystal', x: 50, y: 25, w: 9, name: 'Kristall',
                puzzle: { type: 'sequence', prompt: 'Der Kristall funkelt in Himmelsfarben. Tippe die Farben in der richtigen Reihenfolge!',
                  options: [color(GRUEN, 'Grün'), color(BLAU, 'Blau'), color(LILA, 'Lila'), color(GELB, 'Gelb')], answer: [0, 1, 2, 1] },
                give: 'zauberstab', become: 'crystal_open', okText: 'Der Kristall klingt wie ein Glöckchen und springt auf. Darin liegt der Zauberstab!', doneText: 'Der Kristall funkelt leise.' },
              { id: 'baer', art: 'ice_sculpt_bear', x: 22, y: 73, w: 17, name: 'Eisbär-Figur', say: 'Eine große Eisfigur: ein Eisbär. Auf dem Sockel steht eine 5.' },
              { id: 'pingu', art: 'ice_sculpt_penguin', x: 40, y: 75, w: 11, name: 'Pinguin-Figur', say: 'Eine kleine Eisfigur: ein Pinguin. Auf dem Sockel steht eine 7.' },
              { id: 'robbe', art: 'ice_sculpt_seal', x: 60, y: 74, w: 14, name: 'Robben-Figur', say: 'Eine mittelgroße Eisfigur: eine Robbe. Auf dem Sockel steht eine 2.' },
              { id: 'eistor', art: 'vault_door', x: 85, y: 62, w: 18, name: 'Eistor',
                puzzle: { type: 'code', prompt: 'Das Eistor hat ein Zahlenschloss mit drei Zahlen.', answer: '725' },
                goto: 'schatz', okText: 'Krrrk! Das Eistor gleitet zur Seite.', doneText: 'Das Eistor ist offen.' },
            ],
          },
          balkon: {
            name: 'Der Balkon',
            bg: 'bg_balcony',
            fx: 'snow',
            back: 'thron',
            enter: 'Wie schön! Über dem Palast tanzt das Nordlicht.',
            objects: [
              { id: 'fernrohr', art: 'telescope', x: 72, y: 62, w: 16, name: 'Fernrohr',
                say: 'Durchs Fernrohr siehst du die Lichter am Himmel genau: von links Grün, dann Blau, dann Lila und dann wieder Blau.',
                note: 'Nordlicht: Grün – Blau – Lila – Blau.' },
              { id: 'schneemann', art: 'snowman', x: 30, y: 68, w: 13, name: 'Schneemann',
                say: 'Der Schneemann flüstert: „Pssst! Der Kristall im Spiegelgang liebt die Farben des Himmels.“' },
            ],
          },
          schatz: {
            name: 'Die Schatzkammer',
            bg: 'bg_treasury',
            fx: 'glitter',
            back: 'gang',
            enter: 'Wow, die Schatzkammer! Überall glitzert es.',
            objects: [
              { id: 'muenzen', art: 'coins', x: 22, y: 82, w: 14, name: 'Münzen', say: 'Goldmünzen! Aber du suchst etwas anderes.' },
              { id: 'eisblock', art: 'ice_block_crown', x: 52, y: 66, w: 24, name: 'Eisblock',
                needs: ['fackel_an'], needText: 'In dem dicken Eisblock ist etwas Goldenes eingefroren. Wie könntest du das Eis schmelzen?',
                give: 'krone', become: 'puddle', okText: 'Das Eis schmilzt … plitsch, platsch! Darin war die Krone der Prinzessin!', doneText: 'Nur noch eine Pfütze.' },
              { id: 'truhe', art: 'chest_open', x: 82, y: 76, w: 18, name: 'Schatztruhe', say: 'Eine offene Schatztruhe. Leer – der Schneesturm hat alles durcheinandergewirbelt!' },
            ],
          },
        },
        hints: [
          { until: 'teppich', text: 'Lies, was auf dem Wandteppich im Thronsaal steht.' },
          { until: 'fernrohr', text: 'Geh auf den Balkon und schau durchs Fernrohr.' },
          { until: 'kristall', text: 'Der Kristall im Spiegelgang will die Farben vom Nordlicht: Grün, Blau, Lila, Blau.' },
          { until: 'eistor', text: 'Tippe die Eisfiguren an. Lies die Zahlen vom kleinsten Tier (Pinguin) zum größten (Eisbär).' },
          { until: 'fackel', text: 'An der Wand im Spiegelgang hängt eine Fackel.' },
          { until: 'kamin', text: 'Zünde die Fackel am Kamin im Thronsaal an.' },
          { until: 'eisblock', text: 'Mit der brennenden Fackel schmilzt du den Eisblock in der Schatzkammer.' },
          { until: 'prinzessin', text: 'Bring Prinzessin Flocke die Krone und den Zauberstab!' },
        ],
      },
    ],
  });
})();
