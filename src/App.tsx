import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Live } from './pages/Live';
import { Schedule } from './pages/Schedule';
import { Groups } from './pages/Groups';
import { Bracket } from './pages/Bracket';
import { Stats } from './pages/Stats';
import { MatchDetail } from './pages/MatchDetail';
import { TeamDetail } from './pages/TeamDetail';
import { PlayerDetail } from './pages/PlayerDetail';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Live />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/bracket" element={<Bracket />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/match/:id" element={<MatchDetail />} />
            <Route path="/team/:id" element={<TeamDetail />} />
            <Route path="/player/:id" element={<PlayerDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
