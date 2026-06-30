import { supabase } from '../lib/supabase';
import type {
  CreatePickupDto,
  Pickup,
  PickupStatus,
  PickupStatusCount,
} from '../types/pickup.types';

// ── Internal helpers ──────────────────────────────────────────────────────────

interface PickupRow {
  id: string;
  store_id: number;
  vendor_id: number;
  vendor_name: string;
  estimasi_kg: number;
  status: PickupStatus;
  requested_at: string;
  completed_at: string | null;
}

function mapRow(row: PickupRow): Pickup {
  return {
    id: row.id,
    storeId: row.store_id,
    vendorId: row.vendor_id,
    vendorName: row.vendor_name,
    estimasiKg: row.estimasi_kg,
    status: row.status,
    requestedAt: row.requested_at,
    completedAt: row.completed_at ?? undefined,
  };
}

const PICKUP_SELECT =
  'id, store_id, vendor_id, vendor_name, estimasi_kg, status, requested_at, completed_at';

// ── Service ───────────────────────────────────────────────────────────────────

export const pickupService = {
  getActivePickups: async (storeId: number): Promise<Pickup[]> => {
    const { data, error } = await supabase
      .from('pickups')
      .select(PICKUP_SELECT)
      .eq('store_id', storeId)
      .in('status', ['waiting', 'in-transit'])
      .order('requested_at', { ascending: false });

    if (error) return []; // TODO: table not yet created

    return ((data ?? []) as PickupRow[]).map(mapRow);
  },

  getPickupHistory: async (storeId: number): Promise<Pickup[]> => {
    const { data, error } = await supabase
      .from('pickups')
      .select(PICKUP_SELECT)
      .eq('store_id', storeId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(50);

    if (error) return []; // TODO: table not yet created

    return ((data ?? []) as PickupRow[]).map(mapRow);
  },

  createPickup: async (_dto: CreatePickupDto): Promise<Pickup | null> => {
    // TODO: implement once pickups + vendors tables are created.
    // Steps:
    //   1. Validate no active pickup for _dto.storeId (DL-03: one active per store)
    //   2. Fetch vendor name from vendors table for _dto.vendorId
    //   3. Insert: { store_id, vendor_id, vendor_name, status: 'waiting', requested_at }
    //   4. Return mapped Pickup from insert result (.select().single())
    return null;
  },

  cancelPickup: async (pickupId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('pickups')
      .update({ status: 'cancelled' })
      .eq('id', pickupId)
      .eq('status', 'waiting'); // Only cancel pickups still waiting for confirmation

    return !error; // TODO: table not yet created — returns false until schema is ready
  },

  getPickupSummary: async (storeId: number): Promise<PickupStatusCount | null> => {
    const today = new Date().toISOString().split('T')[0];

    const [waitingRes, transitRes, completedRes] = await Promise.all([
      supabase
        .from('pickups')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId)
        .eq('status', 'waiting'),
      supabase
        .from('pickups')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId)
        .eq('status', 'in-transit'),
      supabase
        .from('pickups')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId)
        .eq('status', 'completed')
        .gte('completed_at', `${today}T00:00:00.000Z`),
    ]);

    if (waitingRes.error || transitRes.error || completedRes.error) return null; // TODO: table not yet created

    return {
      waiting: waitingRes.count ?? 0,
      inTransit: transitRes.count ?? 0,
      completedToday: completedRes.count ?? 0,
    };
  },
};
