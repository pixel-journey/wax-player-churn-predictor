# Security — weighted churn score

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Silent fixture | score **79**, level **high** (not critical; critical ≥**80**) |
| Active fixture | score **8**, low |
| Origin with path / http / limit 201 | refused in URL builders |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Live history | Builders are unsent |
| Messaging players | Score is not authorization |
| PII | Do not store fixture labels as accounts |
| Model claims | Weighted score, not a trained model |

## Attack angles

1. Auto-DM on score ≥70 without human review.  
2. Treating labels as Antelope names.  
3. Claiming a trained model.  
4. Banning accounts from a soft score alone.  
5. Confusing high (79) with critical (≥80).

## Honesty limits

No network on the score path.

| Sibling | Distinction |
| --- | --- |
| [behavioral anomaly](https://github.com/pixel-journey/wax-behavioral-anomaly-detector) | Soft anomaly labels |
| [velocity scatter](https://github.com/pixel-journey/wax-collection-velocity-scatter-plot) | hold/velocity quadrants |

[docs.wax.io](https://docs.wax.io/).
