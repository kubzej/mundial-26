// Tournament-level constants for World Cup 2026

export const TOURNAMENT = {
  name: 'FIFA World Cup 2026',
  startDate: '2026-06-11',
  endDate: '2026-07-19',
  league: 1,
  season: 2026,
  hosts: ['USA', 'Canada', 'Mexico'],
  totalTeams: 48,
  totalMatches: 104,
  groups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
} as const;

export const ROUNDS_ORDER = [
  'Group Stage - 1',
  'Group Stage - 2',
  'Group Stage - 3',
  'Round of 32',
  'Round of 16',
  'Quarter-finals',
  'Semi-finals',
  '3rd Place Final',
  'Final',
] as const;

export const ROUND_LABELS: Record<string, string> = {
  'Group Stage - 1': 'Sk. 1. kolo',
  'Group Stage - 2': 'Sk. 2. kolo',
  'Group Stage - 3': 'Sk. 3. kolo',
  'Round of 32': 'Osmifinále',
  'Round of 16': 'Šestnáctifinále',
  'Quarter-finals': 'Čtvrtfinále',
  'Semi-finals': 'Semifinále',
  '3rd Place Final': 'O 3. místo',
  Final: 'Finále',
};

/** Generate array of dates between tournament start and end */
export function getTournamentDates(): string[] {
  const dates: string[] = [];
  const start = new Date(TOURNAMENT.startDate);
  const end = new Date(TOURNAMENT.endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }

  return dates;
}

/** Check if a given date falls within the tournament */
export function isDuringTournament(date: string): boolean {
  return date >= TOURNAMENT.startDate && date <= TOURNAMENT.endDate;
}
