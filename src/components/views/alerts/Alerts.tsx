import type { Dispatch, ReactElement, ReactNode, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
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

interface AlertData {
  alarmId: string;
  deviceId: string;
  deviceName: string;
  deviceSite: string;
  siteId: string;
  siteName: string;
  state: number;
  startDate: number;
  endDate: number;
  message: string;
  deviceDisabled?: boolean;
}

interface DropdownOption {
  value: string;
  label: string | ReactNode;
  deviceName: string;
  site: string;
  siteName: string;
}

interface FilterParams {
  deviceId: string;
  siteId: string;
  start: Date | null;
  end: Date | null;
}

interface AlertsProps {
  setTrialDate: Dispatch<SetStateAction<number>>;
}

export default function Alerts({ setTrialDate }: AlertsProps): ReactElement {
  const [loading, setLoading] = useState(true);
  const [activeAlerts, setActiveAlerts] = useState<AlertData[]>([]);
  const [resolvedAlerts, setResolvedAlerts] = useState<AlertData[]>([]);
  const [filteredActiveAlerts, setFilteredActiveAlerts] = useState<AlertData[]>(
    [],
  );
  const [filteredResolvedAlerts, setFilteredResolvedAlerts] = useState<
    AlertData[]
  >([]);

  const [siteOptions, setSiteOptions] = useState<DropdownOption[]>([]);
  const [deviceOptions, setDeviceOptions] = useState<DropdownOption[]>([]);
  const [refreshSearch, setRefreshSearch] = useState(false);

  const [filter, setFilter] = useState<FilterParams>({
    deviceId: ALL,
    siteId: ALL,
    start: null,
    end: null,
  });

  const sortAlarms = (alarm: DropdownOption, alarm2: DropdownOption) => {
    const siteSort = compare(alarm.siteName, alarm2.siteName);
    if (siteSort !== 0) {
      return siteSort;
    }
    return compare(alarm.deviceName, alarm2.deviceName);
  };

  const getOption = (
    d: AlertData,
    labelObject: string | ReactNode,
  ): DropdownOption => {
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
      const alarms = data as unknown as AlertData[];
      const active = alarms
        .filter((d) => d.state > 0)
        .sort((row, row2) => row2.startDate - row.startDate);
      const resolved = alarms
        .filter((d) => d.state === 0)
        .sort((row, row2) => row2.endDate - row.endDate);
      getSubscriptionInformation().then(({ data }) => {
        setTrialDate(data?.joinDate || 0);
      });
      // Initialize alerts
      setActiveAlerts(active);
      setResolvedAlerts(resolved);

      // Initialize filtered alerts
      setFilteredActiveAlerts(active.filter(filterFn));
      setFilteredResolvedAlerts(resolved.filter(filterFn));

      const siteOptions = [
        ...new Map(
          alarms
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
                  site: d.siteId,
                },
              ];
            }),
        ).values(),
      ].sort(sortAlarms) as DropdownOption[];

      const disabledOptions = alarms
        .filter((d) => d.deviceDisabled)
        .filter((d) => d.siteId !== d.deviceId)
        .reduce(
          (result, d) => {
            result[d.deviceId] = getOption(
              d,
              <div className='opacity-50' title='(Disabled)'>
                {d.deviceName}
              </div>,
            );
            return result;
          },
          {} as Record<string, DropdownOption>,
        );
      const activeOptions = alarms
        .filter((d) => disabledOptions[d.deviceId] === undefined)
        .filter((d) => d.endDate === 0)
        .filter((d) => d.siteId !== d.deviceId)
        .reduce(
          (result, d) => {
            result[d.deviceId] = getOption(
              d,
              <div
                className='bg-danger flex items-center rounded-md px-1 text-white'
                title='(Active)'
              >
                <TbAlertTriangle className='mr-1' />
                {d.deviceName}
              </div>,
            );
            return result;
          },
          {} as Record<string, DropdownOption>,
        );

      const deviceOptions = alarms
        .filter((d) => disabledOptions[d.deviceId] === undefined)
        .filter((d) => activeOptions[d.deviceId] === undefined)
        .filter((d) => d.siteId !== d.deviceId)
        .reduce(
          (result, d) => {
            result[d.deviceId] = getOption(d, d.deviceName);
            return result;
          },
          {} as Record<string, DropdownOption>,
        );
      setSiteOptions(siteOptions as DropdownOption[]);
      setDeviceOptions([
        ...(Object.values(activeOptions) as DropdownOption[]).sort(sortAlarms),
        ...(Object.values(deviceOptions) as DropdownOption[]).sort(sortAlarms),
        ...(Object.values(disabledOptions) as DropdownOption[]).sort(
          sortAlarms,
        ),
      ]);
      setRefreshSearch(false);
      setLoading(false);
    });
  };

  const filterFn = (alert: AlertData): boolean => {
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
    return true;
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

  function handleFilterChange({ deviceId, siteId, start, end }: FilterParams) {
    setFilter({ deviceId, siteId, start, end });
  }

  return (
    <main className='Alerts flex w-full flex-col items-center justify-center'>
      {loading && <Loader />}
      {!loading && (
        <div className='fade-in shadow-panel my-8 w-[55rem] max-w-full bg-white p-6 sm:rounded-lg sm:p-8 dark:bg-gray-800'>
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
              refreshSearch={refreshSearch}
              setRefreshSearch={setRefreshSearch}
            />
          </div>
          <div className='mb-8 gap-y-4'>
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
          <div className='flex flex-col gap-y-4'>
            {filteredResolvedAlerts.map((alert) => (
              <Alert alert={alert} key={alert.alarmId} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
