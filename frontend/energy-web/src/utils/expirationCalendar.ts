function startOfLocalDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function calendarDaysSinceExpiration(date: string): number {
  const exp = startOfLocalDay(new Date(date));
  const today = startOfLocalDay(new Date());
  return Math.floor((today.getTime() - exp.getTime()) / (1000 * 60 * 60 * 24));
}

export function calendarDaysUntilExpiration(date: string): number {
  const exp = startOfLocalDay(new Date(date));
  const today = startOfLocalDay(new Date());
  return Math.floor((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
