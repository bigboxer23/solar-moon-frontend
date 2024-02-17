import classNames from 'classnames';

import StackedStatBlock from './StackedStatBlock';

export default function StackedTotAvg({ total, avg, className }) {
  const style = classNames('StackedTotAvg', className);

  return (
    <StackedStatBlock
      className={style}
      lowerTitle='Average:'
      lowerUnit='kW'
      lowerValue={avg}
      upperTitle='Total:'
      upperUnit='kWh'
      upperValue={total}
    />
  );
}
