# AI handoff — player churn risk

## Non-negotiables

1. Weights: recency **35%**, drop **30%**, consistency **25%**, depth **10%**.
2. Silent fixture → **79** / `high`. Critical band starts at **80** (silent is high, not critical).
3. Active fixture → **8** / `low`.
4. Cohort mean of both fixtures → **44**.
5. History URL builders: https origin only, no path, limit ≤200, unsent.
6. Not a live retention dashboard and not a ban list.

## Prompt seeds

- "Silent fixture — score and band."
- "Why is 79 high and not critical?"
- "Cohort mean of silent + active."
- "Refuse treating the score as an automatic account freeze."

## Do not

- Fetch live player profiles in unit tests.
- Move the critical threshold without updating tests.
