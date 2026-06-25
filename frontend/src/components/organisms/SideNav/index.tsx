import { NavLink } from 'react-router-dom';
import { Icon } from '../../atoms/Icon';
import type { NavItem, SideNavState } from '../../../types/nav.types';
import type { UserRole } from '../../../types/user.types';

interface SideNavProps {
  items: NavItem[];
  userRole: UserRole;
  state: SideNavState;
  onClose: () => void;
  className?: string;
}

export function SideNav({ items, userRole, state, onClose, className }: SideNavProps) {
  const filteredItems = items.filter((item) => item.allowedRoles.includes(userRole));

  const panelClasses = [
    'fixed inset-y-0 left-0 z-50 h-full flex flex-col',
    'lg:relative lg:h-full',
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
        {state === 'expanded' && (
          <div className="flex justify-end px-3 py-2 lg:hidden">
            <button
              type="button"
              className="p-1.5 rounded-[var(--radius-md)] text-nav-dark-muted hover:text-nav-dark-item-text hover:bg-nav-dark-hover-bg transition-colors"
              aria-label="Close navigation menu"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        )}

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
                {state === 'expanded' && (
                  <span className="truncate">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
