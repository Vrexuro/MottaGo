import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { AppHeader } from '../../components/organisms/AppHeader';
import { SideNav } from '../../components/organisms/SideNav';

import type { NavItem, SideNavState } from '../../types/nav.types';
import type { UserRole } from '../../types/user.types';

type DashboardLayoutProps = {
  children: ReactNode;
  userRole: UserRole;
  userName: string;
  navItems: NavItem[];
  onLogout: () => void;
  onNotificationClick?: () => void;
  className?: string;
};

const getBreakpointState = (): SideNavState => {
  if (window.innerWidth >= 1024) return 'expanded';
  if (window.innerWidth >= 768) return 'collapsed';
  return 'hidden';
};

export function DashboardLayout({
  children,
  userRole,
  userName,
  navItems,
  onLogout,
  onNotificationClick,
  className,
}: DashboardLayoutProps) {
  const [sideNavState, setSideNavState] = useState<SideNavState>(getBreakpointState);
  const location = useLocation();

  useEffect(() => {
    const lgMq = window.matchMedia('(min-width: 1024px)');
    const mdMq = window.matchMedia('(min-width: 768px)');
    const update = () => setSideNavState(getBreakpointState());
    lgMq.addEventListener('change', update);
    mdMq.addEventListener('change', update);
    return () => {
      lgMq.removeEventListener('change', update);
      mdMq.removeEventListener('change', update);
    };
  }, []);

  const handleMenuToggle = () => setSideNavState('expanded');
  const handleSideNavClose = () => setSideNavState(getBreakpointState());

  // Derive the active page title from navItems for the AppHeader breadcrumb
  const pageTitle = navItems.find((item) => location.pathname === item.path)?.label ?? '';

  const rootClassName = ['h-screen flex flex-col', className].filter(Boolean).join(' ');

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
        sideNavOpen={sideNavState === 'expanded'}
        onMenuToggle={handleMenuToggle}
        pageTitle={pageTitle}
        onNotificationClick={onNotificationClick}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <SideNav
          items={navItems}
          userRole={userRole}
          userName={userName}
          onLogout={onLogout}
          state={sideNavState}
          onClose={handleSideNavClose}
        />

        <main id="main-content" className="flex-1 overflow-y-auto min-w-0 md:ml-16 lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
}
