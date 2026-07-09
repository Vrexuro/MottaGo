// CATATAN: WasteType enum di sini (organic/liquid/recyclable/non-recyclable)
// sudah deprecated — taxonomy sistem menggunakan 'organik'|'anorganik'|'minyak'
// File ini akan diupdate di Sprint C bersamaan dengan wasteService.ts
// Jangan gunakan WasteType ini untuk komponen baru.

// WasteType — from CategoryBreakdownCard.CATEGORIES ids; DL-02: unit follows type
export type WasteType = 'organic' | 'liquid' | 'recyclable' | 'non-recyclable';

// WasteUnit — DL-02: unit is determined automatically by waste_type, not entered manually
export type WasteUnit = 'kg' | 'liter';

// WasteCategory — from CategoryBreakdownCard.CATEGORIES shape
// (organic:120kg, liquid:79kg, recyclable:51kg, non-recyclable:13kg in mock)
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
  totalKg: number; // sum across all categories (mock: 47.3 kg today)
  rataHarian: number; // 7-day rolling average kg/day (mock: 38.5 kg/day)
  byCategory: WasteCategory[];
}
