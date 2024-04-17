import { Line } from 'react-chartjs-2';

import { getFormattedTime } from '../../utils/Utils';
import { tooltipPlugin } from '../common/graphPlugins';

export default function MiniChart({ graphData }) {
  const data = {
    datasets: [
      {
        data: graphData,
        borderColor: '#5178C2',
        borderWidth: 3,
      },
    ],
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
        radius: 1,
      },
    },
    parsing: {
      xAxisKey: 'date',
      yAxisKey: 'values',
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
            const [{ dataIndex, datasetIndex }] = context;
            const { date } = data.datasets[datasetIndex].data[dataIndex];
            return getFormattedTime(date);
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
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        type: 'time',
        ticks: {
          display: false,
        },
      },
      y: {
        min: 0,
        ticks: {
          color: '#9ca3af',
        },
        title: {
          display: false,
        },
      },
    },
  };

  return (
    <div className='MiniChart h-40 w-full rounded-lg bg-brand-primary-light p-2 dark:bg-gray-900'>
      <Line data={data} options={options} plugins={[tooltipPlugin]} />
    </div>
  );
}
