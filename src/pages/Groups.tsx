import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStandings } from '../hooks/useApi';
import { PageHeader } from '../components/PageHeader';
import { Skeleton } from '../components/Skeleton';
import { TeamLogo } from '../components/TeamLogo';
import { getQualificationStatus } from '../lib/fixtures';
import type { StandingTeam } from '../api/types';
import { TOURNAMENT } from '../lib/tournament';

const GROUPS = TOURNAMENT.groups;

export function Groups() {
  const { data, isLoading } = useStandings();
  const [activeGroup, setActiveGroup] = useState<string>('A');

  const allGroups = data?.[0]?.league?.standings || [];

  const currentGroup =
    allGroups.find((g) => g[0]?.group === `Group ${activeGroup}`) || [];

  return (
    <div>
      <PageHeader title="Skupiny" subtitle="12 skupin · 48 týmů" />

      {/* Group tabs */}
      <div className="flex gap-1.5 px-4 py-3 overflow-x-auto">
        {GROUPS.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGroup(g)}
            className="shrink-0 w-9 h-9 rounded-xl text-sm font-bold transition-all"
            style={{
              background:
                activeGroup === g
                  ? 'var(--color-green)'
                  : 'var(--color-surface)',
              color: activeGroup === g ? '#fff' : 'var(--color-text-secondary)',
              boxShadow: activeGroup === g ? 'none' : 'var(--shadow-card)',
            }}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="px-4 pb-6">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={56} rounded="var(--radius-md)" />
            ))}
          </div>
        ) : (
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center px-4 py-2"
              style={{ background: 'var(--color-surface-raised)' }}
            >
              <span
                className="w-6 text-[11px] font-semibold text-center"
                style={{ color: 'var(--color-text-muted)' }}
              >
                #
              </span>
              <span
                className="flex-1 text-[11px] font-semibold ml-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Tým
              </span>
              {['Z', 'V', 'R', 'P', 'Skóre', 'B'].map((h) => (
                <span
                  key={h}
                  className="w-7 text-[11px] font-semibold text-center"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {currentGroup.map((team, idx) => (
              <GroupRow
                key={team.team.id}
                team={team}
                idx={idx}
                total={currentGroup.length}
              />
            ))}

            {currentGroup.length === 0 && (
              <div
                className="py-8 text-center text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Data nejsou dostupná
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="flex gap-4 mt-3 px-1">
          <LegendItem color="var(--color-green)" label="Postup" />
          <LegendItem color="#f59e0b" label="Možný postup" />
        </div>
      </div>
    </div>
  );
}

function GroupRow({
  team,
  idx,
  total,
}: {
  team: StandingTeam;
  idx: number;
  total: number;
}) {
  const navigate = useNavigate();
  const status = getQualificationStatus(team.rank);
  const isLast = idx === total - 1;

  const qualColors: Record<string, string> = {
    qualified: 'var(--color-green)',
    potential: '#f59e0b',
    eliminated: 'transparent',
  };

  return (
    <button
      onClick={() => navigate(`/team/${team.team.id}`)}
      className="w-full flex items-center px-4 py-3 transition-colors text-left"
      style={{
        borderBottom: isLast ? 'none' : '1px solid var(--color-divider)',
      }}
    >
      {/* Qualification indicator */}
      <div className="relative flex items-center">
        <div
          className="absolute left-0 w-0.5 h-full rounded-full"
          style={{
            background: qualColors[status],
            height: 24,
            opacity: status === 'eliminated' ? 0 : 1,
          }}
        />
        <span
          className="w-6 text-sm font-bold text-center ml-1"
          style={{
            color:
              status !== 'eliminated'
                ? qualColors[status]
                : 'var(--color-text-muted)',
          }}
        >
          {team.rank}
        </span>
      </div>

      {/* Team */}
      <div className="flex items-center gap-2 flex-1 min-w-0 ml-2">
        <TeamLogo logo={team.team.logo} name={team.team.name} size="sm" />
        <span
          className="text-sm font-medium truncate"
          style={{ color: 'var(--color-text)' }}
        >
          {team.team.name}
        </span>
      </div>

      {/* Stats */}
      {[
        team.all.played,
        team.all.win,
        team.all.draw,
        team.all.lose,
        `${team.all.goals.for}:${team.all.goals.against}`,
        team.points,
      ].map((val, i) => (
        <span
          key={i}
          className="w-7 text-sm text-center"
          style={{
            color:
              i === 5 ? 'var(--color-text)' : 'var(--color-text-secondary)',
            fontWeight: i === 5 ? 700 : 400,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {val}
        </span>
      ))}
    </button>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </span>
    </div>
  );
}
