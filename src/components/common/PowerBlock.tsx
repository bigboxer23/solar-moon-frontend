import classNames from 'classnames';
import type { ReactElement } from 'react';

import { getPowerScalingInformation, roundToDecimals } from '../../utils/Utils';

interface PowerBlockProps {
  className?: string;
  power: number;
  title: string;
  unit?: string;
  activeAlert?: boolean;
}

export default function PowerBlock({
  className,
  power,
  title,
  unit = 'W',
  activeAlert = false,
}: PowerBlockProps): ReactElement {
  const { unitPrefix, powerValue, decimals } =
    getPowerScalingInformation(power);
  return (
    <div
      className={classNames(
        'PowerBlock dark:text-gray-100 flex space-x-2 items-end h-full',
        className,
      )}
    >
      <div
        className={classNames(
          'inline-block self-end text-5xl font-bold leading-[3rem]',
          { 'text-red-500': activeAlert },
        )}
      >
        {roundToDecimals(powerValue, decimals)}
      </div>
      <div className='mb-1 flex max-w-[3.3rem] flex-col items-start justify-end text-base font-bold leading-[1.125rem]'>
        <div className='text-gray-400'>{unitPrefix + unit}</div>
        <div>{title}</div>
      </div>
    </div>
  );
}
