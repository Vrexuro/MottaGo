import { supabase } from '../lib/supabase';
import type { WasteType } from '../types/waste.types';
import { WASTE_UNIT_MAP, WASTE_LABEL_MAP } from '../constants/waste';

// ── Domain types ──────────────────────────────────────────────────────────────

export interface CurrentCapacity {
  currentKg: number;
  maxKg: number;
  lastUpdated: string;
}

export interface CapacityTrendPoint {
  date: string;
  dateLabel: string;
  pct: number;
  kg: number;
}

export interface CapacitySummary {
  maxKg: number;
  currentKg: number;
  wasteHariIniKg: number;
  rataHarianKg: number;
}

export type CapacityAlertStatus = 'normal' | 'perlu-perhatian' | 'kritis';

export interface CapacityAlert {
  id: string;
  date: string;
  status: CapacityAlertStatus;
  pct: number;
  description: string;
}

export type CapacityTrendRange = 7 | 14 | 30 | 90;

export interface StoreInfo {
  id: number;
  storeName: string;
  city: string;
  /** @deprecated sejak 0016 — gunakan maxCapacityOrganik/Anorganik/Minyak */
  maxCapacity: number | null;
  maxCapacityOrganik: number | null;
  maxCapacityAnorganik: number | null;
  maxCapacityMinyak: number | null;
}

/** Kapasitas satu kategori sampah — current dihitung live, reset ke 0 setelah
 * pickup kategori itu selesai. */
export interface CategoryCapacity {
  wasteType: WasteType;
  label: string;
  unit: string;
  currentValue: number;
  maxValue: number;
  pct: number;
}

export interface CategoryMaxCapacityInput {
  organik: number;
  anorganik: number;
  minyak: number;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

// Ketiga kategori kini masing-masing punya gauge + max kapasitas sendiri
// (0016). Minyak (liter) ikut dihitung — MVP 1 liter = 1 kg (lihat
// 0002_tables.sql, waste_items.quantity_kg).
const ALL_WASTE_TYPES: WasteType[] = ['organik', 'anorganik', 'minyak'];

const MAX_CAPACITY_COLUMN: Record<WasteType, string> = {
  organik: 'max_capacity_organik',
  anorganik: 'max_capacity_anorganik',
  minyak: 'max_capacity_minyak',
};

// current value untuk SATU kategori = akumulasi quantity_kg sejak pickup
// terakhir berstatus 'completed' untuk kategori itu (atau sejak awal jika
// belum pernah ada pickup selesai). Pickup yang dibatalkan TIDAK mereset
// akumulasi — sampahnya masih ada secara fisik di lokasi. Ini yang membuat
// gauge kembali ke 0% begitu Utility menandai pickup kategori tsb selesai.
async function computeLiveCurrentForCategory(
  storeId: number,
  wasteType: WasteType
): Promise<number> {
  const { data: lastCompleted } = await supabase
    .from('pickups')
    .select('completed_at')
    .eq('store_id', storeId)
    .eq('waste_category', wasteType)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const since = (lastCompleted as { completed_at: string | null } | null)?.completed_at;

  let query = supabase
    .from('waste_items')
    .select('quantity_kg')
    .eq('store_id', storeId)
    .eq('waste_type', wasteType);

  if (since) {
    query = query.gt('created_at', since);
  }

  const { data } = await query;
  const rows = (data ?? []) as Array<{ quantity_kg: number }>;
  const total = rows.reduce((sum, r) => sum + r.quantity_kg, 0);
  return Math.round(total * 10) / 10;
}

// currentKg gabungan = SUM ketiga kategori (organik+anorganik+minyak), dihitung
// live dari waste_items, bukan dari snapshot yang bisa gagal/stale.
async function computeLiveCurrentKg(storeId: number): Promise<number> {
  const values = await Promise.all(
    ALL_WASTE_TYPES.map((wasteType) => computeLiveCurrentForCategory(storeId, wasteType))
  );
  return Math.round(values.reduce((sum, v) => sum + v, 0) * 10) / 10;
}

// ── Service ───────────────────────────────────────────────────────────────────

export const capacityService = {
  getStoreInfo: async (storeId: number): Promise<StoreInfo | null> => {
    const { data, error } = await supabase
      .from('stores')
      .select(
        'id, store_name, city, max_capacity, max_capacity_organik, max_capacity_anorganik, max_capacity_minyak'
      )
      .eq('id', storeId)
      .single();

    if (error || !data) return null;

    const row = data as {
      id: number;
      store_name: string;
      city: string;
      max_capacity: number | null;
      max_capacity_organik: number | null;
      max_capacity_anorganik: number | null;
      max_capacity_minyak: number | null;
    };
    return {
      id: row.id,
      storeName: row.store_name,
      city: row.city,
      maxCapacity: row.max_capacity,
      maxCapacityOrganik: row.max_capacity_organik,
      maxCapacityAnorganik: row.max_capacity_anorganik,
      maxCapacityMinyak: row.max_capacity_minyak,
    };
  },

  // Menyimpan kapasitas maksimum terpisah per kategori (0016). Kolom lama
  // max_capacity dipelihara sebagai SUM ketiganya agar reportService.getKpi
  // (efisiensiPct) tetap konsisten tanpa perlu diubah.
  updateCategoryMaxCapacity: async (
    storeId: number,
    values: CategoryMaxCapacityInput
  ): Promise<boolean> => {
    const { error } = await supabase
      .from('stores')
      .update({
        max_capacity_organik: values.organik,
        max_capacity_anorganik: values.anorganik,
        max_capacity_minyak: values.minyak,
        max_capacity: values.organik + values.anorganik + values.minyak,
        updated_at: new Date().toISOString(),
      })
      .eq('id', storeId);

    return !error;
  },

  // 3 gauge kapasitas terpisah — masing-masing current dihitung live
  // (akumulasi sejak pickup kategori itu terakhir selesai) terhadap max
  // kapasitas kategori itu sendiri. Kembali ke 0% begitu pickup kategori
  // tsb ditandai selesai oleh Utility.
  getCategoryCapacities: async (storeId: number): Promise<CategoryCapacity[] | null> => {
    const { data: storeData, error } = await supabase
      .from('stores')
      .select('max_capacity_organik, max_capacity_anorganik, max_capacity_minyak')
      .eq('id', storeId)
      .single();

    if (error || !storeData) return null;

    const maxRow = storeData as {
      max_capacity_organik: number | null;
      max_capacity_anorganik: number | null;
      max_capacity_minyak: number | null;
    };

    const currentValues = await Promise.all(
      ALL_WASTE_TYPES.map((wasteType) => computeLiveCurrentForCategory(storeId, wasteType))
    );

    return ALL_WASTE_TYPES.map((wasteType, i) => {
      const maxValue = Number(maxRow[MAX_CAPACITY_COLUMN[wasteType] as keyof typeof maxRow] ?? 0);
      const currentValue = currentValues[i];
      const pct = maxValue > 0 ? Math.round((currentValue / maxValue) * 100) : 0;
      return {
        wasteType,
        label: WASTE_LABEL_MAP[wasteType],
        unit: WASTE_UNIT_MAP[wasteType],
        currentValue,
        maxValue,
        pct,
      };
    });
  },

  // Akumulasi SATU kategori saat ini (kg/liter, sejak pickup kategori itu
  // terakhir selesai) — dipakai untuk mengisi estimasi_kg otomatis saat
  // Utility membuat pickup request, supaya "Estimasi" mencerminkan jumlah
  // sampah yang benar-benar menumpuk saat request dibuat, bukan kosong.
  getCurrentValueForCategory: async (storeId: number, wasteType: WasteType): Promise<number> => {
    return computeLiveCurrentForCategory(storeId, wasteType);
  },

  // currentKg = gabungan (SUM) ketiga kategori, dihitung LIVE (lihat
  // computeLiveCurrentKg) — bukan dibaca dari snapshot terakhir. Snapshot
  // bisa gagal tersimpan tanpa terdeteksi (fire-and-forget di CatatSampahPage)
  // dan hanya merekam total "hari ini", sehingga sampah yang menumpuk lintas
  // hari sebelum pickup selesai akan
  // hilang dari gauge. Live query selalu akurat terhadap data waste_items
  // + status pickup yang sebenarnya.
  getCurrentCapacity: async (storeId: number): Promise<CurrentCapacity | null> => {
    const { data: storeData, error } = await supabase
      .from('stores')
      .select('max_capacity')
      .eq('id', storeId)
      .single();

    if (error || !storeData) return null;

    const currentKg = await computeLiveCurrentKg(storeId);

    return {
      currentKg,
      maxKg: Number((storeData as { max_capacity: number | null }).max_capacity ?? 0),
      lastUpdated: new Date().toISOString(),
    };
  },

  getCapacityTrend: async (
    storeId: number,
    range: CapacityTrendRange
  ): Promise<CapacityTrendPoint[]> => {
    const since = new Date();
    since.setDate(since.getDate() - range);

    const { data, error } = await supabase
      .from('capacity_snapshots')
      .select('current_kg, max_kg, created_at')
      .eq('store_id', storeId)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: true });

    if (error) return [];

    const rows = (data ?? []) as Array<{
      current_kg: number;
      max_kg: number;
      created_at: string;
    }>;
    return rows.map((row) => {
      const d = new Date(row.created_at);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      const pct = Math.round((row.current_kg / row.max_kg) * 100);
      return { date: `${dd}/${mm}`, dateLabel: `${dd}/${mm}/${yyyy}`, pct, kg: row.current_kg };
    });
  },

  getCapacitySummary: async (storeId: number): Promise<CapacitySummary | null> => {
    const today = new Date().toISOString().split('T')[0];

    const [storeRes, currentKg, todayWasteRes] = await Promise.all([
      supabase.from('stores').select('max_capacity').eq('id', storeId).single(),

      computeLiveCurrentKg(storeId),

      supabase
        .from('waste_items')
        .select('quantity_kg')
        .eq('store_id', storeId)
        .gte('created_at', `${today}T00:00:00.000Z`),
    ]);

    if (storeRes.error) return null;

    const maxKg = Number((storeRes.data as { max_capacity: number | null }).max_capacity ?? 0);

    const wasteRows = (todayWasteRes.data ?? []) as Array<{ quantity_kg: number }>;
    const wasteHariIniKg =
      Math.round(wasteRows.reduce((sum, r) => sum + r.quantity_kg, 0) * 10) / 10;

    const since7d = new Date();
    since7d.setDate(since7d.getDate() - 7);
    const { data: weekData } = await supabase
      .from('waste_items')
      .select('quantity_kg')
      .eq('store_id', storeId)
      .gte('created_at', since7d.toISOString());

    const weekKg = ((weekData ?? []) as Array<{ quantity_kg: number }>).reduce(
      (sum, r) => sum + r.quantity_kg,
      0
    );
    const rataHarianKg = Math.round((weekKg / 7) * 10) / 10;

    return { maxKg, currentKg, wasteHariIniKg, rataHarianKg };
  },

  getCapacityAlertHistory: async (storeId: number): Promise<CapacityAlert[]> => {
    const { data, error } = await supabase
      .from('capacity_alerts')
      .select('id, created_at, status, pct, description')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) return [];

    const rows = (data ?? []) as Array<{
      id: string;
      created_at: string;
      status: CapacityAlertStatus;
      pct: number;
      description: string;
    }>;

    return rows.map((row) => ({
      id: row.id,
      date: new Date(row.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      status: row.status,
      pct: row.pct,
      description: row.description,
    }));
  },

  createSnapshot: async (storeId: number, currentKg: number, maxKg: number): Promise<boolean> => {
    const { error } = await supabase.from('capacity_snapshots').insert({
      store_id: storeId,
      current_kg: currentKg,
      max_kg: maxKg,
      source: 'manual',
    });
    return !error;
  },
};
