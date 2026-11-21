/*
 * Handgezeichnete Bilder als SVG.
 *
 * ART[name] = { vb: [breite, höhe], svg: '<...>', bg?: true }
 *   - Objekte zeichnen wir in einem ~100er-Raster, Hintergründe in 800 x 600.
 *   - class="o"     Fläche mit Tusche-Umriss     class="thin"  dünne Linie (ohne Füllung)
 *   - class="thick" dicker Umriss                fill="url(#hatch)" Schraffur (Schatten)
 *   - Alles wird automatisch durch einen "Wackel"-Filter geschickt (sieht handgezeichnet aus).
 *
 * Farbpalette (warm, Bilderbuch):
 *   Tusche #3b2c24 · Papier #fbf3e4 · Holz #b07a4f/#8a5a3a · Gold #f2b544 · Rot #d9573b
 *   Blau #6fa8dc · Eis #cfe9f7 · Grün #7fb069 · Rosa Wangen #f4a6a0
 */
const ART = {};
/** Welten tragen sich hier ein (Reihenfolge = Reihenfolge der <script>-Tags). */
const WORLDS = [];

/** Liefert das SVG-Markup für ein Bild. */
function art(name, cls = '') {
  const a = ART[name];
  if (!a) {
    console.warn('Bild fehlt:', name);
    return `<svg class="art ${cls}" viewBox="0 0 100 100"><text x="50" y="55" text-anchor="middle" font-size="14">${name}</text></svg>`;
  }
  const [w, h] = a.vb;
  const filter = a.bg ? 'rough-bg' : 'rough';
  return `<svg class="art ${cls}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="${a.bg ? 'xMidYMid slice' : 'xMidYMid meet'}" aria-hidden="true"><g class="${filter}">${a.svg}</g></svg>`;
}

/* Kleine Helfer für wiederkehrende Formen */
const draw = {
  /** freundliches Gesicht: Augen, Wangen, Lächeln. (cx, cy) = Mitte zwischen den Augen */
  face(cx, cy, s = 1, mood = 'smile') {
    const e = 4.5 * s;
    const mouth = mood === 'sleep'
      ? `<path class="thin" d="M${cx - 3 * s} ${cy + 7 * s} q${3 * s} ${2 * s} ${6 * s} 0"/>`
      : mood === 'sad'
        ? `<path class="thin" d="M${cx - 4 * s} ${cy + 9 * s} q${4 * s} ${-4 * s} ${8 * s} 0"/>`
        : `<path class="thin" d="M${cx - 4 * s} ${cy + 6 * s} q${4 * s} ${5 * s} ${8 * s} 0"/>`;
    const eyes = mood === 'sleep'
      ? `<path class="thin" d="M${cx - e - 2 * s} ${cy} q${2 * s} ${2 * s} ${4 * s} 0 M${cx + e - 2 * s} ${cy} q${2 * s} ${2 * s} ${4 * s} 0"/>`
      : `<g class="eye"><circle cx="${cx - e}" cy="${cy}" r="${1.9 * s}" fill="#3b2c24"/><circle cx="${cx + e}" cy="${cy}" r="${1.9 * s}" fill="#3b2c24"/>
         <circle cx="${cx - e + .6 * s}" cy="${cy - .7 * s}" r="${.6 * s}" fill="#fff"/><circle cx="${cx + e + .6 * s}" cy="${cy - .7 * s}" r="${.6 * s}" fill="#fff"/></g>`;
    return `${eyes}
      <ellipse cx="${cx - e - 3 * s}" cy="${cy + 4.5 * s}" rx="${2.6 * s}" ry="${1.6 * s}" fill="#f4a6a0" opacity=".8"/>
      <ellipse cx="${cx + e + 3 * s}" cy="${cy + 4.5 * s}" rx="${2.6 * s}" ry="${1.6 * s}" fill="#f4a6a0" opacity=".8"/>
      ${mouth}`;
  },
  /** Funkeln */
  sparkle(x, y, s = 1, color = '#f2b544') {
    return `<path class="o" fill="${color}" d="M${x} ${y - 6 * s} Q${x + 1.2 * s} ${y - 1.2 * s} ${x + 6 * s} ${y} Q${x + 1.2 * s} ${y + 1.2 * s} ${x} ${y + 6 * s} Q${x - 1.2 * s} ${y + 1.2 * s} ${x - 6 * s} ${y} Q${x - 1.2 * s} ${y - 1.2 * s} ${x} ${y - 6 * s}Z"/>`;
  },
  /** Stern mit 5 Zacken */
  star(cx, cy, r, fill = '#f2b544', cls = 'o') {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 ? r * .48 : r;
      const a = -Math.PI / 2 + i * Math.PI / 5;
      d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1);
    }
    return `<path class="${cls}" fill="${fill}" d="${d}Z"/>`;
  },
  /** Holzmaserung-Striche in einem Rechteck */
  grain(x, y, w, h, n = 3) {
    let s = '';
    for (let i = 1; i <= n; i++) {
      const yy = y + (h / (n + 1)) * i;
      s += `<path class="thin" opacity=".45" d="M${x + w * .08} ${yy} q${w * .2} ${-h * .05} ${w * .4} 0 t${w * .4} 0"/>`;
    }
    return s;
  },
};

/* ---------- Bedien-Icons ---------- */
Object.assign(ART, {
  icon_back: { vb: [60, 60], svg: `<path class="o" fill="#f2b544" d="M10 30 L28 12 L28 22 Q48 20 50 34 Q51 44 44 48 Q44 34 28 36 L28 47 Z"/>` },
  icon_notebook: { vb: [60, 60], svg: `
    <rect class="o" x="12" y="8" width="38" height="46" rx="4" fill="#d9573b"/>
    <rect class="o" x="17" y="8" width="33" height="46" rx="3" fill="#e9785c"/>
    <rect class="o" x="22" y="16" width="22" height="10" rx="2" fill="#fbf3e4"/>
    <path class="thin" d="M9 16h6M9 26h6M9 36h6M9 46h6"/>` },
  icon_bulb: { vb: [60, 60], svg: `
    <path class="o" fill="#ffe27a" d="M30 6 C17 6 10 16 12 26 C13 33 20 36 21 44 L39 44 C40 36 47 33 48 26 C50 16 43 6 30 6Z"/>
    <path fill="url(#shine)" d="M30 8 C19 8 13 17 15 25 C16 30 22 34 22 40 L30 40 Z"/>
    <rect class="o" x="21" y="44" width="18" height="6" rx="2" fill="#b9a27f"/>
    <rect class="o" x="23" y="50" width="14" height="5" rx="2" fill="#9c8564"/>
    <path class="thin" d="M25 36 q5 -10 10 0"/>` },
  icon_backpack: { vb: [60, 60], svg: `
    <path class="o" fill="#d9573b" d="M14 22 Q14 10 30 10 Q46 10 46 22 L48 50 Q48 55 42 55 L18 55 Q12 55 12 50 Z"/>
    <path class="o" fill="#b8432c" d="M18 36 L42 36 L42 50 L18 50 Z"/>
    <path class="thin" d="M24 10 Q24 4 30 4 Q36 4 36 10"/>
    <rect class="o" x="27" y="38" width="6" height="5" rx="1" fill="#f2b544"/>` },
  icon_speaker: { vb: [60, 60], svg: `
    <path class="o" fill="#6fa8dc" d="M10 24 L20 24 L32 12 L32 48 L20 36 L10 36 Z"/>
    <path class="thin" d="M38 22 q6 8 0 16 M43 16 q11 14 0 28"/>` },
  icon_close: { vb: [60, 60], svg: `<path class="thick line" d="M16 16 L44 44 M44 16 L16 44"/>` },
  icon_star: { vb: [60, 60], svg: draw.star(30, 31, 26) + `<path fill="url(#shine)" d="M30 8 L36 24 L22 26Z"/>` },
  icon_star_empty: { vb: [60, 60], svg: draw.star(30, 31, 24, '#e8dcc2', 'thin') },
  icon_lock: { vb: [60, 70], svg: `
    <path class="thick line" d="M18 32 V22 Q18 8 30 8 Q42 8 42 22 V32"/>
    <rect class="o" x="10" y="30" width="40" height="34" rx="6" fill="#f2b544"/>
    <circle cx="30" cy="45" r="5" fill="#3b2c24"/><rect x="28" y="46" width="4" height="10" fill="#3b2c24"/>` },
  icon_pin: { vb: [40, 40], svg: `
    <circle class="o" cx="20" cy="14" r="10" fill="#d9573b"/><circle cx="17" cy="11" r="3" fill="#fff" opacity=".7"/>
    <path class="thick line" d="M20 24 L20 38"/>` },
});

/* ---------- Gemeinsame Spielbilder ---------- */
Object.assign(ART, {
  // Blätter-Pfeile für die Navigation zwischen Seiten
  nav_right: { vb: [80, 60], svg: `
    <path class="o" fill="#fbf3e4" d="M6 20 Q30 16 46 18 L46 6 L76 30 L46 54 L46 42 Q28 44 6 40 Z"/>
    <path class="thin" d="M14 30 L40 30" opacity=".4"/>` },
  nav_left: { vb: [80, 60], svg: `
    <path class="o" fill="#fbf3e4" d="M74 20 Q50 16 34 18 L34 6 L4 30 L34 54 L34 42 Q52 44 74 40 Z"/>
    <path class="thin" d="M40 30 L66 30" opacity=".4"/>` },
  nav_up: { vb: [60, 80], svg: `
    <path class="o" fill="#fbf3e4" d="M20 74 Q16 50 18 34 L6 34 L30 4 L54 34 L42 34 Q44 52 40 74 Z"/>` },
  nav_down: { vb: [60, 80], svg: `
    <path class="o" fill="#fbf3e4" d="M20 6 Q16 30 18 46 L6 46 L30 76 L54 46 L42 46 Q44 28 40 6 Z"/>` },
  // Lupe = Nahansicht
  zoom: { vb: [70, 70], svg: `
    <circle class="o" cx="28" cy="28" r="20" fill="#cfe9f7"/>
    <path fill="url(#shine)" d="M14 22 Q18 10 30 10 Q20 16 18 26Z"/>
    <path class="o" fill="#8a5a3a" d="M42 40 L48 34 L66 54 Q68 58 64 62 Q60 64 58 60 Z"/>` },

  key_gold: { vb: [100, 50], svg: `
    <circle class="o" cx="22" cy="25" r="16" fill="#f2b544"/>
    <circle class="o" cx="22" cy="25" r="6" fill="#fbf3e4"/>
    <path class="o" fill="#f2b544" d="M36 21 L90 21 Q94 21 94 25 Q94 29 90 29 L84 29 L84 38 L76 38 L76 29 L70 29 L70 35 L63 35 L63 29 L36 29 Z"/>
    <path fill="url(#shine)" d="M10 18 Q16 10 26 12 Q16 16 14 24Z"/>` },
  note: { vb: [80, 90], svg: `
    <path class="o" fill="#fffdf6" d="M10 8 L66 6 L72 80 L14 84 Z"/>
    <path class="o" fill="#f0e2c2" d="M58 82 L72 80 L70 66 Q64 76 58 82Z"/>
    <path class="thin" opacity=".55" d="M20 24 h40 M20 36 h44 M20 48 h36 M20 60 h30"/>` },
  chest: { vb: [120, 100], svg: `
    <path class="o" fill="#b07a4f" d="M10 46 L110 46 L106 92 L14 92 Z"/>
    <path class="o" fill="#c48d5c" d="M10 46 Q12 12 60 12 Q108 12 110 46 Z"/>
    <path class="o" fill="#f2b544" d="M26 15 L34 15 L34 92 L26 92Z M86 15 L94 15 L94 92 L86 92Z"/>
    ${draw.grain(36, 50, 48, 40, 3)}
    <rect class="o" x="50" y="40" width="20" height="22" rx="4" fill="#f2b544"/>
    <circle cx="60" cy="49" r="3" fill="#3b2c24"/><rect x="58.5" y="50" width="3" height="7" fill="#3b2c24"/>` },
  chest_open: { vb: [120, 100], svg: `
    <path class="o" fill="#8a5a3a" d="M14 10 Q14 0 60 2 Q106 0 106 10 L110 46 L10 46 Z"/>
    <path class="o" fill="#5a3b26" d="M16 46 L104 46 L100 52 L20 52Z"/>
    <path class="o" fill="#b07a4f" d="M10 46 L110 46 L106 92 L14 92 Z"/>
    <path class="o" fill="#f2b544" d="M26 46 L34 46 L34 92 L26 92Z M86 46 L94 46 L94 92 L86 92Z"/>
    ${draw.grain(36, 50, 48, 40, 3)}` },
  trophy: { vb: [120, 130], svg: `
    <path class="o" fill="#f2b544" d="M30 10 L90 10 Q92 56 60 70 Q28 56 30 10Z"/>
    <path class="thick line" d="M30 20 Q8 20 12 36 Q16 50 34 50 M90 20 Q112 20 108 36 Q104 50 86 50"/>
    <rect class="o" x="52" y="68" width="16" height="22" fill="#e0a23a"/>
    <path class="o" fill="#8a5a3a" d="M32 90 L88 90 L92 118 L28 118Z"/>
    <rect class="o" x="42" y="98" width="36" height="12" rx="2" fill="#f2b544"/>
    ${draw.star(60, 36, 14, '#fff3c4')}
    <path fill="url(#shine)" d="M36 14 L52 14 Q44 40 50 56 Q34 44 36 14Z"/>
    ${draw.sparkle(14, 74, 1.2)}${draw.sparkle(108, 70, 1)}${draw.sparkle(100, 8, .8)}` },
});
