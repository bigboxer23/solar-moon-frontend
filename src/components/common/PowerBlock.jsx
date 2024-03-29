import classNames from 'classnames';

import PowerIcon from './PowerIcon';

export default function PowerBlock({ className, power, title, unit = 'W' }) {
  const isMw = power > 1000;
  const isGw = power > 1000000;
  const unitPrefix = isGw ? 'G' : isMw ? 'M' : 'k';
  const powerValue = isGw ? power / 1000000 : isMw ? power / 1000 : power;
  const decimals = isMw ? 100 : 10;
  return (
    <div
      className={classNames(
        'PowerBlock dark:text-gray-100 flex space-x-2 items-end h-full',
        className,
      )}
    >
      <div className='inline-block self-end text-5xl font-bold leading-[3rem]'>
        {Math.round(powerValue * decimals) / decimals}
      </div>
      <div className='mb-1 flex max-w-[3.3rem] flex-col items-start justify-end text-base font-bold leading-[1.125rem]'>
        <div className='text-gray-400'>{unitPrefix + unit}</div>
        <div>{title}</div>
      </div>
    </div>
  );
}
