import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useFixture,
  useFixtureEvents,
  useFixtureLineups,
  useFixtureStatistics,
  useFixturePlayerStats,
  usePrediction,
  useHeadToHead,
} from '../hooks/useApi';
import { PageHeader } from '../components/PageHeader';
import { Skeleton } from '../components/Skeleton';
import { TeamLogo } from '../components/TeamLogo';
import { isLive, isFinished } from '../api/types';
import type {
  Fixture,
  FixtureEvent,
  Lineup,
  FixtureStatistic,
  FixturePlayerStats,
} from '../api/types';
import { formatDate } from '../lib/format';

type Tab = 'events' | 'lineups' | 'stats' | 'ratings' | 'preview';

export function MatchDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fixtureId = id ? parseInt(id) : undefined;
  const [activeTab, setActiveTab] = useState<Tab>('events');

  const { data: fixtureArr, isLoading } = useFixture(fixtureId);
  const fixture = fixtureArr?.[0];

  const live = fixture ? isLive(fixture.fixture.status.short) : false;
  const finished = fixture ? isFinished(fixture.fixture.status.short) : false;
  const isPreMatch = fixture ? !live && !finished : false;

  // For pre-match fixtures the only available tab is 'preview'
  const effectiveTab: Tab = isPreMatch ? 'preview' : activeTab;

  const { data: events } = useFixtureEvents(
    finished || live ? fixtureId : undefined,
  );
  const { data: lineups } = useFixtureLineups(
    finished || live ? fixtureId : undefined,
  );
  const { data: fixtureStats } = useFixtureStatistics(
    finished || live ? fixtureId : undefined,
  );
  const { data: playerStats } = useFixturePlayerStats(
    finished ? fixtureId : undefined,
  );
  const { data: predictions } = usePrediction(
    isPreMatch ? fixtureId : undefined,
  );
  const { data: h2h } = useHeadToHead(
    isPreMatch ? fixture?.teams.home.id : undefined,
    isPreMatch ? fixture?.teams.away.id : undefined,
  );

  // Determine available tabs
  const tabs: { key: Tab; label: string }[] = isPreMatch
    ? [{ key: 'preview', label: 'Náhled' }]
    : [
        { key: 'events', label: 'Průběh' },
        { key: 'lineups', label: 'Sestavy' },
        { key: 'stats', label: 'Statistiky' },
        ...(finished ? [{ key: 'ratings' as Tab, label: 'Hodnocení' }] : []),
      ];

  if (isLoading || !fixture) {
    return (
      <div>
        <PageHeader title="Zápas" back={() => navigate(-1)} />
        <div className="px-4 pt-4 flex flex-col gap-3">
          <Skeleton height={120} rounded="var(--radius-lg)" />
          <Skeleton height={200} rounded="var(--radius-lg)" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`${fixture.teams.home.name} – ${fixture.teams.away.name}`}
        subtitle={fixture.league.round}
        back={() => navigate(-1)}
      />

      {/* Score header */}
      <MatchHeader fixture={fixture} />

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="flex gap-0 px-4 pt-4 mb-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="shrink-0 px-4 py-2 text-sm font-semibold transition-all"
              style={{
                borderBottom:
                  activeTab === t.key
                    ? '2px solid var(--color-green)'
                    : '2px solid transparent',
                color:
                  activeTab === t.key
                    ? 'var(--color-green)'
                    : 'var(--color-text-muted)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      <div className="px-4 pb-6 pt-3">
        {effectiveTab === 'events' && (
          <EventsTimeline
            events={events || fixture.events || []}
            fixture={fixture}
          />
        )}
        {effectiveTab === 'lineups' && (
          <LineupsView lineups={lineups || fixture.lineups || []} />
        )}
        {effectiveTab === 'stats' && (
          <StatsView stats={fixtureStats || fixture.statistics || []} />
        )}
        {effectiveTab === 'ratings' && (
          <RatingsView playerStats={playerStats || fixture.players || []} />
        )}
        {effectiveTab === 'preview' && (
          <PreviewView
            prediction={predictions?.[0]}
            h2h={h2h || []}
            fixture={fixture}
          />
        )}
      </div>
    </div>
  );
}

function MatchHeader({ fixture }: { fixture: Fixture }) {
  const { teams, goals, fixture: info } = fixture;
  const live = isLive(info.status.short);
  const finished = isFinished(info.status.short);

  return (
    <div
      className="mx-4 mt-4"
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        padding: '20px 16px',
      }}
    >
      <div className="flex items-center justify-between">
        {/* Home */}
        <div className="flex flex-col items-center gap-2 w-28">
          <TeamLogo logo={teams.home.logo} name={teams.home.name} size="xl" />
          <span
            className="text-sm font-semibold text-center leading-tight"
            style={{ color: 'var(--color-text)' }}
          >
            {teams.home.name}
          </span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center gap-1">
          {goals.home !== null && goals.away !== null ? (
            <div
              className="font-score text-4xl font-bold flex gap-3"
              style={{
                color: live ? 'var(--color-live)' : 'var(--color-text)',
              }}
            >
              <span>{goals.home}</span>
              <span
                style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}
              >
                –
              </span>
              <span>{goals.away}</span>
            </div>
          ) : (
            <div
              className="text-2xl font-bold"
              style={{ color: 'var(--color-upcoming)' }}
            >
              {new Date(info.date).toLocaleTimeString('cs-CZ', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Prague',
              })}
            </div>
          )}

          {live && (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span
                className="text-xs font-semibold"
                style={{ color: 'var(--color-live)' }}
              >
                {info.status.elapsed}'
              </span>
            </div>
          )}
          {finished && (
            <span
              className="text-xs font-medium"
              style={{ color: 'var(--color-text-muted)' }}
            >
              FT
            </span>
          )}
          {!live && !finished && (
            <span
              className="text-xs"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {formatDate(info.date)}
            </span>
          )}
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-2 w-28">
          <TeamLogo logo={teams.away.logo} name={teams.away.name} size="xl" />
          <span
            className="text-sm font-semibold text-center leading-tight"
            style={{ color: 'var(--color-text)' }}
          >
            {teams.away.name}
          </span>
        </div>
      </div>

      {/* Venue */}
      {info.venue.name && (
        <div
          className="mt-3 text-center text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {info.venue.name}, {info.venue.city}
        </div>
      )}
    </div>
  );
}

function EventsTimeline({
  events,
  fixture,
}: {
  events: FixtureEvent[];
  fixture: Fixture;
}) {
  if (!events.length) {
    return (
      <div
        className="py-8 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        Žádné události
      </div>
    );
  }

  const homeId = fixture.teams.home.id;

  const typeIcon = (type: string, detail: string): string => {
    if (type === 'Goal') return detail.includes('Penalty') ? '⚽ P' : '⚽';
    if (type === 'Card') return detail.includes('Yellow') ? '🟨' : '🟥';
    if (type === 'subst') return '↔';
    return '';
  };

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}
    >
      {events.map((event, idx) => {
        const isHome = event.team.id === homeId;
        const icon = typeIcon(event.type, event.detail);

        return (
          <div
            key={idx}
            className="flex items-center gap-2 px-4 py-2.5"
            style={{
              borderBottom:
                idx < events.length - 1
                  ? '1px solid var(--color-divider)'
                  : 'none',
            }}
          >
            {/* Home side */}
            {isHome ? (
              <div className="flex-1 flex items-center gap-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {event.player.name}
                  {event.assist.name && (
                    <span
                      className="text-xs ml-1"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      ({event.assist.name})
                    </span>
                  )}
                </span>
              </div>
            ) : (
              <div className="flex-1" />
            )}

            {/* Minute + icon */}
            <div className="flex flex-col items-center w-14 shrink-0">
              <span
                className="text-xs font-semibold"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {event.time.elapsed}
                {event.time.extra ? `+${event.time.extra}` : ''}'
              </span>
              <span className="text-base">{icon}</span>
            </div>

            {/* Away side */}
            {!isHome ? (
              <div className="flex-1 flex items-center justify-end gap-2">
                <span
                  className="text-sm font-medium text-right"
                  style={{ color: 'var(--color-text)' }}
                >
                  {event.player.name}
                  {event.assist.name && (
                    <span
                      className="text-xs ml-1"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      ({event.assist.name})
                    </span>
                  )}
                </span>
              </div>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function LineupsView({ lineups }: { lineups: Lineup[] }) {
  const navigate = useNavigate();
  if (!lineups.length) {
    return (
      <div
        className="py-8 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        Sestavy nejsou k dispozici
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {lineups.map((lineup) => (
        <div
          key={lineup.team.id}
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}
        >
          {/* Team header */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{
              background: 'var(--color-surface-raised)',
              borderBottom: '1px solid var(--color-divider)',
            }}
          >
            <img
              src={lineup.team.logo}
              alt={lineup.team.name}
              className="w-6 h-6 object-contain"
            />
            <span
              className="font-semibold text-sm"
              style={{ color: 'var(--color-text)' }}
            >
              {lineup.team.name}
            </span>
            <span
              className="ml-auto text-xs font-medium"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {lineup.formation}
            </span>
          </div>

          {/* Starting XI */}
          {lineup.startXI.map(({ player }, idx) => (
            <button
              key={player.id}
              onClick={() => navigate(`/player/${player.id}`)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
              style={{
                borderBottom:
                  idx < lineup.startXI.length - 1
                    ? '1px solid var(--color-divider)'
                    : 'none',
              }}
            >
              <span
                className="w-6 text-xs font-bold text-center shrink-0"
                style={{ color: 'var(--color-green)' }}
              >
                {player.number}
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                {player.name}
              </span>
              {player.pos && (
                <span
                  className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded"
                  style={{
                    background: 'var(--color-green-light)',
                    color: 'var(--color-green-dark)',
                  }}
                >
                  {player.pos}
                </span>
              )}
            </button>
          ))}
          {lineup.substitutes.length > 0 && (
            <>
              <div
                className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide"
                style={{
                  background: 'var(--color-surface-raised)',
                  color: 'var(--color-text-muted)',
                  borderTop: '1px solid var(--color-divider)',
                }}
              >
                Náhradníci
              </div>
              {lineup.substitutes.map(({ player }, idx) => (
                <button
                  key={player.id}
                  onClick={() => navigate(`/player/${player.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
                  style={{
                    borderBottom:
                      idx < lineup.substitutes.length - 1
                        ? '1px solid var(--color-divider)'
                        : 'none',
                  }}
                >
                  <span
                    className="w-6 text-xs font-bold text-center shrink-0"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {player.number}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {player.name}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function StatsView({ stats }: { stats: FixtureStatistic[] }) {
  if (stats.length < 2) {
    return (
      <div
        className="py-8 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        Statistiky nejsou k dispozici
      </div>
    );
  }

  const home = stats[0];
  const away = stats[1];
  const statKeys = home.statistics.map((s) => s.type);

  function parseVal(val: string | number | null): number {
    if (val === null) return 0;
    if (typeof val === 'number') return val;
    return parseInt(val.replace('%', '')) || 0;
  }

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        padding: '16px',
      }}
    >
      {/* Team logos */}
      <div className="flex justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <img
            src={home.team.logo}
            alt={home.team.name}
            className="w-6 h-6 object-contain"
          />
          <span
            className="text-xs font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            {home.team.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            {away.team.name}
          </span>
          <img
            src={away.team.logo}
            alt={away.team.name}
            className="w-6 h-6 object-contain"
          />
        </div>
      </div>

      {statKeys.map((statType, idx) => {
        const hStat = home.statistics.find((s) => s.type === statType);
        const aStat = away.statistics.find((s) => s.type === statType);
        const hVal = parseVal(hStat?.value ?? null);
        const aVal = parseVal(aStat?.value ?? null);
        const total = hVal + aVal;

        return (
          <div key={idx} className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span
                className="font-bold font-score"
                style={{ color: 'var(--color-text)' }}
              >
                {hStat?.value ?? 0}
              </span>
              <span
                className="text-center"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {statType}
              </span>
              <span
                className="font-bold font-score"
                style={{ color: 'var(--color-text)' }}
              >
                {aStat?.value ?? 0}
              </span>
            </div>
            {total > 0 && (
              <div
                className="flex h-1.5 rounded-full overflow-hidden"
                style={{ background: 'var(--color-surface-raised)' }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(hVal / total) * 100}%`,
                    background: 'var(--color-green)',
                  }}
                />
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(aVal / total) * 100}%`,
                    background: '#94a3b8',
                    marginLeft: 'auto',
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RatingsView({ playerStats }: { playerStats: FixturePlayerStats[] }) {
  const navigate = useNavigate();
  if (!playerStats.length) {
    return (
      <div
        className="py-8 text-center text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        Hodnocení nejsou k dispozici
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {playerStats.map((teamStats) => (
        <div
          key={teamStats.team.id}
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{
              background: 'var(--color-surface-raised)',
              borderBottom: '1px solid var(--color-divider)',
            }}
          >
            <img
              src={teamStats.team.logo}
              alt={teamStats.team.name}
              className="w-6 h-6 object-contain"
            />
            <span
              className="font-semibold text-sm"
              style={{ color: 'var(--color-text)' }}
            >
              {teamStats.team.name}
            </span>
          </div>

          {teamStats.players.map((p, idx) => {
            const rating = parseFloat(p.statistics[0]?.games.rating || '0');
            const ratingColor =
              rating >= 7.5
                ? 'var(--color-green)'
                : rating >= 6
                  ? 'var(--color-text)'
                  : '#ef4444';

            return (
              <button
                key={p.player.id}
                onClick={() => navigate(`/player/${p.player.id}`)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
                style={{
                  borderBottom:
                    idx < teamStats.players.length - 1
                      ? '1px solid var(--color-divider)'
                      : 'none',
                }}
              >
                <img
                  src={p.player.photo}
                  alt={p.player.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                  style={{ background: 'var(--color-surface-raised)' }}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-medium truncate"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {p.player.name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {p.statistics[0]?.games.minutes ?? 0} min
                    {p.statistics[0]?.goals.total
                      ? ` · ${p.statistics[0].goals.total} gól`
                      : ''}
                    {p.statistics[0]?.goals.assists
                      ? ` · ${p.statistics[0].goals.assists} as.`
                      : ''}
                  </div>
                </div>
                {rating > 0 && (
                  <span
                    className="text-sm font-bold font-score shrink-0"
                    style={{ color: ratingColor }}
                  >
                    {rating.toFixed(1)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function PreviewView({
  prediction,
  h2h,
  fixture,
}: {
  prediction: any;
  h2h: Fixture[];
  fixture: Fixture;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Prediction */}
      {prediction && (
        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            padding: '16px',
          }}
        >
          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: 'var(--color-text)' }}
          >
            Predikce
          </h3>

          <div className="flex items-center gap-2 mb-3">
            {[
              {
                label: fixture.teams.home.name,
                pct: prediction.predictions.percent.home,
              },
              { label: 'Remíza', pct: prediction.predictions.percent.draw },
              {
                label: fixture.teams.away.name,
                pct: prediction.predictions.percent.away,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex-1 flex flex-col items-center"
              >
                <span
                  className="text-lg font-bold font-score"
                  style={{ color: 'var(--color-green)' }}
                >
                  {item.pct}
                </span>
                <span
                  className="text-[10px] text-center"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Bar */}
          <div className="flex h-2 rounded-full overflow-hidden">
            <div
              style={{
                width: prediction.predictions.percent.home,
                background: 'var(--color-green)',
              }}
            />
            <div
              style={{
                width: prediction.predictions.percent.draw,
                background: '#94a3b8',
              }}
            />
            <div
              style={{
                width: prediction.predictions.percent.away,
                background: '#3b82f6',
              }}
            />
          </div>

          {prediction.predictions.advice && (
            <p
              className="mt-3 text-xs"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {prediction.predictions.advice}
            </p>
          )}
        </div>
      )}

      {/* H2H */}
      {h2h.length > 0 && (
        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}
        >
          <div
            className="px-4 py-3"
            style={{ borderBottom: '1px solid var(--color-divider)' }}
          >
            <h3
              className="text-sm font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              Vzájemné zápasy
            </h3>
          </div>
          {h2h.slice(0, 5).map((f, idx) => (
            <div
              key={f.fixture.id}
              className="flex items-center gap-2 px-4 py-2.5"
              style={{
                borderBottom:
                  idx < Math.min(h2h.length, 5) - 1
                    ? '1px solid var(--color-divider)'
                    : 'none',
              }}
            >
              <span
                className="text-xs w-16 shrink-0"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {new Date(f.fixture.date).getFullYear()}
              </span>
              <span
                className="flex-1 text-xs truncate text-right"
                style={{ color: 'var(--color-text)' }}
              >
                {f.teams.home.name}
              </span>
              <span
                className="font-score text-sm font-bold px-2"
                style={{ color: 'var(--color-text)' }}
              >
                {f.goals.home} – {f.goals.away}
              </span>
              <span
                className="flex-1 text-xs truncate"
                style={{ color: 'var(--color-text)' }}
              >
                {f.teams.away.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {!prediction && !h2h.length && (
        <div
          className="py-8 text-center text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Data nejsou k dispozici
        </div>
      )}
    </div>
  );
}
