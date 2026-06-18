# PatrimonioWebAngular22

This project is a modern corporate asset management dashboard built with **Angular v22**, featuring signal-driven state, tailwindcss v4, and custom responsive SVG charts.

---

## 🚀 Local Run Instructions

This project uses **Bun** as the primary package manager. Follow these commands to set up and run the application locally:

### 1. Installation
Install the project dependencies using Bun:
```bash
bun install
```

### 2. Run Development Server
Start the local development server:
```bash
bun run start
```
Once started, navigate to [http://localhost:4200/](http://localhost:4200/) in your browser. The application will hot-reload automatically on changes.

### 3. Build the Application
To build the production-ready assets:
```bash
bun run build
```
Compiled assets will be placed in the `dist/` directory.

### 4. Running Unit Tests
To execute unit tests using the integrated **Vitest** test runner:
```bash
bun run test
```

---

## 🏗️ Application Architecture

The application is structured following the **Container-Presentational Pattern** (Smart vs. Dumb components) to keep components clean, testable, and highly reusable.

```
src/app/
├── models/         # Domain Interfaces & Mock Data
├── services/       # Core Business Logic & State Management
└── components/
    ├── dashboard/  # [Container] Manages State, Currency Toggles, Coordinates logic
    ├── asset-list/ # [Presentational] Renders list, emits edit/delete events
    ├── asset-form/ # [Presentational] Validation form for asset input/edit
    └── charts/     # [Presentational] Custom SVG charts for asset metrics
```

### 1. Container Component (`DashboardComponent`)
- Acts as the single source of truth for the view.
- Subscribes to and coordinates data streams and user actions.
- Interfaces directly with `AssetService` to read state and invoke CRUD updates.
- Supplies data inputs down to presentational components.

### 2. Presentational Components (`AssetList`, `AssetForm`, `BarChart`, `AreaChart`)
- Do not maintain global state or communicate with services directly.
- Receive data from the container via Angular `input()` signals.
- Communicate user actions back to the container via `output()` emitters.
- Highly visual and focused solely on how things look and interact in the UI.

---

## ⚡ Angular Signals Usage

State management is fully reactive and powered by modern **Angular Signals (v22)**:

- **State Persistence**: The `AssetService` encapsulates a private writable signal `_assets` and exposes a read-only `assets: Signal<Asset[]>` to prevent external state pollution.
- **Dynamic Conversion**: The `selectedCurrency` writable signal tracks current UI currency, and conversions are instantly applied reactively.
- **Computed Transforms**: The chart components (`bar-chart` and `area-chart`) use `computed()` signals to perform real-time, memoized data transformations (e.g. calculating categories sum and year-by-year depreciation trajectories) whenever the inputs change:
  ```typescript
  // Reactive category grouping in BarChartComponent
  private categoryStats = computed(() => {
    const list = this.assets();
    const conv = this.convertFn();
    ...
  });
  ```

---

## 📊 Depreciation & Calculation Logic

The **straight-line depreciation engine** handles calculations for assets (physical and non-physical) under these constraints:

1. **Formula**:
   $$\text{Yearly Depreciation} = \frac{\text{Purchase Value} - \text{Residual Value}}{\text{Useful Life}}$$
2. **Trajectory Tracking**: Computes the remaining book value and accumulated depreciation year-by-year from Year 0 up to Year `Useful Life`.
3. **Safety Constraints**:
   - `Useful Life` must be $> 0$.
   - `Residual Value` cannot exceed `Purchase Value`.
   - `Purchase Value` and `Residual Value` cannot be negative.
