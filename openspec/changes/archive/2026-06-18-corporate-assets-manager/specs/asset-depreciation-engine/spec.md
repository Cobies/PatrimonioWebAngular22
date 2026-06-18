# Asset Depreciation Engine Specification

## Purpose
Perform yearly straight-line depreciation calculations for assets.

## Requirements

### Requirement: Depreciation-Calculation
The system MUST calculate yearly straight-line depreciation: $(Purchase Value - Residual Value) / Useful Life$.

#### Scenario: Calculate Yearly Depreciation
- GIVEN an asset with value $10000, residual $2000, and useful life 5 years
- WHEN the engine runs calculations
- THEN the system MUST return yearly depreciation of $1600

### Requirement: Calculation-Sanity-Check
The system MUST prevent calculations if useful life is less than or equal to 0, or residual value exceeds purchase value.

#### Scenario: Invalid Inputs Prevented
- GIVEN useful life is set to 0 years
- WHEN the calculation engine validates inputs
- THEN the system MUST raise a validation error and SHALL NOT perform calculations
