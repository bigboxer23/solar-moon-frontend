import classNames from 'classnames';
import { ReactElement } from 'react';

interface StackedAlertsInfoProps {
  activeAlerts: number;
  resolvedAlerts: number;
  onClick?: () => void;
  className?: string;
}

export default function StackedAlertsInfo({
  activeAlerts,
  resolvedAlerts,
  onClick,
  className,
}: StackedAlertsInfoProps): ReactElement {
  const activeAlertsStyle = classNames('leading-4', {
    'text-red-500': activeAlerts > 0,
    'text-black dark:text-gray-100': activeAlerts === 0,
  });

  const style = classNames(
    'StackedAlertsInfo flex flex-col text-base space-y-1 justify-end text-sm xs:text-base',
    className,
    {
      'cursor-pointer': onClick,
    },
  );

  return (
    <div className={style} onClick={onClick}>
      <div className={activeAlertsStyle}>{activeAlerts} active alerts</div>
      <div className='leading-4 text-gray-400'>
        {resolvedAlerts} resolved alerts
      </div>
    </div>
  );
}
