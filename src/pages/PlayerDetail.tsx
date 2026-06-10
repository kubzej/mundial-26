import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePlayer } from '../hooks/useApi';
import { PageHeader } from '../components/PageHeader';
import { Skeleton } from '../components/Skeleton';
import { TeamLogo } from '../components/TeamLogo';

// Minimal player info callers can pass via router state, so the page renders
// immediately even before the (coverage-gated) /players stats endpoint returns.
export interface PlayerNavState {
  name?: string;
  photo?: string;
  number?: number | null;
  position?: string;
  age?: number;
  team?: { name: string; logo: string };
}

export function PlayerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const playerId = id ? parseInt(id) : undefined;
  const nav = (location.state as PlayerNavState | null) ?? undefined;

  const { data, isLoading } = usePlayer(playerId);
  const entry = data?.[0];
  const apiPlayer = entry?.player;
  const stats = entry?.statistics?.[0];

  // Prefer API data; fall back to the info passed via navigation.
  const name = apiPlayer?.name ?? nav?.name;
  const photo = apiPlayer?.photo ?? nav?.photo;
  const nationality = apiPlayer?.nationality;
  const age = apiPlayer?.age ?? nav?.age;
  const height = apiPlayer?.height ?? null;
  const position = stats?.games.position ?? nav?.position;
  const team = stats?.team ?? nav?.team;
  const hasStats = !!stats;

  // Only show the skeleton while loading with nothing to render yet.
  if (isLoading && !nav) {
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

  // Loaded but no data at all (e.g. stats not yet published) and no fallback.
  if (!isLoading && !name) {
    return (
      <div>
        <PageHeader title="Hráč" back={() => navigate(-1)} />
        <div
          className="mx-4 mt-8 py-12 text-center text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Profil hráče zatím není k dispozici
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
      <PageHeader title={name ?? 'Hráč'} back={() => navigate(-1)} />

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
            src={photo}
            alt={name}
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
              {name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {team && (
                <>
                  <TeamLogo
                    logo={team.logo}
                    name={team.name}
                    size="sm"
                    className="w-5 h-5"
                  />
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {team.name}
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              {position && <Badge label={position} />}
              {nationality && <Badge label={nationality} />}
              {age && <Badge label={`${age} let`} />}
              {height && <Badge label={height} />}
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      {!hasStats ? (
        <div
          className="mx-4 mt-3 py-8 text-center text-sm"
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            color: 'var(--color-text-muted)',
          }}
        >
          Statistiky budou dostupné po začátku turnaje
        </div>
      ) : (
        <>
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
        </>
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
