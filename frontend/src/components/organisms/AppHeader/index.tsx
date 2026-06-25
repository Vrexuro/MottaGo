import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { NotificationBadge } from '../../molecules/NotificationBadge';
import type { UserRole } from '../../../types/user.types';

type NotificationSlot =
  | {
      notificationCount?: never;
      onNotificationClick?: never;
    }
  | {
      notificationCount: number;
      onNotificationClick: () => void;
    };

type AppHeaderProps = {
  userRole: UserRole;
  userName: string;
  sideNavOpen?: boolean;
  onMenuToggle: () => void;
  onLogout: () => void;
  className?: string;
} & NotificationSlot;

const roleBgClasses: Record<UserRole, string> = {
  manajer: 'bg-role-manajer-bg',
  pelayan: 'bg-role-pelayan-bg',
  utility: 'bg-role-utility-bg',
  vendor: 'bg-role-vendor-bg',
};

const roleLabels: Record<UserRole, string> = {
  manajer: 'Manajer',
  pelayan: 'Pelayan',
  utility: 'Utility',
  vendor: 'Vendor',
};

export function AppHeader({
  userRole,
  userName,
  sideNavOpen = false,
  notificationCount,
  onNotificationClick,
  onMenuToggle,
  onLogout,
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

        {/* Left: hamburger (mobile only) + brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden p-2 -ml-2 rounded-[var(--radius-md)] hover:bg-black/5 transition-colors"
            aria-label="Open navigation menu"
            aria-expanded={sideNavOpen}
            aria-controls="sidenav"
            onClick={onMenuToggle}
          >
            <Icon name="Menu" size={20} />
          </button>
          <span className="text-sm font-semibold text-text-primary">MottaGo</span>
        </div>

        {/* Right: user info + notification + logout */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* User info: tablet and desktop only */}
          <div className="hidden md:flex flex-col items-end leading-tight">
            <span className="text-sm font-medium text-text-primary">{userName}</span>
            <span className="text-xs text-text-secondary">{roleLabels[userRole]}</span>
          </div>

          {/* Notification [SH]: rendered only when notificationCount is provided */}
          {notificationCount !== undefined && (
            <button
              type="button"
              aria-label={
                notificationCount > 0
                  ? `${notificationCount} notifications`
                  : 'Notifications'
              }
              className="p-2 rounded-[var(--radius-md)] hover:bg-black/5 transition-colors"
              onClick={onNotificationClick}
            >
              <NotificationBadge count={notificationCount} />
            </button>
          )}

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            leftIcon="LogOut"
            aria-label="Logout"
            onClick={onLogout}
          >
            <span className="hidden md:inline">Logout</span>
          </Button>

        </div>
      </div>
    </header>
  );
}
