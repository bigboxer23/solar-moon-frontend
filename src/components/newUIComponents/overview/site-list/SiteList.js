import { useEffect, useState } from "react";
import { getListTimeSeriesData } from "../../../../services/services";
import SiteRow from "./SiteRow";
import { parseSearchReturn } from "../../../../services/search";

export default function SiteList({ sites, timeIncrement, devices, alerts }) {
  const [loading, setLoading] = useState(true);
  const [siteData, setSiteData] = useState([]);

  useEffect(() => {
    setLoading(true);
    getListTimeSeriesData(sites, timeIncrement).then(({ data }) => {
      const parsedData = data.map((d) => JSON.parse(d));
      const mappedSiteData = parsedData.map((d, i) => {
        const site = sites[i];
        const siteInfo = {
          ...site,
          deviceCount: devices.filter((d) => d.site === site.deviceName).length,
          alertCount: alerts.filter((d) => d.siteId === site.id).length,
        };

        return {
          info: siteInfo,
          graphData: parseSearchReturn(d),
        };
      });
      setSiteData(mappedSiteData);
      setLoading(false);
    });
  }, [sites, timeIncrement]);

  if (loading) return null;

  return (
    <div className="SiteList">
      <div className="title">Sites</div>
      <div className="site-table-header">
        <div className="site-name">Site Name</div>
        <div className="device-count">Device Count</div>
        <div className="alert-count">Alert Count</div>
        <div className="average">Average</div>
        <div className="total">Total</div>
        <div className="graph"></div>
      </div>
      {siteData.map((site) => (
        <SiteRow
          key={site.info.deviceName}
          info={site.info}
          graphData={site.graphData}
          timeIncrement={timeIncrement}
        />
      ))}
    </div>
  );
}
