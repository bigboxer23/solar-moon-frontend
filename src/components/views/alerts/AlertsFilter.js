import { useEffect, useState } from 'react';
import { FaRotate } from 'react-icons/fa6';
import { useSearchParams } from 'react-router-dom';

import { ALL } from '../../../services/search';
import Button from '../../common/Button';
import Dropdown from '../../common/Dropdown';
import Spinner from '../../common/Spinner';

export default function AlertsFilter({
  handleFilterChange,
  availableSites,
  availableDevices,
  refreshSearch,
  setRefreshSearch,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const allOption = { value: ALL, label: ALL };

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

  const [siteIdValue, setSiteIdValue] = useState(defaultSite);
  const [deviceIdValue, setDeviceIdValue] = useState(defaultDevice);
  const [dateValue, setDateValue] = useState([defaultStart, defaultEnd]);

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
    const searchParams = {};
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

    setSearchParams(searchParams);
  }, [deviceIdValue, siteIdValue]);

  function resetFilters() {
    setSearchParams({});
    setSiteIdValue(allOption);
    setDeviceIdValue(allOption);
    setDateValue([null, null]);
    setDirty(false);
  }

  function handleSiteFilterChange(siteOption) {
    setSiteIdValue(siteOption);
    setDeviceIdValue(allOption);
    setDirty(true);
  }

  function handleDeviceFilterChange(deviceOption) {
    setDeviceIdValue(deviceOption);
    setDirty(true);
  }

  return (
    <div className='AlertsFilter flex flex-col items-end space-y-3 sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0'>
      {dirty && (
        <button
          className='border-1 hidden bg-white text-sm font-bold text-gray-400 underline dark:bg-gray-800 sm:block sm:rounded-full'
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      )}

      <Dropdown
        onChange={handleSiteFilterChange}
        options={[allOption, ...availableSites]}
        prefixLabel='Site'
        value={siteIdValue}
      />
      <Dropdown
        onChange={handleDeviceFilterChange}
        options={[
          allOption,
          ...availableDevices.filter((d) => {
            return (
              siteIdValue.label === ALL ||
              d.site === siteIdValue.value ||
              d.name === ALL
            );
          }),
        ]}
        prefixLabel='Device'
        value={deviceIdValue}
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
        <div className='me-2 text-black dark:text-gray-100 sm:hidden'>
          Refresh
        </div>
        {refreshSearch && <Spinner />}
        {!refreshSearch && <FaRotate className='text-base' />}
      </Button>
      {dirty && (
        <button
          className='border-1 block rounded-full bg-white text-sm font-bold text-gray-400 underline dark:bg-gray-800 sm:hidden'
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
