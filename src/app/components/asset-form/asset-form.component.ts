import { Component, input, output, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Asset, Currency } from '../../models/asset.model';

@Component({
  selector: 'app-asset-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in transition-colors duration-300">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 scale-95 hover:border-slate-300 dark:hover:border-slate-700/50">
        
        <!-- Header -->
        <div class="flex justify-between items-center px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 transition-colors duration-300">
          <div>
            <h3 class="text-lg font-bold text-slate-850 dark:text-slate-200 transition-colors duration-300">
              {{ isEditing() ? 'Modificar Detalles del Activo' : 'Registrar Nuevo Activo' }}
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
              Complete los parámetros a continuación. Valores expresados en {{ selectedCurrency() }}.
            </p>
          </div>
          <button
            (click)="cancel.emit()"
            class="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-300 cursor-pointer"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form Body -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex-1 overflow-y-auto px-6 py-5 space-y-4 max-h-[70vh]">
          
          <!-- Name Field -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Nombre del Activo *</label>
            <input
              type="text"
              formControlName="name"
              placeholder="ej. MacBook Pro M4 Max"
              class="w-full bg-slate-50 dark:bg-slate-950 border text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-all duration-300"
              [class.border-slate-200]="!hasError('name')"
              [class.dark:border-slate-800]="!hasError('name')"
              [class.border-rose-500]="hasError('name')"
              [class.focus:border-slate-300]="!hasError('name')"
              [class.dark:focus:border-slate-700]="!hasError('name')"
              [class.focus:border-rose-500]="hasError('name')"
            />
            @if (hasError('name')) {
              <span class="text-xs text-rose-500 mt-1 block">El nombre del activo es requerido (mínimo 2 caracteres).</span>
            }
          </div>

          <!-- Type & Category Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Type -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Tipo de Activo *</label>
              <select
                formControlName="type"
                class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-slate-300 dark:focus:border-slate-700 rounded-xl px-4 py-2.5 text-sm transition-all duration-300 cursor-pointer"
              >
                <option value="physical">Activo Físico</option>
                <option value="non-physical">Digital / Intelectual</option>
              </select>
            </div>

            <!-- Category -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Categoría *</label>
              <input
                type="text"
                formControlName="category"
                placeholder="ej. Hardware, Software"
                class="w-full bg-slate-50 dark:bg-slate-950 border text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-all duration-300"
                [class.border-slate-200]="!hasError('category')"
                [class.dark:border-slate-800]="!hasError('category')"
                [class.border-rose-500]="hasError('category')"
                [class.focus:border-slate-300]="!hasError('category')"
                [class.dark:focus:border-slate-700]="!hasError('category')"
                [class.focus:border-rose-500]="hasError('category')"
              />
              @if (hasError('category')) {
                <span class="text-xs text-rose-500 mt-1 block">La categoría es requerida.</span>
              }
            </div>
          </div>

          <!-- Purchase Date & Useful Life Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Purchase Date -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Fecha de Adquisición *</label>
              <input
                type="date"
                formControlName="purchaseDate"
                class="w-full bg-slate-50 dark:bg-slate-950 border text-slate-850 dark:text-slate-200 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-all duration-300"
                [class.border-slate-200]="!hasError('purchaseDate')"
                [class.dark:border-slate-800]="!hasError('purchaseDate')"
                [class.border-rose-500]="hasError('purchaseDate')"
                [class.focus:border-slate-300]="!hasError('purchaseDate')"
                [class.dark:focus:border-slate-700]="!hasError('purchaseDate')"
                [class.focus:border-rose-500]="hasError('purchaseDate')"
              />
              @if (hasError('purchaseDate')) {
                <span class="text-xs text-rose-500 mt-1 block">La fecha de adquisición es requerida.</span>
              }
            </div>

            <!-- Useful Life -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Vida Útil (Anual) *</label>
              <input
                type="number"
                formControlName="usefulLife"
                placeholder="ej. 5"
                class="w-full bg-slate-50 dark:bg-slate-950 border text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-all duration-300"
                [class.border-slate-200]="!hasError('usefulLife')"
                [class.dark:border-slate-800]="!hasError('usefulLife')"
                [class.border-rose-500]="hasError('usefulLife')"
                [class.focus:border-slate-300]="!hasError('usefulLife')"
                [class.dark:focus:border-slate-700]="!hasError('usefulLife')"
                [class.focus:border-rose-500]="hasError('usefulLife')"
              />
              @if (hasError('usefulLife')) {
                <span class="text-xs text-rose-500 mt-1 block">Debe ser un número entero mayor a 0.</span>
              }
            </div>
          </div>

          <!-- Purchase Value & Residual Value Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Purchase Value -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Valor de Compra ({{ selectedCurrency() }}) *
              </label>
              <input
                type="number"
                formControlName="purchaseValue"
                placeholder="0.00"
                class="w-full bg-slate-50 dark:bg-slate-950 border text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-all duration-300"
                [class.border-slate-200]="!hasError('purchaseValue')"
                [class.dark:border-slate-800]="!hasError('purchaseValue')"
                [class.border-rose-500]="hasError('purchaseValue')"
                [class.focus:border-slate-300]="!hasError('purchaseValue')"
                [class.dark:focus:border-slate-700]="!hasError('purchaseValue')"
                [class.focus:border-rose-500]="hasError('purchaseValue')"
              />
              @if (hasError('purchaseValue')) {
                <span class="text-xs text-rose-500 mt-1 block">Debe ser un número positivo válido.</span>
              }
            </div>

            <!-- Residual Value -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Valor Residual ({{ selectedCurrency() }}) *
              </label>
              <input
                type="number"
                formControlName="residualValue"
                placeholder="0.00"
                class="w-full bg-slate-50 dark:bg-slate-950 border text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-all duration-300"
                [class.border-slate-200]="!hasError('residualValue')"
                [class.dark:border-slate-800]="!hasError('residualValue')"
                [class.border-rose-500]="hasError('residualValue')"
                [class.focus:border-slate-300]="!hasError('residualValue')"
                [class.dark:focus:border-slate-700]="!hasError('residualValue')"
                [class.focus:border-rose-500]="hasError('residualValue')"
              />
              @if (hasError('residualValue')) {
                <span class="text-xs text-rose-500 mt-1 block">Debe ser un número positivo válido.</span>
              }
            </div>
          </div>

          <!-- Cross-Field Validation Error -->
          @if (form.errors?.['residualExceedsPurchase'] && form.get('residualValue')?.touched) {
            <div class="p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-xl text-xs text-rose-600 dark:text-rose-400 transition-colors duration-300">
              ⚠️ Error de Valoración: El valor residual no puede superar al valor de compra del activo.
            </div>
          }

          <!-- Physical-Only Fields -->
          @if (form.get('type')?.value === 'physical') {
            <div class="border-t border-slate-200 dark:border-slate-800/60 pt-4 space-y-4 animate-fade-in transition-colors duration-300">
              <h4 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Datos del Activo Físico</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Serial Number -->
                <div>
                  <label class="block text-xs font-medium text-slate-550 dark:text-slate-400 mb-1">Número de Serie</label>
                  <input
                    type="text"
                    formControlName="serialNumber"
                    placeholder="ej. SN-88291"
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-slate-300 dark:focus:border-slate-700 rounded-xl px-4 py-2.5 text-sm transition-all duration-300"
                  />
                </div>

                <!-- Location -->
                <div>
                  <label class="block text-xs font-medium text-slate-550 dark:text-slate-400 mb-1">Ubicación de Almacenamiento</label>
                  <input
                    type="text"
                    formControlName="location"
                    placeholder="ej. Depósito 3B"
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-slate-300 dark:focus:border-slate-700 rounded-xl px-4 py-2.5 text-sm transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          }
        </form>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/45 flex justify-end gap-3 transition-colors duration-300">
          <button
            type="button"
            (click)="cancel.emit()"
            class="px-4 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-xl transition-all duration-300 cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            (click)="onSubmit()"
            [disabled]="form.invalid"
            class="px-5 py-2.5 text-sm font-semibold rounded-xl text-white shadow-lg transition-all duration-300 cursor-pointer"
            [class.bg-slate-200]="form.invalid"
            [class.dark:bg-slate-800]="form.invalid"
            [class.text-slate-400]="form.invalid"
            [class.dark:text-slate-500]="form.invalid"
            [class.cursor-not-allowed]="form.invalid"
            [class.bg-gradient-to-r]="form.valid"
            [class.from-emerald-500]="form.valid"
            [class.to-teal-600]="form.valid"
            [class.shadow-emerald-500/10]="form.valid"
            [class.hover:scale-[1.02]]="form.valid"
            [class.active:scale-[0.98]]="form.valid"
          >
            Guardar Activo
          </button>
        </div>

      </div>
    </div>
  `
})
export class AssetFormComponent {
  asset = input<Asset | null>(null);
  selectedCurrency = input<Currency>('USD');
  
  // Translation functions to and from USD
  convertFn = input<(usdVal: number) => number>((usdVal: number) => usdVal);
  convertToUsdFn = input<(val: number, fromCurrency: Currency) => number>((val: number, fromCurrency: Currency) => val);

  readonly save = output<Omit<Asset, 'id'> | Asset>();
  readonly cancel = output<void>();

  form: FormGroup;
  isEditing = signal<boolean>(false);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: ['physical', Validators.required],
      category: ['', Validators.required],
      purchaseDate: ['', Validators.required],
      purchaseValue: [null as number | null, [Validators.required, Validators.min(0)]],
      residualValue: [null as number | null, [Validators.required, Validators.min(0)]],
      usefulLife: [null as number | null, [Validators.required, Validators.min(1)]],
      serialNumber: [''],
      location: ['']
    }, { validators: this.residualLessThanPurchaseValidator });

    // React to change of input 'asset'
    effect(() => {
      const assetToEdit = this.asset();
      if (assetToEdit) {
        this.isEditing.set(true);
        const conv = this.convertFn();
        
        this.form.patchValue({
          name: assetToEdit.name,
          type: assetToEdit.type,
          category: assetToEdit.category,
          purchaseDate: assetToEdit.purchaseDate,
          purchaseValue: conv(assetToEdit.purchaseValue),
          residualValue: conv(assetToEdit.residualValue),
          usefulLife: assetToEdit.usefulLife,
          serialNumber: assetToEdit.serialNumber || '',
          location: assetToEdit.location || ''
        });
      } else {
        this.isEditing.set(false);
        this.form.reset({
          type: 'physical',
          purchaseDate: new Date().toISOString().substring(0, 10),
          purchaseValue: null,
          residualValue: null,
          usefulLife: null,
          serialNumber: '',
          location: ''
        });
      }
    });
  }

  // Cross field validator: Residual must be <= Purchase Value
  private residualLessThanPurchaseValidator(group: AbstractControl): Record<string, boolean> | null {
    const pVal = group.get('purchaseValue')?.value;
    const rVal = group.get('residualValue')?.value;
    if (pVal !== null && rVal !== null && rVal > pVal) {
      return { residualExceedsPurchase: true };
    }
    return null;
  }

  hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.value;
    const curr = this.selectedCurrency();
    const toUsd = this.convertToUsdFn();

    // Convert values back to base USD for persistent storage
    const purchaseValUsd = toUsd(formValues.purchaseValue, curr);
    const residualValUsd = toUsd(formValues.residualValue, curr);

    const assetData: Omit<Asset, 'id'> = {
      name: formValues.name,
      type: formValues.type,
      category: formValues.category,
      purchaseDate: formValues.purchaseDate,
      purchaseValue: purchaseValUsd,
      residualValue: residualValUsd,
      usefulLife: Math.floor(formValues.usefulLife),
      ...(formValues.type === 'physical' 
        ? { serialNumber: formValues.serialNumber || undefined, location: formValues.location || undefined }
        : {}
      )
    };

    if (this.isEditing() && this.asset()) {
      const updatedAsset: Asset = {
        ...assetData,
        id: this.asset()!.id
      };
      this.save.emit(updatedAsset);
    } else {
      this.save.emit(assetData);
    }
  }
}
