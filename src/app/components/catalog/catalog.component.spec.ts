import { TestBed, ComponentFixture } from '@angular/core/testing';
import { signal } from '@angular/core';
import { CatalogComponent } from './catalog.component';
import { AssetService } from '../../services/asset.service';
import { Asset, Currency } from '../../models/asset.model';

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;
  let mockAssetService: any;
  let mockAssetsSignal: any;
  let mockCurrencySignal: any;

  beforeEach(async () => {
    mockAssetsSignal = signal<Asset[]>([
      {
        id: '1',
        name: 'Asset 1',
        type: 'physical',
        category: 'Hardware',
        purchaseDate: '2026-01-01',
        purchaseValue: 1000,
        residualValue: 200,
        usefulLife: 5,
        serialNumber: 'SN-001',
        location: 'Storage A'
      }
    ]);
    mockCurrencySignal = signal<Currency>('USD');

    mockAssetService = {
      assets: mockAssetsSignal,
      selectedCurrency: mockCurrencySignal,
      convert: vi.fn((usdVal: number) => usdVal),
      convertToUsd: vi.fn((val: number, fromCurrency: Currency) => val),
      addAsset: vi.fn(),
      updateAsset: vi.fn(),
      deleteAsset: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CatalogComponent],
      providers: [
        { provide: AssetService, useValue: mockAssetService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load assets and selectedCurrency from service', () => {
    expect(component.assets()).toEqual(mockAssetsSignal());
    expect(component.selectedCurrency()).toBe('USD');
  });

  it('should open form on openCreateForm', () => {
    expect(component.isFormOpen()).toBeFalsy();
    component.onOpenCreateForm();
    expect(component.isFormOpen()).toBeTruthy();
    expect(component.selectedAsset()).toBeNull();
  });

  it('should open form with asset on edit', () => {
    const asset = mockAssetsSignal()[0];
    component.onOpenEditForm(asset);
    expect(component.isFormOpen()).toBeTruthy();
    expect(component.selectedAsset()).toEqual(asset);
  });

  it('should close form on closeForm', () => {
    component.onOpenCreateForm();
    expect(component.isFormOpen()).toBeTruthy();
    component.onCloseForm();
    expect(component.isFormOpen()).toBeFalsy();
  });

  it('should call service addAsset on save new asset', () => {
    const newAsset: Omit<Asset, 'id'> = {
      name: 'New Asset',
      type: 'non-physical',
      category: 'Software',
      purchaseDate: '2026-02-02',
      purchaseValue: 500,
      residualValue: 50,
      usefulLife: 3
    };
    component.onSaveAsset(newAsset);
    expect(mockAssetService.addAsset).toHaveBeenCalledWith(newAsset);
    expect(component.isFormOpen()).toBeFalsy();
  });

  it('should call service updateAsset on save existing asset', () => {
    const existingAsset: Asset = {
      id: '1',
      name: 'Asset 1 Updated',
      type: 'physical',
      category: 'Hardware',
      purchaseDate: '2026-01-01',
      purchaseValue: 1000,
      residualValue: 200,
      usefulLife: 5
    };
    component.onSaveAsset(existingAsset);
    expect(mockAssetService.updateAsset).toHaveBeenCalledWith('1', existingAsset);
    expect(component.isFormOpen()).toBeFalsy();
  });

  it('should call service deleteAsset when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.onDeleteAsset('1');
    expect(mockAssetService.deleteAsset).toHaveBeenCalledWith('1');
  });

  it('should not call service deleteAsset when cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    component.onDeleteAsset('1');
    expect(mockAssetService.deleteAsset).not.toHaveBeenCalled();
  });

  it('should toggle currency in service', () => {
    component.onCurrencyToggle('EUR');
    expect(mockCurrencySignal()).toBe('EUR');
  });
});
