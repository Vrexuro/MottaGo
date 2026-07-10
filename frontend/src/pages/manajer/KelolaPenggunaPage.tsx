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

  // ── Tambah Pengguna form state ────────────────────────────────────────────
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

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

  const handleAddUser = async () => {
    if (!storeId) return;
    setIsCreating(true);
    setCreateError(null);

    try {
      await userService.createUser({
        username: newUsername.trim().toLowerCase(),
        fullName: newFullName.trim(),
        password: newPassword,
      });

      // Refresh user list
      const updated = await userService.getUsersByStore(storeId);
      setUsers(updated);
      setActiveMap((prev) => {
        const next = { ...prev };
        updated.forEach((u) => {
          if (!(u.id in next)) next[u.id] = true;
        });
        return next;
      });

      // Reset form and show success
      setNewUsername('');
      setNewFullName('');
      setNewPassword('');
      setShowAddForm(false);
      setCreateSuccess(true);
      setTimeout(() => setCreateSuccess(false), 3000);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Gagal membuat pengguna');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelAddUser = () => {
    setShowAddForm(false);
    setNewUsername('');
    setNewFullName('');
    setNewPassword('');
    setCreateError(null);
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
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Kelola Pengguna</h1>
              <p className="text-sm text-text-secondary mt-1">Total {users.length} pengguna</p>
            </div>
            <Button
              variant="primary"
              leftIcon="UserPlus"
              onClick={() => {
                setShowAddForm(true);
                setCreateError(null);
              }}
            >
              Tambah Pengguna
            </Button>
          </div>

          {createSuccess && (
            <div className="bg-success-bg border border-success-border text-success-text text-sm px-4 py-3 rounded-[var(--radius-md)]">
              Pengguna baru berhasil dibuat dan dapat langsung login.
            </div>
          )}

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

      {/* ── Tambah Pengguna Modal ──────────────────── */}
      {showAddForm && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-user-dialog-title"
        >
          <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-6 w-full max-w-sm space-y-4">
            <h2 id="add-user-dialog-title" className="text-base font-semibold text-text-primary">
              Tambah Pengguna Baru
            </h2>
            <p className="text-xs text-text-secondary">
              Pengguna baru akan memiliki role <strong>Utility</strong> dan terdaftar di store ini.
            </p>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="new-fullname"
                  className="block text-sm font-medium text-text-primary"
                >
                  Nama Lengkap <span className="text-error-text">*</span>
                </label>
                <input
                  id="new-fullname"
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  disabled={isCreating}
                  className="w-full px-3 py-2 text-sm border border-mottago-border rounded-[var(--radius-md)] bg-mottago-surface text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="new-username"
                  className="block text-sm font-medium text-text-primary"
                >
                  Username <span className="text-error-text">*</span>
                </label>
                <input
                  id="new-username"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value.toLowerCase())}
                  placeholder="Contoh: budi_santoso"
                  disabled={isCreating}
                  className="w-full px-3 py-2 text-sm border border-mottago-border rounded-[var(--radius-md)] bg-mottago-surface text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary disabled:opacity-50"
                />
                <p className="text-xs text-text-secondary">
                  Huruf kecil, angka, dan underscore. Min. 3 karakter.
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-text-primary"
                >
                  Password <span className="text-error-text">*</span>
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  disabled={isCreating}
                  className="w-full px-3 py-2 text-sm border border-mottago-border rounded-[var(--radius-md)] bg-mottago-surface text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary disabled:opacity-50"
                />
              </div>
            </div>

            {createError && (
              <p className="text-sm text-error-text bg-error-bg border border-error-border px-3 py-2 rounded-[var(--radius-md)]">
                {createError}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancelAddUser}
                disabled={isCreating}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon="UserPlus"
                loading={isCreating}
                disabled={!newUsername || !newFullName || !newPassword || isCreating}
                onClick={handleAddUser}
              >
                Buat Pengguna
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
