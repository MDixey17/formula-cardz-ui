import { Outlet } from 'react-router-dom';
import { DesktopNav, MobileNav } from '@/components/Navigation';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-carbon-50 dark:bg-carbon-950">
      <DesktopNav />
      <MobileNav />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <footer className="border-t border-carbon-200 bg-white dark:border-carbon-800 dark:bg-carbon-900">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-carbon-400 dark:text-carbon-500 flex flex-col sm:flex-row gap-2 justify-between">
          <p>
            Formula Cardz — The checklist and 1/1 tracking platform for Formula 1
            trading card collectors.
          </p>
          <p>Not affiliated with Formula 1, Topps, or any team.</p>
        </div>
      </footer>
    </div>
  );
}
