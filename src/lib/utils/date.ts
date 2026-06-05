import { format, formatDistanceToNow, isToday, isYesterday, isTomorrow, parseISO } from "date-fns";

/**
 * Format a date for display.
 */
export function formatDate(
  date: string | Date | null | undefined,
  formatStr: string = "dd MMM yyyy"
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, formatStr);
}

/**
 * Format a date relative to now (e.g., "2 hours ago", "in 3 days").
 */
export function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;

  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  if (isTomorrow(d)) return "Tomorrow";

  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Format a date with time.
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  return formatDate(date, "dd MMM yyyy · hh:mm a");
}

/**
 * Format just the time portion.
 */
export function formatTime(date: string | Date | null | undefined): string {
  return formatDate(date, "hh:mm a");
}
