import { useEffect, useState } from "react";
import SiteRow from "./SiteRow";

export default function SiteList({
  sites,
  timeIncrement,
  devices,
  alerts,
  sitesGraphData,
}) {
  const [loading, setLoading] = useState(true);
  const [siteData, setSiteData] = useState([]);

  useEffect(() => {
    if (sitesGraphData === null) {
      return;
    }
    const mappedSiteData = sites.map((site) => {
      const siteInfo = {
        ...site,
        deviceCount: devices.filter((d) => d.site === site.deviceName).length,
        alertCount: alerts.filter((d) => d.siteId === site.id).length,
      };
      return {
        info: siteInfo,
        graphData: sitesGraphData[site.deviceName],
      };
    });
    setSiteData(mappedSiteData);
    setLoading(false);
  }, [sitesGraphData]);

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
