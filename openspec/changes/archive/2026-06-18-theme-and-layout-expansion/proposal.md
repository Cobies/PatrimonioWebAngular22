# Proposal: Theme and Layout Expansion

## Intent

Introduce a professional shell layout (sidebar, navbar), a smooth light/dark theme switcher, a mock login portal with input validation, and an authentication service/guard to secure the application routes.

## Scope

### In Scope
- **Mock Login Page**: Glassmorphic UI card, form validation (admin/admin credentials).
- **Shell Layout**: Navigation sidebar (routes: Login, Dashboard, Catalog), top navbar with breadcrumbs, theme switcher, and profile avatar.
- **Theme Switcher**: `ThemeService` syncing light/dark classes on the document body and storing preferences in `localStorage`.
- **Auth Service & Guard**: `AuthService` managing mock login state in `localStorage` and a functional `AuthGuard` protecting pages.

### Out of Scope
- Backend API authentication integration.
- Profile settings editing or avatar upload functionality.
- Nested multi-level sidebar navigation.

## Capabilities

### New Capabilities
- `app-theme-switcher`: `ThemeService` toggling light/dark themes and persisting options.
- `mock-auth`: `AuthService` managing mock login sessions and route guards.
- `app-navigation-layout`: Sidebar and Navbar shell layout containing route navigation and controls.

### Modified Capabilities
- None (we will refactor the existing routes and layout components into this new shell).

## Approach

- Leverage Angular 22 standalone components and Signal-driven state for the services.
- Implement Tailwind CSS v4 transition classes for theme toggling.
- Secure routes using Angular's functional guards accessing `AuthService` signals.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/app.routes.ts` | Modified | Secure dashboard, add login route, and configure guards. |
| `src/app/app.ts` & `.html` | Modified | Integrate structural navigation shell around the router outlet. |
| `src/app/services/` | New | Create `theme.service.ts` and `auth.service.ts`. |
| `src/app/components/` | New | Add `login` component and `layout/` directory for shell sub-components. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Theme toggle flicker | Low | Read and set the theme class early in index.html or APP_INITIALIZER. |
| Route bypass via URL | Low | Configure strict route guards that check mock session status. |

## Rollback Plan

Revert git changes for routes and app files to fallback to the single-route dashboard.

## Dependencies

- Local browser support for `localStorage`.

## Success Criteria

- [ ] Unauthenticated users are redirected to `/login`.
- [ ] Successful login (admin/admin) redirects to `/`.
- [ ] Theme toggles dark mode smoothly by applying `.dark` to the document element.
- [ ] Navigation sidebar links transition routes correctly.

## Proposal Question Round

1. Should the theme default to system media preferences (`prefers-color-scheme`) if `localStorage` is empty?
2. Should unauthorized routes redirect back to `/login` with a return URL query parameter?
3. Do we need transitions when toggling themes, or should the color switch be immediate?
