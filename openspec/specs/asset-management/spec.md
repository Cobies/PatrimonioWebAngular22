# Asset Management Specification

## Purpose
Provide CRUD operations, input validation, and LocalStorage persistence for assets.

## Requirements

### Requirement: Asset-CRUD-Persistence
The system MUST support creating, reading, updating, and deleting physical and non-physical assets, and SHALL persist changes to LocalStorage.

#### Scenario: Create and Persist Asset
- GIVEN the asset creation form is filled with valid data
- WHEN the user submits the form
- THEN the system MUST save the asset to LocalStorage and update the state

#### Scenario: Delete Asset
- GIVEN an existing asset is selected
- WHEN the user requests deletion
- THEN the system MUST remove the asset from LocalStorage and update the state

### Requirement: Asset-Validation
The system MUST validate required fields (name, type, purchase date, purchase value, residual value, useful life) before saving.

#### Scenario: Missing Required Fields
- GIVEN the user enters empty fields in the asset form
- WHEN the user submits the form
- THEN the system MUST show validation errors and SHALL prevent submission
