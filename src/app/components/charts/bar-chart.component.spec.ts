import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BarChartComponent } from './bar-chart.component';
import { Asset } from '../../models/asset.model';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  const mockAssets: Asset[] = [
    {
      id: 'a1',
      name: 'Server',
      type: 'physical',
      category: 'Hardware',
      purchaseDate: '2026-01-01',
      purchaseValue: 10000,
      residualValue: 2000,
      usefulLife: 5
    },
    {
      id: 'a2',
      name: 'Chair',
      type: 'physical',
      category: 'Furniture',
      purchaseDate: '2026-02-01',
      purchaseValue: 5000,
      residualValue: 500,
      usefulLife: 10
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "No assets available to chart." when assets input is empty', () => {
    fixture.componentRef.setInput('assets', []);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No assets available to chart.');
    expect(compiled.querySelector('svg')).toBeNull();
  });

  it('should render an SVG chart when assets input is provided', () => {
    fixture.componentRef.setInput('assets', mockAssets);
    fixture.componentRef.setInput('selectedCurrency', 'USD');
    fixture.componentRef.setInput('convertFn', (val: number) => val);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('No assets available to chart.');
    
    const svg = compiled.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 500 300');

    // Should have 2 bars for 'Furniture' and 'Hardware'
    const barGroups = compiled.querySelectorAll('g');
    expect(barGroups.length).toBe(2);

    // Verify labels
    const texts = Array.from(compiled.querySelectorAll('text')).map(el => el.textContent?.trim());
    expect(texts).toContain('Furniture');
    expect(texts).toContain('Hardware');
  });

  it('should calculate bar height and position correctly based on data values', () => {
    fixture.componentRef.setInput('assets', mockAssets);
    fixture.componentRef.setInput('selectedCurrency', 'USD');
    fixture.componentRef.setInput('convertFn', (val: number) => val);
    fixture.detectChanges();

    // In mockAssets:
    // Furniture: total = 5000
    // Hardware: total = 10000
    // Max is 10000. Chart y scale ticks might go up to neat numbers (e.g. 10000 or 12000 depending on step rounding)
    // Let's assert bars computed properties directly
    const computedBars = component.bars();
    expect(computedBars.length).toBe(2);

    // Furniture should be first alphabetically
    expect(computedBars[0].category).toBe('Furniture');
    expect(computedBars[0].total).toBe(5000);

    // Hardware should be second alphabetically
    expect(computedBars[1].category).toBe('Hardware');
    expect(computedBars[1].total).toBe(10000);

    // Hardware is the max value, so it should be taller than Furniture
    expect(computedBars[1].height).toBeGreaterThan(computedBars[0].height);
  });
});
