import { Link } from 'react-router-dom';
import { Icon } from '../../atoms/Icon';
import { ROUTES } from '../../../router/routes';

interface ActionItem {
  id: string;
  to: string | null; // null = route belum tersedia (S-04)
  label: string;
  iconName: string;
  iconBgClass: string;
  iconColorClass: string;
}

const ACTION_ITEMS: ActionItem[] = [
  {
    id: 'request-pickup',
    to: ROUTES.MANAJER_PICKUP_REQUEST,
    label: 'Request Pickup',
    iconName: 'Truck',
    iconBgClass: 'bg-accent-success-bg',
    iconColorClass: 'text-accent-success-text',
  },
  {
    id: 'lihat-laporan',
    to: ROUTES.MANAJER_LAPORAN,
    label: 'Lihat Laporan',
    iconName: 'FileText',
    iconBgClass: 'bg-warning-bg',
    iconColorClass: 'text-capacity-warning',
  },
  {
    // S-04: MANAJER_PENGATURAN belum ada di routes.ts — ditampilkan disabled
    id: 'pengaturan-store',
    to: null,
    label: 'Pengaturan Store',
    iconName: 'Settings',
    iconBgClass: 'bg-mottago-surface-subtle',
    iconColorClass: 'text-text-secondary',
  },
  {
    id: 'manajemen-vendor',
    to: ROUTES.MANAJER_VENDOR_MANAGEMENT,
    label: 'Manajemen Vendor',
    iconName: 'Building2',
    iconBgClass: 'bg-info-bg',
    iconColorClass: 'text-info-text',
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
        {ACTION_ITEMS.map((item) => {
          const content = (
            <>
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
            </>
          );

          return (
            <li key={item.id}>
              {item.to !== null ? (
                <Link
                  to={item.to}
                  className="w-full flex items-center gap-3 px-4 md:px-5 py-3.5 hover:bg-mottago-surface-subtle transition-colors"
                >
                  {content}
                </Link>
              ) : (
                <span
                  className="w-full flex items-center gap-3 px-4 md:px-5 py-3.5 opacity-50 cursor-not-allowed select-none"
                  aria-disabled="true"
                  title="Segera tersedia"
                >
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
