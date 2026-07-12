import { supabase } from '../lib/supabase';

// ── Domain types ──────────────────────────────────────────────────────────────

export interface ReportKpi {
  totalSampahKg: number;
  totalPickup: number;
  rataHarianKg: number;
  efisiensiPct: number;
}

export interface ChartPoint {
  minggu: string;
  organik: number;
  anorganik: number;
  minyak: number;
}

export interface StoreInfo {
  name: string;
  city: string;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

const DAY_LABELS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

function bucketLabel(date: Date, days: number): string {
  if (days <= 7) return DAY_LABELS[date.getDay()];
  if (days <= 30) return `Mg ${Math.ceil(date.getDate() / 7)}`;
  return MONTH_LABELS[date.getMonth()];
}

// ── Service ───────────────────────────────────────────────────────────────────

export const reportService = {
  getKpi: async (storeId: number, days: number): Promise<ReportKpi> => {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceIso = since.toISOString();

    const [wasteRes, pickupRes, storeRes] = await Promise.all([
      supabase
        .from('waste_items')
        .select('quantity_kg')
        .eq('store_id', storeId)
        .gte('created_at', sinceIso),

      supabase
        .from('pickups')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId)
        .eq('status', 'completed')
        .gte('created_at', sinceIso),

      supabase.from('stores').select('max_capacity').eq('id', storeId).single(),
    ]);

    const wasteRows = (wasteRes.data ?? []) as Array<{ quantity_kg: number }>;
    const totalSampahKg =
      Math.round(wasteRows.reduce((sum, r) => sum + r.quantity_kg, 0) * 10) / 10;
    const totalPickup = pickupRes.count ?? 0;
    const rataHarianKg = Math.round((totalSampahKg / days) * 10) / 10;
    const maxKg = Number(
      (storeRes.data as { max_capacity: number | null } | null)?.max_capacity ?? 0
    );
    const efisiensiPct = maxKg > 0 ? Math.min(Math.round((totalSampahKg / maxKg) * 100), 100) : 0;

    return { totalSampahKg, totalPickup, rataHarianKg, efisiensiPct };
  },

  getChartData: async (storeId: number, days: number): Promise<ChartPoint[]> => {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
      .from('waste_items')
      .select('waste_type, quantity_kg, created_at')
      .eq('store_id', storeId)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: true });

    if (error) return [];

    const rows = (data ?? []) as Array<{
      waste_type: 'organik' | 'anorganik' | 'minyak';
      quantity_kg: number;
      created_at: string;
    }>;

    const buckets = new Map<string, ChartPoint>();
    for (const row of rows) {
      const label = bucketLabel(new Date(row.created_at), days);
      const bucket = buckets.get(label) ?? { minggu: label, organik: 0, anorganik: 0, minyak: 0 };
      bucket[row.waste_type] += row.quantity_kg;
      buckets.set(label, bucket);
    }

    return Array.from(buckets.values());
  },

  getStoreInfo: async (storeId: number): Promise<StoreInfo | null> => {
    const { data, error } = await supabase
      .from('stores')
      .select('store_name, city')
      .eq('id', storeId)
      .single();

    if (error || !data) return null;

    const row = data as { store_name: string; city: string };
    return { name: row.store_name, city: row.city };
  },
};
