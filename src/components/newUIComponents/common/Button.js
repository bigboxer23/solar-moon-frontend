import classNames from 'classnames';

const primaryButtonClass =
  'bg-brand-primary text-sm text-white rounded-full font-bold py-2 tracking-wide px-5 leading-4 transition-all hover:brightness-110';
const secondaryButtonClass =
  'bg-neutral-200 text-sm text-black rounded-full font-bold py-2 px-5 tracking-wide leading-4 transition-all hover:brightness-105';
const outlinePrimaryButtonClass =
  'bg-white text-sm text-brand-primary rounded-full font-bold py-2 px-5 tracking-wide leading-4 border border-brand-primary transition-all hover:brightness-110';
const outlineSecondaryButtonClass =
  'bg-white text-sm text-black rounded-full font-bold  py-2 px-5 tracking-wide leading-4 border border-neutral-300 transition-all hover:border-neutral-500';
const dangerButtonClass =
  'bg-danger text-sm text-white rounded-full font-bold  py-2 px-5 tracking-wide leading-4 border transition-all hover:brightness-110';
const outlineDangerButtonClass =
  'bg-white text-sm text-black rounded-full font-bold  py-2 px-5 tracking-wide leading-4 border border-red-700 text-red-700 transition-all hover:brightness-110';
const textButtonClass = 'font-bold tracking-wide text-sm underline';
const iconButtonClass = 'text-neutral-600 transition-all hover:text-black';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  className,
  disabled = false,
  buttonProps = {},
}) {
  const buttonClass = classNames(`Button-${variant} flex`, className, {
    [primaryButtonClass]: variant === 'primary',
    [secondaryButtonClass]: variant === 'secondary',
    [outlinePrimaryButtonClass]: variant === 'outline-primary',
    [outlineSecondaryButtonClass]: variant === 'outline-secondary',
    [outlineDangerButtonClass]: variant === 'outline-danger',
    [dangerButtonClass]: variant === 'danger',
    [textButtonClass]: variant === 'text',
    [iconButtonClass]: variant === 'icon',
    'opacity-70 cursor-not-allowed': disabled,
  });

  return (
    <button
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
