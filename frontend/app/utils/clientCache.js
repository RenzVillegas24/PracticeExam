// Client-side caching for API requests
class ClientCache {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  getCacheKey(url, token) {
    return `${url}:${token.substring(0, 20)}`;
  }

  set(key, value, ttlSeconds = 300) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  // Deduplicate requests - if same request is pending, return the same promise
  async dedupedFetch(cacheKey, fetchFn, ttlSeconds = 300) {
    // Check cache first
    const cached = this.get(cacheKey);
    if (cached) {
      console.log('[CLIENT CACHE HIT]', cacheKey);
      return cached;
    }

    // Check if request is already pending
    if (this.pendingRequests.has(cacheKey)) {
      console.log('[REQUEST DEDUP] Waiting for pending request:', cacheKey);
      return this.pendingRequests.get(cacheKey);
    }

    // Start new request
    const request = fetchFn();
    this.pendingRequests.set(cacheKey, request);

    try {
      const result = await request;
      this.set(cacheKey, result, ttlSeconds);
      console.log('[CLIENT CACHE SET]', cacheKey, `(${ttlSeconds}s TTL)`);
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  clear() {
    this.cache.clear();
    this.pendingRequests.clear();
    console.log('[CLIENT CACHE] Cleared');
  }
}

export const clientCache = new ClientCache();
