import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div
      className="min-h-screen max-w-lg mx-auto relative"
      style={{ paddingBottom: 'calc(56px + env(safe-area-inset-bottom))' }}
    >
      <Outlet />
      <BottomNav />
    </div>
  );
}
