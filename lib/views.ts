/**
 * The site's total-visit counter.
 *
 * The number lives in Upstash Redis and is reached over its REST API, so
 * there's no client library and no npm dependency — a plain `fetch` with a
 * bearer token is the whole integration. `INCR` is atomic, so concurrent
 * visitors can't clobber each other's bump the way a read-modify-write
 * against a blob would.
 *
 * Two naming schemes reach the same database: the Vercel Marketplace
 * integration injects `KV_REST_API_*`, Upstash's own injects
 * `UPSTASH_REDIS_REST_*`. Accept either so the deploy works whichever way
 * the store was attached.
 *
 * With neither pair set (a fresh clone, no store) every call returns null
 * and the counter simply doesn't render — same rule as the ambient track:
 * unconfigured means silent, not broken.
 */

const REST_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const KEY = "portfolio:visits";

async function redis(command: string): Promise<number | null> {
  if (!REST_URL || !REST_TOKEN) return null;

  try {
    const res = await fetch(`${REST_URL}/${command}`, {
      headers: { Authorization: `Bearer ${REST_TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) return null;

    const body: unknown = await res.json();
    const result = (body as { result?: unknown }).result;

    // A key that has never been written comes back as null — that's a real
    // count of zero, not a failure.
    if (result === null) return 0;

    const total = typeof result === "string" ? Number(result) : result;
    return typeof total === "number" && Number.isFinite(total) ? total : null;
  } catch {
    return null;
  }
}

/** Current total, without counting the caller. */
export function getVisits() {
  return redis(`get/${KEY}`);
}

/** Counts one visit and returns the new total. */
export function incrementVisits() {
  return redis(`incr/${KEY}`);
}
