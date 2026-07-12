// WasteType — DB taxonomy (waste_items.waste_type); DL-02: unit follows type
export type WasteType = 'organik' | 'anorganik' | 'minyak';

// WasteUnit — DL-02: unit is determined automatically by waste_type, not entered manually
export type WasteUnit = 'kg' | 'liter';

// WasteCategory — aggregated total per waste_type for a queried period
export interface WasteCategory {
  type: WasteType;
  name: string; // localized display name e.g. 'Organic Waste'
  totalKg: number; // weight for the queried period
}

// WasteTrendPoint — domain-level shape behind WasteTrendCard DataPoint
// Component derives display labels ('Sen', '27/6') from ISO date at render time
export interface WasteTrendPoint {
  date: string; // ISO date 'YYYY-MM-DD'
  totalKg: number;
}

// WasteDailySummary — from CapacitySummaryStats.MOCK + CategoryBreakdownCard
// Aggregated waste data for a single day
export interface WasteDailySummary {
  date: string; // ISO date 'YYYY-MM-DD'
  totalKg: number; // organik + anorganik saja (satuan kg) — TIDAK termasuk minyak (liter)
  totalLiter: number; // minyak jelantah saja (satuan liter)
  rataHarian: number; // 7-day rolling average kg/day, organik+anorganik saja
  byCategory: WasteCategory[];
  entryCount: number; // jumlah baris waste_items hari ini (bukan jumlah kategori)
}
