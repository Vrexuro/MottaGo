import type { HTMLAttributes, ReactNode } from 'react';

type BadgeColor = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  size?: BadgeSize;
  children: ReactNode;
}

const colorClasses: Record<BadgeColor, string> = {
  success: 'bg-accent-success-bg text-accent-success-text',
  warning: 'bg-warning-bg text-warning-text',
  danger: 'bg-error-bg text-error-text',
  info: 'bg-info-bg text-info-text',
  neutral: 'bg-mottago-surface-subtle text-text-secondary',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[11px] font-medium',
  md: 'px-2 py-0.5 text-xs font-medium',
  lg: 'px-3 py-1 text-sm font-medium',
};

export function Badge({
  color = 'neutral',
  size = 'md',
  children,
  className,
  ...rest
}: BadgeProps) {
  const computedClassName = [
    'inline-flex items-center gap-1',
    'rounded-[var(--radius-sm)]',
    colorClasses[color],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span {...rest} className={computedClassName}>
      {children}
    </span>
  );
}
