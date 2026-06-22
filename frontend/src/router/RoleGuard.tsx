import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { ROUTES } from './routes';
import type { UserRole } from '../types/user.types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  currentRole: UserRole | null;
  redirectTo?: string;
  children: ReactNode;
}

export function RoleGuard({
  allowedRoles,
  currentRole,
  redirectTo,
  children,
}: RoleGuardProps) {
  if (currentRole === null || !allowedRoles.includes(currentRole)) {
    return <Navigate to={redirectTo ?? ROUTES.ROOT} replace />;
  }

  return <>{children}</>;
}
