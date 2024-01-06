import { Line } from 'react-chartjs-2';

import { tooltipPlugin } from '../../common/graphPlugins';

export default function SiteDetailsGraph({ graphData, deviceNames }) {
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
        displayColors: false,
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
        //display: false,
        type: 'time',
        ticks: {
          stepSize: 6,
        },
      },
      y: {
        stacked: true,
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
    <div className='SiteDetailsGraph mb-6 h-72 w-full rounded-lg bg-brand-primary-light p-3'>
      <Line data={data} options={options} plugins={[tooltipPlugin]} />
    </div>
  );
}
