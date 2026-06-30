import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

type Range = 7 | 14 | 30;

interface DataPoint {
  day: string;
  value: number;
}

const WEEKDAY: Record<number, string> = {
  0: 'Min',
  1: 'Sen',
  2: 'Sel',
  3: 'Rab',
  4: 'Kam',
  5: 'Jum',
  6: 'Sab',
};

// Fixed seed values — chart stays deterministic across renders
const SEED = [
  23.5, 31.2, 28.8, 44.1, 47.3, 38.6, 19.4, 27.1, 35.8, 42.2, 33.5, 22.8, 38.4, 45.1, 29.3, 18.7,
  36.9, 43.2, 51.4, 28.6, 37.8, 44.5, 32.1, 25.9, 41.3, 36.7, 29.5, 48.2, 22.4, 34.8,
];

function buildData(days: number): DataPoint[] {
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    const day = days === 7 ? WEEKDAY[d.getDay()] : `${d.getDate()}/${d.getMonth() + 1}`;
    return { day, value: SEED[i % SEED.length] };
  });
}

// Computed once at module load — shared across all instances
const MOCK: Record<Range, DataPoint[]> = {
  7: buildData(7),
  14: buildData(14),
  30: buildData(30),
};

const RANGES: Range[] = [7, 14, 30];
const RANGE_LABELS: Record<Range, string> = { 7: '7 Hari', 14: '14 Hari', 30: '30 Hari' };

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
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Very subtle horizontal grid only */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#d9d9d9"
              strokeOpacity={0.5}
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#666666' }}
              axisLine={false}
              tickLine={false}
              interval={xInterval}
            />

            <YAxis
              domain={[0, 60]}
              ticks={[0, 20, 40, 60]}
              tickFormatter={(v: number) => (v === 0 ? '0' : `${v} kg`)}
              tick={{ fontSize: 11, fill: '#666666' }}
              axisLine={false}
              tickLine={false}
              width={44}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#16a34a"
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
