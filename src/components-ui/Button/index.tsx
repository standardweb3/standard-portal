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
  ref?: React.Ref<HTMLButtonElement>;
  onClick?: () => void;
};

const BORDERED = {
  primary: 'bg-transparent border border-primary text-white',
  secondary: 'bg-transparent border border-secondary text-white',
  danger: 'bg-transparent border border-danger text-white',
  warn: 'bg-transparent border border-warn text-white',
  dark: 'bg-transparent border border-dark text-white',
  info: 'bg-transparent border border-info text-white',
  link: 'bg-transparent border border-link text-white',
  white: 'bg-transparent border border-white text-white',
  success: 'bg-transparent border border-success text-white',
  disabled: 'bg-transparent border border-danger text-info',
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
  transprent: 'bg-transparent',
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
  | 'disabled'
  | 'transprent';

export type ButtonType = 'bordered' | 'default';

export function Button({
  color = 'primary',
  type = 'default',
  children,
  className,
  onClick,
  ref,
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
