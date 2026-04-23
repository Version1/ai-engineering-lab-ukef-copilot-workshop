/**
 * Tests for coverCalculator. Participants use Exercise 1 to add more tests
 * (happy path, edge cases, errors) with Copilot.
 */
import { describe, it } from "node:test";
import assert from "node:assert";
import { calculateCoverAmount } from "../../src/exercise01/coverCalculator.js";

describe("calculateCoverAmount", () => {
  it("medium band respects cap: 75% capped at 50% gives 50% of amount", () => {
    assert.strictEqual(
      calculateCoverAmount(100_000, "medium", 50),
      50_000
    );
  });

  it("low band with cap 100% gives full 50% of amount", () => {
    assert.strictEqual(
      calculateCoverAmount(10_000, "low", 100),
      5_000
    );
});
