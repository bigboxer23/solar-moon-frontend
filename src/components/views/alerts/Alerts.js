import React, { useEffect, useState } from 'react';
import { TbAlertTriangle } from 'react-icons/tb';

import { ALL } from '../../../services/search';
import {
  getAlarmData,
  getSubscriptionInformation,
} from '../../../services/services';
import { compare } from '../../../utils/Utils';
import Loader from '../../common/Loader';
import Alert from './Alert';
import AlertsFilter from './AlertsFilter';

export default function Alerts({ setTrialDate }) {
  const [loading, setLoading] = useState(true);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const [filteredActiveAlerts, setFilteredActiveAlerts] = useState([]);
  const [filteredResolvedAlerts, setFilteredResolvedAlerts] = useState([]);

  const [siteOptions, setSiteOptions] = useState([]);
  const [deviceOptions, setDeviceOptions] = useState([]);
  const [refreshSearch, setRefreshSearch] = useState(false);

  const [filter, setFilter] = useState({
    deviceId: ALL,
    siteId: ALL,
    start: null,
    end: null,
  });

  const sortAlarms = (alarm, alarm2) => {
    const siteSort = compare(alarm.siteName, alarm2.siteName);
    if (siteSort !== 0) {
      return siteSort;
    }
    return compare(alarm.deviceName, alarm2.deviceName);
  };

  const getOption = (d, labelObject) => {
    return {
      label: labelObject,
      deviceName: d.deviceName,
      value: d.deviceId,
      site: d.siteId,
      siteName: d.deviceSite,
    };
  };

  const loadData = () => {
    getAlarmData().then(({ data }) => {
      const active = data
        .filter((d) => d.state > 0)
        .sort((row, row2) => row2.startDate - row.startDate);
      const resolved = data
        .filter((d) => d.state === 0)
        .sort((row, row2) => row2.endDate - row.endDate);
      getSubscriptionInformation().then(({ data }) => {
        setTrialDate(data?.joinDate);
      });
      // Initialize alerts
      setActiveAlerts(active);
      setResolvedAlerts(resolved);

      // Initialize filtered alerts
      setFilteredActiveAlerts(active.filter(filterFn));
      setFilteredResolvedAlerts(resolved.filter(filterFn));

      const siteOptions = [
        ...new Map(
          data
            .filter((d) => {
              return d.deviceSite && d.siteId;
            })
            .map((d) => {
              return [
                d.siteId,
                {
                  label: d.deviceSite,
                  value: d.siteId,
                  deviceName: d.deviceSite,
                  siteName: d.deviceSite,
                },
              ];
            }),
        ).values(),
      ].sort(sortAlarms);

      const disabledOptions = data
        .filter((d) => d.deviceDisabled)
        .filter((d) => d.siteId !== d.deviceId)
        .reduce((result, d) => {
          result[d.deviceId] = getOption(
            d,
            <div className='opacity-50' title='(Disabled)'>
              {d.deviceName}
            </div>,
          );
          return result;
        }, {});
      const activeOptions = data
        .filter((d) => disabledOptions[d.deviceId] === undefined)
        .filter((d) => d.endDate === 0)
        .filter((d) => d.siteId !== d.deviceId)
        .reduce((result, d) => {
          result[d.deviceId] = getOption(
            d,
            <div
              className='flex items-center rounded-md bg-danger px-1 text-white'
              title='(Active)'
            >
              <TbAlertTriangle className='mr-1' />
              {d.deviceName}
            </div>,
          );
          return result;
        }, {});

      const deviceOptions = data
        .filter((d) => disabledOptions[d.deviceId] === undefined)
        .filter((d) => activeOptions[d.deviceId] === undefined)
        .filter((d) => d.siteId !== d.deviceId)
        .reduce((result, d) => {
          result[d.deviceId] = getOption(d, d.deviceName);
          return result;
        }, {});
      setSiteOptions(siteOptions);
      setDeviceOptions([
        ...Object.values(activeOptions).sort(sortAlarms),
        ...Object.values(deviceOptions).sort(sortAlarms),
        ...Object.values(disabledOptions).sort(sortAlarms),
      ]);
      setRefreshSearch(false);
      setLoading(false);
    });
  };

  const filterFn = (alert) => {
    if (filter.deviceId !== ALL && filter.deviceId !== alert.deviceId) {
      return false;
    }
    if (filter.siteId !== ALL && filter.siteId !== alert.siteId) {
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

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setFilteredActiveAlerts(activeAlerts.filter(filterFn));
    setFilteredResolvedAlerts(resolvedAlerts.filter(filterFn));
  }, [filter]);

  useEffect(() => {
    if (loading || !refreshSearch) {
      return;
    }
    loadData();
  }, [refreshSearch]);

  function handleFilterChange({ deviceId, siteId, start, end }) {
    setFilter({ deviceId, siteId, start, end });
  }

  return (
    <main className='Alerts flex w-full flex-col items-center justify-center'>
      {loading && <Loader />}
      {!loading && (
        <div className='fade-in my-8 w-[55rem] max-w-full bg-white p-6 shadow-panel dark:bg-gray-800 sm:rounded-lg sm:p-8'>
          <div className='mb-10 flex w-full justify-between'>
            <span className='flex items-center text-lg font-bold text-black dark:text-gray-100'>
              Alerts
              {filteredActiveAlerts.length > 0 && (
                <div className='ml-2 text-sm text-gray-400'>
                  {filteredActiveAlerts.length} active
                </div>
              )}
            </span>
            <AlertsFilter
              availableDevices={deviceOptions}
              availableSites={siteOptions}
              handleFilterChange={handleFilterChange}
              initialFilter={filter}
              refreshSearch={refreshSearch}
              reloadData={loadData}
              setRefreshSearch={setRefreshSearch}
            />
          </div>
          <div className='mb-8 space-y-4'>
            {filteredActiveAlerts.length === 0 && (
              <div className='flex size-full items-center justify-center px-6 text-center text-base text-gray-400'>
                All clear! You have no active device alerts.
              </div>
            )}
            {filteredActiveAlerts.map((alert) => (
              <Alert active alert={alert} key={alert.alarmId} />
            ))}
          </div>
          <div className='mb-6 flex w-full items-center justify-between text-lg font-bold text-black dark:text-gray-100'>
            Resolved Alerts
            {filteredResolvedAlerts.length > 0 && (
              <div className='ml-2 text-sm text-gray-400'>
                {filteredResolvedAlerts.length} resolved
              </div>
            )}
          </div>
          <div className='space-y-4'>
            {filteredResolvedAlerts.map((alert) => (
              <Alert alert={alert} key={alert.alarmId} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
