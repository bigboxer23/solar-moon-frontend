import { useEffect, useState } from "react";
import { getAvgTotal, getMaxCurrent } from "../../services/services";
import { TOTAL_REAL_POWER } from "../../services/search";

const MetricsTile = ({ device, time }) => {
  const [total, setTotal] = useState("Loading");
  const [avg, setAvg] = useState("Loading");
  const [max, setMax] = useState(0);
  useEffect(() => {
    let end = new Date();
    getAvgTotal(device, new Date(end.getTime() - time), end, false)
      .then(({ data }) => {
        setTotal(
          "Total " +
            Math.round(data.aggregations["total"].value * 10) / 10 +
            " kWH",
        );
        setAvg(
          "Avg " + Math.round(data.aggregations["avg"].value * 10) / 10 + " kW",
        );
      })
      .catch((e) => console.log(e));
    getMaxCurrent(device, false)
      .then(({ data }) => {
        setMax(
          getGaugeValue(
            data.aggregations["max"].value,
            data.hits.hits.length > 0
              ? data.hits.hits[0].fields[TOTAL_REAL_POWER][0]
              : 0,
          ),
        );
      })
      .catch((e) => console.log(e));
  }, [time]);

  function getGaugeValue(max, avg) {
    max = max === null ? 0 : max;
    let scale = 200 / max;
    return Math.round(Math.round(scale * avg));
  }
  return (
    <div
      className={"metrics-tile m-3 p-3 d-flex flex-column position-relative"}
    >
      <div className={"site-name fs-4"}>{device.name}</div>
      <div className={"flex-grow-1"} />
      <div className={"align-self-end text-muted smaller-text"}>{total}</div>
      <div className={"align-self-end justify-self-end fw-bolder"}>{avg}</div>
      <div className={"min-max-gauge-empty position-absolute"} />
      <div
        style={{ height: max + "px" }}
        className={"min-max-gauge position-absolute"}
      />
    </div>
  );
};
export default MetricsTile;
