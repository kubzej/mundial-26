import type { Fixture } from '../api/types';
import { isLive, isFinished } from '../api/types';

interface StatusBadgeProps {
  fixture: Fixture;
  className?: string;
}

export function StatusBadge({ fixture, className = '' }: StatusBadgeProps) {
  const { status } = fixture.fixture;
  const short = status.short;

  if (isLive(short)) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-live-bg)] text-[var(--color-live)] ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-live)] animate-pulse inline-block" />
        {status.elapsed ? `${status.elapsed}'` : short}
      </span>
    );
  }

  if (isFinished(short)) {
    return (
      <span
        className={`text-xs font-medium text-[var(--color-finished)] ${className}`}
      >
        FT
      </span>
    );
  }

  // Upcoming
  return (
    <span
      className={`text-xs font-medium text-[var(--color-upcoming)] ${className}`}
    >
      {new Date(fixture.fixture.date).toLocaleTimeString('cs-CZ', {
        hour: '2-digit',
        minute: '2-digit',
      })}
    </span>
  );
}
