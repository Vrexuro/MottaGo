import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Badge } from '../../components/atoms/Badge';
import { manajerNavItems } from '../../router/navigation';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import { USERS } from '../../mock/user';
import type { UserRecord } from '../../mock/user';

const ROLE_COLOR: Record<string, 'warning' | 'info'> = {
  manajer: 'warning',
  utility: 'info',
};
const ROLE_LABEL: Record<string, string> = {
  manajer: 'Manajer',
  utility: 'Utility',
};

export default function KelolaPenggunaPage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Manajer';

  const [users, setUsers] = useState<UserRecord[]>(USERS);

  const toggleAktif = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isAktif: !u.isAktif } : u)));
  };

  const handleToggleClick = (user: UserRecord) => {
    const confirmed = window.confirm(
      `${user.isAktif ? 'Nonaktifkan' : 'Aktifkan'} pengguna ${user.nama}?`
    );
    if (confirmed) toggleAktif(user.id);
  };

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
                      Status
                    </th>
                    <th className="px-4 md:px-5 py-2.5 text-right text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mottago-border">
                  {users.map((user) => {
                    const isSelf = profile?.fullName === user.nama;
                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-mottago-surface-subtle transition-colors"
                      >
                        <td className="px-4 md:px-5 py-3.5 whitespace-nowrap">
                          <span className="text-sm font-medium text-text-primary">{user.nama}</span>
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <span className="text-sm text-text-secondary">{user.username}</span>
                        </td>
                        <td className="px-3 py-3.5">
                          <Badge color={ROLE_COLOR[user.role]} size="sm">
                            {ROLE_LABEL[user.role]}
                          </Badge>
                        </td>
                        <td className="px-3 py-3.5">
                          <Badge color={user.isAktif ? 'success' : 'danger'} size="sm">
                            {user.isAktif ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </td>
                        <td className="px-4 md:px-5 py-3.5 text-right whitespace-nowrap">
                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() => handleToggleClick(user)}
                              className="text-xs font-medium text-info-text hover:opacity-80 transition-opacity"
                            >
                              {user.isAktif ? 'Nonaktifkan' : 'Aktifkan'}
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
        </div>
      </div>
    </DashboardLayout>
  );
}
