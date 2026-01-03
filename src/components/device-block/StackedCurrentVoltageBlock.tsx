import classNames from 'classnames';
import { ReactElement } from 'react';

import StackedStatBlock from './StackedStatBlock';

interface StackedCurrentVoltageBlockProps {
  current: number;
  voltage: number;
  className?: string;
}

export default function StackedCurrentVoltageBlock({
  current,
  voltage,
  className,
}: StackedCurrentVoltageBlockProps): ReactElement {
  const style = classNames('StackedCurrentVoltage', className);

  if (current === 0 || voltage === 0) {
    return <div className='min-h-[52px]' />;
  }
  return (
    <StackedStatBlock
      className={style}
      lowerTitle='Current:'
      lowerUnit='Amps'
      lowerValue={current}
      upperTitle='Voltage:'
      upperUnit='Volts'
      upperValue={voltage}
    />
  );
}
