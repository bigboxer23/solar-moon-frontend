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
    <div className="SiteList mt-5">
      <div className="text-lg font-bold mb-6">Sites</div>
      <div className="w-full text-xs font-bold items-center mb-4 flex">
        <div className="w-[15%] px-2">Site Name</div>
        <div className="w-[15%] text-end px-2">Device Count</div>
        <div className="w-[15%] text-end px-2">Alert Count</div>
        <div className="w-[15%] text-end px-2">Average (kWH)</div>
        <div className="w-[15%] text-end px-2">Total (kWH)</div>
        <div className="w-1/4 text-end px-2"></div>
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
