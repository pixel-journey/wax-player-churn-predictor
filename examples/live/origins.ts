/**
 * Unsent URL rules for a history failover list.
 * This file does not call a host.
 */

export const HISTORY_ORIGINS = [
  "https://wax.eosphere.io",
  "https://wax.eosusa.io",
  "https://api.waxsweden.org",
] as const;

const NAME = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z1-5.]{1,12}$/;

export function parseHttpsOrigin(
  input: string
): { ok: true; origin: string } | { ok: false; reason: string } {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return { ok: false, reason: "origin must be an https URL" };
  }
  if (url.protocol !== "https:") return { ok: false, reason: "origin must be https" };
  if (url.username || url.password) return { ok: false, reason: "origin must not include a password" };
  if (url.pathname !== "/" && url.pathname !== "") return { ok: false, reason: "origin must not include a path" };
  if (url.search || url.hash) return { ok: false, reason: "origin must not include a query" };
  return { ok: true, origin: url.origin };
}

export function actionsUrl(
  origin: string,
  account: string,
  limit: number
): { ok: true; url: string } | { ok: false; reason: string } {
  const parsed = parseHttpsOrigin(origin);
  if (!parsed.ok) return parsed;
  const name = account.trim().toLowerCase();
  if (!NAME.test(name)) return { ok: false, reason: "account must be an Antelope name" };
  if (!Number.isInteger(limit) || limit < 1 || limit > 200) {
    return { ok: false, reason: "limit must be an integer from 1 to 200" };
  }
  const url = new URL("/v2/history/get_actions", `${parsed.origin}/`);
  url.searchParams.set("account", name);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sort", "desc");
  return { ok: true, url: url.toString() };
}
