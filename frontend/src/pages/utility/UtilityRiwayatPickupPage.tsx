import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Badge } from '../../components/atoms/Badge';
import { Button } from '../../components/atoms/Button';
import { utilityNavItems } from '../../router/navigation';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import { usePickup } from '../../hooks/usePickup';
import type { Pickup, PickupStatus } from '../../types/pickup.types';
import { PICKUP_KATEGORI_COLOR, PICKUP_KATEGORI_LABEL } from '../../constants/waste';

const STATUS_COLOR: Record<PickupStatus, 'success' | 'danger' | 'warning' | 'info'> = {
  completed: 'success',
  cancelled: 'danger',
  waiting: 'warning',
  'in-transit': 'info',
};

const STATUS_LABEL: Record<PickupStatus, string> = {
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  waiting: 'Menunggu',
  'in-transit': 'Dalam Perjalanan',
};

function formatTanggalWaktu(iso: string): string {
  const d = new Date(iso);
  const tanggal = d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const waktu = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  return `${tanggal}, ${waktu}`;
}

// Pegawai Utility berwenang mengubah status pickup — cukup tandai "Selesai"
// begitu vendor mengambil sampah, atau "Batalkan" jika request dibatalkan.
// Tidak ada langkah konfirmasi terpisah untuk status "dalam perjalanan".
// Manajer hanya memantau — lihat pages/manajer/RiwayatPickupPage.tsx (read-only).
export default function UtilityRiwayatPickupPage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Utility';
  const storeId = profile?.storeId ?? null;

  const { activePickups, pickupHistory, loading, cancel, complete } = usePickup(storeId ?? 0);
  const allPickups: Pickup[] = [...activePickups, ...pickupHistory];

  type PendingAction = { pickupId: string; action: 'complete' | 'cancel' };
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [isActing, setIsActing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const CONFIRM_TEXT: Record<PendingAction['action'], string> = {
    complete: 'Tandai pickup ini sebagai selesai? Vendor telah mengambil sampah.',
    cancel: 'Batalkan request pickup ini? Tindakan ini tidak dapat diurungkan.',
  };

  const CONFIRM_LABEL: Record<PendingAction['action'], string> = {
    complete: 'Ya, Selesaikan',
    cancel: 'Ya, Batalkan',
  };

  const CONFIRM_VARIANT: Record<PendingAction['action'], 'primary' | 'danger'> = {
    complete: 'primary',
    cancel: 'danger',
  };

  const handleAction = (pickupId: string, action: PendingAction['action']) => {
    setActionError(null);
    setPendingAction({ pickupId, action });
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    setIsActing(true);
    setActionError(null);

    const { pickupId, action } = pendingAction;
    const success = action === 'complete' ? await complete(pickupId) : await cancel(pickupId);

    setIsActing(false);
    if (success) {
      setPendingAction(null);
    } else {
      setActionError('Tindakan gagal. Mungkin status pickup sudah berubah. Refresh halaman.');
    }
  };

  const handleCancelAction = () => {
    setPendingAction(null);
    setActionError(null);
  };

  if (!storeId) {
    return (
      <DashboardLayout
        navItems={utilityNavItems}
        userRole="utility"
        userName={userName}
        onLogout={logout}
        onNotificationClick={() => {}}
      >
        <div className="flex items-center justify-center p-8 text-text-secondary">
          <p>Store tidak ditemukan. Hubungi administrator.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navItems={utilityNavItems}
      userRole="utility"
      userName={userName}
      onLogout={logout}
      onNotificationClick={() => {}}
    >
      <div className="min-h-full bg-mottago-surface-subtle">
        <div className="max-w-[1280px] mx-auto p-4 md:p-6 lg:p-8 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Riwayat Pickup</h1>
              <p className="text-sm text-text-secondary mt-1">Total {allPickups.length} pickup</p>
            </div>
            <Button
              variant="primary"
              leftIcon="Truck"
              onClick={() => navigate(ROUTES.UTILITY_REQUEST_PICKUP)}
            >
              Request Pickup
            </Button>
          </div>

          {actionError && (
            <div className="bg-error-bg border border-error-border text-error-text text-sm px-4 py-3 rounded-[var(--radius-md)]">
              {actionError}
            </div>
          )}

          {loading && allPickups.length === 0 ? (
            <div className="p-8 text-text-secondary">Memuat data...</div>
          ) : (
            <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px]">
                  <thead>
                    <tr className="border-b border-mottago-border bg-mottago-surface-subtle">
                      <th className="px-4 md:px-5 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Diminta
                      </th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Estimasi
                      </th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Selesai
                      </th>
                      <th className="px-4 md:px-5 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 md:px-5 py-2.5 text-right text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mottago-border">
                    {allPickups.map((pickup) => (
                      <tr
                        key={pickup.id}
                        className="hover:bg-mottago-surface-subtle transition-colors"
                      >
                        <td className="px-4 md:px-5 py-3.5 whitespace-nowrap">
                          <span className="text-sm font-mono text-text-primary">{pickup.id}</span>
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <span className="text-sm text-text-primary">
                            {formatTanggalWaktu(pickup.requestedAt)}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <span className="text-sm text-text-primary">{pickup.vendorName}</span>
                        </td>
                        <td className="px-3 py-3.5">
                          {pickup.wasteCategory ? (
                            <Badge color={PICKUP_KATEGORI_COLOR[pickup.wasteCategory]} size="sm">
                              {PICKUP_KATEGORI_LABEL[pickup.wasteCategory]}
                            </Badge>
                          ) : (
                            <span className="text-sm text-text-disabled">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <span className="text-sm font-semibold text-text-primary tabular-nums">
                            {pickup.estimasiKg !== null ? `${pickup.estimasiKg} kg` : '—'}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <span className="text-sm text-text-secondary">
                            {pickup.completedAt ? formatTanggalWaktu(pickup.completedAt) : '—'}
                          </span>
                        </td>
                        <td className="px-4 md:px-5 py-3.5">
                          <Badge color={STATUS_COLOR[pickup.status]} size="sm">
                            {STATUS_LABEL[pickup.status]}
                          </Badge>
                        </td>
                        <td className="px-4 md:px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-3">
                            {(pickup.status === 'waiting' || pickup.status === 'in-transit') && (
                              <button
                                type="button"
                                onClick={() => handleAction(pickup.id, 'complete')}
                                className="text-xs font-medium text-success-text hover:opacity-80 transition-opacity"
                              >
                                Selesaikan
                              </button>
                            )}
                            {(pickup.status === 'waiting' || pickup.status === 'in-transit') && (
                              <button
                                type="button"
                                onClick={() => handleAction(pickup.id, 'cancel')}
                                className="text-xs font-medium text-error-text hover:opacity-80 transition-opacity"
                              >
                                Batalkan
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Action Confirm Modal ──────────────────── */}
      {pendingAction && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="action-dialog-title"
        >
          <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-6 w-full max-w-sm space-y-4">
            <h2 id="action-dialog-title" className="text-base font-semibold text-text-primary">
              Konfirmasi Tindakan
            </h2>
            <p className="text-sm text-text-secondary">{CONFIRM_TEXT[pendingAction.action]}</p>
            {actionError && <p className="text-sm text-error-text">{actionError}</p>}
            <div className="flex items-center justify-end gap-3 pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancelAction}
                disabled={isActing}
              >
                Batal
              </Button>
              <Button
                variant={CONFIRM_VARIANT[pendingAction.action]}
                size="sm"
                loading={isActing}
                onClick={handleConfirmAction}
              >
                {CONFIRM_LABEL[pendingAction.action]}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
