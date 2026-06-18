# Mock Authentication Specification

## Purpose
Manage mock authentication state and restrict route access using guards.

## Requirements

| Requirement | Description |
|---|---|
| `Auth-Service-State` | System MUST manage authentication state via Signals and persist in `localStorage`. |
| `Mock-Credentials` | System MUST only accept "admin"/"admin" for login credentials. |
| `Route-Authorization` | Functional guard MUST redirect unauthenticated users to `/login`. |

### Requirement: Auth-Service-State

#### Scenario: User login success
- GIVEN credentials are "admin" and "admin"
- WHEN login is requested
- THEN system MUST set authenticated state, save token, and redirect to `/`

#### Scenario: User login failure
- GIVEN credentials are not "admin" and "admin"
- WHEN login is requested
- THEN system MUST deny authentication and show error message

#### Scenario: User logout
- GIVEN user is authenticated
- WHEN logout is requested
- THEN system MUST clear token from localStorage and redirect to `/login`

### Requirement: Route-Authorization

#### Scenario: Authorize access
- GIVEN user is authenticated
- WHEN user navigates to `/dashboard`
- THEN guard MUST permit route navigation

#### Scenario: Block unauthorized access
- GIVEN user is not authenticated
- WHEN user navigates to `/dashboard`
- THEN guard MUST redirect to `/login`
