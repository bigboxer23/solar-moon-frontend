import { useEffect, useState } from "react";
import { getAlarmData } from "../../services/services";
import Loader from "./common/Loader";
import Alert from "./alerts/Alert";
import AlertsFilter from "./alerts/AlertsFilter";
import { sortSelectAlphabetically } from "../../utils/Utils";

export default function Alerts() {
  const [loading, setLoading] = useState(true);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const [filteredActiveAlerts, setFilteredActiveAlerts] = useState([]);
  const [filteredResolvedAlerts, setFilteredResolvedAlerts] = useState([]);

  const [siteOptions, setSiteOptions] = useState([]);
  const [deviceOptions, setDeviceOptions] = useState([]);

  const [filter, setFilter] = useState({
    device: "all",
    site: "all",
    start: null,
    end: null,
  });

  useEffect(() => {
    getAlarmData().then(({ data }) => {
      const active = data
        .filter((d) => d.state > 0)
        .sort((row, row2) => row2.startDate - row.startDate);
      const resolved = data
        .filter((d) => d.state === 0)
        .sort((row, row2) => row2.startDate - row.startDate);

      // Initialize alerts
      setActiveAlerts(active);
      setResolvedAlerts(resolved);

      // Initialize filtered alerts
      setFilteredActiveAlerts(active);
      setFilteredResolvedAlerts(resolved);

      const siteOptions = [
        ...new Map(
          data
            .filter((d) => {
              return d.deviceSite && d.siteId;
            })
            .map((d) => {
              return [d.siteId, { label: d.deviceSite, value: d.siteId }];
            }),
        ).values(),
      ].sort(sortSelectAlphabetically);

      const deviceOptions = [
        ...new Map(
          data
            .filter((d) => {
              return d.deviceName && d.deviceId;
            })
            .map((d) => {
              return [d.deviceId, { label: d.deviceName, value: d.deviceId }];
            }),
        ).values(),
      ].sort(sortSelectAlphabetically);

      setSiteOptions(siteOptions);
      setDeviceOptions(deviceOptions);

      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const filterFn = (alert) => {
      if (filter.device !== "all" && filter.device !== alert.deviceId) {
        return false;
      }
      if (filter.site !== "all" && filter.site !== alert.siteId) {
        return false;
      }
      const alertDate = new Date(alert.startDate);

      if (filter.start === null || filter.end === null) {
        return true;
      }

      if (filter.start && alertDate < filter.start) {
        return false;
      }
      if (filter.end && alertDate > filter.end) {
        return false;
      }
    };

    setFilteredActiveAlerts(activeAlerts.filter(filterFn));
    setFilteredResolvedAlerts(resolvedAlerts.filter(filterFn));
  }, [filter]);

  function handleFilterChange({ device, site, start, end }) {
    setFilter({ device, site, start, end });
  }

  return (
    <main className="Alerts flex justify-center flex-col items-center w-full">
      {loading && <Loader />}
      {!loading && (
        <div className="fade-in my-8 bg-white rounded-lg w-[55rem] p-8 shadow-panel">
          <div className="flex justify-between items-center w-full  mb-10">
            <span className="text-lg font-bold">Alerts</span>
            <AlertsFilter
              initialFilter={filter}
              handleFilterChange={handleFilterChange}
              availableSites={siteOptions}
              availableDevices={deviceOptions}
            />
          </div>
          <div className="space-y-4">
            {filteredActiveAlerts.length === 0 && (
              <div className="flex justify-center items-center h-full w-full text-base text-text-secondary mb-8">
                All clear! You have no active device alerts.
              </div>
            )}
            {filteredActiveAlerts.map((alert) => (
              <Alert key={alert.alarmId} alert={alert} active />
            ))}
          </div>
          <div className="flex justify-between items-center w-full text-lg font-bold mb-6">
            Resolved Alerts
          </div>
          <div className="space-y-4">
            {filteredResolvedAlerts.map((alert) => (
              <Alert key={alert.alarmId} alert={alert} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
