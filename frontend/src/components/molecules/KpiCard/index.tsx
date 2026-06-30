import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';

type KpiAccent = 'success' | 'warning' | 'orange';

export interface KpiTrend {
  direction: 'up' | 'down';
  label: string;
  /** true = green (positive), false = red (negative). Defaults to true. */
  positive?: boolean;
}

export interface KpiCardProps {
  /** Card label — uppercase, small, displayed at top-left */
  label: string;
  /** Lucide icon name — displayed in accent-colored chip at top-right */
  iconName: string;
  /** Accent palette: success = green, warning = yellow, orange = orange */
  accent?: KpiAccent;
  /** Primary value string (e.g. "47,3" or "66%") */
  value: string;
  /** Optional unit shown smaller beside value (e.g. "kg") */
  unit?: string;
  /** If true, value text uses the accent colour instead of dark/default */
  valueAccent?: boolean;
  /** Inline badge shown beside the value (e.g. "Perhatian") */
  badge?: { label: string; color: 'success' | 'warning' | 'danger' | 'info' | 'neutral' };
  /** One or more small grey lines shown below the value */
  subtexts?: string[];
  /** Trend indicator at the bottom of the card */
  trend?: KpiTrend;
  className?: string;
}

/* Accent-specific class bundles */
const accentCfg: Record<KpiAccent, { chipBg: string; chipIcon: string; valueFg: string }> = {
  success: {
    chipBg: 'bg-accent-success-bg',
    chipIcon: 'text-accent-success-text',
    valueFg: 'text-accent-primary',
  },
  warning: {
    chipBg: 'bg-warning-bg',
    chipIcon: 'text-[#92400E]',
    valueFg: 'text-text-primary',
  },
  orange: {
    chipBg: 'bg-role-vendor-bg',
    chipIcon: 'text-capacity-warning',
    valueFg: 'text-capacity-warning',
  },
};

export function KpiCard({
  label,
  iconName,
  accent = 'success',
  value,
  unit,
  valueAccent = false,
  badge,
  subtexts,
  trend,
  className,
}: KpiCardProps) {
  const cfg = accentCfg[accent];
  const valueFg = valueAccent ? cfg.valueFg : 'text-text-primary';
  const trendFg = trend?.positive === false ? 'text-error-text' : 'text-accent-success-text';

  return (
    <div
      className={[
        'bg-mottago-surface border border-mottago-border',
        'rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]',
        'p-4 md:p-5 flex flex-col gap-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Row 1 — Label + Icon chip */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary leading-tight">
          {label}
        </p>
        <div className={['shrink-0 p-1.5 rounded-[var(--radius-md)]', cfg.chipBg].join(' ')}>
          <Icon name={iconName} size={16} className={cfg.chipIcon} />
        </div>
      </div>

      {/* Row 2 — Value + optional unit/badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={['text-3xl font-bold leading-none', valueFg].join(' ')}>{value}</span>
        {unit && (
          <span className="text-sm font-medium text-text-secondary self-end pb-0.5">{unit}</span>
        )}
        {badge && (
          <Badge color={badge.color} size="sm">
            {badge.label}
          </Badge>
        )}
      </div>

      {/* Row 3 — Subtexts or trend */}
      {subtexts && subtexts.length > 0 && (
        <div className="flex flex-col gap-0.5">
          {subtexts.map((text) => (
            <span key={text} className="text-xs text-text-secondary">
              {text}
            </span>
          ))}
        </div>
      )}
      {trend && (
        <div className={['flex items-center gap-1', trendFg].join(' ')}>
          <Icon name={trend.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} size={16} />
          <span className="text-xs font-medium">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
