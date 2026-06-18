import { TestBed } from '@angular/core/testing';
import { DepreciationService } from './depreciation.service';

describe('DepreciationService', () => {
  let service: DepreciationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DepreciationService]
    });
    service = TestBed.inject(DepreciationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateYearly', () => {
    it('should calculate straight-line depreciation correctly (Scenario: 10000, 2000, 5)', () => {
      const yearly = service.calculateYearly(10000, 2000, 5);
      expect(yearly).toBe(1600);
    });

    it('should handle decimal values and round to two decimal places', () => {
      // (10000 - 3333) / 3 = 6667 / 3 = 2222.333333... => should be 2222.33
      const yearly = service.calculateYearly(10000, 3333, 3);
      expect(yearly).toBe(2222.33);
    });

    it('should allow residual value to be equal to purchase value (yearly depreciation = 0)', () => {
      const yearly = service.calculateYearly(5000, 5000, 10);
      expect(yearly).toBe(0);
    });

    it('should throw an error if useful life is less than or equal to 0', () => {
      expect(() => service.calculateYearly(10000, 2000, 0)).toThrowError('La vida útil debe ser mayor a 0');
      expect(() => service.calculateYearly(10000, 2000, -5)).toThrowError('La vida útil debe ser mayor a 0');
    });

    it('should throw an error if residual value exceeds purchase value', () => {
      expect(() => service.calculateYearly(5000, 6000, 5)).toThrowError('El valor residual no puede exceder el valor de compra');
    });

    it('should throw an error if purchase value or residual value is negative', () => {
      expect(() => service.calculateYearly(-1000, 200, 5)).toThrowError('El valor de compra y el valor residual no pueden ser negativos');
      expect(() => service.calculateYearly(1000, -200, 5)).toThrowError('El valor de compra y el valor residual no pueden ser negativos');
    });
  });

  describe('getTrajectory', () => {
    it('should generate the correct trajectory points year-by-year', () => {
      const trajectory = service.getTrajectory(10000, 2000, 5);
      
      expect(trajectory.length).toBe(6); // Year 0 to Year 5
      
      // Year 0 (initial purchase)
      expect(trajectory[0]).toEqual({
        year: 0,
        remainingValue: 10000,
        accumulatedDepreciation: 0
      });

      // Year 1
      expect(trajectory[1]).toEqual({
        year: 1,
        remainingValue: 8400,
        accumulatedDepreciation: 1600
      });

      // Year 5 (end of useful life, remaining value should equal residual value)
      expect(trajectory[5]).toEqual({
        year: 5,
        remainingValue: 2000,
        accumulatedDepreciation: 8000
      });
    });

    it('should ensure remaining value never dips below residual value due to rounding errors', () => {
      const trajectory = service.getTrajectory(1000, 333.33, 3);
      expect(trajectory[3].remainingValue).toBeGreaterThanOrEqual(333.33);
    });

    it('should throw an error on invalid inputs in getTrajectory', () => {
      expect(() => service.getTrajectory(1000, 2000, 5)).toThrowError('El valor residual no puede exceder el valor de compra');
      expect(() => service.getTrajectory(1000, 200, 0)).toThrowError('La vida útil debe ser mayor a 0');
    });
  });
});
