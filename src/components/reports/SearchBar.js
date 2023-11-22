import { Button, Dropdown, Spinner } from "react-bootstrap";
import {
  MdClear,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
  MdRefresh,
  MdSearch,
} from "react-icons/md";
import React, { useState } from "react";
import { TbFilterCancel } from "react-icons/tb";
import "react-day-picker/dist/style.css";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import { getDevices } from "../../services/services";
import { getRoundedTime, sortDevices } from "../../utils/Utils";

const SearchBar = ({
  devices,
  setDevices,
  site,
  setSite,
  device,
  setDevice,
  start,
  setStart,
  end,
  setEnd,
  defaultSearchPeriod,
  refreshSearch,
  setRefreshSearch,
}) => {
  const [value, setValue] = useState([
    new Date(Number(start)),
    new Date(Number(end)),
  ]);

  const resetSearch = () => {
    setSite("All Sites");
    setDevice("All Devices");
    dateChanged(null);
    document.getElementById("reports-search").classList.add("d-none");
    document.getElementById("reports-search-button").classList.remove("d-none");
  };

  const loadSearches = () => {
    document.getElementById("reports-search").classList.remove("d-none");
    document.getElementById("reports-search-button").classList.add("d-none");
    if (devices.length === 0) {
      getDevices().then(({ data }) => {
        setDevices(data);
      });
    }
  };

  const dateChanged = (date) => {
    if (date === null) {
      date = [
        getRoundedTime(false, defaultSearchPeriod),
        getRoundedTime(true, 0),
      ];
    }
    setValue(date);
    setStart(date[0].getTime());
    setEnd(date[1].getTime());
  };

  return (
    <div className={"flex-grow-1 d-flex"}>
      <div id="reports-search" className={"d-flex d-none flex-wrap"}>
        <DateRangePicker
          calendarIcon={null}
          clearIcon={<MdClear />}
          onChange={dateChanged}
          value={value}
          calendarType={"gregory"}
          prevLabel={<MdOutlineKeyboardArrowLeft className={"h3 mb-0"} />}
          prev2Label={
            <MdOutlineKeyboardDoubleArrowLeft className={"h3 mb-0"} />
          }
          nextLabel={<MdOutlineKeyboardArrowRight className={"h3 mb-0"} />}
          next2Label={
            <MdOutlineKeyboardDoubleArrowRight className={"h3 mb-0"} />
          }
        />
        <Dropdown className={"align-self-end ms-2"}>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            {site}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {[
              { id: "All Sites", name: "All Sites", virtual: true },
              ...devices.filter((device) => device.virtual).sort(sortDevices),
            ].map((d) => {
              return (
                <Dropdown.Item
                  as="button"
                  key={d.id}
                  onClick={() => {
                    setSite(d.name);
                    setDevice("All Devices");
                  }}
                >
                  {d.name}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className={"align-self-end ms-2"}>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            {device}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {[
              { id: "All Devices", name: "All Devices" },
              ...devices
                .filter((d) => {
                  return (
                    site === "All Sites" ||
                    d.site === site ||
                    d.name === "All Devices"
                  );
                })
                .sort(sortDevices),
            ].map((d) => {
              return (
                <Dropdown.Item
                  as="button"
                  key={d.id + "device"}
                  onClick={() => setDevice(d.name)}
                >
                  {d.name == null ? d.deviceName : d.name}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
        <Button
          id={"report-download-button"}
          className={(refreshSearch ? "disabled " : "") + "ms-2"}
          variant={"secondary"}
          title={"Refresh Data"}
          onClick={() => setRefreshSearch(true)}
        >
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            className={"d-none"}
          />
          <MdRefresh style={{ marginBottom: "2px" }} />
        </Button>
        <Button
          className={"ms-2"}
          variant={"secondary"}
          title={"Reset Search"}
          onClick={() => resetSearch()}
        >
          <TbFilterCancel style={{ marginBottom: "2px" }} />
          <span className={"btn-txt"}>Reset Search</span>
        </Button>
      </div>
      <div className={"flex-grow-1"} />
      <Button
        id={"reports-search-button"}
        className={"ms-3"}
        variant={"primary"}
        title={"Search"}
        onClick={(e) => loadSearches()}
      >
        <MdSearch className={"button-icon"} />
        Search
      </Button>
    </div>
  );
};
export default SearchBar;
