import assert from "node:assert/strict";
import { test } from "node:test";
import { HISTORY_ORIGINS, actionsUrl, parseHttpsOrigin } from "./origins.ts";

test("accepts an https origin and rejects a path", () => {
  assert.equal(parseHttpsOrigin("https://wax.eosphere.io").ok, true);
  assert.equal(parseHttpsOrigin("https://wax.eosphere.io/v2").ok, false);
  assert.equal(parseHttpsOrigin("http://wax.eosphere.io").ok, false);
});

test("builds one history page and keeps the known-good list first", () => {
  const row = actionsUrl("https://wax.eosphere.io", "EOSIO", 1);
  assert.equal(row.ok, true);
  if (!row.ok) return;
  assert.equal(
    row.url,
    "https://wax.eosphere.io/v2/history/get_actions?account=eosio&limit=1&sort=desc"
  );
  assert.equal(actionsUrl("https://wax.eosrio.io", "eosio", 201).ok, false);
  assert.equal(HISTORY_ORIGINS[0], "https://wax.eosphere.io");
  assert.equal(HISTORY_ORIGINS.includes("https://wax.eosrio.io" as never), false);
});
