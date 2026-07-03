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

  getCapacitySummary: async (_storeId: number): Promise<CapacitySummary | null> => {
    // TODO: implement once stores, capacity_snapshots, and waste_items tables are queried.
    // Requires three queries:
    //   1. stores.max_capacity for _storeId
    //   2. Latest capacity_snapshots.current_kg for _storeId
    //   3. SUM(waste_items.quantity_kg) WHERE date = today AND store_id = _storeId (wasteHariIniKg)
    //   4. 7-day rolling AVG(daily total) from waste_items for _storeId (rataHarianKg)
    return null;
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
};
