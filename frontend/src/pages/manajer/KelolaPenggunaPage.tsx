import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Badge } from '../../components/atoms/Badge';
import { Button } from '../../components/atoms/Button';
import { manajerNavItems } from '../../router/navigation';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import { userService, type ProfileUser } from '../../services/userService';

const ROLE_COLOR: Record<string, 'warning' | 'info'> = {
  manajer: 'warning',
  utility: 'info',
};
const ROLE_LABEL: Record<string, string> = {
  manajer: 'Manajer',
  utility: 'Utility',
};

function formatCreatedAt(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function KelolaPenggunaPage() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Manajer';
  const storeId = profile?.storeId ?? null;

  const [users, setUsers] = useState<ProfileUser[]>([]);
  const [loading, setLoading] = useState(true);
  // MVP: profiles.is_active tidak ada di schema — toggle hanya ephemeral, local state per-id.
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>({});
  const [confirmUser, setConfirmUser] = useState<ProfileUser | null>(null);

  useEffect(() => {
    if (!storeId) return;
    setLoading(true);
    userService.getUsersByStore(storeId).then((data) => {
      setUsers(data);
      setActiveMap(Object.fromEntries(data.map((u) => [u.id, true])));
      setLoading(false);
    });
  }, [storeId]);

  const toggleAktif = (id: string) => {
    setActiveMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleClick = (targetUser: ProfileUser) => {
    setConfirmUser(targetUser);
  };

  const handleConfirm = () => {
    if (confirmUser) {
      toggleAktif(confirmUser.id);
      setConfirmUser(null);
    }
  };

  const handleCancelConfirm = () => {
    setConfirmUser(null);
  };

  if (!storeId) {
    return (
      <DashboardLayout
        navItems={manajerNavItems}
        userRole="manajer"
        userName={userName}
        onLogout={logout}
        onNotificationClick={() => navigate(ROUTES.MANAJER_NOTIFICATIONS)}
      >
        <div className="flex items-center justify-center p-8 text-text-secondary">
          <p>Store tidak ditemukan. Hubungi administrator.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navItems={manajerNavItems}
      userRole="manajer"
      userName={userName}
      onLogout={logout}
      onNotificationClick={() => navigate(ROUTES.MANAJER_NOTIFICATIONS)}
    >
      <div className="min-h-full bg-mottago-surface-subtle">
        <div className="max-w-[1280px] mx-auto p-4 md:p-6 lg:p-8 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Kelola Pengguna</h1>
            <p className="text-sm text-text-secondary mt-1">Total {users.length} pengguna</p>
          </div>

          {loading ? (
            <div className="p-8 text-text-secondary">Memuat data...</div>
          ) : users.length === 0 ? (
            <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-8 text-center text-text-secondary">
              Tidak ada pengguna ditemukan
            </div>
          ) : (
            <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-mottago-border bg-mottago-surface-subtle">
                      <th className="px-4 md:px-5 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Bergabung
                      </th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 md:px-5 py-2.5 text-right text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mottago-border">
                    {users.map((profileUser) => {
                      const isSelf = user?.id === profileUser.id;
                      const isAktif = activeMap[profileUser.id] ?? true;
                      return (
                        <tr
                          key={profileUser.id}
                          className="hover:bg-mottago-surface-subtle transition-colors"
                        >
                          <td className="px-4 md:px-5 py-3.5 whitespace-nowrap">
                            <span className="text-sm font-medium text-text-primary">
                              {profileUser.fullName}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <span className="text-sm text-text-secondary">
                              {profileUser.username}
                            </span>
                          </td>
                          <td className="px-3 py-3.5">
                            <Badge color={ROLE_COLOR[profileUser.role]} size="sm">
                              {ROLE_LABEL[profileUser.role]}
                            </Badge>
                          </td>
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <span className="text-sm text-text-secondary">
                              {formatCreatedAt(profileUser.createdAt)}
                            </span>
                          </td>
                          <td className="px-3 py-3.5">
                            <Badge color={isAktif ? 'success' : 'danger'} size="sm">
                              {isAktif ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                          </td>
                          <td className="px-4 md:px-5 py-3.5 text-right whitespace-nowrap">
                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => handleToggleClick(profileUser)}
                                className="text-xs font-medium text-info-text hover:opacity-80 transition-opacity"
                              >
                                {isAktif ? 'Nonaktifkan' : 'Aktifkan'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Inline Confirm Modal ──────────────────────── */}
      {confirmUser && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-6 w-full max-w-sm space-y-4">
            <h2 id="confirm-dialog-title" className="text-base font-semibold text-text-primary">
              Konfirmasi Perubahan
            </h2>
            <p className="text-sm text-text-secondary">
              {(activeMap[confirmUser.id] ?? true) ? 'Nonaktifkan' : 'Aktifkan'} pengguna{' '}
              <span className="font-semibold text-text-primary">{confirmUser.fullName}</span>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-1">
              <Button variant="secondary" size="sm" onClick={handleCancelConfirm}>
                Batal
              </Button>
              <Button
                variant={(activeMap[confirmUser.id] ?? true) ? 'danger' : 'primary'}
                size="sm"
                onClick={handleConfirm}
              >
                {(activeMap[confirmUser.id] ?? true) ? 'Nonaktifkan' : 'Aktifkan'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
