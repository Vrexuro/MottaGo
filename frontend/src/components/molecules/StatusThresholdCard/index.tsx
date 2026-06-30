import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';

type ThresholdLevel = 'normal' | 'perlu-perhatian' | 'kritis';

interface Level {
  id: ThresholdLevel;
  label: string;
  range: string;
  dotClass: string;
  badgeColor: 'success' | 'warning' | 'danger';
}

const LEVELS: Level[] = [
  {
    id: 'normal',
    label: 'Normal',
    range: '0 – 60%',
    dotClass: 'bg-green-500',
    badgeColor: 'success',
  },
  {
    id: 'perlu-perhatian',
    label: 'Perlu Perhatian',
    range: '61 – 80%',
    dotClass: 'bg-amber-500',
    badgeColor: 'warning',
  },
  {
    id: 'kritis',
    label: 'Kritis',
    range: '81 – 100%',
    dotClass: 'bg-red-500',
    badgeColor: 'danger',
  },
];

const MOCK = {
  currentLevel: 'perlu-perhatian' as ThresholdLevel,
  currentPct: 66,
};

interface StatusThresholdCardProps {
  className?: string;
}

export function StatusThresholdCard({ className }: StatusThresholdCardProps) {
  const currentLevel = LEVELS.find((l) => l.id === MOCK.currentLevel)!;

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
        <h3 className="text-base font-semibold text-text-primary">Status Threshold</h3>
      </div>

      {/* ── Body ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col gap-5 px-6 pt-5 pb-6">
        {/* Threshold levels list */}
        <div className="space-y-3">
          {LEVELS.map((level) => (
            <div key={level.id} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`w-3 h-3 rounded-full shrink-0 ${level.dotClass}`}
              />
              <span className="flex-1 text-sm font-medium text-text-primary">{level.label}</span>
              <span className="text-sm text-text-secondary whitespace-nowrap">{level.range}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-mottago-border" />

        {/* Status Saat Ini */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[11px] font-semibold text-text-disabled uppercase tracking-wider">
            Status Saat Ini
          </p>
          <Badge color={currentLevel.badgeColor}>{currentLevel.label}</Badge>
          <p className="text-sm text-text-secondary leading-relaxed">
            Kapasitas saat ini berada pada{' '}
            <span className="font-semibold text-text-primary">{MOCK.currentPct}%</span>.
          </p>
        </div>

        {/* CTA — outline style via secondary variant */}
        <Button variant="secondary" className="w-full justify-center mt-auto">
          Lihat Panduan
        </Button>
      </div>
    </div>
  );
}
