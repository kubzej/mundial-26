import { NavLink } from 'react-router-dom';
import { tabs } from './navItems';

// Desktop-only left sidebar. Hidden below lg; the mobile BottomNav takes over.
export function SideNav() {
  return (
    <aside
      className="hidden lg:flex lg:flex-col w-60 shrink-0 lg:sticky lg:top-0 lg:h-screen"
      style={{
        borderRight: '1px solid var(--color-divider)',
        background: 'var(--color-surface)',
      }}
    >
      <div className="px-6 py-6">
        <h1
          className="text-xl font-bold leading-tight"
          style={{ color: 'var(--color-text)' }}
        >
          Mundial 26
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          MS ve fotbale 2026
        </p>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
            style={({ isActive }) => ({
              background: isActive ? 'var(--color-green-light)' : 'transparent',
              color: isActive
                ? 'var(--color-green-dark)'
                : 'var(--color-text-secondary)',
              fontWeight: isActive ? 600 : 500,
            })}
          >
            {({ isActive }) => (
              <>
                {tab.icon(isActive)}
                <span className="text-sm">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
