/**
 * Lightweight client-side cache with Inflight Request Deduplication,
 * TTL management, Stale-While-Revalidate (SWR), and granular invalidation.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private inflight = new Map<string, Promise<unknown>>();

  /**
   * Fetch with cache.
   * If fresh: returns cached data immediately (0 network calls).
   * If stale: returns cached data immediately and revalidates in the background.
   * If miss: executes fetcher, caches result, and returns data.
   * Deduplicates concurrent inflight requests.
   */
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number = 5 * 60 * 1000 // default 5 minutes
  ): Promise<T> {
    const entry = this.cache.get(key);
    const now = Date.now();

    // 1. Fresh cache hit: return immediately
    if (entry && now - entry.timestamp < entry.ttl) {
      return entry.data as T;
    }

    // 2. Stale cache hit: return stale data immediately and revalidate in background
    if (entry && !this.inflight.has(key)) {
      const backgroundPromise = fetcher()
        .then((freshData) => {
          this.set(key, freshData, ttlMs);
          return freshData;
        })
        .catch((err) => {
          console.warn(`Background revalidation failed for ${key}:`, err);
        })
        .finally(() => {
          this.inflight.delete(key);
        });

      this.inflight.set(key, backgroundPromise);
      return entry.data as T;
    }

    // 3. Deduplicate inflight requests if currently fetching
    if (this.inflight.has(key)) {
      return this.inflight.get(key) as Promise<T>;
    }

    // 4. Cache miss: execute fetcher
    const fetchPromise = (async () => {
      try {
        const freshData = await fetcher();
        this.set(key, freshData, ttlMs);
        return freshData;
      } finally {
        this.inflight.delete(key);
      }
    })();

    this.inflight.set(key, fetchPromise);
    return fetchPromise;
  }

  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    return entry.data as T;
  }

  /**
   * Invalidate specific cache key or keys starting with prefix
   */
  invalidate(keyOrPrefix: string): void {
    for (const key of this.cache.keys()) {
      if (key === keyOrPrefix || key.startsWith(keyOrPrefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.cache.clear();
    this.inflight.clear();
  }
}

export const apiCache = new ApiCache();
