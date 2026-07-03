import type { ButtonHTMLAttributes } from 'react';
import { Icon } from '../Icon';
import { LoadingSpinner } from '../LoadingSpinner';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-primary text-white hover:bg-brand-primary-hover active:brightness-90',
  secondary:
    'bg-mottago-surface text-brand-primary border border-mottago-border hover:bg-mottago-surface-subtle hover:border-brand-primary active:brightness-90',
  danger: 'bg-error-action text-white hover:bg-error-action-hover active:brightness-90',
  ghost: 'bg-transparent text-brand-primary hover:bg-mottago-surface-subtle active:brightness-90',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'py-1.5 px-3 text-xs min-h-[44px]',
  md: 'py-2.5 px-5 text-sm min-h-[44px]',
  lg: 'py-3 px-6 text-base min-h-[44px]',
};

const spinnerSizeMap: Record<ButtonSize, 'sm' | 'md' | 'lg'> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const computedClassName = [
    'inline-flex items-center justify-center gap-2',
    'font-semibold',
    'rounded-[var(--radius-md)]',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...rest}
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading || undefined}
      className={computedClassName}
    >
      {loading ? (
        <LoadingSpinner size={spinnerSizeMap[size]} />
      ) : leftIcon ? (
        <Icon name={leftIcon} size={20} />
      ) : null}
      {children}
      {!loading && rightIcon ? <Icon name={rightIcon} size={20} /> : null}
    </button>
  );
}
