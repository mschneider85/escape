/* ===================== Welt: Weltraum ===================== */
(() => {
  const F = draw.face;
  const eyes = (cx, cy, s = 1, gap = 5) => `
    <circle cx="${cx - gap * s}" cy="${cy}" r="${2 * s}" fill="#3b2c24"/><circle cx="${cx + gap * s}" cy="${cy}" r="${2 * s}" fill="#3b2c24"/>
    <circle cx="${cx - gap * s + .7 * s}" cy="${cy - .8 * s}" r="${.7 * s}" fill="#fff"/><circle cx="${cx + gap * s + .7 * s}" cy="${cy - .8 * s}" r="${.7 * s}" fill="#fff"/>`;
  const cheeks = (cx, cy, s = 1, gap = 8) => `
    <ellipse cx="${cx - gap * s}" cy="${cy}" rx="${2.6 * s}" ry="${1.6 * s}" fill="#f4a6a0" opacity=".85"/>
    <ellipse cx="${cx + gap * s}" cy="${cy}" rx="${2.6 * s}" ry="${1.6 * s}" fill="#f4a6a0" opacity=".85"/>`;
  // kleine Punkt-Sterne im Hintergrund (rund, damit man sie nicht mit gezeichneten Zackensternen verwechselt)
  const dots = (n, x0, y0, w, h, seed = 1) => {
    let s = '', r = seed;
    const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < n; i++) s += `<circle cx="${(x0 + rnd() * w).toFixed(0)}" cy="${(y0 + rnd() * h).toFixed(0)}" r="${(1.5 + rnd() * 2.5).toFixed(1)}" fill="#fff6d8" opacity="${(.45 + rnd() * .55).toFixed(2)}"/>`;
    return s;
  };
  // Ring: Tusche-Kontur + farbiger Ring (Inline-Stil, damit .o die Farbe nicht überschreibt)
  const ringPath = (cx, cy, r, ring, front) => {
    const w = Math.max(3, r / 7);
    const d = front
      ? `M${cx - r * 1.8} ${cy} Q${cx} ${cy + r * .9} ${cx + r * 1.8} ${cy}`
      : `M${cx - r * 1.8} ${cy} Q${cx} ${cy - r * .9} ${cx + r * 1.8} ${cy}`;
    return `<path d="${d}" fill="none" style="stroke:#3b2c24;stroke-width:${w + 3.5};stroke-linecap:round"/><path d="${d}" fill="none" style="stroke:${ring};stroke-width:${w};stroke-linecap:round"/>`;
  };
  const planet = (cx, cy, r, fill, band, ring) => `
    ${ring ? ringPath(cx, cy, r, ring, false) : ''}
    <circle class="o" cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>
    ${band ? `<path fill="${band}" opacity=".7" d="M${cx - r * .95} ${cy - r * .2} Q${cx} ${cy - r * .45} ${cx + r * .95} ${cy - r * .2} L${cx + r * .9} ${cy + r * .1} Q${cx} ${cy - r * .1} ${cx - r * .9} ${cy + r * .1}Z"/>` : ''}
    <circle cx="${cx - r * .35}" cy="${cy - r * .35}" r="${r * .45}" fill="url(#shine)"/>
    ${ring ? ringPath(cx, cy, r, ring, true) : ''}`;
  const rivets = (x, y, w, h, step = 60) => {
    let s = '';
    for (let xx = x + 14; xx < x + w; xx += step) s += `<circle cx="${xx}" cy="${y + 10}" r="3" fill="#8b93a8"/><circle cx="${xx}" cy="${y + h - 10}" r="3" fill="#8b93a8"/>`;
    return s;
  };
  const panelWall = (h, c1 = '#c9d1e3', c2 = '#b7c0d6') => {
    let s = `<rect width="800" height="${h}" fill="${c1}"/>`;
    for (let x = 0; x < 800; x += 160) s += `<rect class="thin" x="${x + 8}" y="16" width="144" height="${h - 32}" rx="18" fill="${c2}" opacity=".7"/>`;
    return s;
  };
  const metalFloor = (y) => `
    <path class="o" fill="#8f97ad" d="M-10 ${y} L810 ${y} L810 610 L-10 610Z"/>
    <path class="thin" opacity=".4" d="M-10 ${y + 40} L810 ${y + 40} M-10 ${y + 95} L810 ${y + 95} M120 ${y} L60 610 M320 ${y} L300 610 M500 ${y} L520 610 M690 ${y} L760 610"/>`;
  const moonGround = (y, fill = '#c9c6cf') => `
    <path class="o" fill="${fill}" d="M-10 ${y} Q200 ${y - 30} 400 ${y - 8} Q600 ${y - 34} 810 ${y} L810 610 L-10 610Z"/>`;
  const color = (c, label) => ({ color: c, label });
  const ROT = '#d9573b', GELB = '#f2c94c', BLAU = '#4f7fb8', GRUEN = '#7fcf8f', LILA = '#b48ad6', TUERKIS = '#5fc9c0';

  Object.assign(ART, {
    /* ---------- Cover ---------- */
    cover_weltraum: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="url(#space)"/>
      ${dots(70, 0, 0, 800, 600, 5)}
      <circle cx="560" cy="250" r="230" fill="url(#glow-cool)" opacity=".25"/>
      ${planet(580, 230, 110, '#f2a65a', '#e07b4a', '#f2c94c')}
      ${planet(130, 120, 44, '#7fb6d9', '#5f96c0')}
      <circle class="o" cx="700" cy="500" r="30" fill="#e8e4ef"/><circle cx="690" cy="492" r="7" fill="#c9c6cf"/><circle cx="710" cy="510" r="5" fill="#c9c6cf"/>
      <g transform="translate(250 330) rotate(-30)">
        <path class="o" fill="#f2a03b" d="M-22 120 Q0 190 22 120Z"/>
        <path class="o" fill="#f2c94c" d="M-12 120 Q0 160 12 120Z"/>
        <path class="o" fill="#d9573b" d="M-40 110 L-28 70 L-28 118Z M40 110 L28 70 L28 118Z"/>
        <path class="o" fill="#fbf3e4" d="M-28 120 L-28 40 Q0 -40 28 40 L28 120Z"/>
        <path class="o" fill="#d9573b" d="M-22 20 Q0 -36 22 20Z"/>
        <circle class="o" cx="0" cy="60" r="14" fill="#7fb6d9"/><circle cx="-4" cy="56" r="5" fill="#fff" opacity=".7"/>
      </g>
      ${draw.star(380, 90, 14, '#fff3c4')}${draw.star(700, 70, 10, '#fff3c4')}${draw.star(60, 420, 12, '#fff3c4')}` },

    /* ---------- Kapitel 1: Raumstation ---------- */
    sp_bg_kabine: { vb: [800, 600], bg: true, svg: `
      ${panelWall(450)}
      ${rivets(0, 16, 800, 420, 80)}
      <circle class="o" cx="400" cy="170" r="110" fill="#9aa3ba"/>
      <circle class="o" cx="400" cy="170" r="88" fill="#1c1840"/>
      <circle class="o" cx="430" cy="200" r="52" fill="#6fa8dc"/>
      <path fill="#7fb069" d="M398 186 Q412 168 430 176 Q440 196 420 206 Q404 206 398 186Z M440 214 Q458 206 470 218 Q462 236 448 232Z"/>
      <circle cx="414" cy="184" r="22" fill="url(#shine)"/>
      <path fill="#fff" opacity=".18" d="M330 110 Q360 84 400 82 Q350 110 340 150Z"/>
      ${metalFloor(440)}
      <path class="o" fill="#7b8399" d="M560 300 L780 300 L780 330 L560 330Z"/>
      <path class="o" fill="#6fa8dc" d="M570 260 Q575 244 600 246 L770 246 Q780 250 778 300 L570 300Z"/>
      <path class="o" fill="#fbf3e4" d="M580 262 Q590 250 620 254 Q632 270 620 290 Q594 294 582 284Z"/>
      <path class="thin" d="M650 262 q20 8 40 0 t40 0" opacity=".5"/>` },
    sp_bg_lager: { vb: [800, 600], bg: true, svg: `
      ${panelWall(440, '#b9b2cf', '#a8a0c2')}
      <path class="o" fill="#8a7fa8" d="M0 70 L800 70 L800 92 L0 92Z"/>
      <path class="thick line" stroke="#7b8399" d="M0 40 L800 40"/>
      <path class="thick line" d="M0 40 L800 40"/>
      ${[[40, 140], [600, 160]].map(([x, y]) => `
        <path class="o" fill="#7b5f9a" d="M${x} ${y} L${x + 170} ${y} L${x + 170} ${y + 14} L${x} ${y + 14}Z M${x} ${y + 110} L${x + 170} ${y + 110} L${x + 170} ${y + 124} L${x} ${y + 124}Z"/>
        <rect class="o" x="${x + 14}" y="${y - 52}" width="60" height="52" rx="4" fill="#d7b98a"/>
        <rect class="o" x="${x + 90}" y="${y - 40}" width="60" height="40" rx="4" fill="#c9a26b"/>
        <rect class="o" x="${x + 20}" y="${y + 66}" width="44" height="44" rx="4" fill="#c9a26b"/>
        <rect class="o" x="${x + 80}" y="${y + 56}" width="70" height="54" rx="4" fill="#d7b98a"/>`).join('')}
      ${metalFloor(430)}` },
    sp_bg_funk: { vb: [800, 600], bg: true, svg: `
      ${panelWall(450, '#c3cbe0', '#b0b9d2')}
      ${rivets(0, 16, 800, 420, 100)}
      <path class="o" fill="#6b7490" d="M300 250 L800 250 L800 300 L300 300Z"/>
      <path class="o" fill="#5b6380" d="M310 300 L790 300 L790 440 L310 440Z"/>
      ${[[340, 110], [470, 90], [600, 110]].map(([x, y]) => `<rect class="o" x="${x}" y="${y}" width="110" height="80" rx="10" fill="#2a2f45"/><path class="thin" stroke="#7fcf8f" d="M${x + 14} ${y + 44} l16 0 l8 -18 l10 34 l8 -16 l20 0 l8 -8 l12 8" style="stroke-width:2px"/>`).join('')}
      ${[330, 370, 410, 450, 650, 690, 730].map((x, i) => `<circle class="o" cx="${x}" cy="275" r="8" fill="${['#f2c94c', '#7fcf8f', '#d9573b', '#6fa8dc'][i % 4]}"/>`).join('')}
      ${metalFloor(440)}` },
    sp_bg_schleuse: { vb: [800, 600], bg: true, svg: `
      ${panelWall(450, '#c9d1e3', '#b7c0d6')}
      <path class="o" fill="#5b6380" d="M480 30 L790 30 L790 440 L480 440Z"/>
      ${Array.from({ length: 9 }, (_, i) => `<path fill="${i % 2 ? '#3b3f4f' : '#f2c94c'}" d="M${480 + i * 36} 440 L${516 + i * 36} 440 L${506 + i * 36} 462 L${470 + i * 36} 462Z"/>`).join('')}
      <path class="o" fill="none" d="M466 440 L790 440 L790 462 L466 462Z"/>
      <path class="o" fill="#8f97ad" d="M40 360 L280 360 L280 380 L40 380Z"/>
      <path class="o" fill="#6b7490" d="M56 380 L70 380 L70 440 L56 440Z M250 380 L264 380 L264 440 L250 440Z"/>
      ${metalFloor(450)}` },

    sp_robot: { vb: [100, 130], svg: `
      <path class="thin" d="M50 6 L50 22"/>
      <circle class="o" cx="50" cy="6" r="5" fill="#d9573b"/>
      <path class="o" fill="#e8ecf4" d="M18 52 Q16 22 50 22 Q84 22 82 52 L82 58 L18 58Z"/>
      <rect class="o" x="26" y="32" width="48" height="22" rx="10" fill="#2a2f45"/>
      <ellipse cx="40" cy="43" rx="5" ry="6" fill="#7fe0d0"/><ellipse cx="60" cy="43" rx="5" ry="6" fill="#7fe0d0"/>
      <circle cx="41.5" cy="41" r="1.6" fill="#fff"/><circle cx="61.5" cy="41" r="1.6" fill="#fff"/>
      <ellipse cx="30" cy="52" rx="3" ry="1.8" fill="#f4a6a0"/><ellipse cx="70" cy="52" rx="3" ry="1.8" fill="#f4a6a0"/>
      <path class="o" fill="#c9d1e3" d="M22 58 L78 58 L74 104 L26 104Z"/>
      <rect class="o" x="38" y="68" width="24" height="16" rx="4" fill="#f2c94c"/>
      <circle class="o" cx="34" cy="94" r="4" fill="#d9573b"/><circle class="o" cx="50" cy="94" r="4" fill="#7fcf8f"/><circle class="o" cx="66" cy="94" r="4" fill="#6fa8dc"/>
      <path class="thick line" d="M22 66 Q6 76 10 92 M78 66 Q94 70 92 52"/>
      <circle class="o" cx="10" cy="94" r="5" fill="#c9d1e3"/><circle class="o" cx="92" cy="50" r="5" fill="#c9d1e3"/>
      <path class="o" fill="#8f97ad" d="M30 104 L44 104 L44 122 L28 122Z M56 104 L70 104 L72 122 L56 122Z"/>
      <ellipse class="o" cx="36" cy="124" rx="12" ry="4" fill="#6b7490"/><ellipse class="o" cx="64" cy="124" rx="12" ry="4" fill="#6b7490"/>` },
    sp_logbook: { vb: [100, 80], svg: `
      <path class="o" fill="#5fc9c0" d="M6 14 L48 8 L50 74 L8 78Z"/>
      <path class="o" fill="#5fc9c0" d="M94 14 L52 8 L50 74 L92 78Z"/>
      <path class="o" fill="#fffdf6" d="M12 14 L48 12 L50 70 L14 72Z"/>
      <path class="o" fill="#fffdf6" d="M88 14 L52 12 L50 70 L86 72Z"/>
      <path class="thin" opacity=".5" d="M18 26 h26 M18 36 h24 M18 46 h26 M56 26 h26 M56 36 h22 M56 46 h26"/>
      <path class="o" fill="#d9573b" d="M64 52 l4 8 l-4 8 l10 -8Z" opacity=".9"/>` },
    sp_sticker_rocket: { vb: [60, 80], svg: `
      <path class="o" fill="#fffdf6" d="M4 6 L56 4 L58 76 L6 78Z"/>
      <path class="o" fill="#d9573b" d="M18 58 L12 66 L22 64Z M42 58 L48 66 L38 64Z"/>
      <path class="o" fill="#f2c94c" d="M22 62 L38 62 L30 74Z"/>
      <path class="o" fill="#6fa8dc" d="M20 62 L20 30 Q30 8 40 30 L40 62Z"/>
      <circle class="o" cx="30" cy="38" r="5" fill="#fbf3e4"/>` },
    sp_sticker_star: { vb: [60, 60], svg: `
      <path class="o" fill="#fffdf6" d="M4 6 L56 4 L56 56 L6 56Z"/>
      ${draw.star(30, 31, 20, '#f2c94c')}` },
    sp_locker: { vb: [90, 160], svg: `
      <rect class="o" x="6" y="6" width="78" height="148" rx="6" fill="#8fa7c9"/>
      <rect class="o" x="14" y="14" width="62" height="132" rx="4" fill="#a7bcda"/>
      <path class="thin" d="M24 28 h42 M24 36 h42 M24 44 h42"/>
      <rect class="o" x="60" y="72" width="8" height="24" rx="3" fill="#6b7490"/>
      <path fill="#fff" opacity=".4" d="M20 50 L26 50 L26 140 L20 140Z"/>` },
    sp_locker_open: { vb: [90, 160], svg: `
      <rect class="o" x="6" y="6" width="78" height="148" rx="6" fill="#6b7490"/>
      <rect x="14" y="14" width="62" height="132" fill="#3d4459"/>
      <path class="thick line" d="M20 30 L70 30"/>
      <path class="o" fill="#a7bcda" d="M6 6 L-14 14 L-14 150 L6 154Z"/>` },
    sp_hatch: { vb: [110, 130], svg: `
      <rect class="o" x="6" y="6" width="98" height="120" rx="40" fill="#8f97ad"/>
      <rect class="o" x="18" y="18" width="74" height="96" rx="30" fill="#c9d1e3"/>
      <circle class="o" cx="55" cy="54" r="14" fill="#6fa8dc"/><circle cx="50" cy="49" r="5" fill="#fff" opacity=".6"/>
      <rect class="o" x="74" y="72" width="10" height="22" rx="4" fill="#f2c94c"/>
      <path class="thin" d="M30 100 h50" opacity=".5"/>` },
    sp_emergency_light: { vb: [70, 70], svg: `
      <circle cx="35" cy="35" r="34" fill="url(#glow-warm)"/>
      <rect class="o" x="14" y="44" width="42" height="14" rx="4" fill="#6b7490"/>
      <path class="o" fill="#f2c94c" d="M18 44 Q18 14 35 14 Q52 14 52 44Z"/>
      <path class="thin" d="M26 30 q9 -8 18 0" opacity=".6"/>
      <circle class="o" cx="35" cy="51" r="3" fill="#d9573b"/>` },
    sp_crate: { vb: [120, 100], svg: `
      <path class="o" fill="#8fa7c9" d="M8 24 L112 24 L112 94 L8 94Z"/>
      <path class="o" fill="#a7bcda" d="M8 24 L22 8 L98 8 L112 24Z"/>
      <path class="o" fill="#f2c94c" d="M8 40 L112 40 L112 50 L8 50Z"/>
      <rect class="o" x="44" y="56" width="32" height="26" rx="5" fill="#2a2f45"/>
      <rect x="50" y="62" width="20" height="8" rx="2" fill="#7fe0d0"/>
      <circle cx="54" cy="76" r="2" fill="#f2c94c"/><circle cx="60" cy="76" r="2" fill="#f2c94c"/><circle cx="66" cy="76" r="2" fill="#f2c94c"/>` },
    sp_crate_open: { vb: [120, 100], svg: `
      <path class="o" fill="#6b7490" d="M14 4 L106 4 L112 24 L8 24Z"/>
      <path class="o" fill="#3d4459" d="M10 24 L110 24 L106 30 L14 30Z"/>
      <path class="o" fill="#8fa7c9" d="M8 24 L112 24 L112 94 L8 94Z"/>
      <path class="o" fill="#f2c94c" d="M8 40 L112 40 L112 50 L8 50Z"/>` },
    sp_helmet: { vb: [100, 100], svg: `
      <circle class="o" cx="50" cy="46" r="38" fill="#fbf3e4"/>
      <path class="o" fill="#6fa8dc" d="M22 46 Q22 22 50 22 Q78 22 78 46 Q78 64 50 66 Q22 64 22 46Z"/>
      <path fill="#fff" opacity=".6" d="M30 36 Q36 26 48 26 Q36 32 34 44Z"/>
      <path class="o" fill="#d9573b" d="M20 80 L80 80 L84 94 L16 94Z"/>
      <circle class="o" cx="86" cy="40" r="5" fill="#f2c94c"/>` },
    sp_fusebox: { vb: [100, 120], svg: `
      <rect class="o" x="6" y="6" width="88" height="108" rx="6" fill="#c9d1e3"/>
      <rect class="o" x="16" y="16" width="68" height="62" rx="4" fill="#5b6380"/>
      <rect class="o" x="24" y="26" width="16" height="42" rx="3" fill="#8f97ad"/>
      <rect class="o" x="44" y="26" width="16" height="42" rx="3" fill="#8f97ad"/>
      <rect class="thin" x="64" y="26" width="14" height="42" rx="3" stroke-dasharray="4 4" fill="#3d4459"/>
      <path class="o" fill="#f2c94c" d="M50 84 L40 100 L50 100 L44 112 L60 94 L50 94 L56 84Z"/>
      <circle class="o" cx="22" cy="96" r="5" fill="#d9573b"/>` },
    sp_fusebox_on: { vb: [100, 120], svg: `
      <rect class="o" x="6" y="6" width="88" height="108" rx="6" fill="#c9d1e3"/>
      <rect class="o" x="16" y="16" width="68" height="62" rx="4" fill="#5b6380"/>
      <rect class="o" x="24" y="26" width="16" height="42" rx="3" fill="#8f97ad"/>
      <rect class="o" x="44" y="26" width="16" height="42" rx="3" fill="#8f97ad"/>
      <rect class="o" x="63" y="26" width="16" height="42" rx="3" fill="#f2c94c"/>
      <path class="o" fill="#f2c94c" d="M50 84 L40 100 L50 100 L44 112 L60 94 L50 94 L56 84Z"/>
      <circle class="o" cx="22" cy="96" r="5" fill="#7fcf8f"/>
      ${draw.sparkle(86, 12, .7)}` },
    sp_radio: { vb: [140, 110], svg: `
      <path class="thin" d="M110 30 L124 4"/><circle class="o" cx="124" cy="4" r="4" fill="#d9573b"/>
      <rect class="o" x="6" y="30" width="128" height="74" rx="10" fill="#8f97ad"/>
      <rect class="o" x="16" y="40" width="58" height="34" rx="6" fill="#2a2f45"/>
      <circle class="o" cx="96" cy="56" r="14" fill="#c9d1e3"/><path class="thin" d="M96 56 L104 48"/>
      <circle class="o" cx="24" cy="88" r="6" fill="#c9d1e3"/><circle class="o" cx="44" cy="88" r="6" fill="#c9d1e3"/>
      <path class="thin" d="M86 84 h36 M86 92 h36" opacity=".6"/>` },
    sp_radio_on: { vb: [140, 110], svg: `
      <path class="thin" d="M110 30 L124 4"/><circle class="o" cx="124" cy="4" r="4" fill="#7fcf8f"/>
      <path class="thin" d="M130 0 q6 6 0 12 M134 -4 q10 10 0 20" opacity=".7"/>
      <rect class="o" x="6" y="30" width="128" height="74" rx="10" fill="#8f97ad"/>
      <rect class="o" x="16" y="40" width="58" height="34" rx="6" fill="#2a2f45"/>
      <path class="thin" stroke="#7fcf8f" d="M22 58 l8 0 l5 -10 l6 20 l5 -10 l20 0" style="stroke-width:2px"/>
      <circle class="o" cx="96" cy="56" r="14" fill="#c9d1e3"/><path class="thin" d="M96 56 L104 48"/>
      <circle class="o" cx="24" cy="88" r="6" fill="#7fcf8f"/><circle class="o" cx="44" cy="88" r="6" fill="#f2c94c"/>
      <path class="thin" d="M86 84 h36 M86 92 h36" opacity=".6"/>` },
    sp_poster_planets: { vb: [110, 130], svg: `
      <path class="o" fill="#2a2f45" d="M6 6 L104 4 L106 124 L4 126Z"/>
      <rect x="14" y="12" width="84" height="18" rx="4" fill="#f2c94c"/>
      <path class="thin" d="M24 21 h64" opacity=".6"/>
      ${planet(30, 60, 12, '#d9573b', '#b8432c')}
      <path class="thin" stroke="#fbf3e4" d="M46 60 L58 60 M54 56 L58 60 L54 64" style="stroke-width:2px"/>
      ${planet(80, 60, 10, '#f2c48a', '#e0a23a', '#e0a23a')}
      <path class="thin" stroke="#fbf3e4" d="M78 76 L60 92 M60 86 L60 92 L66 92" style="stroke-width:2px"/>
      ${planet(48, 104, 12, '#6fa8dc', '#7fb069')}` },
    sp_airlock: { vb: [150, 170], svg: `
      <circle class="o" cx="75" cy="85" r="70" fill="#8f97ad"/>
      <circle class="o" cx="75" cy="85" r="56" fill="#c9d1e3"/>
      <path class="thick line" d="M75 29 L75 141 M19 85 L131 85" opacity=".5"/>
      <circle class="o" cx="75" cy="85" r="22" fill="#e8ecf4"/>
      <path class="thick line" d="M60 85 L90 85 M75 70 L75 100"/>
      <rect class="o" x="118" y="132" width="30" height="34" rx="5" fill="#2a2f45"/>
      <circle cx="126" cy="142" r="2.5" fill="#7fe0d0"/><circle cx="133" cy="142" r="2.5" fill="#7fe0d0"/><circle cx="140" cy="142" r="2.5" fill="#7fe0d0"/>
      <circle cx="126" cy="152" r="2.5" fill="#7fe0d0"/><circle cx="133" cy="152" r="2.5" fill="#7fe0d0"/><circle cx="140" cy="152" r="2.5" fill="#7fe0d0"/>
      <circle cx="56" cy="60" r="8" fill="#fff" opacity=".5"/>` },
    sp_item_fuse: { vb: [100, 100], svg: `
      <rect class="o" x="30" y="10" width="40" height="80" rx="8" fill="#f2c94c"/>
      <rect class="o" x="26" y="10" width="48" height="14" rx="4" fill="#8f97ad"/>
      <rect class="o" x="26" y="76" width="48" height="14" rx="4" fill="#8f97ad"/>
      <path class="o" fill="#fff3c4" d="M52 32 L42 50 L52 50 L46 68 L60 46 L50 46 L56 32Z"/>` },
    sp_item_helmet: { vb: [100, 100], svg: `
      <circle class="o" cx="50" cy="48" r="38" fill="#fbf3e4"/>
      <path class="o" fill="#6fa8dc" d="M22 48 Q22 24 50 24 Q78 24 78 48 Q78 66 50 68 Q22 66 22 48Z"/>
      <path fill="#fff" opacity=".6" d="M30 38 Q36 28 48 28 Q36 34 34 46Z"/>
      <path class="o" fill="#d9573b" d="M20 82 L80 82 L84 96 L16 96Z"/>` },
    sp_item_suit: { vb: [100, 100], svg: `
      <path class="o" fill="#fbf3e4" d="M30 14 L70 14 L88 40 L78 48 L70 38 L70 92 L54 92 L50 64 L46 92 L30 92 L30 38 L22 48 L12 40Z"/>
      <rect class="o" x="38" y="26" width="24" height="16" rx="3" fill="#6fa8dc"/>
      <path class="o" fill="#d9573b" d="M30 52 L70 52 L70 58 L30 58Z"/>
      <circle cx="44" cy="34" r="2" fill="#f2c94c"/><circle cx="56" cy="34" r="2" fill="#7fcf8f"/>` },
    sp_item_spacesuit: { vb: [100, 100], svg: `
      <path class="o" fill="#fbf3e4" d="M30 40 L70 40 L86 62 L76 68 L70 60 L70 96 L54 96 L50 78 L46 96 L30 96 L30 60 L24 68 L14 62Z"/>
      <path class="o" fill="#d9573b" d="M30 70 L70 70 L70 76 L30 76Z"/>
      <circle class="o" cx="50" cy="24" r="22" fill="#fbf3e4"/>
      <path class="o" fill="#6fa8dc" d="M34 24 Q34 10 50 10 Q66 10 66 24 Q66 34 50 36 Q34 34 34 24Z"/>
      <path fill="#fff" opacity=".6" d="M40 18 Q44 12 50 12 Q44 16 42 22Z"/>
      ${draw.sparkle(88, 20, .8)}` },
    sp_planet_red: { vb: [100, 100], svg: planet(50, 50, 34, '#d9573b', '#b8432c') + `<circle cx="62" cy="62" r="5" fill="#b8432c" opacity=".7"/>` },
    sp_planet_blue: { vb: [100, 100], svg: planet(50, 50, 34, '#6fa8dc', null) + `<path fill="#7fb069" d="M30 40 Q40 30 52 36 Q58 50 44 56 Q32 56 30 40Z M58 62 Q70 56 78 66 Q70 78 60 74Z"/>` },
    sp_planet_ring: { vb: [100, 100], svg: planet(50, 50, 24, '#f2c48a', '#e0a23a', '#c49a5a') },
    sp_planet_green: { vb: [100, 100], svg: planet(50, 50, 34, '#7fcf8f', '#5fae6f') },

    /* ---------- Kapitel 2: Mond ---------- */
    sp_bg_basis: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="#d8d2e6"/>
      <path fill="#e6e1f0" d="M-20 460 Q400 -120 820 460Z"/>
      <path class="thin" opacity=".4" d="M-20 460 Q400 -120 820 460 M120 460 Q400 40 680 460 M270 460 Q400 140 530 460"/>
      <path class="o" fill="#1c1840" d="M290 240 Q400 150 510 240 L510 330 L290 330Z"/>
      ${dots(14, 300, 180, 200, 80, 7)}
      <path class="o" fill="#b8b4c2" d="M292 316 Q400 296 508 316 L508 330 L292 330Z"/>
      <path class="o" fill="none" d="M290 240 Q400 150 510 240 L510 330 L290 330Z" style="stroke-width:5px"/>
      <path class="thick line" d="M400 168 L400 330 M290 286 L510 286" opacity=".7"/>
      <path class="o" fill="#bdb6d1" d="M-10 450 Q400 420 810 450 L810 610 L-10 610Z"/>
      <path class="thin" opacity=".35" d="M60 520 q40 -6 80 0 M600 560 q50 -8 100 0 M300 590 q40 -6 80 0"/>
      <path class="o" fill="#d9573b" d="M720 380 L770 380 L760 450 L730 450Z"/><path class="o" fill="#7fb069" d="M745 380 Q720 330 742 300 Q748 340 760 330 Q770 350 745 380Z"/>` },
    sp_bg_krater: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="url(#space)"/>
      ${dots(50, 0, 0, 800, 260, 13)}
      ${planet(650, 110, 50, '#6fa8dc', null)}
      <path fill="#7fb069" d="M620 96 Q634 82 652 90 Q656 108 640 112Z M664 124 Q678 118 686 130 Q676 142 666 138Z"/>
      ${moonGround(250)}
      <ellipse class="o" cx="400" cy="420" rx="300" ry="120" fill="#a9a5b4"/>
      <ellipse class="o" cx="400" cy="440" rx="240" ry="88" fill="#8f8a9e"/>
      <ellipse cx="400" cy="460" rx="170" ry="54" fill="#77728a"/>
      <path fill="#c9c6cf" d="M160 400 Q400 330 640 400 Q400 350 160 400Z" opacity=".7"/>
      <path class="thick line" d="M720 290 L720 210"/><path class="o" fill="#d9573b" d="M720 212 L770 222 L720 236Z"/>` },
    sp_bg_garage: { vb: [800, 600], bg: true, svg: `
      ${panelWall(430, '#c7c1da', '#b5aecb')}
      <path class="o" fill="#3d4459" d="M220 40 L580 40 L580 300 L220 300Z"/>
      ${Array.from({ length: 6 }, (_, i) => `<path class="thin" d="M220 ${80 + i * 40} L580 ${80 + i * 40}" opacity=".5"/>`).join('')}
      <path fill="#f2c94c" d="M220 300 L580 300 L580 318 L220 318Z"/>
      <path class="thick line" d="M40 90 L40 120 M120 90 L120 120 M680 90 L680 120"/>
      <path class="o" fill="#c9cfd6" d="M24 120 L56 120 L50 200 L30 200Z"/><path class="o" fill="#8a5a3a" d="M36 200 L44 200 L44 250 L36 250Z"/>
      <path class="o" fill="#d9573b" d="M106 120 L134 120 L134 190 L106 190Z"/><path class="o" fill="#c9cfd6" d="M114 190 L126 190 L122 240 L118 240Z"/>
      ${metalFloor(430)}
      <path class="thin" opacity=".3" d="M300 470 q100 30 200 0 M310 500 q90 30 180 0" style="stroke-width:6px"/>` },
    sp_bg_sternwarte: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="#b3a9cf"/>
      <path class="o" fill="#c9c0e0" d="M-20 470 L-20 260 Q400 -100 820 260 L820 470Z"/>
      <path class="o" fill="#141233" d="M300 470 L300 90 Q400 30 500 90 L500 470Z"/>
      <path class="thin" opacity=".5" d="M80 200 Q400 -40 720 200 M30 330 Q400 110 770 330"/>
      <path class="o" fill="#8a7fa8" d="M-10 460 L810 460 L810 610 L-10 610Z"/>
      <path class="thin" opacity=".4" d="M-10 500 L810 500 M200 460 L160 610 M600 460 L640 610"/>
      <path class="o" fill="#6b7490" d="M150 460 L190 360 L210 360 L190 460Z M250 460 L210 360 L230 360 L270 460Z"/>
      <path class="o" fill="#5fc9c0" d="M140 330 L320 230 L334 256 L154 356Z"/>
      <path class="o" fill="#f2c94c" d="M316 222 L344 208 L356 234 L328 248Z"/>
      <circle class="o" cx="210" cy="350" r="12" fill="#8f97ad"/>` },

    sp_moonbunny: { vb: [100, 130], svg: `
      <path class="o" fill="#f4f1fa" d="M30 40 Q20 4 32 2 Q42 4 42 38Z M58 38 Q58 4 68 2 Q80 4 70 40Z"/>
      <path fill="#f4c3cf" d="M32 34 Q27 10 32 8 Q36 12 37 34Z M63 34 Q64 12 68 8 Q72 10 68 34Z"/>
      <ellipse class="o" cx="50" cy="98" rx="30" ry="28" fill="#f4f1fa"/>
      <circle class="o" cx="50" cy="58" r="26" fill="#f4f1fa"/>
      ${eyes(50, 56, 1.1, 8)}${cheeks(50, 64, 1, 14)}
      <path class="o" fill="#f4a6a0" d="M46 63 L54 63 L50 67Z"/>
      <path class="thin" d="M50 67 q-4 5 -8 2 M50 67 q4 5 8 2"/>
      <circle class="o" cx="50" cy="58" r="40" fill="#cfe9f7" opacity=".25"/>
      <path fill="#fff" opacity=".6" d="M22 44 Q28 26 44 22 Q30 32 28 48Z"/>
      <ellipse class="o" cx="34" cy="124" rx="12" ry="6" fill="#f4f1fa"/><ellipse class="o" cx="66" cy="124" rx="12" ry="6" fill="#f4f1fa"/>
      <ellipse class="o" cx="50" cy="104" rx="14" ry="12" fill="#fbf3e4"/>` },
    sp_moonrock: { vb: [80, 60], svg: `
      <path class="o" fill="#b5b1c0" d="M8 50 Q2 30 18 20 Q30 6 50 12 Q72 14 76 34 Q78 52 60 56 Q30 60 8 50Z"/>
      <circle class="thin" cx="30" cy="30" r="6" fill="#9a96a8"/><circle class="thin" cx="56" cy="38" r="4" fill="#9a96a8"/>
      <path fill="#fff" opacity=".4" d="M20 24 Q30 14 44 16 Q30 20 24 30Z"/>` },
    sp_bigstar: { vb: [60, 60], svg: `<circle cx="30" cy="30" r="28" fill="url(#glow-warm)" opacity=".7"/>${draw.star(30, 31, 22, '#fff3c4')}` },
    sp_computer: { vb: [140, 120], svg: `
      <rect class="o" x="10" y="6" width="120" height="76" rx="10" fill="#8f97ad"/>
      <rect class="o" x="20" y="16" width="100" height="56" rx="6" fill="#2a2f45"/>
      <circle class="o" cx="42" cy="44" r="8" fill="#f2c94c"/><circle class="o" cx="62" cy="44" r="8" fill="#7fcf8f"/>
      <circle class="o" cx="82" cy="44" r="8" fill="#f2c94c"/><circle class="o" cx="102" cy="44" r="8" fill="#d9573b"/>
      <path class="o" fill="#6b7490" d="M56 82 L84 82 L90 100 L50 100Z"/>
      <rect class="o" x="20" y="100" width="100" height="14" rx="4" fill="#c9d1e3"/>` },
    sp_moonrover: { vb: [200, 130], svg: `
      <path class="thick line" d="M60 56 L60 20"/><path class="o" fill="#f2c94c" d="M60 20 L90 28 L60 36Z"/>
      <path class="o" fill="#fbf3e4" d="M20 92 L30 56 L170 56 L184 92Z"/>
      <path class="o" fill="#5fc9c0" d="M44 56 L64 30 L128 30 L144 56Z"/>
      <path class="o" fill="#cfe9f7" d="M70 52 L80 36 L120 36 L128 52Z"/>
      <rect class="o" x="150" y="64" width="24" height="12" rx="3" fill="#f2c94c"/>
      <circle class="o" cx="50" cy="102" r="22" fill="#5b6380"/><circle class="o" cx="50" cy="102" r="9" fill="#c9d1e3"/>
      <circle class="thin" cx="150" cy="102" r="22" stroke-dasharray="6 6" fill="none"/>
      <path class="thin" d="M136 116 L164 116" opacity=".4"/>
      <rect class="thin" x="90" y="66" width="34" height="18" rx="3" stroke-dasharray="4 4" fill="#3d4459"/>` },
    sp_moonrover_full: { vb: [200, 130], svg: `
      <path class="thick line" d="M60 56 L60 20"/><path class="o" fill="#f2c94c" d="M60 20 L90 28 L60 36Z"/>
      <path class="o" fill="#fbf3e4" d="M20 92 L30 56 L170 56 L184 92Z"/>
      <path class="o" fill="#5fc9c0" d="M44 56 L64 30 L128 30 L144 56Z"/>
      <path class="o" fill="#cfe9f7" d="M70 52 L80 36 L120 36 L128 52Z"/>
      <circle class="o" cx="50" cy="102" r="22" fill="#5b6380"/><circle class="o" cx="50" cy="102" r="9" fill="#c9d1e3"/>
      <circle class="o" cx="150" cy="102" r="22" fill="#5b6380"/><circle class="o" cx="150" cy="102" r="9" fill="#c9d1e3"/>
      <rect class="o" x="90" y="66" width="34" height="18" rx="3" fill="#7fcf8f"/>` },
    sp_charger: { vb: [100, 150], svg: `
      <rect class="o" x="14" y="6" width="72" height="138" rx="10" fill="#c9d1e3"/>
      <rect class="o" x="24" y="16" width="52" height="30" rx="5" fill="#2a2f45"/>
      <circle cx="36" cy="31" r="5" fill="#f2c94c"/><circle cx="50" cy="31" r="5" fill="#7fcf8f"/><circle cx="64" cy="31" r="5" fill="#d9573b"/>
      <rect class="o" x="30" y="60" width="40" height="50" rx="5" fill="#5b6380"/>
      <rect class="o" x="38" y="68" width="24" height="34" rx="3" fill="#7fcf8f"/>
      <path class="o" fill="#fff3c4" d="M52 72 L44 86 L50 86 L46 98 L58 82 L52 82 L56 72Z"/>
      <path class="thick line" d="M86 120 Q100 130 96 146"/>` },
    sp_charger_empty: { vb: [100, 150], svg: `
      <rect class="o" x="14" y="6" width="72" height="138" rx="10" fill="#c9d1e3"/>
      <rect class="o" x="24" y="16" width="52" height="30" rx="5" fill="#2a2f45"/>
      <path class="thin" stroke="#7fcf8f" d="M32 32 l8 6 l18 -14" style="stroke-width:3px"/>
      <rect class="o" x="30" y="60" width="40" height="50" rx="5" fill="#3d4459"/>
      <path class="thick line" d="M86 120 Q100 130 96 146"/>` },
    sp_hook: { vb: [60, 100], svg: `
      <path class="thick line" d="M30 4 L30 50"/>
      <path class="o" fill="#c9cfd6" d="M24 50 L36 50 L36 64 Q36 92 18 88 Q6 84 10 70 L18 72 Q16 80 22 80 Q28 80 28 66 L24 64Z"/>
      <rect class="o" x="22" y="0" width="16" height="10" rx="3" fill="#8f97ad"/>` },
    sp_crater_wheel: { vb: [80, 80], svg: `
      <circle class="o" cx="40" cy="40" r="32" fill="#5b6380"/>
      <circle class="o" cx="40" cy="40" r="13" fill="#c9d1e3"/>
      <path class="thin" d="M40 8 v10 M40 62 v10 M8 40 h10 M62 40 h10 M18 18 l7 7 M55 55 l7 7 M62 18 l-7 7 M18 62 l7 -7" opacity=".6"/>
      ${draw.sparkle(70, 10, .7, '#fff')}` },
    sp_item_rope: { vb: [100, 100], svg: `
      <ellipse class="o" cx="50" cy="54" rx="36" ry="30" fill="#e0b46a"/>
      <ellipse class="o" cx="50" cy="54" rx="22" ry="16" fill="#c9963f"/>
      <ellipse class="o" cx="50" cy="54" rx="10" ry="7" fill="#e0b46a"/>
      <path class="thin" d="M84 64 Q96 78 84 92"/>` },
    sp_item_hook: { vb: [100, 100], svg: `
      <path class="o" fill="#c9cfd6" d="M44 10 L56 10 L56 50 Q56 90 30 86 Q12 82 16 62 L28 64 Q26 74 34 74 Q44 74 44 52Z"/>
      <circle class="o" cx="50" cy="10" r="7" fill="#8f97ad"/>` },
    sp_item_grapple: { vb: [100, 100], svg: `
      <ellipse class="o" cx="34" cy="62" rx="26" ry="22" fill="#e0b46a"/>
      <ellipse class="o" cx="34" cy="62" rx="14" ry="10" fill="#c9963f"/>
      <path class="thin" d="M56 54 Q70 40 70 30"/>
      <path class="o" fill="#c9cfd6" d="M64 30 L76 30 L76 22 Q76 2 92 6 Q100 10 96 22 L88 20 Q90 14 86 14 Q82 14 82 24 L82 30 Z"/>` },
    sp_item_wheel: { vb: [100, 100], svg: `
      <circle class="o" cx="50" cy="50" r="38" fill="#5b6380"/>
      <circle class="o" cx="50" cy="50" r="16" fill="#c9d1e3"/>
      <path class="thin" d="M50 12 v12 M50 76 v12 M12 50 h12 M76 50 h12" opacity=".6"/>` },
    sp_item_battery: { vb: [100, 100], svg: `
      <rect class="o" x="22" y="20" width="56" height="70" rx="8" fill="#7fcf8f"/>
      <rect class="o" x="38" y="10" width="24" height="10" rx="3" fill="#8f97ad"/>
      <path class="o" fill="#fff3c4" d="M54 32 L40 56 L50 56 L44 78 L62 50 L52 50 L58 32Z"/>` },

    /* ---------- Kapitel 3: Bunter Planet ---------- */
    sp_bg_landeplatz: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="#f6c1d6"/>
      <rect width="800" height="160" fill="#d8a9e0"/>
      <path fill="#e8b4dc" d="M0 160 L800 160 L800 250 L0 250Z"/>
      <circle class="o" cx="140" cy="100" r="40" fill="#fbe7a6"/><circle cx="126" cy="90" r="9" fill="#f2d27a"/>
      <circle class="o" cx="230" cy="60" r="18" fill="#b9e6f0"/>
      <path class="o" fill="#7fd6c4" d="M-10 330 Q140 230 300 320 Q460 220 620 310 Q720 250 810 300 L810 610 L-10 610Z"/>
      <path class="o" fill="#5fc0b0" d="M-10 420 Q200 380 400 410 Q600 370 810 410 L810 610 L-10 610Z"/>
      ${[[90, 400], [700, 380], [560, 470]].map(([x, y]) => `<path class="o" fill="#b48ad6" d="M${x} ${y} Q${x - 4} ${y - 60} ${x + 4} ${y - 80}"/><circle class="o" cx="${x + 4}" cy="${y - 86}" r="12" fill="#f2c94c"/>`).join('')}
      <ellipse class="o" cx="400" cy="520" rx="170" ry="40" fill="#c9c6cf"/>
      <ellipse cx="400" cy="520" rx="130" ry="26" fill="none" stroke="#f2c94c" stroke-width="6" stroke-dasharray="20 14"/>` },
    sp_bg_dorf: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="#f6c1d6"/>
      <rect width="800" height="180" fill="#d8a9e0"/>
      <circle class="o" cx="680" cy="90" r="34" fill="#fbe7a6"/>
      <path class="o" fill="#7fd6c4" d="M-10 380 Q400 330 810 380 L810 610 L-10 610Z"/>
      ${[[110, 380, '#f2a65a', '#d9573b'], [660, 370, '#b48ad6', '#8a6fc4']].map(([x, y, c1, c2]) => `
        <path class="o" fill="#fbf3e4" d="M${x - 50} ${y} L${x - 44} ${y - 120} L${x + 44} ${y - 120} L${x + 50} ${y}Z"/>
        <path class="o" fill="${c1}" d="M${x - 90} ${y - 110} Q${x} ${y - 230} ${x + 90} ${y - 110} Q${x} ${y - 90} ${x - 90} ${y - 110}Z"/>
        <circle cx="${x - 30}" cy="${y - 150}" r="10" fill="${c2}" opacity=".6"/><circle cx="${x + 26}" cy="${y - 168}" r="8" fill="${c2}" opacity=".6"/>
        <path class="o" fill="${c2}" d="M${x - 18} ${y} L${x - 18} ${y - 40} Q${x} ${y - 62} ${x + 18} ${y - 40} L${x + 18} ${y}Z"/>
        <circle class="o" cx="${x}" cy="${y - 80}" r="12" fill="#fbe7a6"/>`).join('')}
      <path class="thin" d="M200 250 Q400 290 560 240" opacity=".7"/>
      ${[260, 330, 400, 470, 530].map((x, i) => `<circle class="o" cx="${x}" cy="${262 + Math.sin(i) * 12}" r="9" fill="${['#f2c94c', '#7fcf8f', '#6fa8dc', '#d9573b', '#b48ad6'][i]}"/>`).join('')}` },
    sp_bg_hoehle: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="#4a3a6b"/>
      <path class="o" fill="#5d4a85" d="M-10 -10 L810 -10 L810 120 Q700 200 600 140 Q500 220 400 150 Q300 230 200 150 Q100 200 -10 130Z"/>
      <path class="o" fill="#3d2f5a" d="M-10 440 Q200 400 400 430 Q600 400 810 440 L810 610 L-10 610Z"/>
      <path class="o" fill="#5d4a85" d="M-10 130 Q60 300 -10 450Z M810 120 Q740 300 810 450Z"/>
      ${[[80, 420], [150, 440], [700, 430]].map(([x, y]) => `<path class="o" fill="#7fe0d0" d="M${x} ${y} L${x + 10} ${y - 40} L${x + 20} ${y}Z" opacity=".8"/>`).join('')}
      <path class="thin" opacity=".4" d="M300 480 q40 -6 80 0 M500 520 q50 -8 100 0"/>` },
    sp_bg_kristallsaal: { vb: [800, 600], bg: true, svg: `
      <rect width="800" height="600" fill="#3d3a7a"/>
      <circle cx="400" cy="300" r="320" fill="url(#glow-cool)" opacity=".5"/>
      <path class="o" fill="#4e4a92" d="M-10 -10 L810 -10 L810 90 Q600 160 400 110 Q200 160 -10 90Z"/>
      ${[[60, 470, 140, '#7fe0d0'], [150, 470, 90, '#c49cff'], [650, 470, 120, '#c49cff'], [730, 470, 160, '#7fe0d0'], [560, 470, 70, '#7fe0d0']].map(([x, y, h, c]) => `
        <path class="o" fill="${c}" d="M${x - 26} ${y} L${x - 20} ${y - h * .7} L${x} ${y - h} L${x + 20} ${y - h * .7} L${x + 26} ${y}Z" opacity=".9"/>
        <path fill="#fff" opacity=".45" d="M${x - 12} ${y - 10} L${x - 8} ${y - h * .65} L${x} ${y - h * .9}Z"/>`).join('')}
      <path class="o" fill="#2e2b60" d="M-10 460 Q400 430 810 460 L810 610 L-10 610Z"/>
      ${draw.sparkle(260, 150, 1.4, '#e8fbff')}${draw.sparkle(560, 180, 1.2, '#e8fbff')}${draw.sparkle(420, 70, 1, '#e8fbff')}` },

    sp_rocket_broken: { vb: [120, 200], svg: `
      <path class="o" fill="#d9573b" d="M22 170 L10 196 L36 186Z M98 170 L110 196 L84 186Z"/>
      <path class="o" fill="#d9573b" d="M30 140 L8 176 L32 172Z M90 140 L112 176 L88 172Z"/>
      <path class="o" fill="#fbf3e4" d="M30 186 L30 70 Q60 -6 90 70 L90 186Z"/>
      <path class="o" fill="#d9573b" d="M38 48 Q60 0 82 48Z"/>
      <circle class="o" cx="60" cy="96" r="16" fill="#6fa8dc"/><circle cx="55" cy="91" r="5" fill="#fff" opacity=".7"/>
      <path class="thin" d="M30 136 h60" opacity=".5"/>
      <path class="thick line" d="M60 18 L60 10 M60 10 L52 4" opacity=".9"/>
      <path class="o" fill="#5b6380" d="M48 186 L72 186 L68 198 L52 198Z"/>
      <path class="thin" d="M44 150 l8 8 M70 160 l6 -6" opacity=".6"/>
      <circle class="thin" cx="60" cy="160" r="9" stroke-dasharray="3 3" fill="#3d4459"/>` },
    sp_rocket_fixed: { vb: [120, 200], svg: `
      <path class="o" fill="#d9573b" d="M30 140 L8 176 L32 172Z M90 140 L112 176 L88 172Z"/>
      <path class="o" fill="#fbf3e4" d="M30 186 L30 70 Q60 -6 90 70 L90 186Z"/>
      <path class="o" fill="#d9573b" d="M38 48 Q60 0 82 48Z"/>
      <path class="thick line" d="M60 18 L60 2"/><circle class="o" cx="60" cy="2" r="4" fill="#f2c94c"/>
      <circle class="o" cx="60" cy="96" r="16" fill="#6fa8dc"/><circle cx="55" cy="91" r="5" fill="#fff" opacity=".7"/>
      <circle class="o" cx="60" cy="160" r="9" fill="#7fe0d0"/>
      <path class="o" fill="#5b6380" d="M48 186 L72 186 L68 198 L52 198Z"/>` },
    sp_glowflower: { vb: [70, 100], svg: `
      <circle cx="35" cy="30" r="30" fill="url(#glow-warm)"/>
      <path class="thick line" stroke="#5fae6f" d="M35 96 Q30 70 35 46"/>
      <path class="thick line" d="M35 96 Q30 70 35 46"/>
      <path class="o" fill="#7fcf8f" d="M33 76 Q14 70 12 58 Q28 58 34 70Z"/>
      ${[0, 72, 144, 216, 288].map((a) => `<ellipse class="o" cx="${35 + 12 * Math.cos(a * Math.PI / 180)}" cy="${32 + 12 * Math.sin(a * Math.PI / 180)}" rx="9" ry="9" fill="#f6a6d0"/>`).join('')}
      <circle class="o" cx="35" cy="32" r="8" fill="#f2c94c"/>` },
    sp_cave_entrance: { vb: [160, 130], svg: `
      <path class="o" fill="#9a7fc0" d="M4 126 Q0 40 60 14 Q110 -4 146 40 Q162 80 156 126Z"/>
      <path class="o" fill="#2a2045" d="M30 126 Q30 54 80 40 Q126 50 130 126Z"/>
      <path class="thin" d="M20 70 q10 -4 16 4 M134 60 q8 6 6 16" opacity=".5"/>
      ${draw.sparkle(80, 80, .8, '#7fe0d0')}` },
    sp_alien: { vb: [110, 140], svg: `
      <path class="thick line" d="M38 34 Q30 14 22 10 M72 34 Q80 14 88 10"/>
      <circle class="o" cx="22" cy="10" r="6" fill="#f2c94c"/><circle class="o" cx="88" cy="10" r="6" fill="#f2c94c"/>
      <path class="o" fill="#7fd6c4" d="M14 120 Q6 60 30 40 Q55 22 80 40 Q104 60 96 120 Q55 134 14 120Z"/>
      <circle class="o" cx="38" cy="64" r="9" fill="#fff"/><circle class="o" cx="55" cy="56" r="10" fill="#fff"/><circle class="o" cx="72" cy="64" r="9" fill="#fff"/>
      <circle cx="39" cy="65" r="4" fill="#3b2c24"/><circle cx="56" cy="57" r="4.5" fill="#3b2c24"/><circle cx="73" cy="65" r="4" fill="#3b2c24"/>
      <circle cx="40.5" cy="63.5" r="1.3" fill="#fff"/><circle cx="57.5" cy="55.5" r="1.5" fill="#fff"/><circle cx="74.5" cy="63.5" r="1.3" fill="#fff"/>
      ${cheeks(55, 82, 1.1, 22)}
      <path class="thin" d="M44 84 Q55 96 66 84"/>
      <path class="o" fill="#7fd6c4" d="M16 86 Q2 92 6 104 Q14 100 18 98Z M94 86 Q108 92 104 104 Q96 100 92 98Z"/>
      <circle cx="40" cy="104" r="4" fill="#5fc0b0"/><circle cx="66" cy="110" r="5" fill="#5fc0b0"/><circle cx="76" cy="98" r="3" fill="#5fc0b0"/>
      <ellipse class="o" cx="36" cy="126" rx="12" ry="6" fill="#5fc0b0"/><ellipse class="o" cx="74" cy="126" rx="12" ry="6" fill="#5fc0b0"/>` },
    sp_alien_kids: { vb: [150, 100], svg: `
      <path class="o" fill="#f6a6d0" d="M10 92 Q4 50 34 44 Q64 50 58 92Z"/>
      ${eyes(34, 62, .9, 6)}${cheeks(34, 70, .8, 11)}
      <ellipse class="o" cx="34" cy="76" rx="5" ry="4" fill="#b8432c"/>
      <path class="thick line" d="M34 44 L34 32"/><circle class="o" cx="34" cy="30" r="5" fill="#b48ad6"/>
      <path class="o" fill="#f2c94c" d="M84 94 Q76 46 112 40 Q146 46 138 94Z"/>
      ${eyes(110, 60, .9, 6)}${cheeks(110, 68, .8, 11)}
      <ellipse class="o" cx="110" cy="74" rx="5" ry="4" fill="#b8432c"/>
      <path class="thick line" d="M100 42 L94 30 M120 42 L126 30"/><circle class="o" cx="94" cy="28" r="4" fill="#7fd6c4"/><circle class="o" cx="126" cy="28" r="4" fill="#7fd6c4"/>
      <path class="o" fill="#3b2c24" d="M66 30 L66 12 L78 8 L78 26"/><circle cx="62" cy="30" r="5" fill="#3b2c24"/><circle cx="74" cy="26" r="5" fill="#3b2c24"/>` },
    sp_mural: { vb: [160, 110], svg: `
      <path class="o" fill="#fbf3e4" d="M6 8 L154 4 L156 104 L4 106Z"/>
      <path class="o" fill="#2a2045" d="M20 94 Q20 30 50 24 Q80 30 80 94Z"/>
      <circle class="o" cx="104" cy="40" r="14" fill="${ROT}"/>
      <circle class="o" cx="104" cy="72" r="14" fill="${LILA}"/>
      <circle class="o" cx="138" cy="56" r="14" fill="${TUERKIS}"/>
      <path class="thin" d="M104 54 L104 58 M116 78 L126 66" style="stroke-width:2.5px"/>
      <path class="thin" d="M84 56 L96 56 M90 52 L96 56 L90 60"/>
      <text x="104" y="45" text-anchor="middle" font-family="Patrick Hand, sans-serif" font-size="14" fill="#fff">1</text>
      <text x="104" y="77" text-anchor="middle" font-family="Patrick Hand, sans-serif" font-size="14" fill="#fff">2</text>
      <text x="138" y="61" text-anchor="middle" font-family="Patrick Hand, sans-serif" font-size="14" fill="#3b2c24">3</text>` },
    sp_glowshroom: { vb: [80, 90], svg: `
      <circle cx="40" cy="34" r="38" fill="url(#glow-cool)"/>
      <path class="o" fill="#e8fbff" d="M32 86 L34 44 L46 44 L48 86Z"/>
      <path class="o" fill="#7fe0d0" d="M6 46 Q10 8 40 8 Q70 8 74 46 Q40 54 6 46Z"/>
      <circle cx="26" cy="28" r="5" fill="#e8fbff"/><circle cx="48" cy="20" r="4" fill="#e8fbff"/><circle cx="58" cy="34" r="3.5" fill="#e8fbff"/>` },
    sp_glowworm: { vb: [100, 50], svg: `
      ${[14, 32, 50, 68].map((x, i) => `<circle class="o" cx="${x}" cy="${30 - (i % 2) * 6}" r="10" fill="#f2c94c"/>`).join('')}
      <circle class="o" cx="84" cy="22" r="12" fill="#f2c94c"/>
      ${eyes(84, 20, .7, 4)}<path class="thin" d="M80 27 q4 3 8 0"/>
      <path class="thin" d="M88 10 L94 2 M80 10 L76 2"/>` },
    sp_cave_gate: { vb: [150, 170], svg: `
      <path class="o" fill="#9a7fc0" d="M4 166 L4 70 Q4 4 75 4 Q146 4 146 70 L146 166Z"/>
      <path class="o" fill="#6b5a92" d="M20 166 L20 74 Q20 22 75 22 Q130 22 130 74 L130 166Z"/>
      <path class="thin" d="M75 22 L75 166" opacity=".6"/>
      <circle class="o" cx="45" cy="100" r="11" fill="#fbf3e4"/><circle class="o" cx="75" cy="100" r="11" fill="#fbf3e4"/><circle class="o" cx="105" cy="100" r="11" fill="#fbf3e4"/>
      <path class="thin" d="M45 92 v8 M75 92 v8 M105 92 v8"/>
      ${draw.sparkle(75, 50, .9, '#7fe0d0')}` },
    sp_cave_gate_open: { vb: [150, 170], svg: `
      <path class="o" fill="#9a7fc0" d="M4 166 L4 70 Q4 4 75 4 Q146 4 146 70 L146 166Z"/>
      <path class="o" fill="#2a2045" d="M20 166 L20 74 Q20 22 75 22 Q130 22 130 74 L130 166Z"/>
      <circle cx="75" cy="110" r="44" fill="url(#glow-cool)"/>
      ${draw.sparkle(60, 90, 1, '#7fe0d0')}${draw.sparkle(96, 120, .8, '#c49cff')}` },
    sp_pedestal: { vb: [110, 160], svg: `
      <circle cx="55" cy="44" r="44" fill="url(#glow-cool)"/>
      <path class="o" fill="#7fe0d0" d="M55 8 L74 36 L55 80 L36 36Z"/>
      <path class="o" fill="#b9f2ea" d="M55 8 L62 36 L55 80 L48 36Z"/>
      <path class="o" fill="#9a7fc0" d="M24 84 L86 84 L80 98 L30 98Z"/>
      <path class="o" fill="#b39ad6" d="M34 98 L76 98 L72 140 L38 140Z"/>
      <path class="o" fill="#9a7fc0" d="M20 140 L90 140 L94 154 L16 154Z"/>
      ${[[44, 112], [55, 112], [66, 112], [55, 126]].map(([x, y]) => `<circle class="thin" cx="${x}" cy="${y}" r="4" fill="#fbf3e4"/>`).join('')}` },
    sp_pedestal_empty: { vb: [110, 160], svg: `
      <path class="o" fill="#9a7fc0" d="M24 84 L86 84 L80 98 L30 98Z"/>
      <path class="o" fill="#b39ad6" d="M34 98 L76 98 L72 140 L38 140Z"/>
      <path class="o" fill="#9a7fc0" d="M20 140 L90 140 L94 154 L16 154Z"/>
      ${draw.sparkle(55, 70, .8, '#e8fbff')}` },
    sp_sym_moon: { vb: [100, 100], svg: `<path class="o" fill="#fbe7a6" d="M62 12 Q24 18 24 52 Q26 86 64 90 Q36 76 36 50 Q38 24 62 12Z"/>` },
    sp_sym_star: { vb: [100, 100], svg: draw.star(50, 52, 38, '#f2c94c') },
    sp_sym_sun: { vb: [100, 100], svg: `
      <path class="thick line" stroke="#f2a03b" d="M50 6 v14 M50 80 v14 M6 50 h14 M80 50 h14 M18 18 l10 10 M72 72 l10 10 M82 18 l-10 10 M18 82 l10 -10"/>
      <path class="thick line" d="M50 6 v14 M50 80 v14 M6 50 h14 M80 50 h14 M18 18 l10 10 M72 72 l10 10 M82 18 l-10 10 M18 82 l10 -10"/>
      <circle class="o" cx="50" cy="50" r="24" fill="#f2c94c"/>` },
    sp_sym_planet: { vb: [100, 100], svg: planet(50, 50, 22, '#b48ad6', '#8a6fc4', '#7fd6c4') },
    sp_item_flower: { vb: [100, 100], svg: `
      <path class="thick line" d="M50 96 Q46 70 50 44"/>
      <path class="o" fill="#7fcf8f" d="M48 76 Q28 70 26 58 Q42 58 48 70Z"/>
      ${[0, 72, 144, 216, 288].map((a) => `<ellipse class="o" cx="${50 + 14 * Math.cos(a * Math.PI / 180)}" cy="${30 + 14 * Math.sin(a * Math.PI / 180)}" rx="11" ry="11" fill="#f6a6d0"/>`).join('')}
      <circle class="o" cx="50" cy="30" r="10" fill="#f2c94c"/>` },
    sp_item_antenna: { vb: [100, 100], svg: `
      <path class="thick line" d="M50 92 L50 24"/>
      <circle class="o" cx="50" cy="18" r="8" fill="#f2c94c"/>
      <path class="thin" d="M36 12 q-8 6 0 14 M64 12 q8 6 0 14 M28 6 q-14 12 0 26 M72 6 q14 12 0 26"/>
      <rect class="o" x="38" y="82" width="24" height="14" rx="3" fill="#8f97ad"/>` },
    sp_item_crystal: { vb: [100, 100], svg: `
      <path class="o" fill="#7fe0d0" d="M50 6 L76 38 L50 94 L24 38Z"/>
      <path class="o" fill="#b9f2ea" d="M50 6 L60 38 L50 94 L40 38Z"/>
      <path class="thin" d="M24 38 L76 38"/>
      ${draw.sparkle(82, 16, .8, '#fff')}` },
  });

  WORLDS.push({
    id: 'weltraum',
    name: 'Weltraum',
    cover: 'cover_weltraum',
    adventures: [
      /* ============ Kapitel 1 ============ */
      {
        id: 'station',
        title: 'Die Raumstation',
        thumb: 'sp_bg_kabine',
        intro: 'Bing! Du wachst in der Raumstation auf. Der Strom ist ausgefallen und die Luftschleuse ist zu. Hilf Roboter Pip, damit du zur Erde zurückfunken und aussteigen kannst!',
        outro: 'Zisch! Die Luftschleuse öffnet sich und du schwebst in deinem Raumanzug zur Fähre nach Hause. Pip winkt dir zu!',
        start: 'kabine',
        items: {
          sicherung: { name: 'Sicherung', art: 'sp_item_fuse' },
          anzug: { name: 'Raumanzug (ohne Helm)', art: 'sp_item_suit' },
          helm: { name: 'Helm', art: 'sp_item_helmet' },
          raumanzug: { name: 'Raumanzug mit Helm', art: 'sp_item_spacesuit' },
        },
        combos: [{ a: 'anzug', b: 'helm', gives: 'raumanzug', text: 'Klick! Der Helm passt genau auf den Anzug. Jetzt ist dein Raumanzug komplett!' }],
        pages: {
          kabine: {
            name: 'Meine Kabine',
            bg: 'sp_bg_kabine',
            objects: [
              { id: 'pip', art: 'sp_robot', x: 50, y: 69, w: 12, name: 'Roboter Pip',
                say: 'Piep! Ich bin Pip. Der Strom ist weg! Im Lager links liegt eine Ersatz-Sicherung. Aber dort ist es stockdunkel.',
                note: 'Pip: Die Ersatz-Sicherung liegt im dunklen Lager.' },
              { id: 'logbuch', art: 'sp_logbook', x: 86, y: 22, w: 13, name: 'Logbuch',
                say: 'Im Logbuch steht: „Code für die Kiste im Lager: Zähle erst die Raketen-Aufkleber in meiner Kabine, dann die Stern-Aufkleber.“',
                note: 'Lager-Kiste: erst Raketen-Aufkleber zählen, dann Stern-Aufkleber.' },
              { id: 'r1', art: 'sp_sticker_rocket', x: 20, y: 24, w: 5, static: true, rot: -6 },
              { id: 'r2', art: 'sp_sticker_rocket', x: 71, y: 31, w: 5, static: true, rot: 8 },
              { id: 's1', art: 'sp_sticker_star', x: 27, y: 15, w: 4.5, static: true, rot: 6 },
              { id: 's2', art: 'sp_sticker_star', x: 29, y: 40, w: 4.5, static: true, rot: -8 },
              { id: 's3', art: 'sp_sticker_star', x: 71, y: 12, w: 4.5, static: true },
              { id: 's4', art: 'sp_sticker_star', x: 12, y: 30, w: 4.5, static: true, rot: 10 },
              { id: 'spind', art: 'sp_locker', x: 36, y: 64, w: 9, name: 'Spind',
                give: 'anzug', become: 'sp_locker_open', okText: 'Im Spind hängt ein Raumanzug. Aber der Helm fehlt!', doneText: 'Der Spind ist leer.' },
              { id: 'zumlager', art: 'sp_hatch', x: 11, y: 58, w: 13, name: 'Tür zum Lager', goto: 'lager' },
              { id: 'zumfunk', art: 'nav_right', x: 92, y: 89, w: 9, name: 'Zum Funkraum', goto: 'funk' },
            ],
          },
          lager: {
            name: 'Das Lager',
            bg: 'sp_bg_lager',
            back: 'kabine',
            dark: true,
            enter: 'Huch, hier ist es stockdunkel! Nur ein kleines Licht leuchtet.',
            objects: [
              { id: 'notlicht', art: 'sp_emergency_light', x: 50, y: 22, w: 9, name: 'Notlicht', glow: true,
                light: true, okText: 'Klick! Das Notlicht geht an. Jetzt siehst du das ganze Lager.', doneText: 'Das Notlicht leuchtet hell.' },
              { id: 'kiste', art: 'sp_crate', x: 38, y: 78, w: 20, name: 'Kiste',
                puzzle: { type: 'code', prompt: 'Die Kiste hat ein Zahlenschloss mit zwei Zahlen.', answer: '24' },
                give: 'sicherung', become: 'sp_crate_open', okText: 'Piep-piep, klack! In der Kiste liegt die Ersatz-Sicherung.', doneText: 'Die Kiste ist leer.' },
              { id: 'helm', art: 'sp_helmet', x: 72, y: 80, w: 12, name: 'Helm',
                give: 'helm', remove: true, okText: 'Da liegt ein Raumhelm! Du nimmst ihn mit.' },
            ],
          },
          funk: {
            name: 'Der Funkraum',
            bg: 'sp_bg_funk',
            back: 'kabine',
            objects: [
              { id: 'kasten', art: 'sp_fusebox', x: 18, y: 45, w: 14, name: 'Sicherungskasten',
                needs: ['sicherung'], needText: 'Im Sicherungskasten fehlt eine Sicherung. Deshalb gibt es keinen Strom!',
                become: 'sp_fusebox_on', okText: 'Du steckst die Sicherung hinein. Brummm! Überall gehen die Lichter an.', doneText: 'Der Strom ist wieder da.' },
              { id: 'funkgeraet', art: 'sp_radio', x: 55, y: 74, w: 22, name: 'Funkgerät',
                after: ['kasten'], afterText: 'Das Funkgerät ist ganz still. Ohne Strom geht es nicht.',
                puzzle: { type: 'wheels', prompt: 'Das Funkgerät will das Planeten-Passwort. Stelle die drei Planeten ein!',
                  options: [{ art: 'sp_planet_blue', label: 'Blauer Planet' }, { art: 'sp_planet_red', label: 'Roter Planet' }, { art: 'sp_planet_green', label: 'Grüner Planet' }, { art: 'sp_planet_ring', label: 'Ringplanet' }],
                  answer: [1, 3, 0] },
                become: 'sp_radio_on', okText: 'Knister, knister … „Hier ist die Erde! Der Code für die Luftschleuse ist 3 – 1 – 4. Gute Heimreise!“',
                note: 'Funkspruch der Erde: Schleusen-Code 3 – 1 – 4.', doneText: 'Das Funkgerät rauscht leise.' },
              { id: 'zurschleuse', art: 'nav_right', x: 92, y: 89, w: 9, name: 'Zur Luftschleuse', goto: 'schleuse' },
            ],
          },
          schleuse: {
            name: 'Die Luftschleuse',
            bg: 'sp_bg_schleuse',
            back: 'funk',
            enter: 'Hier ist die Luftschleuse. Dahinter wartet die Fähre nach Hause.',
            objects: [
              { id: 'plakat', art: 'sp_poster_planets', x: 22, y: 33, w: 14, name: 'Plakat',
                say: 'Auf dem Plakat steht: „Planeten-Passwort: zuerst der rote Planet, dann der Ringplanet, dann der blaue Planet.“',
                note: 'Planeten-Passwort: Rot – Ringplanet – Blau.' },
              { id: 'schleusentuer', art: 'sp_airlock', x: 79, y: 40, w: 30, name: 'Luftschleuse',
                needs: ['raumanzug'], needText: 'Halt! Ohne kompletten Raumanzug mit Helm darfst du nicht ins All.',
                puzzle: { type: 'code', prompt: 'Die Luftschleuse hat ein Zahlenfeld mit drei Zahlen.', answer: '314' },
                win: true },
            ],
          },
        },
        hints: [
          { until: 'pip', text: 'Sprich mit Roboter Pip.' },
          { until: 'logbuch', text: 'Lies das Logbuch an der Wand.' },
          { until: 'notlicht', text: 'Geh links ins Lager und tippe auf das kleine Licht.' },
          { until: 'kiste', text: 'Zähle in deiner Kabine die Raketen-Aufkleber und die Stern-Aufkleber. Das ist der Kisten-Code.' },
          { until: 'helm', text: 'Im Lager liegt noch ein Helm.' },
          { until: 'kasten', text: 'Bring die Sicherung in den Funkraum zum Sicherungskasten.' },
          { until: 'plakat', text: 'Schau dir das Plakat an der Luftschleuse an.' },
          { until: 'funkgeraet', text: 'Stelle am Funkgerät die Planeten ein: Rot, Ringplanet, Blau.' },
          { until: 'spind', text: 'Schau in den Spind in deiner Kabine.' },
          { until: 'combo:raumanzug', text: 'Tippe im Rucksack auf den Anzug und dann auf den Helm.' },
          { until: 'schleusentuer', text: 'Mit Raumanzug zur Luftschleuse! Der Code kam per Funk.' },
        ],
      },

      /* ============ Kapitel 2 ============ */
      {
        id: 'mond',
        title: 'Auf dem Mond',
        thumb: 'sp_bg_krater',
        intro: 'Willkommen auf der Mondbasis! Das Mondauto soll dich zur Rakete fahren. Aber ein Rad fehlt und die Batterie ist leer.',
        outro: 'Brumm, brumm! Das Mondauto hüpft über die Mondhügel bis zur Rakete. Mondhase Hoppel winkt dir hinterher!',
        start: 'basis',
        items: {
          seil: { name: 'Seil', art: 'sp_item_rope' },
          haken: { name: 'Haken', art: 'sp_item_hook' },
          enterhaken: { name: 'Seil mit Haken', art: 'sp_item_grapple' },
          rad: { name: 'Rad', art: 'sp_item_wheel' },
          batterie: { name: 'Batterie', art: 'sp_item_battery' },
        },
        combos: [{ a: 'seil', b: 'haken', gives: 'enterhaken', text: 'Du knotest den Haken an das Seil. Damit kannst du Sachen herausangeln!' }],
        pages: {
          basis: {
            name: 'Die Mondbasis',
            bg: 'sp_bg_basis',
            objects: [
              { id: 'hoppel', art: 'sp_moonbunny', x: 50, y: 71, w: 12, name: 'Mondhase Hoppel',
                say: 'Hoppel mümmelt: „Das Rad vom Mondauto ist in den Krater gerollt! Mein Schrank hat Werkzeug. Der Code: Mondsteine im Krater, dann helle Sterne im Fenster der Sternwarte.“',
                note: 'Schrank-Code: Mondsteine im Krater zählen, dann helle Sterne in der Sternwarte.' },
              { id: 'schrank', art: 'sp_locker', x: 74, y: 64, w: 9, name: 'Schrank',
                puzzle: { type: 'code', prompt: 'Hoppels Schrank hat ein Zahlenschloss mit zwei Zahlen.', answer: '35' },
                give: 'seil', become: 'sp_locker_open', okText: 'Der Schrank geht auf. Darin liegt ein langes Seil.', doneText: 'Der Schrank ist leer.' },
              { id: 'zursternwarte', art: 'nav_up', x: 20, y: 46, w: 6, name: 'Zur Sternwarte', goto: 'sternwarte' },
              { id: 'zurgarage', art: 'nav_right', x: 92, y: 89, w: 9, name: 'Zur Garage', goto: 'garage' },
              { id: 'raus', art: 'sp_hatch', x: 10, y: 66, w: 12, name: 'Ausgang zum Krater', goto: 'krater' },
            ],
          },
          krater: {
            name: 'Der Krater',
            bg: 'sp_bg_krater',
            back: 'basis',
            enter: 'Du hüpfst ganz leicht über den Mond. Hui! Vor dir ist ein riesiger Krater.',
            objects: [
              { id: 'm1', art: 'sp_moonrock', x: 18, y: 58, w: 8, static: true },
              { id: 'm2', art: 'sp_moonrock', x: 82, y: 62, w: 9, static: true },
              { id: 'm3', art: 'sp_moonrock', x: 30, y: 88, w: 7, static: true },
              { id: 'rad', art: 'sp_crater_wheel', x: 50, y: 78, w: 11, name: 'Rad im Krater',
                needs: ['enterhaken'], needText: 'Ganz unten im Krater liegt das Rad! Der Krater ist viel zu steil. Du brauchst etwas, womit du es herausangeln kannst.',
                give: 'rad', remove: true, okText: 'Du wirfst das Seil mit dem Haken … erwischt! Du ziehst das Rad heraus.' },
            ],
          },
          sternwarte: {
            name: 'Die Sternwarte',
            bg: 'sp_bg_sternwarte',
            back: 'basis',
            enter: 'In der Sternwarte steht ein großes Fernrohr. Durchs Dachfenster siehst du helle Sterne.',
            objects: [
              { id: 'st1', art: 'sp_bigstar', x: 44, y: 24, w: 5, static: true },
              { id: 'st2', art: 'sp_bigstar', x: 56, y: 32, w: 5, static: true },
              { id: 'st3', art: 'sp_bigstar', x: 47, y: 46, w: 5, static: true },
              { id: 'st4', art: 'sp_bigstar', x: 56, y: 58, w: 5, static: true },
              { id: 'st5', art: 'sp_bigstar', x: 44, y: 68, w: 5, static: true },
              { id: 'computer', art: 'sp_computer', x: 80, y: 62, w: 18, name: 'Computer',
                say: 'Auf dem Bildschirm blinkt: „Ladestation: Lichter in dieser Reihenfolge drücken – Gelb, Grün, Gelb, Rot.“',
                note: 'Ladestation: Gelb – Grün – Gelb – Rot.' },
            ],
          },
          garage: {
            name: 'Die Garage',
            bg: 'sp_bg_garage',
            back: 'basis',
            objects: [
              { id: 'haken', art: 'sp_hook', x: 84, y: 27, w: 7, name: 'Haken',
                give: 'haken', remove: true, okText: 'An der Wand hängt ein Haken. Du nimmst ihn mit.' },
              { id: 'ladestation', art: 'sp_charger', x: 13, y: 62, w: 11, name: 'Ladestation',
                puzzle: { type: 'sequence', prompt: 'Die Ladestation hat bunte Knöpfe. Drücke sie in der richtigen Reihenfolge!',
                  options: [color(GELB, 'Gelb'), color(GRUEN, 'Grün'), color(ROT, 'Rot'), color(BLAU, 'Blau')], answer: [0, 1, 0, 2] },
                give: 'batterie', become: 'sp_charger_empty', okText: 'Piiiep! Die Batterie ist voll geladen. Du nimmst sie heraus.', doneText: 'Die Ladestation ist fertig.' },
              { id: 'mondauto', art: 'sp_moonrover', x: 52, y: 70, w: 40, name: 'Mondauto',
                needs: ['rad', 'batterie'], needText: 'Das Mondauto hat nur ein Rad auf dieser Seite – und die Batterie ist leer.', win: true },
            ],
          },
        },
        hints: [
          { until: 'hoppel', text: 'Sprich mit Mondhase Hoppel.' },
          { until: 'schrank', text: 'Zähle die Mondsteine im Krater und die hellen Sterne in der Sternwarte. Das ist der Schrank-Code.' },
          { until: 'haken', text: 'In der Garage hängt ein Haken an der Wand.' },
          { until: 'combo:enterhaken', text: 'Tippe im Rucksack auf das Seil und dann auf den Haken.' },
          { until: 'rad', text: 'Angel mit dem Seil und dem Haken das Rad aus dem Krater.' },
          { until: 'computer', text: 'Der Computer in der Sternwarte verrät etwas über die Ladestation.' },
          { until: 'ladestation', text: 'Drücke an der Ladestation: Gelb, Grün, Gelb, Rot.' },
          { until: 'mondauto', text: 'Bring Rad und Batterie zum Mondauto!' },
        ],
      },

      /* ============ Kapitel 3 ============ */
      {
        id: 'planet',
        title: 'Der bunte Planet',
        thumb: 'sp_bg_landeplatz',
        intro: 'Rumms! Deine Rakete ist auf einem bunten Planeten gelandet. Die Antenne ist abgebrochen und der Energiekristall ist leer. Vielleicht helfen dir die Bewohner?',
        outro: 'Die Rakete brummt, die Blubbis winken mit ihren Fühlern – und du fliegst mit einem neuen Kristall nach Hause. Was für eine Reise!',
        start: 'landeplatz',
        items: {
          blume: { name: 'Leuchtblume', art: 'sp_item_flower' },
          antenne: { name: 'Antenne', art: 'sp_item_antenna' },
          kristall: { name: 'Energiekristall', art: 'sp_item_crystal' },
        },
        pages: {
          landeplatz: {
            name: 'Der Landeplatz',
            bg: 'sp_bg_landeplatz',
            objects: [
              { id: 'rakete', art: 'sp_rocket_broken', x: 50, y: 52, w: 14, name: 'Rakete',
                needs: ['antenne', 'kristall'], needText: 'Die Rakete ist kaputt: Die Antenne ist abgebrochen und der Energiekristall ist leer.',
                note: 'Die Rakete braucht eine Antenne und einen Energiekristall.', win: true },
              { id: 'blume', art: 'sp_glowflower', x: 80, y: 68, w: 11, name: 'Leuchtblume',
                give: 'blume', remove: true, okText: 'Du pflückst eine leuchtende Blume. Sie duftet nach Zuckerwatte!' },
              { id: 'hoehleneingang', art: 'sp_cave_entrance', x: 16, y: 63, w: 20, name: 'Höhle', goto: 'hoehle' },
              { id: 'zumdorf', art: 'nav_right', x: 92, y: 89, w: 9, name: 'Zum Dorf', goto: 'dorf' },
            ],
          },
          dorf: {
            name: 'Das Blubbi-Dorf',
            bg: 'sp_bg_dorf',
            back: 'landeplatz',
            enter: 'Im Dorf wohnen die Blubbis. Sie sind sehr freundlich!',
            objects: [
              { id: 'zorri', art: 'sp_alien', x: 42, y: 70, w: 14, name: 'Blubbi Zorri',
                needs: ['blume'], needText: 'Zorri: „Blubb! Hallo! Ich habe eine Antenne für dich. Aber erst hätte ich so gern eine Leuchtblume!“',
                puzzle: { type: 'choice', prompt: 'Zorri: „Danke für die Blume! Eine Frage noch: Auf welchem Planeten wohnst du?“',
                  options: [{ art: 'sp_planet_red', label: 'Roter Planet' }, { art: 'sp_planet_blue', label: 'Die Erde' }, { art: 'sp_planet_ring', label: 'Ringplanet' }], answer: 1 },
                give: 'antenne', okText: 'Zorri: „Blubb, die Erde! Wie schön!“ Zorri schenkt dir eine glänzende Antenne.', doneText: 'Zorri summt fröhlich vor sich hin.' },
              { id: 'kinder', art: 'sp_alien_kids', x: 70, y: 80, w: 20, name: 'Blubbi-Kinder',
                say: 'Die Blubbi-Kinder singen: „Mond, Stern, Sonne, Stern – das Kristall-Lied hab’n wir gern!“',
                note: 'Kristall-Lied: Mond – Stern – Sonne – Stern.' },
              { id: 'wandbild', art: 'sp_mural', x: 50, y: 26, w: 22, name: 'Wandbild',
                say: 'Auf dem Wandbild ist die Höhle gemalt und daneben drei Farben: zuerst Rot, dann Lila, dann Türkis.',
                note: 'Höhlentor: Rot – Lila – Türkis.' },
            ],
          },
          hoehle: {
            name: 'Die Glitzerhöhle',
            bg: 'sp_bg_hoehle',
            back: 'landeplatz',
            dark: true,
            enter: 'In der Höhle ist es dunkel. Nur ein Pilz leuchtet ein bisschen.',
            objects: [
              { id: 'pilz', art: 'sp_glowshroom', x: 18, y: 72, w: 10, name: 'Leuchtpilz', glow: true,
                light: true, okText: 'Du stupst den Pilz an – er leuchtet ganz hell! Jetzt siehst du die ganze Höhle.', doneText: 'Der Pilz leuchtet türkis.' },
              { id: 'wurm', art: 'sp_glowworm', x: 72, y: 30, w: 12, name: 'Glühwurm',
                say: 'Der Glühwurm kichert: „Hinter dem Tor liegt der Energiekristall. Die Blubbis wissen die Farben!“' },
              { id: 'tor', art: 'sp_cave_gate', x: 50, y: 62, w: 22, name: 'Höhlentor',
                puzzle: { type: 'wheels', prompt: 'Das Tor hat drei Farbräder. Welche Farben öffnen es?',
                  options: [color(LILA, 'Lila'), color(TUERKIS, 'Türkis'), color(ROT, 'Rot'), color(GELB, 'Gelb')], answer: [2, 0, 1] },
                become: 'sp_cave_gate_open', goto: 'saal', okText: 'Grrr-klack! Das Tor öffnet sich und dahinter glitzert es.', doneText: 'Das Tor ist offen.' },
            ],
          },
          saal: {
            name: 'Der Kristallsaal',
            bg: 'sp_bg_kristallsaal',
            back: 'hoehle',
            enter: 'Wow! Ein ganzer Saal voller Kristalle.',
            objects: [
              { id: 'sockel', art: 'sp_pedestal', x: 50, y: 60, w: 16, name: 'Kristall-Sockel',
                puzzle: { type: 'sequence', prompt: 'Am Sockel sind Zeichen. Tippe sie in der Reihenfolge des Kristall-Lieds!',
                  options: [{ art: 'sp_sym_moon', label: 'Mond' }, { art: 'sp_sym_star', label: 'Stern' }, { art: 'sp_sym_sun', label: 'Sonne' }, { art: 'sp_sym_planet', label: 'Planet' }], answer: [0, 1, 2, 1] },
                give: 'kristall', become: 'sp_pedestal_empty', okText: 'Der Sockel singt einen hellen Ton und gibt den Energiekristall frei!', doneText: 'Der Sockel ist leer.' },
            ],
          },
        },
        hints: [
          { until: 'blume', text: 'Schau dir die Rakete an – was fehlt ihr? Und pflücke die leuchtende Blume am Landeplatz.' },
          { until: 'zorri', text: 'Bring Zorri im Dorf die Blume. Auf welchem Planeten wohnen wir Menschen?' },
          { until: 'wandbild', text: 'Schau dir das Wandbild im Dorf an.' },
          { until: 'kinder', text: 'Hör den Blubbi-Kindern zu.' },
          { until: 'pilz', text: 'Geh in die Höhle und tippe auf den leuchtenden Pilz.' },
          { until: 'tor', text: 'Stelle am Höhlentor die Farben vom Wandbild ein: Rot, Lila, Türkis.' },
          { until: 'sockel', text: 'Tippe am Sockel das Kristall-Lied: Mond, Stern, Sonne, Stern.' },
          { until: 'rakete', text: 'Bring Antenne und Kristall zur Rakete!' },
        ],
      },
    ],
  });
})();
