const API_BASE = 'https://v3.football.api-sports.io';
const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY || '';

const LEAGUE_ID = 1;
const SEASON = 2026;

interface ApiResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: unknown[];
  results: number;
  paging: { current: number; total: number };
  response: T;
}

async function fetchApi<T>(
  endpoint: string,
  params: Record<string, string | number> = {},
): Promise<T> {
  const url = new URL(endpoint, API_BASE);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const res = await fetch(url.toString(), {
    headers: {
      'x-apisports-key': API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const data: ApiResponse<T> = await res.json();

  if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
    throw new Error(`API errors: ${JSON.stringify(data.errors)}`);
  }

  return data.response;
}

export { fetchApi, LEAGUE_ID, SEASON };
export type { ApiResponse };
