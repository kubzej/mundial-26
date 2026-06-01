import { useNavigate } from 'react-router-dom';
import { useLiveState } from '../hooks/useLiveState';
import { useFixturesByDate } from '../hooks/useApi';
import { MatchCard } from '../components/MatchCard';
import { SectionHeader } from '../components/SectionHeader';
import { MatchCardSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';

function YesterdayResults() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split('T')[0];
  const { data, isLoading } = useFixturesByDate(yStr);
  if (isLoading || !data?.length) return null;
  return (
    <section className="px-4">
      <SectionHeader title="Včerejší výsledky" />
      <div className="flex flex-col gap-2">
        {data.map((f) => (
          <MatchCard key={f.fixture.id} fixture={f} />
        ))}
      </div>
    </section>
  );
}

export function Live() {
  const navigate = useNavigate();
  const {
    liveMatches,
    todayUpcoming,
    todayFinished,
    isMatchDay,
    isLoading,
    isFetching,
    refetch,
  } = useLiveState();

  if (isLoading) {
    return (
      <div>
        <LiveHeader />
        <div className="px-4 pt-4 flex flex-col gap-2">
          <MatchCardSkeleton />
          <MatchCardSkeleton />
          <MatchCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div>
      <LiveHeader onRefresh={refetch} isFetching={isFetching} />
      <div className="pt-4 pb-6 flex flex-col gap-6">
        {liveMatches.length > 0 && (
          <section className="px-4">
            <SectionHeader title="Právě hraje" />
            <div className="flex flex-col gap-2">
              {liveMatches.map((f) => (
                <MatchCard key={f.fixture.id} fixture={f} />
              ))}
            </div>
          </section>
        )}

        {todayUpcoming.length > 0 && (
          <section className="px-4">
            <SectionHeader
              title="Dnes hraje"
              action={{ label: 'Vše', onClick: () => navigate('/schedule') }}
            />
            <div className="flex flex-col gap-2">
              {todayUpcoming.map((f) => (
                <MatchCard key={f.fixture.id} fixture={f} />
              ))}
            </div>
          </section>
        )}

        {todayFinished.length > 0 && (
          <section className="px-4">
            <SectionHeader title="Výsledky dneška" />
            <div className="flex flex-col gap-2">
              {todayFinished.map((f) => (
                <MatchCard key={f.fixture.id} fixture={f} />
              ))}
            </div>
          </section>
        )}

        {!isMatchDay && liveMatches.length === 0 && (
          <>
            <EmptyState
              title="Dnes se nehraje"
              subtitle="Zobraz program pro přehled dalších zápasů"
            />
            <YesterdayResults />
          </>
        )}
      </div>
    </div>
  );
}

function LiveHeader({
  onRefresh,
  isFetching,
}: {
  onRefresh?: () => void;
  isFetching?: boolean;
}) {
  return (
    <div
      className="sticky top-0 z-10 flex items-center justify-between px-4 h-14"
      style={{
        background: 'rgba(245,245,247,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div>
        <h1
          className="text-[17px] font-bold leading-tight"
          style={{ color: 'var(--color-text)' }}
        >
          Mundial 26
        </h1>
        <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
          {new Date().toLocaleDateString('cs-CZ', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </div>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="p-2 rounded-full"
          style={{
            background: 'var(--color-surface)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-green)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={
              isFetching
                ? { animation: 'spin 0.8s linear infinite' }
                : undefined
            }
          >
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>
      )}
    </div>
  );
}
