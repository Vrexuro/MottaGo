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
  const { session, loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-mottago-surface-subtle">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to={redirectTo ?? ROUTES.LOGIN} replace />;
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    return <Navigate to={redirectTo ?? ROUTES.ROOT} replace />;
  }

  return <>{children}</>;
}
