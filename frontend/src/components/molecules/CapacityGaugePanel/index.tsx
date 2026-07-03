import { Badge } from '../../atoms/Badge';
import { CAPACITY_THRESHOLDS } from '../../../constants/capacity';
import { ProgressBar } from '../../atoms/ProgressBar';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';

type CapacityState = 'aman' | 'perlu-perhatian' | 'kritis';

interface StateConfig {
  label: string;
  badge: 'success' | 'warning' | 'danger';
  textColorClass: string;
}

const STATE_CFG: Record<CapacityState, StateConfig> = {
  aman: {
    label: 'Aman',
    badge: 'success',
    textColorClass: 'text-capacity-normal',
  },
  'perlu-perhatian': {
    label: 'Perlu Perhatian',
    badge: 'warning',
    textColorClass: 'text-capacity-warning',
  },
  kritis: {
    label: 'Kritis',
    badge: 'danger',
    textColorClass: 'text-capacity-critical',
  },
};

function getState(pct: number): CapacityState {
  if (pct >= CAPACITY_THRESHOLDS.CRITICAL) return 'kritis';
  if (pct >= CAPACITY_THRESHOLDS.WARNING) return 'perlu-perhatian';
  return 'aman';
}

const MOCK = { currentKg: 263, maxKg: 400, lastUpdated: '09:24:37' };

interface CapacityGaugePanelProps {
  className?: string;
}

export function CapacityGaugePanel({ className }: CapacityGaugePanelProps) {
  const pct = Math.round((MOCK.currentKg / MOCK.maxKg) * 100);
  const state = getState(pct);
  const cfg = STATE_CFG[state];
  const isKritis = state === 'kritis';

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
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-mottago-border">
        <h3 className="text-base font-semibold text-text-primary">Kapasitas Saat Ini</h3>
        <Badge color={cfg.badge}>{cfg.label}</Badge>
      </div>

      {/* ── Body ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col gap-5 px-6 pt-5 pb-4">
        {/* Big percentage display */}
        <span className={['text-5xl font-bold leading-none', cfg.textColorClass].join(' ')}>
          {pct}%
        </span>

        {/* Linear gauge + absolute value */}
        <div className="space-y-2.5">
          <ProgressBar value={pct} variant="capacity" style={{ height: '28px' }} />
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">{MOCK.currentKg} kg</span> dari{' '}
            <span className="font-semibold text-text-primary">{MOCK.maxKg} kg</span> kapasitas
            maksimum
          </p>
        </div>

        {/* Inline alert — only when Kritis */}
        {isKritis && (
          <div className="flex items-center justify-between gap-3 bg-error-bg border border-error-border rounded-[var(--radius-md)] px-4 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <Icon name="AlertTriangle" size={16} className="text-error-text shrink-0" />
              <span className="text-sm font-medium text-error-text leading-snug">
                Kapasitas hampir penuh — Request Pickup sekarang
              </span>
            </div>
            <Button variant="danger" size="sm" className="shrink-0">
              Request Pickup
            </Button>
          </div>
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 pb-5">
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="shrink-0 w-1.5 h-1.5 rounded-full bg-text-disabled animate-pulse"
          />
          <span className="text-[11px] text-text-disabled">Data real-time</span>
        </div>
        <span className="text-[11px] text-text-disabled">
          Terakhir diperbarui: {MOCK.lastUpdated}
        </span>
      </div>
    </div>
  );
}
