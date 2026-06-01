import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

const tabs = [
  {
    to: '/',
    label: 'Live',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    to: '/schedule',
    label: 'Program',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="3" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        {active && <rect x="7" y="14" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />}
        {active && <rect x="13" y="14" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />}
      </svg>
    ),
  },
  {
    to: '/groups',
    label: 'Skupiny',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" strokeWidth={active ? '2.2' : '1.8'} />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <circle cx="3" cy="6" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="3" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="3" cy="18" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    to: '/bracket',
    label: 'Bracket',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h5v12H4" />
        <path d="M19 9h-5" />
        <path d="M19 15h-5" />
        <line x1="9" y1="12" x2="14" y2="12" strokeWidth="2" />
        {active && <circle cx="20" cy="12" r="2" fill="currentColor" stroke="none" />}
        {!active && <circle cx="20" cy="12" r="1.5" />}
      </svg>
    ),
  },
  {
    to: '/stats',
    label: 'Statistiky',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" strokeWidth={active ? '2.5' : '1.8'} />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
]

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: 'var(--shadow-nav)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex justify-around items-center h-14 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-0.5 py-1 px-3 min-w-0 transition-colors duration-150',
                isActive ? 'text-green-600' : 'text-gray-400'
              )
            }
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-green)' : 'var(--color-text-muted)',
            })}
          >
            {({ isActive }) => (
              <>
                {tab.icon(isActive)}
                <span className="text-[10px] font-medium leading-none">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
