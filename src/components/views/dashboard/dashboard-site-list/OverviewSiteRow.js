import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { FormattedNumber } from 'react-intl';
import { NavLink } from 'react-router-dom';

import {
  AVG_AGGREGATION,
  DAY,
  getAggregationValue,
  parseCurrentPower,
  parseMaxData,
  parseSearchReturn,
  TOTAL_AGGREGATION,
} from '../../../../services/search';
import { splitDayAndNightDataSets } from '../../../../utils/Utils';

export default function OverviewSiteRow({ info, graphData, timeIncrement }) {
  const { name, deviceCount, alertCount, id } = info;
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [max, setMax] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setTotal(getAggregationValue(graphData.total, TOTAL_AGGREGATION));
    setAverage(getAggregationValue(graphData.avg, AVG_AGGREGATION));
    setCurrent(parseCurrentPower(graphData.weeklyMaxPower)); //TODO: use these to display with PowerBlock
    setMax(parseMaxData(graphData.weeklyMaxPower));
    setLoading(false);
  }, [graphData]);

  const timeSeriesData = parseSearchReturn(graphData.timeSeries);
  const [dayData, nightData] = splitDayAndNightDataSets(timeSeriesData);

  const data =
    timeIncrement === DAY
      ? {
          datasets: [
            {
              data: dayData,
              borderColor: '#5178C2',
            },
            {
              data: nightData,
              borderColor: '#9754cb',
            },
          ],
        }
      : {
          datasets: [
            {
              data: timeSeriesData,
              borderColor: '#5178C2',
            },
          ],
        };

  const options = {
    events: [],
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    parsing: {
      xAxisKey: 'date',
      yAxisKey: 'values',
    },
  };

  if (loading) return null;

  return (
    <NavLink
      className='SiteRow mb-3 flex w-full items-center rounded px-2 py-1 text-black transition-all duration-150 ease-in-out hover:bg-brand-primary-light dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600'
      to={`/sites/${id}`}
    >
      <div className='w-[25%] pr-1 sm:w-[15%]'>{name}</div>
      <div className='hidden text-end sm:block sm:w-[15%]'>{deviceCount}</div>
      <div className='hidden px-1 text-end sm:block sm:w-[15%]'>
        {alertCount}
      </div>
      <div className='w-[20%] overflow-hidden text-ellipsis px-1 text-end sm:w-[15%]'>
        <FormattedNumber value={average} />
      </div>
      <div className='w-[25%] overflow-hidden text-ellipsis px-2 text-end sm:w-[15%]'>
        <FormattedNumber value={total} />
      </div>
      <div className='ml-auto h-[2.5rem] w-[30%] rounded bg-brand-primary-light sm:w-1/4 dark:bg-neutral-800'>
        <Line data={data} options={options} />
      </div>
    </NavLink>
  );
}
