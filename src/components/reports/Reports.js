import { Card, CardBody, CardHeader } from "react-bootstrap";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { getDataPage } from "../../services/services";
import React, { useEffect, useRef, useState } from "react";
import Loader from "../common/Loader";
import SearchBar from "./SearchBar";
import { DAY } from "../../services/search";
import DownloadReportButton from "./DownloadReportButton";
import { useIntl } from "react-intl";
import {
  getFormattedTime,
  getRoundedTime,
  getWeatherIcon,
  useSearchParamState,
} from "../../utils/Utils";
import { useSearchParams } from "react-router-dom";

const Reports = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useSearchParamState(
    "All Sites",
    "site",
    searchParams,
    setSearchParams,
  );
  const [device, setDevice] = useSearchParamState(
    "All Devices",
    "device",
    searchParams,
    setSearchParams,
  );

  const [start, setStart] = useSearchParamState(
    getRoundedTime(false, DAY).getTime(),
    "start",
    searchParams,
    setSearchParams,
  );
  const [end, setEnd] = useSearchParamState(
    getRoundedTime(true, 0).getTime(),
    "end",
    searchParams,
    setSearchParams,
  );
  const [devices, setDevices] = useState([]);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(-1);
  const [refreshSearch, setRefreshSearch] = useState(false);
  const gridRef = useRef(null);

  const intl = useIntl();
  useEffect(() => {
    fetchData(0, (rows) => setRows(rows), true);
  }, []);

  const WeatherRowRenderer = (row) => {
    const temperature =
      row.row["temperature"] === undefined
        ? ""
        : Math.round(row.row["temperature"]) + "°F";
    return (
      <div
        className={"d-flex justify-content-center h-100"}
        title={row.row["weatherSummary"] + " " + temperature}
      >
        {getWeatherIcon(row.row["weatherSummary"])}
      </div>
    );
  };

  const columns = [
    {
      key: "weatherSummary",
      name: (
        <div
          className="d-flex h-100 align-items-center justify-content-center"
          title="Weather Conditions"
        >
          {getWeatherIcon("Partly Cloudy")}
        </div>
      ),
      width: 50,
      renderCell: WeatherRowRenderer,
    },
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
    row.time = getFormattedTime(new Date(row["@timestamp"]));
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
    document.getElementById("data-grid").classList.add("d-none");
    fetchData(0, (rows) => setRows(rows), true);
  }, [site, device, start, end]);

  useEffect(() => {
    if (loading || !refreshSearch) {
      return;
    }
    fetchData(0, (rows) => setRows(rows), true);
  }, [refreshSearch]);

  const fetchData = (offset, rowSetter, shouldScrollToTop) => {
    setLoading(true);
    setTotal(shouldScrollToTop ? -1 : total);
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
        setRefreshSearch(false);
        setTotal(data.hits.total.value);
        rowSetter(data.hits.hits.map((row) => getRow(row._source)));
        document.getElementById("data-grid").classList.remove("d-none");
        if (shouldScrollToTop) {
          scrollToTop();
        }
      })
      .catch((e) => {
        setLoading(false);
        setRefreshSearch(false);
      });
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
            site={site}
            setSite={setSite}
            device={device}
            setDevice={setDevice}
            end={end}
            setEnd={setEnd}
            start={start}
            setStart={setStart}
            devices={devices}
            setDevices={setDevices}
            defaultSearchPeriod={DAY}
            refreshSearch={refreshSearch}
            setRefreshSearch={setRefreshSearch}
          />
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
