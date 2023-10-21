import { Button, Dropdown } from "react-bootstrap";
import { MdOutlineDateRange } from "react-icons/md";
import React from "react";
import { TbFilterCancel } from "react-icons/tb";

const SearchBar = ({ devices, site, setSite, device, setDevice }) => {
  return (
    <div id="reports-search" className={"d-flex d-none flex-wrap"}>
      <Button
        variant={"secondary"}
        title={"Search Date Range"}
        onClick={(e) => console.log("date range search")}
      >
        <MdOutlineDateRange
          style={{ marginBottom: "2px", marginRight: ".5rem" }}
        />
        Search
      </Button>
      <Dropdown className={"align-self-end ms-2"}>
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          {site}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {[{ id: "All Sites", name: "All Sites", virtual: true }, ...devices]
            .filter((device) => device.virtual)
            .map((d) => {
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
          {[{ id: "All Devices", name: "All Devices" }, ...devices]
            .filter((d) => {
              return (
                site === "All Sites" ||
                d.site === site ||
                d.name === "All Devices"
              );
            })
            .map((d) => {
              return (
                <Dropdown.Item
                  as="button"
                  key={d.id + "device"}
                  onClick={() => setDevice(d.name)}
                >
                  {d.name}
                </Dropdown.Item>
              );
            })}
        </Dropdown.Menu>
      </Dropdown>
      <Button
        className={"ms-2"}
        variant={"secondary"}
        title={"Search Date Range"}
        onClick={(e) => {
          setSite("All Sites");
          setDevice("All Devices");
        }}
      >
        <TbFilterCancel style={{ marginBottom: "2px" }} />
        <span className={"btn-txt"}>Reset Search</span>
      </Button>
    </div>
  );
};
export default SearchBar;
