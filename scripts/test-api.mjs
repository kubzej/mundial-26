// Quick API test script - run with: node --env-file=.env scripts/test-api.mjs

const API_KEY = process.env.VITE_API_FOOTBALL_KEY;
const BASE = 'https://v3.football.api-sports.io';

if (!API_KEY) {
  console.error('❌ Missing VITE_API_FOOTBALL_KEY in .env');
  process.exit(1);
}

async function test(endpoint, params = {}) {
  const url = new URL(endpoint, BASE);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  console.log(`\n→ GET ${url.pathname}${url.search}`);
  const res = await fetch(url, { headers: { 'x-apisports-key': API_KEY } });

  if (!res.ok) {
    console.error(`  ❌ ${res.status} ${res.statusText}`);
    return null;
  }

  const data = await res.json();
  console.log(`  ✅ ${data.results} results`);

  // Show remaining requests
  const remaining = res.headers.get('x-ratelimit-requests-remaining');
  if (remaining) console.log(`  📊 Remaining requests today: ${remaining}`);

  return data;
}

console.log('🏆 Mundial 26 - API Test\n' + '='.repeat(40));

// Test 1: Check league coverage
const leagues = await test('/leagues', { id: '1', season: '2026' });
if (leagues?.response?.[0]) {
  const coverage = leagues.response[0].seasons?.[0]?.coverage;
  console.log('  Coverage:', JSON.stringify(coverage, null, 2).slice(0, 200));
}

// Test 2: Get fixtures count
const fixtures = await test('/fixtures', { league: '1', season: '2026' });
if (fixtures?.response) {
  console.log(`  📅 Total matches loaded: ${fixtures.response.length}`);
  const first = fixtures.response[0];
  if (first) {
    console.log(
      `  First match: ${first.teams.home.name} vs ${first.teams.away.name} (${first.fixture.date})`,
    );
  }
}

// Test 3: Teams
const teams = await test('/teams', { league: '1', season: '2026' });
if (teams?.response) {
  console.log(
    `  🏳️ Teams: ${teams.response.map((t) => t.team.code).join(', ')}`,
  );
}

// Test 4: Standings
const standings = await test('/standings', { league: '1', season: '2026' });
if (standings?.response?.[0]) {
  const groups = standings.response[0].league.standings;
  console.log(`  📊 Groups loaded: ${groups.length}`);
}

// Test 5: Rounds
const rounds = await test('/fixtures/rounds', { league: '1', season: '2026' });
if (rounds?.response) {
  console.log(`  🔄 Rounds: ${rounds.response.join(', ')}`);
}

console.log('\n' + '='.repeat(40));
console.log('✅ Test complete - used 5 API calls');
