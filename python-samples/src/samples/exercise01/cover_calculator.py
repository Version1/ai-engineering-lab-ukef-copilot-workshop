"""
Exercise 1: Test generation.

Calculate the cover amount for a facility based on amount, risk band,
and a percentage cap. Used so participants can generate unit tests
(happy path, edge cases, invalid input).
"""


def calculate_cover_amount(amount_gbp, risk_band, percentage_cap):
    """
    Work out the cover amount from the facility amount and risk band.

    Args:
        amount_gbp: Facility amount in GBP (must be >= 0).
        risk_band: One of "low", "medium", "high" (percentage of amount covered).
        percentage_cap: Maximum cover as a percentage (0-100), applied after band.

    Returns:
        Cover amount in GBP, rounded to 2 decimal places.

    Raises:
        ValueError: If amount is negative, band is invalid, or cap is out of range.
    """
    if amount_gbp is None or amount_gbp < 0:
        raise ValueError("Amount must be non-negative")

    if risk_band == "low":
        pct = 50.0
    elif risk_band == "medium":
        pct = 75.0
    elif risk_band == "high":
        pct = 90.0
    else:
        raise ValueError(f"Invalid risk band: {risk_band}")

    if percentage_cap is None or percentage_cap < 0 or percentage_cap > 100:
        raise ValueError("Percentage cap must be between 0 and 100")

    effective_pct = min(pct, percentage_cap)
    cover = amount_gbp * (effective_pct / 100.0)
    return round(cover, 2)


def main():
    """Example usage."""
    result = calculate_cover_amount(100_000.0, "medium", 80.0)
    print(f"Cover amount: £{result}")


if __name__ == "__main__":
    main()
