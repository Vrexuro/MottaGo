import type { UserRole } from './user.types';

export type SideNavState = 'hidden' | 'collapsed' | 'expanded';

export type BreakpointMode = 'mobile' | 'tablet' | 'desktop';

export interface NavItem {
  id: string;
  label: string;
  iconName: string;
  path: string;
  allowedRoles: UserRole[];
}
