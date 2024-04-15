import Tippy from '@tippyjs/react';
import classNames from 'classnames';
import { useState } from 'react';

import PowerBlock from './PowerBlock';
import PowerIcon from './PowerIcon';

export default function CurrentPowerBlock({
  className,
  max,
  currentPower,
  activeAlert = false,
}) {
  const getPercent = (max, current) => {
    max = max === null ? 0 : max;
    const scale = 100 / max;
    return current === 0 ? current : Math.round(Math.round(scale * current));
  };

  const [percent] = useState(getPercent(max, currentPower));

  return (
    <div
      className={classNames(
        'PowerBlock dark:text-gray-100 flex space-x-2 items-end',
        className,
      )}
    >
      <Tippy
        content={`${percent}% of ${Math.round(max)}kW`}
        delay={500}
        placement='top'
      >
        <div className='h-12 self-end py-1.5'>
          <PowerIcon activeAlert={activeAlert} max={max} percent={percent} />
        </div>
      </Tippy>
      <PowerBlock
        activeAlert={activeAlert}
        power={Math.round(currentPower)}
        title='now'
      />
    </div>
  );
}
