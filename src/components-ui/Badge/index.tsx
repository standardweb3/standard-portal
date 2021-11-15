import React from 'react';

export type BadgeColor = 'default' | 'primary';
export type BadgeSize = 'default' | 'medium' | 'large';

export interface BadgeProps {
  children?: React.ReactChild | React.ReactChild[];
  color?: BadgeColor;
  size?: BadgeSize;
}

export const COLOR = {
  default: '',
  primary:
    'bg-pink bg-opacity-20 outline-primary rounded-20 text-xs text-primary px-2 py-1',
};

export const SIZE = {
  default: 'text-xs',
  medium: 'text-sm',
  large: 'text-lg',
};

export function Badge({
  color = 'default',
  size = 'default',
  children,
  className = '',
}: BadgeProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div className={`${COLOR[color]} ${SIZE[size]} ${className}`}>
      {children}
    </div>
  );
}
