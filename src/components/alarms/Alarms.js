import { Card, CardBody, CardHeader } from "react-bootstrap";
import DataGrid from "react-data-grid";
import Loader from "../common/Loader";
import React, { useEffect, useRef, useState } from "react";
import { getAlarmData, getDevices } from "../../services/services";
import { MONTH } from "../../services/search";
import { getFormattedTime } from "../../utils/Utils";
import SearchBar from "../reports/SearchBar";
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
      key: "state",
      name: "State",
      width: 150,
    },
    {
      key: "siteId",
      name: "Site",
    },
    { key: "deviceId", name: "Device" },
    { key: "message", name: "Message" },
  ];

  const EmptyRowsRenderer = () => {
    return (
      <div
        className={"fw-bolder h6 p-3"}
        style={{ textAlign: "center", gridColumn: "1/-1" }}
      >
        All devices reporting as healthy!
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

  useEffect(() => {
    getDevices().then(({ data }) => {
      setLoading(false);
      setDevices(data);
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
    });
  }, []);

  useEffect(() => {
    console.log("set alarms " + alarms.length);
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
          />
        </CardBody>
        <Loader loading={loading} deviceCount={rows.length} content={""} />
      </Card>
    </div>
  );
};

export default Alarms;
