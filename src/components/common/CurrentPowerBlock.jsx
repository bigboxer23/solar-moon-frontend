import Tippy from '@tippyjs/react';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { roundToDecimals } from '../../utils/Utils';
import { TOTAL_ENERGY_CONS } from '../views/reports/ReportUtils';
import PowerBlock from './PowerBlock';
import PowerIcon from './PowerIcon';

export default function CurrentPowerBlock({
  className,
  max,
  currentPower,
  activeAlert = false,
}) {
  const intl = useIntl();
  const getPercent = (max, current) => {
    max = max === null ? 0 : max;
    const scale = 100 / max;
    return current === 0 ? current : Math.round(Math.round(scale * current));
  };

  const windowSize = useRef([window.innerWidth, window.innerHeight]);
  const [percent] = useState(getPercent(max, currentPower));

  return (
    <Tippy
      content={`${percent}% of ${intl.formatNumber(Math.round(max))} kW`}
      delay={500}
      placement='top-start'
    >
      <div
        className={classNames(
          'PowerBlock dark:text-gray-100 flex space-x-2 items-end',
          className,
        )}
        onTouchStart={(e) => e.preventDefault()}
      >
        <div className='h-12 self-end py-1.5'>
          <PowerIcon activeAlert={activeAlert} max={max} percent={percent} />
        </div>
        <PowerBlock
          activeAlert={activeAlert}
          power={Math.round(currentPower)}
          title='now'
        />
      </div>
    </Tippy>
  );
}
