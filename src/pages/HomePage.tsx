import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  CalendarDays,
  Layers,
  Gauge,
  ExternalLink,
} from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useSets } from '@/lib/use-sets';
import { setProgress } from '@/lib/tracker';
import type { Drop, OneOfOneCard } from '@/types';
import { EmptyState, ErrorState, Progress, Spinner } from '@/components/ui';

export function HomePage() {
  const { sets, loading: setsLoading } = useSets();
  const [newestCards, setNewestCards] = useState<OneOfOneCard[]>([]);
  const [newestLoading, setNewestLoading] = useState(false);
  const [newestError, setNewestError] = useState<string | null>(null);

  const [drops, setDrops] = useState<Drop[]>([]);
  const [dropsLoading, setDropsLoading] = useState(true);
  const [dropsError, setDropsError] = useState<string | null>(null);

  const newestSet = sets[0]?.value;

  useEffect(() => {
    if (!newestSet) return;
    let active = true;
    setNewestLoading(true);
    setNewestError(null);
    (async () => {
      try {
        const data = await api.getOneOfOnes(newestSet);
        if (active) setNewestCards(data);
      } catch (e) {
        if (!active) return;
        setNewestError(
            e instanceof ApiError ? e.message : 'Unable to load newest set.'
        );
      } finally {
        if (active) setNewestLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [newestSet]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await api.getDrops();
        if (!active) return;
        setDrops(data);
      } catch (e) {
        if (!active) return;
        setDropsError(
            e instanceof ApiError ? e.message : 'Unable to load drops.'
        );
      } finally {
        if (active) setDropsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const upcomingDrops = useMemo(() => {
    const now = new Date();
    return drops
        .filter((d) => new Date(d.releaseDate) >= now)
        .sort((a, b) => +new Date(a.releaseDate) - +new Date(b.releaseDate))
        .slice(0, 3);
  }, [drops]);

  const setStats = useMemo(() => setProgress(newestCards), [newestCards]);
  const totalCards = newestCards.length;

  return (
      <div>
        {/* Hero */}
        <section className="relative overflow-hidden bg-carbon-950 text-white">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-racing-600/30 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-redline-600/20 blur-3xl" />
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                      'repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 40px)',
                }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 md:px-6 py-14 md:py-24">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-racing-200">
              <span className="h-1.5 w-1.5 rounded-full bg-redline-500" />
              Formula 1 Trading Card Collectors
            </p>
            <h1 className="mt-4 font-display text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl">
              Track your collection and keep up with every 1/1.
            </h1>
            <p className="mt-4 text-base md:text-lg text-carbon-300 max-w-2xl">
              Formula Cardz is the checklist and tracking platform for Formula 1
              trading cards. See which 1/1 parallels exist, which have been found,
              and how complete your collection is — across every set.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                  to="/one-of-one-tracker"
                  className="btn-primary px-5 py-3 text-base"
              >
                <Search className="h-5 w-5" />
                Open 1/1 Tracker
              </Link>
              {/*<Link*/}
              {/*    to="/collection"*/}
              {/*    className="btn px-5 py-3 text-base bg-white/10 text-white hover:bg-white/20"*/}
              {/*>*/}
              {/*  <Layers className="h-5 w-5" />*/}
              {/*  My Collection*/}
              {/*</Link>*/}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 space-y-12">
          {/* Tracker highlight */}
          <section>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  icon: Search,
                  title: 'Search by driver or card',
                  body: 'Find any card fast with tolerant driver search and card-number lookup.',
                },
                {
                  icon: Gauge,
                  title: 'Live 1/1 progress',
                  body: 'See found vs. missing 1/1 parallels per card, per driver, and across the set.',
                },
                {
                  icon: Layers,
                  title: 'Every set, automatically',
                  body: 'New card sets appear as soon as the backend adds them — no app update required.',
                },
              ].map((f) => (
                  <div key={f.title} className="card p-5">
                    <div className="grid place-items-center h-10 w-10 rounded-xl bg-racing-50 text-racing-600 mb-3">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display font-bold text-carbon-950 dark:text-white">
                      {f.title}
                    </h3>
                    <p className="text-sm text-carbon-500 mt-1 dark:text-carbon-400">{f.body}</p>
                  </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                  to="/one-of-one-tracker"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-racing-600 hover:text-racing-700"
              >
                Explore the Tracker <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Newest set */}
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-racing-600">
                  Newest set
                </p>
                <h2 className="font-display text-2xl font-bold text-carbon-950 dark:text-white">
                  {setsLoading ? 'Loading…' : newestSet ?? 'No sets available'}
                </h2>
              </div>
              {newestSet && (
                  <Link
                      to={`/one-of-one-tracker?set=${encodeURIComponent(newestSet)}`}
                      className="btn-outline px-3 py-2 text-sm"
                  >
                    Open in Tracker <ArrowRight className="h-4 w-4" />
                  </Link>
              )}
            </div>

            {newestLoading ? (
                <div className="card p-6 flex items-center gap-3 text-carbon-500 dark:text-carbon-400">
                  <Spinner className="h-5 w-5 text-racing-600" /> Loading set data…
                </div>
            ) : newestError ? (
                <ErrorState
                    title="Couldn't load the newest set"
                    message={newestError}
                />
            ) : newestCards.length === 0 ? (
                <EmptyState
                    title="No data for the newest set yet"
                    message="Check back once 1/1 data is published."
                />
            ) : (
                <div className="card p-5 md:p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Stat label="Cards" value={totalCards} />
                    <Stat
                        label="1/1s found"
                        value={setStats.found}
                        accent="emerald"
                    />
                    <Stat
                        label="1/1s remaining"
                        value={setStats.total - setStats.found}
                        accent="red"
                    />
                    <Stat
                        label="Total 1/1s"
                        value={setStats.total}
                    />
                  </div>
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-carbon-500">
                    Overall 1/1 progress
                  </span>
                      <span className="font-mono font-bold text-carbon-900 tabular-nums dark:text-white">
                    {setStats.found} / {setStats.total}
                  </span>
                    </div>
                    <Progress
                        found={setStats.found}
                        total={setStats.total}
                        size="lg"
                    />
                  </div>
                </div>
            )}
          </section>

          {/* Upcoming drops preview */}
          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-racing-600">
                  Upcoming releases
                </p>
                <h2 className="font-display text-2xl font-bold text-carbon-950 dark:text-white">
                  Drops
                </h2>
              </div>
              <Link
                  to="/drops"
                  className="btn-outline px-3 py-2 text-sm"
              >
                View all drops <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {dropsLoading ? (
                <div className="card p-6 flex items-center gap-3 text-carbon-500 dark:text-carbon-400">
                  <Spinner className="h-5 w-5 text-racing-600" /> Loading drops…
                </div>
            ) : dropsError ? (
                <ErrorState title="Couldn't load drops" message={dropsError} />
            ) : upcomingDrops.length === 0 ? (
                <EmptyState
                    icon={<CalendarDays className="h-8 w-8" />}
                    title="No upcoming releases right now"
                    message="Check back soon for new product drops."
                />
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingDrops.map((d) => (
                      <DropPreviewCard key={d._id} drop={d} />
                  ))}
                </div>
            )}
          </section>
        </div>
      </div>
  );
}

function Stat({
                label,
                value,
                accent,
              }: {
  label: string;
  value: number;
  accent?: 'emerald' | 'red';
}) {
  const color =
      accent === 'emerald'
          ? 'text-emerald-700'
          : accent === 'red'
              ? 'text-redline-600'
              : 'text-carbon-950 dark:text-white';
  return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-carbon-400">
          {label}
        </p>
        <p className={`mt-1 font-mono font-bold text-2xl tabular-nums ${color}`}>
          {value}
        </p>
      </div>
  );
}

function DropPreviewCard({ drop }: { drop: Drop }) {
  const date = new Date(drop.releaseDate);
  return (
      <article className="card overflow-hidden flex flex-col animate-fade-in hover:shadow-card-hover transition-shadow">
        {drop.imageUrl ? (
            <div className="aspect-[16/9] bg-carbon-100 overflow-hidden dark:bg-carbon-800">
              <img
                  src={drop.imageUrl}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
              />
            </div>
        ) : (
            <div className="aspect-[16/9] bg-carbon-100 grid place-items-center text-carbon-300 dark:bg-carbon-800 dark:text-carbon-600">
              <CalendarDays className="h-8 w-8" />
            </div>
        )}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <p className="text-xs font-semibold text-racing-600">
            {date.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <h3 className="font-display font-bold text-carbon-950 leading-snug dark:text-white">
            {drop.productName}
          </h3>
          {drop.manufacturer && (
              <p className="text-xs text-carbon-500 dark:text-carbon-400">{drop.manufacturer}</p>
          )}
          {drop.description && drop.description !== 'N/A' && (
              <p className="text-sm text-carbon-600 line-clamp-2 dark:text-carbon-400">
                {drop.description}
              </p>
          )}
          {drop.preorderUrl && (
              <a
                  href={drop.preorderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline mt-auto py-2 text-sm"
              >
                Preorder <ExternalLink className="h-3.5 w-3.5" />
              </a>
          )}
        </div>
      </article>
  );
}
