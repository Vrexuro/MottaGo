import { Navigate } from 'react-router-dom';
import { ROUTES } from '../router/routes';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';

function RootPage() {
  const { session, loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-mottago-surface-subtle">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-mottago-surface-subtle">
        <p className="text-sm text-text-secondary">Memuat profil...</p>
      </div>
    );
  }

  switch (profile.role) {
    case 'manajer':
      return <Navigate to={ROUTES.MANAJER_DASHBOARD} replace />;
    case 'utility':
      return <Navigate to={ROUTES.UTILITY_ROOT} replace />;
    default:
      return (
        <div className="flex items-center justify-center min-h-screen bg-mottago-surface-subtle">
          <p className="text-sm text-text-secondary">Role tidak dikenali. Hubungi administrator.</p>
        </div>
      );
  }
}

export default RootPage;
