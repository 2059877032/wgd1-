import { describe, expect, it } from "vitest";
import { getBoundedPptPageIndex, initializePptPageLoadStates } from "./pptArchive";

describe("getBoundedPptPageIndex", () => {
  it("keeps a requested page inside the available page range", () => {
    expect(getBoundedPptPageIndex(6, 20)).toBe(6);
    expect(getBoundedPptPageIndex(-1, 20)).toBe(0);
    expect(getBoundedPptPageIndex(99, 20)).toBe(19);
  });

  it("returns the first page index when no valid page total exists", () => {
    expect(getBoundedPptPageIndex(3, 0)).toBe(0);
    expect(getBoundedPptPageIndex(3, Number.NaN)).toBe(0);
  });
});

describe("initializePptPageLoadStates", () => {
  it("initializes every untracked thumbnail as loading without overwriting resolved states", () => {
    expect(initializePptPageLoadStates({ 0: "ready", 2: "error" }, 4)).toEqual({
      0: "ready",
      1: "loading",
      2: "error",
      3: "loading",
    });
  });

  it("leaves state unchanged for invalid page totals", () => {
    expect(initializePptPageLoadStates({ 0: "ready" }, 0)).toEqual({ 0: "ready" });
  });
});
