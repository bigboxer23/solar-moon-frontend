import type { ReactElement, ReactNode } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';

type SelectVariant = 'box' | 'underline';

interface StylePreset {
  inputStyle: string;
  wrapperStyle: string;
  labelStyle: string;
  errorStyle: string;
}

const boxStylePreset: StylePreset = {
  inputStyle: 'grow outline-hidden text-black dark:text-gray-100',
  wrapperStyle:
    'flex flex-col border border-gray-300 rounded-md focus-within:border-brand-primary py-2 px-4',
  labelStyle: 'text-sm text-gray-700 dark:text-gray-300',
  errorStyle: 'text-sm text-danger mt-1',
};

const underlineStylePreset: StylePreset = {
  inputStyle:
    'grow outline-hidden bg-transparent text-black dark:text-gray-100 max-w-full',
  wrapperStyle:
    'flex flex-col border-b border-gray-300 focus-within:border-brand-primary pb-1',
  labelStyle: 'text-sm text-gray-700 dark:text-gray-300',
  errorStyle: 'text-sm text-danger mt-1',
};

const presets: Record<SelectVariant, StylePreset> = {
  box: boxStylePreset,
  underline: underlineStylePreset,
};

interface BuildStylesResult {
  inputStyle: string;
  wrapperStyle: string;
  labelStyle: string;
  errorStyle: string;
}

function buildStyles(
  variant: SelectVariant,
  inputClassName = '',
  wrapperClassName = '',
  labelClassName = '',
  errorClassName = '',
  extendVariantStyles = true,
): BuildStylesResult {
  const { inputStyle, wrapperStyle, labelStyle, errorStyle } = presets[variant];

  if (extendVariantStyles) {
    return {
      inputStyle: `${inputStyle} ${inputClassName}`,
      wrapperStyle: `${wrapperStyle} ${wrapperClassName}`,
      labelStyle: `${labelStyle} ${labelClassName}`,
      errorStyle: `${errorStyle} ${errorClassName}`,
    };
  }

  return {
    inputStyle: inputClassName || inputStyle,
    wrapperStyle: wrapperClassName || wrapperStyle,
    labelStyle: labelClassName || labelStyle,
    errorStyle: errorClassName || errorStyle,
  };
}

export interface SelectOption {
  id: string;
  label: string;
}

export interface SelectProps {
  attributes: SelectOption[];
  inputProps?: Record<string, unknown>;
  prefix?: ReactNode;
  suffix?: ReactNode;
  wrapperClassName?: string;
  inputClassName?: string;
  label?: string;
  labelClassName?: string;
  variant?: SelectVariant;
  errorClassName?: string;
  errorMessage?: string;
  extendVariantStyles?: boolean;
}

export function Select({
  attributes,
  inputProps,
  prefix,
  suffix,
  wrapperClassName,
  inputClassName,
  label,
  labelClassName,
  variant = 'box',
  errorClassName,
  errorMessage,
  extendVariantStyles = true,
}: SelectProps): ReactElement {
  const { inputStyle, wrapperStyle, labelStyle, errorStyle } = buildStyles(
    variant,
    inputClassName,
    wrapperClassName,
    labelClassName,
    errorClassName,
    extendVariantStyles,
  );

  return (
    <>
      <div>
        <label className={`Input ${wrapperStyle}`}>
          {label && <div className={labelStyle}>{label}</div>}
          <div className='flex space-x-2'>
            {prefix}
            <select className={inputStyle} {...inputProps}>
              {attributes.map((attr) => {
                return (
                  <option key={attr.id} value={attr.id}>
                    {attr.label}
                  </option>
                );
              })}
            </select>
            {suffix}
          </div>
        </label>
        {errorMessage && <div className={errorStyle}>{errorMessage}</div>}
      </div>
    </>
  );
}

export interface ControlledSelectProps<
  TFieldValues extends FieldValues,
> extends Omit<SelectProps, 'inputProps'> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  inputProps?: Record<string, unknown>;
}

export function ControlledSelect<TFieldValues extends FieldValues>({
  control,
  name,
  inputProps,
  ...rest
}: ControlledSelectProps<TFieldValues>): ReactElement {
  const { field } = useController({ control, name });

  return <Select inputProps={{ ...inputProps, ...field }} {...rest} />;
}
