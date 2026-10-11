/* VERDURA ARCHITECTS — page orchestration */
import { drawingSVG, updateSun, SEASONS } from './drawing.js';
import { PROJECTS, TYPES, MATS, elevationSVG, processSVG } from './projects.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const nextFrame = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));

/* ---------------------------------------------------------------- */
/* Header                                                            */
/* ---------------------------------------------------------------- */
const menuBtn = $('.menu-btn');
const closeNav = () => { menuBtn.setAttribute('aria-expanded', 'false'); root.classList.remove('nav-open'); };
menuBtn.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') !== 'true';
  menuBtn.setAttribute('aria-expanded', String(open)); root.classList.toggle('nav-open', open);
});
$('#site-nav').addEventListener('click', (e) => { if (e.target.closest('a')) closeNav(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('nav-open')) { closeNav(); menuBtn.focus(); } });
const onScroll = () => root.classList.toggle('is-scrolled', scrollY > 24);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* ---------------------------------------------------------------- */
/* The drawing board (signature)                                     */
/* ---------------------------------------------------------------- */
const board = $('#board');
board.innerHTML = drawingSVG();
const svg = $('svg', board);
const L = (k) => $('.L-' + k, svg);
const STAGES = [
  null,
  { name: 'Sketch', title: 'Concept sketch' },
  { name: 'Material', title: 'Material section' },
  { name: 'Form', title: 'Section A–A' },
  { name: 'Environment', title: 'Environmental section' },
];
const state = { stage: 0, layers: new Set(['sun']), season: 'winter' };
let timers = [];
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; root.classList.remove('is-autoplay'); };

function applyStage() {
  const s = state.stage;
  L('sketch').classList.toggle('is-on', s >= 1);
  L('sketch').classList.toggle('is-faded', s >= 3);
  L('material').classList.toggle('is-on', s >= 2);
  L('form').classList.toggle('is-on', s >= 3);
  for (const k of ['sun', 'wind', 'water', 'plant']) L(k).classList.toggle('is-on', s >= 4 && state.layers.has(k));
  svg.dataset.stage = s;
  board.closest('.board').dataset.stage = s;
  $$('#stepper [data-stage]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.stage === s)));
  $$('#layers [data-layer]').forEach((b) => b.setAttribute('aria-pressed', String(s >= 4 && state.layers.has(b.dataset.layer))));
  $$('#board-notes [data-note]').forEach((n) => { n.hidden = !(s >= 4 && state.layers.has(n.dataset.note)); });
  $$('[data-min-stage]').forEach((n) => n.classList.toggle('is-shown', s >= +n.dataset.minStage));
  if (s) {
    $('#tb-drawing').textContent = STAGES[s].title;
    $('#tb-stage').textContent = `0${s} of 04 · ${STAGES[s].name}`;
  }
  $('#tb-season').textContent = s >= 4 && state.layers.has('sun') ? SEASONS[state.season].label : '—';
  const any = s >= 4 && state.layers.size;
  $('#board-notes').classList.toggle('is-empty', !any);
}
function setStage(n, user = true) {
  if (user) clearTimers();
  state.stage = n; applyStage();
  if (user) $('#board-status').textContent = `Stage ${n}: ${STAGES[n].name}. ${STAGES[n].title} shown.`;
}
function setSeason(s) {
  state.season = s;
  const r = updateSun(svg, s);
  $$('#seasons input').forEach((i) => { i.checked = i.value === s; });
  $('#sun-read').textContent = `${SEASONS[s].label}: sun ${SEASONS[s].alt}° above the horizon. ${r.glassLit > 0.75 ? 'Low sun reaches deep into the reading room.' : r.glassLit > 0.45 ? 'The eave shades the upper glass.' : 'The eave keeps direct sun off almost all of the glass.'}`;
  applyStage();
}
function play() {
  clearTimers();
  root.classList.add('is-autoplay');
  state.stage = 0; applyStage();
  const seq = [[1, 250], [2, 2300], [3, 4300], [4, 6400]];
  seq.forEach(([n, t]) => timers.push(setTimeout(() => { state.stage = n; applyStage(); if (n === 4) root.classList.remove('is-autoplay'); }, t)));
}

$('#stepper').addEventListener('click', (e) => { const b = e.target.closest('[data-stage]'); if (b) setStage(+b.dataset.stage); });
$('#stepper').addEventListener('keydown', (e) => {
  if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  const btns = $$('#stepper [data-stage]'); const i = btns.indexOf(document.activeElement); if (i < 0) return;
  const n = (i + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length;
  btns[n].focus(); setStage(+btns[n].dataset.stage); e.preventDefault();
});
$('#layers').addEventListener('click', (e) => {
  const b = e.target.closest('[data-layer]'); if (!b) return;
  clearTimers();
  const k = b.dataset.layer;
  if (state.stage < 4) { state.stage = 4; state.layers.add(k); }
  else if (state.layers.has(k)) state.layers.delete(k); else state.layers.add(k);
  applyStage();
  $('#board-status').textContent = `${b.textContent.trim()} layer ${state.layers.has(k) ? 'shown' : 'hidden'}.`;
});
$('#seasons').addEventListener('change', (e) => { clearTimers(); if (state.stage < 4) state.stage = 4; state.layers.add('sun'); setSeason(e.target.value); });
$('#replay').addEventListener('click', () => { if (reduced) { setStage(4); return; } play(); });

function fitBoard() {
  const small = innerWidth < 700;
  svg.setAttribute('viewBox', small ? '170 110 1030 570' : '0 0 1200 700');
}
addEventListener('resize', fitBoard); fitBoard();
setSeason('winter');
if (reduced) { root.classList.add('no-draw'); state.stage = 4; applyStage(); }
else nextFrame(play);

/* ---------------------------------------------------------------- */
/* Projects                                                          */
/* ---------------------------------------------------------------- */
const grid = $('#proj-grid');
const pf = { type: 'all', mat: 'all' };
const SPANS = [7, 5, 4, 4, 4, 5, 7, 6, 6];
let visible = PROJECTS;
function renderProjects() {
  visible = PROJECTS.filter((p) => (pf.type === 'all' || p.type === pf.type) && (pf.mat === 'all' || p.mat === pf.mat));
  grid.innerHTML = visible.length ? visible.map((p, i) => `<li class="proj" data-span="${visible.length === 1 ? 12 : SPANS[i % SPANS.length]}">
    <button type="button" class="proj__open" data-id="${p.id}" aria-haspopup="dialog">
      <span class="proj__sheet">${elevationSVG(p, '-g')}<span class="proj__status">${p.status}</span></span>
      <span class="proj__tb"><span class="proj__no">${p.no}</span><span class="proj__name">${p.name}</span><span class="proj__meta">${TYPES[p.type]} · ${MATS[p.mat]} · ${p.year}</span></span>
    </button></li>`).join('') : `<li class="proj-empty"><p>No project matches both filters yet. The studio has not built in ${MATS[pf.mat].toLowerCase()} for this typology.</p><button type="button" class="btn btn--line" data-clear>Show all projects</button></li>`;
  $('#proj-count').textContent = `${visible.length} of ${PROJECTS.length} projects`;
  if (reduced) $$('.proj', grid).forEach((n) => n.classList.add('is-drawn'));
  else nextFrame(() => $$('.proj', grid).forEach((n, i) => setTimeout(() => n.classList.add('is-drawn'), i * 90)));
}
$('#proj-filters').addEventListener('change', (e) => { if (e.target.name in pf) { pf[e.target.name] = e.target.value; renderProjects(); } });
$('#proj-filters').addEventListener('submit', (e) => e.preventDefault());
grid.addEventListener('click', (e) => {
  const b = e.target.closest('.proj__open'); if (b) openProject(b.dataset.id, b);
  if (e.target.closest('[data-clear]')) { pf.type = 'all'; pf.mat = 'all'; $('#proj-filters').reset(); renderProjects(); }
});
renderProjects();

const dlg = $('#proj-dialog');
let lastOpener = null, current = null;
function fillDialog(p) {
  current = p;
  $('#dlg-art').innerHTML = elevationSVG(p, '-d');
  $('#dlg-no').textContent = `Project ${p.no}`;
  $('#dlg-title').textContent = p.name;
  $('#dlg-text').textContent = p.text;
  $('#dlg-type').textContent = TYPES[p.type];
  $('#dlg-mat').textContent = MATS[p.mat];
  $('#dlg-year').textContent = p.year;
  $('#dlg-status').textContent = p.status;
  $('#dlg-place').textContent = p.place;
  $('#dlg-palette').innerHTML = p.palette.map((m) => `<li>${m}</li>`).join('');
  const art = $('#dlg-art'); art.classList.remove('is-drawn');
  if (reduced) art.classList.add('is-drawn'); else nextFrame(() => art.classList.add('is-drawn'));
}
function openProject(id, opener) {
  const p = PROJECTS.find((x) => x.id === id); if (!p) return;
  lastOpener = opener || null;
  fillDialog(p);
  if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', '');
  root.classList.add('dlg-open');
  $('#dlg-close').focus();
}
function closeProject() {
  if (typeof dlg.close === 'function' && dlg.open) dlg.close(); else dlg.removeAttribute('open');
}
dlg.addEventListener('close', () => { root.classList.remove('dlg-open'); if (lastOpener && lastOpener.isConnected) lastOpener.focus(); });
$('#dlg-close').addEventListener('click', closeProject);
dlg.addEventListener('click', (e) => { if (e.target === dlg) closeProject(); });
const stepProject = (d) => { const list = visible.length ? visible : PROJECTS; const i = list.indexOf(current); fillDialog(list[(i + d + list.length) % list.length] || list[0]); };
$('#dlg-prev').addEventListener('click', () => stepProject(-1));
$('#dlg-next').addEventListener('click', () => stepProject(1));
$('#dlg-enquire').addEventListener('click', () => { lastOpener = null; closeProject(); setTimeout(() => $('#c-name').focus({ preventScroll: true }), 450); const sel = $('#c-type'); sel.value = { civic: 'civic', housing: 'housing', workplace: 'workplace', landscape: 'landscape' }[current.type]; });

/* ---------------------------------------------------------------- */
/* Process drawings                                                  */
/* ---------------------------------------------------------------- */
$$('[data-process]').forEach((fig) => { $('.proc__art', fig).innerHTML = processSVG(fig.dataset.process); });

/* ---------------------------------------------------------------- */
/* Studio timeline (scale ruler)                                     */
/* ---------------------------------------------------------------- */
const EVENTS = [
  { y: 2009, t: 'A room above a joinery', d: 'Mara Ellison and Tomasz Wren open the studio in a rented room above a joinery, sharing its offcuts and its bandsaw.' },
  { y: 2012, t: 'The reading hut', d: 'The first built work: a timber reading hut for a village school, raised over one summer with the help of parents.' },
  { y: 2015, t: 'The old ropeworks', d: 'The studio moves into a derelict ropeworks by the harbour and restores it, slowly, as its own workshop and model shop.' },
  { y: 2018, t: 'Walls in the yard', d: 'The first rammed-earth test walls go up in the ropeworks yard, made from subsoil dug out of local building sites.' },
  { y: 2021, t: 'Kiln Yard', d: 'Kiln Yard Workshops opens: the studio’s first large project built mostly inside the walls of what was already there.' },
  { y: 2024, t: 'Hollowbrook', d: 'Hollowbrook Library opens, bringing together the earth wall, the timber frame and the planted roof the studio had tested for years.' },
  { y: 2026, t: 'Still drawing by hand first', d: 'Every project still begins on the drawing board at the ropeworks, before a single line is drawn on screen.' },
];
const Y0 = 2008, Y1 = 2027;
const ruler = $('#ruler');
let ticks = '';
for (let y = Y0; y <= Y1; y++) ticks += `<span class="ruler__tick${y % 5 === 0 ? ' is-major' : ''}" style="left:${(((y - Y0) / (Y1 - Y0)) * 100).toFixed(2)}%" aria-hidden="true">${y % 5 === 0 ? `<i>${y}</i>` : ''}</span>`;
ruler.innerHTML = ticks + EVENTS.map((ev, i) => `<button type="button" class="ruler__mark" style="left:${(((ev.y - Y0) / (Y1 - Y0)) * 100).toFixed(2)}%" data-ev="${i}" aria-pressed="false"><span class="ruler__year">${ev.y}</span><span class="visually-hidden">: ${ev.t}</span></button>`).join('');
function showEvent(i, focus = false) {
  const ev = EVENTS[i];
  $$('.ruler__mark', ruler).forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.ev === i)));
  const panel = $('#ev-panel');
  panel.classList.remove('is-in'); void panel.offsetWidth; panel.classList.add('is-in');
  $('#ev-year').textContent = ev.y; $('#ev-title').textContent = ev.t; $('#ev-text').textContent = ev.d;
  $('#ruler-cursor').style.left = (((ev.y - Y0) / (Y1 - Y0)) * 100).toFixed(2) + '%';
  if (focus) $(`.ruler__mark[data-ev="${i}"]`, ruler).focus();
}
ruler.addEventListener('click', (e) => { const b = e.target.closest('.ruler__mark'); if (b) showEvent(+b.dataset.ev); });
ruler.addEventListener('keydown', (e) => {
  const b = e.target.closest('.ruler__mark'); if (!b) return;
  const i = +b.dataset.ev;
  if (e.key === 'ArrowRight') { showEvent(Math.min(EVENTS.length - 1, i + 1), true); e.preventDefault(); }
  if (e.key === 'ArrowLeft') { showEvent(Math.max(0, i - 1), true); e.preventDefault(); }
});
$('#ev-prev').addEventListener('click', () => { const i = $$('.ruler__mark', ruler).findIndex((b) => b.getAttribute('aria-pressed') === 'true'); showEvent(Math.max(0, i - 1)); });
$('#ev-next').addEventListener('click', () => { const i = $$('.ruler__mark', ruler).findIndex((b) => b.getAttribute('aria-pressed') === 'true'); showEvent(Math.min(EVENTS.length - 1, i + 1)); });
showEvent(EVENTS.length - 2);

/* ---------------------------------------------------------------- */
/* Contact form                                                      */
/* ---------------------------------------------------------------- */
const form = $('#contact-form');
const rules = {
  name: (v) => (v.trim().length >= 2 ? '' : 'Please tell us your name.'),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address, for example name@domain.com.'),
  type: (v) => (v ? '' : 'Please choose the kind of project.'),
  message: (v) => (v.trim().length >= 20 ? '' : `A sentence or two about the site and the idea, please (${Math.max(0, 20 - v.trim().length)} more characters).`),
  consent: (_, el) => (el.checked ? '' : 'Please confirm you understand this form is a demo.'),
};
function check(el) {
  const fn = rules[el.name]; if (!fn) return true;
  const msg = fn(el.value, el);
  el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  const err = $('#cerr-' + el.name); if (err) err.textContent = msg;
  return !msg;
}
let tried = false;
form.addEventListener('input', (e) => { if (tried) check(e.target); });
form.addEventListener('change', (e) => { if (tried) check(e.target); });
form.addEventListener('submit', (e) => {
  e.preventDefault(); tried = true;
  const bad = ['name', 'email', 'type', 'message', 'consent'].map((n) => form.elements[n]).filter((el) => !check(el));
  if (bad.length) { bad[0].focus(); $('#c-status').textContent = `${bad.length} field${bad.length > 1 ? 's need' : ' needs'} attention.`; return; }
  $('#c-status').textContent = '';
  $('#cdone-name').textContent = form.elements.name.value.trim().split(' ')[0];
  form.hidden = true; const ok = $('#contact-done'); ok.hidden = false; ok.focus();
});
$('#c-again').addEventListener('click', () => {
  form.reset(); tried = false;
  $$('[aria-invalid]', form).forEach((x) => x.removeAttribute('aria-invalid')); $$('.field__err', form).forEach((x) => (x.textContent = ''));
  $('#contact-done').hidden = true; form.hidden = false; form.elements.name.focus();
});

/* ---------------------------------------------------------------- */
/* Drafting reveals: rules draw across, drawings draw on             */
/* ---------------------------------------------------------------- */
const targets = $$('[data-draft], .proc, .principle');
if ('IntersectionObserver' in window && !reduced) {
  const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in', 'is-drawn'); io.unobserve(en.target); } }), { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });
  targets.forEach((t) => io.observe(t));
} else targets.forEach((t) => t.classList.add('is-in', 'is-drawn'));

$('#year').textContent = new Date().getFullYear();
window.verduraReady = true;
