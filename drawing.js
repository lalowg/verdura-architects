/* VERDURA ARCHITECTS — Hollowbrook Library, section A–A.
   One drawing, four stages (sketch → material → form → environment) and
   four environmental layers (sun, wind, water, planting). Every stroke
   uses pathLength="1" so it can be drawn on with stroke-dashoffset. */

const DEG = Math.PI / 180;
export const SEASONS = { winter: { alt: 16, label: 'Midwinter noon' }, equinox: { alt: 38, label: 'Equinox noon' }, summer: { alt: 62, label: 'Midsummer noon' } };

// deterministic noise for the sketch layer
let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const j = (n) => (rnd() - 0.5) * 2 * n;
const r1 = (n) => Math.round(n * 10) / 10;

let di = 0;
const P = (d, cls = '', extra = '') => `<path class="d ${cls}" d="${d}" pathLength="1" style="--i:${di++}" ${extra}/>`;

// key geometry (SVG units)
const G = {
  floor: 540, slabB: 554, nW0: 260, nW1: 300, nTop: 290,
  rA0: [260, 288], rA1: [560, 260], rAu0: [300, 306], rAu1: [560, 278],
  rB0: [556, 192], rB1: [1010, 236], rBu0: [560, 210], rBu1: [1010, 254],
  glassX: 880, mezY: 400, mezX: 640, terraceX: 1050,
};
const roofBUnderAt = (x) => G.rBu0[1] + ((x - G.rBu0[0]) / (G.rBu1[0] - G.rBu0[0])) * (G.rBu1[1] - G.rBu0[1]);
const glassTop = roofBUnderAt(G.glassX);

function sketchLine(pts, over = 14, wob = 2.4) {
  // a hand-drawn polyline with overshoot at both ends
  const a = pts[0], b = pts[1], z = pts[pts.length - 1], y = pts[pts.length - 2];
  const ext = (p, q, d) => { const dx = p[0] - q[0], dy = p[1] - q[1], l = Math.hypot(dx, dy) || 1; return [p[0] + (dx / l) * d, p[1] + (dy / l) * d]; };
  const out = [ext(a, b, over * (0.4 + rnd())), ...pts, ext(z, y, over * (0.4 + rnd()))];
  let d = '';
  for (let i = 0; i < out.length - 1; i++) {
    const p = out[i], q = out[i + 1];
    const steps = Math.max(1, Math.round(Math.hypot(q[0] - p[0], q[1] - p[1]) / 60));
    for (let s = i ? 1 : 0; s <= steps; s++) {
      const t = s / steps;
      d += (d ? 'L' : 'M') + r1(p[0] + (q[0] - p[0]) * t + j(wob)) + ' ' + r1(p[1] + (q[1] - p[1]) * t + j(wob));
    }
  }
  return d;
}

export function drawingSVG() {
  seed = 7; di = 0;
  const F = G.floor;
  const interior = `M300 ${F}V306L560 278V210L${G.glassX} ${r1(glassTop)}V${F}Z`;
  const groundN = `M0 430C90 425 180 445 ${G.nW0} 462`;
  const groundS = `M${G.terraceX} 548C1080 556 1095 572 1120 572C1145 572 1160 556 1200 558`;

  /* ---------------- sketch ---------------- */
  const sk = [];
  const outlines = [
    [[0, 430], [130, 433], [G.nW0, 462]], [[G.nW0, 462], [G.nW0, G.nTop]], [G.rA0, G.rA1], [[560, 260], [560, 192]], [G.rB0, G.rB1],
    [[G.glassX, glassTop], [G.glassX, F]], [[300, F], [G.terraceX, F]], [[300, G.mezY], [G.mezX, G.mezY]], [[G.terraceX, 548], [1200, 558]],
  ];
  for (const o of outlines) { sk.push(P(sketchLine(o), 'sk')); if (rnd() > 0.35) sk.push(P(sketchLine(o, 20, 3.2), 'sk sk--2')); }
  const cons = [`M0 ${F}H1200`, 'M0 236H1200', `M${G.glassX} 120V640`, 'M560 120V640', 'M1010 140V600'];
  cons.forEach((d) => sk.push(P(d, 'sk-cons')));
  sk.push(P('M1150 150C1060 170 1000 200 960 250', 'sk sk--arrow', 'marker-end="url(#va-arr-pencil)"'));
  sk.push(P('M520 150C540 140 560 150 575 175', 'sk sk--arrow', 'marker-end="url(#va-arr-pencil)"'));
  const notes = `<g class="sk-notes" aria-hidden="true">
    <text x="40" y="395">earth to the north</text>
    <text x="1030" y="120">deep eave: shade the summer glass</text>
    <text x="410" y="140">north light in, warm air out</text>
    <text x="1060" y="650">rain, stored</text>
  </g>`;

  /* ---------------- material ---------------- */
  const mat = `
    <path d="${groundN}L${G.nW0} 700H0Z" fill="url(#va-earth)"/>
    <path d="M${G.nW0} ${G.slabB}H${G.terraceX}V548${groundS.slice(groundS.indexOf('C'))}V700H${G.nW0}Z" fill="url(#va-earth)"/>
    <rect x="${G.nW0}" y="${G.nTop}" width="${G.nW1 - G.nW0}" height="${F - G.nTop}" fill="url(#va-rammed)"/>
    <path d="M260 288L560 260V278L300 306H260Z" fill="url(#va-timber)"/>
    <path d="M260 288L560 260V250L260 278Z" fill="url(#va-soil)"/>
    <path d="M556 192L1010 236V254L560 210Z" fill="url(#va-timber)"/>
    <rect x="300" y="${G.mezY}" width="${G.mezX - 300}" height="12" fill="url(#va-timber)"/>
    <rect x="${G.nW0}" y="${F}" width="${G.terraceX - G.nW0}" height="${G.slabB - F}" fill="url(#va-concrete)"/>
    <rect x="250" y="${G.slabB}" width="60" height="26" fill="url(#va-concrete)"/><rect x="625" y="${G.slabB}" width="30" height="18" fill="url(#va-concrete)"/><rect x="865" y="${G.slabB}" width="30" height="18" fill="url(#va-concrete)"/>
    <rect x="${G.glassX - 4}" y="${r1(glassTop)}" width="8" height="${r1(F - glassTop)}" class="m-glass"/>
    <rect x="556" y="210" width="8" height="${278 - 210}" class="m-glass"/>
    <rect x="634" y="412" width="12" height="${F - 412}" fill="url(#va-timber)"/>
    <rect x="930" y="566" width="110" height="64" rx="10" class="m-cistern"/>
    <rect x="${G.glassX}" y="${F - 6}" width="${G.terraceX - G.glassX}" height="6" fill="url(#va-deck)"/>`;

  /* ---------------- form ---------------- */
  const fm = [];
  fm.push(P(groundN, 'f-ground'), P(groundS, 'f-ground'));
  fm.push(P(`M${G.nW0} ${G.slabB}V${G.nTop}H${G.nW1}V${F}`, 'f-cut'));
  fm.push(P('M260 288L560 260M300 306L560 278M260 278L560 250', 'f-cut'));
  fm.push(P('M556 192L1010 236V254L560 210', 'f-cut'));
  fm.push(P(`M300 ${G.mezY}H${G.mezX}V${G.mezY + 12}H300`, 'f-cut'));
  fm.push(P(`M${G.nW0} ${F}H${G.terraceX}V${G.slabB}H${G.nW0}`, 'f-cut'));
  fm.push(P(`M${G.glassX} ${r1(glassTop)}V${F}M${G.glassX - 4} ${r1(glassTop)}V${F}M${G.glassX - 6} 400H${G.glassX + 2}`, 'f-line'));
  fm.push(P('M560 210V278M556 210V278', 'f-line'));
  fm.push(P(`M640 ${G.mezY}V365M${G.mezX} 368H600`, 'f-thin'));
  fm.push(P(`M634 412V${F}M646 412V${F}`, 'f-line'));
  // stair
  let st = `M500 ${F}`; for (let i = 0; i < 8; i++) st += `V${F - (i + 1) * 16}H${500 + (i + 1) * 15}`;
  fm.push(P(st, 'f-thin'));
  // shelves
  fm.push(P(`M300 430H318V${F}M300 452H318M300 474H318M300 496H318M300 518H318M300 318H318V${G.mezY}M300 338H318M300 358H318M300 378H318`, 'f-thin'));
  // reading table
  fm.push(P('M700 505H800M710 505V540M790 505V540', 'f-thin'));
  // people
  const person = (x, y, s = 1) => `M${x} ${y}m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0M${x - 8} ${y + 14}L${x - 9} ${y + 40}M${x + 8} ${y + 14}L${x + 9} ${y + 40}M${x - 8} ${y + 14}H${x + 8}M${x - 5} ${y + 40}L${x - 6} ${y + 64 * s}M${x + 5} ${y + 40}L${x + 6} ${y + 64 * s}`;
  fm.push(P(person(760, 470), 'f-thin f-person'), P(person(985, 470), 'f-thin f-person'), P(person(430, 330), 'f-thin f-person'));
  // footings, cistern, gutter
  fm.push(P(`M250 ${G.slabB}V580H310V${G.slabB}M625 ${G.slabB}V572H655V${G.slabB}M865 ${G.slabB}V572H895V${G.slabB}`, 'f-thin'));
  fm.push(P('M940 566H1030A10 10 0 0 1 1040 576V620A10 10 0 0 1 1030 630H940A10 10 0 0 1 930 620V576A10 10 0 0 1 940 566Z', 'f-line'));
  fm.push(P('M1004 236V244H1018V236', 'f-thin'));
  // shadow hatch under the eave on the terrace
  let sh = ''; for (let x = 890; x < 1040; x += 9) sh += `M${x} ${F - 1}l8 -8`;
  fm.push(P(sh, 'f-hatch'));
  // levels
  const lv = `<g class="f-levels" aria-hidden="true">
    <path d="M150 ${F}H230M150 ${G.mezY}H230M150 306H230" class="f-thin"/>
    <text x="150" y="${F - 6}">+0.00</text><text x="150" y="${G.mezY - 6}">+3.80</text><text x="150" y="300">+6.70</text>
    <text x="1120" y="690" class="f-aa">A–A</text>
  </g>`;

  /* ---------------- sun (season-dependent; filled by updateSun) ---------------- */
  const sun = `<g class="sun-band-wrap" clip-path="url(#va-interior)"><path class="sun-band"/></g>
    <path class="d sun-ray" pathLength="1" style="--i:0"/><path class="d sun-ray sun-ray--b" pathLength="1" style="--i:1"/><path class="d sun-ray sun-ray--c" pathLength="1" style="--i:2"/>
    <path class="d sun-arc" pathLength="1" style="--i:3"/>
    <circle class="sun-disc" r="18"/><circle class="sun-disc sun-disc--halo" r="30"/>
    <text class="sun-label" aria-hidden="true"></text>`;

  /* ---------------- wind ---------------- */
  const windPaths = [
    'M1170 505C1040 512 930 524 830 520C720 515 690 470 705 385C720 300 650 252 580 232C520 214 420 200 300 196',
    'M1200 165C1000 145 800 138 600 158C420 176 230 196 20 206',
    'M1170 532C980 536 760 538 560 524C460 516 400 482 420 436',
  ];
  const wind = windPaths.map((d, i) => P(d, 'w-line', 'marker-end="url(#va-arr-sage)"') + `<path class="w-flow" d="${d}" style="--k:${i}"/>`).join('');

  /* ---------------- water ---------------- */
  let rain = ''; seed = 41;
  for (let i = 0; i < 46; i++) { const x = 300 + rnd() * 820, y = 50 + rnd() * 120; rain += `M${r1(x)} ${r1(y)}l-6 16`; }
  const water = P(rain, 'r-rain') +
    P('M600 196L1004 234', 'r-line') + `<path class="r-flow" d="M600 196L1004 234"/>` +
    P('M1012 244V552L1000 566', 'r-line') + `<path class="r-flow" d="M1012 244V552L1000 566"/>` +
    P('M1040 600H1070C1085 600 1095 590 1110 574', 'r-line') + `<path class="r-flow" d="M1040 600H1070C1085 600 1095 590 1110 574"/>` +
    `<rect class="r-store" x="934" y="596" width="102" height="30" rx="6"/><path class="r-wave" d="M934 596q12 -5 25 0t25 0t25 0t25 0"/>` +
    P('M270 270q4 4 0 8M350 263q4 4 0 8M430 256q4 4 0 8M510 249q4 4 0 8', 'r-drop');

  /* ---------------- planting ---------------- */
  let tufts = '';
  for (let x = 268; x < 556; x += 14) { const y = 278 - ((x - 260) / 300) * 28; tufts += `M${x} ${r1(y)}l3 -9M${x + 4} ${r1(y)}l1 -11M${x + 8} ${r1(y)}l-2 -8`; }
  let grass = ''; for (let x = 1090; x < 1160; x += 9) grass += `M${x} 568l2 -14M${x + 3} 569l4 -10`;
  const canopy = [[1130, 410, 46], [1090, 430, 34], [1170, 432, 36], [1126, 372, 34], [1100, 392, 28], [1160, 394, 30]];
  const plant = P(tufts, 'p-tuft') + P(grass, 'p-tuft') +
    P('M1130 556V440M1130 470L1098 430M1130 452L1166 418M1130 440L1120 386M1120 400L1098 384M1145 432L1172 404', 'p-trunk') +
    `<g class="p-canopy">${canopy.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>` +
    P('M70 428C60 400 76 372 96 372C116 372 128 400 118 428M160 438C152 416 164 396 180 396C196 396 206 418 198 440', 'p-shrub') +
    P('M96 430V448M180 440V456', 'p-trunk');

  return `<svg class="board__svg" viewBox="0 0 1200 700" role="img" aria-labelledby="board-title board-desc">
  <title id="board-title">Hollowbrook Library, section A–A</title>
  <desc id="board-desc">A long timber library cut into a slope. A rammed-earth wall and green roof face north; a tall glazed reading room faces south under a deep eave; a mezzanine runs along the north side; a rain cistern sits beneath the south terrace.</desc>
  <defs>
    <pattern id="va-earth" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V14" stroke="rgba(31,42,36,.18)" stroke-width="1"/></pattern>
    <pattern id="va-rammed" width="40" height="22" patternUnits="userSpaceOnUse"><rect width="40" height="22" fill="#C9AE8A"/><rect y="0" width="40" height="7" fill="#B8976F"/><rect y="12" width="40" height="4" fill="#D6BF9E"/><path d="M0 7H40M0 16H40" stroke="rgba(31,42,36,.25)" stroke-width=".8"/></pattern>
    <pattern id="va-timber" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#C79C70"/><path d="M0 4H8" stroke="#9A6B43" stroke-width="1"/></pattern>
    <pattern id="va-deck" width="10" height="6" patternUnits="userSpaceOnUse"><rect width="10" height="6" fill="#B88A5E"/><path d="M0 0V6" stroke="#7A5232" stroke-width="1"/></pattern>
    <pattern id="va-soil" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#A9B79F"/><circle cx="3" cy="4" r="1.1" fill="#6E8768"/><circle cx="8" cy="8" r=".9" fill="#6E8768"/></pattern>
    <pattern id="va-concrete" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#D9D3C8"/><circle cx="3" cy="3" r=".9" fill="rgba(31,42,36,.4)"/><circle cx="9" cy="8" r=".7" fill="rgba(31,42,36,.35)"/><path d="M6 10l1.5 -2l1.5 2z" fill="rgba(31,42,36,.25)"/></pattern>
    <marker id="va-arr-sage" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1L9 5L0 9" fill="none" stroke="#5E7A63" stroke-width="1.6"/></marker>
    <marker id="va-arr-pencil" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 1L9 5L0 9" fill="none" stroke="#6b6b62" stroke-width="1.2"/></marker>
    <clipPath id="va-interior"><path d="${interior}"/></clipPath>
  </defs>
  <g class="L L-sketch">${sk.join('')}${notes}</g>
  <g class="L L-material">${mat}</g>
  <g class="L L-form">${fm.join('')}${lv}</g>
  <g class="L L-plant">${plant}</g>
  <g class="L L-sun">${sun}</g>
  <g class="L L-wind">${wind}</g>
  <g class="L L-water">${water}</g>
</svg>`;
}

export function updateSun(svg, season) {
  const { alt } = SEASONS[season];
  const a = alt * DEG, c = Math.cos(a), s = Math.sin(a), t = Math.tan(a);
  const F = G.floor, gx = G.glassX, tip = [G.rBu1[0], G.rBu1[1]];
  const yAtGlass = tip[1] + (tip[0] - gx) * t;            // the eave's shadow line on the glass
  const top = Math.max(glassTop, yAtGlass);
  const L = 1400;
  const band = top < F ? `M${gx} ${r1(top)}L${gx} ${F}L${r1(gx - L * c)} ${r1(F + L * s)}L${r1(gx - L * c)} ${r1(top + L * s)}Z` : '';
  svg.querySelector('.sun-band').setAttribute('d', band);
  // sun position along the ray through the eave tip
  let k = (1170 - tip[0]) / c; k = Math.min(k, (tip[1] - 46) / s);
  const sx = tip[0] + k * c, sy = tip[1] - k * s;
  svg.querySelectorAll('.sun-disc').forEach((d) => { d.setAttribute('cx', r1(sx)); d.setAttribute('cy', r1(sy)); });
  const ray = (x0, y0) => `M${r1(x0 + 300 * c)} ${r1(y0 - 300 * s)}L${r1(x0 - 260 * c)} ${r1(y0 + 260 * s)}`;
  const rays = svg.querySelectorAll('.sun-ray');
  let ex = tip[0] - (F - tip[1]) / t, ey = F;
  if (ex < 300) { ex = 300; ey = tip[1] + (tip[0] - 300) * t; }
  rays[0].setAttribute('d', `M${r1(sx)} ${r1(sy)}L${tip[0]} ${tip[1]}L${r1(ex)} ${r1(ey)}`);
  rays[1].setAttribute('d', ray(gx, top + (F - top) * 0.45));
  rays[2].setAttribute('d', ray(gx, F - 8));
  // angle arc at the glass base
  const R = 70;
  svg.querySelector('.sun-arc').setAttribute('d', `M${gx + R} ${F}A${R} ${R} 0 0 0 ${r1(gx + R * c)} ${r1(F - R * s)}`);
  const lab = svg.querySelector('.sun-label');
  lab.setAttribute('x', gx + R + 10); lab.setAttribute('y', r1(F - R * s * 0.45));
  lab.textContent = alt + '°';
  // trees respond to the season
  svg.querySelector('.p-canopy').style.opacity = season === 'summer' ? 1 : season === 'equinox' ? 0.55 : 0.08;
  return { glassLit: top < F ? (F - top) / (F - glassTop) : 0 };
}
