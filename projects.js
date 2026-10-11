/* VERDURA ARCHITECTS — fictional projects and parametric line drawings. */

export const PROJECTS = [
  { id: 'hollowbrook', no: '01', name: 'Hollowbrook Library', type: 'civic', mat: 'earth', year: 2024, status: 'Completed', place: 'Hollowbrook', form: 'mono',
    text: 'A village library cut into a north-facing slope. The rammed-earth wall holds the hill; the reading room opens south under a deep timber eave.', palette: ['Rammed earth', 'Cross-laminated timber', 'Larch cladding', 'Sedum roof'] },
  { id: 'saltmarsh', no: '02', name: 'Saltmarsh Field Station', type: 'landscape', mat: 'timber', year: 2026, status: 'On site', place: 'Wend Estuary', form: 'stilts',
    text: 'Laboratories and a bunk room lifted above the tide line on timber piles, so the marsh can flood beneath it as it always has.', palette: ['Sweet chestnut piles', 'Charred larch', 'Galvanised steel', 'Reed thatch screens'] },
  { id: 'ropewalk', no: '03', name: 'Rope Walk Housing', type: 'housing', mat: 'brick', year: 2022, status: 'Completed', place: 'Old Harbour', form: 'row',
    text: 'Twenty-four homes along the line of a demolished ropewalk, built from bricks salvaged on site and set out in a long terrace of narrow gables.', palette: ['Reclaimed brick', 'Lime mortar', 'Oak windows', 'Clay pantiles'] },
  { id: 'kilnyard', no: '04', name: 'Kiln Yard Workshops', type: 'workplace', mat: 'brick', year: 2021, status: 'Completed', place: 'Kiln Lane', form: 'saw',
    text: 'Makers’ workshops under a new sawtooth roof, laid over the surviving brick walls of a pottery. North lights give even daylight to every bench.', palette: ['Retained brick walls', 'Glulam frame', 'Polycarbonate north lights', 'Recycled steel'] },
  { id: 'orchard', no: '05', name: 'Orchard Row Houses', type: 'housing', mat: 'straw', year: 2027, status: 'In planning', place: 'Ashby Orchard', form: 'gable',
    text: 'Six family houses with prefabricated straw-bale walls and lime render, set between the old apple trees rather than in place of them.', palette: ['Straw-bale panels', 'Lime render', 'Douglas fir frame', 'Slate roof'] },
  { id: 'ferrylane', no: '06', name: 'Ferry Lane Primary School', type: 'civic', mat: 'timber', year: 2023, status: 'Completed', place: 'Ferry Lane', form: 'flat',
    text: 'Eight classrooms in a single-storey timber frame. Every classroom opens directly onto its own garden, and the roof is planted end to end.', palette: ['Cross-laminated timber', 'Spruce glulam', 'Wood-fibre insulation', 'Wildflower roof'] },
  { id: 'quarry', no: '07', name: 'Quarry Garden Pavilion', type: 'landscape', mat: 'stone', year: 2020, status: 'Completed', place: 'Highcliff Quarry', form: 'pavilion',
    text: 'A shelter for a garden made in a worked-out quarry: a single timber roof on drystone piers built from the quarry’s own offcuts.', palette: ['Drystone piers', 'Oak roof deck', 'Sedum', 'Quarry gravel'] },
  { id: 'millleat', no: '08', name: 'Mill Leat Offices', type: 'workplace', mat: 'timber', year: 2025, status: 'On site', place: 'Mill Leat', form: 'mill',
    text: 'A disused corn mill adapted as shared offices, with a new timber wing that steps down to the leat. The old structure stays exposed.', palette: ['Retained stone mill', 'Timber frame wing', 'Recycled cork', 'Lime plaster'] },
];

export const TYPES = { civic: 'Civic', housing: 'Housing', workplace: 'Workplace', landscape: 'Landscape' };
export const MATS = { timber: 'Timber', earth: 'Earth', brick: 'Reused brick', straw: 'Straw', stone: 'Stone' };

let di = 0;
const P = (d, cls = '', extra = '') => `<path class="d ${cls}" d="${d}" pathLength="1" style="--i:${di++}" ${extra}/>`;
const r1 = (n) => Math.round(n * 10) / 10;

function hatch(mat, x0, y0, x1, y1) {
  let d = '';
  if (mat === 'timber') for (let x = x0 + 5; x < x1; x += 7) d += `M${x} ${y0}V${y1}`;
  else if (mat === 'brick') for (let y = y0 + 5; y < y1; y += 6) d += `M${x0} ${y}H${x1}`;
  else if (mat === 'earth') { let y = y0 + 6, k = 0; while (y < y1) { d += `M${x0} ${y}H${x1}`; y += [5, 9, 4, 12, 7][k++ % 5]; } }
  else if (mat === 'stone') { let row = 0; for (let y = y0 + 14; y < y1 + 14; y += 14, row++) { d += `M${x0} ${Math.min(y, y1)}H${x1}`; for (let x = x0 + (row % 2 ? 10 : 22); x < x1; x += 26) d += `M${x} ${y - 14}V${Math.min(y, y1)}`; } }
  else if (mat === 'straw') for (let y = y0 + 16; y < y1; y += 22) d += `M${x0 + 6} ${y}q${(x1 - x0) / 4} -4 ${(x1 - x0) / 2 - 6} 0t${(x1 - x0) / 2 - 6} 0`;
  return d;
}
function tree(x, g, h = 90, r = 34) {
  return P(`M${x} ${g}V${g - h * 0.55}M${x} ${g - h * 0.4}l-14 -16M${x} ${g - h * 0.48}l12 -14`, 'e-trunk') +
    P(`M${x - r} ${g - h * 0.62}a${r} ${r * 0.9} 0 1 1 ${2 * r} 0a${r} ${r * 0.7} 0 0 1 ${-2 * r} 0`, 'e-canopy');
}
const person = (x, g) => P(`M${x} ${g - 44}m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M${x} ${g - 39}V${g - 18}M${x} ${g - 18}l-5 18M${x} ${g - 18}l5 18M${x - 7} ${g - 32}H${x + 7}`, 'e-thin');

export function elevationSVG(p, uid = '') {
  di = 0;
  const id = 'cl-' + p.id + uid, g = 300;
  let body = '', clip = '', extra = '', glass = '';
  switch (p.form) {
    case 'mono':
      clip = `M100 ${g}V200L500 140V${g}Z`;
      body = P(clip, 'e-line');
      glass = `M330 ${g}V178H470V${g}M400 178V${g}`;
      extra = P('M500 140L560 132', 'e-line') + P(`M40 ${g - 30}C60 ${g - 24} 80 ${g - 12} 100 ${g - 8}`, 'e-thin');
      break;
    case 'stilts':
      clip = `M140 230V150H460V230Z`;
      body = P(clip, 'e-line') + P('M120 150L300 112L480 150', 'e-line');
      glass = 'M180 170H260V215H180ZM300 170H420V215H300Z';
      extra = P(`M170 230V${g}M240 230V${g}M310 230V${g}M380 230V${g}M440 230V${g}`, 'e-thin') +
        P(`M20 ${g - 2}q30 -6 60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0`, 'e-water') + P(`M40 ${g + 18}q30 -5 60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0`, 'e-water');
      break;
    case 'row': {
      let d = '';
      for (let i = 0; i < 5; i++) { const x = 70 + i * 92; d += `M${x} ${g}V200L${x + 46} 150L${x + 92} 200V${g}`; glass += `M${x + 30} ${g}V250H${x + 62}V${g}M${x + 30} 190H${x + 62}V225H${x + 30}Z`; }
      clip = 'M70 300V200L116 150L162 200L208 150L254 200L300 150L346 200L392 150L438 200L484 150L530 200V300Z';
      body = P(d, 'e-line');
      break;
    }
    case 'saw': {
      let d = `M80 ${g}V190`, gl = '';
      for (let i = 0; i < 4; i++) { const x = 80 + i * 110; d += `V140L${x + 110} 190`; gl += `M${x + 4} 146V186`; }
      d += `V${g}`;
      clip = 'M80 300V140L190 190V140L300 190V140L410 190V140L520 190V300Z';
      body = P(d + 'M80 190H520', 'e-line');
      glass = gl + `M130 ${g}V236H230V${g}M330 ${g}V236H430V${g}`;
      break;
    }
    case 'gable':
      clip = `M120 ${g}V190L300 104L480 190V${g}Z`;
      body = P(clip, 'e-line') + P('M100 199L300 96L500 199', 'e-line');
      glass = `M160 ${g}V236H220V${g}M260 210H340V262H260ZM380 ${g}V236H440V${g}M286 150H314V182H286Z`;
      break;
    case 'flat':
      clip = `M90 ${g}V206H380V${g}Z`;
      body = P(clip, 'e-line') + P(`M380 ${g}V180H520V${g}`, 'e-line');
      glass = `M110 ${g}V230H170V${g}M190 ${g}V230H250V${g}M270 ${g}V230H330V${g}M400 ${g}V204H500V${g}`;
      let tufts = ''; for (let x = 96; x < 520; x += 12) { const y = x < 380 ? 206 : 180; tufts += `M${x} ${y}l2 -8M${x + 4} ${y}l-1 -9`; }
      extra = P(tufts, 'e-plant') + P('M84 206H386M374 180H526', 'e-line');
      break;
    case 'pavilion':
      clip = `M150 ${g}V196H450V${g}Z`;
      body = P('M70 180H530V192H70Z', 'e-line');
      glass = `M160 ${g}V198H440V${g}M260 198V${g}M340 198V${g}`;
      extra = P(`M110 192V${g}H134V192M466 192V${g}H490V192`, 'e-line') + P(hatch('stone', 110, 192, 134, g) + hatch('stone', 466, 192, 490, g), 'e-hatch');
      let sed = ''; for (let x = 76; x < 526; x += 14) sed += `M${x} 180l2 -7`;
      extra += P(sed, 'e-plant');
      break;
    case 'mill':
      clip = `M90 ${g}V150L200 92L310 150V${g}Z`;
      body = P(clip, 'e-line') + P(`M310 ${g}V214H520V${g}M300 214H530`, 'e-line');
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) glass += `M${120 + c * 62} ${166 + r * 44}h28v26h-28z`;
      glass += `M340 ${g}V236H420V${g}M440 ${g}V236H500V${g}`;
      extra = P(hatch('timber', 310, 214, 520, g), 'e-hatch') + P(`M520 ${g}q20 8 50 6`, 'e-water');
      break;
  }
  const hatchD = hatch(p.form === 'mill' ? 'stone' : p.mat, 40, 80, 560, g);
  return `<svg viewBox="0 0 600 340" class="elev" aria-hidden="true" focusable="false">
    <defs><clipPath id="${id}"><path d="${clip}"/></clipPath></defs>
    <g clip-path="url(#${id})">${P(hatchD, 'e-hatch')}</g>
    ${body}${extra}
    ${glass ? P(glass, 'e-glass') : ''}
    ${P(`M10 ${g}H590`, 'e-ground')}
    ${P(Array.from({ length: 28 }, (_, i) => `M${14 + i * 21} ${g + 2}l-9 10`).join(''), 'e-thin e-earth')}
    ${tree(560, g, 96, 30)}${tree(38, g, 70, 22)}${person(p.form === 'stilts' ? 500 : 250, g)}
  </svg>`;
}

/* ---------------- Process drawings ---------------- */
export function processSVG(kind) {
  di = 0;
  if (kind === 'site') {
    let c = '';
    for (let k = 0; k < 8; k++) {
      const R = 40 + k * 26; let d = '';
      for (let a = 0; a <= 360; a += 10) {
        const t = (a * Math.PI) / 180, w = R + Math.sin(t * 3 + k) * 9 + Math.cos(t * 2 - k * 0.7) * 7;
        d += (a ? 'L' : 'M') + r1(250 + Math.cos(t) * w * 1.25) + ' ' + r1(200 + Math.sin(t) * w * 0.8);
      }
      c += d + 'Z';
    }
    return `<svg viewBox="0 0 500 400" aria-hidden="true" focusable="false">${P(c, 'e-thin')}
      ${P('M60 330A220 170 0 0 1 440 330', 'e-sun')}${P('M440 330m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0M250 160m-12 0a12 12 0 1 0 24 0a12 12 0 1 0 -24 0', 'e-sun')}
      ${P('M30 120C120 110 170 130 230 120M30 150C120 140 170 160 230 150', 'e-wind', 'marker-end="url(#va-arr-sage)"')}
      ${P('M215 175H285V215H215Z', 'e-line')}
      ${P('M460 40V90M460 40l-8 16M460 40l8 16', 'e-line')}<text x="455" y="110" class="e-txt">N</text></svg>`;
  }
  if (kind === 'massing') {
    const iso = (x, y, z) => [250 + (x - y) * 0.87, 250 + (x + y) * 0.5 - z];
    const box = (x, y, w, d, h) => {
      const p = (a, b, c) => iso(a, b, c).map(r1).join(' ');
      return `M${p(x, y, h)}L${p(x + w, y, h)}L${p(x + w, y + d, h)}L${p(x, y + d, h)}ZM${p(x, y + d, h)}L${p(x, y + d, 0)}L${p(x + w, y + d, 0)}L${p(x + w, y, 0)}L${p(x + w, y, h)}M${p(x + w, y + d, h)}L${p(x + w, y + d, 0)}`;
    };
    return `<svg viewBox="0 0 500 400" aria-hidden="true" focusable="false">
      ${P(box(-170, -60, 90, 60, 40), 'e-line')}${P(box(-40, -40, 120, 50, 70), 'e-line')}${P(box(100, 10, 70, 70, 30) + box(120, 30, 40, 40, 60), 'e-line')}
      ${P('M40 330H460', 'e-thin')}<text x="70" y="360" class="e-txt">A</text><text x="230" y="360" class="e-txt">B</text><text x="390" y="360" class="e-txt">C</text></svg>`;
  }
  if (kind === 'joint') {
    return `<svg viewBox="0 0 500 400" aria-hidden="true" focusable="false">
      ${P('M40 150H300V230H40', 'e-line')}${P('M300 150L340 140V240L300 230', 'e-line')}
      ${P('M260 60H340V340H260Z', 'e-line')}
      ${P('M300 150V230M262 150H300M262 230H300', 'e-thin')}
      ${P(Array.from({ length: 12 }, (_, i) => `M${50 + i * 20} 156q8 34 0 68`).join(''), 'e-grain')}
      ${P(Array.from({ length: 10 }, (_, i) => `M${266 + i * 7} 66V334`).join(''), 'e-grain')}
      ${P('M300 190m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0', 'e-line')}
      ${P('M300 190L420 120H470M150 230L120 300H70', 'e-thin')}
      <text x="372" y="112" class="e-txt">oak peg</text><text x="40" y="320" class="e-txt">housed tenon</text></svg>`;
  }
  if (kind === 'wall') {
    return `<svg viewBox="0 0 500 400" aria-hidden="true" focusable="false">
      ${P('M80 40V360M200 40V360M290 40V360M318 40V360M330 40V360', 'e-line')}
      ${P(hatch('earth', 80, 40, 200, 360), 'e-hatch')}
      ${P(Array.from({ length: 16 }, (_, i) => `M200 ${50 + i * 20}q22 -10 45 0t45 0`).join(''), 'e-thin')}
      ${P(Array.from({ length: 30 }, (_, i) => `M292 ${48 + i * 10}l24 6`).join(''), 'e-grain')}
      ${P('M140 120L140 70H360M245 200L245 150H380M304 260V230H400M324 300V290H420', 'e-thin')}
      <text x="365" y="74" class="e-txt">rammed earth</text><text x="385" y="154" class="e-txt">wood fibre</text><text x="405" y="234" class="e-txt">service void</text><text x="425" y="294" class="e-txt">lime</text></svg>`;
  }
  // planting plan
  const trees = [[110, 110, 54], [230, 80, 40], [360, 120, 62], [150, 260, 46], [300, 280, 36], [410, 290, 44], [240, 190, 26]];
  return `<svg viewBox="0 0 500 400" aria-hidden="true" focusable="false">
    ${P(trees.map(([x, y, r]) => { let d = ''; for (let a = 0; a <= 360; a += 15) { const t = (a * Math.PI) / 180, w = r + Math.sin(t * 5) * r * 0.08; d += (a ? 'L' : 'M') + r1(x + Math.cos(t) * w) + ' ' + r1(y + Math.sin(t) * w); } return d + 'Z'; }).join(''), 'e-canopy')}
    ${P(trees.map(([x, y]) => `M${x - 4} ${y}H${x + 4}M${x} ${y - 4}V${y + 4}`).join(''), 'e-thin')}
    ${P('M20 200C120 230 200 160 300 200S440 240 490 210', 'e-water')}
    ${P(Array.from({ length: 18 }, (_, i) => `M${30 + i * 26} ${370 - (i % 3) * 6}l3 -12M${36 + i * 26} ${370 - (i % 3) * 6}l-2 -10`).join(''), 'e-plant')}
  </svg>`;
}
