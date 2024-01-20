import { Chart } from 'chart.js';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { DAY, GROUPED_BAR, parseSearchReturn } from '../../../services/search';
import {
  formatXAxisLabels,
  splitDayAndNightDataSets,
} from '../../../utils/Utils';
import { tooltipPlugin } from '../../common/graphPlugins';

export default function OverviewChart({ timeIncrement, siteData }) {
  const [loading, setLoading] = useState(true);
  const [dayData, setDayData] = useState([]);
  const [nightData, setNightData] = useState([]);

  useEffect(() => {
    if (siteData == null) {
      return;
    }
    setLoading(false);
    const parsedData = parseSearchReturn(siteData);
    if (timeIncrement === DAY) {
      const [dayData, nightData] = splitDayAndNightDataSets(parsedData);
      setDayData(dayData);
      setNightData(nightData);
    } else {
      setDayData(parsedData);
      setNightData([]);
    }
  }, [siteData]);

  const data = {
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        //stacked: graphType !== GROUPED_BAR,
        type: 'time',
        ticks: {
          stepSize: 6,
          callback: timeIncrement === DAY ? null : formatXAxisLabels,
        },
      },
      y: {
        min: 0,
        //stacked: graphType !== GROUPED_BAR,
        title: {
          display: true,
          text: 'kW',
        },
      },
    },
    // scales: {
    //   x: {
    //     type: 'time',
    //     ticks: {
    //       stepSize: 6,
    //       callback: formatXAxisLabels,
    //     },
    //     grid: {
    //       display: false,
    //     },
    //     border: {
    //       display: false,
    //     },
    //   },
    //   y: {
    //     axis: 'y',
    //     grid: {
    //       display: false,
    //     },
    //     position: { y: 75 },
    //     padding: 5,
    //     z: 10,
    //     ticks: {
    //       clip: false,
    //       labelOffset: 10,
    //       z: 10,
    //       display: true,
    //       callback: function (value, index, ticks) {
    //         return index === ticks.length - 1 ? value + ' kW Max' : '';
    //       },
    //     },
    //     border: {
    //       display: false,
    //     },
    //   },
    // },
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
            const { date } = data.datasets[0].data[dataIndex];
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
    <div className='OverviewChart mb-6 h-72 w-full rounded-lg bg-brand-primary-light p-3'>
      <Line data={data} options={options} plugins={[tooltipPlugin]} />
    </div>
  );
}
