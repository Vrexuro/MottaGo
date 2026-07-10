// Shared constants untuk waste category display.
// Digunakan di seluruh role Utility dan Manajer.
// Sprint C: validasi bahwa nilai ini konsisten dengan enum database.
import type { WasteType as WasteCategoryDb } from '../types/waste.types';

/** Unit pengukuran per kategori waste */
export const WASTE_UNIT_MAP: Record<WasteCategoryDb, string> = {
  organik: 'kg',
  anorganik: 'kg',
  minyak: 'liter',
};

/** Label display per kategori waste */
export const WASTE_LABEL_MAP: Record<WasteCategoryDb, string> = {
  organik: 'Organik',
  anorganik: 'Anorganik',
  minyak: 'Minyak Jelantah',
};

/** Badge color per kategori waste */
export const WASTE_BADGE_COLOR: Record<WasteCategoryDb, 'success' | 'info' | 'warning'> = {
  organik: 'success',
  anorganik: 'info',
  minyak: 'warning',
};

/**
 * Label display untuk pickup/vendor (identik dengan WASTE_LABEL_MAP,
 * diekspos terpisah agar import lebih eksplisit di halaman Manajer).
 */
export const PICKUP_KATEGORI_LABEL: Record<string, string> = {
  organik: 'Organik',
  anorganik: 'Anorganik',
  minyak: 'Minyak Jelantah',
};

/** Badge color untuk pickup/vendor */
export const PICKUP_KATEGORI_COLOR: Record<string, 'success' | 'info' | 'warning'> = {
  organik: 'success',
  anorganik: 'info',
  minyak: 'warning',
};
