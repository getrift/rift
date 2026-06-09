// Durable-state abstraction for the waitlist (rate-limit counters + signup
// records). Today it is backed by in-process memory; the point of the seam is
// that a Redis-backed implementation can drop in here without touching the
// route.
//
// NOTE ON HOSTING: Vercel KV is no longer offered for new projects — existing
// stores were folded into Upstash Redis in Dec 2024, and new projects should
// use a Redis Marketplace integration. See https://vercel.com/docs/redis.
// When hosting is decided, add a `RedisWaitlistStore implements WaitlistStore`
// here (Upstash REST client is ~10 lines) and select it via env. The route
// already awaits this interface, so nothing else changes.

export interface WaitlistStore {
  /** True if `key` is still at or under `max` hits within the trailing `windowMs`. */
  underRateLimit(key: string, windowMs: number, max: number): Promise<boolean>;
  /** Durably record an accepted signup (call before sending the email). */
  recordSignup(email: string): Promise<void>;
}

class InMemoryWaitlistStore implements WaitlistStore {
  // Single-instance only: resets on cold start and is NOT shared across
  // serverless instances. Acceptable for a private-beta soft-launch; swap for
  // Redis before a public homepage launch so limits and records survive.
  private hits = new Map<string, number[]>();
  private signups = new Map<string, number>();

  async underRateLimit(key: string, windowMs: number, max: number): Promise<boolean> {
    const now = Date.now();
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    this.hits.set(key, recent);
    // opportunistic cleanup so the map doesn't grow unbounded
    if (this.hits.size > 5000) {
      for (const [k, v] of this.hits) {
        if (v.every((t) => now - t >= windowMs)) this.hits.delete(k);
      }
    }
    return recent.length <= max;
  }

  async recordSignup(email: string): Promise<void> {
    this.signups.set(email, Date.now());
  }
}

// Reuse one instance across hot-reloads in dev and across requests in a warm
// serverless instance.
const g = globalThis as unknown as { __riftWaitlistStore?: WaitlistStore };
export const waitlistStore: WaitlistStore =
  g.__riftWaitlistStore ?? (g.__riftWaitlistStore = new InMemoryWaitlistStore());
