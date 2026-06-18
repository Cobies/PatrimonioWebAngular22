# Asset Dashboard Specification

## Purpose
Provide visual insights and multi-currency valuations of assets.

## Requirements

### Requirement: Dashboard-Metrics-Charts
The system MUST render asset distribution and depreciation charts.

#### Scenario: Render Charts with Data
- GIVEN preloaded realistic mock asset data is present
- WHEN the dashboard loads
- THEN the system MUST render SVG charts displaying asset metrics

### Requirement: Multi-Currency-Toggle
The system MUST support a multi-currency toggle (USD, EUR, ARS) and update all valuations dynamically using mock rates.

#### Scenario: Toggle Valuation Currency
- GIVEN an asset valued at $1000 USD and EUR mock rate is 0.9
- WHEN the user selects EUR from currency toggle
- THEN the system MUST convert and display the asset value as €900
