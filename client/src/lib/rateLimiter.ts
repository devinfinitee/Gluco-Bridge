/**
 * Rate Limiter - Prevent API abuse and quota exhaustion
 * Implements token bucket algorithm for fair rate limiting
 */

export interface RateLimitConfig {
  maxRequests: number;        // Maximum requests per window
  windowMs: number;           // Time window in milliseconds
  keyPrefix?: string;         // Prefix for storage keys
  storageType?: 'memory' | 'localStorage';  // Storage type
}

export interface RateLimitStatus {
  remaining: number;          // Remaining requests
  reset: number;              // Reset timestamp (ms)
  retryAfter: number;         // Seconds to wait
  isLimited: boolean;          // Whether rate limited
}

/**
 * In-memory storage for rate limiting
 * Used on client-side to track requests
 */
class MemoryStore {
  private store: Map<string, { count: number; resetTime: number }> = new Map();

  get(key: string): { count: number; resetTime: number } | null {
    const data = this.store.get(key);
    if (!data) return null;

    // Check if reset time has passed
    if (Date.now() >= data.resetTime) {
      this.store.delete(key);
      return null;
    }

    return data;
  }

  set(key: string, count: number, resetTime: number): void {
    this.store.set(key, { count, resetTime });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

/**
 * LocalStorage-based storage for rate limiting
 * Persists across page refreshes
 */
class LocalStorageStore {
  private prefix: string;

  constructor(prefix: string = 'rate_limit_') {
    this.prefix = prefix;
  }

  get(key: string): { count: number; resetTime: number } | null {
    try {
      const data = localStorage.getItem(this.prefix + key);
      if (!data) return null;

      const parsed = JSON.parse(data);

      // Check if reset time has passed
      if (Date.now() >= parsed.resetTime) {
        this.delete(key);
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }

  set(key: string, count: number, resetTime: number): void {
    try {
      localStorage.setItem(
        this.prefix + key,
        JSON.stringify({ count, resetTime })
      );
    } catch {
      // localStorage might be full or unavailable
      console.warn('Failed to save rate limit data to localStorage');
    }
  }

  delete(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch {
      // Ignore errors
    }
  }

  clear(): void {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(this.prefix))
        .forEach(k => localStorage.removeItem(k));
    } catch {
      // Ignore errors
    }
  }
}

/**
 * Rate Limiter class
 * Implements token bucket algorithm
 */
export class RateLimiter {
  private config: Required<RateLimitConfig>;
  private store: MemoryStore | LocalStorageStore;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyPrefix: 'global',
      storageType: 'memory',
      ...config,
    };

    this.store =
      this.config.storageType === 'localStorage'
        ? new LocalStorageStore(this.config.keyPrefix)
        : new MemoryStore();
  }

  /**
   * Check if request is allowed and consume a token
   */
  check(key: string = 'default'): RateLimitStatus {
    const storageKey = `${this.config.keyPrefix}:${key}`;
    const now = Date.now();
    let data = this.store.get(storageKey);

    // Initialize or reset if window expired
    if (!data) {
      const resetTime = now + this.config.windowMs;
      this.store.set(storageKey, 0, resetTime);
      data = { count: 0, resetTime };
    }

    const remaining = this.config.maxRequests - data.count;
    const isLimited = data.count >= this.config.maxRequests;
    const resetInMs = data.resetTime - now;

    if (!isLimited) {
      // Consume a token
      this.store.set(storageKey, data.count + 1, data.resetTime);
    }

    return {
      remaining: Math.max(0, remaining - 1),
      reset: data.resetTime,
      retryAfter: Math.ceil(resetInMs / 1000),
      isLimited,
    };
  }

  /**
   * Reset rate limit for a specific key
   */
  reset(key: string = 'default'): void {
    const storageKey = `${this.config.keyPrefix}:${key}`;
    this.store.delete(storageKey);
  }

  /**
   * Clear all rate limit data
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Get current status without consuming a token
   */
  getStatus(key: string = 'default'): RateLimitStatus {
    const storageKey = `${this.config.keyPrefix}:${key}`;
    const now = Date.now();
    const data = this.store.get(storageKey);

    if (!data) {
      return {
        remaining: this.config.maxRequests,
        reset: now + this.config.windowMs,
        retryAfter: 0,
        isLimited: false,
      };
    }

    const remaining = this.config.maxRequests - data.count;
    const resetInMs = data.resetTime - now;

    return {
      remaining: Math.max(0, remaining),
      reset: data.resetTime,
      retryAfter: Math.ceil(resetInMs / 1000),
      isLimited: data.count >= this.config.maxRequests,
    };
  }
}

/**
 * Default rate limiters for common use cases
 */

// Strict limit for expensive operations (Gemini Vision API)
export const visionLimiter = new RateLimiter({
  maxRequests: 3,              // 3 requests
  windowMs: 60 * 1000,         // per 60 seconds
  keyPrefix: 'vision',
  storageType: 'localStorage',
});

// Moderate limit for chat/analysis
export const chatLimiter = new RateLimiter({
  maxRequests: 10,             // 10 requests
  windowMs: 60 * 1000,         // per 60 seconds
  keyPrefix: 'chat',
  storageType: 'localStorage',
});

// Gentle limit for screening submissions
export const screeningLimiter = new RateLimiter({
  maxRequests: 5,              // 5 requests
  windowMs: 60 * 1000,         // per 60 seconds
  keyPrefix: 'screening',
  storageType: 'localStorage',
});

// Strict limit for data analysis
export const analysisLimiter = new RateLimiter({
  maxRequests: 20,             // 20 requests
  windowMs: 60 * 1000,         // per 60 seconds
  keyPrefix: 'analysis',
  storageType: 'localStorage',
});

/**
 * Custom rate limiter factory
 */
export function createRateLimiter(config: RateLimitConfig): RateLimiter {
  return new RateLimiter(config);
}

/**
 * Format rate limit error message
 */
export function formatRateLimitError(status: RateLimitStatus): string {
  if (!status.isLimited) {
    return '';
  }

  if (status.retryAfter < 60) {
    return `Rate limit reached. Please wait ${status.retryAfter} seconds before trying again.`;
  }

  const minutes = Math.ceil(status.retryAfter / 60);
  return `Rate limit reached. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`;
}

/**
 * Check if enough time has passed since reset
 */
export function isResetExpired(resetTime: number): boolean {
  return Date.now() >= resetTime;
}

/**
 * Get time remaining until reset (in seconds)
 */
export function getTimeUntilReset(resetTime: number): number {
  const remaining = resetTime - Date.now();
  return Math.ceil(Math.max(0, remaining) / 1000);
}

export default RateLimiter;
