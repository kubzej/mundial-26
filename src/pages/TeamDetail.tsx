import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFixtures, useCoach, useSquad } from '../hooks/useApi';
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
  const { data: squads, isLoading: squadLoading } = useSquad(teamId);
  const squad = squads?.[0]?.players ?? [];

  const teamFixtures =
    allFixtures && teamId ? getTeamFixtures(allFixtures, teamId) : [];
  const teamInfo =
    teamFixtures[0]?.teams.home.id === teamId
      ? teamFixtures[0]?.teams.home
      : teamFixtures[0]?.teams.away;

  const coach = coaches?.[0];

  const POSITION_ORDER = ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];
  const POSITION_LABELS: Record<string, string> = {
    Goalkeeper: 'Brankáři',
    Defender: 'Obránci',
    Midfielder: 'Záložníci',
    Attacker: 'Útočníci',
  };
  const squadByPosition = POSITION_ORDER.map((pos) => ({
    pos,
    players: squad
      .filter((p) => p.position === pos)
      .sort((a, b) => (a.number ?? 99) - (b.number ?? 99)),
  })).filter((g) => g.players.length > 0);

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
          <>
            {squadLoading && (
              <Skeleton height={300} rounded="var(--radius-lg)" />
            )}
            {!squadLoading && squad.length === 0 && (
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
                  Soupiska zatím není k dispozici
                </div>
              </div>
            )}
            {!squadLoading && squad.length > 0 && (
              <div className="flex flex-col gap-4">
                {squadByPosition.map((group) => (
                  <div
                    key={group.pos}
                    style={{
                      background: 'var(--color-surface)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-card)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide"
                      style={{
                        background: 'var(--color-surface-raised)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {POSITION_LABELS[group.pos] ?? group.pos}
                    </div>
                    {group.players.map((player, idx) => (
                      <button
                        key={player.id}
                        onClick={() =>
                          navigate(`/player/${player.id}`, {
                            state: {
                              name: player.name,
                              photo: player.photo,
                              number: player.number,
                              position: player.position,
                              age: player.age,
                              team: teamInfo
                                ? { name: teamInfo.name, logo: teamInfo.logo }
                                : undefined,
                            },
                          })
                        }
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
                        style={{
                          borderBottom:
                            idx < group.players.length - 1
                              ? '1px solid var(--color-divider)'
                              : 'none',
                        }}
                      >
                        <span
                          className="w-6 text-xs font-bold text-center shrink-0"
                          style={{ color: 'var(--color-green)' }}
                        >
                          {player.number ?? '–'}
                        </span>
                        <img
                          src={player.photo}
                          alt={player.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                          style={{ background: 'var(--color-surface-raised)' }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {player.name}
                        </span>
                        <span
                          className="ml-auto text-xs"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {player.age} let
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
