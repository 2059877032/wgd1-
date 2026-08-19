import { describe, expect, it } from "vitest";
import { gamePortfolio, isIndependentGameUrl } from "./gamePortfolio";

describe("gamePortfolio", () => {
  it("keeps the tank battle as the first featured game and preserves Stellar Fury second", () => {
    expect(gamePortfolio.map((game) => game.id)).toEqual(["tank-defense", "stellar-fury"]);
    expect(gamePortfolio.map((game) => game.order)).toEqual([1, 2]);
  });

  it("uses valid independent HTTPS trial links for both games", () => {
    expect(gamePortfolio.every((game) => isIndependentGameUrl(game.url))).toBe(true);
  });
});
