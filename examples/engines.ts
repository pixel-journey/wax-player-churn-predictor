/**
 * Pure educational churn-risk scoring from activity features.
 * Weighted heuristics — not ML, not guaranteed prediction.
 */

import type {
  ChurnFlag,
  ChurnRiskResult,
  CohortChurnSummary,
  PlayerActivityProfile,
} from "./types";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

/** Recency risk: long silence → high */
export function scoreRecency(daysSinceLastAction: number): number {
  if (daysSinceLastAction <= 1) return 0.05;
  if (daysSinceLastAction <= 3) return 0.15;
  if (daysSinceLastAction <= 7) return 0.35;
  if (daysSinceLastAction <= 14) return 0.6;
  if (daysSinceLastAction <= 30) return 0.8;
  return 0.95;
}

/** Frequency drop: prior active, recent quiet → high */
export function scoreFrequencyDrop(
  actionsLast7d: number,
  actionsPrior7d: number
): number {
  if (actionsPrior7d <= 0 && actionsLast7d <= 0) return 0.7;
  if (actionsPrior7d <= 0) return actionsLast7d > 0 ? 0.1 : 0.7;
  const ratio = actionsLast7d / actionsPrior7d;
  if (ratio >= 1) return 0.1;
  if (ratio >= 0.5) return 0.35;
  if (ratio >= 0.25) return 0.55;
  return 0.85;
}

/** Consistency: few active days in 30 → higher risk */
export function scoreConsistency(activeDaysLast30: number): number {
  if (activeDaysLast30 >= 12) return 0.1;
  if (activeDaysLast30 >= 6) return 0.3;
  if (activeDaysLast30 >= 3) return 0.55;
  if (activeDaysLast30 >= 1) return 0.75;
  return 0.95;
}

/** Depth: low asset touches → mild risk contribution */
export function scoreDepth(assetTouchLast30: number | undefined): number {
  if (assetTouchLast30 === undefined) return 0.25;
  if (assetTouchLast30 >= 10) return 0.05;
  if (assetTouchLast30 >= 3) return 0.2;
  if (assetTouchLast30 >= 1) return 0.45;
  return 0.7;
}

export function scoreChurnRisk(
  profile: PlayerActivityProfile
): ChurnRiskResult {
  const recency = scoreRecency(profile.daysSinceLastAction);
  const frequencyDrop = scoreFrequencyDrop(
    profile.actionsLast7d,
    profile.actionsPrior7d
  );
  const consistency = scoreConsistency(profile.activeDaysLast30);
  const depth = scoreDepth(profile.assetTouchLast30);

  // Weights: recency 35%, frequency drop 30%, consistency 25%, depth 10%
  const risk01 =
    recency * 0.35 +
    frequencyDrop * 0.3 +
    consistency * 0.25 +
    depth * 0.1;
  const riskScore = Math.round(clamp01(risk01) * 100);

  let level: ChurnRiskResult["level"] = "low";
  if (riskScore >= 80) level = "critical";
  else if (riskScore >= 60) level = "high";
  else if (riskScore >= 40) level = "moderate";

  return {
    account: profile.account,
    riskScore,
    level,
    components: {
      recency: Math.round(recency * 100),
      frequencyDrop: Math.round(frequencyDrop * 100),
      consistency: Math.round(consistency * 100),
      depth: Math.round(depth * 100),
    },
    flags: buildChurnFlags(profile, riskScore),
    methodologyNote:
      "Weighted heuristics: recency 35%, frequency drop 30%, consistency 25%, depth 10%. Educational retention risk — not a forecast guarantee.",
  };
}

export function buildChurnFlags(
  profile: PlayerActivityProfile,
  riskScore: number
): ChurnFlag[] {
  const flags: ChurnFlag[] = [];

  if (profile.daysSinceLastAction >= 14) {
    flags.push({
      id: "silent",
      level: "alert",
      message: `No activity for ${profile.daysSinceLastAction} days.`,
      trigger: "daysSinceLastAction",
    });
  }

  if (
    profile.actionsPrior7d >= 5 &&
    profile.actionsLast7d <= profile.actionsPrior7d * 0.25
  ) {
    flags.push({
      id: "sharp-drop",
      level: "warn",
      message: "Sharp drop in weekly actions vs prior week.",
      trigger: "actionsLast7d/actionsPrior7d",
    });
  }

  if (profile.activeDaysLast30 <= 2) {
    flags.push({
      id: "sparse",
      level: "warn",
      message: "Very few active days in the last 30.",
      trigger: "activeDaysLast30",
    });
  }

  if (riskScore < 40) {
    flags.push({
      id: "healthy",
      level: "info",
      message: "Risk components look relatively healthy under this model.",
      trigger: "riskScore",
    });
  }

  if (flags.length === 0) {
    flags.push({
      id: "neutral",
      level: "info",
      message: "No extreme component flags.",
      trigger: "overall",
    });
  }

  return flags;
}

export function scoreCohort(
  profiles: PlayerActivityProfile[]
): CohortChurnSummary {
  const results = profiles.map(scoreChurnRisk);
  const highRiskCount = results.filter(
    (r) => r.level === "high" || r.level === "critical"
  ).length;
  const avgRisk =
    results.length === 0
      ? 0
      : Math.round(
          results.reduce((s, r) => s + r.riskScore, 0) / results.length
        );
  return { results, highRiskCount, avgRisk };
}

export function demoAtRiskProfile(): PlayerActivityProfile {
  return {
    account: "player_at_risk",
    daysSinceLastAction: 18,
    actionsLast7d: 1,
    actionsPrior7d: 14,
    activeDaysLast30: 2,
    assetTouchLast30: 0,
  };
}

export function demoActiveProfile(): PlayerActivityProfile {
  return {
    account: "player_active",
    daysSinceLastAction: 0,
    actionsLast7d: 20,
    actionsPrior7d: 18,
    activeDaysLast30: 14,
    assetTouchLast30: 12,
  };
}
