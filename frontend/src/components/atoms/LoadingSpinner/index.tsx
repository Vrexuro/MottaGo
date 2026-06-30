interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  'aria-label'?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
} as const;

export function LoadingSpinner({
  size = 'md',
  color = 'currentColor',
  className,
  'aria-label': ariaLabel = 'Memuat...',
}: LoadingSpinnerProps) {
  return (
    <div role="status" aria-label={ariaLabel} className={className} style={{ color }}>
      <div
        className={`${sizeClasses[size]} rounded-full border-current border-t-transparent animate-spin motion-reduce:animate-none`}
      />
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}
