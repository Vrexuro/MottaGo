import type { HTMLAttributes } from 'react';

type ProgressBarVariant = 'default' | 'capacity';
type ProgressBarSize = 'sm' | 'md' | 'lg';

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  variant?: ProgressBarVariant;
  size?: ProgressBarSize;
}

const sizeClasses: Record<ProgressBarSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-4',
};

function getCapacityFillColor(value: number): string {
  if (value >= 90) return 'bg-capacity-critical';
  if (value >= 70) return 'bg-capacity-warning';
  return 'bg-capacity-normal';
}

export function ProgressBar({
  value,
  variant = 'default',
  size = 'md',
  className,
  ...rest
}: ProgressBarProps) {
  const safe = Number.isFinite(value) ? value : 0;
  const clampedValue = Math.min(100, Math.max(0, safe));

  const fillColor =
    variant === 'capacity' ? getCapacityFillColor(clampedValue) : 'bg-brand-primary';

  const trackClassName = [
    'w-full rounded-full overflow-hidden bg-mottago-border',
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const fillClassName = [
    'h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none',
    fillColor,
  ].join(' ');

  return (
    <div
      {...rest}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      className={trackClassName}
    >
      <div className={fillClassName} style={{ width: `${clampedValue}%` }} />
    </div>
  );
}
