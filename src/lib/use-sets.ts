import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import type { SetOption } from '@/types';

const SESSION_KEY = 'fc_sets_cache';

interface CachedSets {
  sets: SetOption[];
  ts: number;
}

function readCache(): SetOption[] | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedSets;
    if (!Array.isArray(parsed.sets)) return null;
    return parsed.sets;
  } catch {
    return null;
  }
}

function writeCache(sets: SetOption[]) {
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ sets, ts: Date.now() } satisfies CachedSets)
    );
  } catch {
    // ignore
  }
}

export function useSets() {
  const [sets, setSets] = useState<SetOption[]>(() => readCache() ?? []);
  const [loading, setLoading] = useState(!readCache());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const cached = readCache();
    if (cached) {
      setSets(cached);
      setLoading(false);
    }
    (async () => {
      try {
        const fresh = await api.getSets();
        if (!active) return;
        setSets(fresh);
        writeCache(fresh);
        setError(null);
      } catch (e) {
        if (!active) return;
        if (cached) return; // keep cache silently
        setError(
          e instanceof ApiError ? e.message : 'Unable to load card sets.'
        );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { sets, loading, error };
}
