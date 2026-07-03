import { CAPACITY_THRESHOLDS } from '../../../constants/capacity';

type CapacityState = 'aman' | 'perlu-perhatian' | 'kritis';

function getState(pct: number): CapacityState {
  if (pct >= CAPACITY_THRESHOLDS.CRITICAL) return 'kritis';
  if (pct >= CAPACITY_THRESHOLDS.WARNING) return 'perlu-perhatian';
  return 'aman';
}

const STATE_TEXT_CLASS: Record<CapacityState, string> = {
  aman: 'text-capacity-normal',
  'perlu-perhatian': 'text-capacity-warning',
  kritis: 'text-capacity-critical',
};

interface StatItemProps {
  label: string;
  value: string;
  unit?: string;
  sublabel?: string;
  valueClass?: string;
}

function StatItem({
  label,
  value,
  unit,
  sublabel,
  valueClass = 'text-2xl font-bold text-text-primary',
}: StatItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-text-secondary">{label}</span>
      <div className="flex items-baseline gap-1 flex-wrap">
        <span className={valueClass}>{value}</span>
        {unit && <span className="text-sm text-text-secondary">{unit}</span>}
      </div>
      {sublabel && <span className="text-[11px] text-text-disabled">{sublabel}</span>}
    </div>
  );
}

const MOCK = {
  maxKg: 400,
  currentKg: 263,
  rataHarian: 38.5,
};

interface CapacitySummaryStatsProps {
  className?: string;
}

export function CapacitySummaryStats({ className }: CapacitySummaryStatsProps) {
  const sisaKg = MOCK.maxKg - MOCK.currentKg;
  const pct = Math.round((MOCK.currentKg / MOCK.maxKg) * 100);
  const state = getState(pct);
  const thresholdClass = STATE_TEXT_CLASS[state];

  const proyeksiHari = sisaKg / MOCK.rataHarian;
  const proyeksiClass =
    proyeksiHari < 3
      ? 'text-capacity-critical'
      : proyeksiHari <= 7
        ? 'text-capacity-warning'
        : 'text-capacity-normal';

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
      {/* ── Header ─────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4 border-b border-mottago-border">
        <h3 className="text-base font-semibold text-text-primary">Ringkasan Kapasitas</h3>
      </div>

      {/* ── Stats Grid ─────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-6 px-6 py-5">
        <StatItem
          label="Kapasitas Maks."
          value={MOCK.maxKg.toLocaleString('id-ID')}
          unit="kg"
          sublabel="batas yang ditetapkan"
        />

        <StatItem label="Waste Masuk Hari Ini" value="47,3" unit="kg" sublabel="total hari ini" />

        <StatItem
          label="Sisa Kapasitas"
          value={sisaKg.toLocaleString('id-ID')}
          unit="kg"
          sublabel="tersedia"
          valueClass={`text-2xl font-bold ${thresholdClass}`}
        />

        <StatItem
          label="Rata-rata Harian"
          value="38,5"
          unit="kg/hari"
          sublabel="7 hari terakhir"
          valueClass="text-xl font-semibold text-text-primary"
        />

        {/* Proyeksi — full width with top divider */}
        <div className="col-span-2 pt-4 border-t border-mottago-border">
          <StatItem
            label="Proyeksi Kapasitas Penuh"
            value={proyeksiHari.toFixed(1).replace('.', ',')}
            unit="hari"
            sublabel="estimasi berdasarkan rata-rata harian"
            valueClass={`text-xl font-semibold ${proyeksiClass}`}
          />
        </div>
      </div>
    </div>
  );
}
