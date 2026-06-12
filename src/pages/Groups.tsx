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

// The live API labels group tables "Group Stage - Group A" while mock/older
// data uses "Group A". Extract the single-letter group id from either form;
// returns null for non-group tables (e.g. the third-place ranking).
function groupLetter(name?: string): string | null {
  const m = name?.match(/Group ([A-L])$/);
  return m ? m[1] : null;
}

export function Groups() {
  const { data, isLoading } = useStandings();
  const [activeGroup, setActiveGroup] = useState<string>('A');

  const allGroups = data?.[0]?.league?.standings || [];

  // The 12 lettered group tables, separated from any extra ranking tables.
  const groupTables = allGroups.filter((g) => groupLetter(g[0]?.group));

  const currentGroup =
    allGroups.find((g) => groupLetter(g[0]?.group) === activeGroup) || [];

  // 8 best third-placed teams advance to the Round of 32. The API exposes an
  // official, pre-sorted ranking as an extra standings table (labelled
  // "Group Stage" / "Ranking of third-placed teams"); prefer it and fall back
  // to computing one from each group's third-placed team.
  const apiThirdRanking = allGroups.find(
    (g) => !groupLetter(g[0]?.group) && g.length > 4,
  );
  const thirdPlaceTeams =
    apiThirdRanking ??
    groupTables
      .map((g) => g.find((t) => t.rank === 3) ?? g[2])
      .filter((t): t is StandingTeam => !!t)
      .sort(
        (a, b) =>
          b.points - a.points ||
          b.goalsDiff - a.goalsDiff ||
          b.all.goals.for - a.all.goals.for,
      );

  // Origin group per team (the third-place ranking table loses the group label).
  const groupByTeamId = new Map<number, string>();
  groupTables.forEach((g) =>
    g.forEach((t) => {
      const letter = groupLetter(t.group);
      if (letter) groupByTeamId.set(t.team.id, letter);
    }),
  );

  return (
    <div>
      <PageHeader title="Skupiny" subtitle="12 skupin · 48 týmů" />

      {/* Group tabs */}
      <div className="flex gap-1.5 px-4 py-3 overflow-x-auto lg:flex-wrap lg:overflow-visible">
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
        <button
          onClick={() => setActiveGroup('3')}
          className="shrink-0 px-3 h-9 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
          style={{
            background:
              activeGroup === '3'
                ? 'var(--color-green)'
                : 'var(--color-surface)',
            color: activeGroup === '3' ? '#fff' : 'var(--color-text-secondary)',
            boxShadow: activeGroup === '3' ? 'none' : 'var(--shadow-card)',
          }}
        >
          3. místa
        </button>
      </div>

      {/* Table */}
      <div className="px-4 pb-6">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={56} rounded="var(--radius-md)" />
            ))}
          </div>
        ) : activeGroup === '3' ? (
          <ThirdPlaceTable teams={thirdPlaceTeams} groupByTeamId={groupByTeamId} />
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
          <LegendItem
            color="var(--color-green)"
            label={activeGroup === '3' ? 'Postup (top 8)' : 'Postup'}
          />
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

function ThirdPlaceTable({
  teams,
  groupByTeamId,
}: {
  teams: StandingTeam[];
  groupByTeamId: Map<number, string>;
}) {
  const navigate = useNavigate();

  if (teams.length === 0) {
    return (
      <div
        className="py-8 text-center text-sm"
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          color: 'var(--color-text-muted)',
        }}
      >
        Data nejsou dostupná
      </div>
    );
  }

  return (
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
        {['+/−', 'Skóre', 'B'].map((h) => (
          <span
            key={h}
            className="w-10 text-[11px] font-semibold text-center"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {h}
          </span>
        ))}
      </div>

      {teams.map((team, idx) => {
        const advances = idx < 8;
        const isLast = idx === teams.length - 1;
        return (
          <button
            key={team.team.id}
            onClick={() => navigate(`/team/${team.team.id}`)}
            className="w-full flex items-center px-4 py-3 text-left"
            style={{
              borderBottom: isLast ? 'none' : '1px solid var(--color-divider)',
            }}
          >
            <span
              className="w-6 text-sm font-bold text-center"
              style={{
                color: advances
                  ? 'var(--color-green)'
                  : 'var(--color-text-muted)',
              }}
            >
              {idx + 1}
            </span>
            <div className="flex items-center gap-2 flex-1 min-w-0 ml-2">
              <TeamLogo logo={team.team.logo} name={team.team.name} size="sm" />
              <span
                className="text-sm font-medium truncate"
                style={{ color: 'var(--color-text)' }}
              >
                {team.team.name}
              </span>
              {groupByTeamId.get(team.team.id) && (
                <span
                  className="text-[10px] shrink-0"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Sk. {groupByTeamId.get(team.team.id)}
                </span>
              )}
            </div>
            <span
              className="w-10 text-sm text-center"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {team.all.goals.for - team.all.goals.against > 0 ? '+' : ''}
              {team.all.goals.for - team.all.goals.against}
            </span>
            <span
              className="w-10 text-sm text-center"
              style={{
                color: 'var(--color-text-secondary)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {team.all.goals.for}:{team.all.goals.against}
            </span>
            <span
              className="w-10 text-sm text-center font-bold"
              style={{ color: 'var(--color-text)' }}
            >
              {team.points}
            </span>
          </button>
        );
      })}
    </div>
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
