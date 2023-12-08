import { useEffect, useState } from "react";
import { getListTimeSeriesData } from "../../../services/services";
import { Line } from "react-chartjs-2";
import { parseSearchReturn } from "../../../services/search";
import { splitDayAndNightDataSets } from "../../../utils/Utils";

export default function OverviewChart({ sites, timeIncrement }) {
  const [loading, setLoading] = useState(true);
  const [dayData, setDayData] = useState([]);
  const [nightData, setNightData] = useState([]);

  useEffect(() => {
    // TODO: this data should come from upstream so we arent re-fetching here, refactor later
    setLoading(true);
    getListTimeSeriesData(sites, timeIncrement).then(({ data }) => {
      const parsedData = data.map((d) => parseSearchReturn(JSON.parse(d)));

      const mergedData = parsedData.reduce((acc, cur) => {
        // TODO: hack to display overview graph by merging site graphs, this should be done on the backend

        if (acc.length === 0) return cur;

        return acc.map((d, i) => {
          const accumulatorItem = acc[i];
          const currentItem = cur[i];

          const accumulatorValue = accumulatorItem.values;
          const currentValue = currentItem.values;

          return {
            date: accumulatorValue.date,
            values: accumulatorValue.values + currentValue.values,
          };
        });
      }, []);

      if (timeIncrement === "day") {
        const [dayData, nightData] = splitDayAndNightDataSets(mergedData);
        setDayData(dayData);
        setNightData(nightData);
      } else {
        setDayData(mergedData);
        setNightData([]);
      }
      setLoading(false);
    });
  }, [sites, timeIncrement]);

  const data = {
    datasets: [
      {
        data: dayData,
        borderColor: "#5178C2",
        borderWidth: 4,
      },
      ...(nightData.length > 0
        ? [
            {
              data: nightData,
              borderColor: "#9754cb",
              borderWidth: 4,
            },
          ]
        : []),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
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
    <div className="OverviewChart">
      <Line data={data} options={options} />
    </div>
  );
}
