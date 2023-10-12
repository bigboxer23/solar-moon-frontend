import { useEffect, useState } from "react";
import { getTileData } from "../../services/services";

const MetricsTile = ({ device, time }) => {
  const [total, setTotal] = useState("Loading");
  const [avg, setAvg] = useState("Loading");

  useEffect(() => {
    let start = new Date(new Date().getTime() - time);
    getTileData(device, new Date(start), new Date(), true).then(({ data }) => {
      console.log(device.name + ":" + data.aggregations["max"].value);
      setTotal(
        "Total " +
          Math.round(data.aggregations["total"].value * 10) / 10 +
          " kWH",
      );
      setAvg(
        "Avg " + Math.round(data.aggregations["avg"].value * 10) / 10 + " kW",
      );
    });
  }, [time]);
  return (
    <div className={"metrics-tile m-3 p-3 d-flex flex-column"}>
      <div className={"site-name fs-4"}>{device.name}</div>
      <div className={"flex-grow-1"} />
      <div className={"align-self-end text-muted smaller-text"}>{total}</div>
      <div className={"align-self-end justify-self-end fw-bolder"}>{avg}</div>
    </div>
  );
};
export default MetricsTile;
