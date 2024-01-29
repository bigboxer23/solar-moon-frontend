import { useController } from 'react-hook-form';
import { v4 } from 'uuid';

function buildStyles(
  inputClassName = '',
  wrapperClassName = '',
  labelClassName = '',
  errorClassName = '',
  extendVariantStyles = true,
) {
  const { inputStyle, wrapperStyle, labelStyle, errorStyle } = {
    inputStyle: 'outline-none switch-checkbox invisible h-0 w-0',
    wrapperStyle: 'flex focus-within:border-brand-primary pb-1 space-x-4',
    labelStyle: 'text-sm text-neutral-700',
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
}) {
  const { inputStyle, inputWrapperStyle, labelStyle, errorStyle } = buildStyles(
    inputClassName,
    inputWrapperClassName,
    labelClassName,
    errorClassName,
    extendVariantStyles,
  );
  return (
    <>
      <div className={`Input ${inputWrapperStyle} ${className}`}>
        {label && <div className={labelStyle}>{label}</div>}
        <input
          checked={inputProps.value ? 'checked' : ''}
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

export function ControlledCheck({
  id = v4(),
  control,
  name,
  inputProps,
  prefix,
  suffix,
  ...rest
}) {
  const { field } = useController({ control, name });

  return <Check id={id} inputProps={{ ...inputProps, ...field }} {...rest} />;
}
