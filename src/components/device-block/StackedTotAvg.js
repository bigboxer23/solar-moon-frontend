import classNames from 'classnames';

import { getPowerScalingInformation, roundToDecimals } from '../../utils/Utils';
import StackedStatBlock from './StackedStatBlock';

export default function StackedTotAvg({ total, avg, className }) {
  const style = classNames('StackedTotAvg', className);
  const { unitPrefix, powerValue, decimals } =
    getPowerScalingInformation(total);
  return (
    <StackedStatBlock
      className={style}
      lowerTitle='Average:'
      lowerUnit='kW'
      lowerValue={avg}
      upperHover={total}
      upperHoverUnit='kWh'
      upperTitle='Total:'
      upperUnit={`${unitPrefix}Wh`}
      upperValue={roundToDecimals(powerValue, decimals)}
    />
  );
}
