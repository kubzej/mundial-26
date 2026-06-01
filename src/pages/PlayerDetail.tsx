import { useParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '../hooks/useApi';
import { PageHeader } from '../components/PageHeader';
import { Skeleton } from '../components/Skeleton';
import { TeamLogo } from '../components/TeamLogo';

export function PlayerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const playerId = id ? parseInt(id) : undefined;

  const { data, isLoading } = usePlayer(playerId);
  const entry = data?.[0];
  const player = entry?.player;
  const stats = entry?.statistics?.[0];

  if (isLoading || !player) {
    return (
      <div>
        <PageHeader title="Hráč" back={() => navigate(-1)} />
        <div className="px-4 pt-4 flex flex-col gap-3">
          <Skeleton height={120} rounded="var(--radius-lg)" />
          <Skeleton height={200} rounded="var(--radius-lg)" />
        </div>
      </div>
    );
  }

  const statItems = [
    { label: 'Góly', val: stats?.goals.total ?? 0 },
    { label: 'Asistence', val: stats?.goals.assists ?? 0 },
    { label: 'Zápasy', val: stats?.games.appearences ?? 0 },
    { label: 'Minuty', val: stats?.games.minutes ?? 0 },
    { label: 'Žluté', val: stats?.cards.yellow ?? 0 },
    { label: 'Červené', val: stats?.cards.red ?? 0 },
  ];

  return (
    <div>
      <PageHeader title={player.name} back={() => navigate(-1)} />

      {/* Player header */}
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
          <img
            src={player.photo}
            alt={player.name}
            className="w-20 h-20 rounded-2xl object-cover shrink-0"
            style={{ background: 'var(--color-surface-raised)' }}
            onError={(e) => {
              e.currentTarget.style.opacity = '0.3';
            }}
          />
          <div>
            <h2
              className="text-xl font-bold"
              style={{ color: 'var(--color-text)' }}
            >
              {player.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {stats?.team && (
                <>
                  <TeamLogo
                    logo={stats.team.logo}
                    name={stats.team.name}
                    size="sm"
                    className="w-5 h-5"
                  />
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {stats.team.name}
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              {stats?.games.position && <Badge label={stats.games.position} />}
              {player.nationality && <Badge label={player.nationality} />}
              {player.age && <Badge label={`${player.age} let`} />}
              {player.height && <Badge label={player.height} />}
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mx-4 mt-3">
        <div
          className="grid grid-cols-3"
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}
        >
          {statItems.map((s, idx) => (
            <div
              key={s.label}
              className="flex flex-col items-center py-4"
              style={{
                borderRight:
                  (idx + 1) % 3 !== 0
                    ? '1px solid var(--color-divider)'
                    : 'none',
                borderBottom:
                  idx < 3 ? '1px solid var(--color-divider)' : 'none',
              }}
            >
              <span
                className="text-2xl font-bold font-score"
                style={{ color: 'var(--color-text)' }}
              >
                {s.val}
              </span>
              <span
                className="text-xs mt-0.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      {stats?.games.rating && (
        <div
          className="mx-4 mt-3 flex items-center justify-between px-4 py-3"
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <span
            className="text-sm font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            Průměrné hodnocení
          </span>
          <span
            className="text-xl font-bold font-score"
            style={{ color: 'var(--color-green)' }}
          >
            {parseFloat(stats.games.rating).toFixed(1)}
          </span>
        </div>
      )}

      <div className="h-6" />
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span
      className="text-[11px] font-medium px-2 py-0.5 rounded-full"
      style={{
        background: 'var(--color-surface-raised)',
        color: 'var(--color-text-secondary)',
      }}
    >
      {label}
    </span>
  );
}
