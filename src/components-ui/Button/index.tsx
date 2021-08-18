import { css } from '@emotion/react';
import { ReactElement } from 'react';
import { classNames } from '../../functions';

export type ButtonProps = {
  color?: ButtonColor;
  type?: ButtonType;
  children?: ReactElement | string;
  className?: string;
  onClick?: () => void;
};

const BORDERED = {
  primary: 'bg-transparent border border-primary text-white',
  secondary: 'bg-trasnparent border border-secondary text-white',
  danger: 'bg-trasnparent border border-danger text-white',
  warn: 'bg-trasnparent border border-warn text-white',
  dark: 'bg-trasnparent border border-dark text-white',
  info: 'bg-trasnparent border border-info text-white',
  link: 'bg-trasnparent border border-link text-white',
  white: 'bg-trasnparent border border-white text-white',
};

const DEFAULT = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  warn: 'bg-warn text-white',
  danger: 'bg-danger text-white',
  dark: 'bg-dark text-white',
  info: 'bg-info text-white',

  link: 'bg-link text-white',
  white: 'bg-white text-primary',
};

const TYPE = {
  bordered: BORDERED,
  default: DEFAULT,
};

export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'dark'
  | 'link'
  | 'white'
  | 'danger'
  | 'warn'
  | 'info';

export type ButtonType = 'bordered' | 'default';

export function Button({
  color = 'primary',
  type = 'default',
  children,
  className,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={classNames(
        'rounded-xl pt-1 pb-1 pl-3 pr-3 text-xs',
        TYPE[type][color],
        `${className}`,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
