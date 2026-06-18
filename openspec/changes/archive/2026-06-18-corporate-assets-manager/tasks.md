# Tasks: Corporate Assets Manager

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 1000-1300 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Services & Core) → PR 2 (Components & Layout) |
| Delivery strategy | exception-ok |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: size-exception
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Create model, services, and core tests | PR 1 | Base branch; tests/docs included |
| 2 | Create list, form, SVG charts, and views | PR 2 | Depends on PR 1; includes routing, HTML shell cleanup |

## Phase 1: Foundation (Models & Setup)

- [x] 1.1 Create `src/app/models/asset.model.ts` defining `Asset`, `Currency`, and `DepreciationPoint` interfaces.
- [x] 1.2 Add realistic mock data constants for 5+ assets (physical and non-physical) to initialize state.

## Phase 2: Core Services (Logic & State)

- [x] 2.1 Create `src/app/services/depreciation.service.ts` for straight-line math calculations and input validation.
- [x] 2.2 Create `src/app/services/asset.service.ts` using Signals to handle LocalStorage CRUD operations and currency conversion.

## Phase 3: UI Components (Presentational Layers)

- [x] 3.1 Create `src/app/components/asset-list/asset-list.component.ts` presentational table with search, filtering, and edit/delete events.
- [x] 3.2 Create `src/app/components/asset-form/asset-form.component.ts` modal/form dialog with validation logic.
- [x] 3.3 Create `src/app/components/charts/bar-chart.component.ts` displaying category distribution using responsive SVGs.
- [x] 3.4 Create `src/app/components/charts/area-chart.component.ts` displaying depreciation curves over time using responsive SVGs.

## Phase 4: Routing/Integration (Containers & Shell)

- [x] 4.1 Create `src/app/components/dashboard/dashboard.component.ts` container coordinating state signals and currency toggles.
- [x] 4.2 Modify `src/app/app.routes.ts` mapping default empty route (`''`) to load `DashboardComponent`.
- [x] 4.3 Edit `src/app/app.html` to clean default boilerplate and keep only the `<router-outlet>` container.

## Phase 5: Testing (Validation)

- [x] 5.1 Implement unit tests in `src/app/services/depreciation.service.spec.ts` validating straight-line depreciation formula and negative constraints.
- [x] 5.2 Implement unit tests in `src/app/services/asset.service.spec.ts` validating signal values, storage synchronization, and CRUD states.
- [x] 5.3 Implement component rendering unit tests for custom SVG charts verifying heights and paths match mock data points.

## Phase 6: Polish (Cleanup)

- [x] 6.1 Clean up debug logs and verify CSS styling under Tailwind CSS v4.
- [x] 6.2 Document depreciation service logic and signal state conventions in README or code comments.

