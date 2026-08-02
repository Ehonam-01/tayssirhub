export function getDateWindow(daysAhead: number) {
  const now = new Date();
  const from = now.toISOString().slice(0, 10);
  const until = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return { from, until };
}

export function getMonthWindow(monthsAgo = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const end = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 1);
  return { start: start.toISOString(), end: end.toISOString() };
}
