// src/mock/utilityStore.ts
// Module-level reactive store — satu sumber kebenaran mutable untuk halaman-halaman Utility.
// Sprint C: ganti implementasi fungsi publik di sini dengan wasteService calls.

import { UTILITY_ENTRIES, UTILITY_TODAY_SUMMARY } from './utility';
import type { UtilityEntry, WasteCategoryDb } from './utility';
import { syncFromUtility } from './managerStore';

const MONTH_NAMES = [
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

function formatTanggal(date: Date): string {
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

function formatWaktu(date: Date): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

// ── State internal ────────────────────────────────────────────────────
const _entries: UtilityEntry[] = [...UTILITY_ENTRIES];
let _deltaEntri = 0;
let _deltaKg = 0;
const _listeners = new Set<() => void>();

function _notify() {
  _listeners.forEach((fn) => fn());
}

// ── Public API ────────────────────────────────────────────────────────
export function getEntries(): UtilityEntry[] {
  return [..._entries];
}

export interface TodaySummary {
  totalEntri: number;
  totalKg: number;
  kapasitasKg: number;
  maxKg: number;
  kapasitasPct: number;
  pickupAktif: number;
}

export function getTodaySummary(): TodaySummary {
  return {
    ...UTILITY_TODAY_SUMMARY,
    totalEntri: UTILITY_TODAY_SUMMARY.totalEntri + _deltaEntri,
    totalKg: UTILITY_TODAY_SUMMARY.totalKg + _deltaKg,
    kapasitasKg: UTILITY_TODAY_SUMMARY.kapasitasKg + _deltaKg,
    kapasitasPct: Math.round(
      ((UTILITY_TODAY_SUMMARY.kapasitasKg + _deltaKg) / UTILITY_TODAY_SUMMARY.maxKg) * 100
    ),
    pickupAktif: UTILITY_TODAY_SUMMARY.pickupAktif,
    maxKg: UTILITY_TODAY_SUMMARY.maxKg,
  };
}

export function addEntry(data: {
  kategori: WasteCategoryDb;
  kuantitas: number;
  unit: 'kg' | 'liter';
  dicatatOleh: string;
}): void {
  const now = new Date();
  const entry: UtilityEntry = {
    id: 'e-new-' + Date.now(),
    waktu: formatWaktu(now),
    tanggal: formatTanggal(now),
    kategori: data.kategori,
    kuantitas: data.kuantitas,
    unit: data.unit,
    dicatatOleh: data.dicatatOleh,
  };

  _entries.unshift(entry);
  _deltaEntri += 1;
  if (data.unit === 'kg') {
    _deltaKg += data.kuantitas;
    syncFromUtility(data.kuantitas);
  }

  _notify();
}

export function subscribeUtility(fn: () => void): () => void {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}
