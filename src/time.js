// ISO weeks use the local civil date, then UTC arithmetic to avoid DST drift.
export function isoWeek(value) {
  const d = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const year = d.getUTCFullYear();
  return { year, week: Math.ceil(((d - new Date(Date.UTC(year, 0, 1))) / 86400000 + 1) / 7) };
}
export function weekLabel(week, format = 'Sxx') {
  return format.replace(/xx|x/, format.includes('xx') ? String(week).padStart(2, '0') : String(week));
}
export function monthRows(year, month) {
  const first = new Date(year, month, 1, 12);
  first.setDate(first.getDate() - (first.getDay() + 6) % 7);
  return Array.from({ length: 6 }, (_, row) => Array.from({ length: 7 }, (_, col) =>
    new Date(first.getFullYear(), first.getMonth(), first.getDate() + row * 7 + col, 12)));
}
