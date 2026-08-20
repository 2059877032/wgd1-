import { describe, expect, it } from "vitest";
import { morningMistScene } from "./morningMistScene";

describe("morningMistScene", () => {
  it("keeps T01 start and end frames, its motion video, and descriptive alt text available", () => {
    expect(morningMistScene.forestSrc).toMatch(/\/media\/t01-morning-path_.+\.png$/);
    expect(morningMistScene.endFrameSrc).toMatch(/\/media\/t01-herb-sample_.+\.png$/);
    expect(morningMistScene.motionVideoSrc).toMatch(/\/media\/t01-walk-to-herb_.+\.mp4$/);
    expect(morningMistScene.researcherSrc).toMatch(/\/media\/herbal-researcher-character_.+\.png$/);
    expect(morningMistScene.forestAlt).toContain("药草研究员");
    expect(morningMistScene.researcherAlt).toContain("药草研究员");
  });
});
