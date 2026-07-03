import { NavLink } from 'react-router-dom';
import { Icon } from '../../atoms/Icon';
import type { NavItem, SideNavState } from '../../../types/nav.types';
import type { UserRole } from '../../../types/user.types';

const ROLE_LABELS: Record<UserRole, string> = {
  manajer: 'Manajer',
  utility: 'Utility',
};

const getInitials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase();

interface SideNavProps {
  items: NavItem[];
  userRole: UserRole;
  userName?: string;
  onLogout?: () => void;
  state: SideNavState;
  onClose: () => void;
  className?: string;
}

export function SideNav({
  items,
  userRole,
  userName,
  onLogout,
  state,
  onClose,
  className,
}: SideNavProps) {
  const filteredItems = items.filter((item) => item.allowedRoles.includes(userRole));
  const initials = userName ? getInitials(userName) : '?';

  const panelClasses = [
    'fixed left-0 z-50 flex flex-col',
    state === 'collapsed' ? 'top-16 bottom-0' : 'inset-y-0',
    'lg:relative lg:top-auto lg:bottom-auto lg:h-full',
    'bg-nav-dark-bg',
    'transition-[width,transform] duration-300 motion-reduce:transition-none',
    state === 'collapsed' ? 'w-16' : 'w-60',
    state === 'hidden' ? '-translate-x-full' : 'translate-x-0',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const navItemClasses = (isActive: boolean): string =>
    [
      'flex items-center w-full py-3 px-4',
      'text-nav-dark-item-text text-sm font-medium',
      'transition-colors duration-150',
      'border-l-[3px]',
      isActive
        ? 'bg-nav-dark-active-bg border-l-[var(--color-nav-dark-active-border)]'
        : 'border-transparent hover:bg-nav-dark-hover-bg',
      state === 'collapsed' ? 'justify-center px-0' : 'gap-3',
    ]
      .filter(Boolean)
      .join(' ');

  return (
    <>
      {state === 'expanded' && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      <nav id="sidenav" className={panelClasses} aria-label="Main navigation">
        {/* Brand header — all breakpoints when expanded.
            Close button shown only in drawer (tablet/mobile). */}
        {state === 'expanded' && (
          <div className="flex shrink-0 items-center gap-3 px-4 h-16">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-[var(--radius-md)] bg-accent-primary flex items-center justify-center shrink-0">
                <Icon name="Leaf" size={16} className="text-black" />
              </div>
              <span className="text-base font-semibold text-nav-dark-item-text">MottaGo</span>
            </div>
            {/* Close button — drawer only (tablet/mobile) */}
            <button
              type="button"
              className="shrink-0 p-1.5 rounded-[var(--radius-md)] text-nav-dark-muted hover:text-nav-dark-item-text hover:bg-nav-dark-hover-bg transition-colors lg:hidden"
              aria-label="Close navigation menu"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        )}

        {/* Section label — expanded only */}
        {state === 'expanded' && (
          <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-widest text-nav-dark-muted">
            menu utama
          </p>
        )}

        {/* Nav items */}
        <ul role="list" className="flex-1 overflow-y-auto py-2">
          {filteredItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                end
                aria-label={state === 'collapsed' ? item.label : undefined}
                className={({ isActive }) => navItemClasses(isActive)}
              >
                <Icon name={item.iconName} size={20} />
                {state === 'expanded' && <span className="truncate">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Horizontal divider above profile */}
        <div className="shrink-0 mx-4 h-px bg-nav-dark-hover-bg" />

        {/* Profile section — collapsed: avatar centered; expanded: full row with vertical divider */}
        {state === 'collapsed' ? (
          <div className="shrink-0 flex justify-center py-4">
            <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center">
              <span className="text-xs font-bold text-on-dark leading-none">{initials}</span>
            </div>
          </div>
        ) : (
          <div className="shrink-0 flex items-center gap-3 px-4 py-3">
            {/* Avatar */}
            <div className="shrink-0 w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center">
              <span className="text-xs font-bold text-on-dark leading-none">{initials}</span>
            </div>
            {/* Name + role */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-nav-dark-item-text truncate">
                {userName ?? '—'}
              </p>
              <p className="text-xs text-nav-dark-muted">{ROLE_LABELS[userRole]}</p>
            </div>
            {/* Vertical divider */}
            <div className="shrink-0 w-px h-8 bg-nav-dark-hover-bg" />
            {/* Logout button */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="shrink-0 p-1.5 rounded-[var(--radius-md)] text-nav-dark-muted hover:text-nav-dark-item-text hover:bg-nav-dark-hover-bg transition-colors"
                aria-label="Logout"
              >
                <Icon name="LogOut" size={16} />
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
