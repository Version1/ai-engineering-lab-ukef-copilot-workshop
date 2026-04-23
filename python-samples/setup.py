"""Setup for UKEF Enablement Day Python samples."""
from setuptools import setup, find_packages

setup(
    name="ukef-enablement-day-samples",
    version="1.0.0",
    description="Sample code for UKEF AI Enablement Day exercises",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    python_requires=">=3.8",
)
