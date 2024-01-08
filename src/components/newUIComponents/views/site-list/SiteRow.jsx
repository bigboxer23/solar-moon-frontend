import { useEffect, useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { FormattedNumber } from 'react-intl';
import { NavLink } from 'react-router-dom';

import {
  AVG_AGGREGATION,
  DAY,
  TOTAL_AGGREGATION,
  TOTAL_REAL_POWER,
} from '../../../../services/search';
import { getTileContent } from '../../../../services/services';
import { getGaugeValue } from '../../../../utils/Utils';
import StatBlock from '../../common/StatBlock';
import WeatherBlock from '../../common/WeatherBlock';

export default function SiteRow({ site }) {
  const [avgOutput, setAvgOutput] = useState(0);
  const [totalOutput, setTotalOutput] = useState(0);
  const [weather, setWeather] = useState('');
  const [temperature, setTemperature] = useState(0);
  const [maxPercent, setMaxPercent] = useState(0);

  useEffect(() => {
    getTileContent(site, DAY).then(({ data }) => {
      console.log('data', data);

      setAvgOutput(data[0].aggregations[AVG_AGGREGATION].value);
      setTotalOutput(data[0].aggregations[TOTAL_AGGREGATION].value);

      setMaxPercent(
        getGaugeValue(
          data[1].aggregations['max#max'].value,
          data[1].hits.hits.length > 0
            ? data[1].hits.hits[0].fields[TOTAL_REAL_POWER][0]
            : 0,
        ),
      );

      setMaxPercent(20);

      // TODO: Can we get UV index?
      setWeather(data[2].hits.hits[0]._source['weatherSummary']);
      setTemperature(data[2].hits.hits[0]._source['temperature'] || -1);

      console.log('avgOutput', avgOutput);
      console.log('totalOutput', totalOutput);
      console.log('weather', weather);
      console.log('temperature', temperature);
    });
  }, []);

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
            <FormattedNumber value={totalOutput} /> kWH
          </span>{' '}
          generated today
        </span>
        <span>
          <span className='font-bold'>
            <FormattedNumber value={avgOutput} /> kWH
          </span>{' '}
          avg. output today
        </span>
      </div>
      {weather && temperature && (
        <WeatherBlock temperature={temperature} weatherSummary={weather} />
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
