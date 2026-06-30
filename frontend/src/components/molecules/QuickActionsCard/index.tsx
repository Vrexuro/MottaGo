import { Icon } from '../../atoms/Icon';

interface ActionItem {
  id: string;
  label: string;
  iconName: string;
  iconBgClass: string;
  iconColorClass: string;
}

const ACTION_ITEMS: ActionItem[] = [
  {
    id: 'request-pickup',
    label: 'Request Pickup',
    iconName: 'Truck',
    iconBgClass: 'bg-accent-success-bg',
    iconColorClass: 'text-accent-success-text',
  },
  {
    id: 'monitoring-kapasitas',
    label: 'Monitoring Kapasitas',
    iconName: 'BarChart3',
    iconBgClass: 'bg-info-bg',
    iconColorClass: 'text-info-text',
  },
  {
    id: 'lihat-laporan',
    label: 'Lihat Laporan',
    iconName: 'FileText',
    iconBgClass: 'bg-amber-100',
    iconColorClass: 'text-amber-600',
  },
  {
    id: 'kelola-vendor',
    label: 'Kelola Vendor',
    iconName: 'Building2',
    iconBgClass: 'bg-purple-100',
    iconColorClass: 'text-sh-indicator',
  },
];

interface QuickActionsCardProps {
  className?: string;
}

export function QuickActionsCard({ className }: QuickActionsCardProps) {
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
        <h3 className="text-sm font-semibold text-text-primary">Aksi Cepat</h3>
        <Icon name="ChevronRight" size={16} className="text-text-secondary opacity-50" />
      </div>

      {/* ── Action list ────────────────────────────────── */}
      <ul className="flex-1 divide-y divide-mottago-border">
        {ACTION_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 md:px-5 py-3.5 hover:bg-mottago-surface-subtle transition-colors text-left"
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
              <span className="flex-1 min-w-0 text-sm font-medium text-text-primary truncate">
                {item.label}
              </span>

              {/* Chevron */}
              <Icon
                name="ChevronRight"
                size={16}
                className="shrink-0 text-text-secondary opacity-50"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
