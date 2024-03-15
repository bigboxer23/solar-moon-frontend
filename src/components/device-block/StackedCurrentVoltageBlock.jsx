import classNames from 'classnames';

import StackedStatBlock from './StackedStatBlock';

export default function StackedCurrentVoltageBlock({
  current,
  voltage,
  className,
}) {
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
