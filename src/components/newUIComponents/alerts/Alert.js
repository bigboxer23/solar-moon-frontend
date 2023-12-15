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
    'Alert flex w-full justify-between bg-[#f5f5f5] p-4 rounded-md',
    {
      'bg-[#fee2e2]': active,
    },
  );

  return (
    <div className={alertClass}>
      <div>
        <div className='flex justify-start'>
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
      <div>
        {alert.state === 1 && (
          <div className='m-0.5 flex justify-end text-xs italic'>
            {timeSinceAlert}
          </div>
        )}
        {alert.state === 0 && (
          <div className='flex-column m-0.5 flex justify-end text-xs italic'>
            <div>Resolved {timeSinceResolved}</div>
            <div>
              Duration{' '}
              {getFormattedDaysHoursMinutes(alert.endDate - alert.startDate)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
