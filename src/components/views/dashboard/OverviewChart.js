import classNames from 'classnames';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  MdNavigateBefore,
  MdNavigateNext,
  MdShowChart,
  MdStackedBarChart,
  MdStackedLineChart,
} from 'react-icons/md';

import {
  DAY,
  parseAndCondenseStackedTimeSeriesData,
  parseSearchReturn,
} from '../../../services/search';
import {
  formatXAxisLabels,
  formatXAxisLabelsDay,
  getFormattedTime,
  maybeSetTimeWindow,
  roundTwoDigit,
  timeLabel,
  useStickyState,
} from '../../../utils/Utils';
import { tooltipPlugin } from '../../common/graphPlugins';

export default function OverviewChart({
  overviewData,
  sitesData,
  timeIncrement,
  setStartDate,
  startDate,
}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [graphType, setGraphType] = useStickyState(
    'overview',
    'overview.graph',
  );
  const [nextDisabled, setNextDisabled] = useState(true);

  useEffect(() => {
    if (overviewData == null) {
      return;
    }
    setLoading(false);
    setData(parseAndCondenseStackedTimeSeriesData(overviewData));
  }, [overviewData]);

  const overallDataset = {
    datasets: [
      {
        data: data,
        borderColor: '#5178C2',
        borderWidth: 4,
      },
    ],
  };

  const sitesDataset = {
    datasets: Object.entries(sitesData).map(([siteName, data]) => {
      return {
        label: siteName,
        data: parseSearchReturn(data.timeSeries),
      };
    }),
  };

  const overallOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        type: 'time',
        ticks: {
          stepSize: 6,
          callback:
            timeIncrement === DAY ? formatXAxisLabelsDay : formatXAxisLabels,
        },
      },
      y: {
        min: 0,
        title: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: 2,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        displayColors: false,
        boxPadding: 8,
        titleAlign: 'center',
        bodyAlign: 'center',
        callbacks: {
          title: (context) => {
            const [{ dataIndex }] = context;
            const { date } = overallDataset.datasets[0].data[dataIndex];
            return getFormattedTime(date);
          },
          label: (context) => {
            let label = context.formattedValue || '';
            if (label) {
              label = `${roundTwoDigit(label)} kW`;
            }
            return label;
          },
        },
      },
    },
    parsing: {
      xAxisKey: 'date',
      yAxisKey: 'values',
    },
  };

  const sitesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        type: 'time',
        stacked: true,
        ticks: {
          stepSize: 6,
          callback:
            timeIncrement === DAY ? formatXAxisLabelsDay : formatXAxisLabels,
        },
      },
      y: {
        min: 0,
        stacked: true,
        title: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: 2,
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        boxPadding: 8,
        titleAlign: 'center',
        callbacks: {
          title: (context) => {
            const [{ dataIndex }] = context;
            const { date } = overallDataset.datasets[0].data[dataIndex];
            return getFormattedTime(date);
          },
          label: (context) => {
            let label = context.formattedValue || '';
            if (label) {
              label = `${roundTwoDigit(label)} kW`;
            }
            return label;
          },
        },
      },
    },
    parsing: {
      xAxisKey: 'date',
      yAxisKey: 'values',
    },
  };

  if (loading) return null;

  return (
    <div className='OverviewChart mb-6 w-full rounded-lg bg-brand-primary-light p-3 dark:bg-gray-900'>
      <div className='mb-2 flex items-center justify-between'>
        <div className='flex w-fit items-center'>
          <div className='mr-1 flex w-fit rounded bg-white dark:bg-gray-700 dark:text-gray-100 sm:me-4'>
            <button
              aria-label='previous time period'
              className='rounded-l px-2 py-1 hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-500 dark:hover:text-gray-100'
              onClick={() =>
                maybeSetTimeWindow(
                  startDate,
                  -timeIncrement,
                  setStartDate,
                  setNextDisabled,
                )
              }
            >
              <MdNavigateBefore className='text-brand-primary-dark text-xl' />
            </button>
            <button
              aria-label='next time period'
              className={classNames(
                ' rounded-r px-2 py-1 hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-500 dark:hover:text-gray-100',
                { 'pointer-events-none opacity-50': nextDisabled },
              )}
              disabled={nextDisabled}
              onClick={() =>
                maybeSetTimeWindow(
                  startDate,
                  timeIncrement,
                  setStartDate,
                  setNextDisabled,
                )
              }
            >
              <MdNavigateNext className='text-brand-primary-dark text-xl' />
            </button>
          </div>
          <div className='text-xs text-black dark:text-gray-100'>
            {timeLabel(startDate, timeIncrement)}
          </div>
        </div>
        <div className='flex items-center rounded bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100'>
          <button
            aria-label='grouped bar graph'
            className={classNames(
              'rounded-l dark:border-gray-600 px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-500 dark:hover:text-gray-100',
              {
                'bg-gray-300 dark:text-black': graphType === 'overview',
              },
            )}
            onClick={() => setGraphType('overview')}
          >
            <MdShowChart className='text-brand-primary-dark text-xl' />
          </button>
          <button
            aria-label='line graph'
            className={classNames(
              'px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-500 dark:hover:text-gray-100',
              {
                'bg-gray-300 dark:text-black': graphType === 'stacked-line',
              },
            )}
            onClick={() => setGraphType('stacked-line')}
          >
            <MdStackedLineChart className='text-brand-primary-dark text-xl' />
          </button>
          <button
            aria-label='bar graph'
            className={classNames(
              'rounded-r dark:border-gray-600 px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-500 dark:hover:text-gray-100',
              {
                'bg-gray-300 dark:text-black': graphType === 'stacked-bar',
              },
            )}
            onClick={() => setGraphType('stacked-bar')}
          >
            <MdStackedBarChart className='text-brand-primary-dark text-xl' />
          </button>
        </div>
      </div>
      <div className='h-64 w-full'>
        {graphType === 'overview' && (
          <Line
            data={overallDataset}
            options={overallOptions}
            plugins={[tooltipPlugin]}
          />
        )}
        {graphType === 'stacked-line' && (
          <Line
            data={sitesDataset}
            options={sitesOptions}
            plugins={[tooltipPlugin]}
          />
        )}
        {graphType === 'stacked-bar' && (
          <Bar
            data={sitesDataset}
            options={sitesOptions}
            plugins={[tooltipPlugin]}
          />
        )}
      </div>
    </div>
  );
}
