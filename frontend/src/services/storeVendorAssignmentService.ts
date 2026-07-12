import { supabase } from '../lib/supabase';
import type { WasteType } from '../types/waste.types';

// Wrapper untuk tabel store_vendor_assignments (dibuat di 0010, DL-06 revised)
// — memetakan (store_id, waste_category) ke SATU vendor_id. PK komposit
// menjamin maksimal satu vendor default per kategori per store.
// Dipakai untuk: (1) Manajer menugaskan vendor per kategori di Vendor
// Management, (2) Utility auto-terisi vendor saat memilih kategori di
// Request Pickup.

export type VendorAssignmentMap = Record<WasteType, number | null>;

interface AssignmentRow {
  waste_category: WasteType;
  vendor_id: number;
}

const CATEGORIES: WasteType[] = ['organik', 'anorganik', 'minyak'];

function emptyMap(): VendorAssignmentMap {
  return { organik: null, anorganik: null, minyak: null };
}

export const storeVendorAssignmentService = {
  // Peta kategori → vendor_id yang ditugaskan untuk store ini. null berarti
  // kategori tsb belum punya vendor default (Utility harus pilih manual).
  getAssignments: async (storeId: number): Promise<VendorAssignmentMap> => {
    const map = emptyMap();
    const { data, error } = await supabase
      .from('store_vendor_assignments')
      .select('waste_category, vendor_id')
      .eq('store_id', storeId);

    if (error || !data) return map;

    for (const row of data as AssignmentRow[]) {
      if (CATEGORIES.includes(row.waste_category)) map[row.waste_category] = row.vendor_id;
    }
    return map;
  },

  // Vendor default untuk SATU kategori — dipakai UtilityRequestPickupPage
  // untuk auto-isi field Vendor begitu kategori dipilih.
  getAssignedVendorId: async (
    storeId: number,
    wasteCategory: WasteType
  ): Promise<number | null> => {
    const { data, error } = await supabase
      .from('store_vendor_assignments')
      .select('vendor_id')
      .eq('store_id', storeId)
      .eq('waste_category', wasteCategory)
      .maybeSingle();

    if (error || !data) return null;
    return (data as { vendor_id: number }).vendor_id;
  },

  // Tetapkan/ganti vendor untuk satu kategori pada store ini. PK (store_id,
  // waste_category) — upsert otomatis menggantikan penugasan lama jika ada
  // (mis. kategori sebelumnya ditugaskan ke vendor lain).
  setAssignment: async (
    storeId: number,
    wasteCategory: WasteType,
    vendorId: number
  ): Promise<boolean> => {
    const { error } = await supabase
      .from('store_vendor_assignments')
      .upsert(
        { store_id: storeId, waste_category: wasteCategory, vendor_id: vendorId },
        { onConflict: 'store_id,waste_category' }
      );
    return !error;
  },

  // Hapus penugasan — kategori kembali "belum ditentukan" untuk store ini.
  clearAssignment: async (storeId: number, wasteCategory: WasteType): Promise<boolean> => {
    const { error } = await supabase
      .from('store_vendor_assignments')
      .delete()
      .eq('store_id', storeId)
      .eq('waste_category', wasteCategory);
    return !error;
  },
};
