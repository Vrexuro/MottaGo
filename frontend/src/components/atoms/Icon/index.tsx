import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type IconSize = 16 | 20 | 24 | 32 | 48;

interface IconProps {
  name: string;
  size?: IconSize;
  color?: string;
  className?: string;
  'aria-label'?: string;
}

export function Icon({
  name,
  size = 20,
  color = 'currentColor',
  className,
  'aria-label': ariaLabel,
}: IconProps) {
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as
    | LucideIcon
    | undefined;

  if (!IconComponent) {
    if (import.meta.env.DEV) {
      console.warn(`Icon: unknown icon name "${name}"`);
    }
    return null;
  }

  if (ariaLabel) {
    return (
      <IconComponent
        size={size}
        color={color}
        strokeWidth={1.5}
        className={className}
        role="img"
        aria-label={ariaLabel}
      />
    );
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    />
  );
}
