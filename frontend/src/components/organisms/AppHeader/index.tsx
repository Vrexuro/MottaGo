import { Icon } from '../../atoms/Icon';
import type { UserRole } from '../../../types/user.types';
import { NOTIFICATIONS } from '../../../mock/notification';

type AppHeaderProps = {
  userRole: UserRole;
  sideNavOpen?: boolean;
  onMenuToggle: () => void;
  pageTitle?: string;
  onNotificationClick?: () => void;
  className?: string;
};

const roleBgClasses: Record<UserRole, string> = {
  manajer: 'bg-role-manajer-bg',
  utility: 'bg-role-utility-bg',
};

/** Jumlah notifikasi — ganti dengan polling NOTIFICATION table (DL-04) saat backend siap */
const MOCK_NOTIFICATION_COUNT = NOTIFICATIONS.filter((n) => !n.isRead).length;

export function AppHeader({
  userRole,
  sideNavOpen = false,
  onMenuToggle,
  pageTitle,
  onNotificationClick,
  className,
}: AppHeaderProps) {
  const headerClassName = [
    'sticky top-0 z-50 w-full',
    'shadow-[var(--shadow-sm)]',
    roleBgClasses[userRole],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={headerClassName}>
      <div className="flex items-center justify-between px-4 h-14 md:h-16">
        {/* Left — hamburger (mobile + tablet) | green-box logo + page title (desktop) */}
        <div className="flex items-center">
          <button
            type="button"
            className="lg:hidden p-2 -ml-2 rounded-[var(--radius-md)] hover:bg-black/5 transition-colors"
            aria-label="Open navigation menu"
            aria-expanded={sideNavOpen}
            aria-controls="sidenav"
            onClick={onMenuToggle}
          >
            <Icon name="Menu" size={20} />
          </button>

          {/* Desktop: green-box logo + MottaGo + divider + active page title */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[var(--radius-md)] bg-accent-primary flex items-center justify-center shrink-0">
                <Icon name="Leaf" size={16} className="text-black" />
              </div>
              <span className="text-sm font-semibold text-text-primary">MottaGo</span>
            </div>
            {pageTitle && (
              <>
                <div className="h-4 w-px bg-mottago-border" aria-hidden="true" />
                <span className="text-sm font-medium text-text-secondary">{pageTitle}</span>
              </>
            )}
          </div>
        </div>

        {/* Right — notification bell with badge */}
        <div className="relative">
          <button
            type="button"
            className="p-2 rounded-[var(--radius-md)] hover:bg-black/5 transition-colors"
            aria-label="Notifikasi"
            onClick={onNotificationClick}
          >
            <Icon name="Bell" size={20} className="text-text-primary" />
          </button>
          <span
            className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-capacity-warning text-[10px] font-bold text-white px-1 pointer-events-none"
            aria-hidden="true"
          >
            {MOCK_NOTIFICATION_COUNT}
          </span>
        </div>
      </div>
    </header>
  );
}
