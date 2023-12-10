import { useEffect, useState } from "react";
import {
  getAlarmData,
  getDevices,
  getOverviewTotal,
} from "../../../services/services";
import SiteList from "./site-list/SiteList";
import OverviewChart from "./OverviewChart";
import TimeIncrementSelector from "./TimeIncrementSelector";
import { DAY } from "../../../services/search";

function StatBlock({ title, value, className }) {
  return (
    <div className={`StatBlock ${className}`}>
      <div className="stat-block-value">{value}</div>
      <div className="stat-block-title">{title}</div>
    </div>
  );
}

export default function Overview() {
  const [sites, setSites] = useState([]);
  const [devices, setDevices] = useState(0);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const [timeIncrement, setTimeIncrement] = useState(DAY);
  const [totalOutput, setTotalOutput] = useState(0);
  const [averageOutput, setAverageOutput] = useState(0);

  useEffect(() => {
    // TODO: All of this data should come from one endpoint, and include data noted in subcomponents
    getOverviewTotal(timeIncrement).then(({ data }) => {
      const totalKWH =
        Math.round(data.aggregations["sum#total"].value * 10) / 10;

      setTotalOutput(totalKWH);
      setAverageOutput(
        Math.round(data.aggregations["avg#avg"].value * 10) / 10,
      );
    });
    getAlarmData().then(({ data }) => {
      const active = data.filter((d) => d.state > 0);
      const resolved = data.filter((d) => d.state === 0);

      const resolvedInTimeIncrement = resolved.filter((d) => {
        return (
          new Date(d.startDate) > new Date(new Date().getTime() - timeIncrement)
        );
      });

      setResolvedAlerts(resolvedInTimeIncrement);
      setActiveAlerts(active);
    });
    getDevices().then(({ data }) => {
      const sites = data.filter((d) => d.virtual);
      const devices = data.filter((d) => !d.virtual);

      const mappedSites = sites.map((s) => {
        return {
          ...s,
          devices: devices.filter((d) => d.site === s.name),
        };
      });

      setDevices(devices);
      setSites(mappedSites);
    });
  }, [timeIncrement]);

  return (
    <div className="Overview">
      <div className="overview-header">
        Overview
        <TimeIncrementSelector
          setTimeIncrement={setTimeIncrement}
          timeIncrement={timeIncrement}
        />
      </div>
      <div className="stats">
        <div className="stat-blocks">
          <StatBlock title="sites" value={sites.length} />
          <StatBlock title="devices" value={devices.length} />
          <StatBlock
            title="active alerts"
            value={activeAlerts.length}
            className={activeAlerts > 0 ? "red" : ""}
          />
          <StatBlock
            title="resolved alerts"
            value={resolvedAlerts.length}
            className={"gray"}
          />
        </div>
        <div className="totals">
          <span className="total-output">Total: {totalOutput} kWH</span>
          <span className="average-output">Average: {averageOutput} kWH</span>
        </div>
      </div>
      <OverviewChart sites={sites} timeIncrement={timeIncrement} />
      <SiteList
        sites={sites}
        devices={devices}
        timeIncrement={timeIncrement}
        alerts={[...resolvedAlerts, ...activeAlerts]}
      />
    </div>
  );
}
