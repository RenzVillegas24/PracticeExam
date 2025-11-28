// Simple in-memory cache with TTL (Time To Live)
class Cache {
  constructor(ttlMs = 5 * 60 * 1000) { // Default 5 minutes
    this.cache = new Map();
    this.ttl = ttlMs;
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0
    };
  }

  set(key, value) {
    const expiresAt = Date.now() + this.ttl;
    this.cache.set(key, { value, expiresAt });
    this.stats.sets++;
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      return null;
    }
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }
    
    this.stats.hits++;
    return item.value;
  }

  clear() {
    this.cache.clear();
    console.log('[CACHE] Cache cleared');
  }

  delete(key) {
    this.cache.delete(key);
  }

  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) : 0;
    return {
      ...this.stats,
      total,
      hitRate: `${hitRate}%`,
      size: this.cache.size
    };
  }

  printStats() {
    const stats = this.getStats();
    console.log('[CACHE STATS]', JSON.stringify(stats, null, 2));
  }
}

export const apiCache = new Cache(5 * 60 * 1000); // 5 minute TTL

// Print cache stats every 2 minutes
setInterval(() => {
  apiCache.printStats();
}, 2 * 60 * 1000);
