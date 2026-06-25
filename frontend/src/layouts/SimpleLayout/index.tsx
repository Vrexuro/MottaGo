import type { ReactNode } from 'react';

import { AppHeader } from '../../components/organisms/AppHeader';

import type { UserRole } from '../../types/user.types';

type NotificationSlot =
  | { notificationCount?: never; onNotificationClick?: never }
  | { notificationCount: number; onNotificationClick: () => void };

type SimpleLayoutProps = {
  children: ReactNode;
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
  className?: string;
} & NotificationSlot;

export function SimpleLayout({
  children,
  userRole,
  userName,
  onLogout,
  className,
  ...notificationSlot
}: SimpleLayoutProps) {
  const rootClassName = ['min-h-screen flex flex-col', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-brand-primary focus:rounded-[var(--radius-md)]"
      >
        Skip to main content
      </a>

      <AppHeader
        userRole={userRole}
        userName={userName}
        sideNavOpen={false}
        onMenuToggle={() => undefined}
        onLogout={onLogout}
        {...notificationSlot}
      />

      <main
        id="main-content"
        className="flex-1 overflow-y-auto min-w-0"
      >
        {children}
      </main>
    </div>
  );
}
