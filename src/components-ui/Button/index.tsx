import { css } from '@emotion/react';
import { ReactElement } from 'react';
import { classNames } from '../../functions';

export type ButtonProps = {
  color?: ButtonColor;
  type?: ButtonType;
  children: ReactElement | string;
  className: string;
};

const BORDERED = {
  primary: 'bg-transparent outline-primary text-white',
};

const DEFAULT = {
  primary: 'bg-primary text-white',
};

const TYPE = {
  bordered: BORDERED,
  default: DEFAULT,
};

export type ButtonColor = 'primary';

export type ButtonType = 'bordered' | 'default';

export function Button({ color = 'primary', type = 'default', children, className }: ButtonProps) {
  return <button className={classNames('rounded', TYPE[type][color], className)}>{children}</button>;
}
