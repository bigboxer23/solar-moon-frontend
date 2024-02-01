import classNames from 'classnames';
import { FormattedNumber } from 'react-intl';

export default function StackedTotAvg({ total, avg, className }) {
  const style = classNames('StackedTotAvg flex flex-col', className);

  return (
    <div className={style}>
      <div className='flex flex-col space-x-1 text-end text-base text-black sm:flex-row dark:text-neutral-100'>
        <div>Total:</div>
        <div>
          <FormattedNumber value={total} /> kWH
        </div>
      </div>
      <div className='average-output flex flex-col space-x-1 text-end text-xl font-bold text-black sm:flex-row dark:text-neutral-100'>
        <div>Average:</div>
        <div>
          <FormattedNumber value={avg} /> kW
        </div>
      </div>
    </div>
  );
}
