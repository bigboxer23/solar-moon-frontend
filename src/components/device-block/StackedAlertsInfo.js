export default function StackedAlertsInfo({ activeAlerts, resolvedAlerts }) {
  const activeAlertsStyle =
    activeAlerts > 0 ? 'text-red-500' : 'text-text-secondary';

  return (
    <div className='flex flex-col items-start text-base'>
      <div className={activeAlertsStyle}>{activeAlerts} active alerts</div>
      <div className='text-text-secondary'>
        {resolvedAlerts} resolved alerts
      </div>
    </div>
  );
}
