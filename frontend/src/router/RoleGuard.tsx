import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import type { UserRole } from '../types/user.types';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
  children: ReactNode;
}

export function RoleGuard({ allowedRoles, redirectTo, children }: RoleGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-mottago-surface-subtle">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    // Temporary placeholder — redirects to root until login page (SCR-SYS-01) is built
    return <Navigate to={redirectTo ?? ROUTES.ROOT} replace />;
  }

  const currentRole = (user.user_metadata?.role ?? null) as UserRole | null;

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    return <Navigate to={redirectTo ?? ROUTES.ROOT} replace />;
  }

  return <>{children}</>;
}
