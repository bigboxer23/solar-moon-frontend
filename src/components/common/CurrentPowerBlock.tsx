import Tippy from '@tippyjs/react';
import classNames from 'classnames';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import PowerBlock from './PowerBlock';
import PowerIcon from './PowerIcon';

interface CurrentPowerBlockProps {
  className?: string;
  max: number | null;
  currentPower: number;
  activeAlert?: boolean;
}

export default function CurrentPowerBlock({
  className,
  max,
  currentPower,
  activeAlert = false,
}: CurrentPowerBlockProps): ReactElement {
  const intl = useIntl();
  const getPercent = (max: number | null, current: number): number => {
    const normalizedMax = max === null ? 0 : max;
    const scale = 100 / normalizedMax;
    return current === 0 ? current : Math.round(Math.round(scale * current));
  };

  const [percent] = useState(getPercent(max, currentPower));

  return (
    <Tippy
      content={`${percent}% of ${intl.formatNumber(Math.round(max ?? 0))} kW`}
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
