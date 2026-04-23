"""
Tests for aggregator. Used in Exercise 2 so participants can refactor
and run tests after each change.
"""
import pytest
from ukef_samples.exercise02.aggregator import process_and_aggregate


def test_empty_data_returns_empty_result():
    result = process_and_aggregate([], {"min_value": 0})
    assert result["items"] == []
    assert result["stats"]["count"] == 0
    assert result["stats"]["total"] == 0.0
    assert result["stats"]["average"] == 0.0


def test_filters_by_min_value():
    data = [{"id": "1", "value": 100}, {"id": "2", "value": 20}]
    result = process_and_aggregate(data, {"min_value": 50, "multiplier": 1.0})
    assert len(result["items"]) == 1
    assert result["items"][0]["value"] == 100
    assert result["stats"]["count"] == 1
    assert result["stats"]["total"] == 100.0


def test_applies_multiplier():
    data = [{"id": "1", "value": 100.0}]
    result = process_and_aggregate(data, {"min_value": 0, "multiplier": 1.5})
    assert result["items"][0]["value"] == 150.0
    assert result["stats"]["total"] == 150.0


def test_status_filter():
    data = [
        {"id": "a", "value": 50, "status": "active"},
        {"id": "b", "value": 50, "status": "pending"},
    ]
    result = process_and_aggregate(
        data, {"min_value": 0, "multiplier": 1.0, "status_filter": "active"}
    )
    assert len(result["items"]) == 1
    assert result["items"][0]["id"] == "a"
