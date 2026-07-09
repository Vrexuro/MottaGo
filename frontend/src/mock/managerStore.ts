// src/mock/managerStore.ts
// Module-level reactive store — satu sumber kebenaran mutable untuk dashboard manajer.
// Sprint C: ganti implementasi fungsi publik di sini dengan Supabase service calls.

import { PICKUP_HISTORY } from './pickup';

// ── State ─────────────────────────────────────────────────────────────
interface ManagerState {
  kapasitas: {
    currentKg: number;
    maxKg: number;
    lastUpdated: string;
  };
  wasteHariIni: {
    totalKg: number;
    rataHarianKg: number;
  };
  pickup: {
    waiting: number;
    inTransit: number;
    completedToday: number;
  };
  kategori: {
    organik: number;
    anorganik: number;
    minyak: number;
  };
  pickupAktif: number; // untuk KPI "Pickup Bulan Ini"
  pickupBulanIni: number;
}

// ── Initial values (derived from existing mock files where possible) ──
const _initial: ManagerState = {
  kapasitas: { currentKg: 263, maxKg: 400, lastUpdated: '09:24:37' },
  wasteHariIni: { totalKg: 47.3, rataHarianKg: 38.5 },
  pickup: {
    waiting: 2,
    inTransit: 1,
    completedToday: PICKUP_HISTORY.filter((p) => p.status === 'completed').length,
  },
  kategori: { organik: 120, anorganik: 79, minyak: 64 }, // total: 263 (consistent with currentKg)
  pickupAktif: 3, // waiting + inTransit
  pickupBulanIni: 24,
};

// ── Module-level state ────────────────────────────────────────────────
let _state: ManagerState = { ..._initial };
const _listeners = new Set<() => void>();

function _notify() {
  _listeners.forEach((fn) => fn());
}

// ── Public API ────────────────────────────────────────────────────────
export function getManagerState(): ManagerState {
  return { ..._state };
}

export function subscribeManager(fn: () => void): () => void {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

// Untuk Sprint C: ganti body fungsi ini dengan Supabase call
export function _resetManagerState() {
  _state = { ..._initial };
  _notify();
}

export function syncFromUtility(deltaKg: number): void {
  _state = {
    ..._state,
    kapasitas: {
      ..._state.kapasitas,
      currentKg: Math.min(
        _state.kapasitas.maxKg,
        Math.round((_state.kapasitas.currentKg + deltaKg) * 10) / 10
      ),
    },
    wasteHariIni: {
      ..._state.wasteHariIni,
      totalKg: Math.round((_state.wasteHariIni.totalKg + deltaKg) * 10) / 10,
    },
  };
  _notify();
}
