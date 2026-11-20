import { describe, expect, it } from "vitest";
import {
  demoActiveProfile,
  demoAtRiskProfile,
  scoreChurnRisk,
  scoreCohort,
} from "./engines";

describe("scoreChurnRisk", () => {
  it("locks the silent fixture at 79, one point under critical", () => {
    const r = scoreChurnRisk(demoAtRiskProfile());
    expect(r.riskScore).toBe(79);
    expect(r.level).toBe("high");
    expect(r.components).toEqual({
      recency: 80,
      frequencyDrop: 85,
      consistency: 75,
      depth: 70,
    });
    expect(r.flags.map((flag) => flag.id)).toEqual(["silent", "sharp-drop", "sparse"]);
  });

  it("locks the active fixture at 8", () => {
    const r = scoreChurnRisk(demoActiveProfile());
    expect(r.riskScore).toBe(8);
    expect(r.level).toBe("low");
    expect(r.flags.map((flag) => flag.id)).toEqual(["healthy"]);
  });

  it("averages the two fixtures to 44 and counts one high score", () => {
    const c = scoreCohort([demoAtRiskProfile(), demoActiveProfile()]);
    expect(c.results).toHaveLength(2);
    expect(c.highRiskCount).toBe(1);
    expect(c.avgRisk).toBe(44);
  });
});
