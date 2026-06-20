import type { HTMLAttributes } from 'react';

type DividerOrientation = 'horizontal' | 'vertical';
type DividerVariant = 'solid' | 'dashed' | 'dotted';

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
}

const orientationClasses: Record<DividerOrientation, string> = {
  horizontal: 'w-full h-0 border-0 border-t border-mottago-border m-0',
  vertical: 'h-full w-0 border-0 border-l border-mottago-border m-0 self-stretch',
};

const variantClasses: Record<DividerVariant, string> = {
  solid: '',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
};

export function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  className,
  ...rest
}: DividerProps) {
  const computedClassName = [
    orientationClasses[orientation],
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <hr
      {...rest}
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={computedClassName}
    />
  );
}
