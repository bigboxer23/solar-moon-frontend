import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import {
  AVG_AGGREGATION,
  getAggregationValue,
  parseCurrentPower,
  parseMaxData,
  TOTAL_AGGREGATION,
} from '../../../services/search';
import PowerBlock from '../../common/PowerBlock';
import WeatherBlock from '../../common/WeatherBlock';
import DeviceBlock from '../../device-block/DeviceBlock';
import StackedAlertsInfo from '../../device-block/StackedAlertsInfo';
import StackedTotAvg from '../../device-block/StackedTotAvg';
import MiniGraph from '../../graphs/MiniGraph';

export default function OverviewSiteList({
  sites,
  timeIncrement,
  devices,
  alerts,
  sitesGraphData,
}) {
  const [loading, setLoading] = useState(true);
  const [siteData, setSiteData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (sitesGraphData === null) {
      return;
    }
    const mappedSiteData = sites.map((site) => {
      const siteInfo = {
        ...site,
        deviceCount: devices.filter((d) => d.site === site.name).length,
        alertCount: alerts.filter((d) => d.siteId === site.id).length,
      };
      return {
        info: siteInfo,
        graphData: sitesGraphData[site.name],
      };
    });
    setSiteData(mappedSiteData);
    setLoading(false);
  }, [sitesGraphData]);

  if (loading) return null;

  console.log('siteData', siteData);

  //   setCurrent(parseCurrentPower(graphData.weeklyMaxPower)); //TODO: use these to display with PowerBlock
  //   setMax(parseMaxData(graphData.weeklyMaxPower));

  return (
    <div className='SiteList mt-5'>
      <div className='mb-6 text-lg font-bold text-black dark:text-neutral-100'>
        {sites.length} Sites
      </div>
      <div className='grid grid-cols-2 gap-4'>
        {siteData.map((site) => (
          <NavLink key={site.info.id} to={`/sites/${site.info.id}`}>
            <DeviceBlock
              body={
                <MiniGraph
                  className='mt-4'
                  graphData={site.graphData}
                  timeIncrement={timeIncrement}
                />
              }
              className='w-full'
              key={site.info.deviceName}
              statBlocks={[
                <PowerBlock
                  currentPower={parseCurrentPower(
                    site.graphData.weeklyMaxPower,
                  )}
                  key={0}
                  max={parseMaxData(site.graphData.weeklyMaxPower)}
                />,
                <StackedTotAvg
                  avg={getAggregationValue(site.graphData.avg, AVG_AGGREGATION)}
                  key={1}
                  total={getAggregationValue(
                    site.graphData.total,
                    TOTAL_AGGREGATION,
                  )}
                />,
                <WeatherBlock
                  className='pr-2'
                  key={2}
                  weather={site.weather}
                />,
                <StackedAlertsInfo
                  activeAlerts={site.info.alertCount}
                  key={3}
                  resolvedAlerts={site.info.alertCount}
                />,
              ]}
              subtitle={`- ${site.info.city}, ${site.info.state}`}
              title={site.info.name}
            />
          </NavLink>
        ))}
      </div>
    </div>
  );
}
