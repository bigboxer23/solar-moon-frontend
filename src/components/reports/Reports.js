import { Card, CardBody } from "react-bootstrap";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { getDataPage } from "../../services/services";
import { useEffect, useState } from "react";
import * as d3 from "d3";

const Reports = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    getDataPage()
      .then(({ data }) => {
        setRows(data.hits.hits.map((row) => getRow(row._source)));
      })
      .catch((e) => console.log(e));
  }, []);

  const columns = [
    { key: "time", name: "Time" },
    { key: "site", name: "Site" },
    { key: "device-name", name: "Device Name" },
    { key: "Total Energy Consumption", name: "Total Energy Consumption" },
    { key: "Total Real Power", name: "Total Real Power" },
    { key: "Energy Consumed", name: "Energy Consumed" },
  ];

  const getRow = function (row) {
    row.time = d3.timeFormat("%b %d, %y %I:%M%p")(new Date(row["@timestamp"]));
    return row;
  };
  return (
    <div className={"root-page container min-vh-95 d-flex flex-column"}>
      <Card className={"flex-grow-1"}>
        <CardBody className={"d-flex flex-column"}>
          <DataGrid
            className={"rdg-dark flex-grow-1"}
            columns={columns}
            rows={rows}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default Reports;
