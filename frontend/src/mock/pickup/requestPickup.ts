import type { SelectOption } from '../../types/common.types';

// Dev only: append ?state=activePickup or ?state=noVendor to URL to preview.
export type PageState = 'normal' | 'activePickup' | 'noVendor';

const getMockState = (): PageState => {
  const raw = new URLSearchParams(window.location.search).get('state');
  if (raw === 'activePickup' || raw === 'noVendor') return raw;
  return 'normal';
};

export const MOCK_STATE: PageState = getMockState();

export const MOCK_ACTIVE_PICKUP_ID = '#PU-2406-018';

export const VENDOR_OPTIONS: SelectOption[] = [
  { value: 'vendor-1', label: 'Bank Sampah Hijau' },
  { value: 'vendor-2', label: 'CV Daur Ulang Mandiri' },
  { value: 'vendor-3', label: 'PT Hijau Bersama' },
];
