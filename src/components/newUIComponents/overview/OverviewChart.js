import { useEffect, useState } from "react";
import { getTimeSeriesData } from "../../../services/services";
import { Line } from "react-chartjs-2";
import { DAY, parseSearchReturn } from "../../../services/search";
import { splitDayAndNightDataSets } from "../../../utils/Utils";

export default function OverviewChart({ sites, timeIncrement }) {
  const [loading, setLoading] = useState(true);
  const [dayData, setDayData] = useState([]);
  const [nightData, setNightData] = useState([]);

  useEffect(() => {
    // TODO: this data should come from upstream so we arent re-fetching here, refactor later
    setLoading(true);
    getTimeSeriesData(sites, timeIncrement, true).then(({ data }) => {
      const parsedData = parseSearchReturn(data);
      if (timeIncrement === DAY) {
        const [dayData, nightData] = splitDayAndNightDataSets(parsedData);
        setDayData(dayData);
        setNightData(nightData);
      } else {
        setDayData(parsedData);
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
