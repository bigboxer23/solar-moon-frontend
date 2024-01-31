import classNames from 'classnames';
import { useState } from 'react';

import PowerIcon from './PowerIcon';

export default function PowerBlock({ className, max, currentPower }) {
  const getGaugeValue = (max, avg) => {
    max = max === null ? 0 : max;
    let scale = 100 / max;
    return avg === 0 ? avg : Math.round(Math.round(scale * avg));
  };

  const [percent] = useState(getGaugeValue(max, currentPower));

  return (
    <div
      className={classNames(
        'PowerBlock dark:text-neutral-100 flex space-x-2',
        className,
      )}
    >
      <PowerIcon max={max} percent={percent} />
      <div className='inline-block self-end text-5xl font-bold leading-[3rem]'>
        {Math.round(currentPower)}
      </div>
      <div className='mb-1 inline-block max-w-[3.3rem] self-end text-base font-bold leading-[1.125rem]'>
        <div className='text-text-secondary'>kW</div>
        now
      </div>
    </div>
  );
}
