import { useEffect, useState } from 'react';
import { getAlarmData } from '../../services/services';
import Loader from './common/Loader';
import Alert from './alerts/Alert';
import AlertsFilter from './alerts/AlertsFilter';

export default function Alerts() {
  const [loading, setLoading] = useState(true);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const [filteredActiveAlerts, setFilteredActiveAlerts] = useState([]);
  const [filteredResolvedAlerts, setFilteredResolvedAlerts] = useState([]);

  const [siteOptions, setSiteOptions] = useState([]);
  const [deviceOptions, setDeviceOptions] = useState([]);

  const [filter, setFilter] = useState({
    device: 'all',
    site: 'all',
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

      const siteOptions = data
        .map((d) => {
          return { label: d.deviceSite, value: d.siteId };
        })
        .filter((opt) => {
          return opt.label && opt.value;
        });

      const deviceOptions = data
        .map((d) => {
          return { label: d.deviceName, value: d.deviceId };
        })
        .filter((opt) => {
          return opt.label && opt.value;
        });

      setSiteOptions(siteOptions);
      setDeviceOptions(deviceOptions);

      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const filterFn = (alert) => {
      if (filter.device !== 'all' && filter.device !== alert.deviceId) {
        return false;
      }
      if (filter.site !== 'all' && filter.site !== alert.siteId) {
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
    <main className='Alerts flex w-full flex-col items-center justify-center'>
      {loading && <Loader />}
      {!loading && (
        <div className='fade-in my-8 w-[55rem] rounded-lg bg-white p-8 shadow-panel'>
          <div className='mb-10 flex w-full items-center  justify-between'>
            <span className='text-lg font-bold'>Alerts</span>
            <AlertsFilter
              initialFilter={filter}
              handleFilterChange={handleFilterChange}
              availableSites={siteOptions}
              availableDevices={deviceOptions}
            />
          </div>
          <div className='space-y-4'>
            {filteredActiveAlerts.length === 0 && (
              <div className='mb-8 flex h-full w-full items-center justify-center text-base text-text-secondary'>
                All clear! You have no active device alerts.
              </div>
            )}
            {filteredActiveAlerts.map((alert) => (
              <Alert key={alert.alarmId} alert={alert} active />
            ))}
          </div>
          <div className='mb-6 flex w-full items-center justify-between text-lg font-bold'>
            Resolved Alerts
          </div>
          <div className='space-y-4'>
            {filteredResolvedAlerts.map((alert) => (
              <Alert key={alert.alarmId} alert={alert} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
