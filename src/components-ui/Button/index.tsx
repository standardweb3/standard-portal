import { css } from '@emotion/react';
import { ReactNode } from 'react';
import { ReactElement } from 'react';
import { classNames } from '../../functions';

export type ButtonProps = {
  color?: ButtonColor;
  type?: ButtonType;
  children?: ReactNode | string;
  className?: string;
  disabled?: boolean;
  style?: { [key: string]: any };
  id?: string;
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
  success: 'bg-trasnparent border border-success text-white',
  disabled: 'bg-trasnparent border border-danger text-info',
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
  success: 'bg-success text-white',
  disabled: 'bg-opaque text-info',
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
  | 'info'
  | 'success'
  | 'disabled';

export type ButtonType = 'bordered' | 'default';

export function Button({
  color = 'primary',
  type = 'default',
  children,
  className,
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={classNames(
        'rounded-xl py-1 px-3 text-xs',
        TYPE[type][color],
        className,
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonError({
  error,
  disabled,
  ...rest
}: {
  error?: boolean;
  disabled?: boolean;
} & ButtonProps) {
  if (error) {
    return <Button color="danger" {...rest} />;
  } else {
    return (
      <Button
        color={disabled ? 'disabled' : 'primary'}
        disabled={disabled}
        {...rest}
      />
    );
  }
}

export function ButtonConfirmed({
  confirmed,
  disabled,
  ...rest
}: { confirmed?: boolean; disabled?: boolean } & ButtonProps) {
  if (confirmed) {
    return (
      <Button
        type="bordered"
        color="success"
        className={classNames(
          disabled && 'cursor-not-allowed',
          'border opacity-50',
        )}
        disabled={disabled}
        {...rest}
      />
    );
  } else {
    return (
      <Button
        color={disabled ? 'disabled' : 'success'}
        disabled={disabled}
        {...rest}
      />
    );
  }
}
