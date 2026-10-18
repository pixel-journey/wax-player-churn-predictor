# ARCHITECTURE.md — Player Churn Predictor

## Invariants

1. Score pure given PlayerActivityProfile
2. Not presented as guaranteed prediction
3. Component breakdown always available

## Flow

```
Hyperion aggregates → PlayerActivityProfile → scoreChurnRisk / scoreCohort → UI
```

---

*Pixel Journey*
