# wax-player-churn-predictor

> **Status:** 🔄 Promoted from concept (PX Perfection Standard v1.1)  
> **Category:** Gaming / retention analytics  
> **Parent Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

**Goal:** Educational **retention-risk score** from activity features — recency, frequency drop, consistency, engagement depth. Soft product signal, not a guaranteed forecast.

---

## Quick Start

```ts
import { scoreChurnRisk, scoreCohort } from "./examples/engines";

const result = scoreChurnRisk({
  account: "player1",
  daysSinceLastAction: 12,
  actionsLast7d: 2,
  actionsPrior7d: 15,
  activeDaysLast30: 3,
  assetTouchLast30: 1,
});
```

### Weights

| Component | Weight |
|-----------|--------|
| Recency | 35% |
| Frequency drop | 30% |
| Consistency | 25% |
| Depth | 10% |

## License

MIT — **Pixel Journey**

*Promoted from README-only: October 2026*
