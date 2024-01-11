import { useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { FormattedNumber } from 'react-intl';
import { NavLink } from 'react-router-dom';

import {
  AVG_AGGREGATION,
  getAggregationValue,
  TOTAL_AGGREGATION,
  TOTAL_REAL_POWER,
} from '../../../../services/search';
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

  const getGaugeColor = (degree) => {
    if (degree < 15) return 'bg-red-500';
    if (degree < 25) return 'bg-yellow-300';
    if (degree > 110) return 'bg-green-500';
    return 'bg-brand-primary';
  };

  return (
    <NavLink
      className='group flex items-center rounded-lg p-4 transition-all duration-150 hover:bg-neutral-100'
      to={`/sites/${site.id}`}
    >
      <div className='flex w-[20%] flex-col justify-center'>
        <div className='text-base font-bold'>{site.deviceName}</div>
        <div className='text-xs text-neutral-500'>
          {site.city && site.country && `${site.city}, ${site.country}`}
        </div>
      </div>

      <StatBlock
        className='flex w-[15%] justify-center'
        title='devices'
        value={site.deviceCount}
      />

      <div className='flex w-[20%] justify-center'>
        {site.siteData?.weather && (
          <WeatherBlock weather={site.siteData?.weather} />
        )}
      </div>
      <div className='flex w-[15%] justify-center'>
        <div
          className={
            'relative flex aspect-[2] h-8 items-center justify-center overflow-hidden rounded-t-full ' +
            getGaugeColor(degree)
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
      <div className='ml-4 flex w-[20%] flex-col justify-center text-sm'>
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
              value={getAggregationValue(site.siteData.avg, AVG_AGGREGATION)}
            />{' '}
            kW
          </span>{' '}
          avg. output today
        </span>
      </div>
      <div className='ml-auto flex flex-row items-center justify-center'>
        <FaChevronRight
          className='text-neutral-300 transition-all duration-150 group-hover:text-neutral-600'
          size={20}
        />
      </div>
    </NavLink>
  );
}
