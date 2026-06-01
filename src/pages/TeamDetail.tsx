import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFixtures, useCoach } from '../hooks/useApi';
import { PageHeader } from '../components/PageHeader';
import { Skeleton } from '../components/Skeleton';
import { TeamLogo } from '../components/TeamLogo';
import { MatchCard } from '../components/MatchCard';
import { getTeamFixtures } from '../lib/fixtures';
import { isFinished } from '../api/types';

export function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const teamId = id ? parseInt(id) : undefined;
  const [tab, setTab] = useState<'squad' | 'matches'>('matches');

  const { data: allFixtures, isLoading: fixturesLoading } = useFixtures();
  const { data: coaches } = useCoach(teamId);

  const teamFixtures =
    allFixtures && teamId ? getTeamFixtures(allFixtures, teamId) : [];
  const teamInfo =
    teamFixtures[0]?.teams.home.id === teamId
      ? teamFixtures[0]?.teams.home
      : teamFixtures[0]?.teams.away;

  const coach = coaches?.[0];

  const played = teamFixtures.filter((f) => isFinished(f.fixture.status.short));
  const upcoming = teamFixtures.filter(
    (f) => !isFinished(f.fixture.status.short),
  );

  const wins = played.filter((f) => {
    const isHome = f.teams.home.id === teamId;
    return isHome
      ? (f.goals.home ?? 0) > (f.goals.away ?? 0)
      : (f.goals.away ?? 0) > (f.goals.home ?? 0);
  }).length;
  const draws = played.filter((f) => f.goals.home === f.goals.away).length;
  const losses = played.length - wins - draws;
  const goalsScored = played.reduce((sum, f) => {
    const isHome = f.teams.home.id === teamId;
    return sum + (isHome ? (f.goals.home ?? 0) : (f.goals.away ?? 0));
  }, 0);
  const goalsConceded = played.reduce((sum, f) => {
    const isHome = f.teams.home.id === teamId;
    return sum + (isHome ? (f.goals.away ?? 0) : (f.goals.home ?? 0));
  }, 0);

  if (fixturesLoading || !teamInfo) {
    return (
      <div>
        <PageHeader title="Tým" back={() => navigate(-1)} />
        <div className="px-4 pt-4 flex flex-col gap-3">
          <Skeleton height={100} rounded="var(--radius-lg)" />
          <Skeleton height={200} rounded="var(--radius-lg)" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={teamInfo.name} back={() => navigate(-1)} />

      {/* Team header card */}
      <div
        className="mx-4 mt-4"
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          padding: '20px 16px',
        }}
      >
        <div className="flex items-center gap-4">
          <TeamLogo logo={teamInfo.logo} name={teamInfo.name} size="xl" />
          <div>
            <h2
              className="text-xl font-bold"
              style={{ color: 'var(--color-text)' }}
            >
              {teamInfo.name}
            </h2>
            {coach && (
              <div className="flex items-center gap-2 mt-1">
                <img
                  src={coach.photo}
                  alt={coach.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span
                  className="text-sm"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {coach.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        {played.length > 0 && (
          <div
            className="flex gap-0 mt-4"
            style={{
              borderTop: '1px solid var(--color-divider)',
              paddingTop: 12,
            }}
          >
            {[
              { label: 'Odehráno', val: played.length },
              { label: 'Výhry', val: wins },
              { label: 'Remízy', val: draws },
              { label: 'Prohry', val: losses },
              { label: 'Skóre', val: `${goalsScored}:${goalsConceded}` },
            ].map((s) => (
              <div key={s.label} className="flex-1 flex flex-col items-center">
                <span
                  className="text-lg font-bold font-score"
                  style={{ color: 'var(--color-text)' }}
                >
                  {s.val}
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex px-4 pt-4 mb-1">
        {(['matches', 'squad'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 text-sm font-semibold"
            style={{
              borderBottom:
                tab === t
                  ? '2px solid var(--color-green)'
                  : '2px solid transparent',
              color:
                tab === t ? 'var(--color-green)' : 'var(--color-text-muted)',
            }}
          >
            {t === 'matches' ? 'Zápasy' : 'Soupiska'}
          </button>
        ))}
      </div>

      <div className="px-4 pb-6 pt-3">
        {tab === 'matches' && (
          <div className="flex flex-col gap-4">
            {upcoming.length > 0 && (
              <div>
                <p
                  className="text-xs font-semibold mb-2 uppercase tracking-wide"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Nadcházející
                </p>
                <div className="flex flex-col gap-2">
                  {upcoming.map((f) => (
                    <MatchCard key={f.fixture.id} fixture={f} compact />
                  ))}
                </div>
              </div>
            )}
            {played.length > 0 && (
              <div>
                <p
                  className="text-xs font-semibold mb-2 uppercase tracking-wide"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Odehrané
                </p>
                <div className="flex flex-col gap-2">
                  {[...played].reverse().map((f) => (
                    <MatchCard key={f.fixture.id} fixture={f} compact />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'squad' && (
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
              padding: '12px 0',
            }}
          >
            <div
              className="px-4 py-2 text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Soupiska bude dostupná po začátku turnaje
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
