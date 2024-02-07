import { useController } from 'react-hook-form';

const boxStylePreset = {
  inputStyle: 'grow outline-none text-black dark:text-neutral-100',
  wrapperStyle:
    'flex flex-col border border-neutral-300 rounded-md focus-within:border-brand-primary py-2 px-4',
  labelStyle: 'text-sm text-neutral-700 dark:text-neutral-300',
  errorStyle: 'text-sm text-danger mt-1',
};

const underlineStylePreset = {
  inputStyle:
    'grow outline-none bg-transparent text-black dark:text-neutral-100',
  wrapperStyle:
    'flex flex-col border-b border-neutral-300 focus-within:border-brand-primary pb-1',
  labelStyle: 'text-sm text-neutral-700 dark:text-neutral-300',
  errorStyle: 'text-sm text-danger mt-1',
};

const presets = {
  box: boxStylePreset,
  underline: underlineStylePreset,
};

function buildStyles(
  variant,
  inputClassName,
  wrapperClassName,
  labelClassName,
  errorClassName,
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
}) {
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
                  <option key={attr} value={attr}>
                    {attr}
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

export function ControlledSelect({
  control,
  name,
  inputProps,
  prefix,
  suffix,
  ...rest
}) {
  const { field } = useController({ control, name });

  return <Select inputProps={{ ...inputProps, ...field }} {...rest} />;
}
