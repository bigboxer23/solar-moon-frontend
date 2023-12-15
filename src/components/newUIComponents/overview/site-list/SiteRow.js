import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { FormattedNumber } from 'react-intl';

import {
  DAY,
  getAggregationValue,
  parseSearchReturn,
} from '../../../../services/search';
import { splitDayAndNightDataSets } from '../../../../utils/Utils';

export default function SiteRow({ info, graphData, timeIncrement }) {
  const { name, deviceCount, alertCount } = info;
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTotal(getAggregationValue(graphData.totalAvg, 'sum#total'));
    setAverage(getAggregationValue(graphData.totalAvg, 'avg#avg'));
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
    <div className='SiteRow mb-3 flex w-full items-center'>
      <div className='w-[15%] px-2'>{name}</div>
      <div className='w-[15%] px-2 text-end'>{deviceCount}</div>
      <div className='w-[15%] px-2 text-end'>{alertCount}</div>
      <div className='w-[15%] px-2 text-end'>
        <FormattedNumber value={average} />
      </div>
      <div className='w-[15%] px-2 text-end'>
        <FormattedNumber value={total} />
      </div>
      <div className='ml-auto h-[2.5rem] w-1/4 rounded bg-brand-primary-light'>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
