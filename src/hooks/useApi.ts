import { useQuery } from '@tanstack/react-query';
import { fetchApi, LEAGUE_ID, SEASON } from '../api/client';
import type {
  Fixture,
  StandingsResponse,
  PlayerResponse,
  TopScorerResponse,
  Coach,
  Injury,
  Prediction,
  FixtureEvent,
  Lineup,
  FixtureStatistic,
  FixturePlayerStats,
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

export function useFixture(id: number | undefined) {
  return useQuery({
    queryKey: ['fixture', id],
    queryFn: () => fetchApi<Fixture[]>('/fixtures', { id: id! }),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useFixtureEvents(fixtureId: number | undefined) {
  return useQuery({
    queryKey: ['fixture', fixtureId, 'events'],
    queryFn: () =>
      fetchApi<FixtureEvent[]>('/fixtures/events', { fixture: fixtureId! }),
    enabled: !!fixtureId,
    staleTime: 15 * 1000,
  });
}

export function useFixtureLineups(fixtureId: number | undefined) {
  return useQuery({
    queryKey: ['fixture', fixtureId, 'lineups'],
    queryFn: () =>
      fetchApi<Lineup[]>('/fixtures/lineups', { fixture: fixtureId! }),
    enabled: !!fixtureId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFixtureStatistics(fixtureId: number | undefined) {
  return useQuery({
    queryKey: ['fixture', fixtureId, 'statistics'],
    queryFn: () =>
      fetchApi<FixtureStatistic[]>('/fixtures/statistics', {
        fixture: fixtureId!,
      }),
    enabled: !!fixtureId,
    staleTime: 30 * 1000,
  });
}

export function useFixturePlayerStats(fixtureId: number | undefined) {
  return useQuery({
    queryKey: ['fixture', fixtureId, 'players'],
    queryFn: () =>
      fetchApi<FixturePlayerStats[]>('/fixtures/players', {
        fixture: fixtureId!,
      }),
    enabled: !!fixtureId,
    staleTime: 60 * 1000,
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

// -- Predictions --

export function usePrediction(fixtureId: number | undefined) {
  return useQuery({
    queryKey: ['prediction', fixtureId],
    queryFn: () =>
      fetchApi<Prediction[]>('/predictions', { fixture: fixtureId! }),
    enabled: !!fixtureId,
    staleTime: 60 * 60 * 1000,
  });
}
