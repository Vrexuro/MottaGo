import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormLayout } from '../../layouts/FormLayout';
import { FormField } from '../../components/molecules/FormField';
import { AlertBanner } from '../../components/molecules/AlertBanner';
import { SelectInput } from '../../components/atoms/SelectInput';
import { TextInput } from '../../components/atoms/TextInput';
import { Button } from '../../components/atoms/Button';
import { utilityNavItems } from '../../router/navigation';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import { wasteService } from '../../services/wasteService';
import { capacityService } from '../../services/capacityService';
import { supabase } from '../../lib/supabase';
import type { WasteType } from '../../types/waste.types';
import type { SelectOption } from '../../types/common.types';
import { WASTE_UNIT_MAP } from '../../constants/waste';

const KATEGORI_OPTIONS: SelectOption[] = [
  { value: 'organik', label: 'Organik (Sisa Makanan, dll)' },
  { value: 'anorganik', label: 'Anorganik (Plastik, Kertas, dll)' },
  { value: 'minyak', label: 'Minyak Jelantah' },
];

export default function CatatSampahPage() {
  const { profile, user, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Utility';
  const storeId = profile?.storeId ?? null;

  const [kategori, setKategori] = useState<WasteType>('organik');
  const [jumlah, setJumlah] = useState('');
  const [catatan, setCatatan] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!storeId || !user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await wasteService.insertWasteItem({
        storeId,
        wasteType: kategori,
        quantity: parseFloat(jumlah) || 0,
        recordedBy: user.id,
        notes: catatan || undefined,
      });

      if (!result) throw new Error('Gagal menyimpan data sampah');

      const todayData = await wasteService.getWasteToday(storeId);
      const { data: storeData } = await supabase
        .from('stores')
        .select('max_capacity')
        .eq('id', storeId)
        .single();

      if (todayData && storeData?.max_capacity) {
        await capacityService.createSnapshot(
          storeId,
          todayData.totalKg,
          Number(storeData.max_capacity)
        );
      }

      setSubmitted(true);
      setJumlah('');
      setCatatan('');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  if (!storeId) {
    return (
      <FormLayout
        navItems={utilityNavItems}
        userRole="utility"
        userName={userName}
        onLogout={logout}
        onNotificationClick={() => {}}
      >
        <div className="flex items-center justify-center p-8 text-text-secondary">
          <p>Store tidak ditemukan. Hubungi administrator.</p>
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout
      navItems={utilityNavItems}
      userRole="utility"
      userName={userName}
      onLogout={logout}
      onNotificationClick={() => {}}
    >
      <div className="py-6 md:py-8 space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Catat Sampah Baru</h1>
          <p className="text-sm text-text-secondary mt-1">Tambahkan entri sampah untuk shift ini</p>
        </div>

        {submitted && <AlertBanner variant="success" title="Entri berhasil dicatat!" />}
        {error && <AlertBanner variant="error" title={error} />}

        <form
          onSubmit={handleSubmit}
          className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-4 md:p-6 space-y-4"
        >
          <FormField label="Kategori" htmlFor="kategori" required>
            <SelectInput
              id="kategori"
              options={KATEGORI_OPTIONS}
              value={kategori}
              onChange={(e) => setKategori(e.target.value as WasteType)}
            />
          </FormField>

          <p className="text-sm text-text-secondary">
            Unit otomatis:{' '}
            <span className="font-medium text-text-primary">{WASTE_UNIT_MAP[kategori]}</span>
          </p>

          <FormField label="Jumlah" htmlFor="jumlah" required>
            <TextInput
              id="jumlah"
              type="number"
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Catatan (opsional)" htmlFor="catatan">
            <TextInput
              id="catatan"
              type="text"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
            />
          </FormField>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate(ROUTES.UTILITY_ROOT)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Simpan Entri
            </Button>
          </div>
        </form>
      </div>
    </FormLayout>
  );
}
