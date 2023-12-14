import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { splitDayAndNightDataSets } from "../../../../utils/Utils";
import {
  DAY,
  getAggregationValue,
  parseSearchReturn,
} from "../../../../services/search";
import { FormattedNumber } from "react-intl";

export default function SiteRow({ info, graphData, timeIncrement }) {
  const { name, deviceCount, alertCount } = info;
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTotal(getAggregationValue(graphData.totalAvg, "sum#total"));
    setAverage(getAggregationValue(graphData.totalAvg, "avg#avg"));
    setLoading(false);
  }, [graphData]);

  const timeSeriesData = parseSearchReturn(graphData.timeSeries);
  const [dayData, nightData] = splitDayAndNightDataSets(timeSeriesData);

  const data =
    timeIncrement === DAY
      ? {
          datasets: [
            {
              data: dayData,
              borderColor: "#5178C2",
            },
            {
              data: nightData,
              borderColor: "#9754cb",
            },
          ],
        }
      : {
          datasets: [
            {
              data: timeSeriesData,
              borderColor: "#5178C2",
            },
          ],
        };

  const options = {
    events: [],
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        ticks: {
          display: false,
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
        radius: 0,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    parsing: {
      xAxisKey: "date",
      yAxisKey: "values",
    },
  };

  if (loading) return null;

  return (
    <div className="SiteRow mb-3 flex w-full items-center">
      <div className="w-[15%] px-2">{name}</div>
      <div className="w-[15%] text-end px-2">{deviceCount}</div>
      <div className="w-[15%] text-end px-2">{alertCount}</div>
      <div className="w-[15%] text-end px-2">
        <FormattedNumber value={average} />
      </div>
      <div className="w-[15%] text-end px-2">
        <FormattedNumber value={total} />
      </div>
      <div className="w-1/4 h-[2.5rem] rounded ml-auto bg-brand-primary-light">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
