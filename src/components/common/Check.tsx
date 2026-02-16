import type { ReactElement, ReactNode } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { v4 } from 'uuid';

interface StylesResult {
  inputStyle: string;
  inputWrapperStyle: string;
  labelStyle: string;
  errorStyle: string;
}

function buildStyles(
  inputClassName = '',
  wrapperClassName = '',
  labelClassName = '',
  errorClassName = '',
  extendVariantStyles = true,
): StylesResult {
  const { inputStyle, wrapperStyle, labelStyle, errorStyle } = {
    inputStyle: 'outline-hidden switch-checkbox invisible h-0 w-0',
    wrapperStyle: 'flex focus-within:border-brand-primary pb-1 gap-x-4',
    labelStyle: 'text-sm text-gray-700 dark:text-gray-300',
    errorStyle: 'text-sm text-danger mt-1',
  };

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

interface CheckProps {
  id: string;
  inputProps: Record<string, unknown>;
  prefix?: ReactNode;
  suffix?: ReactNode;
  className?: string;
  inputWrapperClassName?: string;
  inputClassName?: string;
  label?: ReactNode;
  labelClassName?: string;
  errorClassName?: string;
  errorMessage?: string;
  extendVariantStyles?: boolean;
  onClick?: () => void;
}

export function Check({
  id,
  inputProps,
  prefix,
  suffix,
  className,
  inputWrapperClassName,
  inputClassName,
  label,
  labelClassName,
  errorClassName,
  errorMessage,
  extendVariantStyles = true,
  onClick = () => {},
}: CheckProps): ReactElement {
  const { inputStyle, inputWrapperStyle, labelStyle, errorStyle } = buildStyles(
    inputClassName,
    inputWrapperClassName,
    labelClassName,
    errorClassName,
    extendVariantStyles,
  );
  return (
    <>
      <div
        className={`Input ${inputWrapperStyle} ${className}`}
        onClick={onClick}
      >
        {label && <div className={labelStyle}>{label}</div>}
        <input
          checked={!!inputProps.value}
          className={inputStyle}
          id={id}
          type='checkbox'
          {...inputProps}
        />
        <label
          className='switch-label relative flex cursor-pointer content-between items-center'
          htmlFor={id}
        >
          {prefix}
          <span className='switch-button absolute' />
          {suffix}
        </label>
        {errorMessage && <div className={errorStyle}>{errorMessage}</div>}
      </div>
    </>
  );
}

interface ControlledCheckProps<TFieldValues extends FieldValues> extends Omit<
  CheckProps,
  'id' | 'inputProps'
> {
  id?: string;
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  inputProps?: Record<string, unknown>;
}

export function ControlledCheck<TFieldValues extends FieldValues>({
  id = v4(),
  control,
  name,
  inputProps,
  prefix: _prefix,
  suffix: _suffix,
  ...rest
}: ControlledCheckProps<TFieldValues>): ReactElement {
  const { field } = useController({ control, name });

  return <Check id={id} inputProps={{ ...inputProps, ...field }} {...rest} />;
}
