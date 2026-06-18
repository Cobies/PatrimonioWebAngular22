import { Component, computed, signal, inject } from '@angular/core';
import { AssetService } from '../../services/asset.service';
import { DepreciationService } from '../../services/depreciation.service';
import { Asset, Currency } from '../../models/asset.model';
import { BarChartComponent } from '../charts/bar-chart.component';
import { AreaChartComponent } from '../charts/area-chart.component';
import { AssetListComponent } from '../asset-list/asset-list.component';
import { AssetFormComponent } from '../asset-form/asset-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BarChartComponent,
    AreaChartComponent,
    AssetListComponent,
    AssetFormComponent
  ],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 flex flex-col gap-8 font-sans">
      
      <!-- Top Navigation & Global Controls -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-900 pb-6">
        <div>
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400">
                Corporate Asset Manager
              </h1>
              <p class="text-xs text-slate-400 font-medium tracking-wide">
                Active Valuation & Straight-Line Depreciation Console
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Currency Toggle -->
          <div class="bg-slate-900/80 border border-slate-800 p-1.5 rounded-xl flex gap-1 shadow-inner">
            @for (curr of currencies; track curr) {
              <button
                (click)="onCurrencyToggle(curr)"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
                [class.bg-gradient-to-r]="selectedCurrency() === curr"
                [class.from-indigo-600]="selectedCurrency() === curr"
                [class.to-violet-600]="selectedCurrency() === curr"
                [class.text-white]="selectedCurrency() === curr"
                [class.shadow-md]="selectedCurrency() === curr"
                [class.text-slate-400]="selectedCurrency() !== curr"
                [class.hover:text-slate-200]="selectedCurrency() !== curr"
              >
                {{ curr }}
              </button>
            }
          </div>

          <!-- Add Asset Button -->
          <button
            (click)="onOpenCreateForm()"
            class="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Register Asset
          </button>
        </div>
      </header>

      <!-- KPI Metrics Dashboard -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- KPI 1: Active Count -->
        <div class="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-slate-700/60">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Asset Inventory</span>
          <div class="flex items-baseline gap-2 mt-4">
            <span class="text-3xl font-extrabold text-slate-100 font-mono">{{ assetsCount() }}</span>
            <span class="text-xs text-slate-400">active items</span>
          </div>
          <p class="text-[10px] text-slate-500 mt-2">Physical and digital assets tracked</p>
        </div>

        <!-- KPI 2: Total Acquisition Cost -->
        <div class="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-slate-700/60">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Capital Cost</span>
          <div class="flex items-baseline gap-1 mt-4">
            <span class="text-3xl font-extrabold text-slate-100 font-mono">{{ totalAcquisitionCost() }}</span>
          </div>
          <p class="text-[10px] text-slate-500 mt-2">Sum of original purchase costs</p>
        </div>

        <!-- KPI 3: Accumulated Depreciation -->
        <div class="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-slate-700/60">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Accumulated Dep</span>
          <div class="flex items-baseline gap-1 mt-4">
            <span class="text-3xl font-extrabold text-rose-500/90 font-mono">-{{ totalAccumulatedDepreciation() }}</span>
          </div>
          <p class="text-[10px] text-slate-500 mt-2">Estimated lifetime depreciation value</p>
        </div>

        <!-- KPI 4: Remaining Book Value -->
        <div class="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-slate-700/60 ring-1 ring-emerald-500/20">
          <span class="text-xs font-semibold uppercase tracking-wider text-emerald-500">Current Net Book Value</span>
          <div class="flex items-baseline gap-1 mt-4">
            <span class="text-3xl font-extrabold text-emerald-400 font-mono">{{ totalRemainingBookValue() }}</span>
          </div>
          <p class="text-[10px] text-slate-500 mt-2">Adjusted for current straight-line wear</p>
        </div>
      </section>

      <!-- Charts Section (Grid) -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <app-bar-chart
          [assets]="assets()"
          [selectedCurrency]="selectedCurrency()"
          [convertFn]="convertHelper"
        />
        <app-area-chart
          [assets]="assets()"
          [selectedCurrency]="selectedCurrency()"
          [convertFn]="convertHelper"
        />
      </section>

      <!-- Catalog List Section -->
      <section>
        <app-asset-list
          [assets]="assets()"
          [selectedCurrency]="selectedCurrency()"
          [convertFn]="convertHelper"
          (editAsset)="onOpenEditForm($event)"
          (deleteAsset)="onDeleteAsset($event)"
        />
      </section>

      <!-- Overlay Asset Form Modal -->
      @if (isFormOpen()) {
        <app-asset-form
          [asset]="selectedAsset()"
          [selectedCurrency]="selectedCurrency()"
          [convertFn]="convertHelper"
          [convertToUsdFn]="convertToUsdHelper"
          (save)="onSaveAsset($event)"
          (cancel)="onCloseForm()"
        />
      }

    </div>
  `
})
export class DashboardComponent {
  private assetService = inject(AssetService);
  private depreciationService = inject(DepreciationService);

  readonly currencies: Currency[] = ['USD', 'EUR', 'ARS'];

  // Signals mapped from service
  assets = this.assetService.assets;
  selectedCurrency = this.assetService.selectedCurrency;

  // Modal form toggle signals
  isFormOpen = signal<boolean>(false);
  selectedAsset = signal<Asset | null>(null);

  // Conversion helpers bindable to inputs
  convertHelper = (usdVal: number) => this.assetService.convert(usdVal);
  convertToUsdHelper = (val: number, fromCurrency: Currency) => this.assetService.convertToUsd(val, fromCurrency);

  // KPIs
  assetsCount = computed(() => this.assets().length);

  totalAcquisitionCost = computed(() => {
    const sumUsd = this.assets().reduce((sum, a) => sum + a.purchaseValue, 0);
    return this.formatCurrency(this.assetService.convert(sumUsd));
  });

  totalRemainingBookValue = computed(() => {
    const sumUsd = this.assets().reduce((sum, a) => sum + this.calculateCurrentBookValueUsd(a), 0);
    return this.formatCurrency(this.assetService.convert(sumUsd));
  });

  totalAccumulatedDepreciation = computed(() => {
    const sumUsd = this.assets().reduce((sum, a) => {
      const remainingUsd = this.calculateCurrentBookValueUsd(a);
      return sum + (a.purchaseValue - remainingUsd);
    }, 0);
    return this.formatCurrency(this.assetService.convert(sumUsd));
  });

  onCurrencyToggle(currency: Currency): void {
    this.assetService.selectedCurrency.set(currency);
  }

  onOpenCreateForm(): void {
    this.selectedAsset.set(null);
    this.isFormOpen.set(true);
  }

  onOpenEditForm(asset: Asset): void {
    this.selectedAsset.set(asset);
    this.isFormOpen.set(true);
  }

  onCloseForm(): void {
    this.isFormOpen.set(false);
    this.selectedAsset.set(null);
  }

  onSaveAsset(assetData: Omit<Asset, 'id'> | Asset): void {
    if ('id' in assetData) {
      this.assetService.updateAsset(assetData.id, assetData as Asset);
    } else {
      this.assetService.addAsset(assetData);
    }
    this.onCloseForm();
  }

  onDeleteAsset(id: string): void {
    if (confirm('Are you sure you want to delete this asset? This action is irreversible.')) {
      this.assetService.deleteAsset(id);
    }
  }

  /**
   * Helper to compute the current remaining book value of an asset in USD.
   * Compares the acquisition date with the current time to apply straight-line depreciation.
   */
  private calculateCurrentBookValueUsd(asset: Asset): number {
    const purchaseDate = new Date(asset.purchaseDate);
    const currentDate = new Date();
    
    // Total elapsed time in milliseconds
    const elapsedMs = Math.max(0, currentDate.getTime() - purchaseDate.getTime());
    // Convert to years
    const elapsedYears = elapsedMs / (1000 * 60 * 60 * 24 * 365.25);
    
    const usefulLife = asset.usefulLife;
    const purchaseVal = asset.purchaseValue;
    const residualVal = asset.residualValue;

    if (elapsedYears >= usefulLife) {
      return residualVal;
    }

    const totalDepreciable = purchaseVal - residualVal;
    const yearlyDep = totalDepreciable / usefulLife;
    const accDep = yearlyDep * elapsedYears;

    return Math.max(residualVal, Math.round((purchaseVal - accDep) * 100) / 100);
  }

  private formatCurrency(val: number): string {
    const curr = this.selectedCurrency();
    const symbol = this.getCurrencySymbol(curr);
    return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  private getCurrencySymbol(curr: Currency): string {
    switch (curr) {
      case 'EUR': return '€';
      case 'ARS': return 'AR$ ';
      default: return '$';
    }
  }
}
