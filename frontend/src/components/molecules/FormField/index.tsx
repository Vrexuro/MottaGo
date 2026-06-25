import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  helpText?: string;
  errorMessage?: string;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  children,
  required = false,
  helpText,
  errorMessage,
  className,
}: FormFieldProps) {
  const containerClassName = ['flex flex-col gap-1.5', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClassName}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-text-primary">
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="ml-0.5 text-error-text">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>

      {children}

      {helpText && !errorMessage && (
        <p id={`${htmlFor}-help`} className="text-xs text-text-secondary">
          {helpText}
        </p>
      )}

      {errorMessage && (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-error-text">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
