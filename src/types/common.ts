import type { ReactNode } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-danger'
  | 'danger'
  | 'text'
  | 'icon';

export type InputVariant = 'box' | 'underline';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface DropdownOption<T = string> {
  label: string | ReactNode;
  value: T;
  icon?: ReactNode;
  divider?: boolean;
  disabled?: boolean;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  isDisabled?: boolean;
}

export interface Theme {
  mode: 'light' | 'dark' | 'system';
}

export type TimeIncrement = 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
