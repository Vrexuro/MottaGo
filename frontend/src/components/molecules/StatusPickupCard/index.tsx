import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';

interface StatusItem {
  id: string;
  label: string;
  count: number;
  iconName: string;
  iconBgClass: string;
  iconColorClass: string;
  countColorClass: string;
  rowBgClass?: string;
}

interface StatusPickupCardProps {
  /** Jumlah pickup yang sedang berjalan (menunggu + dalam perjalanan digabung
   * — Manajer hanya perlu tahu ada request aktif, bukan detail granular
   * yang jadi wewenang operasional Utility). */
  active: number;
  completedToday: number;
  className?: string;
  onLihatSemua?: () => void;
}

export function StatusPickupCard({
  active,
  completedToday,
  className,
  onLihatSemua,
}: StatusPickupCardProps) {
  const STATUS_ITEMS: StatusItem[] = [
    {
      id: 'active',
      label: 'Sedang Berjalan',
      count: active,
      iconName: 'Truck',
      iconBgClass: 'bg-info-bg',
      iconColorClass: 'text-info-text',
      countColorClass: 'text-info-text',
    },
    {
      id: 'completed',
      label: 'Selesai Hari Ini',
      count: completedToday,
      iconName: 'CircleCheck',
      iconBgClass: 'bg-accent-success-bg',
      iconColorClass: 'text-accent-success-text',
      countColorClass: 'text-accent-success-text',
    },
  ];

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
      <div className="flex items-center justify-between px-4 pt-4 pb-3 md:px-5 md:pt-5">
        <h3 className="text-sm font-semibold text-text-primary">Status Pickup</h3>
        <Icon name="ChevronRight" size={16} className="text-text-secondary opacity-50" />
      </div>

      {/* ── Status rows ────────────────────────────────── */}
      <ul className="flex-1 divide-y divide-mottago-border">
        {STATUS_ITEMS.map((item) => (
          <li
            key={item.id}
            className={[
              'flex items-center gap-3 px-4 md:px-5 py-3.5',
              'hover:brightness-95 transition-all',
              item.rowBgClass,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {/* Icon circle */}
            <span
              className={[
                'shrink-0 flex items-center justify-center',
                'w-8 h-8 rounded-full',
                item.iconBgClass,
              ].join(' ')}
            >
              <Icon name={item.iconName} size={16} className={item.iconColorClass} />
            </span>

            {/* Label */}
            <span className="flex-1 min-w-0 text-sm text-text-primary truncate">{item.label}</span>

            {/* Count */}
            <span
              className={[
                'text-2xl font-bold tabular-nums leading-none shrink-0',
                item.countColorClass,
              ].join(' ')}
            >
              {item.count}
            </span>
          </li>
        ))}
      </ul>

      {/* ── Footer CTA ─────────────────────────────────── */}
      <div className="border-t border-mottago-border mt-auto">
        <Button
          variant="ghost"
          size="sm"
          rightIcon="ChevronRight"
          className="w-full"
          onClick={onLihatSemua}
        >
          Lihat Semua Pickup
        </Button>
      </div>
    </div>
  );
}
