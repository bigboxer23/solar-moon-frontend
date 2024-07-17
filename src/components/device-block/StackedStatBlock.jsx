import Tippy from '@tippyjs/react';
import classNames from 'classnames';
import { FormattedNumber, useIntl } from 'react-intl';

import { roundTwoDigit, TIPPY_DELAY } from '../../utils/Utils';

export default function StackedStatBlock({
  lowerValue,
  upperValue,
  className,
  onClick,
  upperTitle,
  lowerTitle,
  upperUnit,
  lowerUnit,
  upperHover = -1,
  upperHoverUnit = '',
  lowerHover = -1,
  lowerHoverUnit = '',
}) {
  const intl = useIntl();
  const style = classNames('flex flex-col', className, {
    'cursor-pointer': onClick,
  });

  const getInternalContent = (title, value, unit) => {
    return (
      <div className='flex'>
        <div>{title}&nbsp;</div>
        <div>
          {value && <FormattedNumber value={roundTwoDigit(value)} />}
          <span className='text-sm text-gray-400'>&nbsp;{unit}</span>
        </div>
      </div>
    );
  };

  const getContent = (title, value, unit, hover, hoverUnit) => {
    if (hover === -1) {
      return getInternalContent(title, value, unit);
    }
    return (
      <Tippy
        content={`${intl.formatNumber(roundTwoDigit(hover))} ${hoverUnit}`}
        delay={TIPPY_DELAY}
        placement='top'
      >
        {getInternalContent(title, value, unit)}
      </Tippy>
    );
  };

  return (
    <div className={style} onClick={onClick}>
      <div
        className='flex flex-row flex-wrap space-x-1 text-end text-sm text-black dark:text-gray-100
      xs:text-base'
      >
        {getContent(
          upperTitle,
          upperValue,
          upperUnit,
          upperHover,
          upperHoverUnit,
        )}
      </div>
      <div className='average-output flex flex-row flex-wrap space-x-1 text-end text-base font-bold text-black dark:text-gray-100 xs:text-lg'>
        {getContent(
          lowerTitle,
          lowerValue,
          lowerUnit,
          lowerHover,
          lowerHoverUnit,
        )}
      </div>
    </div>
  );
}
