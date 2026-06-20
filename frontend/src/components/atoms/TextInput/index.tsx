import type { InputHTMLAttributes } from 'react';
import { Icon } from '../Icon';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: string;
  rightIcon?: string;
}

export function TextInput({
  error = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  ...rest
}: TextInputProps) {
  const paddingLeft = leftIcon ? 'pl-10' : 'pl-3';
  const paddingRight = rightIcon ? 'pr-10' : 'pr-3';

  const borderAndFocusClasses = error
    ? 'border-error-border shadow-[0_0_0_3px_rgba(244,67,54,0.10)] focus:border-error-border focus:shadow-[0_0_0_3px_rgba(244,67,54,0.15)]'
    : 'border-mottago-border focus:border-brand-primary focus:shadow-[0_0_0_3px_rgba(31,78,121,0.12)]';

  const inputClassName = [
    'w-full min-h-[44px]',
    'rounded-[var(--radius-md)]',
    'border',
    'text-sm text-text-primary bg-mottago-surface',
    'outline-none transition-colors duration-150',
    `${paddingLeft} py-2.5 ${paddingRight}`,
    'placeholder:text-text-secondary',
    borderAndFocusClasses,
    'disabled:bg-[#F3F4F6] disabled:border-[#E5E7EB] disabled:text-text-disabled disabled:placeholder:text-text-disabled disabled:cursor-not-allowed disabled:pointer-events-none',
    'read-only:bg-mottago-surface-subtle read-only:border-[#E5E7EB] read-only:cursor-default',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="relative w-full flex items-center">
      {leftIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
          <Icon name={leftIcon} size={20} />
        </span>
      )}
      <input
        {...rest}
        disabled={disabled}
        aria-invalid={error || undefined}
        className={inputClassName}
      />
      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
          <Icon name={rightIcon} size={20} />
        </span>
      )}
    </div>
  );
}
