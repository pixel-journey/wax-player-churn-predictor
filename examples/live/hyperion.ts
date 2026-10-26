/**
 * Live Hyperion adapter → PlayerActivityProfile.
 * Network + aggregation only; scoring stays pure in engines.ts.
 */

import type { PlayerActivityProfile } from "../types";
import { HISTORY_ORIGINS, actionsUrl } from "./origins";

/** Kept so older notes can name it. get_actions on this host returned 404 on 2026-10-26. */
export const DEFAULT_HYPERION = "https://wax.eosrio.io";
export { HISTORY_ORIGINS };

export interface HyperionActionRow {
  timestamp?: string;
  "@timestamp"?: string;
  act?: { account?: string; name?: string };
}

export interface HyperionActionsResponse {
  actions?: HyperionActionRow[];
}

export function parseActionTimestamp(row: HyperionActionRow): number | null {
  const raw = row.timestamp || row["@timestamp"];
  if (!raw) return null;
  const ms = Date.parse(raw);
  if (Number.isNaN(ms)) return null;
  return Math.floor(ms / 1000);
}

export async function fetchAccountActionTimestamps(
  account: string,
  options: {
    hyperionBase?: string;
    limit?: number;
    signal?: AbortSignal;
  } = {}
): Promise<{ timestamps: number[]; source: string; rawCount: number }> {
  const limit = options.limit ?? 200;
  const custom = options.hyperionBase?.trim();
  const order = custom ? [custom] : [...HISTORY_ORIGINS];
  const errors: string[] = [];

  for (const origin of order) {
    const built = actionsUrl(origin, account, limit);
    if (!built.ok) {
      errors.push(built.reason);
      if (custom) break;
      continue;
    }
    try {
      const res = await fetch(built.url, {
        signal: options.signal,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        errors.push(`${origin} HTTP ${res.status}`);
        continue;
      }
      const data = (await res.json()) as HyperionActionsResponse;
      const rows = data.actions ?? [];
      const timestamps: number[] = [];
      for (const row of rows) {
        const t = parseActionTimestamp(row);
        if (t != null) timestamps.push(t);
      }
      timestamps.sort((a, b) => a - b);
      return { timestamps, source: built.url, rawCount: rows.length };
    } catch (error) {
      if (options.signal?.aborted) throw error;
      errors.push(`${origin} ${error instanceof Error ? error.message : "failed"}`);
    }
  }

  throw new Error(errors.join("; ") || "No history origin left");
}

/**
 * Build churn profile from timestamps relative to `nowSec`.
 * Limited by Hyperion page size — treat as soft sample, not full history.
 */
export function profileFromTimestamps(
  account: string,
  timestamps: number[],
  nowSec: number = Math.floor(Date.now() / 1000)
): PlayerActivityProfile {
  const day = 86400;
  const last7 = nowSec - 7 * day;
  const prior7Start = nowSec - 14 * day;
  const last30 = nowSec - 30 * day;

  let actionsLast7d = 0;
  let actionsPrior7d = 0;
  const activeDays = new Set<string>();

  let latest = 0;
  for (const t of timestamps) {
    if (t > latest) latest = t;
    if (t >= last7) actionsLast7d++;
    else if (t >= prior7Start && t < last7) actionsPrior7d++;
    if (t >= last30) {
      const d = new Date(t * 1000);
      activeDays.add(
        `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`
      );
    }
  }

  const daysSinceLastAction =
    latest === 0
      ? 999
      : Math.max(0, Math.floor((nowSec - latest) / day));

  return {
    account,
    daysSinceLastAction,
    actionsLast7d,
    actionsPrior7d,
    activeDaysLast30: activeDays.size,
    // Depth needs AtomicAssets — leave undefined so pure engine uses neutral weight
    assetTouchLast30: undefined,
  };
}

export async function fetchPlayerActivityProfile(
  account: string,
  options: {
    hyperionBase?: string;
    limit?: number;
    signal?: AbortSignal;
  } = {}
): Promise<{
  profile: PlayerActivityProfile;
  source: string;
  rawCount: number;
  sampleNote: string;
}> {
  const { timestamps, source, rawCount } =
    await fetchAccountActionTimestamps(account, options);
  const name = account.trim().toLowerCase();
  const profile = profileFromTimestamps(name, timestamps);
  return {
    profile,
    source,
    rawCount,
    sampleNote:
      "Profile built from latest Hyperion page only (not full 30d history). Depth omitted without AtomicAssets.",
  };
}
