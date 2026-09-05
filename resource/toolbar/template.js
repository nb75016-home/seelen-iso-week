// Date scope triggers a refresh; never parse the localized date string.
const tick = date;
function isoWeek(value) {
  const d = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const year = d.getUTCFullYear();
  return { year, week: Math.ceil(((d - new Date(Date.UTC(year, 0, 1))) / 86400000 + 1) / 7) };
}
function weekLabel(week, format = 'Sxx') {
  return format.replace(/xx|x/, format.includes('xx') ? String(week).padStart(2, '0') : String(week));
}
const now = new Date();
const civilDate = String(now.getDate()).padStart(2, "0") + "/" + String(now.getMonth() + 1).padStart(2, "0") + "/" + now.getFullYear();
return weekLabel(isoWeek(now).week, "Sxx") + " · " + civilDate;
