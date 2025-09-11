export function formatDate(d: string | number | Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(d));
}

export function isOverdue(d: string | number | Date, now: Date = new Date()): boolean {
  const due = new Date(d);
  if (Number.isNaN(due.getTime())) return false;

  const dueUTC = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate());
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  return dueUTC < todayUTC;
}
