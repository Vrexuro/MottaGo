import { useState } from 'react';
import { ProgressBar } from '../../atoms/ProgressBar';

type Period = 'today' | '7d' | 'month';

const PERIODS: Period[] = ['today', '7d', 'month'];
const PERIOD_LABELS: Record<Period, string> = {
  today: 'Hari Ini',
  '7d': '7 Hari',
  month: 'Bulan Ini',
};

interface Category {
  id: string;
  name: string;
  kg: number;
  fillClass: string;
  dotClass: string;
}

const MAX_CAPACITY_KG = 400;

// Sorted largest → smallest; total sums to 263 kg (matches CapacityGaugePanel mock)
const CATEGORIES: Category[] = [
  {
    id: 'organic',
    name: 'Organic Waste',
    kg: 120,
    fillClass: 'bg-green-500',
    dotClass: 'bg-green-500',
  },
  {
    id: 'liquid',
    name: 'Liquid Waste',
    kg: 79,
    fillClass: 'bg-amber-500',
    dotClass: 'bg-amber-500',
  },
  {
    id: 'recyclable',
    name: 'Recyclable Waste',
    kg: 51,
    fillClass: 'bg-lime-500',
    dotClass: 'bg-lime-500',
  },
  {
    id: 'non-recyclable',
    name: 'Non-Recyclable Waste',
    kg: 13,
    fillClass: 'bg-gray-400',
    dotClass: 'bg-gray-400',
  },
];

interface CategoryBreakdownCardProps {
  className?: string;
}

export function CategoryBreakdownCard({ className }: CategoryBreakdownCardProps) {
  const [period, setPeriod] = useState<Period>('today');

  const total = CATEGORIES.reduce((sum, c) => sum + c.kg, 0);
  const capacityPct = Math.round((total / MAX_CAPACITY_KG) * 100);

  return (
    <div
      className={[
        'bg-mottago-surface border border-mottago-border',
        'rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]',
        'flex flex-col',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── Header: title + period selector ────────────── */}
      <div className="flex items-center justify-between gap-2 px-6 pt-6 pb-4 border-b border-mottago-border flex-wrap">
        <h3 className="text-base font-semibold text-text-primary">Distribusi Kategori Waste</h3>

        {/* Text-only period tabs — same pattern as WasteTrendCard */}
        <div className="flex items-center gap-3">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={[
                'text-xs transition-colors whitespace-nowrap',
                period === p
                  ? 'text-text-primary font-semibold'
                  : 'text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Category list ───────────────────────────────── */}
      <div className="flex-1 px-6 py-5 space-y-4">
        {CATEGORIES.map((cat) => {
          const pct = Math.round((cat.kg / total) * 100);
          return (
            <div key={cat.id} className="space-y-1.5">
              {/* Row: dot + name | weight + % */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    aria-hidden="true"
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${cat.dotClass}`}
                  />
                  <span className="text-sm font-medium text-text-primary truncate">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-sm">
                  <span className="text-text-secondary">{cat.kg} kg</span>
                  <span className="font-semibold text-text-primary w-8 text-right">{pct}%</span>
                </div>
              </div>

              {/* Inline progress bar — custom color per category */}
              <div
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={cat.name}
                className="w-full h-2 rounded-full bg-mottago-border overflow-hidden"
              >
                <div
                  className={[
                    'h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none',
                    cat.fillClass,
                  ].join(' ')}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer: total + capacity overview (ProgressBar reuse) ── */}
      <div className="px-6 pb-6 pt-4 border-t border-mottago-border space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-text-secondary">Total Waste Hari Ini</span>
          <span className="text-base font-bold text-text-primary">{total} kg</span>
        </div>
        <ProgressBar value={capacityPct} variant="capacity" size="sm" />
        <p className="text-[11px] text-text-disabled text-right">
          {capacityPct}% dari {MAX_CAPACITY_KG} kg kapasitas maksimum
        </p>
      </div>
    </div>
  );
}
