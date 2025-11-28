// Simple in-memory cache with TTL (Time To Live)
class Cache {
  constructor(ttlMs = 5 * 60 * 1000) { // Default 5 minutes
    this.cache = new Map();
    this.ttl = ttlMs;
  }

  set(key, value) {
    const expiresAt = Date.now() + this.ttl;
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

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }
}

export const apiCache = new Cache(5 * 60 * 1000); // 5 minute TTL
