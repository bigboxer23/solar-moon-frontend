import { getDataPage } from "../../services/services";
import { MdDownload } from "react-icons/md";
import { Button, Spinner } from "react-bootstrap";
import { jsons2csv } from "react-csv/lib/core";

const DownloadReportButton = ({ site, device, start, end, timeFormatter }) => {
  const headers = [
    { key: "time", label: "Time" },
    { key: "site", label: "Site" },
    { key: "device-name", label: "Device Name" },
    {
      key: "Total Energy Consumption",
      label: "Total Energy Consumption (kWH)",
    },
    {
      key: "Total Real Power",
      label: "Total Power (kW)",
    },
    {
      key: "Energy Consumed",
      label: "Energy Consumed (kWH)",
    },
  ];

  return (
    <Button
      id={"report-download-button"}
      className={"ms-3"}
      variant={"outline-light"}
      title={"Download"}
      onClick={() => {
        document
          .getElementById("report-download-button")
          .classList.add("disabled");
        getDataPage(
          site === "All Sites" ? null : site,
          device === "All Devices" ? null : device,
          start,
          end,
          0,
        )
          .then(({ data }) => {
            let transformed = data.hits.hits.map((row) => {
              row._source.time = timeFormatter(row._source);
              return row._source;
            });
            const url = window.URL.createObjectURL(
              new Blob([jsons2csv(transformed, headers, ",", '"')]),
            );
            const link = document.createElement("a");
            link.href = url;
            const fileName = `downloaded Report.csv`;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            document
              .getElementById("report-download-button")
              .classList.remove("disabled");
          })
          .catch((e) => {
            document
              .getElementById("report-download-button")
              .classList.remove("disabled");
            console.log(e);
          });
      }}
    >
      <MdDownload style={{ marginBottom: "2px" }} />
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        className={"d-none"}
      />
      <span className={"btn-txt"}>Download</span>
    </Button>
  );
};
export default DownloadReportButton;
