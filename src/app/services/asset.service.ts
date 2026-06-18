import { Injectable, signal, WritableSignal, Signal } from '@angular/core';
import { Asset, Currency, MOCK_ASSETS } from '../models/asset.model';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private readonly STORAGE_KEY = 'corporate_assets';

  private readonly _assets = signal<Asset[]>([]);
  readonly assets: Signal<Asset[]> = this._assets.asReadonly();

  readonly selectedCurrency: WritableSignal<Currency> = signal<Currency>('USD');

  private readonly EXCHANGE_RATES: Record<Currency, number> = {
    USD: 1.0,
    EUR: 0.9,
    ARS: 1000.0
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      this._assets.set(MOCK_ASSETS);
      return;
    }
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this._assets.set(JSON.parse(stored));
      } else {
        // Initialize with mock data
        this._assets.set(MOCK_ASSETS);
        this.saveToStorage(MOCK_ASSETS);
      }
    } catch (e) {
      console.error('Error loading assets from LocalStorage, falling back to mock data', e);
      this._assets.set(MOCK_ASSETS);
    }
  }

  private saveToStorage(assets: Asset[]): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(assets));
    } catch (e) {
      console.error('Error saving assets to LocalStorage', e);
    }
  }

  /**
   * Adds a new asset to the collection, generating a random ID and validating required fields.
   */
  addAsset(assetInput: Omit<Asset, 'id'>): void {
    this.validateAsset(assetInput);

    const newAsset: Asset = {
      ...assetInput,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11)
    };

    const updated = [...this._assets(), newAsset];
    this._assets.set(updated);
    this.saveToStorage(updated);
  }

  /**
   * Updates an existing asset by ID after validating its properties.
   */
  updateAsset(id: string, assetInput: Asset): void {
    this.validateAsset(assetInput);

    const currentAssets = this._assets();
    const index = currentAssets.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Asset with ID ${id} not found`);
    }

    const updated = [...currentAssets];
    updated[index] = { ...assetInput, id }; // Ensure ID remains consistent
    this._assets.set(updated);
    this.saveToStorage(updated);
  }

  /**
   * Deletes an asset by ID.
   */
  deleteAsset(id: string): void {
    const currentAssets = this._assets();
    const index = currentAssets.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Asset with ID ${id} not found`);
    }

    const updated = currentAssets.filter(a => a.id !== id);
    this._assets.set(updated);
    this.saveToStorage(updated);
  }

  /**
   * Converts a given value in USD to the currently selected currency.
   */
  convert(usdVal: number): number {
    const currency = this.selectedCurrency();
    const rate = this.EXCHANGE_RATES[currency];
    return Math.round(usdVal * rate * 100) / 100;
  }

  /**
   * Converts a given value from a specific currency back to USD.
   */
  convertToUsd(val: number, fromCurrency: Currency): number {
    const rate = this.EXCHANGE_RATES[fromCurrency];
    return Math.round((val / rate) * 100) / 100;
  }

  /**
   * Validates the asset attributes before saving/updating.
   */
  private validateAsset(asset: Omit<Asset, 'id'>): void {
    if (!asset.name || asset.name.trim() === '') {
      throw new Error('Asset name is required');
    }
    if (asset.type !== 'physical' && asset.type !== 'non-physical') {
      throw new Error('Asset type must be physical or non-physical');
    }
    if (!asset.category || asset.category.trim() === '') {
      throw new Error('Asset category is required');
    }
    if (!asset.purchaseDate) {
      throw new Error('Purchase date is required');
    }
    if (asset.purchaseValue === undefined || asset.purchaseValue === null || asset.purchaseValue < 0) {
      throw new Error('Purchase value cannot be negative');
    }
    if (asset.residualValue === undefined || asset.residualValue === null || asset.residualValue < 0) {
      throw new Error('Residual value cannot be negative');
    }
    if (asset.usefulLife === undefined || asset.usefulLife === null || asset.usefulLife <= 0) {
      throw new Error('Useful life must be greater than 0');
    }
    if (asset.residualValue > asset.purchaseValue) {
      throw new Error('Residual value cannot exceed purchase value');
    }
  }
}
