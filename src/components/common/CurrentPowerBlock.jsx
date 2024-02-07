import classNames from 'classnames';
import { useState } from 'react';

import PowerBlock from './PowerBlock';
import PowerIcon from './PowerIcon';

export default function CurrentPowerBlock({ className, max, currentPower }) {
  const getPercent = (max, current) => {
    max = max === null ? 0 : max;
    let scale = 100 / max;
    return current === 0 ? current : Math.round(Math.round(scale * current));
  };

  const [percent] = useState(getPercent(max, currentPower));

  return (
    <div
      className={classNames(
        'PowerBlock dark:text-gray-100 flex space-x-2 items-end',
        className,
      )}
      title={percent + '% of ' + Math.round(max) + 'kW'}
    >
      <div className='h-[3rem] self-end py-1.5'>
        <PowerIcon max={max} percent={percent} />
      </div>
      <PowerBlock power={Math.round(currentPower)} title='now' />
    </div>
  );
}
