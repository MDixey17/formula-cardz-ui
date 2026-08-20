import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import type { Drop } from '@/types';
import { EmptyState, ErrorState, Spinner } from '@/components/ui';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function DropsPage() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await api.getDrops();
        if (!active) return;
        setDrops(data);
      } catch (e) {
        if (!active) return;
        setError(e instanceof ApiError ? e.message : 'Unable to load drops.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const dropsByDay = useMemo(() => {
    const map = new Map<string, Drop[]>();
    for (const d of drops) {
      const key = d.releaseDate.slice(0, 10);
      const arr = map.get(key) ?? [];
      arr.push(d);
      map.set(key, arr);
    }
    return map;
  }, [drops]);

  const upcoming = useMemo(
    () =>
      drops
        .filter((d) => new Date(d.releaseDate) >= new Date(new Date().toDateString()))
        .sort((a, b) => +new Date(a.releaseDate) - +new Date(b.releaseDate)),
    [drops]
  );

  const monthLabel = cursor.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  const calendarDays = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const today = new Date(new Date().toDateString());
  const selectedKey = selectedDay
    ? selectedDay.toISOString().slice(0, 10)
    : null;
  const selectedDrops = selectedKey ? dropsByDay.get(selectedKey) ?? [] : [];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-10">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-racing-600">
          Release calendar
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-carbon-950 dark:text-white">
          Drops
        </h1>
        <p className="mt-1 text-sm text-carbon-500 max-w-2xl dark:text-carbon-400">
          Upcoming Formula 1 trading card releases. Browse the calendar or the
          chronological list below.
        </p>
      </header>

      {loading ? (
        <div className="card p-6 flex items-center gap-3 text-carbon-500 dark:text-carbon-400">
          <Spinner className="h-5 w-5 text-racing-600" /> Loading drops…
        </div>
      ) : error ? (
        <ErrorState title="Couldn't load drops" message={error} />
      ) : drops.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="h-8 w-8" />}
          title="No upcoming releases are currently available"
          message="Check back soon for new product drops."
        />
      ) : (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Calendar */}
          <section className="lg:col-span-3">
            <div className="card p-4 md:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold text-carbon-950 dark:text-white">
                  {monthLabel}
                </h2>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      setCursor(
                        (c) => new Date(c.getFullYear(), c.getMonth() - 1, 1)
                      )
                    }
                    className="btn-ghost p-2"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCursor(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
                    className="btn-outline px-3 py-2 text-xs"
                  >
                    Today
                  </button>
                  <button
                    onClick={() =>
                      setCursor(
                        (c) => new Date(c.getFullYear(), c.getMonth() + 1, 1)
                      )
                    }
                    className="btn-ghost p-2"
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    className="text-center text-[10px] font-bold uppercase tracking-wide text-carbon-400 py-1"
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  if (!day) return <div key={i} className="aspect-square" />;
                  const key = day.toISOString().slice(0, 10);
                  const dayDrops = dropsByDay.get(key) ?? [];
                  const hasDrops = dayDrops.length > 0;
                  const isToday = +day === +today;
                  const isSelected = selectedKey === key;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(day)}
                      className={`aspect-square rounded-lg text-sm font-medium transition relative ${
                        isSelected
                          ? 'bg-racing-600 text-white'
                          : hasDrops
                          ? 'bg-racing-50 text-racing-700 hover:bg-racing-100 dark:bg-racing-950/50 dark:text-racing-300 dark:hover:bg-racing-950'
                          : 'text-carbon-600 hover:bg-carbon-100 dark:text-carbon-300 dark:hover:bg-carbon-800'
                      } ${isToday && !isSelected ? 'ring-1 ring-racing-500' : ''}`}
                    >
                      {day.getDate()}
                      {hasDrops && (
                        <span
                          className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${
                            isSelected ? 'bg-white' : 'bg-racing-500'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedDay && (
                <div className="mt-4 pt-4 border-t border-carbon-100 animate-fade-in dark:border-carbon-800">
                  <h3 className="font-semibold text-carbon-900 text-sm mb-2 dark:text-white">
                    {selectedDay.toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </h3>
                  {selectedDrops.length === 0 ? (
                    <p className="text-sm text-carbon-400 dark:text-carbon-500">
                      No releases on this date.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {selectedDrops.map((d) => (
                        <li
                          key={d._id}
                          className="flex items-center justify-between gap-2 rounded-lg bg-carbon-50 px-3 py-2 dark:bg-carbon-950/50"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-carbon-900 truncate dark:text-white">
                              {d.productName}
                            </p>
                            {d.manufacturer && (
                              <p className="text-xs text-carbon-500 dark:text-carbon-400">
                                {d.manufacturer}
                              </p>
                            )}
                          </div>
                          {d.preorderUrl && (
                            <a
                              href={d.preorderUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-outline px-2.5 py-1 text-xs shrink-0"
                            >
                              Preorder <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Upcoming list */}
          <section className="lg:col-span-2">
            <h2 className="font-display text-lg font-bold text-carbon-950 mb-3 dark:text-white">
              Upcoming releases
            </h2>
            {upcoming.length === 0 ? (
              <EmptyState
                title="No upcoming releases"
                message="All known releases have already passed."
              />
            ) : (
              <ul className="space-y-3">
                {upcoming.map((d) => (
                  <DropListItem key={d._id} drop={d} />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function DropListItem({ drop }: { drop: Drop }) {
  const date = new Date(drop.releaseDate);
  return (
    <li className="card overflow-hidden flex animate-fade-in">
      {drop.imageUrl ? (
        <div className="w-24 shrink-0 bg-carbon-100">
          <img
            src={drop.imageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="w-24 shrink-0 bg-carbon-100 grid place-items-center text-carbon-300 dark:bg-carbon-800 dark:text-carbon-600">
          <CalendarDays className="h-6 w-6" />
        </div>
      )}
      <div className="p-3 flex-1 min-w-0 flex flex-col gap-1">
        <p className="text-xs font-semibold text-racing-600">
          {date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC'
          })}
        </p>
        <h3 className="font-display font-bold text-carbon-950 text-sm leading-snug dark:text-white">
          {drop.productName}
        </h3>
        {drop.manufacturer && (
          <p className="text-xs text-carbon-500 flex items-center gap-1 dark:text-carbon-400">
            <MapPin className="h-3 w-3" /> {drop.manufacturer}
          </p>
        )}
        {drop.description && drop.description !== 'N/A' && (
          <p className="text-xs text-carbon-600 line-clamp-2 dark:text-carbon-400">
            {drop.description}
          </p>
        )}
        {drop.preorderUrl && (
          <a
            href={drop.preorderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline mt-1 py-1.5 text-xs self-start"
          >
            Preorder <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </li>
  );
}
