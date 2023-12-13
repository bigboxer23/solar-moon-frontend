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
    <div className="SiteRow mb-3">
      <div className="site-name">{name}</div>
      <div className="device-count">{deviceCount}</div>
      <div className="alert-count">{alertCount}</div>
      <div className="average">
        <FormattedNumber value={average} />
        kWH
      </div>
      <div className="total">
        <FormattedNumber value={total} />
        kWH
      </div>
      <div className="graph">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
