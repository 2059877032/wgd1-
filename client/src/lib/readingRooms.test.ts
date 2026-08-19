import { describe, expect, it } from "vitest";
import { isReadingRoomTarget, readingRooms } from "./readingRooms";

describe("readingRooms", () => {
  it("keeps the three agreed reading rooms in their intended order", () => {
    expect(readingRooms.map((room) => room.title)).toEqual(["药研笔记", "AI 工坊", "表达与策展"]);
    expect(readingRooms.map((room) => room.order)).toEqual([1, 2, 3]);
  });

  it("uses valid in-page targets for every reading room", () => {
    expect(readingRooms.every((room) => isReadingRoomTarget(room.target))).toBe(true);
  });
});
