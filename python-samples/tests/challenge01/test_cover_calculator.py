"""
Tests for cover_calculator. Participants use Exercise 1 to add more tests
(happy path, edge cases, errors) with Copilot.
"""
import pytest
from ukef_samples.exercise01.cover_calculator import calculate_cover_amount


def test_medium_band_respects_cap():
    """Cover at 75% medium band capped at 50% gives 50% of amount."""
    assert calculate_cover_amount(100_000.0, "medium", 50.0) == 50_000.0


def test_low_band_no_cap():
    """Low band 50%, cap 100%, so full 50% of amount."""
    assert calculate_cover_amount(10_000.0, "low", 100.0) == 5_000.0
