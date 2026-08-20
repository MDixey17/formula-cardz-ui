import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  LogIn,
  Pencil,
  Plus,
  Trash2,
  X,
  Check,
  Search,
} from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useSets } from '@/lib/use-sets';
import type { CardResponse, OwnershipEntry } from '@/types';
import {
  EmptyState,
  ErrorState,
  Spinner,
} from '@/components/ui';

const CONDITIONS = [
  'Raw',
  'PSA 10',
  'PSA 9',
  'PSA 8',
  'PSA 7',
  'PSA 6',
  'PSA 5',
  'PSA 4',
  'PSA 3',
  'PSA 2',
  'PSA 1',
  'BGS 10',
  'BGS 9.5',
  'BGS 9',
  'BGS 8.5',
  'BGS 8',
  'BGS 7.5',
  'BGS 7',
  'BGS 6.5',
  'BGS 6',
  'SGC 10',
  'SGC 9.5',
  'SGC 9',
  'SGC 8.5',
  'SGC 8',
  'SGC 7.5',
  'SGC 7',
  'SGC 6.5',
  'SGC 6',
  'Other',
];

export function CollectionPage() {
  const { user } = useAuth();

  if (!user) return <UnauthenticatedCollection />;

  return <AuthenticatedCollection userId={user.id} />;
}

function UnauthenticatedCollection() {
  return (
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <h1 className="font-display text-3xl font-extrabold text-carbon-950 dark:text-white">
          Collection
        </h1>
        <div className="mt-6">
          <EmptyState
              icon={<LogIn className="h-8 w-8" />}
              title="Log in to view your collection"
              message="Your personal collection is only visible when you're signed in. It isn't a marketplace — just your checklist of owned cards."
              action={
                <div className="flex gap-2 justify-center">
                  <Link to="/login" className="btn-primary px-4 py-2">
                    Log In
                  </Link>
                  <Link to="/register" className="btn-outline px-4 py-2">
                    Register
                  </Link>
                </div>
              }
          />
        </div>
      </div>
  );
}

function AuthenticatedCollection({ userId }: { userId: string }) {
  const [entries, setEntries] = useState<OwnershipEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<OwnershipEntry | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getOwnership(userId);
      setEntries(data);
    } catch (e) {
      setError(
          e instanceof ApiError ? e.message : 'Unable to load your collection.'
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  return (
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-10">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-carbon-950 dark:text-white">
              Collection
            </h1>
            <p className="text-sm text-carbon-500 dark:text-carbon-400">
              {entries.length > 0
                  ? `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`
                  : 'Manage the cards you own.'}
            </p>
          </div>
          <button
              onClick={() => setShowAdd(true)}
              className="btn-primary px-4 py-2 text-sm"
          >
            <Plus className="h-4 w-4" /> Add card
          </button>
        </div>

        {toast && (
            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in">
              <Check className="h-4 w-4" /> {toast}
            </div>
        )}

        {loading ? (
            <div className="card p-6 flex items-center gap-3 text-carbon-500 dark:text-carbon-400">
              <Spinner className="h-5 w-5 text-racing-600" /> Loading collection…
            </div>
        ) : error ? (
            <ErrorState title="Couldn't load your collection" message={error} onRetry={load} />
        ) : entries.length === 0 ? (
            <EmptyState
                icon={<Layers className="h-8 w-8" />}
                title="Your collection is empty"
                message="Add your first card to start tracking what you own."
                action={
                  <button
                      onClick={() => setShowAdd(true)}
                      className="btn-primary px-4 py-2"
                  >
                    <Plus className="h-4 w-4" /> Add your first card
                  </button>
                }
            />
        ) : (
            <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {entries.map((entry, i) => (
                  <CollectionCard
                      key={entry._id ?? `${entry.cardId}-${i}`}
                      entry={entry}
                      onEdit={() => setEditing(entry)}
                      onDelete={async () => {
                        if (
                            !confirm(
                                'Remove this card from your collection? This cannot be undone.'
                            )
                        )
                          return;
                        try {
                          await api.deleteOwnership({
                            _id: entry._id,
                            userId,
                            cardId: entry.cardId,
                          });
                          setEntries((prev) =>
                              prev.filter((e) => e._id !== entry._id)
                          );
                          flash('Card removed.');
                        } catch (e) {
                          flash(
                              e instanceof ApiError
                                  ? e.message
                                  : 'Could not remove card.'
                          );
                        }
                      }}
                  />
              ))}
            </div>
        )}

        {showAdd && (
            <OwnershipModal
                mode="add"
                userId={userId}
                onClose={() => setShowAdd(false)}
                onSaved={(e) => {
                  setEntries((prev) => [...prev, e]);
                  setShowAdd(false);
                  flash('Card added.');
                }}
            />
        )}

        {editing && (
            <OwnershipModal
                mode="edit"
                userId={userId}
                initial={editing}
                onClose={() => setEditing(null)}
                onSaved={(e) => {
                  setEntries((prev) =>
                      prev.map((p) => (p._id === editing._id ? e : p))
                  );
                  setEditing(null);
                  flash('Card updated.');
                }}
            />
        )}
      </div>
  );
}

function CollectionCard({
                          entry,
                          onEdit,
                          onDelete,
                        }: {
  entry: OwnershipEntry;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
      <article className="card p-4 md:p-5 flex flex-col gap-2 animate-fade-in">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display font-bold text-carbon-950 truncate dark:text-white">
              {entry.driverName || 'Unknown driver'}
            </h3>
            <p className="text-xs text-carbon-500 mt-0.5 dark:text-carbon-400">
              {entry.setName ?? '—'}
              {entry.year ? ` · ${entry.year}` : ''}
              <span className="mx-1.5 text-carbon-300">·</span>#
              {entry.cardNumber ?? '—'}
            </p>
          </div>
          {entry.rookieCard && (
              <span className="badge bg-amber-100 text-amber-800">RC</span>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm mt-1">
          <Field label="Parallel" value={entry.parallel} />
          <Field label="Quantity" value={String(entry.quantity)} />
          <Field label="Condition" value={entry.condition} />
          {entry.purchasePrice != null && (
              <Field
                  label="Price"
                  value={`$${entry.purchasePrice.toLocaleString()}`}
              />
          )}
          {entry.purchaseDate && (
              <Field
                  label="Purchased"
                  value={new Date(entry.purchaseDate).toLocaleDateString()}
              />
          )}
        </dl>

        <div className="mt-2 flex gap-2 pt-2 border-t border-carbon-100 dark:border-carbon-800">
          <button onClick={onEdit} className="btn-outline flex-1 py-2 text-sm">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button
              onClick={onDelete}
              className="btn-ghost py-2 px-3 text-sm text-redline-600 hover:bg-redline-50"
              aria-label="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </article>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
      <div className="min-w-0">
        <dt className="text-[10px] font-semibold uppercase tracking-wide text-carbon-400">
          {label}
        </dt>
        <dd className="text-carbon-800 font-medium truncate dark:text-carbon-200">
          {value && value !== 'N/A' ? value : '—'}
        </dd>
      </div>
  );
}

function OwnershipModal({
                          mode,
                          userId,
                          initial,
                          onClose,
                          onSaved,
                        }: {
  mode: 'add' | 'edit';
  userId: string;
  initial?: OwnershipEntry;
  onClose: () => void;
  onSaved: (e: OwnershipEntry) => void;
}) {
  const { sets } = useSets();
  const [selectedSet, setSelectedSet] = useState('');
  const [cards, setCards] = useState<CardResponse[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardsError, setCardsError] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState(initial?.cardId ?? '');
  const [cardSearch, setCardSearch] = useState('');
  const [parallel, setParallel] = useState(initial?.parallel ?? '');
  const [quantity, setQuantity] = useState(String(initial?.quantity ?? 1));
  const [condition, setCondition] = useState(initial?.condition ?? 'Raw');
  const [purchasePrice, setPurchasePrice] = useState(
      initial?.purchasePrice != null ? String(initial.purchasePrice) : ''
  );
  const [purchaseDate, setPurchaseDate] = useState(
      initial?.purchaseDate ? initial.purchaseDate.slice(0, 10) : ''
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In edit mode, preselect the set from the initial entry
  useEffect(() => {
    if (mode === 'edit' && initial?.setName && !selectedSet) {
      setSelectedSet(initial.setName);
    }
  }, [mode, initial, selectedSet]);

  // Fetch cards when set changes
  useEffect(() => {
    if (!selectedSet) {
      setCards([]);
      return;
    }
    let active = true;
    setCardsLoading(true);
    setCardsError(null);
    (async () => {
      try {
        const data = await api.getCards(selectedSet);
        if (active) setCards(data);
      } catch (e) {
        if (!active) return;
        setCardsError(
            e instanceof ApiError ? e.message : 'Unable to load cards for this set.'
        );
      } finally {
        if (active) setCardsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [selectedSet]);

  const selectedCard = useMemo(
      () => cards.find((c) => c.id === selectedCardId) ?? null,
      [cards, selectedCardId]
  );

  const filteredCards = useMemo(() => {
    const q = cardSearch.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(
        (c) =>
            c.driverName.toLowerCase().includes(q) ||
            c.cardNumber.toLowerCase().includes(q) ||
            c.constructorName.toLowerCase().includes(q)
    );
  }, [cards, cardSearch]);

  const submit = async () => {
    setError(null);
    if (!selectedCardId) {
      setError('Please select a card.');
      return;
    }
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      setError('Quantity must be at least 1.');
      return;
    }
    setSubmitting(true);
    const payload: OwnershipEntry = {
      userId,
      cardId: selectedCardId,
      quantity: qty,
      condition,
      ...(parallel ? { parallel } : {}),
      ...(purchasePrice ? { purchasePrice: Number(purchasePrice) } : {}),
      ...(purchaseDate
          ? { purchaseDate: new Date(purchaseDate).toISOString() }
          : {}),
      // enriched fields for local display
      ...(selectedCard
          ? {
            driverName: selectedCard.driverName,
            setName: selectedCard.setName,
            year: selectedCard.year,
            cardNumber: selectedCard.cardNumber,
            constructorName: selectedCard.constructorName,
            rookieCard: selectedCard.rookieCard,
          }
          : {}),
    };
    try {
      const saved =
          mode === 'add'
              ? await api.addOwnership(payload)
              : await api.updateOwnership(
                  initial?._id ? { ...payload, _id: initial._id } : payload
              );
      onSaved({ ...saved, ...payload });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not save card.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <div
          className="fixed inset-0 z-50 grid place-items-center bg-carbon-950/50 backdrop-blur-sm p-4 animate-fade-in"
          onClick={onClose}
      >
        <div
            className="card w-full max-w-lg p-5 md:p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-carbon-950 dark:text-white">
              {mode === 'add' ? 'Add card' : 'Edit card'}
            </h2>
            <button
                onClick={onClose}
                className="btn-ghost p-2"
                aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Step 1: Set selection */}
            <div>
              <label htmlFor="set-pick" className="label">
                Card set
              </label>
              <select
                  id="set-pick"
                  value={selectedSet}
                  onChange={(e) => {
                    setSelectedSet(e.target.value);
                    setSelectedCardId('');
                    setParallel('');
                  }}
                  className="input appearance-none bg-white dark:bg-carbon-900"
              >
                <option value="">Select a set…</option>
                {sets.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                ))}
              </select>
            </div>

            {/* Step 2: Card selection (appears once a set is chosen) */}
            {selectedSet && (
                <div className="space-y-3 animate-fade-in">
                  {cardsLoading ? (
                      <div className="flex items-center gap-2 text-sm text-carbon-500 dark:text-carbon-400">
                        <Spinner className="h-4 w-4 text-racing-600" /> Loading cards…
                      </div>
                  ) : cardsError ? (
                      <p className="rounded-lg bg-redline-50 border border-redline-200 px-3 py-2 text-sm text-redline-700">
                        {cardsError}
                      </p>
                  ) : (
                      <>
                        <div>
                          <label htmlFor="card-pick" className="label">
                            Card
                          </label>
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-carbon-400" />
                            <input
                                id="card-search"
                                className="input pl-9 mb-2"
                                value={cardSearch}
                                onChange={(e) => setCardSearch(e.target.value)}
                                placeholder="Search by driver, number, or team…"
                            />
                          </div>
                          <select
                              id="card-pick"
                              value={selectedCardId}
                              onChange={(e) => {
                                setSelectedCardId(e.target.value);
                                setParallel('');
                              }}
                              className="input appearance-none bg-white dark:bg-carbon-900"
                              size={1}
                          >
                            <option value="">Select a card…</option>
                            {filteredCards.map((c) => (
                                <option key={c.id} value={c.id}>
                                  #{c.cardNumber} — {c.driverName} ({c.constructorName})
                                  {c.rookieCard ? ' · RC' : ''}
                                </option>
                            ))}
                          </select>
                        </div>

                        {/* Step 3: Parallel selection (appears once a card is chosen) */}
                        {selectedCard && (
                            <div className="animate-fade-in">
                              <label htmlFor="par-pick" className="label">
                                Parallel (optional)
                              </label>
                              <select
                                  id="par-pick"
                                  value={parallel}
                                  onChange={(e) => setParallel(e.target.value)}
                                  className="input appearance-none bg-white dark:bg-carbon-900"
                              >
                                <option value="">No specific parallel</option>
                                {selectedCard.parallels.map((p) => (
                                    <option key={p.name} value={p.name}>
                                      {p.name}
                                      {p.printRun ? ` (/${p.printRun})` : ''}
                                      {p.isOneOfOne ? ' · 1/1' : ''}
                                    </option>
                                ))}
                              </select>
                            </div>
                        )}
                      </>
                  )}
                </div>
            )}

            {/* Selected card preview */}
            {selectedCard && (
                <div className="rounded-xl bg-carbon-50 border border-carbon-200 p-3 dark:bg-carbon-950/50 dark:border-carbon-800 animate-fade-in">
                  <p className="font-display font-bold text-carbon-950 dark:text-white">
                    {selectedCard.driverName}
                  </p>
                  <p className="text-xs text-carbon-500 dark:text-carbon-400 mt-0.5">
                <span className="font-mono font-semibold text-carbon-700 dark:text-carbon-300">
                  #{selectedCard.cardNumber}
                </span>
                    <span className="mx-1.5 text-carbon-300">·</span>
                    {selectedCard.constructorName}
                    {selectedCard.rookieCard && (
                        <span className="badge bg-amber-100 text-amber-800 ml-2">
                    RC
                  </span>
                    )}
                  </p>
                </div>
            )}

            {/* Details (always visible) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="qty" className="label">
                  Quantity
                </label>
                <input
                    id="qty"
                    type="number"
                    min={1}
                    className="input"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="cond" className="label">
                  Condition
                </label>
                <select
                    id="cond"
                    className="input"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                >
                  {CONDITIONS.map((c) => (
                      <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="price" className="label">
                  Purchase price (optional)
                </label>
                <input
                    id="price"
                    type="number"
                    min={0}
                    className="input"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="pdate" className="label">
                  Purchase date (optional)
                </label>
                <input
                    id="pdate"
                    type="date"
                    className="input"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </div>
            </div>

            {error && (
                <p className="rounded-lg bg-redline-50 border border-redline-200 px-3 py-2 text-sm text-redline-700">
                  {error}
                </p>
            )}

            <div className="flex gap-2 pt-1">
              <button
                  onClick={submit}
                  disabled={submitting || !selectedCardId}
                  className="btn-primary flex-1 py-2.5"
              >
                {submitting ? (
                    <Spinner className="h-4 w-4" />
                ) : (
                    <Check className="h-4 w-4" />
                )}
                {mode === 'add' ? 'Add to collection' : 'Save changes'}
              </button>
              <button onClick={onClose} className="btn-outline py-2.5">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
