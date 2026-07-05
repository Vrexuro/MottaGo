// src/mock/report.ts
// Mock data untuk halaman Laporan.
// Sprint C: ganti dengan reportService calls.

export interface ReportKpi {
  totalSampahKg: number; // total keseluruhan (= kapasitas saat ini)
  totalPickup: number; // jumlah pickup completed
  rataHarianKg: number; // rata-rata harian kg/hari
  efisiensiPct: number; // persentase pickup vs kapasitas
}

export interface WeeklyChartPoint {
  minggu: string;
  organik: number;
  anorganik: number;
  minyak: number;
}

export const REPORT_KPI: ReportKpi = {
  totalSampahKg: 263, // konsisten dengan UTILITY_TODAY_SUMMARY.kapasitasKg
  totalPickup: 6, // konsisten dengan PICKUP_HISTORY completed count
  rataHarianKg: 38.5, // konsisten dengan CapacitySummaryStats.MOCK
  efisiensiPct: 75,
};

export const WEEKLY_CHART: WeeklyChartPoint[] = [
  { minggu: 'Mg 1', organik: 68, anorganik: 24, minyak: 18 },
  { minggu: 'Mg 2', organik: 72, anorganik: 28, minyak: 22 },
  { minggu: 'Mg 3', organik: 85, anorganik: 35, minyak: 18 },
  { minggu: 'Mg 4', organik: 91, anorganik: 42, minyak: 22 },
];

// Data 7 hari (harian: Sen–Min)
export const CHART_7D: WeeklyChartPoint[] = [
  { minggu: 'Sen', organik: 32, anorganik: 12, minyak: 8 },
  { minggu: 'Sel', organik: 28, anorganik: 15, minyak: 6 },
  { minggu: 'Rab', organik: 45, anorganik: 18, minyak: 10 },
  { minggu: 'Kam', organik: 38, anorganik: 14, minyak: 7 },
  { minggu: 'Jum', organik: 52, anorganik: 22, minyak: 12 },
  { minggu: 'Sab', organik: 41, anorganik: 16, minyak: 9 },
  { minggu: 'Min', organik: 20, anorganik: 8, minyak: 5 },
];

// Data 30 hari = WEEKLY_CHART yang sudah ada (alias, bukan duplikat)
export const CHART_30D = WEEKLY_CHART;

// Data 90 hari (bulanan: 3 bulan terakhir)
export const CHART_90D: WeeklyChartPoint[] = [
  { minggu: 'Bln 1', organik: 280, anorganik: 95, minyak: 70 },
  { minggu: 'Bln 2', organik: 310, anorganik: 108, minyak: 78 },
  { minggu: 'Bln 3', organik: 263, anorganik: 90, minyak: 65 },
];

// KPI 7 hari
export const KPI_7D: ReportKpi = {
  totalSampahKg: 256,
  totalPickup: 3,
  rataHarianKg: 36.6,
  efisiensiPct: 72,
};

// KPI 30 hari = REPORT_KPI yang sudah ada (alias)
export const KPI_30D = REPORT_KPI;

// KPI 90 hari
export const KPI_90D: ReportKpi = {
  totalSampahKg: 1359,
  totalPickup: 18,
  rataHarianKg: 15.1,
  efisiensiPct: 78,
};
