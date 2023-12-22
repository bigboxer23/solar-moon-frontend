import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ALL } from '../../../../services/search';
import Dropdown from '../../common/Dropdown';

export default function AlertsFilter({
  handleFilterChange,
  availableSites,
  availableDevices,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const allOption = { value: ALL, label: ALL };

  const searchParamSite = searchParams.get('site');
  const searchParamDevice = searchParams.get('device');
  const searchParamStart = searchParams.get('start');
  const searchParamEnd = searchParams.get('end');

  const defaultSite =
    availableSites.find((site) => site.value === searchParamSite) || allOption;

  const defaultDevice =
    availableDevices.find((device) => device.value === searchParamDevice) ||
    allOption;

  const defaultStart = searchParamStart
    ? moment.unix(searchParamStart).toDate()
    : null;

  const defaultEnd = searchParamEnd
    ? moment.unix(searchParamEnd).toDate()
    : null;

  const [dirty, setDirty] = useState(false);

  const [siteValue, setSiteValue] = useState(defaultSite);
  const [deviceValue, setDeviceValue] = useState(defaultDevice);
  const [dateValue, setDateValue] = useState([defaultStart, defaultEnd]);

  useEffect(() => {
    handleFilterChange({
      site: siteValue.value,
      device: deviceValue.value,
      start: dateValue[0] ? dateValue[0] : null,
      end: dateValue[1] ? dateValue[1] : null,
    });
  }, [deviceValue, siteValue, dateValue]);

  // Update search params when filters change
  useEffect(() => {
    const searchParams = {};
    if (siteValue.value !== ALL) {
      searchParams.site = siteValue.value;
    }
    if (deviceValue.value !== ALL) {
      searchParams.device = deviceValue.value;
    }

    if (dateValue[0] && dateValue[1]) {
      searchParams.start = null;
      searchParams.end = null;
    }

    setSearchParams(searchParams);
  }, [deviceValue, siteValue]);

  function resetFilters() {
    setSearchParams({});
    setSiteValue(allOption);
    setDeviceValue(allOption);
    setDateValue([null, null]);
    setDirty(false);
  }

  function handleSiteFilterChange(siteOption) {
    setSiteValue(siteOption);
    setDeviceValue(allOption);
    setDirty(true);
  }

  function handleDeviceFilterChange(deviceOption) {
    setDeviceValue(deviceOption);
    setDirty(true);
  }

  return (
    <div className='AlertsFilter flex flex-col items-end space-y-3 sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0'>
      {dirty && (
        <button
          className='border-1 hidden bg-white text-sm font-bold text-text-secondary underline sm:block sm:rounded-full'
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      )}
      <Dropdown
        onChange={handleSiteFilterChange}
        options={[allOption, ...availableSites]}
        prefixLabel='Site'
        value={siteValue}
      />
      <Dropdown
        onChange={handleDeviceFilterChange}
        options={[
          allOption,
          ...availableDevices.filter((d) => {
            return (
              siteValue.label === ALL ||
              d.site === siteValue.label ||
              d.name === ALL
            );
          }),
        ]}
        prefixLabel='Device'
        value={deviceValue}
      />
      {dirty && (
        <button
          className='border-1 block rounded-full bg-white text-sm font-bold text-text-secondary underline sm:hidden'
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
