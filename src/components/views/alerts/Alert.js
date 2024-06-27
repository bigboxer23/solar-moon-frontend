import Tippy from '@tippyjs/react';
import classNames from 'classnames';
import { formatDistance } from 'date-fns';
import { NavLink } from 'react-router-dom';

import { HOUR } from '../../../services/search';
import {
  formatMessage,
  getFormattedDaysHoursMinutes,
  getFormattedTime,
  TIPPY_DELAY,
} from '../../../utils/Utils';

export default function Alert({ alert, active }) {
  const timeSinceAlert = formatDistance(alert.startDate, new Date(), {
    addSuffix: true,
  });
  const timeSinceResolved = formatDistance(alert.endDate, new Date(), {
    addSuffix: true,
  });
  const alertClass = classNames(
    'Alert flex w-full justify-between text-black dark:text-gray-100 bg-[#f5f5f5] p-4 rounded-md overflow-hidden flex-col-reverse sm:flex-row',
    {
      'bg-danger text-white dark:bg-danger': active,
    },
    {
      'dark:bg-gray-700': !active,
    },
  );

  const reportTimeLink =
    alert.state === 1
      ? ''
      : `&start=${alert.startDate - 3 * HOUR}&end=${alert.endDate + HOUR}`;
  return (
    <NavLink
      className={alertClass}
      to={`/reports?deviceId=${alert.deviceId}${reportTimeLink}`}
    >
      <div className='flex flex-col space-y-1'>
        <div className='flex flex-col space-y-1 sm:flex-row sm:space-y-0'>
          <div className='mr-3 text-sm'>
            <span className='mr-1.5 font-bold'>Device:</span>
            {alert.deviceName ? alert.deviceName : alert.deviceId}
          </div>
          {alert.deviceSite && (
            <div className='mr-3 text-sm'>
              <span className='mr-1.5 font-bold'>Site:</span>
              {alert.deviceSite}
            </div>
          )}
        </div>
        <div className='mr-3 text-sm'>
          <span className='mr-1.5 font-bold'>Message:</span>{' '}
          {formatMessage(alert.message)}
        </div>
      </div>
      <div className='mb-1 flex flex-row justify-between space-x-1 text-xs italic sm:mb-0 sm:flex-col sm:items-end'>
        {alert.state === 1 && (
          <Tippy
            content={`Starting at ${getFormattedTime(alert.startDate)}`}
            delay={TIPPY_DELAY}
            placement='top'
          >
            <div>{timeSinceAlert}</div>
          </Tippy>
        )}
        {alert.state === 0 && (
          <>
            <Tippy
              content={`Ending at ${getFormattedTime(alert.endDate)}`}
              delay={TIPPY_DELAY}
              placement='top'
            >
              <div> Resolved {timeSinceResolved}</div>
            </Tippy>
            <Tippy
              content={`${getFormattedTime(alert.startDate)} to ${getFormattedTime(
                alert.endDate,
              )}`}
              delay={TIPPY_DELAY}
              placement='top'
            >
              <div>
                Duration{' '}
                {getFormattedDaysHoursMinutes(alert.endDate - alert.startDate)}
              </div>
            </Tippy>
          </>
        )}
      </div>
    </NavLink>
  );
}
