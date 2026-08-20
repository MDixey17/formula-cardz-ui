import type { OneOfOneCard, EnabledParallel } from '@/types';

export interface CardProgress {
  found: number;
  total: number;
}

export function isPrintingPlate(name: string): boolean {
  return name.toLowerCase().includes('printing plate');
}

export function filterPrintingPlates(
    cards: OneOfOneCard[],
    show: boolean
): OneOfOneCard[] {
  if (show) return cards;
  return cards.map((card) => ({
    ...card,
    parallels: card.parallels.filter(
        (p) => p.isOneOfOne && !isPrintingPlate(p.name)
    ),
  }));
}

export function getOneOfOneParallels(parallels: EnabledParallel[] = []) {
  return parallels.filter((p) => p.isOneOfOne);
}

export function cardProgress(card: OneOfOneCard): CardProgress {
  const ones = getOneOfOneParallels(card.parallels);
  const found = ones.filter((p) => p.isOneOfOneFound).length;
  return { found, total: ones.length };
}

export interface SetProgress {
  found: number;
  total: number;
}

export function setProgress(cards: OneOfOneCard[]): SetProgress {
  return cards.reduce(
      (acc, card) => {
        const p = cardProgress(card);
        acc.found += p.found;
        acc.total += p.total;
        return acc;
      },
      { found: 0, total: 0 }
  );
}

export interface DriverSummary {
  driverName: string;
  constructorName: string;
  cards: OneOfOneCard[];
  found: number;
  total: number;
  parallels: {
    name: string;
    found: number;
    total: number;
    hasBounty: boolean;
  }[];
}

export function buildDriverSummaries(cards: OneOfOneCard[]): DriverSummary[] {
  const map = new Map<string, OneOfOneCard[]>();
  for (const card of cards) {
    const key = card.driverName || 'Unknown Driver';
    const arr = map.get(key) ?? [];
    arr.push(card);
    map.set(key, arr);
  }

  const summaries: DriverSummary[] = [];
  for (const [driverName, driverCards] of map) {
    const constructorName =
        driverCards.find((c) => c.constructorName)?.constructorName ?? '';

    const parallelMap = new Map<
        string,
        { found: number; total: number; hasBounty: boolean }
    >();

    let found = 0;
    let total = 0;
    for (const card of driverCards) {
      const ones = getOneOfOneParallels(card.parallels);
      for (const p of ones) {
        const entry = parallelMap.get(p.name) ?? {
          found: 0,
          total: 0,
          hasBounty: false,
        };
        entry.total += 1;
        if (p.isOneOfOneFound) entry.found += 1;
        if (p.hasBounty) entry.hasBounty = true;
        parallelMap.set(p.name, entry);

        total += 1;
        if (p.isOneOfOneFound) found += 1;
      }
    }

    summaries.push({
      driverName,
      constructorName,
      cards: driverCards,
      found,
      total,
      parallels: Array.from(parallelMap.entries())
          .map(([name, v]) => ({ name, ...v }))
          .sort((a, b) => a.name.localeCompare(b.name)),
    });
  }

  return summaries.sort((a, b) =>
      a.driverName.localeCompare(b.driverName)
  );
}

export function filterByDriver<T extends { driverName: string }>(
    items: T[],
    query: string
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((i) => i.driverName.toLowerCase().includes(q));
}

export function filterByCardNumber(cards: OneOfOneCard[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return cards;
  return cards.filter((c) => c.cardNumber.toLowerCase().includes(q));
}

export function progressPercent(found: number, total: number): number | null {
  if (!total) return null;
  return Math.round((found / total) * 100);
}
