// API-Football v3 response types for World Cup 2026

// -- Common --

export interface Team {
  id: number;
  name: string;
  code: string | null;
  country: string;
  founded: number | null;
  national: boolean;
  logo: string;
}

export interface Venue {
  id: number | null;
  name: string;
  address: string | null;
  city: string;
  capacity: number | null;
  surface: string | null;
  image: string | null;
}

// -- Fixtures --

export interface FixtureStatus {
  long: string;
  short: string;
  elapsed: number | null;
  extra: number | null;
}

export interface FixtureInfo {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: {
    first: number | null;
    second: number | null;
  };
  venue: {
    id: number | null;
    name: string;
    city: string;
  };
  status: FixtureStatus;
}

export interface FixtureScore {
  halftime: { home: number | null; away: number | null };
  fulltime: { home: number | null; away: number | null };
  extratime: { home: number | null; away: number | null };
  penalty: { home: number | null; away: number | null };
}

export interface FixtureTeam {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

export interface Fixture {
  fixture: FixtureInfo;
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };
  teams: {
    home: FixtureTeam;
    away: FixtureTeam;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: FixtureScore;
  events?: FixtureEvent[];
  lineups?: Lineup[];
  statistics?: FixtureStatistic[];
  players?: FixturePlayerStats[];
}

// -- Events --

export interface FixtureEvent {
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  player: {
    id: number;
    name: string;
  };
  assist: {
    id: number | null;
    name: string | null;
  };
  type: 'Goal' | 'Card' | 'subst' | 'Var';
  detail: string;
  comments: string | null;
}

// -- Lineups --

export interface LineupPlayer {
  id: number;
  name: string;
  number: number;
  pos: string | null;
  grid: string | null;
}

export interface Lineup {
  team: {
    id: number;
    name: string;
    logo: string;
    colors: unknown;
  };
  coach: {
    id: number;
    name: string;
    photo: string;
  };
  formation: string;
  startXI: { player: LineupPlayer }[];
  substitutes: { player: LineupPlayer }[];
}

// -- Match Statistics --

export interface StatisticItem {
  type: string;
  value: number | string | null;
}

export interface FixtureStatistic {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  statistics: StatisticItem[];
}

// -- Player Stats per Match --

export interface PlayerMatchStats {
  player: {
    id: number;
    name: string;
    photo: string;
  };
  statistics: [
    {
      games: {
        minutes: number | null;
        number: number;
        position: string;
        rating: string | null;
        captain: boolean;
        substitute: boolean;
      };
      offsides: number | null;
      shots: { total: number | null; on: number | null };
      goals: {
        total: number | null;
        conceded: number | null;
        assists: number | null;
        saves: number | null;
      };
      passes: {
        total: number | null;
        key: number | null;
        accuracy: string | null;
      };
      tackles: {
        total: number | null;
        blocks: number | null;
        interceptions: number | null;
      };
      duels: { total: number | null; won: number | null };
      dribbles: {
        attempts: number | null;
        success: number | null;
        past: number | null;
      };
      fouls: { drawn: number | null; committed: number | null };
      cards: { yellow: number; red: number };
      penalty: {
        won: number | null;
        committed: number | null;
        scored: number | null;
        missed: number | null;
        saved: number | null;
      };
    },
  ];
}

export interface FixturePlayerStats {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  players: PlayerMatchStats[];
}

// -- Standings --

export interface StandingTeam {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  group: string;
  form: string | null;
  status: string;
  description: string | null;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
  };
  home: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
  };
  away: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
  };
  update: string;
}

export interface StandingsResponse {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    standings: StandingTeam[][];
  };
}

// -- Players --

export interface Player {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  birth: {
    date: string;
    place: string | null;
    country: string;
  };
  nationality: string;
  height: string | null;
  weight: string | null;
  injured: boolean;
  photo: string;
}

export interface PlayerStatistics {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
  };
  games: {
    appearences: number | null;
    lineups: number | null;
    minutes: number | null;
    number: number | null;
    position: string;
    rating: string | null;
    captain: boolean;
  };
  substitutes: { in: number; out: number; bench: number };
  shots: { total: number | null; on: number | null };
  goals: {
    total: number | null;
    conceded: number | null;
    assists: number | null;
    saves: number | null;
  };
  passes: { total: number | null; key: number | null; accuracy: number | null };
  tackles: {
    total: number | null;
    blocks: number | null;
    interceptions: number | null;
  };
  duels: { total: number | null; won: number | null };
  dribbles: {
    attempts: number | null;
    success: number | null;
    past: number | null;
  };
  fouls: { drawn: number | null; committed: number | null };
  cards: { yellow: number; yellowred: number; red: number };
  penalty: {
    won: number | null;
    committed: number | null;
    scored: number | null;
    missed: number | null;
    saved: number | null;
  };
}

export interface PlayerResponse {
  player: Player;
  statistics: PlayerStatistics[];
}

// -- Squads (/players/squads?team=) --
// Team-scoped, NOT gated by the league coverage flag, so it is populated
// before the tournament starts (unlike /players?league=1&season=2026).

export interface SquadPlayer {
  id: number;
  name: string;
  age: number;
  number: number | null;
  position: string;
  photo: string;
}

export interface SquadResponse {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  players: SquadPlayer[];
}

// -- Top Scorers / Assists / Cards --

export type TopScorerResponse = PlayerResponse;

// -- Coach --

export interface Coach {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  birth: {
    date: string;
    place: string | null;
    country: string;
  };
  nationality: string;
  height: string | null;
  weight: string | null;
  photo: string;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  career: {
    team: { id: number; name: string; logo: string };
    start: string;
    end: string | null;
  }[];
}

// -- Injuries --

export interface Injury {
  player: {
    id: number;
    name: string;
    photo: string;
    type: string;
    reason: string;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  fixture: {
    id: number;
    timezone: string;
    date: string;
    timestamp: number;
  };
  league: {
    id: number;
    season: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
  };
}

// -- Odds (/odds?fixture=) --

export interface OddValue {
  value: string;
  odd: string;
}

export interface OddsBet {
  id: number;
  name: string;
  values: OddValue[];
}

export interface OddsBookmaker {
  id: number;
  name: string;
  bets: OddsBet[];
}

export interface OddsResponse {
  league: {
    id: number;
    season: number;
  };
  fixture: {
    id: number;
  };
  update: string;
  bookmakers: OddsBookmaker[];
}

// -- Fixture status helpers --

export const LIVE_STATUSES = [
  '1H',
  '2H',
  'HT',
  'ET',
  'P',
  'BT',
  'LIVE',
] as const;
export const FINISHED_STATUSES = ['FT', 'AET', 'PEN'] as const;
export const UPCOMING_STATUSES = [
  'TBD',
  'NS',
  'SUSP',
  'INT',
  'PST',
  'CANC',
  'ABD',
  'AWD',
  'WO',
] as const;

export type LiveStatus = (typeof LIVE_STATUSES)[number];
export type FinishedStatus = (typeof FINISHED_STATUSES)[number];

export function isLive(status: string): boolean {
  return (LIVE_STATUSES as readonly string[]).includes(status);
}

export function isFinished(status: string): boolean {
  return (FINISHED_STATUSES as readonly string[]).includes(status);
}
