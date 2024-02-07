import classNames from 'classnames';
import moment from 'moment';

import {
  formatMessage,
  getFormattedDaysHoursMinutes,
} from '../../../utils/Utils';

export default function Alert({ alert, active }) {
  const timeSinceAlert = moment(alert.startDate).fromNow();
  const timeSinceResolved = moment(alert.endDate).fromNow();
  const alertClass = classNames(
    'Alert flex w-full justify-between text-black dark:text-gray-100 bg-[#f5f5f5] dark:bg-gray-600 p-4 rounded-md overflow-hidden flex-col-reverse sm:flex-row',
    {
      'bg-[#fee2e2]': active,
    },
  );

  return (
    <div className={alertClass}>
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
      <div className='mb-1 flex flex-row justify-between space-x-1 text-xs italic sm:mb-0 sm:flex-col'>
        {alert.state === 1 && <div>{timeSinceAlert}</div>}
        {alert.state === 0 && (
          <>
            <div> Resolved {timeSinceResolved}</div>
            <div>
              Duration{' '}
              {getFormattedDaysHoursMinutes(alert.endDate - alert.startDate)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
