import type { ReactElement, ReactNode } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';

type InputVariant = 'box' | 'underline';

interface StylePreset {
  inputStyle: string;
  wrapperStyle: string;
  labelStyle: string;
  errorStyle: string;
}

const boxStylePreset: StylePreset = {
  inputStyle:
    'appearance-none grow-1 w-full outline-hidden text-black dark:text-gray-100',
  wrapperStyle:
    'flex flex-col border border-gray-300 rounded-md focus-within:border-brand-primary py-2 px-4',
  labelStyle: 'text-sm text-gray-700 dark:text-gray-300',
  errorStyle: 'text-sm text-danger mt-1',
};

const underlineStylePreset: StylePreset = {
  inputStyle:
    'appearance-none grow-1 w-full outline-hidden bg-transparent text-black dark:text-gray-100',
  wrapperStyle:
    'flex flex-col border-b border-gray-300 focus-within:border-brand-primary pb-1',
  labelStyle: 'text-sm text-gray-700 dark:text-gray-300',
  errorStyle: 'text-sm text-danger mt-1',
};

const presets: Record<InputVariant, StylePreset> = {
  box: boxStylePreset,
  underline: underlineStylePreset,
};

interface BuildStylesResult {
  inputStyle: string;
  inputWrapperStyle: string;
  labelStyle: string;
  errorStyle: string;
}

function buildStyles(
  variant: InputVariant,
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
      inputWrapperStyle: `${wrapperStyle} ${wrapperClassName}`,
      labelStyle: `${labelStyle} ${labelClassName}`,
      errorStyle: `${errorStyle} ${errorClassName}`,
    };
  }

  return {
    inputStyle: inputClassName || inputStyle,
    inputWrapperStyle: wrapperClassName || wrapperStyle,
    labelStyle: labelClassName || labelStyle,
    errorStyle: errorClassName || errorStyle,
  };
}

export interface InputProps {
  inputProps?: Record<string, unknown>;
  prefix?: ReactNode;
  suffix?: ReactNode;
  className?: string;
  inputWrapperClassName?: string;
  inputClassName?: string;
  label?: string;
  labelClassName?: string;
  variant?: InputVariant;
  errorClassName?: string;
  errorMessage?: string;
  extendVariantStyles?: boolean;
}

export function Input({
  inputProps,
  prefix,
  suffix,
  className = '',
  inputWrapperClassName,
  inputClassName,
  label,
  labelClassName,
  variant = 'box',
  errorClassName,
  errorMessage,
  extendVariantStyles = true,
}: InputProps): ReactElement {
  const { inputStyle, inputWrapperStyle, labelStyle, errorStyle } = buildStyles(
    variant,
    inputClassName,
    inputWrapperClassName,
    labelClassName,
    errorClassName,
    extendVariantStyles,
  );

  return (
    <>
      <div className={`Input ${className}`}>
        <label className={inputWrapperStyle}>
          {label && <div className={labelStyle}>{label}</div>}
          <div className='flex space-x-2'>
            {prefix}
            <input className={inputStyle} {...inputProps} />
            {suffix}
          </div>
        </label>
        {errorMessage && <div className={errorStyle}>{errorMessage}</div>}
      </div>
    </>
  );
}

export interface ControlledInputProps<
  TFieldValues extends FieldValues,
> extends Omit<InputProps, 'inputProps'> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  inputProps?: Record<string, unknown>;
}

export function ControlledInput<TFieldValues extends FieldValues>({
  control,
  name,
  inputProps,
  ...rest
}: ControlledInputProps<TFieldValues>): ReactElement {
  const { field } = useController({ control, name });

  return <Input inputProps={{ ...inputProps, ...field }} {...rest} />;
}
