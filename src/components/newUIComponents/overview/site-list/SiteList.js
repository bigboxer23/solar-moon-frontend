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
        <div className='w-[20%] pr-1 sm:w-[15%]'>Site Name</div>
        <div className='hidden text-end sm:block sm:w-[15%]'>Device Count</div>
        <div className='w-[10%] px-1 text-end sm:w-[15%]'>Alerts</div>
        <div className='hidden text-end sm:block sm:w-[15%]'>
          Average <span className='text-text-secondary'>kW</span>
        </div>
        <div className='w-[20%] px-1 text-end sm:hidden'>
          Avg <span className='text-text-secondary'>kW</span>
        </div>
        <div className='w-[20%] px-1 text-end sm:w-[15%]'>
          Total <span className='text-text-secondary'>kWH</span>
        </div>
        <div className='h-full w-[30%] text-end sm:w-1/4'></div>
      </div>
      {siteData.map((site) => (
        <SiteRow
          graphData={site.graphData}
          info={site.info}
          key={site.info.deviceName}
          timeIncrement={timeIncrement}
        />
      ))}
    </div>
  );
}
