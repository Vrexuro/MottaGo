import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Button } from '../../components/atoms/Button';
import { Icon } from '../../components/atoms/Icon';
import { manajerNavItems } from '../../router/navigation';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import { capacityService } from '../../services/capacityService';
import type { StoreInfo } from '../../services/capacityService';

interface CategoryField {
  key: 'organik' | 'anorganik' | 'minyak';
  label: string;
  unit: string;
}

const CATEGORY_FIELDS: CategoryField[] = [
  { key: 'organik', label: 'Sampah Organik', unit: 'kg' },
  { key: 'anorganik', label: 'Sampah Anorganik', unit: 'kg' },
  { key: 'minyak', label: 'Minyak Jelantah', unit: 'liter' },
];

export default function PengaturanPage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Manajer';
  const storeId = profile?.storeId ?? null;

  // ── State ────────────────────────────────────────────────────────────
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState<Record<CategoryField['key'], string>>({
    organik: '',
    anorganik: '',
    minyak: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // ── Fetch store info ─────────────────────────────────────────────────
  useEffect(() => {
    if (!storeId) {
      setLoading(false);
      return;
    }
    capacityService.getStoreInfo(storeId).then((info) => {
      setStoreInfo(info);
      setInputs({
        organik: info?.maxCapacityOrganik != null ? String(info.maxCapacityOrganik) : '',
        anorganik: info?.maxCapacityAnorganik != null ? String(info.maxCapacityAnorganik) : '',
        minyak: info?.maxCapacityMinyak != null ? String(info.maxCapacityMinyak) : '',
      });
      setLoading(false);
    });
  }, [storeId]);

  // ── Auto-dismiss success banner ───────────────────────────────────────
  useEffect(() => {
    if (!saveSuccess) return;
    const t = setTimeout(() => setSaveSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [saveSuccess]);

  // ── Handlers ─────────────────────────────────────────────────────────
  const handleInputChange = (key: CategoryField['key'], value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setValidationError(null);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!storeId) return;

    const parsed: Record<CategoryField['key'], number> = { organik: 0, anorganik: 0, minyak: 0 };
    for (const field of CATEGORY_FIELDS) {
      const raw = parseFloat(inputs[field.key].replace(',', '.'));
      if (isNaN(raw) || raw <= 0) {
        setValidationError(
          `Kapasitas maksimum ${field.label} harus berupa angka positif (contoh: 500).`
        );
        return;
      }
      if (raw > 999999) {
        setValidationError(`Nilai ${field.label} terlalu besar. Maksimum 999.999.`);
        return;
      }
      parsed[field.key] = raw;
    }

    setIsSaving(true);
    setSaveError(null);
    const success = await capacityService.updateCategoryMaxCapacity(storeId, parsed);
    setIsSaving(false);

    if (success) {
      setStoreInfo((prev) =>
        prev
          ? {
              ...prev,
              maxCapacityOrganik: parsed.organik,
              maxCapacityAnorganik: parsed.anorganik,
              maxCapacityMinyak: parsed.minyak,
              maxCapacity: parsed.organik + parsed.anorganik + parsed.minyak,
            }
          : prev
      );
      setSaveSuccess(true);
    } else {
      setSaveError('Gagal menyimpan. Periksa koneksi atau coba lagi.');
    }
  };

  const isFormEmpty = CATEGORY_FIELDS.some((f) => inputs[f.key].trim() === '');

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <DashboardLayout
      navItems={manajerNavItems}
      userRole="manajer"
      userName={userName}
      onLogout={logout}
      onNotificationClick={() => navigate(ROUTES.MANAJER_NOTIFICATIONS)}
    >
      <div className="min-h-full bg-mottago-surface-subtle p-4 md:p-6 lg:p-8">
        <div className="max-w-lg mx-auto space-y-6">
          {/* ── Header ────────────────────────────────────────── */}
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Pengaturan Store</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Konfigurasi kapasitas dan informasi toko Anda.
            </p>
          </div>

          {/* ── Loading state ─────────────────────────────────── */}
          {loading && (
            <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] p-6 flex items-center gap-3">
              <Icon name="Loader2" size={16} className="animate-spin text-text-secondary" />
              <p className="text-sm text-text-secondary">Memuat informasi store...</p>
            </div>
          )}

          {/* ── No store ID ────────────────────────────────────── */}
          {!loading && !storeId && (
            <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] p-6 text-center">
              <p className="text-sm text-text-secondary">
                Akun ini tidak terhubung ke store manapun.
              </p>
            </div>
          )}

          {/* ── Main content ───────────────────────────────────── */}
          {!loading && storeId && (
            <>
              {/* Informasi Store (read-only) */}
              <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] p-6 space-y-4">
                <h2 className="text-sm font-semibold text-text-primary">Informasi Store</h2>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-text-secondary shrink-0">Nama Store</span>
                    <span className="text-sm font-medium text-text-primary text-right">
                      {storeInfo?.storeName ?? '—'}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-text-secondary shrink-0">Kota</span>
                    <span className="text-sm font-medium text-text-primary text-right">
                      {storeInfo?.city ?? '—'}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-text-secondary shrink-0">Store ID</span>
                    <span className="text-sm font-medium text-text-primary text-right">
                      {storeId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Kapasitas Maksimum per Kategori (editable) */}
              <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] p-6 space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-text-primary">
                    Kapasitas Maksimum per Kategori
                  </h2>
                  <p className="mt-1 text-xs text-text-secondary">
                    Batas kapasitas tiap jenis sampah. Digunakan untuk menghitung persentase
                    kapasitas terpakai per kategori — masing-masing kembali ke 0% setelah pickup
                    kategori tersebut selesai.
                  </p>
                </div>

                {/* Success banner */}
                {saveSuccess && (
                  <div className="bg-success-bg border border-success-border text-success-text text-sm px-4 py-2.5 rounded-[var(--radius-md)] flex items-center gap-2">
                    <Icon name="CheckCircle" size={16} />
                    Kapasitas berhasil disimpan.
                  </div>
                )}

                {/* Error banner */}
                {saveError && (
                  <div className="bg-error-bg border border-error-border text-error-text text-sm px-4 py-2.5 rounded-[var(--radius-md)]">
                    {saveError}
                  </div>
                )}
                {validationError && (
                  <div className="bg-error-bg border border-error-border text-error-text text-sm px-4 py-2.5 rounded-[var(--radius-md)]">
                    {validationError}
                  </div>
                )}

                {/* 3 input kategori */}
                <div className="space-y-4">
                  {CATEGORY_FIELDS.map((field) => {
                    const currentValue =
                      field.key === 'organik'
                        ? storeInfo?.maxCapacityOrganik
                        : field.key === 'anorganik'
                          ? storeInfo?.maxCapacityAnorganik
                          : storeInfo?.maxCapacityMinyak;
                    return (
                      <div key={field.key} className="space-y-1.5">
                        <label
                          htmlFor={`max-capacity-${field.key}`}
                          className="block text-sm font-medium text-text-primary"
                        >
                          {field.label} ({field.unit})
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            id={`max-capacity-${field.key}`}
                            type="number"
                            min="1"
                            step="0.01"
                            value={inputs[field.key]}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                            placeholder="contoh: 200"
                            className={[
                              'flex-1 px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-mottago-surface',
                              'text-text-primary placeholder:text-text-disabled',
                              'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
                              'transition-colors border-mottago-border hover:border-text-secondary',
                            ].join(' ')}
                          />
                          <span className="text-sm text-text-secondary shrink-0 w-10">
                            {field.unit}
                          </span>
                        </div>
                        <p className="text-xs text-text-disabled">
                          Saat ini:{' '}
                          {currentValue != null
                            ? `${currentValue.toLocaleString('id-ID')} ${field.unit}`
                            : 'belum dikonfigurasi'}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Save button */}
                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    loading={isSaving}
                    disabled={isSaving || isFormEmpty}
                    onClick={handleSave}
                    leftIcon="Save"
                  >
                    Simpan Perubahan
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
