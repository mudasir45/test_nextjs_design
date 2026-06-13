import type { GoalCheckIn } from './types';

/** Calendar day key in local timezone — YYYY-MM-DD */
export function toDayKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isSameCalendarDay(a: string, b: string): boolean {
  return toDayKey(a) === toDayKey(b);
}

export function getTodayCheckIn(checkIns: GoalCheckIn[]): GoalCheckIn | undefined {
  const todayKey = toDayKey(new Date().toISOString());
  return checkIns.find((ci) => toDayKey(ci.date) === todayKey);
}

export function hasCheckedInToday(checkIns: GoalCheckIn[]): boolean {
  return getTodayCheckIn(checkIns) !== undefined;
}
