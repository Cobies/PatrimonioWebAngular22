import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AreaChartComponent } from './area-chart.component';
import { Asset } from '../../models/asset.model';

describe('AreaChartComponent', () => {
  let component: AreaChartComponent;
  let fixture: ComponentFixture<AreaChartComponent>;

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
      imports: [AreaChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AreaChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "No assets available to calculate trajectory." when assets is empty', () => {
    fixture.componentRef.setInput('assets', []);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No assets available to calculate trajectory.');
    expect(compiled.querySelector('svg')).toBeNull();
  });

  it('should render SVG area and line paths when assets are present', () => {
    fixture.componentRef.setInput('assets', mockAssets);
    fixture.componentRef.setInput('selectedCurrency', 'USD');
    fixture.componentRef.setInput('convertFn', (val: number) => val);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('No assets available to calculate trajectory.');

    const svg = compiled.querySelector('svg');
    expect(svg).toBeTruthy();

    // Verify paths are rendered
    const paths = compiled.querySelectorAll('path');
    expect(paths.length).toBe(2); // One for area gradient fill, one for stroke line

    const areaPathAttr = paths[0].getAttribute('d');
    const linePathAttr = paths[1].getAttribute('d');

    expect(areaPathAttr).toBeTruthy();
    expect(areaPathAttr?.startsWith('M')).toBe(true);
    expect(areaPathAttr?.includes('Z')).toBe(true); // Area path should close with Z

    expect(linePathAttr).toBeTruthy();
    expect(linePathAttr?.startsWith('M')).toBe(true);
  });

  it('should compute the correct trajectory length matching max usefulLife', () => {
    fixture.componentRef.setInput('assets', mockAssets);
    fixture.componentRef.setInput('selectedCurrency', 'USD');
    fixture.componentRef.setInput('convertFn', (val: number) => val);
    fixture.detectChanges();

    // Max usefulLife is 10 years, so trajectory should have 11 points (Years 0 to 10)
    const trajectory = component.trajectory();
    expect(trajectory.length).toBe(11);

    // Initial Year 0 remaining value should equal total purchase value (10000 + 5000 = 15000)
    expect(trajectory[0].remainingValue).toBe(15000);
    expect(trajectory[0].accumulatedDepreciation).toBe(0);

    // Year 10 remaining value should equal total residual value (2000 + 500 = 2500)
    expect(trajectory[10].remainingValue).toBe(2500);
    expect(trajectory[10].accumulatedDepreciation).toBe(12500);
  });
});
