import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import {
  AVG_AGGREGATION,
  getAggregationValue,
  getInformationalErrorInfo,
  parseCurrentPower,
  parseMaxData,
  parseSearchReturn,
  TOTAL_AGGREGATION,
} from '../../../services/search';
import { getRoundedTimeFromOffset } from '../../../utils/Utils';
import CurrentPowerBlock from '../../common/CurrentPowerBlock';
import WeatherBlock from '../../common/WeatherBlock';
import DeviceBlock from '../../device-block/DeviceBlock';
import StackedAlertsInfo from '../../device-block/StackedAlertsInfo';
import StackedTotAvg from '../../device-block/StackedTotAvg';
import MiniChart from '../../graphs/MiniChart';

export default function OverviewSiteList({
  sites,
  devices,
  alerts,
  sitesGraphData,
  timeIncrement,
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
        deviceCount: devices
          .filter((d) => d.site === site.name)
          .filter((device) => !device.disabled).length,
        resolvedAlertCount: alerts
          .filter((d) => d.siteId === site.id)
          .filter((d) => d.state === 0).length,
        activeAlertCount: alerts
          .filter((d) => d.siteId === site.id)
          .filter((d) => d.state > 0).length,
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

  return (
    <div className='SiteList mt-5'>
      <span className='mb-6 flex items-center text-lg font-bold text-black dark:text-gray-100'>
        <div>{sites.length} Sites</div>
        <div className='ml-2 text-sm text-gray-400'>
          {devices.length} devices
        </div>
      </span>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {siteData.map((site) => (
          <NavLink key={site.info.id} to={`/sites/${site.info.id}`}>
            <DeviceBlock
              body={
                <MiniChart
                  graphData={parseSearchReturn(site.graphData.timeSeries)}
                  stepSize={20}
                />
              }
              className='w-full'
              informationalErrors={getInformationalErrorInfo(
                site.graphData.timeSeries,
              )}
              informationalErrorsLink={`/reports?siteId=${site.info.id}&start=${getRoundedTimeFromOffset(timeIncrement).getTime()}&end=${new Date().getTime()}&err=true`}
              key={site.info.deviceName}
              secondaryTitle={
                site.info?.city && site.info?.state
                  ? `${site.info.city}, ${site.info.state}`
                  : ' '
              }
              statBlocks={[
                <CurrentPowerBlock
                  currentPower={parseCurrentPower(
                    site.graphData.weeklyMaxPower,
                  )}
                  key={0}
                  max={parseMaxData(site.graphData.weeklyMaxPower)}
                />,
                <StackedTotAvg
                  avg={getAggregationValue(site.graphData.avg, AVG_AGGREGATION)}
                  className='items-end'
                  key={1}
                  total={getAggregationValue(
                    site.graphData.total,
                    TOTAL_AGGREGATION,
                  )}
                />,
                <WeatherBlock
                  className='pr-2'
                  key={2}
                  weather={site.graphData.weather}
                  wrapperClassName='min-h-[44px]'
                />,
                <StackedAlertsInfo
                  activeAlerts={site.info.activeAlertCount}
                  className='items-end'
                  key={3}
                  resolvedAlerts={site.info.resolvedAlertCount}
                />,
              ]}
              subtitle={`${site.info.deviceCount} devices`}
              title={site.info.name}
            />
          </NavLink>
        ))}
      </div>
    </div>
  );
}
