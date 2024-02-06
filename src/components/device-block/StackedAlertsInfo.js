import classNames from 'classnames';

export default function StackedAlertsInfo({
  activeAlerts,
  resolvedAlerts,
  onClick,
  className,
}) {
  const activeAlertsStyle =
    activeAlerts > 0 ? 'text-red-500' : 'text-black dark:text-neutral-100';

  const style = classNames('flex flex-col items-start text-base', className, {
    'cursor-pointer': onClick,
  });

  return (
    <div className={style} onClick={onClick}>
      <div className={activeAlertsStyle}>{activeAlerts} active alerts</div>
      <div className='text-text-secondary'>
        {resolvedAlerts} resolved alerts
      </div>
    </div>
  );
}
