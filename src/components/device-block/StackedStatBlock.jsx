import classNames from 'classnames';
import { FormattedNumber } from 'react-intl';

export default function StackedStatBlock({
  lowerValue,
  upperValue,
  className,
  onClick,
  upperTitle,
  lowerTitle,
  upperUnit,
  lowerUnit,
}) {
  const style = classNames('flex flex-col', className, {
    'cursor-pointer': onClick,
  });

  return (
    <div className={style} onClick={onClick}>
      <div
        className='flex flex-row flex-wrap space-x-1 text-end text-sm text-black dark:text-gray-100
      xs:text-base'
      >
        <div>{upperTitle}</div>
        <div>
          {upperValue && <FormattedNumber value={upperValue} />}
          <span className='text-sm text-gray-400'> {upperUnit}</span>
        </div>
      </div>
      <div className='average-output flex flex-row flex-wrap space-x-1 text-end text-base font-bold text-black dark:text-gray-100 xs:text-lg'>
        <div>{lowerTitle}</div>
        <div>
          {lowerValue && <FormattedNumber value={lowerValue} />}
          <span className='text-sm text-gray-400'> {lowerUnit}</span>
        </div>
      </div>
    </div>
  );
}
