"""
Challenge 2: Refactoring to meet standards.

This module works but is hard to read and maintain:
- One long function that does validation, filtering, transformation and stats
- Unclear names in places (d, c, t, v)
- Mixed concerns; should be split into smaller functions
- Participants refactor with Copilot and run tests after each change.
"""


def process_and_aggregate(data, config):
    """
    Process records and return transformed data plus summary stats.

    Args:
        data: List of dicts with 'value' and optional 'id', 'status'.
        config: Dict with 'min_value', 'multiplier', optional 'status_filter'.

    Returns:
        Dict with 'items' (list of processed items) and 'stats' (count, total, average).
    """
    min_val = config.get("min_value", 0)
    mult = config.get("multiplier", 1.0)
    status_filter = config.get("status_filter")

    if not data or not isinstance(data, list):
        return {"items": [], "stats": {"count": 0, "total": 0.0, "average": 0.0}}

    items = []
    total = 0.0
    count = 0

    for d in data:
        if not isinstance(d, dict) or "value" not in d:
            continue
        v = d["value"]
        if status_filter and d.get("status") != status_filter:
            continue
        if v < min_val:
            continue
        new_v = v * mult
        total += new_v
        count += 1
        items.append({"id": d.get("id", "unknown"), "value": round(new_v, 2)})

    avg = total / count if count > 0 else 0.0
    return {
        "items": items,
        "stats": {"count": count, "total": round(total, 2), "average": round(avg, 2)},
    }


def main():
    """Example usage."""
    data = [
        {"id": "a", "value": 100, "status": "active"},
        {"id": "b", "value": 50, "status": "active"},
        {"id": "c", "value": 200, "status": "pending"},
    ]
    config = {"min_value": 40, "multiplier": 1.1, "status_filter": "active"}
    result = process_and_aggregate(data, config)
    print("Stats:", result["stats"])
    for item in result["items"]:
        print(f"  {item['id']}: {item['value']}")


if __name__ == "__main__":
    main()