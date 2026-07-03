import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { getCapacityStatus, CAPACITY_STATUS_TOKENS } from '../../../constants/capacity';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../router/routes';

interface CapacityCardProps {
  currentKg?: number;
  maxKg?: number;
  className?: string;
}

type StatusConfig = {
  label: string;
  badge: 'success' | 'warning' | 'danger';
  gaugeColor: string;
};

function getStatus(pct: number): StatusConfig {
  const status = getCapacityStatus(pct);
  const gaugeColor = CAPACITY_STATUS_TOKENS[status];
  if (status === 'critical') return { label: 'Kritis', badge: 'danger', gaugeColor };
  if (status === 'warning') return { label: 'Perlu Perhatian', badge: 'warning', gaugeColor };
  return { label: 'Aman', badge: 'success', gaugeColor };
}

const LEGEND = [
  { colorClass: 'bg-capacity-normal', label: 'Aman', range: '< 60%' },
  { colorClass: 'bg-capacity-warning', label: 'Perlu Perhatian', range: '60–89%' },
  { colorClass: 'bg-capacity-critical', label: 'Kritis', range: '≥ 90%' },
] as const;

function CapacityGauge({ percentage, color }: { percentage: number; color: string }) {
  const cx = 60;
  const cy = 60;
  const r = 44;
  const sw = 14;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.min(Math.max(percentage, 0), 100) / 100);

  return (
    <svg viewBox="0 0 120 120" className="w-full" aria-label={`Kapasitas terpakai ${percentage}%`}>
      {/* Background track */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--color-input-disabled-border)"
        strokeWidth={sw}
      />
      {/* Filled arc — starts at 12-o'clock, clockwise */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      {/* Centre: percentage */}
      <text
        x={cx}
        y={53}
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize="22"
        fontWeight="700"
        fontFamily="Inter, Arial, sans-serif"
      >
        {percentage}%
      </text>
      {/* Centre: label */}
      <text
        x={cx}
        y={70}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--color-text-secondary)"
        fontSize="10"
        fontFamily="Inter, Arial, sans-serif"
      >
        Terpakai
      </text>
    </svg>
  );
}

export function CapacityCard({ currentKg = 263, maxKg = 400, className }: CapacityCardProps) {
  const navigate = useNavigate();
  const percentage = Math.round((currentKg / maxKg) * 100);
  const { label, badge, gaugeColor } = getStatus(percentage);

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
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 md:px-5 md:pt-5">
        <h3 className="text-sm font-semibold text-text-primary">Kapasitas Waste Store</h3>
        <Icon name="ChevronRight" size={16} className="text-text-secondary opacity-50" />
      </div>

      {/* ── Body ───────────────────────────────────────────── */}
      {/* Mobile: stacked (gauge → info). Tablet+: side-by-side */}
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 px-4 md:px-5 pb-2 flex-1">
        {/* Donut gauge */}
        <div className="w-[130px] md:w-[112px] shrink-0">
          <CapacityGauge percentage={percentage} color={gaugeColor} />
        </div>

        {/* Info panel */}
        <div className="w-full md:flex-1 md:min-w-0 space-y-2">
          <Badge color={badge} size="sm">
            {label}
          </Badge>

          <p className="text-xs text-text-secondary">
            {currentKg} kg dari {maxKg} kg
          </p>

          {/* Legend — coloured squares (■) matching baseline */}
          <div className="space-y-1.5 pt-0.5">
            {LEGEND.map((l) => (
              <div key={l.colorClass} className="flex items-start gap-1.5">
                <span
                  className={['shrink-0 mt-[3px] w-2.5 h-2.5 rounded-[2px]', l.colorClass].join(
                    ' '
                  )}
                />
                <span className="text-[11px] leading-tight text-text-secondary">
                  {l.label} <span className="text-text-secondary opacity-60">{l.range}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer: CTA — bottom-right ────────── */}
      <div className="flex justify-end px-4 pb-4 pt-2 md:px-5 md:pb-5">
        <Button
          variant="secondary"
          size="sm"
          rightIcon="ChevronRight"
          onClick={() => navigate(ROUTES.MANAJER_KAPASITAS)}
        >
          Lihat Detail Kapasitas
        </Button>
      </div>
    </div>
  );
}
