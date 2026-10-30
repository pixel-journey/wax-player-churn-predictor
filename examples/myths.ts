export const CHURN_MYTHS = [
  {
    myth: "A high score means the player will never return",
    reality:
      "This is a soft retention-risk heuristic from recent activity features, not a forecast guarantee.",
  },
  {
    myth: "Hyperion sample is a full 30-day archive",
    reality:
      "Live mode uses a limited action page. Sparse samples understate history — treat live scores carefully.",
  },
  {
    myth: "Ban or airdrop solely on this score",
    reality:
      "Use as one product signal among many. Timing-only features miss social and economic context.",
  },
] as const;
