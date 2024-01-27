import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
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
  getFormattedTime,
  splitDayAndNightDataSets,
  useStickyState,
} from '../../../utils/Utils';
import { tooltipPlugin } from '../../common/graphPlugins';

export default function OverviewChart({
  timeIncrement,
  startDate,
  endDate,
  overviewData,
  sitesData,
}) {
  const [loading, setLoading] = useState(true);
  const [dayData, setDayData] = useState([]);
  const [nightData, setNightData] = useState([]);
  const [graphType, setGraphType] = useStickyState(
    'overview',
    'overview.graph',
  );

  useEffect(() => {
    if (overviewData == null) {
      return;
    }
    setLoading(false);
    const parsedData = parseAndCondenseStackedTimeSeriesData(overviewData);

    if (timeIncrement === DAY) {
      const [dayData, nightData] = splitDayAndNightDataSets(parsedData);
      setDayData(dayData);
      setNightData(nightData);
    } else {
      setDayData(parsedData);
      setNightData([]);
    }
  }, [overviewData]);

  const overallDataset = {
    datasets: [
      {
        data: dayData,
        borderColor: '#5178C2',
        borderWidth: 4,
      },
      ...(nightData.length > 0
        ? [
            {
              data: nightData,
              borderColor: '#9754cb',
              borderWidth: 4,
            },
          ]
        : []),
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
          callback: timeIncrement === DAY ? null : formatXAxisLabels,
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
            const { dataIndex } = context[0];
            const { date } = overallDataset.datasets[0].data[dataIndex];
            return date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            });
          },
          label: (context) => {
            let label = context.formattedValue || '';
            if (label) {
              label += ' kW';
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
          callback: timeIncrement === DAY ? null : formatXAxisLabels,
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
        //bodyAlign: 'center',
        callbacks: {
          title: (context) => {
            const { dataIndex } = context[0];
            const { date } = overallDataset.datasets[0].data[dataIndex];
            return date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            });
          },
          label: (context) => {
            let label = context.formattedValue || '';
            if (label) {
              label += ' kW';
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
    <div className='OverviewChart mb-6 w-full rounded-lg bg-brand-primary-light p-3'>
      <div className='mb-2 flex items-center justify-between'>
        <div className='text-xs'>
          {getFormattedTime(startDate)} - {getFormattedTime(endDate)}
        </div>
        <div className='flex items-center rounded border bg-white'>
          <button
            aria-label='grouped bar graph'
            className={classNames('border-r px-2 py-1 hover:bg-neutral-200', {
              'bg-neutral-300': graphType === 'overview',
            })}
            onClick={() => setGraphType('overview')}
          >
            <MdShowChart className='text-brand-primary-dark text-xl' />
          </button>
          <button
            aria-label='line graph'
            className={classNames('px-2 py-1 hover:bg-neutral-200', {
              'bg-neutral-300': graphType === 'stacked-line',
            })}
            onClick={() => setGraphType('stacked-line')}
          >
            <MdStackedLineChart className='text-brand-primary-dark text-xl' />
          </button>
          <button
            aria-label='bar graph'
            className={classNames('border-l px-2 py-1 hover:bg-neutral-200', {
              'bg-neutral-300': graphType === 'stacked-bar',
            })}
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
