import classNames from 'classnames';

import { truncate } from '../../utils/Utils';

export default function DeviceBlock({
  title,
  secondaryTitle,
  subtitle,
  statBlocks = [],
  body,
  className,
  truncationLength = 50,
}) {
  const truncatedTitle = truncate(title, truncationLength);
  const truncatedSubtitle = truncate(subtitle, truncationLength);
  const hoverTitle = title.length === truncatedTitle.length ? '' : title;
  const hoverSubtitle =
    subtitle.length === truncatedSubtitle.length ? '' : subtitle;
  const style = classNames(
    'DeviceBlock rounded-lg p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 h-fit',
    className,
  );

  return (
    <div className={style}>
      <span className='flex items-center text-base font-bold text-black dark:text-gray-100'>
        <div title={hoverTitle}>{truncatedTitle}</div>
        <div className='ml-2 text-sm text-gray-400' title={hoverSubtitle}>
          {truncatedSubtitle}
        </div>
      </span>
      {secondaryTitle && (
        <div className='flex text-xs text-gray-400'>{secondaryTitle}</div>
      )}
      <div className='my-2 grid grid-cols-2 gap-1 sm:gap-2'>
        {statBlocks.map((block, i) => block)}
      </div>
      {body && <div>{body}</div>}
    </div>
  );
}
