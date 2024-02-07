import classNames from 'classnames';
import { Bar, Line } from 'react-chartjs-2';
import {
  MdBarChart,
  MdNavigateBefore,
  MdNavigateNext,
  MdStackedBarChart,
  MdStackedLineChart,
} from 'react-icons/md';

import { DAY, GROUPED_BAR } from '../../../services/search';
import {
  formatXAxisLabels,
  getFormattedTime,
  maybeSetTimeWindow,
  timeLabel,
} from '../../../utils/Utils';
import { tooltipPlugin } from '../../common/graphPlugins';

export default function SiteDetailsGraph({
  graphData,
  deviceNames,
  graphType,
  setGraphType,
  timeIncrement,
  setStartDate,
  startDate,
}) {
  const datasets = deviceNames.map((name) => {
    const data = graphData.filter((d) => d.name === name);
    const dataSet = {
      label: name,
      data: data,
      fill: false,
      categoryPercentage: 0.76,
      barThickness: 'flex',
      barPercentage: 1,
    };
    if (graphType === GROUPED_BAR) {
      dataSet.skipNull = true;
      dataSet.clip = { left: 50, top: 0, right: 50, bottom: 0 };
    }
    return dataSet;
  });

  const data = {
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      point: {
        radius: 2,
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#9ca3af',
        },
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        boxPadding: 8,
        titleAlign: 'center',
        bodyAlign: 'center',
        callbacks: {
          title: (context) => {
            const { dataIndex, datasetIndex } = context[0];
            const { date } = data.datasets[datasetIndex].data[dataIndex];
            return getFormattedTime(date);
          },
          label: (context) => {
            const siteLabel = context.dataset.label;
            let label = context.formattedValue || '';
            if (label) {
              label += ' kW';
            }
            return `${siteLabel} ${label}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: graphType !== GROUPED_BAR,
        type: 'time',
        ticks: {
          color: '#9ca3af',
          callback: timeIncrement === DAY ? null : formatXAxisLabels,
        },
      },
      y: {
        color: '#9ca3af',
        min: 0,
        stacked: graphType !== GROUPED_BAR,
        ticks: {
          color: '#9ca3af',
        },
        title: {
          display: false,
        },
      },
    },
    parsing: {
      xAxisKey: 'date',
      yAxisKey: 'avg',
    },
  };
  if (!graphData) {
    return <div className='SiteDetailsGraph h-40 w-full'></div>;
  }

  return (
    <>
      <div className='SiteDetailsGraph group relative mb-6 w-full rounded-lg bg-brand-primary-light p-3 dark:bg-gray-900'>
        <div className='mb-2 flex items-center justify-between'>
          <div className='flex w-fit items-center'>
            <div className='mr-1 flex w-fit rounded bg-white dark:bg-gray-700 dark:text-gray-100'>
              <button
                aria-label='previous time period'
                className='rounded-l px-2 py-1 hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-500 dark:hover:text-gray-100'
                onClick={() =>
                  maybeSetTimeWindow(startDate, -timeIncrement, setStartDate)
                }
              >
                <MdNavigateBefore className='text-brand-primary-dark text-xl' />
              </button>
              <button
                aria-label='next time period'
                className='rounded-r px-2 py-1 hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-500 dark:hover:text-gray-100'
                onClick={() =>
                  maybeSetTimeWindow(startDate, timeIncrement, setStartDate)
                }
              >
                <MdNavigateNext className='text-brand-primary-dark text-xl' />
              </button>
            </div>
            <div className='text-xs text-black dark:text-gray-100'>
              {timeLabel(startDate, timeIncrement)}
            </div>
          </div>
          <div className='flex w-fit rounded bg-white dark:bg-gray-700 dark:text-gray-100'>
            <button
              aria-label='site stacked line graph'
              className={classNames(
                'rounded-l dark:border-gray-600 px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-500 dark:hover:text-gray-100',
                {
                  'bg-gray-300 dark:text-black': graphType === GROUPED_BAR,
                },
              )}
              onClick={() => setGraphType(GROUPED_BAR)}
            >
              <MdBarChart className='text-brand-primary-dark text-xl' />
            </button>
            <button
              aria-label='site stacked bar graph'
              className={classNames(
                'px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-500 dark:hover:text-gray-100',
                {
                  'bg-gray-300 dark:text-black': graphType === 'bar',
                },
              )}
              onClick={() => setGraphType('bar')}
            >
              <MdStackedBarChart className='text-brand-primary-dark text-xl' />
            </button>
            <button
              aria-label='overview graph'
              className={classNames(
                'rounded-r dark:border-gray-600 px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-500 dark:hover:text-gray-100',
                {
                  'bg-gray-300 dark:text-black': graphType === 'line',
                },
              )}
              onClick={() => setGraphType('line')}
            >
              <MdStackedLineChart className='text-brand-primary-dark text-xl' />
            </button>
          </div>
        </div>
        <div className='h-72'>
          {graphType === 'line' && (
            <Line data={data} options={options} plugins={[tooltipPlugin]} />
          )}
          {graphType !== 'line' && (
            <Bar data={data} options={options} plugins={[tooltipPlugin]} />
          )}
        </div>
      </div>
    </>
  );
}
