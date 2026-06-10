import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { SideNav } from './SideNav';

export function Layout() {
  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop: left sidebar pinned to the edge. Mobile: BottomNav instead. */}
      <SideNav />

      {/* Content: full-width phone layout on mobile, left-aligned next to the
          sidebar on desktop. */}
      <main
        className="min-w-0 w-full max-w-lg lg:max-w-3xl mx-auto lg:mx-0 lg:pl-6 relative pb-[calc(56px_+_env(safe-area-inset-bottom))] lg:pb-10"
      >
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
