import classNames from 'classnames';
import { FormattedNumber } from 'react-intl';

export default function StackedTotAvg({ total, avg, className }) {
  const style = classNames('StackedTotAvg flex flex-col', className);

  return (
    <div className={style}>
      <div className='flex flex-row space-x-1 text-end text-base text-black dark:text-neutral-100'>
        <div>Total:</div>
        <div>
          <FormattedNumber value={total} /> kWH
        </div>
      </div>
      <div className='average-output flex flex-row space-x-1 text-end text-lg font-bold text-black dark:text-neutral-100'>
        <div>Average:</div>
        <div>
          <FormattedNumber value={avg} /> kW
        </div>
      </div>
    </div>
  );
}
