// PickupStatus — from StatusPickupCard and PickupSummaryCard mock data
export type PickupStatus = 'waiting' | 'in-transit' | 'completed' | 'cancelled';

// Pickup — shape from PickupSummaryCard.MOCK_PICKUPS; DL-03: one active pickup per store
export interface Pickup {
  id: string; // e.g. 'PU-2406-018' (displayed with '#' prefix in UI)
  storeId: number; // FK → Store.id
  vendorId: number; // FK → Vendor.id
  vendorName: string; // denormalized — rendered directly in PickupSummaryCard
  estimasiKg: number; // estimated weight; mock: '85 kg' stored as number
  status: PickupStatus;
  requestedAt: string; // ISO 8601 — formatted to 'Hari Ini, 09:24' in UI
  completedAt?: string; // ISO 8601 — present only when status === 'completed'
}

// PickupStatusCount — drives StatusPickupCard display (waiting:2, inTransit:1, completedToday:5)
export interface PickupStatusCount {
  waiting: number;
  inTransit: number;
  completedToday: number;
}

// CreatePickupDto — SCR-M-04 form payload; DL-03: one active per store; DL-06: default vendor
export interface CreatePickupDto {
  storeId: number;
  vendorId: number;
}
