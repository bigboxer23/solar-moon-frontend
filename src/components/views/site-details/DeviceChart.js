import { Line } from 'react-chartjs-2';

import { formatXAxisLabels, getFormattedTime } from '../../../utils/Utils';
import { tooltipPlugin } from '../../common/graphPlugins';

export default function DeviceChart({ graphData }) {
  //console.log('graphData', graphData);

  const data = {
    datasets: [
      {
        data: graphData,
        borderColor: '#5178C2',
        borderWidth: 4,
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
        radius: 2,
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
            const { dataIndex, datasetIndex } = context[0];
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
        type: 'time',
        ticks: {
          stepSize: 6,
          callback: formatXAxisLabels,
        },
      },
      y: {
        stacked: true,
        title: {
          display: false,
        },
      },
    },
  };

  return (
    <div className='DeviceChart h-40 w-full rounded-lg bg-brand-primary-light p-3 dark:bg-neutral-800'>
      <Line data={data} options={options} plugins={[tooltipPlugin]} />
    </div>
  );
}
