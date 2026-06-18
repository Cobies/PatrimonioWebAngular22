import { Component, input, computed, signal } from '@angular/core';
import { Asset, Currency } from '../../models/asset.model';

interface TooltipData {
  x: number;
  y: number;
  category: string;
  count: number;
  formattedValue: string;
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  template: `
    <div class="relative w-full h-full bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-slate-700/80">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="text-base font-semibold text-slate-200">Asset Distribution</h3>
          <p class="text-xs text-slate-400">Purchase valuation grouped by category</p>
        </div>
      </div>

      <div class="relative flex-1 min-h-[220px] w-full" #chartContainer>
        @if (bars().length === 0) {
          <div class="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
            No assets available to chart.
          </div>
        } @else {
          <svg viewBox="0 0 500 300" class="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
            <!-- Gradients -->
            <defs>
              <linearGradient id="barGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stop-color="#0f766e" /> <!-- Teal 700 -->
                <stop offset="100%" stop-color="#10b981" /> <!-- Emerald 500 -->
              </linearGradient>
              <linearGradient id="barHoverGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stop-color="#0d9488" /> <!-- Teal 600 -->
                <stop offset="100%" stop-color="#34d399" /> <!-- Emerald 400 -->
              </linearGradient>
            </defs>

            <!-- Y-Axis Ticks & Grid Lines -->
            @for (yVal of yTicks(); track yVal) {
              <line
                x1="60"
                [attr.y1]="yScale(yVal)"
                x2="480"
                [attr.y2]="yScale(yVal)"
                stroke="#1e293b"
                stroke-dasharray="3,3"
                stroke-width="1"
              />
              <text
                x="50"
                [attr.y]="yScale(yVal) + 4"
                fill="#64748b"
                font-size="10"
                text-anchor="end"
                class="font-mono"
              >
                {{ formatCurrencyShort(yVal) }}
              </text>
            }

            <!-- Bars -->
            @for (bar of bars(); track bar.category; let i = $index) {
              <g 
                (mouseenter)="onHover(i, $event, chartContainer)" 
                (mouseleave)="onLeave()"
                class="cursor-pointer"
              >
                <!-- Invisible interaction zone to make hovering easier -->
                <rect
                  [attr.x]="bar.x - 5"
                  y="20"
                  [attr.width]="bar.width + 10"
                  height="230"
                  fill="transparent"
                />
                
                <!-- The actual visual bar -->
                <rect
                  [attr.x]="bar.x"
                  [attr.y]="bar.y"
                  [attr.width]="bar.width"
                  [attr.height]="bar.height"
                  [attr.fill]="hoveredIndex() === i ? 'url(#barHoverGradient)' : 'url(#barGradient)'"
                  rx="4"
                  class="transition-all duration-300 origin-bottom"
                />

                <!-- Category label under the bar -->
                <text
                  [attr.x]="bar.x + bar.width / 2"
                  y="270"
                  fill="#94a3b8"
                  font-size="9"
                  text-anchor="middle"
                  class="font-medium tracking-wide"
                >
                  {{ truncateLabel(bar.category) }}
                </text>
              </g>
            }
          </svg>

          <!-- Floating Tooltip -->
          @if (tooltipData(); as data) {
            <div 
              [style.left.px]="data.x"
              [style.top.px]="data.y"
              class="absolute z-10 bg-slate-950/90 border border-slate-700/80 text-slate-100 text-xs rounded-xl p-3 shadow-2xl backdrop-blur-md pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 transition-all duration-150"
            >
              <div class="font-bold text-emerald-400 mb-0.5">{{ data.category }}</div>
              <div class="flex items-center gap-2">
                <span class="text-slate-400">Total Value:</span>
                <span class="font-mono text-slate-200">{{ data.formattedValue }}</span>
              </div>
              <div class="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                <span>Assets Count:</span>
                <span class="font-mono font-medium">{{ data.count }}</span>
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
export class BarChartComponent {
  assets = input<Asset[]>([]);
  selectedCurrency = input<Currency>('USD');
  convertFn = input<(usdVal: number) => number>((usdVal: number) => usdVal);

  hoveredIndex = signal<number | null>(null);
  tooltipData = signal<TooltipData | null>(null);

  // Group and compute category stats
  private categoryStats = computed(() => {
    const list = this.assets();
    const conv = this.convertFn();
    const groups: Record<string, { total: number; count: number }> = {};

    for (const asset of list) {
      const cat = asset.category || 'Unassigned';
      if (!groups[cat]) {
        groups[cat] = { total: 0, count: 0 };
      }
      groups[cat].total += conv(asset.purchaseValue);
      groups[cat].count += 1;
    }

    return Object.entries(groups)
      .map(([category, data]) => ({
        category,
        total: Math.round(data.total * 100) / 100,
        count: data.count
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  });

  // Calculate maximum value for chart scaling
  private maxVal = computed(() => {
    const stats = this.categoryStats();
    if (stats.length === 0) return 100;
    const values = stats.map(s => s.total);
    return Math.max(...values, 100);
  });

  // Compute clean Y-axis ticks
  yTicks = computed(() => {
    const max = this.maxVal();
    const steps = 4;
    // Round tick values to neat numbers
    const rawStep = max / steps;
    const orderOfMagnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const cleanStep = Math.ceil(rawStep / (orderOfMagnitude || 1)) * (orderOfMagnitude || 1);
    
    return Array.from({ length: steps + 1 }, (_, i) => i * cleanStep);
  });

  private maxTickVal = computed(() => {
    const ticks = this.yTicks();
    return ticks[ticks.length - 1];
  });

  // Scale value to SVG y-coordinate (viewBox height is 300, chart area is y=20 to y=250)
  yScale(val: number): number {
    const max = this.maxTickVal();
    const chartHeight = 230; // 250 - 20
    const bottomY = 250;
    return bottomY - (val / max) * chartHeight;
  }

  // Compute individual bar positions
  bars = computed(() => {
    const stats = this.categoryStats();
    const n = stats.length;
    if (n === 0) return [];

    const chartWidth = 420; // 480 - 60
    const startX = 60;
    const barSpacingRatio = 0.4; // 40% spacing

    const colWidth = chartWidth / n;
    const barWidth = colWidth * (1 - barSpacingRatio);

    return stats.map((stat, i) => {
      const height = (stat.total / this.maxTickVal()) * 230;
      const x = startX + i * colWidth + (colWidth - barWidth) / 2;
      const y = 250 - height;

      return {
        category: stat.category,
        total: stat.total,
        count: stat.count,
        x,
        y,
        width: barWidth,
        height: Math.max(height, 4) // Ensure a tiny sliver is always visible
      };
    });
  });

  onHover(index: number, event: MouseEvent, container: HTMLDivElement): void {
    this.hoveredIndex.set(index);
    const bar = this.bars()[index];
    if (!bar) return;

    // Get cursor position relative to the container element
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const formattedValue = this.formatCurrency(bar.total);

    this.tooltipData.set({
      x,
      y: y - 5,
      category: bar.category,
      count: bar.count,
      formattedValue
    });
  }

  onLeave(): void {
    this.hoveredIndex.set(null);
    this.tooltipData.set(null);
  }

  truncateLabel(label: string): string {
    return label.length > 12 ? label.substring(0, 10) + '..' : label;
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
