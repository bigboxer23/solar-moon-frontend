import classNames from 'classnames';
import { Line } from 'react-chartjs-2';

import { DAY, parseSearchReturn } from '../../services/search';
import { splitDayAndNightDataSets } from '../../utils/Utils';

export default function MiniGraph({ className, timeIncrement, graphData }) {
  const style = classNames(
    'MiniGraph h-20 py-1.5 w-full rounded bg-brand-primary-light dark:bg-gray-900',
    className,
  );
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

  return (
    <div className={style}>
      <Line data={data} options={options} />
    </div>
  );
}
