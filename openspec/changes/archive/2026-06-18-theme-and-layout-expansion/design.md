# Design: Theme and Layout Expansion

## Technical Approach
We will introduce standalone components for shell navigation (`LayoutComponent`, `SidebarComponent`, `NavbarComponent`) and authentication (`LoginComponent`). State management will be entirely signal-based using two global services: `ThemeService` and `AuthService`. We secure routes via a functional guard (`authGuard`). Tailwind CSS v4 styling rules will adapt the system colors dynamically based on the `.dark` class toggled on the document root.

## Architecture Decisions

| Decision | Option | Tradeoff | Decision |
|---|---|---|---|
| **Layout Wrapping** | A) Nested Router Outlet<br>B) Shell-component inside App root | A) Requires nested route definitions in router.<br>B) Simpler router configuration but mixes shell rendering logic in `LayoutComponent` using template conditional content projection. | **Option B**: Shell component wrapped around `router-outlet` in `app.html` using `@if (authService.isAuthenticated())` to render navigation dynamically. This avoids complex routing structures and centralizes layout layout conditions. |
| **Theme Initialization** | A) Early script in `index.html`<br>B) `APP_INITIALIZER` in Angular | A) No layout flicker, executes before Angular load.<br>B) Tied to Angular framework lifecycle but slightly delayed. | **Option A**: Implement an inline script in `index.html` header to read from `localStorage` and apply `.dark` class to `document.documentElement` early to prevent flickering. |
| **Credentials Check** | A) Static array in guard<br>B) Centralized service check | A) Hardcoded credentials in guard file.<br>B) Clean delegation of check to `AuthService`. | **Option B**: Validate credentials `admin/admin` inside `AuthService` which updates the authenticated signal and manages persistence. |

## Data Flow
```
LoginComponent ──[credentials]──→ AuthService (isAuthenticated: true, localStorage)
                                      │
                                      ▼
LayoutComponent ←──[isAuthenticated]── (Renders Sidebar & Navbar)
                                      │
                                      ▼
NavbarComponent ──[toggleTheme]──→ ThemeService (selectedTheme: 'light' | 'dark', documentElement class)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/services/theme.service.ts` | Create | Manage theme selection signal, handle localStorage persistence, and toggle `.dark` class on root document. |
| `src/app/services/auth.service.ts` | Create | Handle mock auth login state (admin/admin), token persistence, and logout helper. |
| `src/app/guards/auth.guard.ts` | Create | Functional route guard that inspects `AuthService` state and redirects to `/login`. |
| `src/app/components/login/login.component.ts` | Create | Glassmorphism card for login with form validation feedback. |
| `src/app/components/layout/layout.component.ts` | Create | Root shell wrapper component that conditional projects page content with sidebar/navbar. |
| `src/app/components/layout/sidebar.component.ts` | Create | Sidebar navigation with links to dashboard and catalog. |
| `src/app/components/layout/navbar.component.ts` | Create | Header displaying breadcrumbs, theme switcher, and profile avatar. |
| `src/app/components/catalog/catalog.component.ts` | Create | Standalone catalog page rendering `AssetListComponent` and `AssetFormComponent` modal, moving catalog logic out of dashboard. |
| `src/app/components/dashboard/dashboard.component.ts` | Modify | Remove `AssetListComponent` and catalog modal logic; leave KPIs and charts. |
| `src/app/app.routes.ts` | Modify | Define routes for `/login`, `/dashboard`, and `/catalog` using `authGuard` on protected routes. |
| `src/app/app.html` | Modify | Wrap `<router-outlet>` in `<app-layout>`. |
| `src/app/app.ts` | Modify | Import `LayoutComponent`. |
| `src/index.html` | Modify | Add early script in header to prevent dark mode flicker. |

## Interfaces / Contracts

```typescript
// src/app/services/theme.service.ts
export type Theme = 'light' | 'dark';

// src/app/services/auth.service.ts
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `ThemeService` / `AuthService` | Verify signals transition correctly and persist to `localStorage`. |
| Unit | `authGuard` | Test route blocking and redirection behavior based on simulated auth state. |
| Unit | `LoginComponent` | Test glassmorphism layout rendering, validation error messages on invalid input, and redirect on success. |

## Migration / Rollout
No database migration is required. LocalStorage will store theme preferences ('light' | 'dark') and auth tokens (simulated token). Standard git deployment rollout.

## Open Questions
- None.
