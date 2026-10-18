/**
 * Types for educational player churn / retention-risk scoring.
 * Soft product analytics — not ground-truth prediction.
 */

export interface PlayerActivityProfile {
  account: string;
  /** Days since last observed action */
  daysSinceLastAction: number;
  /** Actions in last 7 days */
  actionsLast7d: number;
  /** Actions in prior 7-day window (days 8–14) */
  actionsPrior7d: number;
  /** Distinct active days in last 30 days */
  activeDaysLast30: number;
  /** Optional: assets held / interacted (engagement depth proxy) */
  assetTouchLast30?: number;
}

export interface ChurnRiskResult {
  account: string;
  /** 0–100; higher = higher estimated churn risk */
  riskScore: number;
  level: "low" | "moderate" | "high" | "critical";
  components: {
    recency: number;
    frequencyDrop: number;
    consistency: number;
    depth: number;
  };
  flags: ChurnFlag[];
  methodologyNote: string;
}

export type FlagLevel = "info" | "warn" | "alert";

export interface ChurnFlag {
  id: string;
  level: FlagLevel;
  message: string;
  trigger: string;
}

export interface CohortChurnSummary {
  results: ChurnRiskResult[];
  highRiskCount: number;
  avgRisk: number;
}
