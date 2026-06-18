import { Component, input, computed, signal } from '@angular/core';
import { Asset, Currency } from '../../models/asset.model';

interface TooltipData {
  x: number;
  y: number;
  year: number;
  remainingValue: number;
  accumulatedDepreciation: number;
  formattedRemaining: string;
  formattedAccumulated: string;
}

@Component({
  selector: 'app-area-chart',
  standalone: true,
  template: `
    <div class="relative w-full h-full bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700/80 shadow-xs">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">Depreciation Curve</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">Projected portfolio value over useful life</p>
        </div>
      </div>

      <div class="relative flex-1 min-h-[220px] w-full" #chartContainer>
        @if (trajectory().length === 0) {
          <div class="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 text-sm">
            No assets available to calculate trajectory.
          </div>
        } @else {
          <svg viewBox="0 0 500 300" class="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <!-- Gradients -->
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#6366f1" stop-opacity="0.35" /> <!-- Indigo 500 -->
                <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.00" /> <!-- Violet 500 -->
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#6366f1" /> <!-- Indigo 500 -->
                <stop offset="100%" stop-color="#a855f7" /> <!-- Purple 500 -->
              </linearGradient>
            </defs>

            <!-- Y-Axis Ticks & Horizontal Grid Lines -->
            @for (yVal of yTicks(); track yVal) {
              <line
                x1="60"
                [attr.y1]="yScale(yVal)"
                x2="480"
                [attr.y2]="yScale(yVal)"
                class="stroke-slate-200 dark:stroke-slate-800/80 transition-colors duration-300"
                stroke-dasharray="3,3"
                stroke-width="1"
              />
              <text
                x="50"
                [attr.y]="yScale(yVal) + 4"
                fill="currentColor"
                class="text-slate-400 dark:text-slate-500 font-mono transition-colors duration-300"
                font-size="10"
                text-anchor="end"
              >
                {{ formatCurrencyShort(yVal) }}
              </text>
            }

            <!-- X-Axis Grid Lines for Ticks -->
            @for (pt of xTicks(); track pt.year) {
              <line
                [attr.x1]="xScale(pt.year)"
                y1="20"
                [attr.x2]="xScale(pt.year)"
                y2="250"
                class="stroke-slate-200 dark:stroke-slate-800/80 transition-colors duration-300"
                stroke-dasharray="3,3"
                stroke-width="1"
              />
              <text
                [attr.x]="xScale(pt.year)"
                y="270"
                fill="currentColor"
                class="text-slate-400 dark:text-slate-500 font-medium transition-colors duration-300"
                font-size="9"
                text-anchor="middle"
              >
                Yr {{ pt.year }}
              </text>
            }

            <!-- Area Path -->
            <path
              [attr.d]="areaPath()"
              fill="url(#areaGradient)"
            />

            <!-- Stroke Line -->
            <path
              [attr.d]="linePath()"
              fill="none"
              stroke="url(#lineGradient)"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- Interactive Dots and Hover Regions -->
            @for (pt of trajectory(); track pt.year; let i = $index) {
              <!-- Point Dot -->
              <circle
                [attr.cx]="xScale(pt.year)"
                [attr.cy]="yScale(pt.remainingValue)"
                [attr.r]="hoveredIndex() === i ? 6 : 3.5"
                [attr.fill]="hoveredIndex() === i ? '#818cf8' : '#6366f1'"
                [attr.stroke]="hoveredIndex() === i ? '#ffffff' : 'none'"
                [attr.stroke-width]="hoveredIndex() === i ? 1.5 : 0"
                class="transition-all duration-150"
              />

              <!-- Slice Hover Zone (vertical bar) -->
              <rect
                [attr.x]="xScale(pt.year) - sliceWidth() / 2"
                y="20"
                [attr.width]="sliceWidth()"
                height="230"
                fill="transparent"
                class="cursor-pointer"
                (mouseenter)="onHover(i, $event, chartContainer)"
                (mouseleave)="onLeave()"
              />
            }
          </svg>

          <!-- Floating Tooltip -->
          @if (tooltipData(); as data) {
            <div 
              [style.left.px]="data.x"
              [style.top.px]="data.y"
              class="absolute z-10 bg-white/95 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 text-xs rounded-xl p-3 shadow-2xl backdrop-blur-md pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 transition-all duration-150"
            >
              <div class="font-bold text-indigo-650 dark:text-indigo-400 mb-1">Timeline: Year {{ data.year }}</div>
              <div class="flex items-center gap-2">
                <span class="text-slate-500 dark:text-slate-400">Remaining Value:</span>
                <span class="font-mono text-slate-800 dark:text-slate-200 font-semibold">{{ data.formattedRemaining }}</span>
              </div>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-slate-500 dark:text-slate-400">Accumulated Dep:</span>
                <span class="font-mono text-slate-500 dark:text-slate-400">{{ data.formattedAccumulated }}</span>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class AreaChartComponent {
  assets = input<Asset[]>([]);
  selectedCurrency = input<Currency>('USD');
  convertFn = input<(usdVal: number) => number>((usdVal: number) => usdVal);

  hoveredIndex = signal<number | null>(null);
  tooltipData = signal<TooltipData | null>(null);

  // Compute aggregated depreciation trajectory year-by-year
  trajectory = computed(() => {
    const list = this.assets();
    if (list.length === 0) return [];

    const conv = this.convertFn();
    const maxLife = Math.max(...list.map(a => a.usefulLife), 1);
    const points: { year: number; remainingValue: number; accumulatedDepreciation: number }[] = [];

    for (let year = 0; year <= maxLife; year++) {
      let totalRemaining = 0;
      let totalAccumulated = 0;

      for (const asset of list) {
        const pVal = conv(asset.purchaseValue);
        const rVal = conv(asset.residualValue);
        const life = asset.usefulLife;
        const yearlyDep = (pVal - rVal) / life;

        if (year === 0) {
          totalRemaining += pVal;
          totalAccumulated += 0;
        } else if (year >= life) {
          totalRemaining += rVal;
          totalAccumulated += (pVal - rVal);
        } else {
          const acc = Math.round((yearlyDep * year) * 100) / 100;
          const rem = Math.round((pVal - acc) * 100) / 100;
          totalRemaining += Math.max(rVal, rem);
          totalAccumulated += acc;
        }
      }

      points.push({
        year,
        remainingValue: Math.round(totalRemaining * 100) / 100,
        accumulatedDepreciation: Math.round(totalAccumulated * 100) / 100
      });
    }

    return points;
  });

  // Calculate maximum value for chart scaling
  private maxVal = computed(() => {
    const pts = this.trajectory();
    if (pts.length === 0) return 100;
    const values = pts.map(p => p.remainingValue);
    return Math.max(...values, 100);
  });

  // Compute clean Y-axis ticks
  yTicks = computed(() => {
    const max = this.maxVal();
    const steps = 4;
    const rawStep = max / steps;
    const orderOfMagnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const cleanStep = Math.ceil(rawStep / (orderOfMagnitude || 1)) * (orderOfMagnitude || 1);
    
    return Array.from({ length: steps + 1 }, (_, i) => i * cleanStep);
  });

  private maxTickVal = computed(() => {
    const ticks = this.yTicks();
    return ticks[ticks.length - 1];
  });

  // Compute maximum useful life
  private maxLife = computed(() => {
    const pts = this.trajectory();
    if (pts.length === 0) return 1;
    return pts[pts.length - 1].year;
  });

  // Scale calculations
  xScale(year: number): number {
    const life = this.maxLife();
    const chartWidth = 420; // 480 - 60
    const startX = 60;
    return startX + (year / life) * chartWidth;
  }

  yScale(val: number): number {
    const max = this.maxTickVal();
    const chartHeight = 230; // 250 - 20
    const bottomY = 250;
    return bottomY - (val / max) * chartHeight;
  }

  sliceWidth = computed(() => {
    const life = this.maxLife();
    return 420 / life;
  });

  // Generate ticks for X-axis
  xTicks = computed(() => {
    const points = this.trajectory();
    const life = this.maxLife();
    if (points.length === 0) return [];
    
    if (life <= 8) {
      return points;
    } else if (life <= 16) {
      return points.filter(p => p.year % 2 === 0 || p.year === life);
    } else {
      return points.filter(p => p.year % 5 === 0 || p.year === life);
    }
  });

  // SVG Line path helper
  linePath = computed(() => {
    const pts = this.trajectory();
    if (pts.length === 0) return '';
    return pts.map((pt, i) => {
      const x = this.xScale(pt.year);
      const y = this.yScale(pt.remainingValue);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  });

  // SVG Area path helper
  areaPath = computed(() => {
    const pts = this.trajectory();
    if (pts.length === 0) return '';
    const line = this.linePath();
    const firstX = this.xScale(0);
    const lastX = this.xScale(this.maxLife());
    return `${line} L ${lastX} 250 L ${firstX} 250 Z`;
  });

  onHover(index: number, event: MouseEvent, container: HTMLDivElement): void {
    this.hoveredIndex.set(index);
    const pt = this.trajectory()[index];
    if (!pt) return;

    // Position tooltip near the point
    const rect = container.getBoundingClientRect();
    const x = this.xScale(pt.year) * (rect.width / 500); // adjust for layout scale
    const y = this.yScale(pt.remainingValue) * (rect.height / 300);

    this.tooltipData.set({
      x,
      y: y - 5,
      year: pt.year,
      remainingValue: pt.remainingValue,
      accumulatedDepreciation: pt.accumulatedDepreciation,
      formattedRemaining: this.formatCurrency(pt.remainingValue),
      formattedAccumulated: this.formatCurrency(pt.accumulatedDepreciation)
    });
  }

  onLeave(): void {
    this.hoveredIndex.set(null);
    this.tooltipData.set(null);
  }

  formatCurrency(val: number): string {
    const curr = this.selectedCurrency();
    const symbol = this.getCurrencySymbol(curr);
    return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatCurrencyShort(val: number): string {
    const curr = this.selectedCurrency();
    const symbol = this.getCurrencySymbol(curr);
    if (val >= 1000000) {
      return `${symbol}${(val / 1000000).toFixed(1)}M`;
    }
    if (val >= 1000) {
      return `${symbol}${(val / 1000).toFixed(1)}k`;
    }
    return `${symbol}${val}`;
  }

  private getCurrencySymbol(curr: Currency): string {
    switch (curr) {
      case 'EUR': return '€';
      case 'ARS': return 'AR$ ';
      default: return '$';
    }
  }
}
