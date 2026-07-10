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
  colorClass: string;
}

const CATEGORY_CONFIG = [
  { key: 'organik' as const, name: 'Sampah Organik', colorClass: 'bg-accent-primary' },
  { key: 'anorganik' as const, name: 'Sampah Anorganik', colorClass: 'bg-info-bg' },
  { key: 'minyak' as const, name: 'Minyak Jelantah', colorClass: 'bg-capacity-warning' },
] as const;

interface CategoryBreakdownCardProps {
  organik: number;
  anorganik: number;
  minyak: number;
  maxKg?: number;
  className?: string;
}

export function CategoryBreakdownCard({
  organik,
  anorganik,
  minyak,
  maxKg = 400,
  className,
}: CategoryBreakdownCardProps) {
  const [period, setPeriod] = useState<Period>('today');

  const VALUES: Record<'organik' | 'anorganik' | 'minyak', number> = {
    organik,
    anorganik,
    minyak,
  };

  const CATEGORIES: Category[] = CATEGORY_CONFIG.map((cfg) => ({
    id: cfg.key,
    name: cfg.name,
    kg: VALUES[cfg.key],
    colorClass: cfg.colorClass,
  }));

  const total = CATEGORIES.reduce((sum, c) => sum + c.kg, 0);
  const capacityPct = maxKg > 0 ? Math.round((total / maxKg) * 100) : 0;

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
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${cat.colorClass}`}
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
                    cat.colorClass,
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
          {capacityPct}% dari {maxKg} kg kapasitas maksimum
        </p>
      </div>
    </div>
  );
}
