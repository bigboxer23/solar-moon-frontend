import { useController } from 'react-hook-form';

const boxStylePreset = {
  inputStyle: 'appearance-none grow-1 outline-none',
  wrapperStyle:
    'flex flex-col border border-gray-300 rounded-md focus-within:border-brand-primary py-2 px-4',
  labelStyle: 'text-sm text-gray-700',
  errorStyle: 'text-sm text-danger mt-1',
};

const underlineStylePreset = {
  inputStyle: 'appearance-none grow-1 outline-none',
  wrapperStyle:
    'flex flex-col border-b border-gray-300 focus-within:border-brand-primary pb-1',
  labelStyle: 'text-sm text-gray-700',
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

export function Input({
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
}) {
  const { inputStyle, wrapperStyle, labekStyle, errorStyle } = buildStyles(
    variant,
    inputClassName,
    wrapperClassName,
    labelClassName,
    errorClassName,
    extendVariantStyles,
  );

  return (
    <>
      <label className={`Input ${wrapperStyle}`}>
        {label && <div className={labekStyle}>{label}</div>}
        <div className='flex space-x-2'>
          {prefix}
          <input className={inputStyle} {...inputProps} />
          {suffix}
        </div>
      </label>
      {errorMessage && <div className={errorStyle}>{errorMessage}</div>}
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
