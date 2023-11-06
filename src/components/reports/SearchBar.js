import { Button, Dropdown } from "react-bootstrap";
import {
  MdClear,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import React, { useState } from "react";
import { TbFilterCancel } from "react-icons/tb";
import "react-day-picker/dist/style.css";
import { DAY } from "../../services/search";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";

const SearchBar = ({
  devices,
  site,
  setSite,
  device,
  setDevice,
  start,
  setStart,
  end,
  setEnd,
  resetSearch,
}) => {
  const [value, setValue] = useState([start, end]);

  const dateChanged = (date) => {
    if (date === null) {
      date = [new Date(new Date().getTime() - DAY), new Date()];
    }
    setValue(date);
    setStart(date[0]);
    setEnd(date[1]);
  };
  return (
    <div id="reports-search" className={"d-flex d-none flex-wrap"}>
      <DateRangePicker
        calendarIcon={null}
        clearIcon={<MdClear />}
        onChange={dateChanged}
        value={value}
        calendarType={"gregory"}
        prevLabel={<MdOutlineKeyboardArrowLeft className={"h3 mb-0"} />}
        prev2Label={<MdOutlineKeyboardDoubleArrowLeft className={"h3 mb-0"} />}
        nextLabel={<MdOutlineKeyboardArrowRight className={"h3 mb-0"} />}
        next2Label={<MdOutlineKeyboardDoubleArrowRight className={"h3 mb-0"} />}
      />
      <Dropdown className={"align-self-end ms-2"}>
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          {site}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {[
            { id: "All Sites", name: "All Sites", virtual: true },
            ...devices
              .filter((device) => device.virtual)
              .sort((d1, d2) =>
                (d1.name == null ? d1.deviceName : d1.name).localeCompare(
                  d2.name == null ? d2.deviceName : d2.name,
                  undefined,
                  { sensitivity: "accent" },
                ),
              ),
          ].map((d) => {
            return (
              <Dropdown.Item
                as="button"
                key={d.id}
                onClick={() => setSite(d.name)}
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
              .sort((d1, d2) =>
                (d1.name == null ? d1.deviceName : d1.name).localeCompare(
                  d2.name == null ? d2.deviceName : d2.name,
                  undefined,
                  { sensitivity: "accent" },
                ),
              ),
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
        className={"ms-2"}
        variant={"secondary"}
        title={"Search Date Range"}
        onClick={() => {
          setSite("All Sites");
          setDevice("All Devices");
          dateChanged(null);
          resetSearch();
        }}
      >
        <TbFilterCancel style={{ marginBottom: "2px" }} />
        <span className={"btn-txt"}>Reset Search</span>
      </Button>
    </div>
  );
};
export default SearchBar;
