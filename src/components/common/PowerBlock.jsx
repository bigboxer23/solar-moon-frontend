import classNames from 'classnames';
import { useState } from 'react';

import PowerIcon from './PowerIcon';

export default function PowerBlock({ className, max, currentPower }) {
  const getPercent = (max, current) => {
    max = max === null ? 0 : max;
    let scale = 100 / max;
    return current === 0 ? current : Math.round(Math.round(scale * current));
  };

  const [percent] = useState(getPercent(max, currentPower));

  return (
    <div
      className={classNames(
        'PowerBlock dark:text-neutral-100 flex space-x-2 items-center',
        className,
      )}
      title={percent + '% of ' + Math.round(max) + 'kW'}
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