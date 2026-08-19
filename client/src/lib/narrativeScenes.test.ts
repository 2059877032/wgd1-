import { describe, expect, it } from "vitest";
import { narrativeScenes } from "./narrativeScenes";

describe("narrativeScenes", () => {
  it("provides four ordered 16:9 scene stages after the morning-mist opening", () => {
    expect(narrativeScenes.map((scene) => scene.id)).toEqual([
      "field-collection",
      "cabin-archive",
      "night-tactics",
      "lamp-archive",
    ]);
  });

  it("keeps every scene bound to a storage asset and an existing archive destination", () => {
    narrativeScenes.forEach((scene) => {
      expect(scene.imageSrc).toMatch(/^\/manus-storage\/scene-0[2-5]-/);
      expect(scene.target).toMatch(/^#(reading-rooms|profile|work|contact)$/);
      expect(scene.imageAlt.length).toBeGreaterThan(12);
    });
  });

  it("binds the reviewed night-tactics and lamp-archive motion clips to their matching scenes", () => {
    expect(narrativeScenes[2].motionVideoSrc).toBe("/manus-storage/t04-night-tactics-only_dbb32797.mp4");
    expect(narrativeScenes[3].motionVideoSrc).toBe("/manus-storage/t05-lamp-archive-final_8dfb0e90.mp4");
  });
});
