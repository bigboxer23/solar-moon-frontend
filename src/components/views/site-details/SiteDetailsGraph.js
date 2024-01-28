import classNames from 'classnames';
import { Bar, Line } from 'react-chartjs-2';
import {
  MdBarChart,
  MdStackedBarChart,
  MdStackedLineChart,
} from 'react-icons/md';

import { DAY, GROUPED_BAR } from '../../../services/search';
import {
  formatXAxisLabels,
  getFormattedDaysHoursMinutes,
  getFormattedTime,
} from '../../../utils/Utils';
import { tooltipPlugin } from '../../common/graphPlugins';

export default function SiteDetailsGraph({
  graphData,
  deviceNames,
  graphType,
  setGraphType,
  timeIncrement,
  startDate,
  endDate,
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
            const { dataIndex } = context[0];
            const { date } = data.datasets[0].data[dataIndex];
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
          callback: timeIncrement === DAY ? null : formatXAxisLabels,
        },
      },
      y: {
        min: 0,
        stacked: graphType !== GROUPED_BAR,
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
      <div className='SiteDetailsGraph group relative mb-6 w-full rounded-lg bg-brand-primary-light p-3 dark:bg-neutral-800'>
        <div className='flex items-center justify-between'>
          <div className='text-xs text-black dark:text-neutral-100'>
            {getFormattedTime(startDate)} - {getFormattedTime(endDate)}
          </div>
          <div className='flex w-fit rounded border bg-white duration-150 dark:bg-neutral-700'>
            <button
              aria-label='site stacked line graph'
              className={classNames('border-r px-2 py-1 hover:bg-neutral-200', {
                'bg-neutral-300': graphType === GROUPED_BAR,
              })}
              onClick={() => setGraphType(GROUPED_BAR)}
            >
              <MdBarChart className='text-brand-primary-dark text-xl' />
            </button>
            <button
              aria-label='site stacked bar graph'
              className={classNames('px-2 py-1 hover:bg-neutral-200', {
                'bg-neutral-300': graphType === 'bar',
              })}
              onClick={() => setGraphType('bar')}
            >
              <MdStackedBarChart className='text-brand-primary-dark text-xl' />
            </button>
            <button
              aria-label='overview graph'
              className={classNames('border-l px-2 py-1 hover:bg-neutral-200', {
                'bg-neutral-300': graphType === 'line',
              })}
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
