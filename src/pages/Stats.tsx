import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useTopScorers,
  useTopAssists,
  useTopYellowCards,
  useTopRedCards,
} from '../hooks/useApi';
import { PageHeader } from '../components/PageHeader';
import { Skeleton } from '../components/Skeleton';
import { TeamLogo } from '../components/TeamLogo';
import type { TopScorerResponse } from '../api/types';

type Tab = 'goals' | 'assists' | 'yellow' | 'red';

const TABS: { key: Tab; label: string }[] = [
  { key: 'goals', label: 'Góly' },
  { key: 'assists', label: 'Asistence' },
  { key: 'yellow', label: 'Žluté karty' },
  { key: 'red', label: 'Červené karty' },
];

function useTabData(tab: Tab) {
  const goals = useTopScorers();
  const assists = useTopAssists();
  const yellow = useTopYellowCards();
  const red = useTopRedCards();

  const map = { goals, assists, yellow, red };
  const { data, isLoading } = map[tab];

  const getValue = (p: TopScorerResponse): number => {
    const s = p.statistics[0];
    if (!s) return 0;
    if (tab === 'goals') return s.goals.total || 0;
    if (tab === 'assists') return s.goals.assists || 0;
    if (tab === 'yellow') return s.cards.yellow || 0;
    if (tab === 'red') return s.cards.red || 0;
    return 0;
  };

  return { data, isLoading, getValue };
}

export function Stats() {
  const [activeTab, setActiveTab] = useState<Tab>('goals');
  const { data, isLoading, getValue } = useTabData(activeTab);

  const sorted = data
    ? [...data].sort((a, b) => getValue(b) - getValue(a)).slice(0, 20)
    : [];

  return (
    <div>
      <PageHeader title="Statistiky" />

      {/* Tabs */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background:
                activeTab === t.key
                  ? 'var(--color-green)'
                  : 'var(--color-surface)',
              color:
                activeTab === t.key ? '#fff' : 'var(--color-text-secondary)',
              boxShadow: activeTab === t.key ? 'none' : 'var(--shadow-card)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-4 pb-6">
        {isLoading ? (
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
              overflow: 'hidden',
            }}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: '1px solid var(--color-divider)' }}
              >
                <Skeleton height={16} className="w-5" />
                <Skeleton
                  height={36}
                  className="w-9 rounded-full"
                  rounded="50%"
                />
                <div className="flex-1">
                  <Skeleton height={14} className="w-32 mb-1" />
                  <Skeleton height={10} className="w-20" />
                </div>
                <Skeleton height={20} className="w-8" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div
            className="py-12 text-center text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Data budou dostupná po začátku turnaje
          </div>
        ) : (
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
              overflow: 'hidden',
            }}
          >
            {sorted.map((player, idx) => (
              <PlayerRow
                key={player.player.id}
                player={player}
                rank={idx + 1}
                value={getValue(player)}
                isLast={idx === sorted.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PlayerRow({
  player,
  rank,
  value,
  isLast,
}: {
  player: TopScorerResponse;
  rank: number;
  value: number;
  isLast: boolean;
}) {
  const navigate = useNavigate();
  const { player: info, statistics } = player;
  const team = statistics[0]?.team;

  const isTop3 = rank <= 3;
  const rankColors = ['#f59e0b', '#94a3b8', '#d97706'];

  return (
    <button
      onClick={() => navigate(`/player/${info.id}`)}
      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
      style={{
        borderBottom: isLast ? 'none' : '1px solid var(--color-divider)',
        background: isTop3 ? 'rgba(22,163,74,0.02)' : 'transparent',
      }}
    >
      {/* Rank */}
      <span
        className="w-6 text-sm font-bold text-center shrink-0"
        style={{
          color: isTop3 ? rankColors[rank - 1] : 'var(--color-text-muted)',
        }}
      >
        {rank}
      </span>

      {/* Photo */}
      <img
        src={info.photo}
        alt={info.name}
        className="w-9 h-9 rounded-full object-cover shrink-0"
        style={{ background: 'var(--color-surface-raised)' }}
        onError={(e) => {
          e.currentTarget.style.opacity = '0.3';
        }}
      />

      {/* Name + team */}
      <div className="flex-1 min-w-0">
        <div
          className="text-sm font-semibold truncate"
          style={{ color: 'var(--color-text)' }}
        >
          {info.name}
        </div>
        {team && (
          <div className="flex items-center gap-1 mt-0.5">
            <TeamLogo
              logo={team.logo}
              name={team.name}
              size="sm"
              className="w-4 h-4"
            />
            <span
              className="text-xs truncate"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {team.name}
            </span>
          </div>
        )}
      </div>

      {/* Value */}
      <span
        className="text-xl font-bold font-score shrink-0"
        style={{ color: isTop3 ? 'var(--color-green)' : 'var(--color-text)' }}
      >
        {value}
      </span>
    </button>
  );
}
