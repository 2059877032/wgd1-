import { describe, expect, it } from "vitest";
import { featuredWork } from "./featuredWork";

describe("featuredWork", () => {
  it("keeps the strongest work first and the three-card order stable", () => {
    expect(featuredWork.map((item) => item.id)).toEqual(["tank", "ppt", "stellar"]);
    expect(featuredWork[0].target).toBe("external");
    expect(featuredWork[1].target).toBe("archive");
  });

  it("gives each card a concise label and an actionable summary", () => {
    expect(featuredWork).toHaveLength(3);
    for (const item of featuredWork) {
      expect(item.kind.length).toBeGreaterThan(0);
      expect(item.summary.length).toBeGreaterThan(0);
      expect(item.action.length).toBeGreaterThan(0);
    }
  });
});
