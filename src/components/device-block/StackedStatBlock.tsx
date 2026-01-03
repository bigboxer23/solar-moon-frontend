import Tippy from '@tippyjs/react';
import classNames from 'classnames';
import { ReactElement } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';

import { roundTwoDigit, TIPPY_DELAY } from '../../utils/Utils';

interface StackedStatBlockProps {
  lowerValue: number | null | undefined;
  upperValue: number | null | undefined;
  className?: string;
  onClick?: () => void;
  upperTitle: string;
  lowerTitle: string;
  upperUnit: string;
  lowerUnit: string;
  upperHover?: number | null;
  upperHoverUnit?: string;
  lowerHover?: number | null;
  lowerHoverUnit?: string;
}

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
}: StackedStatBlockProps): ReactElement {
  const intl = useIntl();
  const style = classNames('flex flex-col', className, {
    'cursor-pointer': onClick,
  });

  const getInternalContent = (
    title: string,
    value: number | null | undefined,
    unit: string,
  ): ReactElement => {
    const roundedValue =
      value !== null && value !== undefined ? roundTwoDigit(value) : null;
    return (
      <div className='flex'>
        <div>{title}&nbsp;</div>
        <div>
          {roundedValue !== null ? (
            <FormattedNumber value={roundedValue} />
          ) : (
            ''
          )}
          <span className='text-sm text-gray-400'>&nbsp;{unit}</span>
        </div>
      </div>
    );
  };

  const getContent = (
    title: string,
    value: number | null | undefined,
    unit: string,
    hover: number | null | undefined,
    hoverUnit: string,
  ): ReactElement => {
    if (hover === -1 || hoverUnit === unit) {
      return getInternalContent(title, value, unit);
    }
    return (
      <Tippy
        content={`${hover !== null && hover !== undefined ? intl.formatNumber(roundTwoDigit(hover)) : ''} ${hoverUnit}`}
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
