import { Button, Card, CardBody, CardHeader, Dropdown } from "react-bootstrap";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { getDataPage, getDevices } from "../../services/services";
import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { MdDownload, MdOutlineDateRange, MdSearch } from "react-icons/md";
import Loader from "../common/Loader";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState("All Sites");
  const [device, setDevice] = useState("All Devices");
  const [devices, setDevices] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getDataPage()
      .then(({ data }) => {
        setLoading(false);
        setRows(data.hits.hits.map((row) => getRow(row._source)));
        document.getElementById("data-grid").classList.remove("d-none");
      })
      .catch((e) => console.log(e));
  }, []);

  const columns = [
    { key: "time", name: "Time", width: 150 },
    { key: "site", name: "Site" },
    { key: "device-name", name: "Device Name" },
    {
      key: "Total Energy Consumption",
      name: (
        <div className={"d-flex"}>
          Total Energy Cons.
          <div className={"text-muted rdg-header-secondary"}>&nbsp; kWH</div>
        </div>
      ),
    },
    {
      key: "Total Real Power",
      name: (
        <div className={"d-flex"}>
          Total Power
          <div className={"text-muted rdg-header-secondary"}>&nbsp; kW</div>
        </div>
      ),
    },
    {
      key: "Energy Consumed",
      name: (
        <div className={"d-flex"}>
          Energy Cons.{" "}
          <div className={"text-muted rdg-header-secondary"}>&nbsp; kWH</div>
        </div>
      ),
    },
  ];

  const getRow = function (row) {
    row.time = d3.timeFormat("%b %d, %y %I:%M %p")(new Date(row["@timestamp"]));
    return row;
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    console.log("site or device changed");
  }, [site, device]);
  const loadSearches = function (searchButton) {
    document.getElementById("reports-search").classList.remove("d-none");
    searchButton.classList.add("d-none");
    getDevices().then(({ data }) => {
      setDevices(data);
    });
  };

  return (
    <div className={"root-page container min-vh-95 d-flex flex-column"}>
      <Card className={"flex-grow-1"}>
        <CardHeader className={"d-flex"}>
          <div id="reports-search" className={"d-flex d-none"}>
            <Button
              variant={"secondary"}
              title={"Search"}
              onClick={(e) => loadSearches(e.target)}
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
                {[
                  { id: "All Sites", name: "All Sites", virtual: true },
                  ...devices,
                ]
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
                {[{ id: "All Devices", name: "All Devices" }, ...devices].map(
                  (d) => {
                    return (
                      <Dropdown.Item
                        as="button"
                        key={d.id + "device"}
                        onClick={() => setDevice(d.name)}
                      >
                        {d.name}
                      </Dropdown.Item>
                    );
                  },
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className={"flex-grow-1"} />
          <Button
            className={"ms-3"}
            variant={"primary"}
            title={"Search"}
            onClick={(e) => loadSearches(e.target)}
          >
            <MdSearch style={{ marginBottom: "2px", marginRight: ".5rem" }} />
            Search
          </Button>
          <Button
            className={"ms-3"}
            variant={"outline-light"}
            title={"Download"}
            onClick={() => console.log("download")}
          >
            <MdDownload style={{ marginBottom: "2px", marginRight: ".5rem" }} />
            Download
          </Button>
        </CardHeader>
        <CardBody
          id={"data-grid"}
          className={"d-flex flex-column rdg-holder d-none"}
        >
          <DataGrid
            className={"rdg-dark flex-grow-1"}
            columns={columns}
            rows={rows}
          />
        </CardBody>
        <Loader
          loading={loading}
          deviceCount={rows.length}
          content={"There is no data to display."}
        />
      </Card>
    </div>
  );
};

export default Reports;
