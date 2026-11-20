import { describe, expect, it } from "vitest";
import { HISTORY_ORIGINS, actionsUrl, parseHttpsOrigin } from "./origins";

describe("history origins", () => {
  it("accepts an https origin and rejects a path", () => {
    expect(parseHttpsOrigin("https://wax.eosphere.io").ok).toBe(true);
    expect(parseHttpsOrigin("https://wax.eosphere.io/v2").ok).toBe(false);
    expect(parseHttpsOrigin("http://wax.eosphere.io").ok).toBe(false);
  });

  it("builds one history page and keeps the known-good list first", () => {
    const row = actionsUrl("https://wax.eosphere.io", "EOSIO", 1);
    expect(row.ok).toBe(true);
    if (!row.ok) return;
    expect(row.url).toBe(
      "https://wax.eosphere.io/v2/history/get_actions?account=eosio&limit=1&sort=desc",
    );
    expect(actionsUrl("https://wax.eosrio.io", "eosio", 201).ok).toBe(false);
    expect(HISTORY_ORIGINS[0]).toBe("https://wax.eosphere.io");
    expect(HISTORY_ORIGINS.includes("https://wax.eosrio.io" as never)).toBe(false);
  });
});
