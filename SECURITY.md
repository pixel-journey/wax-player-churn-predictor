# Security — weighted churn score

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Silent fixture | score 79, level **high** (not critical; critical ≥80) |
| Active fixture | score 8, low |
| Origin with path / http / limit 201 | refused in URL builders |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Live history | Builders are unsent |
| Messaging players | Score is not authorization |
| PII | Do not store fixture labels as accounts |

## Attack angles

1. Auto-DM on score ≥70 without human review.  
2. Treating labels as Antelope names.  
3. Claiming a trained model.

## Honesty limits

No network on the score path. [docs.wax.io](https://docs.wax.io/) · [anomaly detector](https://github.com/pixel-journey/wax-behavioral-anomaly-detector).
