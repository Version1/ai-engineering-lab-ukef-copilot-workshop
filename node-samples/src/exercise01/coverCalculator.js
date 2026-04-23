/**
 * Exercise 1: Test generation.
 *
 * Calculate the cover amount for a facility based on amount, risk band,
 * and a percentage cap. Used so participants can generate unit tests
 * (happy path, edge cases, invalid input).
 */
import { fileURLToPath } from "node:url";

/**
 * Work out the cover amount from the facility amount and risk band.
 *
 * @param {number} amountGbp - Facility amount in GBP (must be >= 0).
 * @param {string} riskBand - One of "low", "medium", "high".
 * @param {number} percentageCap - Maximum cover as a percentage (0-100).
 * @returns {number} Cover amount in GBP, rounded to 2 decimal places.
 * @throws {Error} If amount is negative, band is invalid, or cap is out of range.
 */
export function calculateCoverAmount(amountGbp, riskBand, percentageCap) {
  if (amountGbp == null || amountGbp < 0) {
    throw new Error("Amount must be non-negative");
  }

  let pct;
  if (riskBand === "low") {
    pct = 50.0;
  } else if (riskBand === "medium") {
    pct = 75.0;
  } else if (riskBand === "high") {
    pct = 90.0;
  } else {
    throw new Error(`Invalid risk band: ${riskBand}`);
  }

  if (
    percentageCap == null ||
    percentageCap < 0 ||
    percentageCap > 100
  ) {
    throw new Error("Percentage cap must be between 0 and 100");
  }

  const effectivePct = Math.min(pct, percentageCap);
  const cover = amountGbp * (effectivePct / 100.0);
  return Math.round(cover * 100) / 100;
}

/**
 * Example usage.
 */
export function main() {
  const result = calculateCoverAmount(100_000.0, "medium", 80.0);
  console.log(`Cover amount: £${result}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
