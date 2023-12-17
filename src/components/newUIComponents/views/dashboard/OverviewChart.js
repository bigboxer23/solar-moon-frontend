import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { DAY, parseSearchReturn } from '../../../../services/search';
import { splitDayAndNightDataSets } from '../../../../utils/Utils';

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
        type: 'time',
        ticks: {
          stepSize: 6,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
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
              label += ' kWh';
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

  const plugins = [
    {
      id: 'verticalLiner',
      afterInit: (chart) => {
        chart.verticalLiner = {};
      },
      afterEvent: (chart, args) => {
        const { inChartArea } = args;
        chart.verticalLiner = { draw: inChartArea };
      },
      beforeTooltipDraw: (chart, args) => {
        const { draw } = chart.verticalLiner;
        if (!draw) return;

        const { ctx } = chart;
        const { top, bottom } = chart.chartArea;
        const { tooltip } = args;
        const x = tooltip?.caretX;
        if (!x) return;

        ctx.save();

        ctx.beginPath();
        ctx.strokeStyle = '#5178C2';
        ctx.lineWidth = 2;
        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);
        ctx.stroke();

        ctx.restore();
      },
    },
  ];

  if (loading) return null;

  return (
    <div className='OverviewChart mb-6 h-40 w-full rounded-lg bg-brand-primary-light px-2 pb-1'>
      <Line data={data} options={options} plugins={plugins} />
    </div>
  );
}
