import {
  format,
  parseISO,
  isToday,
  isYesterday,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function toDateKey(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
}

export function formatEntryDate(dateStr: string): string {
  const d = parseISO(dateStr);
  if (isToday(d)) return '今天';
  if (isYesterday(d)) return '昨天';
  return format(d, 'M月d日 EEEE', { locale: zhCN });
}

export function formatFullDate(dateStr: string): string {
  return format(parseISO(dateStr), 'yyyy年M月d日 EEEE', { locale: zhCN });
}

export function formatMonthTitle(date: Date): string {
  return format(date, 'yyyy年M月', { locale: zhCN });
}

export function formatTime(iso: string): string {
  return format(parseISO(iso), 'HH:mm');
}

export function monthGrid(month: Date): (Date | null)[] {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  // Monday-first: getDay Sun=0 -> shift
  const startPad = (getDay(start) + 6) % 7;
  const cells: (Date | null)[] = Array(startPad).fill(null);
  cells.push(...days);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export { isSameDay, isSameMonth, isToday, parseISO, format };
