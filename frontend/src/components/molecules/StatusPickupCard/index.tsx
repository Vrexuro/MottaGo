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

const STATUS_ITEMS: StatusItem[] = [
  {
    id: 'waiting',
    label: 'Menunggu Konfirmasi',
    count: 2,
    iconName: 'Clock',
    iconBgClass: 'bg-warning-bg',
    iconColorClass: 'text-capacity-warning',
    countColorClass: 'text-text-primary',
    rowBgClass: 'bg-warning-bg',
  },
  {
    id: 'in-transit',
    label: 'Dalam Perjalanan',
    count: 1,
    iconName: 'Truck',
    iconBgClass: 'bg-info-bg',
    iconColorClass: 'text-info-text',
    countColorClass: 'text-info-text',
  },
  {
    id: 'completed',
    label: 'Selesai Hari Ini',
    count: 5,
    iconName: 'CircleCheck',
    iconBgClass: 'bg-accent-success-bg',
    iconColorClass: 'text-accent-success-text',
    countColorClass: 'text-accent-success-text',
  },
];

interface StatusPickupCardProps {
  className?: string;
}

export function StatusPickupCard({ className }: StatusPickupCardProps) {
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
      {/* S-04: MANAJER_RIWAYAT_PICKUP belum ada di routes.ts — navigasi belum diwiring */}
      <div className="border-t border-mottago-border mt-auto">
        <Button variant="ghost" size="sm" rightIcon="ChevronRight" className="w-full">
          Lihat Semua Pickup
        </Button>
      </div>
    </div>
  );
}
