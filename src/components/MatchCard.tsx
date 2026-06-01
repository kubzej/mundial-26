import { useNavigate } from 'react-router-dom';
import type { Fixture } from '../api/types';
import { isLive, isFinished } from '../api/types';
import { StatusBadge } from './StatusBadge';
import { TeamLogo } from './TeamLogo';

interface MatchCardProps {
  fixture: Fixture;
  showDate?: boolean;
  compact?: boolean;
}

export function MatchCard({ fixture, compact = false }: MatchCardProps) {
  const navigate = useNavigate();
  const { teams, goals, fixture: info, league } = fixture;
  const live = isLive(info.status.short);
  const finished = isFinished(info.status.short);
  const hasScore = goals.home !== null && goals.away !== null;

  return (
    <button
      onClick={() => navigate(`/match/${info.id}`)}
      className="w-full text-left"
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        padding: compact ? '12px 14px' : '14px 16px',
        display: 'block',
      }}
    >
      {/* Round label */}
      {!compact && (
        <div
          className="text-xs font-medium mb-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {league.round}
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Home team */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <TeamLogo logo={teams.home.logo} name={teams.home.name} size="sm" />
          <span
            className="text-sm font-semibold truncate"
            style={{
              color:
                finished &&
                goals.home !== null &&
                goals.away !== null &&
                goals.home < goals.away
                  ? 'var(--color-text-muted)'
                  : 'var(--color-text)',
            }}
          >
            {teams.home.name}
          </span>
        </div>

        {/* Score / time */}
        <div className="flex flex-col items-center gap-0.5 px-2 shrink-0">
          {hasScore ? (
            <div
              className="font-score text-lg font-bold tabular-nums flex gap-2"
              style={{
                color: live ? 'var(--color-live)' : 'var(--color-text)',
              }}
            >
              <span>{goals.home}</span>
              <span style={{ color: 'var(--color-text-muted)' }}>–</span>
              <span>{goals.away}</span>
            </div>
          ) : (
            <div
              className="text-sm font-semibold"
              style={{ color: 'var(--color-upcoming)' }}
            >
              {new Date(info.date).toLocaleTimeString('cs-CZ', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Prague',
              })}
            </div>
          )}
          <StatusBadge fixture={fixture} />
        </div>

        {/* Away team */}
        <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
          <span
            className="text-sm font-semibold truncate text-right"
            style={{
              color:
                finished &&
                goals.home !== null &&
                goals.away !== null &&
                goals.away < goals.home
                  ? 'var(--color-text-muted)'
                  : 'var(--color-text)',
            }}
          >
            {teams.away.name}
          </span>
          <TeamLogo logo={teams.away.logo} name={teams.away.name} size="sm" />
        </div>
      </div>

      {/* Venue */}
      {!compact && info.venue.name && (
        <div
          className="mt-2 text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {info.venue.name}, {info.venue.city}
        </div>
      )}
    </button>
  );
}
