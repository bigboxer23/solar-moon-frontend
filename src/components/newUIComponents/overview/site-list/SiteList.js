import { useEffect, useState } from 'react';
import SiteRow from './SiteRow';

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
    <div className='SiteList mt-5'>
      <div className='mb-6 text-lg font-bold'>Sites</div>
      <div className='mb-4 flex w-full items-center text-xs font-bold'>
        <div className='w-[15%] px-2'>Site Name</div>
        <div className='w-[15%] px-2 text-end'>Device Count</div>
        <div className='w-[15%] px-2 text-end'>Alert Count</div>
        <div className='w-[15%] px-2 text-end'>Average (kWH)</div>
        <div className='w-[15%] px-2 text-end'>Total (kWH)</div>
        <div className='w-1/4 px-2 text-end'></div>
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
