import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFixture, useHeadToHead, useOdds } from '../hooks/useApi';
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
  OddsResponse,
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

  // events / lineups / statistics / players come embedded in the fixture call.
  const { data: odds } = useOdds(isPreMatch ? fixtureId : undefined);
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
        <div className="flex gap-0 px-4 pt-4 mb-1 overflow-x-auto lg:flex-wrap lg:overflow-visible">
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
          <EventsTimeline events={fixture.events || []} fixture={fixture} />
        )}
        {effectiveTab === 'lineups' && (
          <LineupsView lineups={fixture.lineups || []} />
        )}
        {effectiveTab === 'stats' && (
          <StatsView stats={fixture.statistics || []} />
        )}
        {effectiveTab === 'ratings' && (
          <RatingsView playerStats={fixture.players || []} />
        )}
        {effectiveTab === 'preview' && (
          <PreviewView odds={odds?.[0]} h2h={h2h || []} />
        )}
      </div>
    </div>
  );
}

function MatchHeader({ fixture }: { fixture: Fixture }) {
  const navigate = useNavigate();
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
        <button
          onClick={() => navigate(`/team/${teams.home.id}`)}
          className="flex flex-col items-center gap-2 w-28"
        >
          <TeamLogo logo={teams.home.logo} name={teams.home.name} size="xl" />
          <span
            className="text-sm font-semibold text-center leading-tight"
            style={{ color: 'var(--color-text)' }}
          >
            {teams.home.name}
          </span>
        </button>

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
        <button
          onClick={() => navigate(`/team/${teams.away.id}`)}
          className="flex flex-col items-center gap-2 w-28"
        >
          <TeamLogo logo={teams.away.logo} name={teams.away.name} size="xl" />
          <span
            className="text-sm font-semibold text-center leading-tight"
            style={{ color: 'var(--color-text)' }}
          >
            {teams.away.name}
          </span>
        </button>
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

  // The API marks a missed penalty as type "Goal" (detail "Missed Penalty") —
  // it is NOT a goal and must never read as one. Own goals count for the
  // opposing team. Track the running score so every real goal visibly moves it.
  let h = 0;
  let a = 0;
  const rows = events.map((event) => {
    const isOwnGoal = event.detail === 'Own Goal';
    const isMissedPen =
      event.type === 'Goal' && event.detail.includes('Missed');
    const isGoal = event.type === 'Goal' && !isMissedPen;
    // The team credited with the goal — for an own goal that's the opponent,
    // not the player's team.
    const scoringTeam = isOwnGoal
      ? event.team.id === homeId
        ? fixture.teams.away
        : fixture.teams.home
      : event.team;
    if (isGoal) {
      if (scoringTeam.id === homeId) h += 1;
      else a += 1;
    }
    return {
      event,
      isGoal,
      isOwnGoal,
      isMissedPen,
      scoringTeam,
      score: isGoal ? `${h}–${a}` : null,
    };
  });

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}
    >
      {rows.map(({ event, isGoal, isOwnGoal, isMissedPen, scoringTeam, score }, idx) => {
        const isHome = event.team.id === homeId;
        const goalLabel = isOwnGoal
          ? 'VLASTNÍ'
          : event.detail.includes('Penalty')
            ? 'GÓL · pen.'
            : 'GÓL';

        const name = (
          <span
            className={isGoal ? 'text-[15px] font-bold' : 'text-sm font-medium'}
            style={{
              color: isGoal ? 'var(--color-text)' : 'var(--color-text-secondary)',
            }}
          >
            {event.player.name}
            {event.assist.name && (
              <span
                className="text-xs ml-1 font-normal"
                style={{ color: 'var(--color-text-muted)' }}
              >
                ({event.assist.name})
              </span>
            )}
          </span>
        );

        return (
          <div
            key={idx}
            className="flex items-center gap-2 px-4 py-2.5"
            style={{
              borderBottom:
                idx < rows.length - 1
                  ? '1px solid var(--color-divider)'
                  : 'none',
              // Goals get a strong green highlight + left accent so they can
              // never be confused with a substitution at a glance.
              background: isGoal
                ? 'color-mix(in srgb, var(--color-green) 10%, transparent)'
                : 'transparent',
              borderLeft: isGoal
                ? '3px solid var(--color-green)'
                : '3px solid transparent',
            }}
          >
            {/* Home side */}
            <div className="flex-1 min-w-0">
              {isHome && name}
            </div>

            {/* Minute + event marker */}
            <div className="flex flex-col items-center shrink-0 w-[88px]">
              <span
                className="text-xs font-semibold"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {event.time.elapsed}
                {event.time.extra ? `+${event.time.extra}` : ''}'
              </span>
              <EventChip
                isGoal={isGoal}
                isOwnGoal={isOwnGoal}
                isMissedPen={isMissedPen}
                goalLabel={goalLabel}
                score={score}
                scoringTeam={scoringTeam}
                type={event.type}
                detail={event.detail}
              />
            </div>

            {/* Away side */}
            <div className="flex-1 min-w-0 flex justify-end text-right">
              {!isHome && name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EventChip({
  isGoal,
  isOwnGoal,
  isMissedPen,
  goalLabel,
  score,
  scoringTeam,
  type,
  detail,
}: {
  isGoal: boolean;
  isOwnGoal: boolean;
  isMissedPen: boolean;
  goalLabel: string;
  score: string | null;
  scoringTeam: { logo: string; name: string };
  type: string;
  detail: string;
}) {
  // Goal: loud green pill with the scoring team's flag and the score — the one
  // event the tipping game hinges on, so which team scored must be unmistakable.
  if (isGoal) {
    return (
      <span
        className="mt-0.5 flex items-center gap-1 pl-0.5 pr-2 py-0.5 rounded-full text-[11px] font-extrabold leading-none"
        style={{
          background: isOwnGoal ? '#f59e0b' : 'var(--color-green)',
          color: '#fff',
        }}
      >
        <TeamLogo
          logo={scoringTeam.logo}
          name={scoringTeam.name}
          size="sm"
          className="!w-4 !h-4 rounded-full"
        />
        <span>{goalLabel}</span>
        {score && <span className="opacity-90">{score}</span>}
      </span>
    );
  }

  // Missed penalty is type "Goal" in the data — render it as an explicit miss.
  if (isMissedPen) {
    return (
      <span
        className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold leading-none"
        style={{ color: 'var(--color-text-muted)' }}
      >
        ✗ neproměněná pen.
      </span>
    );
  }

  if (type === 'Card') {
    return (
      <span className="mt-0.5 text-sm leading-none">
        {detail.includes('Yellow') ? '🟨' : '🟥'}
      </span>
    );
  }

  // Substitution — deliberately quiet so it stays clearly secondary to goals.
  if (type === 'subst') {
    return (
      <span
        className="mt-0.5 flex items-center gap-0.5 text-[10px] font-medium leading-none"
        style={{ color: 'var(--color-text-muted)' }}
      >
        ↔ stříd.
      </span>
    );
  }

  return null;
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
              onClick={() =>
                navigate(`/player/${player.id}`, {
                  state: {
                    name: player.name,
                    number: player.number,
                    position: player.pos ?? undefined,
                    team: { name: lineup.team.name, logo: lineup.team.logo },
                  },
                })
              }
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
                  onClick={() =>
                    navigate(`/player/${player.id}`, {
                      state: {
                        name: player.name,
                        number: player.number,
                        position: player.pos ?? undefined,
                        team: { name: lineup.team.name, logo: lineup.team.logo },
                      },
                    })
                  }
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
                onClick={() =>
                  navigate(`/player/${p.player.id}`, {
                    state: {
                      name: p.player.name,
                      photo: p.player.photo,
                      position: p.statistics[0]?.games.position,
                      team: {
                        name: teamStats.team.name,
                        logo: teamStats.team.logo,
                      },
                    },
                  })
                }
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
  odds,
  h2h,
}: {
  odds?: OddsResponse;
  h2h: Fixture[];
}) {
  const matchWinnerOdds = odds?.bookmakers?.[0]?.bets.find(
    (b) => b.name === 'Match Winner',
  )?.values;

  return (
    <div className="flex flex-col gap-4">
      {/* Odds (1X2) */}
      {matchWinnerOdds && matchWinnerOdds.length >= 3 && (
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
            Kurzy
          </h3>
          <div className="flex gap-2">
            {[
              { label: '1', odd: matchWinnerOdds.find((v) => v.value === 'Home')?.odd },
              { label: 'X', odd: matchWinnerOdds.find((v) => v.value === 'Draw')?.odd },
              { label: '2', odd: matchWinnerOdds.find((v) => v.value === 'Away')?.odd },
            ].map((o) => (
              <div
                key={o.label}
                className="flex-1 flex flex-col items-center py-2 rounded-xl"
                style={{ background: 'var(--color-surface-raised)' }}
              >
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {o.label}
                </span>
                <span
                  className="text-lg font-bold font-score"
                  style={{ color: 'var(--color-text)' }}
                >
                  {o.odd ?? '–'}
                </span>
              </div>
            ))}
          </div>
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

      {!matchWinnerOdds && !h2h.length && (
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
