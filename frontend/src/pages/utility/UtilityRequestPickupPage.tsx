import { useState } from 'react';
import { AlertBanner } from '../../components/molecules/AlertBanner';
import { FormLayout } from '../../layouts/FormLayout';
import { KpiCard } from '../../components/molecules/KpiCard';
import { FormField } from '../../components/molecules/FormField';
import { SelectInput } from '../../components/atoms/SelectInput';
import { Button } from '../../components/atoms/Button';
import { Icon } from '../../components/atoms/Icon';
import { useNavigate } from 'react-router-dom';
import { utilityNavItems } from '../../router/navigation';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import { getCapacityStatus } from '../../constants/capacity';
import { useCapacity } from '../../hooks/useCapacity';
import { useWaste } from '../../hooks/useWaste';
import { useVendor } from '../../hooks/useVendor';
import { usePickup } from '../../hooks/usePickup';
import type { CreatePickupDto } from '../../types/pickup.types';

const KATEGORI_OPTIONS = [
  { value: 'organik', label: 'Organik' },
  { value: 'anorganik', label: 'Anorganik' },
  { value: 'minyak', label: 'Minyak Jelantah' },
];

function UtilityRequestPickupPage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Utility';
  const storeId = profile?.storeId ?? null;

  const { currentCapacity } = useCapacity(storeId ?? 0);
  const { today } = useWaste(storeId ?? 0);

  const currentKg = currentCapacity?.currentKg ?? 0;
  const maxKg = currentCapacity?.maxKg ?? 0;
  const rataHarianKg = today?.rataHarian ?? 0;
  const pct = maxKg > 0 ? Math.round((currentKg / maxKg) * 100) : 0;
  const status = getCapacityStatus(pct);
  const badgeLabel =
    status === 'critical' ? 'Kritis' : status === 'warning' ? 'Perlu Perhatian' : 'Aman';
  const badgeColor: 'success' | 'warning' | 'danger' =
    status === 'critical' ? 'danger' : status === 'warning' ? 'warning' : 'success';
  const proyeksiHari =
    rataHarianKg > 0 ? Math.round(((maxKg - currentKg) / rataHarianKg) * 10) / 10 : null;

  const { vendors, loading: vendorsLoading } = useVendor();
  const vendorOptions = vendors.map((v) => ({ value: String(v.id), label: v.name }));
  const { activePickups, create } = usePickup(storeId ?? 0);

  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [selectedKategori, setSelectedKategori] =
    useState<CreatePickupDto['wasteCategory']>('organik');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNoVendor = !vendorsLoading && vendors.length === 0;
  const isActivePickup = activePickups.some((p) => p.wasteCategory === selectedKategori);
  const activePickupForKategori = activePickups.find((p) => p.wasteCategory === selectedKategori);
  const submitDisabled = isActivePickup || isNoVendor || isSubmitting || !selectedVendorId;

  const handleSubmit = async () => {
    if (!storeId || !selectedVendorId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await create({
        storeId,
        vendorId: Number(selectedVendorId),
        wasteCategory: selectedKategori,
      });

      if (!result) {
        throw new Error(
          'Gagal membuat request pickup. Pastikan tidak ada pickup aktif untuk kategori yang sama.'
        );
      }

      setIsSuccess(true);
      setSelectedVendorId('');
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormLayout
      navItems={utilityNavItems}
      userRole="utility"
      userName={userName}
      onLogout={logout}
      onNotificationClick={() => {}}
    >
      <div className="py-6 md:py-8 pb-10 space-y-5">
        {/* ── Zone A — Page Header ─────────────────────────── */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => navigate(ROUTES.UTILITY_ROOT)}
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
            `${currentKg} kg dari ${maxKg} kg kapasitas maksimum`,
            proyeksiHari !== null
              ? `Proyeksi penuh dalam ${proyeksiHari} hari`
              : 'Data proyeksi tidak tersedia',
          ]}
        />

        {/* ── Zone C — Business State Banners (DL-03) ─────── */}
        {isSuccess && <AlertBanner variant="success" title="Request pickup berhasil dibuat!" />}
        {error && <AlertBanner variant="error" title={error} />}
        {isActivePickup && activePickupForKategori && (
          <AlertBanner
            variant="error"
            title={`Sudah ada pickup aktif untuk kategori ini (${activePickupForKategori.id}).`}
            description="Selesaikan atau batalkan pickup yang sedang berlangsung sebelum membuat yang baru."
          />
        )}
        {isNoVendor && (
          <AlertBanner
            variant="warning"
            title="Tidak ada vendor aktif yang tersedia."
            description="Hubungi manajer untuk menambahkan vendor."
          />
        )}

        {/* ── Zone D — Form Card ───────────────────────────── */}
        <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
          {/* Card header */}
          <div className="px-4 pt-5 pb-4 md:px-6 border-b border-mottago-border">
            <h2 className="text-base font-semibold text-text-primary">Detail Pickup</h2>
          </div>

          {/* Form body */}
          <div className="px-4 py-5 md:px-6 space-y-4">
            <FormField label="Kategori Waste" htmlFor="kategori-select" required>
              <SelectInput
                id="kategori-select"
                options={KATEGORI_OPTIONS}
                value={selectedKategori}
                onChange={(e) =>
                  setSelectedKategori(e.target.value as CreatePickupDto['wasteCategory'])
                }
              />
            </FormField>

            <FormField
              label="Vendor"
              htmlFor="vendor-select"
              required
              helpText={
                isNoVendor
                  ? 'Belum ada vendor aktif. Hubungi manajer.'
                  : 'Hanya vendor aktif yang ditampilkan.'
              }
            >
              <SelectInput
                id="vendor-select"
                options={isNoVendor ? [] : vendorOptions}
                placeholder="Pilih vendor..."
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                disabled={isNoVendor}
              />
            </FormField>
          </div>

          {/* Action buttons */}
          <div className="px-4 pb-5 md:px-6 md:pb-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Button
              variant="secondary"
              className="w-full sm:w-auto justify-center"
              onClick={() => navigate(ROUTES.UTILITY_ROOT)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon="Truck"
              className="w-full sm:w-auto justify-center"
              disabled={submitDisabled}
              loading={isSubmitting}
              onClick={handleSubmit}
            >
              Buat Pickup
            </Button>
          </div>
        </div>
      </div>
    </FormLayout>
  );
}

export default UtilityRequestPickupPage;
