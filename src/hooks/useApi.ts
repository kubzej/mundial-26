import { useQuery } from '@tanstack/react-query';
import { fetchApi, LEAGUE_ID, SEASON } from '../api/client';
import { isLive } from '../api/types';
import type {
  Fixture,
  StandingsResponse,
  PlayerResponse,
  SquadResponse,
  TopScorerResponse,
  Coach,
  Injury,
  OddsResponse,
} from '../api/types';

// -- Fixtures --

export function useFixtures() {
  return useQuery({
    queryKey: ['fixtures'],
    queryFn: () =>
      fetchApi<Fixture[]>('/fixtures', { league: LEAGUE_ID, season: SEASON }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFixturesByDate(date: string) {
  return useQuery({
    queryKey: ['fixtures', 'date', date],
    queryFn: () =>
      fetchApi<Fixture[]>('/fixtures', {
        league: LEAGUE_ID,
        season: SEASON,
        date,
      }),
    staleTime: 60 * 1000,
  });
}

export function useLiveFixtures() {
  return useQuery({
    queryKey: ['fixtures', 'live'],
    queryFn: () =>
      fetchApi<Fixture[]>('/fixtures', {
        league: LEAGUE_ID,
        season: SEASON,
        status: '1H-HT-2H-ET-P-BT-LIVE',
      }),
    refetchInterval: 15 * 1000,
    staleTime: 10 * 1000,
  });
}

// A single /fixtures?id= request embeds events, lineups, statistics and
// players, so the match detail needs only this one call (not 4 extra ones).
// Self-polls every 15s while the match is live.
export function useFixture(id: number | undefined) {
  return useQuery({
    queryKey: ['fixture', id],
    queryFn: () => fetchApi<Fixture[]>('/fixtures', { id: id! }),
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchInterval: (query) => {
      const fixture = query.state.data?.[0];
      return fixture && isLive(fixture.fixture.status.short) ? 15 * 1000 : false;
    },
  });
}

export function useHeadToHead(
  teamA: number | undefined,
  teamB: number | undefined,
) {
  return useQuery({
    queryKey: ['h2h', teamA, teamB],
    queryFn: () =>
      fetchApi<Fixture[]>('/fixtures/headtohead', { h2h: `${teamA}-${teamB}` }),
    enabled: !!teamA && !!teamB,
    staleTime: 60 * 60 * 1000,
  });
}

// -- Rounds --

export function useRounds() {
  return useQuery({
    queryKey: ['rounds'],
    queryFn: () =>
      fetchApi<string[]>('/fixtures/rounds', {
        league: LEAGUE_ID,
        season: SEASON,
      }),
    staleTime: 60 * 60 * 1000,
  });
}

export function useCurrentRound() {
  return useQuery({
    queryKey: ['rounds', 'current'],
    queryFn: () =>
      fetchApi<string[]>('/fixtures/rounds', {
        league: LEAGUE_ID,
        season: SEASON,
        current: 'true',
      }),
    staleTime: 60 * 60 * 1000,
  });
}

// -- Standings --

export function useStandings() {
  return useQuery({
    queryKey: ['standings'],
    queryFn: () =>
      fetchApi<StandingsResponse[]>('/standings', {
        league: LEAGUE_ID,
        season: SEASON,
      }),
    staleTime: 5 * 60 * 1000,
  });
}

// -- Teams --

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () =>
      fetchApi<
        {
          team: {
            id: number;
            name: string;
            code: string;
            country: string;
            founded: number;
            national: boolean;
            logo: string;
          };
          venue: unknown;
        }[]
      >('/teams', { league: LEAGUE_ID, season: SEASON }),
    staleTime: 24 * 60 * 60 * 1000,
  });
}

// -- Players --

export function useTopScorers() {
  return useQuery({
    queryKey: ['topscorers'],
    queryFn: () =>
      fetchApi<TopScorerResponse[]>('/players/topscorers', {
        league: LEAGUE_ID,
        season: SEASON,
      }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopAssists() {
  return useQuery({
    queryKey: ['topassists'],
    queryFn: () =>
      fetchApi<TopScorerResponse[]>('/players/topassists', {
        league: LEAGUE_ID,
        season: SEASON,
      }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopYellowCards() {
  return useQuery({
    queryKey: ['topyellowcards'],
    queryFn: () =>
      fetchApi<TopScorerResponse[]>('/players/topyellowcards', {
        league: LEAGUE_ID,
        season: SEASON,
      }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopRedCards() {
  return useQuery({
    queryKey: ['topredcards'],
    queryFn: () =>
      fetchApi<TopScorerResponse[]>('/players/topredcards', {
        league: LEAGUE_ID,
        season: SEASON,
      }),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlayer(id: number | undefined) {
  return useQuery({
    queryKey: ['player', id],
    queryFn: () =>
      fetchApi<PlayerResponse[]>('/players', {
        id: id!,
        league: LEAGUE_ID,
        season: SEASON,
      }),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

// -- Squad --
// Uses /players/squads (team-scoped) which is available pre-tournament,
// unlike /players?league=1&season=2026 (gated by coverage.players).

export function useSquad(teamId: number | undefined) {
  return useQuery({
    queryKey: ['squad', teamId],
    queryFn: () =>
      fetchApi<SquadResponse[]>('/players/squads', { team: teamId! }),
    enabled: !!teamId,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

// -- Coach --

export function useCoach(teamId: number | undefined) {
  return useQuery({
    queryKey: ['coach', teamId],
    queryFn: () => fetchApi<Coach[]>('/coachs', { team: teamId! }),
    enabled: !!teamId,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

// -- Injuries --

export function useInjuries() {
  return useQuery({
    queryKey: ['injuries'],
    queryFn: () =>
      fetchApi<Injury[]>('/injuries', { league: LEAGUE_ID, season: SEASON }),
    staleTime: 30 * 60 * 1000,
  });
}

// -- Odds --
// Pre-match 1X2 odds. API only serves odds within 7 days of kickoff.

export function useOdds(fixtureId: number | undefined) {
  return useQuery({
    queryKey: ['odds', fixtureId],
    queryFn: () => fetchApi<OddsResponse[]>('/odds', { fixture: fixtureId! }),
    enabled: !!fixtureId,
    staleTime: 60 * 60 * 1000,
  });
}
