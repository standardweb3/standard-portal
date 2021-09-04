import { css } from '@emotion/react';
import { useCallback } from 'react';
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
  primary: 'bg-transparent border border-primary text-text',
  secondary: 'bg-transparent border border-secondary text-text',
  danger: 'bg-transparent border border-danger text-text',
  warn: 'bg-transparent border border-warn text-text',
  dark: 'bg-transparent border border-dark text-text',
  info: 'bg-transparent border border-info text-text',
  link: 'bg-transparent border border-link text-text',
  white: 'bg-transparent border border-white text-text',
  success: 'bg-transparent border border-success text-text',
  disabled: 'bg-transparent border border-info text-info',
  green: 'bg-transparent border border-green text-text',
};

const DEFAULT = {
  primary: 'bg-primary text-text',
  secondary: 'bg-secondary text-text',
  warn: 'bg-warn text-text',
  danger: 'bg-danger text-text',
  dark: 'bg-dark text-text',
  info: 'bg-info text-text',

  link: 'bg-link text-text',
  white: 'bg-white text-primary',
  success: 'bg-success text-text',
  disabled: 'bg-opaque text-info',
  transparent: 'bg-transparent',
  green: 'bg-green text-text',
};

const TYPE = {
  bordered: BORDERED,
  default: DEFAULT,
};

const disabledStyle = 'opacity-50';

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
  | 'transparent'
  | 'green';

export type ButtonType = 'bordered' | 'default';

export function Button({
  color = 'primary',
  type = 'default',
  children,
  className,
  disabled,
  onClick,
  ref,
  ...rest
}: ButtonProps) {
  const handleClick = useCallback(() => {
    if (!disabled) onClick();
  }, [disabled, onClick]);

  return (
    <button
      className={classNames(
        'rounded-20 py-1 px-3 text-xs',
        TYPE[type][color],
        disabled ? disabledStyle : '',
        className,
      )}
      onClick={handleClick}
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
    return <Button color={'primary'} disabled={disabled} {...rest} />;
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
    return <Button color={'success'} disabled={disabled} {...rest} />;
  }
}
