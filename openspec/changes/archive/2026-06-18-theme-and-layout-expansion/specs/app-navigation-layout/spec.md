# App Navigation Layout Specification

## Purpose
Provide a responsive navigation shell for authenticated users.

## Requirements

| Requirement | Description |
|---|---|
| `Shell-Structure` | System MUST render sidebar navigation and top navbar for authenticated users. |
| `Navigation-Links` | Sidebar navigation MUST link to Login, Dashboard, and Catalog. |
| `Navbar-Elements` | Top navbar MUST display breadcrumbs, theme switcher, and profile avatar. |

### Requirement: Shell-Structure

#### Scenario: Show shell when authenticated
- GIVEN user is authenticated
- WHEN app root is rendered
- THEN system MUST render sidebar and top navbar around outlet

#### Scenario: Hide shell on login route
- GIVEN user is on route `/login`
- WHEN route is resolved
- THEN system MUST NOT render sidebar or top navbar

### Requirement: Navigation-Links

#### Scenario: Link routing
- GIVEN sidebar navigation is visible
- WHEN user clicks "Catalog"
- THEN system MUST transition route to `/catalog`
