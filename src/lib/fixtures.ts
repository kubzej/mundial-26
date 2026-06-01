import type { Fixture, StandingTeam } from '../api/types';
import { isLive, isFinished } from '../api/types';
import { toDateKey } from './format';

// -- Fixtures grouping --

/** Group fixtures by date (YYYY-MM-DD) */
export function groupFixturesByDate(
  fixtures: Fixture[],
): Map<string, Fixture[]> {
  const map = new Map<string, Fixture[]>();

  for (const f of fixtures) {
    const key = toDateKey(f.fixture.date);
    const group = map.get(key) || [];
    group.push(f);
    map.set(key, group);
  }

  // Sort fixtures within each day by time
  for (const [, group] of map) {
    group.sort((a, b) => a.fixture.timestamp - b.fixture.timestamp);
  }

  return map;
}

/** Group fixtures by round */
export function groupFixturesByRound(
  fixtures: Fixture[],
): Map<string, Fixture[]> {
  const map = new Map<string, Fixture[]>();

  for (const f of fixtures) {
    const round = f.league.round;
    const group = map.get(round) || [];
    group.push(f);
    map.set(round, group);
  }

  return map;
}

/** Filter fixtures: live only */
export function getLiveFixtures(fixtures: Fixture[]): Fixture[] {
  return fixtures.filter((f) => isLive(f.fixture.status.short));
}

/** Filter fixtures: today (local timezone) */
export function getTodayFixtures(fixtures: Fixture[]): Fixture[] {
  const today = toDateKey(new Date().toISOString());
  return fixtures.filter((f) => toDateKey(f.fixture.date) === today);
}

/** Filter fixtures: finished */
export function getFinishedFixtures(fixtures: Fixture[]): Fixture[] {
  return fixtures.filter((f) => isFinished(f.fixture.status.short));
}

/** Filter fixtures: upcoming (not started) */
export function getUpcomingFixtures(fixtures: Fixture[]): Fixture[] {
  return fixtures.filter(
    (f) =>
      !isLive(f.fixture.status.short) && !isFinished(f.fixture.status.short),
  );
}

/** Get fixtures for a specific team */
export function getTeamFixtures(
  fixtures: Fixture[],
  teamId: number,
): Fixture[] {
  return fixtures.filter(
    (f) => f.teams.home.id === teamId || f.teams.away.id === teamId,
  );
}

// -- Standings helpers --

/** Extract a specific group from standings array */
export function getGroup(
  standings: StandingTeam[][],
  groupLetter: string,
): StandingTeam[] | undefined {
  return standings.find((group) => group[0]?.group === `Group ${groupLetter}`);
}

/** Check if team qualifies (rank 1-2 = direct, rank 3 = potential) */
export function getQualificationStatus(
  rank: number,
): 'qualified' | 'potential' | 'eliminated' {
  if (rank <= 2) return 'qualified';
  if (rank === 3) return 'potential';
  return 'eliminated';
}

// -- Sorting --

/** Sort fixtures by date ascending */
export function sortByDate(fixtures: Fixture[]): Fixture[] {
  return [...fixtures].sort(
    (a, b) => a.fixture.timestamp - b.fixture.timestamp,
  );
}

/** Sort fixtures: live first, then upcoming, then finished */
export function sortByRelevance(fixtures: Fixture[]): Fixture[] {
  return [...fixtures].sort((a, b) => {
    const aLive = isLive(a.fixture.status.short) ? 0 : 1;
    const bLive = isLive(b.fixture.status.short) ? 0 : 1;
    if (aLive !== bLive) return aLive - bLive;

    const aFinished = isFinished(a.fixture.status.short) ? 1 : 0;
    const bFinished = isFinished(b.fixture.status.short) ? 1 : 0;
    if (aFinished !== bFinished) return aFinished - bFinished;

    return a.fixture.timestamp - b.fixture.timestamp;
  });
}
