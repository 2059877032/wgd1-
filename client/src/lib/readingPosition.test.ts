import { describe, expect, it } from "vitest";
import { getRestoredReadingPosition } from "./readingPosition";

describe("getRestoredReadingPosition", () => {
  it("保留处于页面可滚动范围内的阅读位置", () => {
    expect(getRestoredReadingPosition(640, 2400, 800)).toBe(640);
  });

  it("将过期、负数或无效的位置限制为可用范围", () => {
    expect(getRestoredReadingPosition(2200, 2400, 800)).toBe(1600);
    expect(getRestoredReadingPosition(-24, 2400, 800)).toBe(0);
    expect(getRestoredReadingPosition(Number.NaN, 2400, 800)).toBe(0);
  });
});
