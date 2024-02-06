import classNames from 'classnames';

export default function StackedStatBlock({
  lowerValue,
  upperValue,
  className,
  onClick,
  upperTitle,
  lowerTitle,
}) {
  const style = classNames(
    'flex flex-col items-start font-bold text-lg text-black dark:text-neutral-100',
    className,
    {
      'cursor-pointer': onClick,
    },
  );

  return (
    <div className={style} onClick={onClick}>
      <div>
        {upperValue} {upperTitle}
      </div>
      <div>
        {lowerValue} {lowerTitle}
      </div>
    </div>
  );
}
