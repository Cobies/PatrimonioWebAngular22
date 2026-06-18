# Proposal: Corporate Assets Manager

## Intent
Provide a corporate asset management dashboard in the Angular app to track and analyze physical and non-physical assets, their depreciation, and valuations in multiple currencies.

## Scope

### In Scope
- Interactive charts (asset type distribution, depreciation trends).
- CRUD operations for assets with LocalStorage persistence.
- Straight-line depreciation calculation engine.
- Multi-currency header toggle (USD, EUR, Local currency) with mock conversion rates.
- Preloaded realistic mock data.

### Out of Scope
- Backend database integration or API sync.
- Real-time or external exchange rate API calls.

## Capabilities

### New Capabilities
- `asset-management`: CRUD operations, data validation, and LocalStorage persistence for physical/non-physical assets.
- `asset-depreciation-engine`: Automated straight-line depreciation calculations based on purchase value, residual value, and useful life.
- `asset-dashboard`: Visual charts for asset distribution, depreciation trajectory, and multi-currency valuation toggle.

### Modified Capabilities
- None

## Approach
- State: Angular Signals for managing local state (assets list, selected currency).
- Components: Container-Presentational pattern. Main layout shell with currency toggle, child list, form, and chart components.
- Charts: Lightweight SVG-based custom charts or simple Canvas/SVG elements to avoid heavy external libraries.
- Calculation: Pure TypeScript service for straight-line depreciation: $Depreciation = (Value - Residual) / Useful Life$.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/` | New/Modified | Add asset services, components, models, and integrate into main app layout |
| `src/app/app.routes.ts` | Modified | Add route mapping for the dashboard and CRUD screens |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| LocalStorage storage limits | Low | Keep mock data under 1MB; validate payload sizes |
| Chart rendering performance | Low | Use SVG/CSS transitions for lightweight, native charting |

## Rollback Plan
- Revert all added components and service files under `src/app/` using Git.
- Restore the original `app.routes.ts` and `app.html` templates.

## Dependencies
- None

## Success Criteria
- [ ] CRUD operations persist correctly across page reloads.
- [ ] Depreciation calculations match straight-line formula values.
- [ ] Currency toggle updates all dashboard valuations dynamically.

## Proposal Question Round

### Proposed Assumptions for Review
1. **Depreciation Period**: Straight-line calculations will default to yearly increments. Is this acceptable, or is monthly granularity required?
2. **Asset Fields**: Do non-physical assets (e.g., patents, cloud subs) require distinct fields compared to physical assets (e.g., location, serial number)? We assume a unified schema with optional fields.
3. **Local Currency**: What is the default "Local" currency? We assume ARS (Argentine Peso) as default local currency, given workspace context, but customizable.
4. **Interactive Charts**: Since external heavy libraries are out of scope for a simple layout, are custom SVG charts acceptable? We assume yes for performance and clean UI styling.
