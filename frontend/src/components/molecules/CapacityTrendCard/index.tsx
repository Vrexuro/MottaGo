import { useState } from 'react';
import { CAPACITY_THRESHOLDS } from '../../../constants/capacity';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Range = 7 | 14 | 30 | 90;

interface DataPoint {
  date: string;
  dateLabel: string;
  pct: number;
  kg: number;
}

const MAX_KG = 400;

// Fixed seed — deterministic chart across renders
const SEED_PCT = [
  52, 58, 63, 61, 66, 70, 67, 62, 55, 59, 65, 72, 74, 70, 68, 64, 60, 57, 62, 68, 72, 75, 73, 69,
  65, 61, 58, 63, 67, 66, 64, 60, 57, 55, 58, 63, 68, 72, 74, 70, 68, 65, 62, 59, 55, 52, 57, 63,
  68, 72, 74, 70, 68, 65, 62, 59, 55, 52, 57, 63, 68, 72, 74, 70, 68, 65, 62, 59, 55, 52, 57, 63,
  68, 72, 74, 70, 68, 65, 62, 59, 55, 52, 57, 63, 68, 72, 74, 70, 68, 66,
];

function buildData(days: number): DataPoint[] {
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const pct = SEED_PCT[i % SEED_PCT.length];
    return {
      date: `${dd}/${mm}`,
      dateLabel: `${dd}/${mm}/${yyyy}`,
      pct,
      kg: Math.round((pct / 100) * MAX_KG),
    };
  });
}

const RANGES: Range[] = [7, 14, 30, 90];
const RANGE_LABELS: Record<Range, string> = {
  7: '7 Hari',
  14: '14 Hari',
  30: '30 Hari',
  90: '90 Hari',
};

// Computed once at module load
const MOCK: Record<Range, DataPoint[]> = {
  7: buildData(7),
  14: buildData(14),
  30: buildData(30),
  90: buildData(90),
};

// Show fewer X ticks on dense ranges
const INTERVAL_MAP: Record<Range, number> = {
  7: 0,
  14: 1,
  30: 4,
  90: 13,
};

interface CapacityTrendCardProps {
  className?: string;
}

export function CapacityTrendCard({ className }: CapacityTrendCardProps) {
  const [range, setRange] = useState<Range>(7);
  const data = MOCK[range];

  return (
    <div
      className={[
        'bg-mottago-surface border border-mottago-border',
        'rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]',
        'p-5 md:p-6 flex flex-col',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── Header: title + range selector ─────────────── */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <h3 className="text-base font-semibold text-text-primary">Tren Kapasitas</h3>

        {/* Toggle tabs — pill container, active tab gets white bg */}
        <div className="flex items-center bg-mottago-surface-subtle rounded-[var(--radius-sm)] p-0.5 shrink-0">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={[
                'text-xs px-2.5 py-1 rounded-[4px] transition-all whitespace-nowrap',
                range === r
                  ? 'bg-mottago-surface text-text-primary font-semibold shadow-sm'
                  : 'text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Area Chart ──────────────────────────────────── */}
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 4 }}>
            <defs>
              <linearGradient id="capacityAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F3F4F6"
              strokeOpacity={1}
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              interval={INTERVAL_MAP[range]}
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const point = payload[0]?.payload as DataPoint | undefined;
                if (!point) return null;
                return (
                  <div className="bg-gray-800 text-white text-[11px] rounded px-3 py-2 shadow-lg whitespace-nowrap">
                    <p className="font-semibold text-gray-100 mb-0.5">{point.dateLabel}</p>
                    <p className="text-gray-300">
                      {point.pct}%{' '}
                      <span className="text-gray-400">
                        ({point.kg} kg dari {MAX_KG} kg)
                      </span>
                    </p>
                  </div>
                );
              }}
            />

            {/* Threshold: Perlu Perhatian 60% */}
            <ReferenceLine
              y={60}
              stroke="#F59E0B"
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{
                value: 'Perlu Perhatian',
                position: 'insideTopRight',
                fontSize: 10,
                fill: '#F59E0B',
                dy: -4,
              }}
            />

            {/* Threshold: Kritis 90% */}
            <ReferenceLine
              y={CAPACITY_THRESHOLDS.CRITICAL}
              stroke="#EF4444"
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{
                value: 'Kritis',
                position: 'insideTopRight',
                fontSize: 10,
                fill: '#EF4444',
                dy: -4,
              }}
            />

            <Area
              type="monotone"
              dataKey="pct"
              stroke="#22C55E"
              strokeWidth={2}
              fill="url(#capacityAreaGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#22C55E', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Legend ──────────────────────────────────────── */}
      <div className="flex items-center gap-5 pt-3 mt-4 border-t border-mottago-border flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-green-500" />
          <span className="text-xs text-text-secondary">Kapasitas Terpakai</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="20" height="3" viewBox="0 0 20 3" aria-hidden="true">
            <line
              x1="0"
              y1="1.5"
              x2="20"
              y2="1.5"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          </svg>
          <span className="text-xs text-text-secondary">Batas Perlu Perhatian</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="20" height="3" viewBox="0 0 20 3" aria-hidden="true">
            <line
              x1="0"
              y1="1.5"
              x2="20"
              y2="1.5"
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          </svg>
          <span className="text-xs text-text-secondary">Batas Kritis</span>
        </div>
      </div>
    </div>
  );
}
