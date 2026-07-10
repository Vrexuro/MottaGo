import { supabase } from '../lib/supabase';
import type {
  WasteCategory,
  WasteDailySummary,
  WasteTrendPoint,
  WasteType,
} from '../types/waste.types';

// ── Service-level types ───────────────────────────────────────────────────────

export type WasteTrendRange = 7 | 14 | 30;
export type WastePeriod = 'today' | '7d' | 'month';

// ── Internal helpers ──────────────────────────────────────────────────────────

const CATEGORY_NAMES: Record<WasteType, string> = {
  organik: 'Organik',
  anorganik: 'Anorganik',
  minyak: 'Minyak Jelantah',
};

function aggregateByType(
  rows: Array<{ waste_type: WasteType; quantity: number }>
): WasteCategory[] {
  const map = new Map<WasteType, number>();
  for (const row of rows) {
    map.set(row.waste_type, (map.get(row.waste_type) ?? 0) + row.quantity);
  }
  return Array.from(map.entries()).map(([type, kg]) => ({
    type,
    name: CATEGORY_NAMES[type],
    totalKg: kg,
  }));
}

// ── Service ───────────────────────────────────────────────────────────────────

export const wasteService = {
  getWasteToday: async (storeId: number): Promise<WasteDailySummary | null> => {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('waste_items')
      .select('waste_type, quantity')
      .eq('store_id', storeId)
      .gte('created_at', `${today}T00:00:00.000Z`);

    if (error) return null;

    const rows = (data ?? []) as Array<{ waste_type: WasteType; quantity: number }>;
    const byCategory = aggregateByType(rows);
    const totalKg = byCategory.reduce((sum, c) => sum + c.totalKg, 0);

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
    const rataHarian = Math.round((weekKg / 7) * 10) / 10;

    return {
      date: today,
      totalKg,
      rataHarian,
      byCategory,
    };
  },

  getWasteTrend: async (storeId: number, range: WasteTrendRange): Promise<WasteTrendPoint[]> => {
    const since = new Date();
    since.setDate(since.getDate() - range);

    const { data, error } = await supabase
      .from('waste_items')
      .select('quantity, created_at')
      .eq('store_id', storeId)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: true });

    if (error) return []; // TODO: implement Supabase query (tables exist in migration 0002_tables.sql)

    const rows = (data ?? []) as Array<{ quantity: number; created_at: string }>;

    // Aggregate daily totals client-side
    const dateMap = new Map<string, number>();
    for (const row of rows) {
      const date = row.created_at.split('T')[0];
      dateMap.set(date, (dateMap.get(date) ?? 0) + row.quantity);
    }

    return Array.from(dateMap.entries()).map(([date, totalKg]) => ({ date, totalKg }));
  },

  getWasteCategories: async (storeId: number, period: WastePeriod): Promise<WasteCategory[]> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let since: string;
    if (period === 'month') {
      since = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    } else if (period === '7d') {
      since = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    } else {
      since = today.toISOString(); // 'today'
    }

    const { data, error } = await supabase
      .from('waste_items')
      .select('waste_type, quantity')
      .eq('store_id', storeId)
      .gte('created_at', since);

    if (error) return []; // TODO: implement Supabase query (tables exist in migration 0002_tables.sql)

    const rows = (data ?? []) as Array<{ waste_type: WasteType; quantity: number }>;
    return aggregateByType(rows);
  },

  getWasteDailySummary: async (
    _storeId: number,
    _date: string
  ): Promise<WasteDailySummary | null> => {
    // TODO: implement once waste_items table is created.
    // Requires two queries for _date:
    //   1. SUM(quantity) GROUP BY waste_type WHERE date = _date AND store_id = _storeId
    //   2. AVG(daily_total) over the 7 days preceding _date (for rataHarian)
    // Consider a Supabase DB function to handle both in one round-trip.
    return null;
  },

  insertWasteItem: async (params: {
    storeId: number;
    wasteType: WasteType;
    quantity: number;
    recordedBy: string;
    notes?: string;
  }): Promise<{ id: string } | null> => {
    const { data, error } = await supabase
      .from('waste_items')
      .insert({
        store_id: params.storeId,
        waste_type: params.wasteType,
        quantity: params.quantity,
        recorded_by: params.recordedBy,
        notes: params.notes ?? null,
      })
      .select('id')
      .single();
    if (error) return null;
    return { id: (data as { id: string }).id };
  },

  getWasteHistory: async (
    storeId: number,
    limit = 50
  ): Promise<
    Array<{
      id: string;
      wasteType: WasteType;
      quantity: number;
      unit: string;
      quantityKg: number;
      recordedBy: string | null;
      recordedByName: string | null;
      createdAt: string;
    }>
  > => {
    const { data, error } = await supabase
      .from('waste_items')
      .select(
        'id, waste_type, quantity, unit, quantity_kg, recorded_by, created_at, profiles!recorded_by(full_name, username)'
      )
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) return [];
    return (
      (data ?? []) as unknown as Array<{
        id: string;
        waste_type: string;
        quantity: number;
        unit: string;
        quantity_kg: number;
        recorded_by: string | null;
        created_at: string;
        profiles: { full_name: string | null; username: string | null } | null;
      }>
    ).map((row) => ({
      id: row.id,
      wasteType: row.waste_type as WasteType,
      quantity: row.quantity,
      unit: row.unit,
      quantityKg: row.quantity_kg,
      recordedBy: row.recorded_by,
      recordedByName: row.profiles?.full_name ?? row.profiles?.username ?? null,
      createdAt: row.created_at,
    }));
  },
};
