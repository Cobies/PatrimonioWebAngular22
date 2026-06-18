# Tasks: Theme and Layout Expansion

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 600-900 |
| 400-line budget risk | High |
| Chained PRs recommended | No |
| Suggested split | Single PR / direct commit |
| Delivery strategy | exception-ok |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Full implementation and verification | Main | Direct commit per delivery strategy |

## Phase 1: Foundation (Services & Guard)

- [x] 1.1 Create `src/app/services/theme.service.ts` for theme signal state and body class toggling.
- [x] 1.2 Create `src/app/services/theme.service.spec.ts` verifying theme storage and body toggle.
- [x] 1.3 Create `src/app/services/auth.service.ts` managing login state signal and mock validations.
- [x] 1.4 Create `src/app/services/auth.service.spec.ts` testing auth state persistence and validation.
- [x] 1.5 Create `src/app/guards/auth.guard.ts` directing unauthorized routes to `/login`.
- [x] 1.6 Create `src/app/guards/auth.guard.spec.ts` asserting route protection and redirection.

## Phase 2: Authentication UI & Routing

- [x] 2.1 Create glassmorphic `src/app/components/login/login.component.ts` with validation feedback.
- [x] 2.2 Create `src/app/components/login/login.component.spec.ts` checking validation messages and redirection.
- [x] 2.3 Modify `src/app/app.routes.ts` adding routes for login, dashboard, and catalog with guards.
- [x] 2.4 Modify `src/index.html` adding early-load script for theme persistence.

## Phase 3: Shell Components & Navigation

- [x] 3.1 Create `src/app/components/layout/sidebar.component.ts` linking to dashboard and catalog.
- [x] 3.2 Create `src/app/components/layout/navbar.component.ts` showing breadcrumbs, theme toggle, profile.
- [x] 3.3 Create wrapper `src/app/components/layout/layout.component.ts` projecting conditional layouts.
- [x] 3.4 Create `src/app/components/layout/layout.component.spec.ts` testing sidebar/navbar visibility.
- [x] 3.5 Modify `src/app/app.ts` & `src/app/app.html` to integrate layout element wrapping.

## Phase 4: Page Decomposition (Dashboard & Catalog)

- [x] 4.1 Create `src/app/components/catalog/catalog.component.ts` rendering asset list and form.
- [x] 4.2 Create `src/app/components/catalog/catalog.component.spec.ts` verifying list rendering.
- [x] 4.3 Modify `src/app/components/dashboard/dashboard.component.ts` to focus solely on KPIs and charts.

## Phase 5: Verification & Polish

- [x] 5.1 Run all unit tests using `vitest` to guarantee no regressions.
- [x] 5.2 Polish Tailwind transitions for light/dark theme toggle styling.
- [x] 5.3 Validate route redirections (unauthorized, fallback, login success).
