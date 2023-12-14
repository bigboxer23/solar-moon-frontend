import Dropdown from "../common/Dropdown";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import moment from "moment";

export default function AlertsFilter({
  handleFilterChange,
  availableSites,
  availableDevices,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const allOption = { value: "all", label: "All" };

  const searchParamSite = searchParams.get("site");
  const searchParamDevice = searchParams.get("device");
  const searchParamStart = searchParams.get("start");
  const searchParamEnd = searchParams.get("end");

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
    if (siteValue.value !== "all") {
      searchParams.site = siteValue.value;
    }
    if (deviceValue.value !== "all") {
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
    setDirty(true);
  }

  function handleDeviceFilterChange(deviceOption) {
    setDeviceValue(deviceOption);
    setDirty(true);
  }

  function handleDateFilterChange([start, end]) {
    // TODO: set up dates filtering later
    setDateValue([null, null]);
    setDirty(true);
  }

  return (
    <div className="AlertsFilter flex items-center space-x-3">
      {dirty && (
        <button
          className="border-1 rounded-full py-1.5 px-4 bg-white text-sm font-bold text-black"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      )}
      <Dropdown
        prefixLabel={"Site"}
        options={[allOption, ...availableSites]}
        value={siteValue}
        onChange={handleSiteFilterChange}
      />
      <Dropdown
        prefixLabel={"Device"}
        options={[allOption, ...availableDevices]}
        value={deviceValue}
        onChange={handleDeviceFilterChange}
      />
      {/* TODO: set up dates filtering later */}
      {/*<DateRangePicker*/}
      {/*  className="alert-filter-date-range-picker"*/}
      {/*  onChange={handleDateFilterChange}*/}
      {/*  value={dateValue}*/}
      {/*/>*/}
    </div>
  );
}
