import classNames from 'classnames';

export default function PowerIcon({ percent, activeAlert = false }) {
  const getColor = (percent) => {
    if (percent < 15) return 'bg-red-500';
    if (percent > 95) return 'bg-green-500';
    return 'bg-brand-primary';
  };

  const borderClass = classNames(
    'PowerIcon flex h-full w-[10px] items-end rounded-sm border-2',
    {
      'border-red-500': activeAlert,
    },
    {
      'border-black dark:border-gray-100': !activeAlert,
    },
  );
  return (
    <div className={borderClass}>
      <div
        className={classNames('w-full', getColor(percent))}
        style={{ height: `${Math.min(100, percent)}%` }}
      ></div>
    </div>
  );
}
