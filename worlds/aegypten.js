/* ===================== Welt: Ägypten ===================== */
(() => {
  const eyes = (cx, cy, s = 1, gap = 5) => `
    <circle cx="${cx - gap * s}" cy="${cy}" r="${2 * s}" fill="#3b2c24"/><circle cx="${cx + gap * s}" cy="${cy}" r="${2 * s}" fill="#3b2c24"/>
    <circle cx="${cx - gap * s + .7 * s}" cy="${cy - .8 * s}" r="${.7 * s}" fill="#fff"/><circle cx="${cx + gap * s + .7 * s}" cy="${cy - .8 * s}" r="${.7 * s}" fill="#fff"/>`;
  const cheeks = (cx, cy, s = 1, gap = 8) => `
    <ellipse cx="${cx - gap * s}" cy="${cy}" rx="${2.6 * s}" ry="${1.6 * s}" fill="#f4a6a0" opacity=".85"/>
    <ellipse cx="${cx + gap * s}" cy="${cy}" rx="${2.6 * s}" ry="${1.6 * s}" fill="#f4a6a0" opacity=".85"/>`;
  const smile = (cx, cy, s = 1) => `<path class="thin" d="M${cx - 4 * s} ${cy} q${4 * s} ${4 * s} ${8 * s} 0"/>`;
  // Steinquader-Mauer
  const stones = (x0, y0, w, h, bw = 110, bh = 56, color = '#d8b27a') => {
    let s = `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${color}"/>`;
    for (let y = y0 + bh, row = 0; y < y0 + h; y += bh, row++) {
      s += `<path class="thin" opacity=".45" d="M${x0} ${y} L${x0 + w} ${y + 3}"/>`;
    }
    for (let y = y0, row = 0; y < y0 + h; y += bh, row++) {
      for (let x = x0 + (row % 2) * (bw / 2) + bw / 2; x < x0 + w; x += bw) s += `<path class="thin" opacity=".4" d="M${x} ${y + 3} l2 ${bh - 6}"/>`;
    }
    return s;
  };
  // Hieroglyphen-Band (Zierstreifen)
  const glyphBand = (x0, y0, w, color = '#3f7fa8') => {
    let s = `<rect class="o" x="${x0}" y="${y0}" width="${w}" height="34" fill="#f3e0b5"/>`;
    for (let x = x0 + 20, i = 0; x < x0 + w - 10; x += 46, i++) {
      const k = i % 4;
      if (k === 0) s += `<circle cx="${x}" cy="${y0 + 17}" r="8" fill="${color}" opacity=".8"/>`;
      if (k === 1) s += `<path class="thin" d="M${x - 10} ${y0 + 24} q10 -16 20 0"/>`;
      if (k === 2) s += `<path fill="#c0503a" opacity=".8" d="M${x - 8} ${y0 + 26} L${x} ${y0 + 8} L${x + 8} ${y0 + 26}Z"/>`;
      if (k === 3) s += `<path class="thin" d="M${x - 8} ${y0 + 12} h16 M${x} ${y0 + 12} v14"/>`;
    }
    return s;
  };
  const dunes = (y, color = '#f2c77e') => `<path class="o" fill="${color}" d="M-10 ${y} Q150 ${y - 50} 320 ${y - 10} Q500 ${y - 60} 650 ${y - 20} Q740 ${y - 40} 810 ${y - 10} L810 610 L-10 610Z"/>`;

  // Hieroglyphen-Symbole (für Wandbild und Räder)
  const SYM = {
    eg_sym_sun: `<circle class="o" cx="50" cy="50" r="24" fill="#f2b544"/><circle cx="50" cy="50" r="8" fill="#d9573b"/>
      <path class="thick line" stroke="#f2a03b" d="M50 10 v10 M50 80 v10 M10 50 h10 M80 50 h10"/>`,
    eg_sym_eye: `<path class="o" fill="#fbf3e4" d="M10 50 Q50 18 90 50 Q50 76 10 50Z"/><circle class="o" cx="50" cy="48" r="12" fill="#3f7fa8"/><circle cx="50" cy="48" r="5" fill="#3b2c24"/>
      <path class="thick line" d="M36 66 Q34 84 44 88 M60 64 L74 86"/>`,
    eg_sym_bird: `<path class="o" fill="#3f7fa8" d="M22 70 Q20 40 46 30 Q56 18 70 24 L84 22 L74 32 Q76 58 52 72 L60 88 L48 88 L44 74Z"/>
      <circle cx="66" cy="30" r="2.6" fill="#fbf3e4"/><path class="thin" d="M34 54 q12 -6 22 2"/>`,
    eg_sym_snake: `<path class="thick line" stroke="#7fb069" d="M14 80 Q30 60 50 78 Q70 94 82 70 Q90 50 70 40 Q60 34 66 20"/>
      <path class="thick line" d="M14 80 Q30 60 50 78 Q70 94 82 70 Q90 50 70 40 Q60 34 66 20"/>
      <circle class="o" cx="66" cy="18" r="7" fill="#7fb069"/><circle cx="68" cy="16" r="1.6" fill="#3b2c24"/>`,
  };
  Object.entries(SYM).forEach(([k, v]) => { ART[k] = { vb: [100, 100], svg: v }; });

  Object.assign(ART, {
    /* ---------- Cover ---------- */
    cover_aegypten: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="url(#sky-desert)"/>
      <circle cx="620" cy="140" r="70" fill="#fff1b8"/><circle cx="620" cy="140" r="110" fill="url(#glow-warm)" opacity=".6"/>
      <path class="o" fill="#e2a95b" d="M120 420 L300 130 L480 420Z"/>
      <path fill="#c98a42" d="M300 130 L480 420 L360 420Z"/>
      <path class="thin" opacity=".4" d="M170 340 H430 M210 280 H390 M250 220 H350 M280 170 H320"/>
      <path class="o" fill="#e8b46a" d="M440 420 L560 230 L680 420Z"/>
      <path fill="#cf9550" d="M560 230 L680 420 L600 420Z"/>
      ${dunes(440)}
      <path class="o" fill="#c98a42" d="M560 500 Q560 470 580 466 L640 470 Q660 476 650 500Z" opacity="0"/>
      <g transform="translate(500 330) scale(2)">
        <path class="o" fill="#c99a5a" d="M10 60 Q30 20 70 30 L100 30 Q120 34 118 60Z"/>
        <path class="o" fill="#d9ad6a" d="M60 34 Q56 0 80 -6 Q104 0 100 34Z"/>
        ${eyes(80, 12, .9, 6)}${cheeks(80, 18, .8, 10)}${smile(80, 20, .8)}
      </g>` },

    /* ---------- Kapitel 1: Pyramide ---------- */
    eg_bg_gang: { vb: [800, 600], bg: true, svg: `
      ${stones(0, 0, 800, 440)}
      ${glyphBand(0, 60, 800)}
      <path class="o" fill="#c49a62" d="M-10 430 L810 430 L810 610 L-10 610Z"/>
      ${stones(0, 440, 800, 170, 160, 60, '#c49a62')}
      <path class="o" fill="#b58a52" d="M-10 0 L60 0 L60 440 L-10 440Z M740 0 L810 0 L810 440 L740 440Z"/>
      ${draw.grain(0, 0, 0, 0, 0)}` },
    eg_bg_kammer: { vb: [800, 600], bg: true, svg: `
      ${stones(0, 0, 800, 440, 120, 60, '#d4ab70')}
      <circle cx="400" cy="200" r="300" fill="url(#glow-warm)" opacity=".45"/>
      ${glyphBand(0, 30, 800, '#2e8a8a')}
      ${[70, 730].map((x) => `<path class="o" fill="#e9c98f" d="M${x - 34} 440 L${x - 28} 80 L${x + 28} 80 L${x + 34} 440Z"/>
        <path class="o" fill="#2e8a8a" d="M${x - 44} 64 Q${x} 40 ${x + 44} 64 L${x + 40} 84 L${x - 40} 84Z"/>
        <path class="thin" opacity=".5" d="M${x - 14} 100 L${x - 12} 430 M${x + 12} 100 L${x + 14} 430"/>`).join('')}
      <path class="o" fill="#c49a62" d="M-10 430 L810 430 L810 610 L-10 610Z"/>
      <path class="o" fill="#3f7fa8" d="M250 610 L300 470 L500 470 L550 610Z" opacity=".85"/>
      <path class="thin" stroke="#f2b544" d="M270 600 L310 478 M530 600 L490 478" style="stroke-width:3px"/>` },
    eg_bg_wandbild: { vb: [800, 600], bg: true, svg: `
      ${stones(0, 0, 800, 600, 140, 70, '#c99f66')}
      <rect class="o" x="50" y="40" width="700" height="520" rx="6" fill="#f0d9a8"/>
      <rect class="o" x="66" y="56" width="668" height="488" fill="#f6e6c2"/>
      ${glyphBand(66, 56, 668, '#2e8a8a')}
      ${glyphBand(66, 510, 668, '#2e8a8a')}
      <path class="thin" opacity=".5" d="M120 320 H700"/>
      <path fill="#3f7fa8" opacity=".25" d="M80 330 Q200 300 400 330 T720 330 L720 360 L80 360Z"/>` },

    eg_lamp: { vb: [70, 90], svg: `
      <circle cx="35" cy="30" r="34" fill="url(#glow-warm)"/>
      <path class="o" fill="#f2a03b" d="M35 6 Q46 20 40 32 Q35 38 30 32 Q24 20 35 6Z"/>
      <path class="o" fill="#f2c94c" d="M35 16 Q40 24 37 30 Q35 32 33 30 Q30 24 35 16Z"/>
      <path class="o" fill="#c98a42" d="M8 44 Q35 34 62 44 Q60 62 35 64 Q12 62 8 44Z"/>
      <path class="o" fill="#e2a95b" d="M30 64 L40 64 L44 84 L26 84Z"/>
      <path class="thin" d="M62 46 q8 -2 6 8"/>` },
    eg_glyph_tablet: { vb: [180, 110], svg: `
      <rect class="o" x="6" y="6" width="168" height="98" rx="6" fill="#f3e0b5"/>
      <rect class="thin" x="14" y="14" width="152" height="82" rx="4"/>
      <g transform="translate(16 26) scale(.5)">${SYM.eg_sym_sun}</g>
      <path class="thin" d="M70 54 l8 0 m-4 -4 l4 4 l-4 4"/>
      <g transform="translate(66 26) scale(.5)">${SYM.eg_sym_eye}</g>
      <path class="thin" d="M120 54 l8 0 m-4 -4 l4 4 l-4 4"/>
      <g transform="translate(116 26) scale(.5)">${SYM.eg_sym_bird}</g>` },
    eg_stone_door: { vb: [120, 160], svg: `
      <path class="o" fill="#b58a52" d="M4 156 L4 20 L116 20 L116 156Z"/>
      <path class="o" fill="#e9c98f" d="M0 8 L120 8 L120 26 L0 26Z"/>
      <path class="o" fill="#c9a06a" d="M18 156 L18 36 L102 36 L102 156Z"/>
      <path class="thin" opacity=".5" d="M60 36 L60 156 M18 96 H102"/>
      <rect class="o" x="30" y="56" width="60" height="26" rx="4" fill="#f3e0b5"/>
      <circle class="thin" cx="44" cy="69" r="7"/><circle class="thin" cx="60" cy="69" r="7"/><circle class="thin" cx="76" cy="69" r="7"/>
      <path fill="#3f7fa8" d="M54 12 L66 12 L60 22Z"/>` },
    eg_stone_door_open: { vb: [120, 160], svg: `
      <path class="o" fill="#b58a52" d="M4 156 L4 20 L116 20 L116 156Z"/>
      <path class="o" fill="#e9c98f" d="M0 8 L120 8 L120 26 L0 26Z"/>
      <path class="o" fill="#4a3424" d="M18 156 L18 36 L102 36 L102 156Z"/>
      <circle cx="60" cy="110" r="40" fill="url(#glow-warm)" opacity=".6"/>
      <path class="o" fill="#c9a06a" d="M18 36 L36 36 L36 156 L18 156Z"/>` },
    eg_vase: { vb: [80, 110], svg: `
      <path class="o" fill="#2e8a8a" d="M26 6 L54 6 L50 20 Q76 34 72 66 Q68 98 40 104 Q12 98 8 66 Q4 34 30 20Z"/>
      <path class="o" fill="#f3e0b5" d="M10 52 Q40 46 70 52 L70 64 Q40 58 10 64Z"/>
      <path fill="#3f7fa8" opacity=".8" d="M22 56 h6 v4 h-6z M38 54 h6 v4 h-6z M54 56 h6 v4 h-6z"/>
      <path fill="url(#shine)" d="M18 40 Q24 30 34 28 Q24 40 22 70Z"/>` },
    eg_mummy_cat: { vb: [100, 120], svg: `
      <path class="o" fill="#efe3cf" d="M24 116 Q16 70 30 52 L70 52 Q84 70 76 116Z"/>
      <path class="thin" opacity=".55" d="M24 70 L76 64 M22 84 L78 80 M24 98 L76 94 M28 108 L72 108 M30 60 L70 76"/>
      <path class="o" fill="#efe3cf" d="M76 110 Q96 96 88 72 Q84 66 80 72 Q86 92 72 100Z"/>
      <path class="o" fill="#efe3cf" d="M22 30 L18 4 L38 20 Q50 16 62 20 L82 4 L78 30 Q82 58 50 60 Q18 58 22 30Z"/>
      <path class="thin" opacity=".5" d="M24 28 L76 24 M22 42 L78 46"/>
      <path class="o" fill="#f4c3cf" d="M22 10 L34 22 L24 24Z M78 10 L66 22 L76 24Z"/>
      ${eyes(50, 36, 1.1, 10)}${cheeks(50, 44, 1, 16)}
      <path class="o" fill="#e9785c" d="M47 41 L53 41 L50 44Z"/>
      <path class="thin" d="M44 47 q3 3 6 0 q3 3 6 0"/>` },
    eg_cat_paint: { vb: [70, 90], svg: `
      <path class="o" fill="#3b3346" d="M18 86 Q12 52 26 40 L22 16 L32 28 L44 28 L54 16 L50 40 Q62 54 56 86Z"/>
      <path class="thick line" stroke="#3b3346" d="M56 80 Q70 70 64 56"/>
      <path class="thick line" d="M56 80 Q70 70 64 56"/>
      <circle cx="32" cy="36" r="2.6" fill="#f2b544"/><circle cx="44" cy="36" r="2.6" fill="#f2b544"/>
      <path class="o" fill="#f2b544" d="M26 52 Q38 58 50 52 L48 58 Q38 62 28 58Z"/>` },
    eg_scarab_paint: { vb: [70, 70], svg: `
      <ellipse class="o" cx="35" cy="40" rx="18" ry="22" fill="#2e8a8a"/>
      <path class="thin" d="M35 20 L35 62"/>
      <ellipse class="o" cx="35" cy="18" rx="10" ry="7" fill="#226b6b"/>
      <path class="thin" d="M17 34 L6 26 M17 46 L4 46 M19 56 L8 64 M53 34 L64 26 M53 46 L66 46 M51 56 L62 64"/>
      <circle class="o" cx="35" cy="6" r="5" fill="#f2b544"/>` },
    eg_gate: { vb: [140, 160], svg: `
      <path class="o" fill="#e9c98f" d="M0 6 L140 6 L140 28 L0 28Z"/>
      <path class="o" fill="#c49a62" d="M8 28 L28 28 L28 158 L8 158Z M112 28 L132 28 L132 158 L112 158Z"/>
      <path class="o" fill="#8a6a44" d="M28 28 L112 28 L112 158 L28 158Z"/>
      ${[40, 58, 76, 94].map((x) => `<path class="o" fill="#5b6b7a" d="M${x} 32 L${x + 6} 32 L${x + 6} 156 L${x} 156Z"/>`).join('')}
      <path class="o" fill="#5b6b7a" d="M28 70 H112 V78 H28Z M28 120 H112 V128 H28Z"/>
      <rect class="o" x="118" y="80" width="10" height="24" rx="3" fill="#3b2c24"/>
      <path fill="#3f7fa8" d="M60 12 L80 12 L70 24Z"/>` },
    eg_item_stange: { vb: [100, 100], svg: `
      <path class="o" fill="#c9a06a" d="M14 86 L78 14 Q84 10 88 16 L22 92 Q16 94 14 86Z"/>
      <path class="thin" opacity=".6" d="M40 58 l6 6 M60 36 l6 6"/>` },
    eg_item_griff: { vb: [100, 100], svg: `
      <path class="o" fill="#f2b544" d="M30 70 Q14 40 40 24 Q66 12 76 38 L60 44 Q54 30 42 36 Q30 46 42 62Z"/>
      <circle class="o" cx="38" cy="72" r="12" fill="#3f7fa8"/>
      <path fill="url(#shine)" d="M40 30 Q50 22 60 26 Q48 30 44 40Z"/>` },
    eg_item_hebel: { vb: [100, 100], svg: `
      <path class="o" fill="#c9a06a" d="M10 90 L64 30 Q70 26 74 32 L18 96 Q12 98 10 90Z"/>
      <path class="o" fill="#f2b544" d="M62 34 Q50 10 70 6 Q92 4 94 26 L80 28 Q78 18 70 20 Q62 24 72 34Z"/>
      <circle class="o" cx="66" cy="34" r="8" fill="#3f7fa8"/>` },

    /* ---------- Kapitel 2: Grab ---------- */
    eg_bg_vorraum: { vb: [800, 600], bg: true, svg: `
      ${stones(0, 0, 800, 440, 130, 62, '#dcb47c')}
      ${glyphBand(0, 20, 800, '#3f7fa8')}
      <circle cx="400" cy="250" r="280" fill="url(#glow-warm)" opacity=".4"/>
      <path class="o" fill="#c49a62" d="M-10 430 L810 430 L810 610 L-10 610Z"/>
      ${stones(0, 440, 800, 170, 180, 60, '#c49a62')}
      ${[150, 650].map((x) => `<path class="o" fill="#5b6b7a" d="M${x - 6} 140 L${x + 6} 140 L${x + 6} 200 L${x - 6} 200Z"/><path class="o" fill="#f2a03b" d="M${x} 112 Q${x + 12} 128 ${x} 140 Q${x - 12} 128 ${x} 112Z"/><circle cx="${x}" cy="128" r="40" fill="url(#glow-warm)" opacity=".7"/>`).join('')}` },
    eg_bg_grab: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="#2c4a6a"/>
      ${stones(0, 0, 800, 440, 120, 60, '#3a5c80')}
      ${Array.from({ length: 22 }, (_, i) => draw.star(30 + (i * 137) % 760, 40 + (i * 89) % 300, 6 + (i % 3) * 2, '#f2c94c')).join('')}
      <circle cx="400" cy="320" r="260" fill="url(#glow-warm)" opacity=".35"/>
      <path class="o" fill="#c49a62" d="M-10 430 L810 430 L810 610 L-10 610Z"/>
      ${stones(0, 440, 800, 170, 180, 60, '#c49a62')}` },
    eg_bg_nilbild: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="#c99f66"/>
      <rect class="o" x="40" y="30" width="720" height="540" rx="6" fill="#f0d9a8"/>
      <rect class="o" x="60" y="50" width="680" height="500" fill="url(#sky-desert)"/>
      <circle cx="600" cy="150" r="50" fill="#fff1b8"/>
      <path class="o" fill="#e2a95b" d="M110 330 L210 180 L310 330Z"/><path class="o" fill="#e8b46a" d="M260 330 L330 220 L400 330Z"/>
      <path class="o" fill="#f2c77e" d="M60 320 Q300 290 740 320 L740 360 L60 360Z"/>
      <path class="o" fill="#3f8fbf" d="M60 360 Q400 340 740 360 L740 470 Q400 490 60 470Z"/>
      <path class="thin" stroke="#fff" opacity=".7" d="M120 400 q30 -8 60 0 M300 440 q40 -8 80 0 M560 410 q40 -8 80 0"/>
      <path class="o" fill="#e8c98f" d="M60 470 Q400 490 740 470 L740 550 L60 550Z"/>
      ${[90, 120, 680, 710].map((x) => `<path class="thin" stroke="#4f8a3a" d="M${x} 480 L${x - 6} 380" style="stroke-width:3px"/><path class="o" fill="#7fb069" d="M${x - 6} 380 l-14 -12 l18 2 l2 -16 l8 14 l12 -6 l-8 14Z"/>`).join('')}
      <text x="400" y="530" text-anchor="middle" font-family="Patrick Hand, sans-serif" font-size="34" fill="#3b2c24">Der Nil – der längste Fluss</text>` },
    eg_bg_waage: { vb: [800, 600], bg: true, svg: `
      ${stones(0, 0, 800, 600, 150, 75, '#d4ab70')}
      <circle cx="400" cy="300" r="300" fill="url(#glow-warm)" opacity=".4"/>
      ${glyphBand(0, 40, 800, '#2e8a8a')}
      <path class="o" fill="#c49a62" d="M-10 500 L810 500 L810 610 L-10 610Z"/>` },

    eg_basket: { vb: [110, 90], svg: `
      <path class="o" fill="#d7a85e" d="M8 30 L102 30 L90 84 L20 84Z"/>
      <path class="thin" opacity=".6" d="M14 44 H96 M16 58 H94 M18 72 H92 M30 30 L34 84 M52 30 L54 84 M74 30 L74 84"/>
      <path class="o" fill="#c98a42" d="M4 24 L106 24 L106 34 L4 34Z"/>
      <path class="o" fill="#e8b46a" d="M24 24 Q30 6 44 18 Q56 4 66 18 Q78 6 88 24Z"/>` },
    eg_item_scarab: { vb: [100, 100], svg: `
      <ellipse class="o" cx="50" cy="56" rx="26" ry="30" fill="#f2b544"/>
      <path class="thin" d="M50 28 L50 86"/>
      <ellipse class="o" cx="50" cy="26" rx="14" ry="10" fill="#e0a23a"/>
      <path class="thin" d="M24 50 L10 40 M24 64 L8 66 M28 78 L14 90 M76 50 L90 40 M76 64 L92 66 M72 78 L86 90"/>
      <path fill="url(#shine)" d="M34 44 Q40 34 48 34 Q40 44 40 62Z"/>
      ${draw.sparkle(84, 18, .7)}` },
    eg_painting: { vb: [130, 100], svg: `
      <rect class="o" x="4" y="4" width="122" height="92" rx="4" fill="#f2b544"/>
      <rect class="o" x="14" y="14" width="102" height="72" fill="#fde3b0"/>
      <path fill="#3f8fbf" d="M14 56 Q65 50 116 56 L116 74 L14 74Z"/>
      <path class="o" fill="#c98a42" d="M44 54 Q66 66 88 54 L84 60 Q66 66 48 60Z"/>
      <path class="thin" d="M66 54 L66 30 L80 48Z"/>
      <path class="o" fill="#e2a95b" d="M20 50 L32 32 L44 50Z"/>` },
    eg_croc: { vb: [160, 110], svg: `
      <path class="o" fill="#7fb069" d="M30 80 Q20 50 50 46 L100 44 Q130 40 150 60 Q154 72 140 74 L110 76 Q100 96 70 96 Q40 96 30 80Z"/>
      <path class="o" fill="#e8e0b0" d="M110 66 L150 62 Q150 70 140 72 L110 74Z"/>
      <path class="thin" d="M114 66 l3 4 l3 -4 l3 4 l3 -4 l3 4 l3 -4 l3 4"/>
      <path class="o" fill="#7fb069" d="M30 80 Q8 84 4 70 Q14 74 26 70Z"/>
      ${[56, 72, 88].map((x) => `<path class="o" fill="#6a9a58" d="M${x - 6} 46 L${x} 36 L${x + 6} 46Z"/>`).join('')}
      <circle class="o" cx="104" cy="44" r="9" fill="#fff"/><circle cx="106" cy="44" r="4" fill="#3b2c24"/><circle cx="107.5" cy="42.5" r="1.3" fill="#fff"/>
      <ellipse cx="96" cy="58" rx="4" ry="2.4" fill="#f4a6a0" opacity=".9"/>
      <path class="o" fill="#7fb069" d="M46 92 L52 106 L62 106 L60 94Z M84 92 L88 106 L98 106 L96 92Z"/>
      <path class="o" fill="#f2b544" d="M40 60 Q50 54 60 60 Q50 66 40 60Z" opacity=".9"/>` },
    eg_scale: { vb: [160, 130], svg: `
      <path class="o" fill="#c98a42" d="M62 120 L98 120 L92 108 L68 108Z"/>
      <path class="o" fill="#f2b544" d="M76 108 L84 108 L84 22 L76 22Z"/>
      <path class="thick line" d="M20 30 L140 22"/>
      <circle class="o" cx="80" cy="20" r="7" fill="#f2b544"/>
      <path class="thin" d="M20 30 L8 70 M20 30 L34 70 M140 22 L126 62 M140 22 L152 62"/>
      <path class="o" fill="#f2b544" d="M4 70 Q20 84 38 70Z M122 62 Q138 76 156 62Z"/>
      <path class="o" fill="#3f7fa8" d="M74 40 L86 40 L80 52Z"/>` },
    eg_feather: { vb: [100, 100], svg: `
      <path class="o" fill="#fbf3e4" d="M20 86 Q20 40 70 10 Q84 40 50 70 Q36 80 20 86Z"/>
      <path class="thin" d="M20 86 Q44 50 70 12 M36 64 l-10 -6 M46 50 l-10 -6 M56 36 l-8 -6 M40 62 l8 2 M50 48 l10 2"/>` },
    eg_bread: { vb: [100, 100], svg: `
      <path class="o" fill="#d9a35a" d="M10 64 Q10 30 50 30 Q90 30 90 64 Q90 76 78 76 L22 76 Q10 76 10 64Z"/>
      <path class="thin" d="M30 44 l8 10 M48 40 l8 10 M66 44 l8 10"/>` },
    eg_stone: { vb: [100, 100], svg: `
      <path class="o" fill="#9aa1a8" d="M12 76 Q4 46 30 32 Q56 20 80 36 Q98 54 88 78 Q60 90 12 76Z"/>
      <path fill="url(#hatch)" d="M50 80 Q80 76 88 60 Q86 76 60 84Z"/>
      <path class="thin" d="M34 50 q8 -6 16 0"/>` },
    eg_sarcophagus: { vb: [110, 170], svg: `
      <path class="o" fill="#f2b544" d="M20 166 L12 70 Q10 30 30 16 Q55 0 80 16 Q100 30 98 70 L90 166Z"/>
      <path class="o" fill="#3f7fa8" d="M24 26 Q55 8 86 26 L86 60 L24 60Z"/>
      <path class="thin" stroke="#f2b544" d="M30 32 v26 M40 28 v30 M50 26 v32 M60 26 v32 M70 28 v30 M80 32 v26" style="stroke-width:3px"/>
      <path class="o" fill="#e8c08a" d="M36 44 Q36 30 55 30 Q74 30 74 44 Q74 64 55 66 Q36 64 36 44Z"/>
      ${eyes(55, 46, .9, 7)}${smile(55, 54, .7)}
      <path class="o" fill="#3f7fa8" d="M50 66 L60 66 L58 82 L52 82Z"/>
      <path class="o" fill="#e0a23a" d="M24 96 L86 96 L86 112 L24 112Z"/>
      ${[38, 55, 72].map((x) => `<ellipse class="o" cx="${x}" cy="104" rx="6" ry="5" fill="#5a3b26"/>`).join('')}
      <path class="thin" opacity=".6" d="M30 130 h50 M32 146 h46"/>` },
    eg_sarcophagus_open: { vb: [110, 170], svg: `
      <path class="o" fill="#c98a42" d="M20 166 L12 70 Q10 30 30 16 Q55 0 80 16 Q100 30 98 70 L90 166Z"/>
      <path class="o" fill="#5a3b26" d="M26 160 L20 72 Q20 38 36 26 Q55 14 74 26 Q90 38 90 72 L84 160Z"/>
      <circle cx="55" cy="90" r="40" fill="url(#glow-warm)" opacity=".7"/>
      ${draw.sparkle(40, 70, .9)}${draw.sparkle(72, 110, .7)}` },
    eg_item_ankh: { vb: [100, 100], svg: `
      <path class="o" fill="#f2b544" fill-rule="evenodd" d="M50 6 Q72 6 70 28 Q68 40 56 46 L84 46 L84 58 L56 58 L56 94 L44 94 L44 58 L16 58 L16 46 L44 46 Q32 40 30 28 Q28 6 50 6Z M50 16 Q40 16 41 28 Q42 38 50 42 Q58 38 59 28 Q60 16 50 16Z"/>
      <path fill="url(#shine)" d="M36 20 Q42 10 50 10 Q42 16 40 30Z"/>
      ${draw.sparkle(84, 20, .7)}` },

    /* ---------- Kapitel 3: Sphinx ---------- */
    eg_bg_wueste: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="url(#sky-desert)"/>
      <circle cx="680" cy="100" r="54" fill="#fff1b8"/><circle cx="680" cy="100" r="100" fill="url(#glow-warm)" opacity=".6"/>
      <path fill="#fbe2b0" d="M30 120 q20 -14 40 0 q20 -14 40 0 Z M480 70 q16 -12 32 0 q16 -12 32 0Z" opacity=".9"/>
      ${dunes(330, '#f5cf8a')}
      ${dunes(420, '#f2c77e')}
      <path class="thin" opacity=".4" d="M100 480 q40 -8 80 0 M520 520 q40 -8 80 0 M300 560 q40 -8 80 0"/>` },
    eg_bg_oase: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="url(#sky-desert)"/>
      ${dunes(320, '#f5cf8a')}
      <path class="o" fill="#3f9fbf" d="M200 470 Q220 410 400 412 Q600 410 620 470 Q600 520 400 520 Q200 520 200 470Z"/>
      <path class="thin" stroke="#fff" opacity=".7" d="M300 450 q30 -8 60 0 M440 480 q30 -8 60 0"/>
      <path class="o" fill="#7fb069" d="M190 470 q-10 -30 10 -40 q0 20 10 34Z M610 470 q10 -30 -10 -40 q0 20 -10 34Z"/>` },
    eg_bg_zelt: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="#b8432c"/>
      ${Array.from({ length: 9 }, (_, i) => `<path fill="${i % 2 ? '#d9573b' : '#e98a4c'}" d="M${i * 90 - 10} 0 L${i * 90 + 80} 0 L${400 + (i - 4) * 70} 440 L${400 + (i - 5) * 70} 440Z"/>`).join('')}
      <path class="thin" opacity=".4" d="M400 0 L400 440"/>
      <circle cx="400" cy="200" r="300" fill="url(#glow-warm)" opacity=".5"/>
      <path class="o" fill="#d9a35a" d="M-10 430 L810 430 L810 610 L-10 610Z"/>
      <path class="o" fill="#3f7fa8" d="M120 470 L680 470 L720 590 L80 590Z"/>
      <path class="o" fill="#f2b544" d="M150 490 L650 490 L680 570 L120 570Z"/>
      <path class="o" fill="#d9573b" d="M200 505 L600 505 L620 555 L180 555Z"/>
      ${[260, 340, 420, 500].map((x) => `<path class="o" fill="#f3e0b5" d="M${x} 530 l20 -16 l20 16 l-20 16Z"/>`).join('')}` },

    eg_sphinx: { vb: [200, 150], svg: `
      <path class="o" fill="#d9ad6a" d="M60 120 Q60 80 100 78 L170 78 Q196 82 196 120 L196 140 L60 140Z"/>
      <path class="o" fill="#e8c08a" d="M30 140 L30 128 Q40 116 70 120 L76 140Z M120 140 L120 128 Q130 118 156 122 L160 140Z"/>
      <path class="thin" d="M40 140 v-8 M48 140 v-8 M56 140 v-8"/>
      <path class="o" fill="#3f7fa8" d="M30 96 Q24 40 60 22 Q96 40 90 96 L80 104 L40 104Z"/>
      <path class="thin" stroke="#f2b544" d="M36 60 h48 M34 72 h52 M34 84 h52" style="stroke-width:3px"/>
      <path class="o" fill="#e8c08a" d="M40 56 Q40 30 60 30 Q80 30 80 56 Q80 82 60 84 Q40 82 40 56Z"/>
      ${eyes(60, 54, 1.1, 8)}${cheeks(60, 64, 1, 13)}${smile(60, 68, .9)}
      <path class="o" fill="#3f7fa8" d="M54 84 L66 84 L64 100 L56 100Z"/>
      <path class="thick line" d="M196 110 Q206 90 196 80"/>` },
    eg_pyramid: { vb: [140, 100], svg: `
      <path class="o" fill="#e2a95b" d="M6 96 L70 6 L134 96Z"/>
      <path fill="#c98a42" d="M70 6 L134 96 L92 96Z"/>
      <path class="thin" opacity=".4" d="M28 66 H112 M46 40 H94"/>` },
    eg_camel: { vb: [120, 100], svg: `
      <path class="o" fill="#c99a5a" d="M20 60 Q22 36 44 32 Q52 16 62 32 Q72 18 82 34 Q96 40 94 60Z"/>
      <path class="o" fill="#c99a5a" d="M90 54 Q100 40 100 24 L112 20 Q118 24 112 30 L106 30 Q106 50 96 62Z"/>
      <circle cx="108" cy="24" r="1.8" fill="#3b2c24"/>
      <path class="o" fill="#c99a5a" d="M28 58 L32 96 L38 96 L38 60Z M46 60 L46 96 L52 96 L54 60Z M72 60 L72 96 L78 96 L80 60Z M86 58 L88 96 L94 96 L94 58Z"/>
      <path class="o" fill="#d9573b" d="M48 30 L74 30 L72 40 L50 40Z"/>
      <path class="thick line" d="M20 54 Q10 60 14 72"/>` },
    eg_sandpile: { vb: [140, 80], svg: `
      <path class="o" fill="#f2c77e" d="M6 74 Q30 20 70 18 Q110 20 134 74Z"/>
      <path class="thin" opacity=".5" d="M40 50 q10 -4 20 0 M76 40 q10 -4 20 0"/>
      <path class="o" fill="#a8744c" d="M96 30 L120 8 L124 12 L102 34Z"/>` },
    eg_sandpile_flat: { vb: [140, 80], svg: `
      <path class="o" fill="#f2c77e" d="M6 74 Q40 54 70 54 Q100 54 134 74Z"/>` },
    eg_item_staff: { vb: [100, 100], svg: `
      <path class="o" fill="#a8744c" d="M24 96 L60 20 Q66 4 82 8 Q96 14 88 28 L82 26 Q86 16 78 14 Q68 14 66 24 L30 98Z"/>` },
    eg_palm_dates: { vb: [140, 220], svg: `
      <path class="o" fill="#a8744c" d="M62 216 Q58 140 70 70 L80 70 Q72 140 78 216Z"/>
      <path class="thin" opacity=".5" d="M64 200 h12 M64 180 h12 M66 160 h12 M66 140 h12 M68 120 h12 M70 100 h10"/>
      <path class="o" fill="#7fb069" d="M74 66 Q30 40 6 70 Q40 56 70 72Z M76 66 Q120 40 136 74 Q100 56 78 72Z M74 64 Q50 20 20 22 Q54 34 70 68Z M76 64 Q100 16 128 24 Q96 36 80 68Z M74 62 Q76 20 74 4 Q84 30 78 64Z"/>
      ${[[64, 78], [72, 84], [82, 80], [90, 74], [58, 72]].map(([x, y]) => `<ellipse class="o" cx="${x}" cy="${y}" rx="5" ry="7" fill="#9c4a2c"/>`).join('')}` },
    eg_palm: { vb: [140, 220], svg: `
      <path class="o" fill="#a8744c" d="M62 216 Q58 140 70 70 L80 70 Q72 140 78 216Z"/>
      <path class="thin" opacity=".5" d="M64 200 h12 M64 180 h12 M66 160 h12 M66 140 h12 M68 120 h12 M70 100 h10"/>
      <path class="o" fill="#7fb069" d="M74 66 Q30 40 6 70 Q40 56 70 72Z M76 66 Q120 40 136 74 Q100 56 78 72Z M74 64 Q50 20 20 22 Q54 34 70 68Z M76 64 Q100 16 128 24 Q96 36 80 68Z M74 62 Q76 20 74 4 Q84 30 78 64Z"/>` },
    eg_item_dates: { vb: [100, 100], svg: `
      <path class="thin" d="M50 10 Q50 30 34 46 M50 10 Q52 34 50 50 M50 10 Q56 30 68 44"/>
      ${[[32, 54], [50, 60], [68, 52], [40, 74], [60, 76], [50, 90]].map(([x, y]) => `<ellipse class="o" cx="${x}" cy="${y}" rx="9" ry="12" fill="#9c4a2c"/>`).join('')}
      <path fill="#fff" opacity=".4" d="M28 48 q2 -4 6 -2 M46 54 q2 -4 6 -2"/>` },
    eg_merchant: { vb: [120, 170], svg: `
      <path class="o" fill="#2e8a8a" d="M60 64 Q24 74 18 166 L102 166 Q96 74 60 64Z"/>
      <path class="thin" stroke="#f2b544" d="M30 120 q15 -8 30 0 t30 0 M26 146 q17 -8 34 0 t34 0" style="stroke-width:3px"/>
      <path class="o" fill="#2e8a8a" d="M40 74 Q22 92 26 110 Q32 112 38 96Z M80 74 Q98 92 94 110 Q88 112 82 96Z"/>
      <circle class="o" cx="30" cy="112" r="6" fill="#b07a4f"/><circle class="o" cx="90" cy="112" r="6" fill="#b07a4f"/>
      <path class="o" fill="#d9573b" d="M28 40 Q28 6 60 6 Q92 6 92 40 L96 84 Q86 74 82 52 L38 52 Q34 74 24 84Z"/>
      <path class="o" fill="#b07a4f" d="M38 40 Q38 20 60 20 Q82 20 82 40 Q82 64 60 64 Q38 64 38 40Z"/>
      ${eyes(60, 40, 1, 8)}${cheeks(60, 48, 1, 13)}${smile(60, 52, .9)}
      <circle class="o" cx="60" cy="16" r="4" fill="#f2b544"/>
      <circle class="o" cx="36" cy="58" r="3" fill="#f2b544"/><circle class="o" cx="84" cy="58" r="3" fill="#f2b544"/>` },
    eg_item_jug: { vb: [100, 100], svg: `
      <path class="o" fill="#c9774a" d="M36 10 L64 10 L60 24 Q84 36 80 64 Q76 92 50 94 Q24 92 20 64 Q16 36 40 24Z"/>
      <path class="thin" d="M78 40 Q94 44 88 62 Q84 70 76 66"/>
      <path class="thin" stroke="#fbf3e4" d="M26 56 q24 -8 48 0" style="stroke-width:3px"/>
      <path fill="url(#shine)" d="M28 40 Q34 30 44 28 Q34 40 32 62Z"/>` },
    eg_item_water: { vb: [100, 100], svg: `
      <path class="o" fill="#c9774a" d="M36 10 L64 10 L60 24 Q84 36 80 64 Q76 92 50 94 Q24 92 20 64 Q16 36 40 24Z"/>
      <ellipse class="o" cx="50" cy="12" rx="13" ry="4" fill="#6fb8e0"/>
      <path class="thin" d="M78 40 Q94 44 88 62 Q84 70 76 66"/>
      <path class="o" fill="#6fb8e0" d="M50 30 Q58 42 50 48 Q42 42 50 30Z"/>
      <path fill="url(#shine)" d="M28 40 Q34 30 44 28 Q34 40 32 62Z"/>` },
    eg_well: { vb: [140, 140], svg: `
      <path class="thick line" d="M24 90 L24 20 M116 90 L116 20 M16 22 L124 22"/>
      <path class="o" fill="#d9573b" d="M10 24 L70 4 L130 24Z"/>
      <path class="thin" d="M70 22 L70 64"/>
      <path class="o" fill="#a8744c" d="M60 64 L80 64 L78 80 L62 80Z"/>
      <path class="o" fill="#e9c98f" d="M14 90 L126 90 L120 136 L20 136Z"/>
      ${stones(16, 90, 108, 46, 36, 23, '#e9c98f').replace(/<rect[^>]*\/>/, '')}
      <ellipse class="o" cx="70" cy="90" rx="56" ry="10" fill="#3f8fbf"/>` },
    eg_book: { vb: [110, 90], svg: `
      <path class="o" fill="#2e8a8a" d="M8 18 L54 12 L56 82 L10 86Z"/>
      <path class="o" fill="#2e8a8a" d="M102 18 L56 12 L56 82 L100 86Z"/>
      <path class="o" fill="#fffdf6" d="M14 18 L54 14 L56 78 L16 80Z"/>
      <path class="o" fill="#fffdf6" d="M96 18 L56 14 L56 78 L94 80Z"/>
      <g transform="translate(16 26) scale(.34)">${'<path class="o" fill="#e2a95b" d="M6 96 L70 6 L134 96Z"/>'}</g>
      <g transform="translate(64 28) scale(.3)">${'<path class="o" fill="#c99a5a" d="M20 60 Q22 36 44 32 Q52 16 62 32 Q72 18 82 34 Q96 40 94 60Z"/>'}</g>
      <path class="thin" opacity=".5" d="M20 66 h28 M62 66 h28"/>` },
    eg_item_amulet: { vb: [100, 100], svg: `
      <path class="thin" d="M20 10 Q50 40 80 10"/>
      <circle class="o" cx="50" cy="60" r="30" fill="#f2b544"/>
      <circle class="o" cx="50" cy="60" r="18" fill="#3f7fa8"/>
      <circle cx="50" cy="60" r="8" fill="#f2c94c"/>
      <path class="thin" stroke="#f2b544" d="M50 34 v-4 M50 90 v-4 M24 60 h-4 M80 60 h-4" style="stroke-width:3px"/>
      <path fill="url(#shine)" d="M30 50 Q36 36 48 34 Q38 44 36 60Z"/>` },
    eg_table: { vb: [100, 100], svg: `
      <path class="o" fill="#c48d5c" d="M8 34 L92 34 L92 46 L8 46Z"/>
      <path class="o" fill="#a8744c" d="M16 46 L24 46 L24 92 L16 92Z M76 46 L84 46 L84 92 L76 92Z M34 46 L40 46 L40 80 L34 80Z M60 46 L66 46 L66 80 L60 80Z"/>` },
    eg_dog: { vb: [100, 100], svg: `
      <path class="o" fill="#d9a35a" d="M20 60 Q22 44 44 44 L72 44 Q86 46 84 62 L84 70 L20 70Z"/>
      <path class="o" fill="#d9a35a" d="M24 72 L24 92 L32 92 L32 72Z M72 72 L72 92 L80 92 L80 72Z"/>
      <path class="o" fill="#d9a35a" d="M70 46 Q70 20 86 20 Q98 22 96 38 Q94 50 80 50Z"/>
      <path class="o" fill="#a8744c" d="M80 22 Q72 26 74 40 Q68 30 72 20Z"/>
      <circle cx="88" cy="32" r="2" fill="#3b2c24"/><circle cx="96" cy="38" r="2.4" fill="#3b2c24"/>
      <path class="thick line" d="M20 58 Q8 50 10 40"/>` },
    eg_duck: { vb: [100, 100], svg: `
      <path class="o" fill="#f2c94c" d="M14 60 Q16 82 50 84 Q84 82 82 60 Q70 66 56 58 Q50 70 30 64Z"/>
      <circle class="o" cx="66" cy="40" r="16" fill="#f2c94c"/>
      <path class="o" fill="#f2a03b" d="M80 40 L96 44 L80 48Z"/>
      <circle cx="70" cy="36" r="2.4" fill="#3b2c24"/>
      <path class="o" fill="#f2a03b" d="M40 84 L36 94 L48 94 L46 84Z M56 84 L54 94 L66 94 L62 84Z"/>` },
  });

  WORLDS.push({
    id: 'aegypten',
    name: 'Ägypten',
    cover: 'cover_aegypten',
    adventures: [
      /* ============ Kapitel 1 ============ */
      {
        id: 'pyramide',
        title: 'In der Pyramide',
        thumb: 'eg_bg_kammer',
        intro: 'Rumms! Hinter dir ist der Eingang der Pyramide zugefallen. Es ist stockdunkel. Siehst du da vorne etwas leuchten?',
        outro: 'Knarr! Das schwere Tor geht auf und warmes Sonnenlicht scheint herein. Du bist aus der Pyramide entkommen!',
        start: 'gang',
        items: {
          stange: { name: 'Holzstange', art: 'eg_item_stange' },
          griff: { name: 'Goldener Griff', art: 'eg_item_griff' },
          hebel: { name: 'Hebel', art: 'eg_item_hebel' },
        },
        combos: [{ a: 'stange', b: 'griff', gives: 'hebel', text: 'Du steckst den goldenen Griff auf die Holzstange. Fertig ist ein Hebel!' }],
        pages: {
          gang: {
            name: 'Der dunkle Gang',
            bg: 'eg_bg_gang',
            dark: true,
            objects: [
              { id: 'lampe', art: 'eg_lamp', x: 14, y: 46, w: 10, name: 'Öllampe', glow: true,
                light: true, okText: 'Du drehst die Öllampe auf. Jetzt ist es hell! An der Wand sind lauter Zeichen.', doneText: 'Die Öllampe brennt gemütlich.' },
              { id: 'tafel', art: 'eg_glyph_tablet', x: 40, y: 34, w: 28, name: 'Steintafel',
                say: 'Auf der Steintafel sind drei Zeichen gemalt: zuerst die Sonne, dann das Auge, dann der Vogel.',
                note: 'Steintafel: Sonne – Auge – Vogel.' },
              { id: 'vase', art: 'eg_vase', x: 42, y: 77, w: 10, name: 'Vase',
                give: 'stange', okText: 'In der Vase steckt eine lange Holzstange. Die nimmst du mit!', doneText: 'Die Vase ist leer.' },
              { id: 'steintuer', art: 'eg_stone_door', x: 78, y: 55, w: 20, name: 'Steintür',
                puzzle: { type: 'wheels', prompt: 'Die Steintür hat drei Drehräder mit Zeichen. Welche Zeichen gehören hinein?',
                  options: [{ art: 'eg_sym_snake', label: 'Schlange' }, { art: 'eg_sym_bird', label: 'Vogel' }, { art: 'eg_sym_sun', label: 'Sonne' }, { art: 'eg_sym_eye', label: 'Auge' }],
                  answer: [2, 3, 1] },
                become: 'eg_stone_door_open', goto: 'kammer', okText: 'Rrrrumpel! Die Steintür rutscht zur Seite.', doneText: 'Die Steintür ist offen.' },
            ],
          },
          kammer: {
            name: 'Die Königskammer',
            bg: 'eg_bg_kammer',
            back: 'gang',
            enter: 'Eine große Kammer mit bunten Säulen. Hier sitzt jemand!',
            objects: [
              { id: 'katze', art: 'eg_mummy_cat', x: 28, y: 70, w: 16, name: 'Mumienkatze Mira',
                say: 'Die kleine Mumienkatze Mira miaut: „Hallo! Der Code für die Truhe? Zähle auf dem großen Wandbild zuerst die Katzen, dann die Käfer!“',
                note: 'Truhen-Code: Auf dem Wandbild erst die Katzen zählen, dann die Käfer.' },
              { id: 'wand', art: 'zoom', x: 50, y: 30, w: 8, name: 'Wandbild ansehen', goto: 'wandbild' },
              { id: 'truhe', art: 'chest', x: 52, y: 80, w: 18, name: 'Truhe',
                puzzle: { type: 'code', prompt: 'Die Truhe hat ein Zahlenschloss mit zwei Zahlen.', answer: '24' },
                give: 'griff', become: 'chest_open', okText: 'Klack! In der Truhe liegt ein goldener Griff.', doneText: 'Die Truhe ist leer.' },
              { id: 'tor', art: 'eg_gate', x: 79, y: 57, w: 20, name: 'Tor nach draußen',
                needs: ['hebel'], needText: 'Das Gitter-Tor ist schwer. Daneben ist ein Loch in der Wand – da gehört bestimmt ein Hebel hinein.', win: true },
            ],
          },
          wandbild: {
            name: 'Das große Wandbild',
            bg: 'eg_bg_wandbild',
            back: 'kammer',
            enter: 'Ein riesiges, buntes Wandbild! Schau ganz genau hin.',
            objects: [
              { id: 'k1', art: 'eg_cat_paint', x: 22, y: 38, w: 11, static: true },
              { id: 'k2', art: 'eg_cat_paint', x: 70, y: 70, w: 11, static: true },
              { id: 's1', art: 'eg_scarab_paint', x: 40, y: 35, w: 9, static: true },
              { id: 's2', art: 'eg_scarab_paint', x: 56, y: 42, w: 9, static: true },
              { id: 's3', art: 'eg_scarab_paint', x: 34, y: 72, w: 9, static: true },
              { id: 's4', art: 'eg_scarab_paint', x: 84, y: 36, w: 9, static: true },
            ],
          },
        },
        hints: [
          { until: 'lampe', text: 'Tippe auf das Leuchten links!' },
          { until: 'tafel', text: 'Schau dir die Steintafel an der Wand an.' },
          { until: 'steintuer', text: 'Stelle an der Steintür die Zeichen von der Tafel ein: Sonne, Auge, Vogel.' },
          { until: 'vase', text: 'Im Gang steht eine Vase. Schau hinein!' },
          { until: 'katze', text: 'Sprich mit der Mumienkatze in der Kammer.' },
          { until: 'truhe', text: 'Tippe auf die Lupe und zähle auf dem Wandbild: Wie viele Katzen? Wie viele Käfer?' },
          { until: 'combo:hebel', text: 'Tippe im Rucksack auf die Holzstange und dann auf den goldenen Griff.' },
          { until: 'tor', text: 'Mit dem Hebel kannst du das Tor öffnen!' },
        ],
      },

      /* ============ Kapitel 2 ============ */
      {
        id: 'grab',
        title: 'Das Grab der Pharaonin',
        thumb: 'eg_bg_grab',
        intro: 'Du bist im Grab der Pharaonin Nefi. Der Ausgang ist mit einem goldenen Schloss versperrt. Den Schlüssel hat die Pharaonin – in ihrem Sarkophag!',
        outro: 'Der Lebensschlüssel passt! Die Tür gleitet auf. Nefi hätte sich bestimmt gefreut, dass du so klug bist!',
        start: 'vorraum',
        items: {
          kaefer1: { name: 'Goldkäfer', art: 'eg_item_scarab' },
          kaefer2: { name: 'Goldkäfer', art: 'eg_item_scarab' },
          kaefer3: { name: 'Goldkäfer', art: 'eg_item_scarab' },
          ankh: { name: 'Lebensschlüssel', art: 'eg_item_ankh' },
        },
        pages: {
          vorraum: {
            name: 'Der Vorraum',
            bg: 'eg_bg_vorraum',
            objects: [
              { id: 'bild', art: 'eg_painting', x: 30, y: 36, w: 15, name: 'Bild vom Fluss', goto: 'nilbild' },
              { id: 'korb', art: 'eg_basket', x: 22, y: 80, w: 15, name: 'Korb',
                give: 'kaefer1', okText: 'Unter den Broten im Korb krabbelt etwas Goldenes: ein Goldkäfer!', doneText: 'Nur noch Brote im Korb.' },
              { id: 'zettel', art: 'note', x: 52, y: 34, w: 8, name: 'Papyrus', rot: -5,
                say: 'Auf dem Papyrus steht: „Drei goldene Käfer wecken den Sarkophag der Pharaonin.“',
                note: 'Der Sarkophag braucht drei Goldkäfer.' },
              { id: 'ausgang', art: 'eg_gate', x: 79, y: 57, w: 20, name: 'Ausgang',
                needs: ['ankh'], needText: 'Am Ausgang ist ein goldenes Schloss in Form eines Lebensschlüssels. Wo der wohl ist?', win: true },
              { id: 'zumgrab', art: 'nav_right', x: 92, y: 89, w: 9, name: 'Zur Grabkammer', goto: 'grabkammer' },
            ],
          },
          nilbild: {
            name: 'Das Bild vom Fluss',
            bg: 'eg_bg_nilbild',
            back: 'vorraum',
            enter: 'Ein Bild von einem breiten, blauen Fluss mit Schilf.',
            objects: [
              { id: 'schild', art: 'zoom', x: 76, y: 86, w: 7, name: 'Unterschrift lesen',
                say: 'Unter dem Bild steht: „Der Nil – der längste Fluss.“ Er fließt mitten durch Ägypten.',
                note: 'Der große Fluss in Ägypten heißt Nil.' },
            ],
          },
          grabkammer: {
            name: 'Die Grabkammer',
            bg: 'eg_bg_grab',
            back: 'vorraum',
            enter: 'Die Decke ist voller goldener Sterne. In der Mitte steht der Sarkophag der Pharaonin.',
            objects: [
              { id: 'krokodil', art: 'eg_croc', x: 22, y: 78, w: 24, name: 'Krokodil Kroko',
                puzzle: { type: 'choice', prompt: 'Krokodil Kroko schnappt: „Ich hab einen Goldkäfer! Den kriegst du, wenn du weißt: Wie heißt der große Fluss in Ägypten?“',
                  options: [{ text: 'Rhein', label: '' }, { text: 'Nil', label: '' }, { text: 'Donau', label: '' }], answer: 1 },
                give: 'kaefer2', okText: 'Kroko klappert fröhlich mit den Zähnen und spuckt einen Goldkäfer aus. Igitt – aber danke!', doneText: 'Kroko lächelt dich mit allen Zähnen an.' },
              { id: 'sarkophag', art: 'eg_sarcophagus', x: 52, y: 58, w: 19, name: 'Sarkophag',
                needs: ['kaefer1', 'kaefer2', 'kaefer3'], needText: 'Auf dem Sarkophag sind drei Mulden in Käferform.',
                give: 'ankh', become: 'eg_sarcophagus_open', okText: 'Die Käfer leuchten auf, der Deckel gleitet zur Seite … darin liegt ein goldener Lebensschlüssel!', doneText: 'Der Sarkophag ist offen und leer.' },
              { id: 'waage', art: 'zoom', x: 80, y: 60, w: 8, name: 'Waage ansehen', goto: 'waage' },
            ],
          },
          waage: {
            name: 'Die goldene Waage',
            bg: 'eg_bg_waage',
            back: 'grabkammer',
            enter: 'Eine goldene Waage. Daneben liegen eine Feder, ein Brot und ein Stein.',
            objects: [
              { id: 'goldwaage', art: 'eg_scale', x: 50, y: 52, w: 36, name: 'Waage',
                puzzle: { type: 'sequence', prompt: 'Auf der Waage steht: „Lege alles hinauf – vom leichtesten zum schwersten!“',
                  options: [{ art: 'eg_stone', label: 'Stein' }, { art: 'eg_feather', label: 'Feder' }, { art: 'eg_bread', label: 'Brot' }], answer: [1, 2, 0] },
                give: 'kaefer3', okText: 'Die Waage schwingt, klick! Aus einer Klappe fällt der dritte Goldkäfer.', doneText: 'Die Waage ist im Gleichgewicht.' },
              { id: 'feder', art: 'eg_feather', x: 20, y: 80, w: 12, name: 'Feder', say: 'Eine Feder. Die ist ganz, ganz leicht.' },
              { id: 'brot', art: 'eg_bread', x: 50, y: 84, w: 13, name: 'Brot', say: 'Ein Brot. Schwerer als eine Feder, aber leichter als ein Stein.' },
              { id: 'stein', art: 'eg_stone', x: 80, y: 82, w: 13, name: 'Stein', say: 'Ein Stein. Ganz schön schwer!' },
            ],
          },
        },
        hints: [
          { until: 'zettel', text: 'Lies den Papyrus an der Wand im Vorraum.' },
          { until: 'korb', text: 'Schau in den Korb!' },
          { until: 'schild', text: 'Schau dir das Bild vom Fluss genauer an.' },
          { until: 'krokodil', text: 'Kroko will den Namen des großen Flusses wissen. Das Bild im Vorraum verrät ihn.' },
          { until: 'goldwaage', text: 'Geh zur Waage und lege die Dinge vom leichtesten zum schwersten.' },
          { until: 'sarkophag', text: 'Du hast drei Goldkäfer! Tippe auf den Sarkophag.' },
          { until: 'ausgang', text: 'Mit dem Lebensschlüssel öffnest du den Ausgang im Vorraum.' },
        ],
      },

      /* ============ Kapitel 3 ============ */
      {
        id: 'sphinx',
        title: 'Das Rätsel der Sphinx',
        thumb: 'eg_bg_wueste',
        intro: 'Die große Sphinx Sefa liegt mitten auf dem Weg nach Hause. Sie ist durstig und traurig: Ihr Sonnenamulett ist verschwunden!',
        outro: 'Sefa trinkt, lächelt und hängt sich das Amulett um. „Du bist sehr klug!“, sagt sie und lässt dich vorbei. Du hast ganz Ägypten geschafft!',
        start: 'wueste',
        items: {
          stab: { name: 'Hirtenstab', art: 'eg_item_staff' },
          datteln: { name: 'Datteln', art: 'eg_item_dates' },
          krug: { name: 'Leerer Krug', art: 'eg_item_jug' },
          wasser: { name: 'Krug mit Wasser', art: 'eg_item_water' },
          amulett: { name: 'Sonnenamulett', art: 'eg_item_amulet' },
        },
        pages: {
          wueste: {
            name: 'Die Wüste',
            bg: 'eg_bg_wueste',
            objects: [
              { id: 'pyr1', art: 'eg_pyramid', x: 16, y: 46, w: 18, static: true },
              { id: 'pyr2', art: 'eg_pyramid', x: 36, y: 50, w: 12, static: true },
              { id: 'kamel1', art: 'eg_camel', x: 54, y: 55, w: 12, static: true },
              { id: 'kamel2', art: 'eg_camel', x: 67, y: 57, w: 11, static: true },
              { id: 'kamel3', art: 'eg_camel', x: 79, y: 54, w: 10, static: true },
              { id: 'sphinx', art: 'eg_sphinx', x: 66, y: 80, w: 34, name: 'Sphinx Sefa',
                needs: ['wasser', 'amulett'], needText: 'Sphinx Sefa seufzt: „Ich bin sooo durstig. Und mein Sonnenamulett ist weg! Bring mir beides, dann darfst du mein Rätsel lösen.“',
                note: 'Sefa braucht Wasser und ihr Sonnenamulett.',
                puzzle: { type: 'choice', prompt: 'Sefa sagt: „Danke! Hier ist mein Rätsel: Was hat vier Beine, kann aber nicht laufen?“',
                  options: [{ art: 'eg_dog', label: 'Hund' }, { art: 'eg_table', label: 'Tisch' }, { art: 'eg_duck', label: 'Ente' }], answer: 1 },
                win: true },
              { id: 'sand', art: 'eg_sandpile', x: 20, y: 82, w: 18, name: 'Sandhaufen',
                give: 'stab', become: 'eg_sandpile_flat', okText: 'Du buddelst im Sand und ziehst einen langen Hirtenstab heraus!', doneText: 'Nur noch Sand.' },
              { id: 'zuroase', art: 'nav_left', x: 7, y: 60, w: 8, name: 'Zur Oase', goto: 'oase' },
              { id: 'zumzelt', art: 'nav_right', x: 93, y: 60, w: 8, name: 'Zum Zelt', goto: 'zelt' },
            ],
          },
          oase: {
            name: 'Die Oase',
            bg: 'eg_bg_oase',
            back: 'wueste',
            enter: 'Eine Oase! Hier gibt es Wasser und hohe Palmen.',
            objects: [
              { id: 'palme', art: 'eg_palm_dates', x: 20, y: 46, w: 20, name: 'Dattelpalme',
                needs: ['stab'], needText: 'Ganz oben in der Palme hängen leckere Datteln. Viel zu hoch! Mit etwas Langem kämst du dran.',
                give: 'datteln', become: 'eg_palm', okText: 'Du stupst mit dem Stab gegen die Datteln – plopp, plopp! Sie fallen herunter.', doneText: 'Die Palme wiegt sich im Wind.' },
              { id: 'brunnen', art: 'eg_well', x: 74, y: 62, w: 20, name: 'Brunnen',
                needs: ['krug'], needText: 'Ein Brunnen mit kühlem Wasser. Aber worin willst du es tragen?',
                give: 'wasser', okText: 'Du lässt den Eimer hinunter und füllst den Krug mit frischem Wasser.', doneText: 'Das Wasser glitzert im Brunnen.' },
            ],
          },
          zelt: {
            name: 'Das Händlerzelt',
            bg: 'eg_bg_zelt',
            back: 'wueste',
            enter: 'Im bunten Zelt sitzt die Händlerin Amira zwischen Teppichen und Töpfen.',
            objects: [
              { id: 'amira', art: 'eg_merchant', x: 28, y: 56, w: 17, name: 'Händlerin Amira',
                needs: ['datteln'], needText: 'Amira lächelt: „Du willst meinen Krug? Ich tausche ihn gern – gegen süße Datteln!“',
                note: 'Amira tauscht ihren Krug gegen Datteln.',
                give: 'krug', okText: 'Amira nascht eine Dattel: „Mmmh! Hier, der Krug gehört jetzt dir.“', doneText: 'Amira kaut zufrieden ihre Datteln.' },
              { id: 'tisch', art: 'eg_table', x: 54, y: 64, w: 16, static: true },
              { id: 'buch', art: 'eg_book', x: 54, y: 52, w: 13, name: 'Buch',
                say: 'In Amiras Buch steht: „Der Code meiner Truhe: Zähle in der Wüste erst die Pyramiden, dann die Kamele.“',
                note: 'Truhen-Code: In der Wüste erst die Pyramiden zählen, dann die Kamele.' },
              { id: 'truhe', art: 'chest', x: 72, y: 70, w: 18, name: 'Truhe',
                puzzle: { type: 'code', prompt: 'Amiras Truhe hat ein Zahlenschloss mit zwei Zahlen.', answer: '23' },
                give: 'amulett', become: 'chest_open', okText: 'Klick! In der Truhe funkelt das Sonnenamulett der Sphinx. Amira hatte es im Sand gefunden.', doneText: 'Die Truhe ist leer.' },
            ],
          },
        },
        hints: [
          { until: 'sand', text: 'Im Sandhaufen steckt etwas. Buddel mal!' },
          { until: 'palme', text: 'Geh zur Oase. Mit dem Stab kommst du an die Datteln.' },
          { until: 'amira', text: 'Amira im Zelt tauscht ihren Krug gegen Datteln.' },
          { until: 'brunnen', text: 'Fülle den Krug am Brunnen in der Oase.' },
          { until: 'buch', text: 'Lies das Buch im Zelt.' },
          { until: 'truhe', text: 'Zähle in der Wüste die Pyramiden und dann die Kamele.' },
          { until: 'sphinx', text: 'Bring Sefa Wasser und Amulett. Und denk beim Rätsel an Möbel!' },
        ],
      },
    ],
  });
})();
