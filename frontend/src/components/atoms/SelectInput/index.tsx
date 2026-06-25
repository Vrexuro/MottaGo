import type { SelectHTMLAttributes } from 'react';
import type { SelectOption } from '../../../types/common.types';
import { Icon } from '../Icon';

interface SelectInputProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  error?: boolean;
  placeholder?: string;
}

export function SelectInput({
  options,
  error = false,
  placeholder,
  disabled,
  className,
  ...rest
}: SelectInputProps) {
  const borderAndFocusClasses = error
    ? 'border-error-border shadow-[0_0_0_3px_rgba(244,67,54,0.10)] focus:border-error-border focus:shadow-[0_0_0_3px_rgba(244,67,54,0.15)]'
    : 'border-mottago-border focus:border-brand-primary focus:shadow-[0_0_0_3px_rgba(31,78,121,0.12)]';

  const selectClassName = [
    'w-full min-h-[44px]',
    'rounded-[var(--radius-md)]',
    'border',
    'text-sm text-text-primary bg-mottago-surface',
    'outline-none transition-colors duration-150',
    'pl-3 pr-10 py-2.5',
    'appearance-none cursor-pointer',
    borderAndFocusClasses,
    'disabled:bg-[#F3F4F6] disabled:border-[#E5E7EB] disabled:text-text-disabled disabled:cursor-not-allowed disabled:pointer-events-none',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const chevronClassName = [
    'absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none',
    disabled ? 'text-text-disabled' : 'text-text-secondary',
  ].join(' ');

  return (
    <div className="relative w-full">
      <select
        {...rest}
        disabled={disabled}
        aria-invalid={error || undefined}
        className={selectClassName}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={chevronClassName}>
        <Icon name="ChevronDown" size={16} />
      </span>
    </div>
  );
}
