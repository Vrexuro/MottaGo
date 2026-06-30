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
  organic: 'Organic Waste',
  liquid: 'Liquid Waste',
  recyclable: 'Recyclable Waste',
  'non-recyclable': 'Non-Recyclable Waste',
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

    if (error) return null; // TODO: table not yet created

    const rows = (data ?? []) as Array<{ waste_type: WasteType; quantity: number }>;
    const byCategory = aggregateByType(rows);
    const totalKg = byCategory.reduce((sum, c) => sum + c.totalKg, 0);

    return {
      date: today,
      totalKg,
      rataHarian: 0, // TODO: compute 7-day rolling average once waste_items table is ready
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

    if (error) return []; // TODO: table not yet created

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

    if (error) return []; // TODO: table not yet created

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
};
