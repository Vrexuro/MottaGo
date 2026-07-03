import type { InputHTMLAttributes } from 'react';

// placeholder on type="date" is not rendered by Chrome/Edge; Safari shows format hint only.
// Use aria-label or FormField label to communicate expected input format to users.

interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

export function DateInput({ error = false, disabled, className, ...rest }: DateInputProps) {
  const borderAndFocusClasses = error
    ? 'border-error-border shadow-[0_0_0_3px_rgba(244,67,54,0.10)] focus:border-error-border focus:shadow-[0_0_0_3px_rgba(244,67,54,0.15)]'
    : 'border-mottago-border focus:border-brand-primary focus:shadow-[0_0_0_3px_rgba(31,78,121,0.12)]';

  const inputClassName = [
    'w-full min-h-[44px]',
    'rounded-[var(--radius-md)]',
    'border',
    'text-sm text-text-primary bg-mottago-surface',
    'outline-none transition-colors duration-150',
    'px-3 py-2.5',
    borderAndFocusClasses,
    'disabled:bg-input-disabled-bg disabled:border-input-disabled-border disabled:text-text-disabled disabled:cursor-not-allowed disabled:pointer-events-none',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <input
      {...rest}
      type="date"
      disabled={disabled}
      aria-invalid={error || undefined}
      className={inputClassName}
    />
  );
}
