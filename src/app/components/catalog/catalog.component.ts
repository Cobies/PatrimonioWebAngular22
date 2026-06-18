import { Component, signal, inject } from '@angular/core';
import { AssetService } from '../../services/asset.service';
import { Asset, Currency } from '../../models/asset.model';
import { AssetListComponent } from '../asset-list/asset-list.component';
import { AssetFormComponent } from '../asset-form/asset-form.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    AssetListComponent,
    AssetFormComponent
  ],
  template: `
    <div class="flex flex-col gap-6 font-sans">
      
      <!-- Top Navigation & Global Controls -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800/80 pb-6">
        <div>
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-slate-100 dark:via-slate-200 dark:to-slate-400">
                Asset Catalog
              </h1>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                Manage corporate physical and digital assets
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Currency Toggle -->
          <div class="bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl flex gap-1 shadow-inner">
            @for (curr of currencies; track curr) {
              <button
                (click)="onCurrencyToggle(curr)"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
                [class.bg-gradient-to-r]="selectedCurrency() === curr"
                [class.from-indigo-600]="selectedCurrency() === curr"
                [class.to-violet-600]="selectedCurrency() === curr"
                [class.text-white]="selectedCurrency() === curr"
                [class.shadow-md]="selectedCurrency() === curr"
                [class.text-slate-500]="selectedCurrency() !== curr"
                [class.dark:text-slate-400]="selectedCurrency() !== curr"
                [class.hover:text-slate-800]="selectedCurrency() !== curr"
                [class.dark:hover:text-slate-200]="selectedCurrency() !== curr"
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
export class CatalogComponent {
  private assetService = inject(AssetService);

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
}
