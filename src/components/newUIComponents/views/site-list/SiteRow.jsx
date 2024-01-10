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
import { getGaugeValue } from '../../../../utils/Utils';
import StatBlock from '../../common/StatBlock';
import WeatherBlock from '../../common/WeatherBlock';

export default function SiteRow({ site }) {
  const [maxPercent, setMaxPercent] = useState(
    getGaugeValue(
      site.siteData.weeklyMaxPower.aggregations['max#max'].value,
      site.siteData.weeklyMaxPower.hits.hits.length > 0
        ? site.siteData.weeklyMaxPower.hits.hits[0].fields[TOTAL_REAL_POWER][0]
        : 0,
    ),
  );

  const degree = Math.round(((maxPercent / 100) * 180 - 45) * 10) / 10;

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
        <div className='relative flex aspect-[2] h-8 items-center justify-center overflow-hidden rounded-t-full bg-brand-primary'>
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
        <span>
          <span className='font-bold'>
            <FormattedNumber
              value={getAggregationValue(
                site.siteData.avgTotal,
                TOTAL_AGGREGATION,
              )}
            />{' '}
            kWH
          </span>{' '}
          generated today
        </span>
        <span>
          <span className='font-bold'>
            <FormattedNumber
              value={getAggregationValue(
                site.siteData.avgTotal,
                AVG_AGGREGATION,
              )}
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
