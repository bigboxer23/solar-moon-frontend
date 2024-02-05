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
    'flex flex-col items-start text-base font-bold text-lg',
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
