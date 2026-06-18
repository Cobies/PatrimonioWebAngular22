# App Theme Switcher Specification

## Purpose
Manage and persist light/dark theme preference across the application.

## Requirements

| Requirement | Description |
|---|---|
| `Theme-Persistence` | System MUST persist theme selection ('light' or 'dark') in `localStorage`. |
| `Theme-Initialization` | System MUST apply saved theme, or default to light, on startup. |
| `Theme-Class-Toggle` | System MUST toggle class `.dark` on document element. |

### Requirement: Theme-Persistence

#### Scenario: Toggle to dark theme
- GIVEN application is in light theme
- WHEN theme toggle is clicked
- THEN system MUST add class 'dark' to document element
- AND save 'dark' in localStorage

#### Scenario: Toggle to light theme
- GIVEN application is in dark theme
- WHEN theme toggle is clicked
- THEN system MUST remove class 'dark' from document element
- AND save 'light' in localStorage

### Requirement: Theme-Initialization

#### Scenario: Initialize dark theme preference
- GIVEN localStorage has 'dark' theme saved
- WHEN application loads
- THEN system MUST apply class 'dark' to document element

#### Scenario: Default theme initialization
- GIVEN localStorage is empty
- WHEN application loads
- THEN system MUST default to light theme
