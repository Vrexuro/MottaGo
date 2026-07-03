import { Link } from 'react-router-dom';
import { ROUTES } from '../router/routes';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-mottago-surface-subtle px-4">
      <p className="text-5xl font-semibold text-text-disabled">404</p>
      <h1 className="text-xl font-semibold text-text-primary">Halaman tidak ditemukan</h1>
      <p className="text-sm text-text-secondary text-center">
        Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        to={ROUTES.ROOT}
        className="mt-2 text-sm font-medium text-brand-primary hover:underline"
      >
        Kembali ke dashboard
      </Link>
    </div>
  );
}
