import { useCallback } from 'react';
import { useLiveFixtures, useFixturesByDate } from './useApi';
import { today } from '../lib/format';
import { getLiveFixtures, sortByRelevance } from '../lib/fixtures';
import type { Fixture } from '../api/types';

interface LiveState {
  liveMatches: Fixture[];
  todayUpcoming: Fixture[];
  todayFinished: Fixture[];
  isMatchDay: boolean;
  isLoading: boolean;
  refetch: () => void;
}

/**
 * Combined hook for the Live/Dnes page.
 * Provides live matches (polling), today's upcoming and finished.
 */
export function useLiveState(): LiveState {
  const todayStr = today();

  const {
    data: liveData,
    isLoading: liveLoading,
    refetch: refetchLive,
  } = useLiveFixtures();

  const {
    data: todayData,
    isLoading: todayLoading,
    refetch: refetchToday,
  } = useFixturesByDate(todayStr);

  const liveMatches = liveData ? getLiveFixtures(liveData) : [];

  const todayFixtures = todayData ? sortByRelevance(todayData) : [];
  const todayUpcoming = todayFixtures.filter(
    (f) => f.fixture.status.short === 'NS' || f.fixture.status.short === 'TBD',
  );
  const todayFinished = todayFixtures.filter((f) =>
    ['FT', 'AET', 'PEN'].includes(f.fixture.status.short),
  );

  const isMatchDay = todayFixtures.length > 0;

  const refetch = useCallback(() => {
    refetchLive();
    refetchToday();
  }, [refetchLive, refetchToday]);

  return {
    liveMatches,
    todayUpcoming,
    todayFinished,
    isMatchDay,
    isLoading: liveLoading || todayLoading,
    refetch,
  };
}
