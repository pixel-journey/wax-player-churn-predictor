# API usage

The churn score stays in `examples/engines.ts`. History is one Hyperion page, not the account's whole life. The profile comment still says the page is not a full 30 days.

`https://wax.eosrio.io` is still named `DEFAULT_HYPERION` so older notes can find it. `get_actions` there returned 404 on 2026-10-26. The live button does not start on it.

Empty custom origin walks, and stops at the first HTTP 200:

1. `https://wax.eosphere.io`
2. `https://wax.eosusa.io`
3. `https://api.waxsweden.org`

Those three returned 200 for a one-row `eosio` history read on 2026-10-26, and `get_info` on each was WAX mainnet. Not a promise they stay up.

The page asks for `limit=200`, which is the ceiling this repo accepts. A custom origin must be `https` with no path or query. Filling it in skips the list.

Docs: [Hyperion v2](https://hyperion.docs.eosrio.io/api/v2/). Asset depth is still omitted. That would be AtomicAssets, a different host, and this page does not call it.
