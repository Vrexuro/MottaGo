import { AlertBanner } from '../../components/molecules/AlertBanner';
import { FormLayout } from '../../layouts/FormLayout';
import { KpiCard } from '../../components/molecules/KpiCard';
import { FormField } from '../../components/molecules/FormField';
import { SelectInput } from '../../components/atoms/SelectInput';
import { Button } from '../../components/atoms/Button';
import { Icon } from '../../components/atoms/Icon';
import { manajerNavItems } from '../../router/navigation';
import { MOCK_STATE, MOCK_ACTIVE_PICKUP_ID, VENDOR_OPTIONS } from '../../mock/pickup/requestPickup';

function RequestPickupPage() {
  const isActivePickup = MOCK_STATE === 'activePickup';
  const isNoVendor = MOCK_STATE === 'noVendor';
  const submitDisabled = isActivePickup || isNoVendor;

  return (
    <FormLayout
      navItems={manajerNavItems}
      userRole="manajer"
      userName="Mock Manajer"
      onLogout={() => undefined}
    >
      <div className="py-6 md:py-8 pb-10 space-y-5">
        {/* ── Zone A — Page Header ─────────────────────────── */}
        <div className="space-y-2">
          <button
            type="button"
            className="group flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <Icon
              name="ArrowLeft"
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Kembali ke Dashboard
          </button>
          <h1 className="text-2xl font-bold text-text-primary">Buat Pickup Manual</h1>
        </div>

        {/* ── Zone B — Capacity Context Card ───────────────── */}
        <KpiCard
          label="Kapasitas Saat Ini"
          iconName="Gauge"
          accent="warning"
          value="66%"
          badge={{ label: 'Perlu Perhatian', color: 'warning' }}
          subtexts={['263 kg dari 400 kg kapasitas maksimum', 'Proyeksi penuh dalam 3,6 hari']}
        />

        {/* ── Zone C — Business State Banners (DL-03 / DL-05) ─ */}
        {isActivePickup && (
          <AlertBanner
            variant="error"
            title={`Sudah ada pickup aktif (${MOCK_ACTIVE_PICKUP_ID}).`}
            description="Selesaikan atau batalkan pickup yang sedang berlangsung sebelum membuat yang baru."
            actionLabel="Lihat Pickup Aktif"
            onAction={() => undefined}
          />
        )}
        {isNoVendor && (
          <AlertBanner
            variant="warning"
            title="Tidak ada vendor aktif yang tersedia."
            description="Tambahkan vendor aktif terlebih dahulu untuk dapat melakukan pickup."
            actionLabel="Kelola Vendor"
            onAction={() => undefined}
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
            <Button variant="secondary" className="w-full sm:w-auto justify-center">
              Batal
            </Button>
            <Button
              variant="primary"
              disabled={submitDisabled}
              className="w-full sm:w-auto justify-center"
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
