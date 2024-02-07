import classNames from 'classnames';

import PowerIcon from './PowerIcon';

export default function PowerBlock({ className, power, title }) {
  const isMw = power > 1000;
  const unit = isMw ? 'MW' : 'kW';
  const powerValue = isMw ? power / 1000 : power;

  return (
    <div
      className={classNames(
        'PowerBlock dark:text-neutral-100 flex space-x-2 items-end h-full',
        className,
      )}
    >
      <div className='inline-block self-end text-5xl font-bold leading-[3rem]'>
        {Math.round(powerValue * 10) / 10}
      </div>
      <div className='mb-1 flex max-w-[3.3rem] flex-col items-start justify-end text-base font-bold leading-[1.125rem]'>
        <div className='text-text-secondary'>{unit}</div>
        <div>{title}</div>
      </div>
    </div>
  );
}
