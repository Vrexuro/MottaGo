export type CapacityStatus = 'normal' | 'warning' | 'critical';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
