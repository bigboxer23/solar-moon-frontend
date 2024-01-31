import classNames from 'classnames';

export default function PowerIcon({ percent, max }) {
  const getColor = (percent) => {
    if (percent < 15) return 'bg-red-500';
    if (percent > 95) return 'bg-green-500';
    return 'bg-black dark:bg-neutral-100';
  };

  return (
    <div className='PowerIcon flex h-[36px] w-[10px] items-end rounded-sm border-2 border-black dark:border-neutral-100'>
      <div
        className={classNames('w-full', getColor(percent))}
        style={{ height: Math.min(100, percent) + '%' }}
      ></div>
    </div>
  );
}
