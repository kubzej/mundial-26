// Mock data for UI development — only used when VITE_MOCK=true
// All types match the real API-Football v3 response shapes

import type {
  Fixture,
  StandingsResponse,
  FixtureEvent,
  Lineup,
  FixtureStatistic,
  FixturePlayerStats,
  TopScorerResponse,
  Coach,
  SquadResponse,
} from './types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const logo = (code: string) =>
  `https://media.api-sports.io/football/teams/${code}.png`;

const photo = (id: number) =>
  `https://media.api-sports.io/football/players/${id}.png`;

function makeTeam(id: number, name: string, winner: boolean | null = null) {
  return { id, name, logo: logo(String(id)), winner };
}

function makeFixture(
  id: number,
  home: ReturnType<typeof makeTeam>,
  away: ReturnType<typeof makeTeam>,
  goalsHome: number | null,
  goalsAway: number | null,
  statusShort: string,
  elapsed: number | null,
  date: string,
  round: string,
  venue = 'MetLife Stadium',
  city = 'New York',
): Fixture {
  return {
    fixture: {
      id,
      referee: 'Szymon Marciniak',
      timezone: 'UTC',
      date,
      timestamp: new Date(date).getTime() / 1000,
      periods: {
        first: elapsed ? new Date(date).getTime() / 1000 : null,
        second: null,
      },
      venue: { id: 1, name: venue, city },
      status: { long: statusShort, short: statusShort, elapsed, extra: null },
    },
    league: {
      id: 1,
      name: 'FIFA World Cup',
      country: 'World',
      logo: 'https://media.api-sports.io/football/leagues/1.png',
      flag: null,
      season: 2026,
      round,
    },
    teams: { home, away },
    goals: { home: goalsHome, away: goalsAway },
    score: {
      halftime: {
        home: goalsHome !== null ? Math.floor(goalsHome / 2) : null,
        away: goalsAway !== null ? Math.floor(goalsAway / 2) : null,
      },
      fulltime: {
        home: statusShort === 'FT' ? goalsHome : null,
        away: statusShort === 'FT' ? goalsAway : null,
      },
      extratime: { home: null, away: null },
      penalty: { home: null, away: null },
    },
  };
}

// ---------------------------------------------------------------------------
// Teams
// ---------------------------------------------------------------------------

const BRA = makeTeam(6, 'Brazil');
const ARG = makeTeam(26, 'Argentina');
const FRA = makeTeam(2, 'France');
const ENG = makeTeam(10, 'England');
const GER = makeTeam(25, 'Germany');
const POR = makeTeam(38, 'Portugal');
const ESP = makeTeam(9, 'Spain');
const NET = makeTeam(1118, 'Netherlands');
const MEX = makeTeam(16, 'Mexico');
const USA = makeTeam(2087, 'USA');
const MAR = makeTeam(1017, 'Morocco');
const SEN = makeTeam(1023, 'Senegal');
const JPN = makeTeam(35, 'Japan');
const KOR = makeTeam(17, 'South Korea');
const CRO = makeTeam(3, 'Croatia');
const URU = makeTeam(31, 'Uruguay');

// ---------------------------------------------------------------------------
// Fixtures — mix of FT, LIVE, NS
// ---------------------------------------------------------------------------

const TODAY = new Date().toISOString().split('T')[0];
const todayAt = (hhmm: string) => `${TODAY}T${hhmm}:00+00:00`;
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const yAt = (hhmm: string) => `${yesterday}T${hhmm}:00+00:00`;
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const tmAt = (hhmm: string) => `${tomorrow}T${hhmm}:00+00:00`;

export const MOCK_FIXTURES: Fixture[] = [
  // Yesterday — finished
  makeFixture(
    1001,
    BRA,
    ARG,
    2,
    1,
    'FT',
    null,
    yAt('18:00'),
    'Group Stage - 1',
    'Estadio Azteca',
    'Mexico City',
  ),
  makeFixture(
    1002,
    FRA,
    ENG,
    1,
    1,
    'FT',
    null,
    yAt('21:00'),
    'Group Stage - 1',
    'SoFi Stadium',
    'Los Angeles',
  ),
  // Today — one live, two upcoming
  makeFixture(
    1003,
    GER,
    POR,
    2,
    0,
    '1H',
    34,
    todayAt('16:00'),
    'Group Stage - 1',
    'AT&T Stadium',
    'Dallas',
  ),
  makeFixture(
    1004,
    ESP,
    NET,
    null,
    null,
    'NS',
    null,
    todayAt('19:00'),
    'Group Stage - 1',
    "Levi's Stadium",
    'San Francisco',
  ),
  makeFixture(
    1005,
    MEX,
    USA,
    null,
    null,
    'NS',
    null,
    todayAt('22:00'),
    'Group Stage - 1',
    'Rose Bowl',
    'Pasadena',
  ),
  // Tomorrow
  makeFixture(
    1006,
    MAR,
    SEN,
    null,
    null,
    'NS',
    null,
    tmAt('16:00'),
    'Group Stage - 1',
    'Hard Rock Stadium',
    'Miami',
  ),
  makeFixture(
    1007,
    JPN,
    KOR,
    null,
    null,
    'NS',
    null,
    tmAt('13:00'),
    'Group Stage - 1',
    'Gillette Stadium',
    'Boston',
  ),
  // More group stage
  makeFixture(
    1008,
    CRO,
    URU,
    0,
    0,
    'FT',
    null,
    yAt('15:00'),
    'Group Stage - 1',
    'Vancouver BC Place',
    'Vancouver',
  ),
  makeFixture(
    1009,
    BRA,
    FRA,
    null,
    null,
    'NS',
    null,
    tmAt('19:00'),
    'Group Stage - 2',
    'MetLife Stadium',
    'New York',
  ),
  makeFixture(
    1010,
    ARG,
    ENG,
    null,
    null,
    'NS',
    null,
    tmAt('22:00'),
    'Group Stage - 2',
    'Mercedes-Benz Stadium',
    'Atlanta',
  ),
  // Knockout rounds (mocked as future)
  makeFixture(
    2001,
    BRA,
    { ...FRA, winner: true },
    1,
    2,
    'FT',
    null,
    yAt('20:00'),
    'Round of 32',
    'MetLife Stadium',
    'New York',
  ),
  makeFixture(
    2002,
    ARG,
    GER,
    null,
    null,
    'NS',
    null,
    tmAt('20:00'),
    'Round of 16',
    'SoFi Stadium',
    'Los Angeles',
  ),
];

// Live fixture detail (id=1003)
export const MOCK_LIVE_FIXTURE = MOCK_FIXTURES.find(
  (f) => f.fixture.id === 1003,
)!;

// ---------------------------------------------------------------------------
// Events for match 1003 (GER 2-0 POR, 34')
// ---------------------------------------------------------------------------

export const MOCK_EVENTS: FixtureEvent[] = [
  {
    time: { elapsed: 12, extra: null },
    team: { id: 25, name: 'Germany', logo: logo('25') },
    player: { id: 901, name: 'Thomas Müller' },
    assist: { id: 902, name: 'Kai Havertz' },
    type: 'Goal',
    detail: 'Normal Goal',
    comments: null,
  },
  {
    time: { elapsed: 28, extra: null },
    team: { id: 38, name: 'Portugal', logo: logo('38') },
    player: { id: 801, name: 'Ruben Neves' },
    assist: { id: null, name: null },
    type: 'Card',
    detail: 'Yellow Card',
    comments: null,
  },
  {
    time: { elapsed: 31, extra: null },
    team: { id: 25, name: 'Germany', logo: logo('25') },
    player: { id: 903, name: 'Leroy Sané' },
    assist: { id: 904, name: 'Florian Wirtz' },
    type: 'Goal',
    detail: 'Normal Goal',
    comments: null,
  },
];

// ---------------------------------------------------------------------------
// Lineups for match 1003
// ---------------------------------------------------------------------------

function makePlayer(
  id: number,
  name: string,
  number: number,
  pos: string,
  grid: string,
) {
  return { player: { id, name, number, pos, grid } };
}

export const MOCK_LINEUPS: Lineup[] = [
  {
    team: { id: 25, name: 'Germany', logo: logo('25'), colors: null },
    coach: { id: 501, name: 'Julian Nagelsmann', photo: photo(501) },
    formation: '4-2-3-1',
    startXI: [
      makePlayer(900, 'Manuel Neuer', 1, 'G', '1:1'),
      makePlayer(901, 'Benjamin Pavard', 5, 'D', '2:4'),
      makePlayer(902, 'Antonio Rüdiger', 2, 'D', '2:3'),
      makePlayer(903, 'Nico Schlotterbeck', 4, 'D', '2:2'),
      makePlayer(904, 'David Raum', 3, 'D', '2:1'),
      makePlayer(905, 'Joshua Kimmich', 6, 'M', '3:2'),
      makePlayer(906, 'Leon Goretzka', 8, 'M', '3:1'),
      makePlayer(907, 'Leroy Sané', 19, 'M', '4:3'),
      makePlayer(908, 'Florian Wirtz', 10, 'M', '4:2'),
      makePlayer(909, 'Jamal Musiala', 14, 'M', '4:1'),
      makePlayer(910, 'Thomas Müller', 13, 'F', '5:1'),
    ],
    substitutes: [
      makePlayer(
        911,
        'Marc-André ter Stegen',
        12,
        'G',
        null as unknown as string,
      ),
      makePlayer(912, 'Kai Havertz', 7, 'F', null as unknown as string),
      makePlayer(913, 'Serge Gnabry', 20, 'F', null as unknown as string),
    ],
  },
  {
    team: { id: 38, name: 'Portugal', logo: logo('38'), colors: null },
    coach: { id: 502, name: 'Roberto Martínez', photo: photo(502) },
    formation: '4-3-3',
    startXI: [
      makePlayer(800, 'Diogo Costa', 1, 'G', '1:1'),
      makePlayer(801, 'João Cancelo', 20, 'D', '2:4'),
      makePlayer(802, 'Rúben Dias', 4, 'D', '2:3'),
      makePlayer(803, 'Pepe', 3, 'D', '2:2'),
      makePlayer(804, 'Nuno Mendes', 19, 'D', '2:1'),
      makePlayer(805, 'Vitinha', 16, 'M', '3:3'),
      makePlayer(806, 'Ruben Neves', 8, 'M', '3:2'),
      makePlayer(807, 'Bruno Fernandes', 8, 'M', '3:1'),
      makePlayer(808, 'Bernardo Silva', 10, 'M', '4:3'),
      makePlayer(809, 'Rafael Leão', 11, 'F', '4:2'),
      makePlayer(810, 'Cristiano Ronaldo', 7, 'F', '4:1'),
    ],
    substitutes: [
      makePlayer(811, 'Rui Patrício', 22, 'G', null as unknown as string),
      makePlayer(812, 'João Félix', 9, 'F', null as unknown as string),
      makePlayer(813, 'Gonçalo Ramos', 23, 'F', null as unknown as string),
    ],
  },
];

// ---------------------------------------------------------------------------
// Statistics for match 1003
// ---------------------------------------------------------------------------

export const MOCK_STATISTICS: FixtureStatistic[] = [
  {
    team: { id: 25, name: 'Germany', logo: logo('25') },
    statistics: [
      { type: 'Ball Possession', value: '58%' },
      { type: 'Total Shots', value: 14 },
      { type: 'Shots on Goal', value: 7 },
      { type: 'Corner Kicks', value: 6 },
      { type: 'Fouls', value: 9 },
      { type: 'Yellow Cards', value: 0 },
      { type: 'Passes', value: 487 },
      { type: 'Pass Accuracy', value: '87%' },
    ],
  },
  {
    team: { id: 38, name: 'Portugal', logo: logo('38') },
    statistics: [
      { type: 'Ball Possession', value: '42%' },
      { type: 'Total Shots', value: 8 },
      { type: 'Shots on Goal', value: 3 },
      { type: 'Corner Kicks', value: 2 },
      { type: 'Fouls', value: 14 },
      { type: 'Yellow Cards', value: 1 },
      { type: 'Passes', value: 341 },
      { type: 'Pass Accuracy', value: '79%' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Player stats for match 1001 (BRA 2-1 ARG, finished)
// ---------------------------------------------------------------------------

function makePlayerStat(
  id: number,
  name: string,
  _teamId: number,
  _teamName: string,
  minutes: number,
  rating: string,
  goals: number | null,
  assists: number | null,
): FixturePlayerStats['players'][number] {
  return {
    player: { id, name, photo: photo(id) },
    statistics: [
      {
        games: {
          minutes,
          number: 10,
          position: 'F',
          rating,
          captain: false,
          substitute: false,
        },
        offsides: null,
        shots: { total: goals ? goals + 1 : 1, on: goals ?? 0 },
        goals: { total: goals, conceded: null, assists, saves: null },
        passes: { total: 32, key: 3, accuracy: '81%' },
        tackles: { total: 1, blocks: null, interceptions: null },
        duels: { total: 8, won: 5 },
        dribbles: { attempts: 4, success: 3, past: null },
        fouls: { drawn: 2, committed: 1 },
        cards: { yellow: 0, red: 0 },
        penalty: {
          won: null,
          committed: null,
          scored: null,
          missed: null,
          saved: null,
        },
      },
    ],
  };
}

export const MOCK_PLAYER_STATS: FixturePlayerStats[] = [
  {
    team: { id: 6, name: 'Brazil', logo: logo('6') },
    players: [
      makePlayerStat(101, 'Vinicius Jr.', 6, 'Brazil', 90, '8.8', 1, 1),
      makePlayerStat(102, 'Rodrygo', 6, 'Brazil', 90, '7.4', 1, 0),
      makePlayerStat(103, 'Casemiro', 6, 'Brazil', 90, '7.1', 0, 0),
      makePlayerStat(104, 'Marquinhos', 6, 'Brazil', 90, '7.6', 0, 0),
      makePlayerStat(105, 'Alisson', 6, 'Brazil', 90, '6.9', 0, 0),
    ],
  },
  {
    team: { id: 26, name: 'Argentina', logo: logo('26') },
    players: [
      makePlayerStat(201, 'Lionel Messi', 26, 'Argentina', 90, '9.1', 1, 0),
      makePlayerStat(202, 'Julián Álvarez', 26, 'Argentina', 90, '7.2', 0, 1),
      makePlayerStat(203, 'Rodrigo De Paul', 26, 'Argentina', 90, '7.0', 0, 0),
      makePlayerStat(
        204,
        'Lisandro Martínez',
        26,
        'Argentina',
        90,
        '6.5',
        0,
        0,
      ),
      makePlayerStat(
        205,
        'Emiliano Martínez',
        26,
        'Argentina',
        90,
        '7.8',
        0,
        0,
      ),
    ],
  },
];

// ---------------------------------------------------------------------------
// Standings (Group A–D with some data)
// ---------------------------------------------------------------------------

function makeStanding(
  rank: number,
  teamId: number,
  name: string,
  pts: number,
  played: number,
  win: number,
  draw: number,
  lose: number,
  gf: number,
  ga: number,
  group: string,
): import('./types').StandingTeam {
  return {
    rank,
    team: { id: teamId, name, logo: logo(String(teamId)) },
    points: pts,
    goalsDiff: gf - ga,
    group,
    form: win > 0 ? 'W' : draw > 0 ? 'D' : 'L',
    status: 'same',
    description: rank <= 2 ? 'Promotion - Round of 32' : null,
    all: { played, win, draw, lose, goals: { for: gf, against: ga } },
    home: {
      played: Math.ceil(played / 2),
      win: Math.ceil(win / 2),
      draw: 0,
      lose: 0,
      goals: { for: Math.ceil(gf / 2), against: 0 },
    },
    away: {
      played: Math.floor(played / 2),
      win: Math.floor(win / 2),
      draw,
      lose,
      goals: { for: Math.floor(gf / 2), against: ga },
    },
    update: new Date().toISOString(),
  };
}

export const MOCK_STANDINGS: StandingsResponse[] = [
  {
    league: {
      id: 1,
      name: 'FIFA World Cup',
      country: 'World',
      logo: 'https://media.api-sports.io/football/leagues/1.png',
      flag: null,
      season: 2026,
      standings: [
        // Group A
        [
          makeStanding(1, 6, 'Brazil', 6, 2, 2, 0, 0, 5, 1, 'Group A'),
          makeStanding(2, 26, 'Argentina', 3, 2, 1, 0, 1, 2, 2, 'Group A'),
          makeStanding(3, 3, 'Croatia', 1, 2, 0, 1, 1, 1, 2, 'Group A'),
          makeStanding(4, 31, 'Uruguay', 1, 2, 0, 1, 1, 1, 4, 'Group A'),
        ],
        // Group B
        [
          makeStanding(1, 25, 'Germany', 4, 2, 1, 1, 0, 3, 1, 'Group B'),
          makeStanding(2, 38, 'Portugal', 4, 2, 1, 1, 0, 2, 1, 'Group B'),
          makeStanding(3, 9, 'Spain', 1, 2, 0, 1, 1, 1, 2, 'Group B'),
          makeStanding(4, 1118, 'Netherlands', 1, 2, 0, 1, 1, 0, 2, 'Group B'),
        ],
        // Group C
        [
          makeStanding(1, 2, 'France', 6, 2, 2, 0, 0, 4, 1, 'Group C'),
          makeStanding(2, 10, 'England', 3, 2, 1, 0, 1, 2, 2, 'Group C'),
          makeStanding(3, 16, 'Mexico', 3, 2, 1, 0, 1, 2, 3, 'Group C'),
          makeStanding(4, 2087, 'USA', 0, 2, 0, 0, 2, 1, 3, 'Group C'),
        ],
        // Group D
        [
          makeStanding(1, 1017, 'Morocco', 4, 2, 1, 1, 0, 2, 0, 'Group D'),
          makeStanding(2, 1023, 'Senegal', 4, 2, 1, 1, 0, 3, 2, 'Group D'),
          makeStanding(3, 35, 'Japan', 1, 2, 0, 1, 1, 1, 2, 'Group D'),
          makeStanding(4, 17, 'South Korea', 1, 2, 0, 1, 1, 1, 3, 'Group D'),
        ],
        // Groups E–L (empty, realistic)
        ...[
          ['E', 101, 'Colombia', 102, 'Ecuador', 103, 'Peru', 104, 'Bolivia'],
          ['F', 111, 'Belgium', 112, 'Denmark', 113, 'Norway', 114, 'Serbia'],
          [
            'G',
            121,
            'Australia',
            122,
            'New Zealand',
            123,
            'Japan',
            124,
            'Saudi Arabia',
          ],
          ['H', 131, 'Tunisia', 132, 'Algeria', 133, 'Egypt', 134, 'Cameroon'],
          [
            'I',
            141,
            'Ukraine',
            142,
            'Poland',
            143,
            'Czech Republic',
            144,
            'Slovakia',
          ],
          ['J', 151, 'Iran', 152, 'Qatar', 153, 'Uzbekistan', 154, 'Jordan'],
          ['K', 161, 'Canada', 162, 'Panama', 163, 'Haiti', 164, 'Costa Rica'],
          ['L', 171, 'Wales', 172, 'Scotland', 173, 'Turkey', 174, 'Bosnia'],
        ].map(([letter, id1, n1, id2, n2, id3, n3, id4, n4]) => [
          makeStanding(
            1,
            id1 as number,
            n1 as string,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            `Group ${letter}`,
          ),
          makeStanding(
            2,
            id2 as number,
            n2 as string,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            `Group ${letter}`,
          ),
          makeStanding(
            3,
            id3 as number,
            n3 as string,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            `Group ${letter}`,
          ),
          makeStanding(
            4,
            id4 as number,
            n4 as string,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            `Group ${letter}`,
          ),
        ]),
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Top scorers
// ---------------------------------------------------------------------------

function makeScorer(
  id: number,
  name: string,
  teamId: number,
  teamName: string,
  goals: number,
  assists: number,
  yellow: number,
): TopScorerResponse {
  return {
    player: {
      id,
      name,
      firstname: name.split(' ')[0],
      lastname: name.split(' ').slice(1).join(' '),
      age: 28,
      birth: { date: '1997-01-01', place: null, country: '' },
      nationality: teamName,
      height: '175 cm',
      weight: '70 kg',
      injured: false,
      photo: photo(id),
    },
    statistics: [
      {
        team: { id: teamId, name: teamName, logo: logo(String(teamId)) },
        league: {
          id: 1,
          name: 'FIFA World Cup',
          country: 'World',
          logo: '',
          flag: null,
          season: 2026,
        },
        games: {
          appearences: 2,
          lineups: 2,
          minutes: 180,
          number: null,
          position: 'Forward',
          rating: '8.5',
          captain: false,
        },
        substitutes: { in: 0, out: 0, bench: 0 },
        shots: { total: goals + 2, on: goals + 1 },
        goals: { total: goals, conceded: null, assists, saves: null },
        passes: { total: 45, key: 4, accuracy: 83 },
        tackles: { total: 1, blocks: null, interceptions: null },
        duels: { total: 10, won: 6 },
        dribbles: { attempts: 5, success: 4, past: null },
        fouls: { drawn: 3, committed: 1 },
        cards: { yellow, yellowred: 0, red: 0 },
        penalty: {
          won: null,
          committed: null,
          scored: null,
          missed: null,
          saved: null,
        },
      },
    ],
  };
}

export const MOCK_TOP_SCORERS: TopScorerResponse[] = [
  makeScorer(201, 'Lionel Messi', 26, 'Argentina', 3, 2, 0),
  makeScorer(101, 'Vinicius Jr.', 6, 'Brazil', 3, 1, 1),
  makeScorer(810, 'Cristiano Ronaldo', 38, 'Portugal', 2, 0, 0),
  makeScorer(910, 'Thomas Müller', 25, 'Germany', 2, 1, 0),
  makeScorer(202, 'Julián Álvarez', 26, 'Argentina', 1, 2, 0),
  makeScorer(102, 'Rodrygo', 6, 'Brazil', 1, 1, 1),
  makeScorer(808, 'Bernardo Silva', 38, 'Portugal', 1, 0, 0),
  makeScorer(2001, 'Harry Kane', 10, 'England', 1, 1, 0),
];

export const MOCK_TOP_ASSISTS: TopScorerResponse[] =
  MOCK_TOP_SCORERS.slice().sort(
    (a, b) =>
      (b.statistics[0].goals.assists ?? 0) -
      (a.statistics[0].goals.assists ?? 0),
  );

export const MOCK_TOP_YELLOW: TopScorerResponse[] =
  MOCK_TOP_SCORERS.slice().sort(
    (a, b) =>
      (b.statistics[0].cards.yellow ?? 0) - (a.statistics[0].cards.yellow ?? 0),
  );

export const MOCK_TOP_RED: TopScorerResponse[] = [];

// ---------------------------------------------------------------------------
// Squads (/players/squads?team=)
// ---------------------------------------------------------------------------

function makeSquadPlayer(
  id: number,
  name: string,
  number: number,
  position: string,
  age: number,
): SquadResponse['players'][number] {
  return { id, name, age, number, position, photo: photo(id) };
}

function makeSquad(
  teamId: number,
  teamName: string,
  players: SquadResponse['players'],
): SquadResponse {
  return {
    team: { id: teamId, name: teamName, logo: logo(String(teamId)) },
    players,
  };
}

const GENERIC_SQUAD = (teamId: number, teamName: string): SquadResponse =>
  makeSquad(teamId, teamName, [
    makeSquadPlayer(teamId * 100 + 1, 'Goalkeeper One', 1, 'Goalkeeper', 29),
    makeSquadPlayer(teamId * 100 + 2, 'Goalkeeper Two', 12, 'Goalkeeper', 26),
    makeSquadPlayer(teamId * 100 + 3, 'Defender One', 2, 'Defender', 27),
    makeSquadPlayer(teamId * 100 + 4, 'Defender Two', 3, 'Defender', 31),
    makeSquadPlayer(teamId * 100 + 5, 'Defender Three', 4, 'Defender', 24),
    makeSquadPlayer(teamId * 100 + 6, 'Defender Four', 5, 'Defender', 28),
    makeSquadPlayer(teamId * 100 + 7, 'Midfielder One', 6, 'Midfielder', 25),
    makeSquadPlayer(teamId * 100 + 8, 'Midfielder Two', 8, 'Midfielder', 23),
    makeSquadPlayer(teamId * 100 + 9, 'Midfielder Three', 10, 'Midfielder', 30),
    makeSquadPlayer(teamId * 100 + 10, 'Forward One', 9, 'Attacker', 26),
    makeSquadPlayer(teamId * 100 + 11, 'Forward Two', 11, 'Attacker', 22),
  ]);

export const MOCK_SQUADS: Record<number, SquadResponse> = {
  6: makeSquad(6, 'Brazil', [
    makeSquadPlayer(105, 'Alisson', 1, 'Goalkeeper', 31),
    makeSquadPlayer(106, 'Ederson', 12, 'Goalkeeper', 30),
    makeSquadPlayer(104, 'Marquinhos', 4, 'Defender', 30),
    makeSquadPlayer(107, 'Éder Militão', 3, 'Defender', 26),
    makeSquadPlayer(108, 'Danilo', 2, 'Defender', 32),
    makeSquadPlayer(103, 'Casemiro', 5, 'Midfielder', 32),
    makeSquadPlayer(109, 'Bruno Guimarães', 8, 'Midfielder', 26),
    makeSquadPlayer(110, 'Lucas Paquetá', 10, 'Midfielder', 27),
    makeSquadPlayer(101, 'Vinicius Jr.', 7, 'Attacker', 24),
    makeSquadPlayer(102, 'Rodrygo', 11, 'Attacker', 23),
    makeSquadPlayer(111, 'Raphinha', 19, 'Attacker', 28),
  ]),
  26: makeSquad(26, 'Argentina', [
    makeSquadPlayer(205, 'Emiliano Martínez', 23, 'Goalkeeper', 32),
    makeSquadPlayer(206, 'Gerónimo Rulli', 12, 'Goalkeeper', 32),
    makeSquadPlayer(204, 'Lisandro Martínez', 25, 'Defender', 26),
    makeSquadPlayer(207, 'Cuti Romero', 13, 'Defender', 26),
    makeSquadPlayer(208, 'Nicolás Tagliafico', 3, 'Defender', 32),
    makeSquadPlayer(203, 'Rodrigo De Paul', 7, 'Midfielder', 30),
    makeSquadPlayer(209, 'Enzo Fernández', 24, 'Midfielder', 23),
    makeSquadPlayer(210, 'Alexis Mac Allister', 20, 'Midfielder', 26),
    makeSquadPlayer(201, 'Lionel Messi', 10, 'Attacker', 38),
    makeSquadPlayer(202, 'Julián Álvarez', 9, 'Attacker', 25),
    makeSquadPlayer(211, 'Lautaro Martínez', 22, 'Attacker', 27),
  ]),
  25: makeSquad(25, 'Germany', [
    makeSquadPlayer(900, 'Manuel Neuer', 1, 'Goalkeeper', 39),
    makeSquadPlayer(911, 'Marc-André ter Stegen', 12, 'Goalkeeper', 33),
    makeSquadPlayer(902, 'Antonio Rüdiger', 2, 'Defender', 32),
    makeSquadPlayer(903, 'Nico Schlotterbeck', 4, 'Defender', 25),
    makeSquadPlayer(904, 'David Raum', 3, 'Defender', 27),
    makeSquadPlayer(905, 'Joshua Kimmich', 6, 'Midfielder', 30),
    makeSquadPlayer(906, 'Leon Goretzka', 8, 'Midfielder', 30),
    makeSquadPlayer(908, 'Florian Wirtz', 10, 'Midfielder', 22),
    makeSquadPlayer(909, 'Jamal Musiala', 14, 'Attacker', 22),
    makeSquadPlayer(907, 'Leroy Sané', 19, 'Attacker', 29),
    makeSquadPlayer(910, 'Thomas Müller', 13, 'Attacker', 35),
  ]),
};

// ---------------------------------------------------------------------------
// Coach
// ---------------------------------------------------------------------------

export const MOCK_COACHES: Record<number, Coach[]> = {
  6: [
    {
      id: 601,
      name: 'Dorival Júnior',
      firstname: 'Dorival',
      lastname: 'Júnior',
      age: 62,
      birth: { date: '1961-06-03', place: 'Araraquara', country: 'Brazil' },
      nationality: 'Brazilian',
      height: null,
      weight: null,
      photo: photo(601),
      team: { id: 6, name: 'Brazil', logo: logo('6') },
      career: [
        {
          team: { id: 6, name: 'Brazil', logo: logo('6') },
          start: '2024-01-08',
          end: null,
        },
      ],
    },
  ],
  25: [
    {
      id: 602,
      name: 'Julian Nagelsmann',
      firstname: 'Julian',
      lastname: 'Nagelsmann',
      age: 36,
      birth: { date: '1987-07-23', place: 'Landsberg', country: 'Germany' },
      nationality: 'German',
      height: null,
      weight: null,
      photo: photo(602),
      team: { id: 25, name: 'Germany', logo: logo('25') },
      career: [
        {
          team: { id: 25, name: 'Germany', logo: logo('25') },
          start: '2023-09-22',
          end: null,
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Odds for match 1004 (ESP vs NET, upcoming)
// ---------------------------------------------------------------------------

export const MOCK_ODDS: import('./types').OddsResponse[] = [
  {
    league: { id: 1, season: 2026 },
    fixture: { id: 1004 },
    update: new Date().toISOString(),
    bookmakers: [
      {
        id: 8,
        name: 'Bet365',
        bets: [
          {
            id: 1,
            name: 'Match Winner',
            values: [
              { value: 'Home', odd: '1.85' },
              { value: 'Draw', odd: '3.40' },
              { value: 'Away', odd: '4.20' },
            ],
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Router: maps endpoint + params → mock data
// ---------------------------------------------------------------------------

export function mockFetch<T>(
  endpoint: string,
  params: Record<string, string | number>,
): T | null {
  const id = Number(params.id);
  const fixtureId = Number(params.fixture);
  const teamId = Number(params.team);

  // Fixtures — all
  if (
    endpoint === '/fixtures' &&
    !id &&
    !fixtureId &&
    !params.status &&
    !params.date &&
    !params.h2h
  ) {
    return MOCK_FIXTURES as T;
  }
  // Fixtures — by date
  if (endpoint === '/fixtures' && params.date) {
    const d = String(params.date);
    return MOCK_FIXTURES.filter((f) => f.fixture.date.startsWith(d)) as T;
  }
  // Fixtures — live
  if (endpoint === '/fixtures' && params.status) {
    return MOCK_FIXTURES.filter((f) =>
      ['1H', 'HT', '2H', 'ET', 'P', 'BT'].includes(f.fixture.status.short),
    ) as T;
  }
  // Fixture — single (embeds events/lineups/statistics/players like the real API)
  if (endpoint === '/fixtures' && id) {
    return MOCK_FIXTURES.filter((f) => f.fixture.id === id).map((f) => ({
      ...f,
      events: id === 1003 ? MOCK_EVENTS : [],
      lineups: id === 1003 ? MOCK_LINEUPS : [],
      statistics: id === 1003 ? MOCK_STATISTICS : [],
      players: id === 1001 ? MOCK_PLAYER_STATS : [],
    })) as T;
  }
  // H2H
  if (endpoint === '/fixtures/headtohead') {
    return MOCK_FIXTURES.slice(0, 5) as T;
  }
  // Rounds
  if (endpoint === '/fixtures/rounds') {
    const rounds = [...new Set(MOCK_FIXTURES.map((f) => f.league.round))];
    return rounds as T;
  }
  // Events
  if (endpoint === '/fixtures/events') {
    return MOCK_EVENTS as T;
  }
  // Lineups
  if (endpoint === '/fixtures/lineups') {
    return MOCK_LINEUPS as T;
  }
  // Statistics
  if (endpoint === '/fixtures/statistics') {
    return MOCK_STATISTICS as T;
  }
  // Player stats
  if (endpoint === '/fixtures/players') {
    return MOCK_PLAYER_STATS as T;
  }
  // Standings
  if (endpoint === '/standings') {
    return MOCK_STANDINGS as T;
  }
  // Teams
  if (endpoint === '/teams') {
    return [
      BRA,
      ARG,
      FRA,
      ENG,
      GER,
      POR,
      ESP,
      NET,
      MEX,
      USA,
      MAR,
      SEN,
      JPN,
      KOR,
      CRO,
      URU,
    ].map((t) => ({ team: t, venue: {} })) as T;
  }
  // Squad
  if (endpoint === '/players/squads') {
    const known = MOCK_SQUADS[teamId];
    const fixtureTeam = MOCK_FIXTURES.flatMap((f) => [
      f.teams.home,
      f.teams.away,
    ]).find((t) => t.id === teamId);
    return [
      known ?? GENERIC_SQUAD(teamId, fixtureTeam?.name ?? 'Team'),
    ] as T;
  }
  // Top scorers/assists/cards
  if (endpoint === '/players/topscorers') return MOCK_TOP_SCORERS as T;
  if (endpoint === '/players/topassists') return MOCK_TOP_ASSISTS as T;
  if (endpoint === '/players/topyellowcards') return MOCK_TOP_YELLOW as T;
  if (endpoint === '/players/topredcards') return MOCK_TOP_RED as T;
  // Player
  if (endpoint === '/players') {
    const scorer = MOCK_TOP_SCORERS.find((s) => s.player.id === id);
    return scorer ? ([scorer] as T) : ([] as T);
  }
  // Coach
  if (endpoint === '/coachs') {
    return (MOCK_COACHES[teamId] || []) as T;
  }
  // Odds
  if (endpoint === '/odds') {
    return MOCK_ODDS as T;
  }

  return [] as T;
}
