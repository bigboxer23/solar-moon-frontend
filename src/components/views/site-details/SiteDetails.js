import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { FormattedNumber } from 'react-intl';
import { NavLink, redirect, useMatch, useNavigate } from 'react-router-dom';

import {
  AVG_AGGREGATION,
  DAY,
  getAggregationValue,
  GROUPED_BAR,
  parseSearchReturn,
  TOTAL_AGGREGATION,
} from '../../../services/search';
import { getSiteOverview } from '../../../services/services';
import {
  getDisplayName,
  parseStackedTimeSeriesData,
  sortDevices,
  useStickyState,
} from '../../../utils/Utils';
import Loader from '../../common/Loader';
import StatBlock from '../../common/StatBlock';
import WeatherBlock from '../../common/WeatherBlock';
import TimeIncrementSelector from '../dashboard/TimeIncrementSelector';
import DeviceChart from './DeviceChart';
import SiteDetailsGraph from './SiteDetailsGraph';
import SiteDevicesOverview from './SiteDevicesOverview';

export default function SiteDetails() {
  const [siteData, setSiteData] = useState({});
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [graphData, setGraphData] = useState();
  const [timeIncrement, setTimeIncrement] = useStickyState(
    DAY,
    'dashboard.time',
  );
  const [graphType, setGraphType] = useStickyState('bar', 'graph.type');
  const match = useMatch('/sites/:siteId');
  const siteId = match?.params?.siteId;
  const [activeSiteAlerts, setActiveSiteAlerts] = useState([]);
  const [resolvedSiteAlerts, setResolvedSiteAlerts] = useState([]);
  const navigate = useNavigate();

  if (!siteId) {
    return redirect('/sites');
  }

  useEffect(() => {
    loadSiteOverview(siteId, timeIncrement, graphType, null);
  }, [timeIncrement]);

  /**
   * Switching between graph types doesn't need to re-fetch data from server unless we're moving to or from
   * the grouped bar type (b/c there's different bucket sizes used).
   *
   * If that type of change is detected, do the load, then set graph type
   */
  const setGraphTypeWrapper = (graphTypeToSet) => {
    if (graphTypeToSet === GROUPED_BAR || graphType === GROUPED_BAR) {
      loadSiteOverview(siteId, timeIncrement, graphTypeToSet, () =>
        setGraphType(graphTypeToSet),
      );
      return;
    }
    setGraphType(graphTypeToSet);
  };

  const loadSiteOverview = (site, time, type, callback) => {
    getSiteOverview(site, time, type).then(({ data }) => {
      setSiteData(data);
      setDevices(
        data.devices
          .filter((device) => !device.virtual)
          .filter((device) => device.site === data.site.name)
          .sort(sortDevices),
      );
      setActiveSiteAlerts(data.alarms.filter((d) => d.state > 0));
      setResolvedSiteAlerts(data.alarms.filter((d) => d.state === 0));
      setGraphData(
        data.site.subtraction
          ? parseSearchReturn(data.timeSeries)
          : parseStackedTimeSeriesData(data.timeSeries),
      );
      setLoading(false);
      if (callback) {
        callback();
      }
    });
  };

  if (loading) {
    return (
      <div className='flex w-full items-center justify-center p-6'>
        <Loader />
      </div>
    );
  }

  return (
    <main className='SiteDetails flex flex-col items-center bg-brand-primary-light'>
      <div className='fade-in my-8 w-[55rem] max-w-full rounded-lg bg-white p-6 shadow-panel sm:p-8'>
        <NavLink
          className='mb-4 flex items-center text-xs text-neutral-500 hover:underline'
          to='/sites'
        >
          <FaArrowLeft className='mr-2 inline-block' size='12' />
          <span>Back to all sites</span>
        </NavLink>
        <div className='mb-2 flex justify-between'>
          <div className='flex flex-col'>
            <span className='text-lg font-bold'>
              {getDisplayName(siteData.site)}
            </span>
            <span className='text-sm text-neutral-500'>
              {siteData?.site?.city &&
                siteData?.site?.country &&
                siteData?.site?.state &&
                `${siteData.site.city}, ${siteData.site.state}, ${siteData.site.country}`}
            </span>
          </div>
          <TimeIncrementSelector
            setTimeIncrement={setTimeIncrement}
            timeIncrement={timeIncrement}
          />
        </div>
        <div className='mb-4 flex'>
          <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
            {siteData?.weather && (
              <WeatherBlock className='pr-2' weather={siteData?.weather} />
            )}
            <StatBlock title='devices' value={devices.length} />
            <StatBlock
              onClick={() => navigate(`/alerts?site=${siteId}`)}
              title='active alerts'
              value={activeSiteAlerts.length}
            />
            <StatBlock
              className='text-text-secondary'
              onClick={() => navigate(`/alerts?site=${siteId}`)}
              title='resolved alerts'
              value={resolvedSiteAlerts.length}
            />
          </div>
          <div className='ml-auto flex flex-col items-end'>
            <div className='flex flex-col space-x-1 text-end text-base sm:flex-row'>
              <div>Total:</div>
              <div>
                <FormattedNumber
                  value={getAggregationValue(siteData.total, TOTAL_AGGREGATION)}
                />{' '}
                kWH
              </div>
            </div>
            <div className='average-output flex flex-col space-x-1 text-end text-xl font-bold sm:flex-row'>
              <div>Average:</div>
              <div>
                <FormattedNumber
                  value={getAggregationValue(siteData.avg, AVG_AGGREGATION)}
                />{' '}
                kW
              </div>
            </div>
          </div>
        </div>
        {siteData.site.subtraction && <DeviceChart graphData={graphData} />}
        {!siteData.site.subtraction && (
          <SiteDetailsGraph
            deviceNames={devices.map((d) => getDisplayName(d))}
            graphData={graphData}
            graphType={graphType}
            setGraphType={setGraphTypeWrapper}
          />
        )}
        <SiteDevicesOverview
          activeSiteAlerts={activeSiteAlerts}
          avgData={siteData?.deviceAvg}
          devices={devices}
          resolvedSiteAlerts={resolvedSiteAlerts}
          timeSeriesData={siteData?.deviceTimeSeries}
          totalData={siteData?.deviceTotals}
        />
      </div>
    </main>
  );
}
