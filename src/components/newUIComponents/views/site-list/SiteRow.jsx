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

  return (
    <NavLink
      className='group flex items-center rounded p-4 transition-all duration-150 hover:bg-neutral-100'
      to={`/sites/${site.id}`}
    >
      <div className='flex w-[20%] flex-col justify-center'>
        <div className='text-base font-bold'>{site.deviceName}</div>
        <div className='text-xs text-neutral-500'>
          {site.city && site.country && `${site.city}, ${site.country}`}
        </div>
      </div>

      <StatBlock
        className='flex w-[15%] items-center'
        title='devices'
        value={site.deviceCount}
      />
      <div className='ml-4 flex w-[35%] flex-col justify-center text-sm'>
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
      {site.siteData?.weather && (
        <WeatherBlock weather={site.siteData?.weather} />
      )}
      <div className='ml-auto flex flex-row items-center justify-center'>
        <FaChevronRight
          className='text-neutral-300 transition-all duration-150 group-hover:text-neutral-600'
          size={20}
        />
      </div>
    </NavLink>
  );
}
