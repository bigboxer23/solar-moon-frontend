import { useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { FormattedNumber } from 'react-intl';
import { NavLink } from 'react-router-dom';

import {
  AVG_AGGREGATION,
  getAggregationValue,
  TOTAL_AGGREGATION,
  TOTAL_REAL_POWER,
} from '../../../services/search';
import StatBlock from '../../common/StatBlock';
import WeatherBlock from '../../common/WeatherBlock';

export default function SiteRow({ site }) {
  const getGaugeValue = (max, avg) => {
    max = max === null ? 0 : max;
    let scale = 100 / max;
    return avg === 0 ? avg : Math.round(Math.round(scale * avg));
  };

  const [maxPercent, setMaxPercent] = useState(
    getGaugeValue(
      site.siteData.weeklyMaxPower.aggregations['max#max'].value,
      site.siteData.weeklyMaxPower.hits.hits.length > 0
        ? site.siteData.weeklyMaxPower.hits.hits[0].fields[TOTAL_REAL_POWER][0]
        : 0,
    ),
  );

  const degree =
    Math.round(((Math.min(100, maxPercent) / 100) * 180 - 45) * 10) / 10;

  const getGaugeColor = (percent) => {
    if (percent < 15) return 'bg-red-500';
    if (percent < 25) return 'bg-yellow-300';
    if (percent > 110) return 'bg-green-500';
    return 'bg-brand-primary';
  };

  return (
    <NavLink
      className='group flex items-center rounded-lg p-0 transition-all duration-150 hover:bg-neutral-100 sm:p-4'
      to={`/sites/${site.id}`}
    >
      <div className='flex w-full flex-col space-y-4'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center space-x-1'>
            <div className='text-base font-bold'>{site.deviceName}</div>
            <div className='text-xs italic text-neutral-500'>
              {site.city &&
                site.country &&
                site.state &&
                `- ${site.city}, ${site.state}, ${site.country}`}
            </div>
          </div>
          <div className='ml-auto flex flex-row items-start justify-center pl-4'>
            <FaChevronRight
              className='text-neutral-300 transition-all duration-150 group-hover:text-neutral-600'
              size={20}
            />
          </div>
        </div>

        <div className='mr-8 grid w-full grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-4'>
          <StatBlock className='' title='devices' value={site.deviceCount} />
          <div className=''>
            {site.siteData?.weather && (
              <WeatherBlock weather={site.siteData?.weather} />
            )}
          </div>
          <div className='mb-2 flex items-end justify-center'>
            <div
              className={
                'relative flex aspect-[2] h-8 items-center justify-center overflow-hidden rounded-t-full ' +
                getGaugeColor(maxPercent)
              }
            >
              <div
                className='absolute top-0 aspect-square w-full bg-gradient-to-tr from-transparent from-50% to-neutral-300 to-50% transition-transform duration-500'
                style={{ transform: `rotate(${degree}deg)` }}
              ></div>
              <div className='absolute top-1/4 flex aspect-square w-3/4 justify-center rounded-full bg-white transition-all duration-150 group-hover:bg-neutral-100' />
              <div className='absolute bottom-0 w-full truncate text-center text-sm font-bold leading-none'>
                {maxPercent}%
              </div>
            </div>
          </div>
          <div className='col-span-2 ml-4 hidden flex-col justify-center text-sm sm:flex'>
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
