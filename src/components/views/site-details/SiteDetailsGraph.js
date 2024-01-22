import classNames from 'classnames';
import { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  MdBarChart,
  MdStackedBarChart,
  MdStackedLineChart,
} from 'react-icons/md';

import { DAY, GROUPED_BAR } from '../../../services/search';
import { formatXAxisLabels } from '../../../utils/Utils';
import { tooltipPlugin } from '../../common/graphPlugins';

export default function SiteDetailsGraph({
  graphData,
  deviceNames,
  graphType,
  setGraphType,
  timeIncrement,
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
            const date2 = new Date(date);
            return date2.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            });
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
          stepSize: 6,
          callback: timeIncrement === DAY ? null : formatXAxisLabels,
        },
      },
      y: {
        min: 0,
        stacked: graphType !== GROUPED_BAR,
        title: {
          display: true,
          text: 'kW',
        },
      },
    },
    parsing: {
      xAxisKey: 'date',
      yAxisKey: 'avg',
    },
  };
  /*if (graphType === GROUPED_BAR) {
    options.layout = {
      padding: {
        left: 0,
        right: 25,
        top: 0,
        bottom: 0,
      },
    };
  }*/

  if (!graphData) {
    return <div className='SiteDetailsGraph h-40 w-full'></div>;
  }

  return (
    <>
      <div className='SiteDetailsGraph group relative mb-6 w-full rounded-lg bg-brand-primary-light p-3'>
        <div className='relative right-2 top-2 mb-4 ml-auto flex w-fit rounded border bg-white duration-150 sm:absolute sm:mb-0 sm:opacity-25 sm:transition-opacity sm:group-hover:opacity-100'>
          <button
            aria-label='grouped bar graph'
            className={classNames('border-r p-2 hover:bg-neutral-200', {
              'bg-neutral-300': graphType === GROUPED_BAR,
            })}
            onClick={() => setGraphType(GROUPED_BAR)}
          >
            <MdBarChart className='text-brand-primary-dark text-xl' />
          </button>
          <button
            aria-label='bar graph'
            className={classNames('p-2 hover:bg-neutral-200', {
              'bg-neutral-300': graphType === 'bar',
            })}
            onClick={() => setGraphType('bar')}
          >
            <MdStackedBarChart className='text-brand-primary-dark text-xl' />
          </button>
          <button
            aria-label='line graph'
            className={classNames('border-l p-2 hover:bg-neutral-200', {
              'bg-neutral-300': graphType === 'line',
            })}
            onClick={() => setGraphType('line')}
          >
            <MdStackedLineChart className='text-brand-primary-dark text-xl' />
          </button>
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
