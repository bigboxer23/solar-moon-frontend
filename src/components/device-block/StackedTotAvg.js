import classNames from 'classnames';
import { FormattedNumber } from 'react-intl';

export default function StackedTotAvg({ total, avg, className }) {
  const style = classNames('StackedTotAvg flex flex-col', className);

  return (
    <div className={style}>
      <div className='flex flex-row flex-wrap space-x-1 text-end text-sm text-black xs:text-base dark:text-gray-100'>
        <div>Total:</div>
        <div>
          <FormattedNumber value={total} /> kWH
        </div>
      </div>
      <div className='average-output flex flex-row flex-wrap space-x-1 text-end text-base font-bold text-black xs:text-lg dark:text-gray-100'>
        <div>Average:</div>
        <div>
          <FormattedNumber value={avg} /> kW
        </div>
      </div>
    </div>
  );
}
