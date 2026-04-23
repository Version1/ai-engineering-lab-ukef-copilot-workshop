"""
Exercise 1: Code quality review with code reviewer agent .

Deliberate issues for participants to find with Copilot:
- Cryptic names (recs, cfg, r, v, thr, mult)
- No validation of inputs (empty list, missing keys, wrong types)
- Possible KeyError if 'id' or 'val' missing
- Magic strings and numbers
- No docstring on the main function
- Division by zero if cfg['mult'] is 0 (depending on usage)
"""


def proc(recs, cfg):
    res = []
    for r in recs:
        if r.get("t") == "A" and r.get("s", 0) > cfg.get("thr", 0):
            v = r["v"] * cfg["mult"]
            if cfg.get("adj"):
                v = v * (1 + r.get("adj_f", 0))
            res.append({"id": r["id"], "val": v, "proc": True})
        elif r.get("t") == "B":
            res.append({"id": r["id"], "val": r["v"], "proc": False})
    return res


def main():
    recs = [
        {"id": 1, "t": "A", "s": 100, "v": 50.0, "adj_f": 0.1},
        {"id": 2, "t": "B", "s": 50, "v": 25.0},
        {"id": 3, "t": "A", "s": 200, "v": 75.0},
    ]
    cfg = {"thr": 75, "mult": 1.5, "adj": True}
    result = proc(recs, cfg)
    print(f"Processed {len(result)} records")
    for item in result:
        print(f"  ID {item['id']}: val={item['val']}, processed={item['proc']}")


if __name__ == "__main__":
    main()
