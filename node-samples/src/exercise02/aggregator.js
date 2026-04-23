/**
 * Challenge 2: Refactoring to meet standards.
 *
 * This module works but is hard to read and maintain:
 * - One long function that does validation, filtering, transformation and stats
 * - Unclear names in places (d, v, new_v)
 * - Mixed concerns; should be split into smaller functions
 * Participants refactor with Copilot and run tests after each change.
 */
import { fileURLToPath } from "node:url";

/**
 * Process records and return transformed data plus summary stats.
 *
 * @param {Array<{id?: string, value: number, status?: string}>} data - Records with value and optional id, status.
 * @param {{min_value?: number, multiplier?: number, status_filter?: string}} config - Config.
 * @returns {{items: Array<{id: string, value: number}>, stats: {count: number, total: number, average: number}}}
 */
export function processAndAggregate(data, config) {
  const minVal = config.min_value ?? 0;
  const mult = config.multiplier ?? 1.0;
  const statusFilter = config.status_filter;

  if (!data || !Array.isArray(data)) {
    return {
      items: [],
      stats: { count: 0, total: 0, average: 0 },
    };
  }

  const items = [];
  let total = 0;
  let count = 0;

  for (const d of data) {
    if (!d || typeof d !== "object" || typeof d.value !== "number") {
      continue;
    }
    const v = d.value;
    if (statusFilter != null && d.status !== statusFilter) {
      continue;
    }
    if (v < minVal) {
      continue;
    }
    const newV = v * mult;
    total += newV;
    count += 1;
    items.push({
      id: d.id ?? "unknown",
      value: Math.round(newV * 100) / 100,
    });
  }

  const avg = count > 0 ? total / count : 0;
  return {
    items,
    stats: {
      count,
      total: Math.round(total * 100) / 100,
      average: Math.round(avg * 100) / 100,
    },
  };
}

export function main() {
  const data = [
    { id: "a", value: 100, status: "active" },
    { id: "b", value: 50, status: "active" },
    { id: "c", value: 200, status: "pending" },
  ];
  const config = {
    min_value: 40,
    multiplier: 1.1,
    status_filter: "active",
  };
  const result = processAndAggregate(data, config);
  console.log("Stats:", result.stats);
  for (const item of result.items) {
    console.log(`  ${item.id}: ${item.value}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();