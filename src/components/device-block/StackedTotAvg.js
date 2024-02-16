import classNames from 'classnames';
import { FormattedNumber } from 'react-intl';

export default function StackedTotAvg({ total, avg, className }) {
  const style = classNames('StackedTotAvg flex flex-col', className);

  return (
    <div className={style}>
      <div
        className='flex flex-row flex-wrap space-x-1 text-end text-sm text-black dark:text-gray-100
      xs:text-base'
      >
        <div>Total:</div>
        <div>
          <FormattedNumber value={total} /> kWH
        </div>
      </div>
      <div className='average-output flex flex-row flex-wrap space-x-1 text-end text-base font-bold text-black dark:text-gray-100 xs:text-lg'>
        <div>Average:</div>
        <div>
          <FormattedNumber value={avg} /> kW
        </div>
      </div>
    </div>
  );
}
