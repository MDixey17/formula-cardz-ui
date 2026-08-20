import { useEffect, useRef, useState } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const options = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  const active = options.find((o) => o.value === theme) ?? options[2];
  const ActiveIcon = active.icon;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-ghost p-2"
        aria-label="Change theme"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <ActiveIcon className="h-4 w-4" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-40 rounded-xl border border-carbon-200 bg-white shadow-card-hover z-50 p-1 animate-fade-in dark:border-carbon-700 dark:bg-carbon-900"
        >
          {options.map((o) => {
            const Icon = o.icon;
            const isActive = theme === o.value;
            return (
              <button
                key={o.value}
                onClick={() => {
                  setTheme(o.value);
                  setOpen(false);
                }}
                role="menuitemradio"
                aria-checked={isActive}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-racing-50 text-racing-700 dark:bg-racing-950/50 dark:text-racing-300'
                    : 'text-carbon-700 hover:bg-carbon-100 dark:text-carbon-200 dark:hover:bg-carbon-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{o.label}</span>
                {isActive && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
