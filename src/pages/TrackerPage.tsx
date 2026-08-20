import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, X, Search, Trophy, Layers, Gauge, Eye, EyeOff } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useSets } from '@/lib/use-sets';
import {
  buildDriverSummaries,
  cardProgress,
  filterByCardNumber,
  filterByDriver,
  filterPrintingPlates,
  getOneOfOneParallels,
  progressPercent,
  setProgress,
  type DriverSummary,
} from '@/lib/tracker';
import type { OneOfOneCard } from '@/types';
import { EmptyState, ErrorState, Progress, Spinner } from '@/components/ui';

type ViewMode = 'card' | 'driver';

export function TrackerPage() {
  const { sets, loading: setsLoading } = useSets();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSet = searchParams.get('set') || sets[0]?.value || '';

  const [selectedSet, setSelectedSet] = useState(initialSet);
  const [cards, setCards] = useState<OneOfOneCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [driverQuery, setDriverQuery] = useState('');
  const [cardQuery, setCardQuery] = useState('');
  const [view, setView] = useState<ViewMode>('card');
  const [showPrintingPlates, setShowPrintingPlates] = useState(false);

  // keep selected set in sync with sets list / URL
  useEffect(() => {
    if (!sets.length) return;
    if (!selectedSet || !sets.some((s) => s.value === selectedSet)) {
      setSelectedSet(sets[0].value);
    }
  }, [sets, selectedSet]);

  useEffect(() => {
    if (selectedSet) {
      setSearchParams({ set: selectedSet }, { replace: true });
    }
  }, [selectedSet, setSearchParams]);

  useEffect(() => {
    if (!selectedSet) return;
    let active = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await api.getOneOfOnes(selectedSet);
        if (active) setCards(data);
      } catch (e) {
        if (!active) return;
        setError(
            e instanceof ApiError ? e.message : 'Unable to load this set.'
        );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [selectedSet]);

  const displayCards = useMemo(
      () => filterPrintingPlates(cards, showPrintingPlates),
      [cards, showPrintingPlates]
  );

  const overall = useMemo(() => setProgress(displayCards), [displayCards]);

  const filteredCards = useMemo(() => {
    let result = displayCards;
    if (driverQuery.trim()) result = filterByDriver(result, driverQuery);
    if (view === 'card' && cardQuery.trim())
      result = filterByCardNumber(result, cardQuery);
    return result;
  }, [displayCards, driverQuery, cardQuery, view]);

  const driverSummaries = useMemo(
      () => buildDriverSummaries(filterByDriver(displayCards, driverQuery)),
      [displayCards, driverQuery]
  );

  return (
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-10">
        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-racing-600">
            Flagship Feature
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-carbon-950 dark:text-white">
            1/1 Tracker
          </h1>
          <p className="mt-1 text-sm text-carbon-500 dark:text-carbon-400 max-w-2xl">
            Pick a set, search by driver or card number, and see exactly which 1/1
            parallels exist and which have been found.
          </p>
        </header>

        {/* Controls */}
        <div className="card p-4 md:p-5 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1">
              <label htmlFor="set-select" className="label">
                Card set
              </label>
              <select
                  id="set-select"
                  value={selectedSet}
                  onChange={(e) => setSelectedSet(e.target.value)}
                  disabled={setsLoading || loading}
                  className="input appearance-none bg-white dark:bg-carbon-900"
              >
                {setsLoading && !sets.length && <option>Loading sets…</option>}
                {sets.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-3 md:items-end">
              <div className="flex rounded-xl border border-carbon-300 p-1 bg-white dark:border-carbon-700 dark:bg-carbon-900">
                <button
                    onClick={() => setView('card')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                        view === 'card'
                            ? 'bg-racing-600 text-white'
                            : 'text-carbon-600 hover:bg-carbon-100 dark:text-carbon-300 dark:hover:bg-carbon-800'
                    }`}
                >
                  Card View
                </button>
                <button
                    onClick={() => setView('driver')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                        view === 'driver'
                            ? 'bg-racing-600 text-white'
                            : 'text-carbon-600 hover:bg-carbon-100 dark:text-carbon-300 dark:hover:bg-carbon-800'
                    }`}
                >
                  Driver Summary
                </button>
              </div>

              <button
                  onClick={() => setShowPrintingPlates((v) => !v)}
                  className={`btn px-3 py-1.5 text-sm border transition ${
                      showPrintingPlates
                          ? 'border-racing-500 bg-racing-50 text-racing-700 dark:bg-racing-950/50 dark:text-racing-300'
                          : 'border-carbon-300 bg-white text-carbon-600 hover:bg-carbon-50 dark:border-carbon-700 dark:bg-carbon-900 dark:text-carbon-300 dark:hover:bg-carbon-800'
                  }`}
                  aria-pressed={showPrintingPlates}
              >
                {showPrintingPlates ? (
                    <Eye className="h-4 w-4" />
                ) : (
                    <EyeOff className="h-4 w-4" />
                )}
                {showPrintingPlates ? 'Printing plates shown' : 'Printing plates hidden'}
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="relative">
              <label htmlFor="driver-search" className="label">
                Driver search
              </label>
              <Search className="absolute left-3 top-9 h-4 w-4 text-carbon-400" />
              <input
                  id="driver-search"
                  type="search"
                  value={driverQuery}
                  onChange={(e) => setDriverQuery(e.target.value)}
                  placeholder="e.g. Norris, Verstappen…"
                  className="input pl-9"
              />
            </div>
            {view === 'card' && (
                <div className="relative">
                  <label htmlFor="card-search" className="label">
                    Card number search
                  </label>
                  <Search className="absolute left-3 top-9 h-4 w-4 text-carbon-400" />
                  <input
                      id="card-search"
                      type="search"
                      value={cardQuery}
                      onChange={(e) => setCardQuery(e.target.value)}
                      placeholder="e.g. 12, 1, 45…"
                      className="input pl-9"
                      aria-disabled={view !== 'card'}
                  />
                </div>
            )}
          </div>

          {/* Overall progress */}
          {!loading && !error && cards.length > 0 && (
              <div className="rounded-xl bg-carbon-50 border border-carbon-200 p-3 flex items-center gap-3 dark:bg-carbon-950/50 dark:border-carbon-800">
                <Gauge className="h-5 w-5 text-racing-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-carbon-500 dark:text-carbon-400">
                    Set progress
                  </p>
                  <Progress found={overall.found} total={overall.total} size="sm" />
                </div>
                <p className="font-mono font-bold text-carbon-900 tabular-nums dark:text-white">
                  {overall.found} / {overall.total}
                </p>
              </div>
          )}
        </div>

        {/* Body */}
        {loading ? (
            <TrackerSkeleton />
        ) : error ? (
            <ErrorState
                title="Unable to load this set"
                message={error}
                onRetry={() => setSelectedSet((s) => s)}
            />
        ) : cards.length === 0 ? (
            <EmptyState
                icon={<Layers className="h-8 w-8" />}
                title="No 1/1 data for this set"
                message="Try selecting a different card set."
            />
        ) : view === 'card' ? (
            filteredCards.length === 0 ? (
                <EmptyState
                    icon={<Search className="h-8 w-8" />}
                    title="No cards match your search"
                    message="Adjust your driver or card number search."
                />
            ) : (
                <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                  {filteredCards.map((card) => (
                      <TrackerCard key={card.id} card={card} />
                  ))}
                </div>
            )
        ) : driverSummaries.length === 0 ? (
            <EmptyState
                icon={<Search className="h-8 w-8" />}
                title="No drivers match your search"
                message="Adjust your driver search."
            />
        ) : (
            <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-2">
              {driverSummaries.map((s) => (
                  <DriverSummaryCard key={s.driverName} summary={s} />
              ))}
            </div>
        )}
      </div>
  );
}

function TrackerCard({ card }: { card: OneOfOneCard }) {
  const ones = getOneOfOneParallels(card.parallels);
  const { found, total } = cardProgress(card);
  const pct = progressPercent(found, total);

  return (
      <article className="card p-4 md:p-5 flex flex-col gap-3 animate-fade-in hover:shadow-card-hover transition-shadow">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display font-bold text-lg text-carbon-950 truncate dark:text-white">
              {card.driverName}
            </h3>
            <p className="text-xs text-carbon-500 mt-0.5 dark:text-carbon-400">
            <span className="font-mono font-semibold text-carbon-700 dark:text-carbon-300">
              #{card.cardNumber}
            </span>
              <span className="mx-1.5 text-carbon-300">·</span>
              {card.constructorName}
            </p>
          </div>
          {card.rookieCard && (
              <span className="badge bg-amber-100 text-amber-800">RC</span>
          )}
        </div>

        <ul className="space-y-1.5">
          {ones.map((p) => {
            const isFound = !!p.isOneOfOneFound;
            return (
                <li
                    key={p.name}
                    className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-sm"
                >
              <span className="flex items-center gap-2 min-w-0">
                <span
                    className={`grid place-items-center h-5 w-5 rounded-full shrink-0 ${
                        isFound
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-redline-100 text-redline-700'
                    }`}
                    aria-hidden="true"
                >
                  {isFound ? (
                      <Check className="h-3 w-3" strokeWidth={3} />
                  ) : (
                      <X className="h-3 w-3" strokeWidth={3} />
                  )}
                </span>
                <span className="truncate text-carbon-800 dark:text-carbon-200">{p.name}</span>
                {p.hasBounty && (
                    <span className="badge bg-amber-100 text-amber-800 gap-0.5">
                    <Trophy className="h-3 w-3" /> Bounty
                  </span>
                )}
              </span>
                  <span
                      className={`font-semibold text-xs shrink-0 ${
                          isFound ? 'text-emerald-700' : 'text-redline-600'
                      }`}
                  >
                {isFound ? 'Found' : 'Missing'}
              </span>
                </li>
            );
          })}
        </ul>

        <div className="mt-auto pt-2 border-t border-carbon-100 dark:border-carbon-800">
          <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-carbon-500 dark:text-carbon-400">
            Card progress
          </span>
            <span className="font-mono font-bold text-sm text-carbon-900 tabular-nums dark:text-white">
            {found} / {total}
              {pct !== null && (
                  <span className="text-carbon-400 font-medium"> · {pct}%</span>
              )}
          </span>
          </div>
          <Progress found={found} total={total} size="sm" />
        </div>
      </article>
  );
}

function DriverSummaryCard({ summary }: { summary: DriverSummary }) {
  const pct = progressPercent(summary.found, summary.total);
  return (
      <article className="card p-4 md:p-5 flex flex-col gap-3 animate-fade-in hover:shadow-card-hover transition-shadow">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display font-bold text-lg text-carbon-950 truncate dark:text-white">
              {summary.driverName}
            </h3>
            {summary.constructorName && (
                <p className="text-xs text-carbon-500 mt-0.5 dark:text-carbon-400">
                  {summary.constructorName}
                </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="font-mono font-bold text-carbon-900 tabular-nums dark:text-white">
              {summary.found} / {summary.total}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-carbon-400">
              {summary.cards.length} cards
            </p>
          </div>
        </div>

        <Progress found={summary.found} total={summary.total} />

        <ul className="divide-y divide-carbon-100 dark:divide-carbon-800">
          {summary.parallels.map((p) => (
              <li
                  key={p.name}
                  className="flex items-center justify-between py-2 text-sm"
              >
            <span className="flex items-center gap-2 text-carbon-700 min-w-0 dark:text-carbon-300">
              {p.name}
              {p.hasBounty && (
                  <span className="badge bg-amber-100 text-amber-800 gap-0.5">
                  <Trophy className="h-3 w-3" /> Bounty
                </span>
              )}
            </span>
                <span className="font-mono font-semibold text-carbon-900 tabular-nums dark:text-white">
              {p.found} / {p.total}
            </span>
              </li>
          ))}
        </ul>
      </article>
  );
}

function TrackerSkeleton() {
  return (
      <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="skeleton h-5 w-2/3" />
              <div className="skeleton h-3 w-1/3" />
              <div className="space-y-2 pt-2">
                {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="skeleton h-6 w-full" />
                ))}
              </div>
              <div className="skeleton h-2 w-full mt-2" />
            </div>
        ))}
      </div>
  );
}
