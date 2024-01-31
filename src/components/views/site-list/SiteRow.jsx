import { FaChevronRight } from 'react-icons/fa';
import { FormattedNumber } from 'react-intl';
import { NavLink } from 'react-router-dom';

import {
  AVG_AGGREGATION,
  getAggregationValue,
  TOTAL_AGGREGATION,
  TOTAL_REAL_POWER,
} from '../../../services/search';
import PowerBlock from '../../common/PowerBlock';
import StatBlock from '../../common/StatBlock';
import WeatherBlock from '../../common/WeatherBlock';

export default function SiteRow({ site }) {
  return (
    <NavLink
      className='group flex items-center rounded-lg p-0 transition-all duration-150 hover:bg-neutral-100 sm:p-4 dark:bg-neutral-700 hover:dark:bg-neutral-600'
      to={`/sites/${site.id}`}
    >
      <div className='flex w-full flex-col space-y-3'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center space-x-1'>
            <div className='text-base font-bold text-black dark:text-neutral-100'>
              {site.name}
            </div>
            {site?.activeAlertCount > 0 && (
              <NavLink
                className='rounded-full bg-danger px-2 py-0.5 text-xs text-white'
                to='/alerts'
              >
                {site.activeAlertCount} alerts
              </NavLink>
            )}
            <div className='text-xs italic text-text-secondary'>
              {site.city &&
                site.state &&
                `- ${site.city}, ${site.state} ${site.siteData.localTime}`}
            </div>
          </div>
          <div className='ml-auto flex flex-row items-start justify-center pl-4'>
            <FaChevronRight
              className='text-neutral-300 transition-all duration-150 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300'
              size={20}
            />
          </div>
        </div>

        <div className='mr-8 grid w-full grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-4'>
          <StatBlock
            className='text-black dark:text-neutral-100'
            title='devices'
            value={site.deviceCount}
          />
          <div className=''>
            {site.siteData?.weather && (
              <WeatherBlock weather={site.siteData?.weather} />
            )}
          </div>
          <div className='mb-2 flex items-end sm:justify-end'>
            <PowerBlock
              currentPower={
                site.siteData.weeklyMaxPower.hits.hits.length > 0
                  ? site.siteData.weeklyMaxPower.hits.hits[0].fields[
                      TOTAL_REAL_POWER
                    ][0]
                  : 0
              }
              max={site.siteData.weeklyMaxPower.aggregations['max#max'].value}
            />
          </div>
          <div className='ml-4 flex flex-col justify-center text-sm text-black sm:col-span-2 dark:text-neutral-100'>
            <span className='whitespace-nowrap'>
              <span className='font-bold'>
                <FormattedNumber
                  value={getAggregationValue(
                    site.siteData.total,
                    TOTAL_AGGREGATION,
                  )}
                />{' '}
                kWH
              </span>{' '}
              generated today
            </span>
            <span className='whitespace-nowrap'>
              <span className='font-bold'>
                <FormattedNumber
                  value={getAggregationValue(
                    site.siteData.avg,
                    AVG_AGGREGATION,
                  )}
                />{' '}
                kW
              </span>{' '}
              avg. output today
            </span>
          </div>
        </div>
      </div>
    </NavLink>
  );
}
