import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { CHART_7D, CHART_30D } from '../../../mock/report';

// TODO Sprint C: selaraskan range dengan CapacityTrendCard (7/14/30/90)
type Range = 7 | 14 | 30;

interface DataPoint {
  day: string;
  value: number;
}

// Data bersumber dari src/mock/report.ts — satu sumber kebenaran untuk seluruh sistem.
const MOCK: Record<Range, DataPoint[]> = {
  7: CHART_7D.map((p) => ({
    day: p.minggu,
    value: p.organik + p.anorganik + p.minyak,
  })),
  14: [...CHART_7D, ...CHART_7D].map((p, i) => ({
    day: `H-${14 - i}`,
    value: p.organik + p.anorganik + p.minyak,
  })),
  30: CHART_30D.map((p) => ({
    day: p.minggu,
    value: p.organik + p.anorganik + p.minyak,
  })),
};

const RANGES: Range[] = [7, 14, 30];
const RANGE_LABELS: Record<Range, string> = { 7: '7 Hari', 14: '14 Hari', 30: '30 Hari' };

const getCSSVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function WasteTrendCard({ className }: { className?: string }) {
  const [range, setRange] = useState<Range>(7);
  const data = MOCK[range];
  const xInterval = range === 30 ? 4 : range === 14 ? 1 : 0;

  return (
    <div
      className={[
        'bg-mottago-surface border border-mottago-border',
        'rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]',
        'p-4 md:p-5 flex flex-col',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Card header: title (left) + range selector (right) */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Tren Waste</h3>

        {/* Minimal text-only range tabs — no background container */}
        <div className="flex items-center gap-3">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={[
                'text-xs transition-colors whitespace-nowrap',
                range === r
                  ? 'text-text-primary font-semibold'
                  : 'text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Area chart — no tooltip, subtle grid, light gradient */}
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={180}>
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
            <defs>
              <linearGradient id="wasteAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent-primary)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="var(--color-accent-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Very subtle horizontal grid only */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={getCSSVar('--color-border')}
              strokeOpacity={0.5}
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: getCSSVar('--color-text-secondary') }}
              axisLine={false}
              tickLine={false}
              interval={xInterval}
            />

            <YAxis
              domain={[0, 'dataMax']}
              tickFormatter={(v: number) => (v === 0 ? '0' : `${v} kg`)}
              tick={{ fontSize: 11, fill: getCSSVar('--color-text-secondary') }}
              axisLine={false}
              tickLine={false}
              width={44}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={getCSSVar('--color-accent-primary')}
              strokeWidth={2}
              fill="url(#wasteAreaGradient)"
              dot={false}
              activeDot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
