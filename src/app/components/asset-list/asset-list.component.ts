import { Component, input, output, computed, signal } from '@angular/core';
import { Asset, Currency } from '../../models/asset.model';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  template: `
    <div class="w-full bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-6 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700/60 shadow-xs">
      <!-- Search & Filters Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">Catálogo de Activos</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">Total: {{ assets().length }} activos registrados</p>
        </div>
        
        <div class="flex flex-wrap items-center gap-3">
          <!-- Search Input -->
          <div class="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar activos..."
              [value]="searchText()"
              (input)="onSearchInput($event)"
              class="w-full sm:w-64 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-slate-300 dark:focus:border-slate-700 focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-700 rounded-xl px-4 py-2.5 pl-10 text-sm transition-all duration-300"
            />
            <svg
              class="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <!-- Category Filter -->
          <div class="relative w-full sm:w-auto">
            <select
              [value]="selectedCategory()"
              (change)="onCategoryChange($event)"
              class="w-full sm:w-auto bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:border-slate-300 dark:focus:border-slate-700 focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-700 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-300 cursor-pointer appearance-none pr-8"
            >
              @for (cat of categories(); track cat) {
                <option [value]="cat">{{ cat === 'Todos' ? 'Todos los rubros' : cat }}</option>
              }
            </select>
            <svg
              class="absolute right-3.5 top-3.5 h-4.5 w-4.5 text-slate-400 dark:text-slate-500 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="overflow-x-auto w-full rounded-xl border border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider transition-colors duration-300">
              <th class="py-4 px-5">Nombre y Tipo</th>
              <th class="py-4 px-5">Categoría</th>
              <th class="py-4 px-5">Adquisición</th>
              <th class="py-4 px-5 text-right">Costo ({{ selectedCurrency() }})</th>
              <th class="py-4 px-5 text-right">Residual ({{ selectedCurrency() }})</th>
              <th class="py-4 px-5 text-center">Vida Útil (Años)</th>
              <th class="py-4 px-5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300 text-sm transition-colors duration-300">
            @if (filteredAssets().length === 0) {
              <tr>
                <td colspan="7" class="py-12 text-center text-slate-400 dark:text-slate-500 transition-colors duration-300">
                  No se encontraron activos que coincidan con la búsqueda.
                </td>
              </tr>
            } @else {
              @for (asset of filteredAssets(); track asset.id) {
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors duration-300 group">
                  <!-- Name & Type -->
                  <td class="py-4 px-5">
                    <div class="flex flex-col">
                      <span class="font-medium text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-slate-100 transition-colors duration-300">
                        {{ asset.name }}
                      </span>
                      <div class="flex items-center gap-2 mt-1">
                        @if (asset.type === 'physical') {
                          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/20 transition-colors duration-300">
                            Físico
                          </span>
                        } @else {
                          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 dark:border-indigo-500/20 transition-colors duration-300">
                            Digital
                          </span>
                        }
                        @if (asset.serialNumber) {
                          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-mono transition-colors duration-300">SN: {{ asset.serialNumber }}</span>
                        }
                      </div>
                    </div>
                  </td>
                  
                  <!-- Category -->
                  <td class="py-4 px-5">
                    <span class="text-slate-500 dark:text-slate-400 transition-colors duration-300">{{ asset.category }}</span>
                  </td>
                  
                  <!-- Acquisition Date -->
                  <td class="py-4 px-5">
                    <div class="flex flex-col">
                      <span class="text-slate-600 dark:text-slate-300 transition-colors duration-300">{{ asset.purchaseDate }}</span>
                      @if (asset.location) {
                        <span class="text-[11px] text-slate-400 dark:text-slate-500 transition-colors duration-300">{{ asset.location }}</span>
                      }
                    </div>
                  </td>
                  
                  <!-- Purchase Value -->
                  <td class="py-4 px-5 text-right font-mono font-medium text-slate-800 dark:text-slate-200 transition-colors duration-300">
                    {{ formatCurrency(asset.purchaseValue) }}
                  </td>
                  
                  <!-- Residual Value -->
                  <td class="py-4 px-5 text-right font-mono text-slate-500 dark:text-slate-400 transition-colors duration-300">
                    {{ formatCurrency(asset.residualValue) }}
                  </td>
                  
                  <!-- Useful Life -->
                  <td class="py-4 px-5 text-center font-mono">
                    {{ asset.usefulLife }}
                  </td>
                  
                  <!-- Actions -->
                  <td class="py-4 px-5 text-center">
                    <div class="flex items-center justify-center gap-3">
                      <button
                        (click)="editAsset.emit(asset)"
                        title="Editar Activo"
                        class="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 hover:bg-indigo-500/10 hover:border-indigo-500/30 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 cursor-pointer"
                      >
                        <svg
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        (click)="deleteAsset.emit(asset.id)"
                        title="Eliminar Activo"
                        class="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-300 cursor-pointer"
                      >
                        <svg
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class AssetListComponent {
  assets = input<Asset[]>([]);
  selectedCurrency = input<Currency>('USD');
  convertFn = input<(usdVal: number) => number>((usdVal: number) => usdVal);

  readonly editAsset = output<Asset>();
  readonly deleteAsset = output<string>();

  searchText = signal<string>('');
  selectedCategory = signal<string>('Todos');

  // Compute unique list of categories for the filter select
  categories = computed(() => {
    const list = this.assets();
    const unique = new Set(list.map(a => a.category).filter(Boolean));
    return ['Todos', ...Array.from(unique).sort()];
  });

  // Compute the list of assets after search and category filtering
  filteredAssets = computed(() => {
    let list = this.assets();
    const search = this.searchText().trim().toLowerCase();
    const cat = this.selectedCategory();

    if (search) {
      list = list.filter(a => 
        a.name.toLowerCase().includes(search) ||
        a.category.toLowerCase().includes(search) ||
        (a.serialNumber && a.serialNumber.toLowerCase().includes(search)) ||
        (a.location && a.location.toLowerCase().includes(search))
      );
    }

    if (cat !== 'Todos') {
      list = list.filter(a => a.category === cat);
    }

    return list;
  });

  onSearchInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.searchText.set(inputEl.value);
  }

  onCategoryChange(event: Event): void {
    const selectEl = event.target as HTMLSelectElement;
    this.selectedCategory.set(selectEl.value);
  }

  formatCurrency(valUsd: number): string {
    const converted = this.convertFn()(valUsd);
    const curr = this.selectedCurrency();
    const symbol = this.getCurrencySymbol(curr);
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  private getCurrencySymbol(curr: Currency): string {
    switch (curr) {
      case 'EUR': return '€';
      case 'ARS': return 'AR$ ';
      default: return '$';
    }
  }
}
