import { describe, expect, it } from "vitest";
import { getScrollVideoProgress, getScrollVideoTime } from "./scrollVideo";

describe("scroll video helpers", () => {
  it("maps a section scroll range to a bounded timeline progress", () => {
    expect(getScrollVideoProgress(0, 0, 720)).toBe(0);
    expect(getScrollVideoProgress(360, 0, 720)).toBe(.5);
    expect(getScrollVideoProgress(900, 0, 720)).toBe(1);
    expect(getScrollVideoProgress(-60, 0, 720)).toBe(0);
  });

  it("maps bounded progress to a valid video time", () => {
    expect(getScrollVideoTime(4, 0)).toBe(0);
    expect(getScrollVideoTime(4, .5)).toBe(2);
    expect(getScrollVideoTime(4, 4)).toBe(4);
    expect(getScrollVideoTime(0, .5)).toBe(0);
  });
});
