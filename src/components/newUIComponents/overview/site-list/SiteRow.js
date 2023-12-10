import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getAvgTotal } from "../../../../services/services";
import { splitDayAndNightDataSets } from "../../../../utils/Utils";

export default function SiteRow({ info, graphData, timeIncrement }) {
  const { name, deviceCount, alertCount } = info;
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: This data should come from upstream, attached to the site info
    getAvgTotal(info, timeIncrement).then(({ data }) => {
      setTotal(Math.round(data.aggregations["sum#total"].value * 10) / 10);
      setAverage(Math.round(data.aggregations["avg#avg"].value * 10) / 10);
      setLoading(false);
    });
  }, [timeIncrement]);

  const [dayData, nightData] = splitDayAndNightDataSets(graphData);

  const data =
    timeIncrement === "day"
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
              data: graphData,
              borderColor: "#5178C2",
            },
          ],
        };

  const options = {
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
    <div className="SiteRow">
      <div className="site-name">{name}</div>
      <div className="device-count">{deviceCount}</div>
      <div className="alert-count">{alertCount}</div>
      <div className="average">{average}kWH</div>
      <div className="total">{total}kWH</div>
      <div className="graph">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
