import { useEffect, useState } from "react";
import { getTileContent } from "../../services/services";
import { TOTAL_REAL_POWER } from "../../services/search";
import FormattedLabel from "./FormattedLabel";
import { getWeatherIcon } from "../../utils/Utils";

const MetricsTile = ({ device, time }) => {
  const [total, setTotal] = useState(-1);
  const [avg, setAvg] = useState(-1);
  const [max, setMax] = useState(0);
  const [weather, setWeather] = useState("");
  const [temperature, setTemperature] = useState(-1);
  useEffect(() => {
    getTileContent(device, time)
      .then(({ data }) => {
        setTotal(Math.round(data[0].aggregations["sum#total"].value * 10) / 10);
        setAvg(Math.round(data[0].aggregations["avg#avg"].value * 10) / 10);
        setMax(
          getGaugeValue(
            data[1].aggregations["max#max"].value,
            data[1].hits.hits.length > 0
              ? data[1].hits.hits[0].fields[TOTAL_REAL_POWER][0]
              : 0,
          ),
        );

        setWeather(data[2].hits.hits[0]._source["weatherSummary"]);
        setTemperature(data[2].hits.hits[0]._source["temperature"] || -1);
      })
      .catch((e) => console.log(e));
  }, [time]);

  const getFormattedTemp = (temp) => {
    return temp === -1 ? "" : Math.round(temp) + "°F";
  };
  const getGaugeValue = (max, avg) => {
    max = max === null ? 0 : max;
    let scale = 200 / max;
    return Math.round(Math.round(scale * avg));
  };

  return (
    <div
      className={"metrics-tile m-3 p-3 d-flex flex-column position-relative"}
    >
      <div className={"site-name fs-4"}>{device.name}</div>
      <div className={"weather fs-4 d-flex align-items-center"} title={weather}>
        {getWeatherIcon(weather)}
        <div className={"ms-2 text-muted smaller-text"}>
          {getFormattedTemp(temperature)}
        </div>
      </div>
      <div className={"flex-grow-1"} />
      <div className={"align-self-end text-muted smaller-text"}>
        <FormattedLabel
          label={"Total"}
          value={total}
          unit={"kWH"}
          separator={" "}
        />
      </div>
      <div className={"align-self-end justify-self-end fw-bolder"}>
        <FormattedLabel label={"Avg"} value={avg} unit={"kW"} separator={" "} />
      </div>
      <div className={"min-max-gauge-empty position-absolute"} />
      <div
        style={{ height: max + "px" }}
        className={"min-max-gauge position-absolute"}
      />
    </div>
  );
};
export default MetricsTile;
