import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFixtures, useRounds } from '../hooks/useApi';
import { PageHeader } from '../components/PageHeader';
import { Skeleton } from '../components/Skeleton';
import { TeamLogo } from '../components/TeamLogo';
import { isFinished } from '../api/types';
import { ROUND_LABELS } from '../lib/tournament';
import type { Fixture } from '../api/types';

const KNOCKOUT_ROUNDS = [
  'Round of 32',
  'Round of 16',
  'Quarter-finals',
  'Semi-finals',
  'Final',
];

export function Bracket() {
  const { data: allFixtures, isLoading } = useFixtures();
  const { data: rounds } = useRounds();
  const [activeRound, setActiveRound] = useState<string>('Round of 32');

  const availableKnockoutRounds = KNOCKOUT_ROUNDS.filter(
    (r) =>
      rounds?.includes(r) ||
      (allFixtures || []).some((f) => f.league.round === r),
  );

  const fixtures = (allFixtures || []).filter(
    (f) => f.league.round === activeRound,
  );

  // If no knockout rounds available yet, show a placeholder
  const knockoutStarted = availableKnockoutRounds.length > 0;

  return (
    <div>
      <PageHeader title="Bracket" subtitle="Vyřazovací fáze" />

      {isLoading ? (
        <div className="px-4 pt-4 flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={80} rounded="var(--radius-md)" />
          ))}
        </div>
      ) : !knockoutStarted ? (
        <KnockoutPending />
      ) : (
        <div>
          {/* Round selector */}
          <div className="flex gap-2 px-4 py-3 overflow-x-auto">
            {availableKnockoutRounds.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRound(r)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background:
                    activeRound === r
                      ? 'var(--color-green)'
                      : 'var(--color-surface)',
                  color:
                    activeRound === r ? '#fff' : 'var(--color-text-secondary)',
                  boxShadow: activeRound === r ? 'none' : 'var(--shadow-card)',
                }}
              >
                {ROUND_LABELS[r] || r}
              </button>
            ))}
          </div>

          <div className="px-4 pb-6 flex flex-col gap-3">
            {fixtures.length === 0 ? (
              <div
                className="py-8 text-center text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Zápasy budou doplněny
              </div>
            ) : (
              fixtures.map((f) => (
                <BracketMatchCard key={f.fixture.id} fixture={f} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BracketMatchCard({ fixture }: { fixture: Fixture }) {
  const navigate = useNavigate();
  const { teams, goals, fixture: info } = fixture;
  const finished = isFinished(info.status.short);
  const homeWon =
    finished &&
    goals.home !== null &&
    goals.away !== null &&
    goals.home > goals.away;
  const awayWon =
    finished &&
    goals.home !== null &&
    goals.away !== null &&
    goals.away > goals.home;

  return (
    <button
      onClick={() => navigate(`/match/${info.id}`)}
      className="w-full text-left"
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}
    >
      {/* Home */}
      <div
        className="flex items-center px-4 py-3"
        style={{
          background: homeWon ? 'rgba(22, 163, 74, 0.06)' : 'transparent',
          borderBottom: '1px solid var(--color-divider)',
        }}
      >
        <TeamLogo
          logo={teams.home.logo}
          name={teams.home.name}
          size="sm"
          className="mr-3"
        />
        <span
          className="flex-1 text-sm font-semibold"
          style={{
            color: awayWon ? 'var(--color-text-muted)' : 'var(--color-text)',
          }}
        >
          {teams.home.name}
        </span>
        <span
          className="text-lg font-bold w-6 text-center font-score"
          style={{
            color: homeWon ? 'var(--color-green)' : 'var(--color-text)',
          }}
        >
          {goals.home ?? '–'}
        </span>
      </div>

      {/* Away */}
      <div
        className="flex items-center px-4 py-3"
        style={{
          background: awayWon ? 'rgba(22, 163, 74, 0.06)' : 'transparent',
        }}
      >
        <TeamLogo
          logo={teams.away.logo}
          name={teams.away.name}
          size="sm"
          className="mr-3"
        />
        <span
          className="flex-1 text-sm font-semibold"
          style={{
            color: homeWon ? 'var(--color-text-muted)' : 'var(--color-text)',
          }}
        >
          {teams.away.name}
        </span>
        <span
          className="text-lg font-bold w-6 text-center font-score"
          style={{
            color: awayWon ? 'var(--color-green)' : 'var(--color-text)',
          }}
        >
          {goals.away ?? '–'}
        </span>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-1.5"
        style={{ background: 'var(--color-surface-raised)' }}
      >
        <span
          className="text-[11px]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {info.venue.city}
        </span>
        <span
          className="text-[11px]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {new Date(info.date).toLocaleDateString('cs-CZ', {
            day: 'numeric',
            month: 'short',
          })}
          {' · '}
          {new Date(info.date).toLocaleTimeString('cs-CZ', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </button>
  );
}

function KnockoutPending() {
  return (
    <div className="px-4 pt-8 flex flex-col items-center text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--color-green-light)' }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-green)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      </div>
      <h2
        className="text-[17px] font-bold mb-1"
        style={{ color: 'var(--color-text)' }}
      >
        Vyřazovací fáze brzy
      </h2>
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Bracket se zobrazí po skončení skupinové fáze
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
        Skupinová fáze končí 27. června
      </p>
    </div>
  );
}
