import { Button, Card, CardBody, CardHeader } from "react-bootstrap";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { getDataPage, getDevices } from "../../services/services";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { MdSearch } from "react-icons/md";
import Loader from "../common/Loader";
import SearchBar from "./SearchBar";
import { DAY } from "../../services/search";
import DownloadReportButton from "./DownloadReportButton";
import { useIntl } from "react-intl";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState("All Sites");
  const [device, setDevice] = useState("All Devices");
  const [start, setStart] = useState(new Date(new Date().getTime() - DAY));
  const [end, setEnd] = useState(new Date());
  const [devices, setDevices] = useState([]);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(-1);
  const gridRef = useRef(null);

  const intl = useIntl();
  useEffect(() => {
    fetchData(0, (rows) => setRows(rows), false);
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

  const getFormattedTime = (data) => {
    return d3.timeFormat("%b %d, %y %I:%M %p")(new Date(data["@timestamp"]));
  };

  const getRow = function (row) {
    row.time = getFormattedTime(row);
    if (row["Total Energy Consumption"] != null) {
      row["Total Energy Consumption"] = intl.formatNumber(
        row["Total Energy Consumption"],
      );
    }
    return row;
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    setTotal(-1);
    document.getElementById("data-grid").classList.add("d-none");
    fetchData(0, (rows) => setRows(rows), true);
  }, [site, device, start, end]);

  const fetchData = (offset, rowSetter, shouldScrollToTop) => {
    setLoading(true);
    getDataPage(
      site === "All Sites" ? null : site,
      device === "All Devices" ? null : device,
      start,
      end,
      offset,
      500,
    )
      .then(({ data }) => {
        setLoading(false);
        setTotal(data.hits.total.value);
        rowSetter(data.hits.hits.map((row) => getRow(row._source)));
        document.getElementById("data-grid").classList.remove("d-none");
        if (shouldScrollToTop) {
          scrollToTop();
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  };

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

  const EmptyRowsRenderer = () => {
    return (
      <div
        className={"fw-bolder h6 p-3"}
        style={{ textAlign: "center", gridColumn: "1/-1" }}
      >
        No data available, modify your search or set-up some devices!
      </div>
    );
  };

  const scrollToTop = () => {
    gridRef.current.scrollToCell({ rowIdx: 0, idx: 0 });
  };

  async function handleScroll(event) {
    if (loading || !isAtBottom(event) || rows.length === total) return;
    fetchData(rows.length, (r) => setRows([...rows, ...r]), false);
  }

  const isAtBottom = ({ currentTarget }) => {
    return (
      currentTarget.scrollTop + 10 >=
      currentTarget.scrollHeight - currentTarget.clientHeight
    );
  };

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
            <MdSearch className={"button-icon"} />
            Search
          </Button>
          <DownloadReportButton
            site={site}
            device={device}
            end={end}
            start={start}
            timeFormatter={getFormattedTime}
          />
        </CardHeader>
        <CardBody
          id={"data-grid"}
          className={"d-flex flex-column rdg-holder d-none"}
        >
          <DataGrid
            ref={gridRef}
            className={"rdg-dark flex-grow-1"}
            columns={columns}
            rows={rows}
            renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
            onScroll={handleScroll}
          />
        </CardBody>
        <Loader loading={loading} deviceCount={rows.length} content={""} />
      </Card>
    </div>
  );
};

export default Reports;
