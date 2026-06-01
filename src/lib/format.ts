/**
 * Format a UTC date string to localized Czech time
 */
export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Prague',
  });
}

/**
 * Format a UTC date string to a short Czech date
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/Prague',
  });
}

/**
 * Format date for date picker / grouping (YYYY-MM-DD)
 */
export function toDateKey(dateStr: string): string {
  return new Date(dateStr).toISOString().split('T')[0];
}

/**
 * Get today's date as YYYY-MM-DD
 */
export function today(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Format match minute display
 */
export function formatMinute(
  elapsed: number | null,
  extra: number | null,
): string {
  if (elapsed === null) return '';
  if (extra) return `${elapsed}+${extra}'`;
  return `${elapsed}'`;
}

/**
 * Translate round name to Czech
 */
export function translateRound(round: string): string {
  const map: Record<string, string> = {
    'Group Stage - 1': 'Skupina - 1. kolo',
    'Group Stage - 2': 'Skupina - 2. kolo',
    'Group Stage - 3': 'Skupina - 3. kolo',
    'Round of 32': 'Osmifinále',
    'Round of 16': 'Šestnáctifinále',
    'Quarter-finals': 'Čtvrtfinále',
    'Semi-finals': 'Semifinále',
    '3rd Place Final': 'O 3. místo',
    Final: 'Finále',
  };
  return map[round] || round;
}

/**
 * Short day name for date pills
 */
export function shortDayName(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('cs-CZ', { weekday: 'short' });
}
