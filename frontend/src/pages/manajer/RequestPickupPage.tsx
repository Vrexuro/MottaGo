import { useState, useEffect } from 'react';
import { AlertBanner } from '../../components/molecules/AlertBanner';
import { FormLayout } from '../../layouts/FormLayout';
import { KpiCard } from '../../components/molecules/KpiCard';
import { FormField } from '../../components/molecules/FormField';
import { SelectInput } from '../../components/atoms/SelectInput';
import { Button } from '../../components/atoms/Button';
import { Icon } from '../../components/atoms/Icon';
import { useNavigate } from 'react-router-dom';
import { manajerNavItems } from '../../router/navigation';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import { MOCK_STATE, MOCK_ACTIVE_PICKUP_ID, VENDOR_OPTIONS } from '../../mock/pickup/requestPickup';
import { getManagerState, subscribeManager } from '../../mock/managerStore';
import { getCapacityStatus } from '../../constants/capacity';

function RequestPickupPage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Manajer';

  const [mgr, setMgr] = useState(() => getManagerState());

  useEffect(() => {
    return subscribeManager(() => setMgr(getManagerState()));
  }, []);

  const pct = Math.round((mgr.kapasitas.currentKg / mgr.kapasitas.maxKg) * 100);
  const status = getCapacityStatus(pct);
  const badgeLabel =
    status === 'critical' ? 'Kritis' : status === 'warning' ? 'Perlu Perhatian' : 'Aman';
  const badgeColor: 'success' | 'warning' | 'danger' =
    status === 'critical' ? 'danger' : status === 'warning' ? 'warning' : 'success';
  const proyeksiHari =
    mgr.wasteHariIni.rataHarianKg > 0
      ? Math.round(
          ((mgr.kapasitas.maxKg - mgr.kapasitas.currentKg) / mgr.wasteHariIni.rataHarianKg) * 10
        ) / 10
      : null;

  const isActivePickup = import.meta.env.DEV && MOCK_STATE === 'activePickup';
  const isNoVendor = import.meta.env.DEV && MOCK_STATE === 'noVendor';
  const submitDisabled = isActivePickup || isNoVendor;

  return (
    <FormLayout
      navItems={manajerNavItems}
      userRole="manajer"
      userName={userName}
      onLogout={logout}
      onNotificationClick={() => navigate(ROUTES.MANAJER_NOTIFICATIONS)}
    >
      <div className="py-6 md:py-8 pb-10 space-y-5">
        {/* ── Zone A — Page Header ─────────────────────────── */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => navigate(ROUTES.MANAJER_DASHBOARD)}
            className="group flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <Icon
              name="ArrowLeft"
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Kembali ke Dashboard
          </button>
          <h1 className="text-2xl font-semibold text-text-primary">Buat Pickup Manual</h1>
        </div>

        {/* ── Zone B — Capacity Context Card ───────────────── */}
        <KpiCard
          label="Kapasitas Saat Ini"
          iconName="Gauge"
          accent={status === 'critical' ? 'orange' : 'warning'}
          value={`${pct}%`}
          badge={{ label: badgeLabel, color: badgeColor }}
          subtexts={[
            `${mgr.kapasitas.currentKg} kg dari ${mgr.kapasitas.maxKg} kg kapasitas maksimum`,
            proyeksiHari !== null
              ? `Proyeksi penuh dalam ${proyeksiHari} hari`
              : 'Data proyeksi tidak tersedia',
          ]}
        />

        {/* ── Zone C — Business State Banners (DL-03 / DL-05) ─ */}
        {isActivePickup && (
          <AlertBanner
            variant="error"
            title={`Sudah ada pickup aktif (${MOCK_ACTIVE_PICKUP_ID}).`}
            description="Selesaikan atau batalkan pickup yang sedang berlangsung sebelum membuat yang baru."
            actionLabel="Lihat Pickup Aktif"
            onAction={() => navigate(ROUTES.MANAJER_RIWAYAT_PICKUP)}
          />
        )}
        {isNoVendor && (
          <AlertBanner
            variant="warning"
            title="Tidak ada vendor aktif yang tersedia."
            description="Tambahkan vendor aktif terlebih dahulu untuk dapat melakukan pickup."
            actionLabel="Kelola Vendor"
            onAction={() => navigate(ROUTES.MANAJER_VENDOR_MANAGEMENT)}
          />
        )}

        {/* ── Zone D — Form Card ───────────────────────────── */}
        <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
          {/* Card header */}
          <div className="px-4 pt-5 pb-4 md:px-6 border-b border-mottago-border">
            <h2 className="text-base font-semibold text-text-primary">Detail Pickup</h2>
          </div>

          {/* Form body */}
          <div className="px-4 py-5 md:px-6">
            <FormField
              label="Vendor"
              htmlFor="vendor-select"
              required
              helpText={
                isNoVendor
                  ? 'Belum ada vendor aktif. Tambahkan vendor di halaman Pengaturan.'
                  : 'Hanya vendor aktif yang ditampilkan.'
              }
            >
              <SelectInput
                id="vendor-select"
                options={isNoVendor ? [] : VENDOR_OPTIONS}
                placeholder="Pilih vendor..."
                defaultValue=""
                disabled={isNoVendor}
              />
            </FormField>
          </div>

          {/* Action buttons */}
          <div className="px-4 pb-5 md:px-6 md:pb-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Button
              variant="secondary"
              className="w-full sm:w-auto justify-center"
              onClick={() => navigate(ROUTES.MANAJER_DASHBOARD)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon="Truck"
              className="w-full sm:w-auto justify-center"
              disabled={submitDisabled}
            >
              Buat Pickup
            </Button>
          </div>
        </div>
      </div>
    </FormLayout>
  );
}

export default RequestPickupPage;
