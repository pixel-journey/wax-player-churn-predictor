# Education — a weighted score, not a forecast

> **Rung:** `npm test` passes. The weights are recency 35%, frequency drop 30%, consistency 25%, depth 10%. This is not a model trained on players, and it does not read Hyperion.  
> **The test is the rule.** The same host rules, also locked, are in [wax-behavioral-anomaly-detector](https://github.com/pixel-journey/wax-behavioral-anomaly-detector).

## Predict, then run

`critical` starts at 80. The silent fixture lands at 79, so it is `high`, not `critical`. The old test allowed either.

The fixture labels `player_at_risk` and `player_active` are 14 and 13 characters. An Antelope name is at most 12. They are labels. `actionsUrl` in this same repo would refuse both.

| Fixture | Locked result |
| --- | --- |
| 18 days silent, 1 action after 14, 2 active days, 0 asset touches | score `79`, level `high`, components recency `80`, drop `85`, consistency `75`, depth `70`. Flags `silent`, `sharp-drop`, `sparse`. |
| 0 days silent, 20 actions after 18, 14 active days, 12 touches | score `8`, level `low`, flag `healthy` |
| both, as a cohort | one high score. Average `round((79 + 8) / 2)` is `44`. |

Recency for 18 days is `0.8` because the band is 15 to 30 days. One action after fourteen is a ratio under `0.25`, so the drop component is `0.85`. Two active days is `0.75`. Zero touches is `0.7`.

`0.8×0.35 + 0.85×0.30 + 0.75×0.25 + 0.7×0.10 = 0.7925`, and `round(79.25)` is `79`.

## History hosts this file will build, and will not call

`examples/live/origins.test.ts` was `node:test`, so Vitest reported "no test suite" and `npm test` failed. It is a Vitest file now.

| Call | Locked result |
| --- | --- |
| `https://wax.eosphere.io` | ok |
| the same origin plus `/v2` | not ok |
| `http://` | not ok |
| `actionsUrl(..., "EOSIO", 1)` | account `eosio`, limit `1` |
| limit `201` | not ok |

These URLs are built and not requested. A score of 79 is not a reason to message that label.
