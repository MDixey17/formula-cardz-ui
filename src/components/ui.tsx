import type { ReactNode } from 'react';

export function Progress({
                           found,
                           total,
                           size = 'md',
                         }: {
  found: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const pct = total > 0 ? (found / total) * 100 : 0;
  const h = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  const complete = total > 0 && found === total;
  return (
      <div
          className={`w-full ${h} rounded-full bg-carbon-200 overflow-hidden`}
          role="progressbar"
          aria-valuenow={found}
          aria-valuemin={0}
          aria-valuemax={total || 0}
      >
        <div
            className={`h-full rounded-full transition-all duration-500 ${
                complete ? 'bg-emerald-500' : 'bg-racing-600'
            }`}
            style={{ width: `${pct}%` }}
        />
      </div>
  );
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
      <svg
          className={`animate-spin ${className}`}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
      >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        />
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
  );
}

export function ErrorState({
                             title = 'Something went wrong',
                             message,
                             onRetry,
                           }: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
      <div className="card p-6 text-center animate-fade-in">
        <p className="font-display text-lg font-bold text-carbon-900 dark:text-white">{title}</p>
        {message && <p className="mt-1 text-sm text-carbon-500 dark:text-carbon-400">{message}</p>}
        {onRetry && (
            <button onClick={onRetry} className="btn-outline mt-4">
              Try again
            </button>
        )}
      </div>
  );
}

export function EmptyState({
                             icon,
                             title,
                             message,
                             action,
                           }: {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
      <div className="card p-8 text-center animate-fade-in">
        {icon && <div className="mx-auto mb-3 text-carbon-400 dark:text-carbon-500">{icon}</div>}
        <p className="font-display text-lg font-bold text-carbon-900 dark:text-white">{title}</p>
        {message && <p className="mt-1 text-sm text-carbon-500 dark:text-carbon-400">{message}</p>}
        {action && <div className="mt-4">{action}</div>}
      </div>
  );
}

export function SectionTitle({
                               children,
                               className = '',
                             }: {
  children: ReactNode;
  className?: string;
}) {
  return (
      <h2 className={`font-display text-xl font-bold text-carbon-950 dark:text-white ${className}`}>
        {children}
      </h2>
  );
}
