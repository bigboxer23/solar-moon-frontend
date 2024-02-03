import classNames from 'classnames';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function DeviceBlock({
  title,
  subtitle,
  statBlocks = [],
  expandableBody,
  body,
  className,
}) {
  const [expandedDevice, setExpandedDevice] = useState(false);

  const style = classNames(
    'DeviceBlock rounded-lg p-4 sm:p-6 bg-neutral-50 dark:bg-neutral-600 h-fit',
    className,
  );

  const expandableGraph = classNames(
    'transition-all duration-300 ease-in-out overflow-hidden',
    {
      'h-0': !expandedDevice,
      'h-40': expandedDevice,
    },
  );

  return (
    <button
      className={style}
      onClick={() => setExpandedDevice(!expandedDevice)}
    >
      <span className='flex items-center text-base font-bold text-black dark:text-neutral-100'>
        {title}
        <div className='ml-2 text-xs text-text-secondary'>{subtitle}</div>
        {expandableBody && (
          <div className='ml-auto'>
            {expandedDevice ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        )}
      </span>
      <div className='my-2 grid grid-cols-2 gap-1 sm:gap-2'>
        {statBlocks.map((block, i) => block)}
      </div>
      {body && <div>{body}</div>}
      {expandableBody && (
        <div className={expandableGraph}>{expandableBody}</div>
      )}
    </button>
  );
}