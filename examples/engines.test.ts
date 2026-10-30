import { describe, expect, it } from "vitest";
import {
  demoActiveProfile,
  demoAtRiskProfile,
  scoreChurnRisk,
  scoreCohort,
} from "./engines";

describe("scoreChurnRisk", () => {
  it("marks at-risk demo high or critical",
    () => {
      const r = scoreChurnRisk(demoAtRiskProfile());
      expect(r.riskScore).toBeGreaterThanOrEqual(60);
      expect(["high", "critical"]).toContain(r.level);
    });

  it("marks active demo low or moderate",
    () => {
      const r = scoreChurnRisk(demoActiveProfile());
      expect(r.riskScore).toBeLessThan(40);
      expect(r.level).toBe("low");
    });

  it("cohort averages",
    () => {
      const c = scoreCohort([demoAtRiskProfile(), demoActiveProfile()]);
      expect(c.results).toHaveLength(2);
      expect(c.highRiskCount).toBeGreaterThanOrEqual(1);
    });
});
