/**
 * Exercise 1: Code quality review with code reviewer agent
 *
 * Deliberate issues for participants to find with Copilot:
 * - Cryptic names (recs, cfg, r, v, thr, mult)
 * - No validation of inputs (empty list, missing keys, wrong types)
 * - Possible errors if 'id' or 'val' missing
 * - Magic strings and numbers
 * - No docstring on the main function
 */
import { fileURLToPath } from "node:url";

export function proc(recs, cfg) {
  const res = [];
  for (const r of recs) {
    if (r.t === "A" && (r.s ?? 0) > (cfg.thr ?? 0)) {
      let v = r.v * cfg.mult;
      if (cfg.adj) {
        v = v * (1 + (r.adj_f ?? 0));
      }
      res.push({ id: r.id, val: v, proc: true });
    } else if (r.t === "B") {
      res.push({ id: r.id, val: r.v, proc: false });
    }
  }
  return res;
}

export function main() {
  const recs = [
    { id: 1, t: "A", s: 100, v: 50.0, adj_f: 0.1 },
    { id: 2, t: "B", s: 50, v: 25.0 },
    { id: 3, t: "A", s: 200, v: 75.0 },
  ];
  const cfg = { thr: 75, mult: 1.5, adj: true };
  const result = proc(recs, cfg);
  console.log(`Processed ${result.length} records`);
  for (const item of result) {
    console.log(`  ID ${item.id}: val=${item.val}, processed=${item.proc}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
