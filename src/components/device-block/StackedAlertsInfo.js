import classNames from 'classnames';

export default function StackedAlertsInfo({
  activeAlerts,
  resolvedAlerts,
  onClick,
  className,
}) {
  const activeAlertsStyle = classNames('leading-4', {
    'text-red-500': activeAlerts > 0,
    'text-black dark:text-gray-100': activeAlerts === 0,
  });

  const style = classNames(
    'StackedAlertsInfo flex flex-col items-start text-base space-y-1 justify-end text-sm xs:text-base',
    className,
    {
      'cursor-pointer': onClick,
    },
  );

  return (
    <div className={style} onClick={onClick}>
      <div className={activeAlertsStyle}>{activeAlerts} active alerts</div>
      <div classN"me='leading-4 text-gray"400'>
        {resolvedAlerts} resolved alerts
      </div>
    </div>
  );
}
