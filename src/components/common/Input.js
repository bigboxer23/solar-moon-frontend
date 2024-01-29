import { useController } from 'react-hook-form';

const boxStylePreset = {
  inputStyle: 'appearance-none grow-1 w-full outline-none',
  wrapperStyle:
    'flex flex-col border border-neutral-300 rounded-md focus-within:border-brand-primary py-2 px-4',
  labelStyle: 'text-sm text-neutral-700',
  errorStyle: 'text-sm text-danger mt-1',
};

const underlineStylePreset = {
  inputStyle: 'appearance-none grow-1 w-full outline-none bg-transparent',
  wrapperStyle:
    'flex flex-col border-b border-neutral-300 focus-within:border-brand-primary pb-1',
  labelStyle: 'text-sm text-neutral-700',
  errorStyle: 'text-sm text-danger mt-1',
};

const presets = {
  box: boxStylePreset,
  underline: underlineStylePreset,
};

function buildStyles(
  variant,
  inputClassName = '',
  wrapperClassName = '',
  labelClassName = '',
  errorClassName = '',
  extendVariantStyles = true,
) {
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

export function Input({
  inputProps,
  prefix,
  suffix,
  className,
  inputWrapperClassName,
  inputClassName,
  label,
  labelClassName,
  variant = 'box',
  errorClassName,
  errorMessage,
  extendVariantStyles = true,
}) {
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

export function ControlledInput({
  control,
  name,
  inputProps,
  prefix,
  suffix,
  ...rest
}) {
  const { field } = useController({ control, name });

  return <Input inputProps={{ ...inputProps, ...field }} {...rest} />;
}
