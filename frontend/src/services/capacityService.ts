import { supabase } from '../lib/supabase';

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

// ── Service ───────────────────────────────────────────────────────────────────

export const capacityService = {
  getCurrentCapacity: async (storeId: number): Promise<CurrentCapacity | null> => {
    const { data, error } = await supabase
      .from('capacity_snapshots')
      .select('current_kg, max_kg, created_at')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) return null; // TODO: implement Supabase query (tables exist in migration 0002_tables.sql)

    return {
      currentKg: data.current_kg as number,
      maxKg: data.max_kg as number,
      lastUpdated: data.created_at as string,
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

    if (error) return []; // TODO: implement Supabase query (tables exist in migration 0002_tables.sql)

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

    const [storeRes, latestSnapRes, todayWasteRes] = await Promise.all([
      supabase.from('stores').select('max_capacity').eq('id', storeId).single(),

      supabase
        .from('capacity_snapshots')
        .select('current_kg, max_kg')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),

      supabase
        .from('waste_items')
        .select('quantity_kg')
        .eq('store_id', storeId)
        .gte('created_at', `${today}T00:00:00.000Z`),
    ]);

    if (storeRes.error) return null;

    const maxKg = Number((storeRes.data as { max_capacity: number | null }).max_capacity ?? 0);
    const currentKg = latestSnapRes.error
      ? 0
      : Number((latestSnapRes.data as { current_kg: number }).current_kg);

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

    if (error) return []; // TODO: implement Supabase query (tables exist in migration 0002_tables.sql)

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
