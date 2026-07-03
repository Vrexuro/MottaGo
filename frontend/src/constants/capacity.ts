// Single source of truth untuk threshold kapasitas
// Spec: CLAUDE.md — DL-04 (Normal < 60%, Warning 60–89%, Critical ≥ 90%)

export const CAPACITY_THRESHOLDS = {
  CRITICAL: 90, // >= 90%: Kritis
  WARNING: 60, // >= 60%: Perlu Perhatian / Warning
} as const;

export type CapacityStatus = 'normal' | 'warning' | 'critical';

export function getCapacityStatus(pct: number): CapacityStatus {
  if (pct >= CAPACITY_THRESHOLDS.CRITICAL) return 'critical';
  if (pct >= CAPACITY_THRESHOLDS.WARNING) return 'warning';
  return 'normal';
}

// CSS token mapping untuk status kapasitas
export const CAPACITY_STATUS_TOKENS: Record<CapacityStatus, string> = {
  critical: 'var(--color-capacity-critical)',
  warning: 'var(--color-capacity-warning)',
  normal: 'var(--color-capacity-normal)',
};
