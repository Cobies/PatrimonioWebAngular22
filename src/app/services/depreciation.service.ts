import { Injectable } from '@angular/core';
import { DepreciationPoint } from '../models/asset.model';

@Injectable({
  providedIn: 'root'
})
export class DepreciationService {
  /**
   * Calculates the yearly straight-line depreciation.
   * Formula: (Purchase Value - Residual Value) / Useful Life
   *
   * @param purchaseValue - The initial value of the asset in USD
   * @param residualValue - The estimated residual value of the asset at the end of its useful life in USD
   * @param usefulLife - The useful life of the asset in years
   * @returns The yearly depreciation amount
   * @throws Error if usefulLife is <= 0 or residualValue > purchaseValue
   */
  calculateYearly(purchaseValue: number, residualValue: number, usefulLife: number): number {
    this.validateInputs(purchaseValue, residualValue, usefulLife);
    const yearlyAmount = (purchaseValue - residualValue) / usefulLife;
    return Math.round(yearlyAmount * 100) / 100;
  }

  /**
   * Generates a trajectory of the asset's remaining and accumulated depreciation values over its useful life.
   *
   * @param purchaseValue - The initial value of the asset in USD
   * @param residualValue - The estimated residual value of the asset at the end of its useful life in USD
   * @param usefulLife - The useful life of the asset in years
   * @returns An array of DepreciationPoint tracking the trajectory year-by-year
   * @throws Error if usefulLife is <= 0 or residualValue > purchaseValue
   */
  getTrajectory(purchaseValue: number, residualValue: number, usefulLife: number): DepreciationPoint[] {
    this.validateInputs(purchaseValue, residualValue, usefulLife);

    const yearlyDepreciation = (purchaseValue - residualValue) / usefulLife;
    const points: DepreciationPoint[] = [];

    // Year 0 represents the purchase state
    points.push({
      year: 0,
      remainingValue: purchaseValue,
      accumulatedDepreciation: 0
    });

    for (let year = 1; year <= usefulLife; year++) {
      const accumulatedDepreciation = Math.round((yearlyDepreciation * year) * 100) / 100;
      const remainingValue = Math.round((purchaseValue - accumulatedDepreciation) * 100) / 100;

      points.push({
        year,
        remainingValue: Math.max(residualValue, remainingValue), // Ensure remaining value doesn't go below residual
        accumulatedDepreciation
      });
    }

    return points;
  }

  /**
   * Validates the input values for depreciation calculations.
   */
  private validateInputs(purchaseValue: number, residualValue: number, usefulLife: number): void {
    if (usefulLife <= 0) {
      throw new Error('Useful life must be greater than 0');
    }
    if (residualValue > purchaseValue) {
      throw new Error('Residual value cannot exceed purchase value');
    }
    if (purchaseValue < 0 || residualValue < 0) {
      throw new Error('Purchase value and residual value cannot be negative');
    }
  }
}
