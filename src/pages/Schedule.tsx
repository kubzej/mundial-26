import { useState, useRef, useEffect } from 'react';
import { useFixtures } from '../hooks/useApi';
import { MatchCard } from '../components/MatchCard';
import { PageHeader } from '../components/PageHeader';
import { MatchCardSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { groupFixturesByDate } from '../lib/fixtures';
import { shortDayName } from '../lib/format';
import { ROUND_LABELS } from '../lib/tournament';
import type { Fixture } from '../api/types';

const ROUNDS = Object.keys(ROUND_LABELS);

export function Schedule() {
  const { data: allFixtures, isLoading } = useFixtures();
  const [activeDate, setActiveDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const [activeRound, setActiveRound] = useState<string | null>(null);
  const dateScrollRef = useRef<HTMLDivElement>(null);

  const byDate = allFixtures
    ? groupFixturesByDate(allFixtures)
    : new Map<string, Fixture[]>();
  const availableDates = allFixtures
    ? Array.from(
        new Set(allFixtures.map((f) => f.fixture.date.split('T')[0])),
      ).sort()
    : [];

  useEffect(() => {
    const el = dateScrollRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [activeDate]);

  const fixturesToShow = activeRound
    ? (allFixtures || []).filter((f) => f.league.round === activeRound)
    : byDate.get(activeDate) || [];

  const groupedByRound = fixturesToShow.reduce<Record<string, Fixture[]>>(
    (acc, f) => {
      const r = f.league.round;
      acc[r] = acc[r] || [];
      acc[r].push(f);
      return acc;
    },
    {},
  );

  return (
    <div>
      <PageHeader
        title="Program"
        subtitle={`${allFixtures?.length || 0} zápasů`}
      />

      {/* Round filter */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        <Chip
          label="Podle dne"
          active={activeRound === null}
          onClick={() => setActiveRound(null)}
        />
        {ROUNDS.map((r) => (
          <Chip
            key={r}
            label={ROUND_LABELS[r]}
            active={activeRound === r}
            onClick={() => setActiveRound(r)}
          />
        ))}
      </div>

      {/* Date pills */}
      {!activeRound && (
        <div
          ref={dateScrollRef}
          className="flex gap-2 px-4 pb-3 overflow-x-auto"
        >
          {availableDates.map((d) => {
            const date = new Date(d + 'T12:00:00');
            const isActive = d === activeDate;
            const isToday = d === new Date().toISOString().split('T')[0];
            return (
              <button
                key={d}
                data-active={isActive}
                onClick={() => setActiveDate(d)}
                className="flex flex-col items-center py-2 px-3 rounded-xl shrink-0 transition-all"
                style={{
                  background: isActive
                    ? 'var(--color-green)'
                    : 'var(--color-surface)',
                  boxShadow: isActive ? 'none' : 'var(--shadow-card)',
                  minWidth: 52,
                }}
              >
                <span
                  className="text-[10px] font-medium uppercase tracking-wide"
                  style={{
                    color: isActive
                      ? 'rgba(255,255,255,0.75)'
                      : 'var(--color-text-muted)',
                  }}
                >
                  {shortDayName(d + 'T12:00:00')}
                </span>
                <span
                  className="text-[15px] font-bold leading-tight"
                  style={{ color: isActive ? '#fff' : 'var(--color-text)' }}
                >
                  {date.getDate()}
                </span>
                {isToday && !isActive && (
                  <span
                    className="w-1 h-1 rounded-full mt-0.5"
                    style={{ background: 'var(--color-green)' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Fixtures */}
      <div className="px-4 pb-6">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <MatchCardSkeleton key={i} />
            ))}
          </div>
        ) : fixturesToShow.length === 0 ? (
          <EmptyState
            title="Žádné zápasy"
            subtitle="Pro tento den nejsou naplánované žádné zápasy"
          />
        ) : (
          Object.entries(groupedByRound).map(([round, fixtures]) => (
            <div key={round} className="mb-5">
              <p
                className="text-xs font-semibold mb-2 uppercase tracking-wide"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {ROUND_LABELS[round] || round}
              </p>
              <div className="flex flex-col gap-2">
                {fixtures.map((f) => (
                  <MatchCard key={f.fixture.id} fixture={f} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
      style={{
        background: active ? 'var(--color-green)' : 'var(--color-surface)',
        color: active ? '#fff' : 'var(--color-text-secondary)',
        boxShadow: active ? 'none' : 'var(--shadow-card)',
      }}
    >
      {label}
    </button>
  );
}
