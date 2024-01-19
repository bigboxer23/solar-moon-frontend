import classNames from 'classnames';
import { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  MdBarChart,
  MdStackedBarChart,
  MdStackedLineChart,
} from 'react-icons/md';

import { formatXAxisLabels } from '../../../utils/Utils';
import { tooltipPlugin } from '../../common/graphPlugins';

export default function SiteDetailsGraph({ graphData, deviceNames }) {
  const [graphType, setGraphType] = useState('bar');

  const datasets = deviceNames.map((name) => {
    const data = graphData.filter((d) => d.name === name);

    return {
      label: name,
      data: data,
      fill: true,
    };
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
        stacked: graphType !== 'grouped-bar',
        type: 'time',
        ticks: {
          stepSize: 6,
          callback: formatXAxisLabels,
        },
      },
      y: {
        stacked: graphType !== 'grouped-bar',
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

  if (!graphData) {
    return <div className='SiteDetailsGraph h-40 w-full'></div>;
  }

  return (
    <>
      <div className='SiteDetailsGraph group relative mb-6 w-full rounded-lg bg-brand-primary-light p-3'>
        <div className='relative right-2 top-2 mb-4 ml-auto flex w-fit rounded border bg-white duration-150 sm:absolute sm:mb-0 sm:opacity-25 sm:transition-opacity sm:group-hover:opacity-100'>
          <button
            className={classNames('border-r p-2 hover:bg-neutral-200', {
              'bg-neutral-300': graphType === 'grouped-bar',
            })}
            onClick={() => setGraphType('grouped-bar')}
          >
            <MdBarChart className='text-brand-primary-dark text-xl' />
          </button>
          <button
            className={classNames('p-2 hover:bg-neutral-200', {
              'bg-neutral-300': graphType === 'bar',
            })}
            onClick={() => setGraphType('bar')}
          >
            <MdStackedBarChart className='text-brand-primary-dark text-xl' />
          </button>
          <button
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
