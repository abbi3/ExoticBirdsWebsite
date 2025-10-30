// Simple in-memory cache with TTL for active users metric
interface CacheEntry {
  value: number;
  expiresAt: number;
}

class MetricsCache {
  private cache: Map<string, CacheEntry> = new Map();
  
  set(key: string, value: number, ttlSeconds: number): void {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expiresAt });
  }
  
  get(key: string): number | undefined {
    const entry = this.cache.get(key);
    if (!entry) {
      return undefined;
    }
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    
    return entry.value;
  }
  
  getWithExpiry(key: string): { value: number; expiresInSeconds: number } | undefined {
    const entry = this.cache.get(key);
    if (!entry) {
      return undefined;
    }
    
    // Check if expired
    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    
    const expiresInSeconds = Math.ceil((entry.expiresAt - now) / 1000);
    return { value: entry.value, expiresInSeconds };
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

// Singleton instance
export const metricsCache = new MetricsCache();

// Helper to generate active users count
export function generateActiveUsers(min: number = 5, max: number = 19): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
