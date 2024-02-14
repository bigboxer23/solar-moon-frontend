import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { NavLink, redirect, useMatch, useNavigate } from 'react-router-dom';

import {
  AVG_AGGREGATION,
  DAY,
  getAggregationValue,
  GROUPED_BAR,
  parseCurrentPower,
  parseMaxData,
  parseSearchReturn,
  parseStackedTimeSeriesData,
  TOTAL_AGGREGATION,
} from '../../../services/search';
import { getSiteOverview } from '../../../services/services';
import {
  getDeviceIdToNameMap,
  getDisplayName,
  getRoundedTimeFromOffset,
  sortDevices,
  useStickyState,
} from '../../../utils/Utils';
import CurrentPowerBlock from '../../common/CurrentPowerBlock';
import Loader from '../../common/Loader';
import PowerBlock from '../../common/PowerBlock';
import StatBlock from '../../common/StatBlock';
import WeatherBlock from '../../common/WeatherBlock';
import StackedAlertsInfo from '../../device-block/StackedAlertsInfo';
import StackedTotAvg from '../../device-block/StackedTotAvg';
import TimeIncrementSelector from '../dashboard/TimeIncrementSelector';
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
  const [startDate, setStartDate] = useState(
    new Date(getRoundedTimeFromOffset(timeIncrement)),
  );
  const [graphType, setGraphType] = useStickyState('bar', 'graph.type');
  const match = useMatch('/sites/:siteId');
  const siteId = match?.params?.siteId;
  const [activeSiteAlerts, setActiveSiteAlerts] = useState([]);
  const [resolvedSiteAlerts, setResolvedSiteAlerts] = useState([]);
  const navigate = useNavigate();

  if (!siteId) {
    return redirect('/');
  }

  useEffect(() => {
    loadSiteOverview(siteId, timeIncrement, startDate, graphType, null);
  }, [timeIncrement, startDate]);

  /**
   * Switching between graph types doesn't need to re-fetch data from server unless we're moving to or from
   * the grouped bar type (b/c there's different bucket sizes used).
   *
   * If that type of change is detected, do the load, then set graph type
   */
  const setGraphTypeWrapper = (graphTypeToSet) => {
    if (graphTypeToSet === GROUPED_BAR || graphType === GROUPED_BAR) {
      loadSiteOverview(siteId, timeIncrement, startDate, graphTypeToSet, () =>
        setGraphType(graphTypeToSet),
      );
      return;
    }
    setGraphType(graphTypeToSet);
  };

  const loadSiteOverview = (site, time, start, type, callback) => {
    getSiteOverview(site, start, time, type).then(({ data }) => {
      if (data === null) {
        navigate('/');
        return;
      }
      setSiteData(data);
      setDevices(
        data.devices
          .filter((device) => !device.isSite)
          .filter((device) => device.site === data.site.name)
          .sort(sortDevices),
      );
      setActiveSiteAlerts(data.alarms.filter((d) => d.state > 0));
      setResolvedSiteAlerts(data.alarms.filter((d) => d.state === 0));
      setGraphData(
        data.site.subtraction
          ? parseSearchReturn(data.timeSeries)
          : parseStackedTimeSeriesData(
              data.timeSeries,
              getDeviceIdToNameMap(data.devices),
            ),
      );
      setLoading(false);
      if (callback) {
        callback();
      }
    });
  };

  const setTimeIncrementWrapper = (timeIncrement) => {
    setTimeIncrement(timeIncrement);
    setStartDate(new Date(getRoundedTimeFromOffset(timeIncrement)));
  };

  if (loading) {
    return (
      <div className='flex w-full items-center justify-center p-6'>
        <Loader />
      </div>
    );
  }

  return (
    <main className='SiteDetails flex flex-col items-center'>
      <div className='fade-in my-8 w-[55rem] max-w-full rounded-lg bg-white p-4 shadow-panel sm:p-8 dark:bg-gray-800'>
        <NavLink
          className='mb-4 flex items-center text-xs text-gray-500 hover:underline dark:text-gray-400'
          to='/'
        >
          <FaArrowLeft className='mr-2 inline-block' size='12' />
          <span>Back to dashboard</span>
        </NavLink>
        <div className='mb-4 flex justify-between'>
          <div className='flex flex-col'>
            <span className='text-lg font-bold text-black dark:text-gray-100'>
              {getDisplayName(siteData.site)}
            </span>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              {siteData?.site?.city &&
                siteData?.site?.state &&
                `${siteData.site.city}, ${siteData.site.state} ${siteData.localTime}`}
            </span>
          </div>
          <TimeIncrementSelector
            setTimeIncrement={setTimeIncrementWrapper}
            timeIncrement={timeIncrement}
          />
        </div>
        <div className='mb-4 flex justify-between'>
          <div className='flex flex-col md:flex-row md:items-center md:space-x-6'>
            <CurrentPowerBlock
              currentPower={parseCurrentPower(siteData?.weeklyMaxPower)}
              max={parseMaxData(siteData?.weeklyMaxPower)}
            />
            <WeatherBlock
              className='pr-2'
              weather={siteData?.weather}
              wrapperClassName='size-full sm:size-auto'
            />
            <StackedAlertsInfo
              activeAlerts={activeSiteAlerts.length}
              className='mt-2 hidden md:flex'
              onClick={() => navigate('/alerts')}
              resolvedAlerts={resolvedSiteAlerts.length}
            />
          </div>
          <div className='flex flex-col space-x-4 md:flex-row'>
            <PowerBlock
              className='hidden md:flex'
              power={getAggregationValue(siteData.total, TOTAL_AGGREGATION)}
              title='total'
            />
            <PowerBlock
              className='hidden md:flex'
              power={getAggregationValue(siteData.avg, AVG_AGGREGATION)}
              title='average'
            />
            <StackedTotAvg
              avg={getAggregationValue(siteData.avg, AVG_AGGREGATION)}
              className='ml-auto block items-end md:hidden'
              total={getAggregationValue(siteData.total, TOTAL_AGGREGATION)}
            />
            <StackedAlertsInfo
              activeAlerts={activeSiteAlerts.length}
              className='mt-2 flex items-end md:hidden'
              onClick={() => navigate('/alerts')}
              resolvedAlerts={resolvedSiteAlerts.length}
            />
          </div>
        </div>
        <SiteDetailsGraph
          deviceNames={devices.map((d) => getDisplayName(d))}
          graphData={graphData}
          graphType={graphType}
          setGraphType={setGraphTypeWrapper}
          setStartDate={setStartDate}
          startDate={startDate}
          timeIncrement={timeIncrement}
        />
        <SiteDevicesOverview
          activeSiteAlerts={activeSiteAlerts}
          avgData={siteData?.deviceAvg}
          devices={devices}
          maxData={siteData?.deviceWeeklyMaxPower}
          resolvedSiteAlerts={resolvedSiteAlerts}
          timeSeriesData={siteData?.deviceTimeSeries}
          totalData={siteData?.deviceTotals}
        />
      </div>
    </main>
  );
}
