import { Widget, Settings } from '@seelen-ui/lib';
import { isoWeek, weekLabel, monthRows } from './time.js';

const root = document.getElementById('root');
const widget = Widget.self;
let config = {}, month = new Date(), lastDay = '', unsubscribe;
const node = (tag, text, className) => {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (className) el.className = className;
  return el;
};
function button(label, title, action) {
  const el = node('button', label);
  el.type = 'button'; el.title = title; el.setAttribute('aria-label', title);
  el.addEventListener('click', action); return el;
}
function frame(title) {
  const panel = node('section', undefined, 'slu-std-popover time-popup');
  panel.setAttribute('aria-label', title);
  const header = node('header'); header.append(node('h1', title));
  header.append(button('×', 'Fermer', () => widget.hide()));
  panel.append(header); root.replaceChildren(panel); return panel;
}
function calendar() {
  const now = new Date(), iso = isoWeek(now), fmt = config['week-format'] || 'Sxx';
  const panel = frame('Semaines ISO');
  panel.append(node('p', `${weekLabel(iso.week, fmt)} · année ISO ${iso.year}`, 'current-week'));
  if (config['show-date'] !== false) panel.append(node('p', new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(now), 'subtle'));
  const nav = node('nav');
  nav.setAttribute('aria-label', 'Navigation du calendrier');
  nav.append(button('‹', 'Mois précédent', () => { month = new Date(month.getFullYear(), month.getMonth() - 1, 1); calendar(); }));
  nav.append(node('h2', new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(month)));
  nav.append(button('›', 'Mois suivant', () => { month = new Date(month.getFullYear(), month.getMonth() + 1, 1); calendar(); }));
  panel.append(nav);
  const table = node('table'); table.setAttribute('aria-label', 'Calendrier avec numéros de semaine ISO');
  const head = node('thead'), tr = node('tr');
  ['Sem.', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].forEach(t => { const th = node('th', t); th.scope = 'col'; tr.append(th); });
  head.append(tr); table.append(head);
  const body = node('tbody');
  monthRows(month.getFullYear(), month.getMonth()).forEach(days => {
    const row = node('tr'), w = isoWeek(days[0]), th = node('th', weekLabel(w.week, fmt), 'week-number');
    th.scope = 'row'; th.title = `Semaine ${w.week}, année ISO ${w.year}`; row.append(th);
    if (w.week === iso.week && w.year === iso.year) row.classList.add('current-week-row');
    days.forEach(d => {
      const cell = node('td', String(d.getDate()));
      if (d.getMonth() !== month.getMonth()) cell.classList.add('outside-month');
      if (d.toDateString() === now.toDateString()) { cell.classList.add('today'); cell.setAttribute('aria-current', 'date'); }
      row.append(cell);
    }); body.append(row);
  });
  table.append(body); panel.append(table);
  panel.append(button('Aujourd’hui', 'Revenir au mois actuel', () => { month = new Date(); calendar(); }));
  panel.append(node('p', 'Du lundi au dimanche · ISO-8601', 'footnote'));
  lastDay = now.toDateString();
}
function apply(settings) {
  config = settings.getCurrentWidgetConfig();
  calendar();
}
async function start() {
  await widget.init({ autoSizeByContent: root });
  apply(await Settings.getAsync());
  unsubscribe = await Settings.onChange(apply);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') widget.hide(); });
  const timer = setInterval(() => {
    if (new Date().toDateString() !== lastDay) calendar();
  }, 1000);
  window.addEventListener('pagehide', () => { clearInterval(timer); unsubscribe?.(); }, { once: true });
  await widget.ready();
}
start().catch(error => {
  console.error('Seelen iso-week:', error);
  root.textContent = 'Impossible de charger ce popup. Consultez les outils de développement (Ctrl+Maj+I).';
});
