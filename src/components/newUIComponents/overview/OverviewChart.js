import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { DAY, parseSearchReturn2 } from "../../../services/search";
import { splitDayAndNightDataSets } from "../../../utils/Utils";

export default function OverviewChart({ sites, timeIncrement, siteData }) {
  const [loading, setLoading] = useState(true);
  const [dayData, setDayData] = useState([]);
  const [nightData, setNightData] = useState([]);

  useEffect(() => {
    if (siteData == null) {
      return;
    }
    setLoading(false);
    const parsedData = parseSearchReturn2(siteData);
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
