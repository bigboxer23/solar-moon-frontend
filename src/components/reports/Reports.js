import { Button, Card, CardBody, CardHeader, Dropdown } from "react-bootstrap";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { getDataPage, getDevices } from "../../services/services";
import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { MdDownload, MdSearch } from "react-icons/md";
import Loader from "../common/Loader";
import SearchBar from "./SearchBar";
import { DAY } from "../../services/search";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState("All Sites");
  const [device, setDevice] = useState("All Devices");
  const [start, setStart] = useState(new Date(new Date().getTime() - DAY));
  const [end, setEnd] = useState(new Date());
  const [devices, setDevices] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getDataPage(
      site === "All Sites" ? null : site,
      device === "All Devices" ? null : device,
      start,
      end,
    )
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
    getDataPage(
      site === "All Sites" ? null : site,
      device === "All Devices" ? null : device,
      start,
      end,
    )
      .then(({ data }) => {
        setRows(data.hits.hits.map((row) => getRow(row._source)));
      })
      .catch((e) => console.log(e));
  }, [site, device, start, end]);
  const loadSearches = (searchButton) => {
    document.getElementById("reports-search").classList.remove("d-none");
    searchButton.classList.add("d-none");
    getDevices().then(({ data }) => {
      setDevices(data);
    });
  };

  const resetSearch = () => {
    document.getElementById("reports-search").classList.add("d-none");
    document.getElementById("reports-search-button").classList.remove("d-none");
  };
  function EmptyRowsRenderer() {
    return (
      <div
        className={"fw-bolder h6 p-3"}
        style={{ textAlign: "center", gridColumn: "1/-1" }}
      >
        No data available, modify your search or set-up some devices!
      </div>
    );
  }

  return (
    <div className={"root-page container min-vh-95 d-flex flex-column"}>
      <Card className={"flex-grow-1"}>
        <CardHeader className={"d-flex"}>
          <SearchBar
            devices={devices}
            site={site}
            setSite={setSite}
            device={device}
            setDevice={setDevice}
            end={end}
            setEnd={setEnd}
            start={start}
            setStart={setStart}
            resetSearch={resetSearch}
          />
          <div className={"flex-grow-1"} />
          <Button
            id={"reports-search-button"}
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
            <MdDownload style={{ marginBottom: "2px" }} />
            <span className={"btn-txt"}>Download</span>
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
            renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
          />
        </CardBody>
        <Loader loading={loading} deviceCount={rows.length} content={""} />
      </Card>
    </div>
  );
};

export default Reports;
