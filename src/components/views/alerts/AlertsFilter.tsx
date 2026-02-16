import type { ReactElement, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { FaRotate } from 'react-icons/fa6';
import { useSearchParams } from 'react-router-dom';

import { ALL } from '../../../services/search';
import Button from '../../common/Button';
import Dropdown from '../../common/Dropdown';
import Spinner from '../../common/Spinner';

interface DropdownOption {
  value: string;
  label: string | ReactNode;
  deviceName?: string;
  site?: string;
  siteName?: string;
}

interface FilterParams {
  siteId: string;
  deviceId: string;
  start: Date | null;
  end: Date | null;
}

interface AlertsFilterProps {
  handleFilterChange: (params: FilterParams) => void;
  availableSites: DropdownOption[];
  availableDevices: DropdownOption[];
  refreshSearch: boolean;
  setRefreshSearch: (value: boolean) => void;
}

export default function AlertsFilter({
  handleFilterChange,
  availableSites,
  availableDevices,
  refreshSearch,
  setRefreshSearch,
}: AlertsFilterProps): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const allOption: DropdownOption = { value: ALL, label: ALL };

  const searchParamSite = searchParams.get('siteId');
  const searchParamDevice = searchParams.get('deviceId');
  const searchParamStart = searchParams.get('start');
  const searchParamEnd = searchParams.get('end');

  const defaultSite =
    availableSites.find((site) => site.value === searchParamSite) || allOption;

  const defaultDevice =
    availableDevices.find((device) => device.value === searchParamDevice) ||
    allOption;

  const defaultStart = searchParamStart ? new Date(searchParamStart) : null;

  const defaultEnd = searchParamEnd ? new Date(searchParamEnd) : null;

  const [dirty, setDirty] = useState(
    searchParamSite != null || searchParamDevice != null,
  );

  const [siteIdValue, setSiteIdValue] = useState<DropdownOption>(defaultSite);
  const [deviceIdValue, setDeviceIdValue] =
    useState<DropdownOption>(defaultDevice);
  const [dateValue, setDateValue] = useState<[Date | null, Date | null]>([
    defaultStart,
    defaultEnd,
  ]);

  useEffect(() => {
    handleFilterChange({
      siteId: defaultSite.value,
      deviceId: defaultDevice.value,
      start: dateValue[0] ? dateValue[0] : null,
      end: dateValue[1] ? dateValue[1] : null,
    });
  }, []);

  useEffect(() => {
    handleFilterChange({
      siteId: siteIdValue.value,
      deviceId: deviceIdValue.value,
      start: dateValue[0] ? dateValue[0] : null,
      end: dateValue[1] ? dateValue[1] : null,
    });
  }, [deviceIdValue, siteIdValue, dateValue]);

  // Update search params when filters change
  useEffect(() => {
    const searchParams: Record<string, string | null> = {};
    if (siteIdValue.value !== ALL) {
      searchParams.siteId = siteIdValue.value;
    }
    if (deviceIdValue.value !== ALL) {
      searchParams.deviceId = deviceIdValue.value;
    }

    if (dateValue[0] && dateValue[1]) {
      searchParams.start = null;
      searchParams.end = null;
    }

    setSearchParams(searchParams as Record<string, string>);
  }, [deviceIdValue, siteIdValue]);

  function resetFilters() {
    setSearchParams({});
    setSiteIdValue(allOption);
    setDeviceIdValue(allOption);
    setDateValue([null, null]);
    setDirty(false);
  }

  function handleSiteFilterChange(siteOption: DropdownOption) {
    setSiteIdValue(siteOption);
    setDeviceIdValue(allOption);
    setDirty(true);
  }

  function handleDeviceFilterChange(deviceOption: DropdownOption) {
    setDeviceIdValue(deviceOption);
    setDirty(true);
  }

  return (
    <div className='AlertsFilter flex flex-col items-end gap-y-3 sm:flex-row sm:items-center sm:gap-y-0 sm:gap-x-6'>
      {dirty && (
        <button
          className='hidden bg-white text-sm font-bold text-gray-400 underline sm:block sm:rounded-full dark:bg-gray-800'
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      )}

      <Dropdown
        onChange={
          handleSiteFilterChange as (option: {
            value: string;
            label: string;
          }) => void
        }
        options={
          [allOption, ...availableSites] as Array<{
            value: string;
            label: string;
          }>
        }
        prefixLabel='Site'
        value={siteIdValue as { value: string; label: string }}
      />
      <Dropdown
        onChange={
          handleDeviceFilterChange as (option: {
            value: string;
            label: string;
          }) => void
        }
        options={
          [
            allOption,
            ...availableDevices.filter((d) => {
              const siteLabel =
                typeof siteIdValue.label === 'string'
                  ? siteIdValue.label
                  : siteIdValue.value;
              return (
                siteLabel === ALL ||
                d.site === siteIdValue.value ||
                d.deviceName === ALL
              );
            }),
          ] as Array<{ value: string; label: string }>
        }
        prefixLabel='Device'
        value={deviceIdValue as { value: string; label: string }}
      />
      <Button
        buttonProps={{
          title: 'Refresh Alerts',
          'aria-label': 'Refresh Alerts',
        }}
        className='flex items-center'
        disabled={refreshSearch}
        onClick={() => setRefreshSearch(true)}
        variant='icon'
      >
        <div className='me-2 text-black sm:hidden dark:text-gray-100'>
          Refresh
        </div>
        {refreshSearch && <Spinner />}
        {!refreshSearch && <FaRotate className='text-base' />}
      </Button>
      {dirty && (
        <button
          className='block rounded-full bg-white text-sm font-bold text-gray-400 underline sm:hidden dark:bg-gray-800'
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
