# Education — a weighted score, not a forecast

> **Rung:** `npm test` passes. Weights: recency 35%, frequency drop 30%, consistency 25%, depth 10%. Not a model trained on players. Does not read Hyperion.  
> **The test is the rule.** Host rules also locked in [wax-behavioral-anomaly-detector](https://github.com/pixel-journey/wax-behavioral-anomaly-detector).

Official context: [docs.wax.io](https://docs.wax.io/).

## Learning outcomes

| Level | After this file |
| --- | --- |
| Beginner | Silent fixture → 79 high; active → 8 low |
| Intermediate | Rebuild the weighted sum to 79 |
| Masterclass | Labels are not Antelope names; score is not a message trigger |

---

## Beginner — one scene

`critical` starts at **80**. The silent fixture lands at **79**, so it is `high`, not `critical`.

| Fixture | Locked result |
| --- | --- |
| 18 days silent, 1 action after 14, 2 active days, 0 asset touches | score `79`, level `high`, flags `silent`, `sharp-drop`, `sparse` |
| 0 days silent, 20 actions after 18, 14 active days, 12 touches | score `8`, level `low`, flag `healthy` |
| both as a cohort | average `round((79 + 8) / 2)` = `44` |

```bash
npm test
```

---

## Intermediate — the arithmetic

Recency for 18 days → `0.8` (band 15..30). One action after fourteen → drop `0.85`. Two active days → `0.75`. Zero touches → `0.7`.

```text
0.8×0.35 + 0.85×0.30 + 0.75×0.25 + 0.7×0.10 = 0.7925 → round 79
```

Fixture labels `player_at_risk` / `player_active` are longer than 12 characters. They are **labels**, not account names. `actionsUrl` in this repo would refuse both as accounts.

### History hosts (built, not called)

| Call | Locked result |
| --- | --- |
| `https://wax.eosphere.io` | ok |
| origin plus `/v2` | not ok |
| `http://` | not ok |
| limit `201` | not ok |

### Attack → test

| Attack | Lab behavior |
| --- | --- |
| Treat 79 as critical | critical starts at **80** |
| Call it a trained model | fixed weights only |
| Use fixture labels as accounts | refused by name rules |
| Message from score alone | soft signal only |

---

## Masterclass

### Common mistakes

1. Messaging every score ≥79 as "critical." Critical starts at 80.  
2. Training language (“model predicts churn”) for a fixed weighted sum.  
3. Using fixture labels as chain account names.

### Exercises

1. Silent score and level? (**79, high**.)  
2. Is 79 critical? (**No**.)  
3. Cohort average of 79 and 8? (**44**.)

---

## What this course will not teach

- A production churn model
- Live Hyperion scoring
- That a high score authorizes outreach automation
