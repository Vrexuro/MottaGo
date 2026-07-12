import type { CategoryCapacity } from '../../../services/capacityService';
import { CAPACITY_THRESHOLDS } from '../../../constants/capacity';
import type { WasteType } from '../../../types/waste.types';

const COLOR_CLASS: Record<WasteType, string> = {
  organik: 'bg-accent-primary',
  anorganik: 'bg-info-bg',
  minyak: 'bg-capacity-warning',
};

interface CategoryBreakdownCardProps {
  /** Kapasitas per kategori — current dihitung live (akumulasi sejak pickup
   * kategori itu terakhir selesai), max dari pengaturan Manajer per kategori
   * (0016). Tiap gauge kembali ke 0% begitu pickup kategori tsb selesai. */
  categories: CategoryCapacity[];
  className?: string;
}

export function CategoryBreakdownCard({ categories, className }: CategoryBreakdownCardProps) {
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
      {/* ── Header ───────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4 border-b border-mottago-border">
        <h3 className="text-base font-semibold text-text-primary">Kapasitas per Kategori</h3>
        <p className="mt-0.5 text-xs text-text-secondary">
          Reset ke 0% otomatis setelah pickup kategori tersebut selesai
        </p>
      </div>

      {/* ── Category list ───────────────────────────────── */}
      <div className="flex-1 px-6 py-5 space-y-5">
        {categories.map((cat) => {
          const notConfigured = cat.maxValue <= 0;
          const pctClamped = Math.min(Math.max(cat.pct, 0), 100);
          const isKritis = cat.pct >= CAPACITY_THRESHOLDS.CRITICAL;
          const isWarning = cat.pct >= CAPACITY_THRESHOLDS.WARNING;
          const pctColorClass = isKritis
            ? 'text-capacity-critical'
            : isWarning
              ? 'text-capacity-warning'
              : 'text-text-primary';

          return (
            <div key={cat.wasteType} className="space-y-1.5">
              {/* Row: dot + name | current/max + % */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    aria-hidden="true"
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${COLOR_CLASS[cat.wasteType]}`}
                  />
                  <span className="text-sm font-medium text-text-primary truncate">
                    {cat.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-sm">
                  {notConfigured ? (
                    <span className="text-text-disabled text-xs">belum dikonfigurasi</span>
                  ) : (
                    <>
                      <span className="text-text-secondary">
                        {cat.currentValue} dari {cat.maxValue} {cat.unit}
                      </span>
                      <span className={`font-semibold w-10 text-right ${pctColorClass}`}>
                        {cat.pct}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Inline progress bar — custom color per category */}
              <div
                role="progressbar"
                aria-valuenow={notConfigured ? 0 : pctClamped}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={cat.label}
                className="w-full h-2 rounded-full bg-mottago-border overflow-hidden"
              >
                <div
                  className={[
                    'h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none',
                    COLOR_CLASS[cat.wasteType],
                  ].join(' ')}
                  style={{ width: notConfigured ? '0%' : `${pctClamped}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
