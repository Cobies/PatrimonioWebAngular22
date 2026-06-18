import { TestBed } from '@angular/core/testing';
import { AssetService } from './asset.service';
import { Asset, MOCK_ASSETS } from '../models/asset.model';

describe('AssetService', () => {
  let service: AssetService;
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    
    // Mock LocalStorage
    vi.spyOn(localStorage, 'getItem').mockImplementation((key: string) => store[key] || null);
    vi.spyOn(localStorage, 'setItem').mockImplementation((key: string, value: string) => {
      store[key] = value;
    });

    TestBed.configureTestingModule({
      providers: [AssetService]
    });
    
    service = TestBed.inject(AssetService);
  });

  afterEach(() => {
    // Clear mock storage
    store = {};
  });

  it('should be created and initialized with mock assets if storage is empty', () => {
    expect(service).toBeTruthy();
    expect(service.assets().length).toBe(MOCK_ASSETS.length);
    expect(localStorage.setItem).toHaveBeenCalledWith('corporate_assets', JSON.stringify(MOCK_ASSETS));
  });

  it('should load assets from localStorage if they exist', () => {
    const customAssets: Asset[] = [
      {
        id: 'c1',
        name: 'Custom Asset',
        type: 'physical',
        category: 'Test',
        purchaseDate: '2026-01-01',
        purchaseValue: 5000,
        residualValue: 1000,
        usefulLife: 5
      }
    ];
    
    // Set up storage before service starts
    store['corporate_assets'] = JSON.stringify(customAssets);
    
    // Create new service instance to trigger load
    const newService = TestBed.inject(AssetService);
    expect(newService.assets()).toEqual(customAssets);
  });

  describe('CRUD operations', () => {
    it('should add a new asset with a generated ID and save to LocalStorage', () => {
      const assetInput: Omit<Asset, 'id'> = {
        name: 'New Server Pack',
        type: 'physical',
        category: 'Hardware',
        purchaseDate: '2026-06-01',
        purchaseValue: 20000,
        residualValue: 4000,
        usefulLife: 4
      };

      const initialLength = service.assets().length;
      service.addAsset(assetInput);

      const updatedAssets = service.assets();
      expect(updatedAssets.length).toBe(initialLength + 1);

      const added = updatedAssets.find(a => a.name === 'New Server Pack');
      expect(added).toBeTruthy();
      expect(added?.id).toBeDefined();
      expect(added?.category).toBe('Hardware');
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should update an existing asset and save to LocalStorage', () => {
      const existingAsset = service.assets()[0];
      const updatedInfo: Asset = {
        ...existingAsset,
        name: 'Updated Server Rack Name',
        purchaseValue: 13000
      };

      service.updateAsset(existingAsset.id, updatedInfo);

      expect(service.assets()[0].name).toBe('Updated Server Rack Name');
      expect(service.assets()[0].purchaseValue).toBe(13000);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should throw an error when updating a non-existent asset ID', () => {
      const badAsset: Asset = {
        id: 'non-existent',
        name: 'Ghost Asset',
        type: 'physical',
        category: 'None',
        purchaseDate: '2026-06-01',
        purchaseValue: 100,
        residualValue: 0,
        usefulLife: 1
      };

      expect(() => service.updateAsset('non-existent', badAsset)).toThrowError('Asset with ID non-existent not found');
    });

    it('should delete an asset and save to LocalStorage', () => {
      const assetToDelete = service.assets()[0];
      const initialLength = service.assets().length;

      service.deleteAsset(assetToDelete.id);

      expect(service.assets().length).toBe(initialLength - 1);
      expect(service.assets().find(a => a.id === assetToDelete.id)).toBeUndefined();
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should throw an error when deleting a non-existent asset ID', () => {
      expect(() => service.deleteAsset('non-existent')).toThrowError('Asset with ID non-existent not found');
    });
  });

  describe('Currency Conversion', () => {
    it('should perform conversions based on exchange rates and selectedCurrency signal', () => {
      // Default currency is USD (rate: 1.0)
      expect(service.selectedCurrency()).toBe('USD');
      expect(service.convert(100)).toBe(100);

      // Switch to EUR (rate: 0.9)
      service.selectedCurrency.set('EUR');
      expect(service.convert(100)).toBe(90);

      // Switch to ARS (rate: 1000.0)
      service.selectedCurrency.set('ARS');
      expect(service.convert(100)).toBe(100000);
    });

    it('should convert from other currencies back to USD', () => {
      expect(service.convertToUsd(90, 'EUR')).toBe(100);
      expect(service.convertToUsd(100000, 'ARS')).toBe(100);
      expect(service.convertToUsd(100, 'USD')).toBe(100);
    });
  });

  describe('Validation logic', () => {
    let validAssetInput: Omit<Asset, 'id'>;

    beforeEach(() => {
      validAssetInput = {
        name: 'Valid Name',
        type: 'physical',
        category: 'Office',
        purchaseDate: '2026-01-01',
        purchaseValue: 1000,
        residualValue: 100,
        usefulLife: 5
      };
    });

    it('should reject empty or whitespace name', () => {
      expect(() => service.addAsset({ ...validAssetInput, name: '' })).toThrowError('Asset name is required');
      expect(() => service.addAsset({ ...validAssetInput, name: '   ' })).toThrowError('Asset name is required');
    });

    it('should reject invalid asset type', () => {
      const badTypeAsset = { ...validAssetInput, type: 'virtual' as any };
      expect(() => service.addAsset(badTypeAsset)).toThrowError('Asset type must be physical or non-physical');
    });

    it('should reject empty category', () => {
      expect(() => service.addAsset({ ...validAssetInput, category: '' })).toThrowError('Asset category is required');
    });

    it('should reject empty purchase date', () => {
      expect(() => service.addAsset({ ...validAssetInput, purchaseDate: '' })).toThrowError('Purchase date is required');
    });

    it('should reject negative purchase or residual value', () => {
      expect(() => service.addAsset({ ...validAssetInput, purchaseValue: -1 })).toThrowError('Purchase value cannot be negative');
      expect(() => service.addAsset({ ...validAssetInput, residualValue: -1 })).toThrowError('Residual value cannot be negative');
    });

    it('should reject non-positive useful life', () => {
      expect(() => service.addAsset({ ...validAssetInput, usefulLife: 0 })).toThrowError('Useful life must be greater than 0');
      expect(() => service.addAsset({ ...validAssetInput, usefulLife: -2 })).toThrowError('Useful life must be greater than 0');
    });

    it('should reject if residual value exceeds purchase value', () => {
      expect(() => service.addAsset({ ...validAssetInput, purchaseValue: 100, residualValue: 101 })).toThrowError('Residual value cannot exceed purchase value');
    });
  });
});
