import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Home, Search, CalendarDays, LogIn, LogOut, UserCircle2, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useState } from 'react';

const navItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/one-of-one-tracker', label: '1/1 Tracker', icon: Search },
  // { to: '/collection', label: 'Collection', icon: Layers },
  { to: '/drops', label: 'Drops', icon: CalendarDays },
];

export function DesktopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 hidden md:block border-b border-carbon-200 bg-white/90 backdrop-blur-md dark:border-carbon-800 dark:bg-carbon-950/90">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Logo />
          <span className="font-display font-extrabold text-lg tracking-tight text-carbon-950 dark:text-white">
            Formula<span className="text-racing-600">Cardz</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive
                    ? 'bg-racing-50 text-racing-700 dark:bg-racing-950/50 dark:text-racing-300'
                    : 'text-carbon-600 hover:text-carbon-950 hover:bg-carbon-100 dark:text-carbon-300 dark:hover:text-white dark:hover:bg-carbon-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-carbon-700 hover:bg-carbon-100 transition dark:text-carbon-200 dark:hover:bg-carbon-800"
              >
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle2 className="h-5 w-5" />
                )}
                <span className="max-w-[140px] truncate">{user.username}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="btn-ghost px-3 py-2 text-sm"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost px-3 py-2 text-sm">
                Log In
              </Link>
              <Link to="/register" className="btn-primary px-4 py-2 text-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function MobileNav() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 border-b border-carbon-200 bg-white/90 backdrop-blur-md dark:border-carbon-800 dark:bg-carbon-950/90">
        <div className="px-4 h-14 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-display font-extrabold tracking-tight text-carbon-950 dark:text-white">
              Formula<span className="text-racing-600">Cardz</span>
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg text-carbon-700 hover:bg-carbon-100 dark:text-carbon-200 dark:hover:bg-carbon-800"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-carbon-200 bg-white px-4 py-3 space-y-1 animate-fade-in dark:border-carbon-800 dark:bg-carbon-950">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                    isActive
                      ? 'bg-racing-50 text-racing-700 dark:bg-racing-950/50 dark:text-racing-300'
                      : 'text-carbon-700 hover:bg-carbon-100 dark:text-carbon-200 dark:hover:bg-carbon-800'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-carbon-200 dark:border-carbon-800">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="btn-outline flex-1 py-2 text-sm"
                  >
                    <UserCircle2 className="h-4 w-4" /> {user.username}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      navigate('/');
                    }}
                    className="btn-ghost py-2 text-sm"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="btn-outline flex-1 py-2 text-sm"
                  >
                    <LogIn className="h-4 w-4" /> Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="btn-primary flex-1 py-2 text-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-carbon-200 bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] dark:border-carbon-800 dark:bg-carbon-950/95">
        <div className="grid grid-cols-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-semibold transition ${
                  isActive ? 'text-racing-600' : 'text-carbon-500 dark:text-carbon-400'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}

function Logo() {
  return (
    <div className="grid place-items-center h-8 w-8 rounded-lg bg-racing-600 text-white shadow-sm">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M3 12h4l2-5h6l2 5h4"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      </svg>
    </div>
  );
}
