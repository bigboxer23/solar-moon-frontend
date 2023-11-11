import { Button, Card, CardBody, CardHeader, Spinner } from "react-bootstrap";
import DataGrid from "react-data-grid";
import Loader from "../common/Loader";
import React, { useEffect, useRef, useState } from "react";
import { getAlarmData, getDevices } from "../../services/services";
import { MONTH } from "../../services/search";
import { getFormattedTime } from "../../utils/Utils";
import SearchBar from "../reports/SearchBar";
import { MdRefresh } from "react-icons/md";

const Alarms = () => {
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState("All Sites");
  const [device, setDevice] = useState("All Devices");
  const [devices, setDevices] = useState([]);
  const [start, setStart] = useState(new Date(new Date().getTime() - MONTH));
  const [end, setEnd] = useState(new Date());
  const gridRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [alarms, setAlarms] = useState([]);

  const columns = [
    {
      key: "formattedStartDate",
      name: "Start Date",
      width: 150,
    },
    {
      key: "formattedEndDate",
      name: "End Date",
      width: 150,
    },
    {
      key: "siteId",
      name: "Site",
      width: 150,
    },
    { key: "deviceId", name: "Device", width: 150 },
    { key: "message", name: "Message" },
  ];

  const EmptyRowsRenderer = () => {
    return (
      <div
        className={"fw-bolder h6 p-3"}
        style={{ textAlign: "center", gridColumn: "1/-1" }}
      >
        {alarms.length === 0
          ? "All devices reporting as healthy!"
          : "Nothing matches active filters."}
      </div>
    );
  };

  const getRow = function (row) {
    row.formattedStartDate = getFormattedTime(new Date(row["startDate"]));
    row.formattedEndDate = getFormattedTime(new Date(row["endDate"]));
    row.siteId =
      devices.find((device) => device.id === row.siteId)?.name || row.siteId;
    let d = devices.find((device) => device.id === row.deviceId);
    row.deviceId = d?.name || d?.deviceName || row.deviceId;
    return row;
  };

  const fetchDevices = () => {
    getDevices().then(({ data }) => {
      setDevices(data);
    });
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    if (devices.length === 0) {
      return;
    }
    getAlarmData()
      .then(({ data }) => {
        setLoading(false);
        setAlarms(
          data
            .sort((row, row2) => row2.startDate - row.startDate)
            .map((row) => getRow(row)),
        );
        document.getElementById("data-grid").classList.remove("d-none");
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [devices]);

  useEffect(() => {
    setRows(
      alarms
        .filter((alarm) => site === "All Sites" || alarm.siteId === site)
        .filter(
          (alarm) => device === "All Devices" || alarm.deviceId === device,
        )
        .filter((alarm) => alarm.startDate > start)
        .filter((alarm) => alarm.endDate < end),
    );
  }, [alarms, site, device, start, end]);

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
            defaultSearchPeriod={MONTH}
          />
          <Button
            id={"report-download-button"}
            className={"ms-3"}
            variant={"outline-light"}
            title={"Refresh Data"}
            onClick={() => fetchDevices()}
          >
            <MdRefresh style={{ marginBottom: "2px" }} />
          </Button>
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
            rowClass={(row, index) => {
              return row.state === 1 ? "active-alarm" : undefined;
            }}
          />
        </CardBody>
        <Loader loading={loading} deviceCount={rows.length} content={""} />
      </Card>
    </div>
  );
};

export default Alarms;
