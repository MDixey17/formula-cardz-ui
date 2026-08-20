import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)] grid place-items-center px-4 py-10 bg-carbon-50 dark:bg-carbon-950">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="grid place-items-center h-9 w-9 rounded-lg bg-racing-600 text-white shadow-sm">
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
          <span className="font-display font-extrabold text-lg tracking-tight text-carbon-950 dark:text-white">
            Formula<span className="text-racing-600">Cardz</span>
          </span>
        </Link>
        <div className="card p-6 md:p-7">
          <h1 className="font-display text-2xl font-extrabold text-carbon-950 dark:text-white">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-carbon-500 dark:text-carbon-400">{subtitle}</p>}
          <div className="mt-5">{children}</div>
        </div>
        {footer && <div className="mt-4 text-center text-sm">{footer}</div>}
      </div>
    </div>
  );
}
