import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { FormattedNumber } from 'react-intl';
import { NavLink, redirect, useMatch, useNavigate } from 'react-router-dom';

import {
  AVG_AGGREGATION,
  DAY,
  TOTAL_AGGREGATION,
} from '../../../../services/search';
import {
  getAlarmData,
  getAvgTotal,
  getDevices,
  getStackedTimeSeriesData,
} from '../../../../services/services';
import {
  getRoundedTimeFromOffset,
  parseStackedTimeSeriesData,
  sortDevices,
  useStickyState,
} from '../../../../utils/Utils';
import Loader from '../../common/Loader';
import StatBlock from '../../common/StatBlock';
import TimeIncrementSelector from '../dashboard/TimeIncrementSelector';
import SiteDetailsGraph from './SiteDetailsGraph';
import SiteDevicesOverview from './SiteDevicesOverview';

export default function SiteDetails() {
  // TODO: Should all be one loading from the single site overview endpoint
  const [loading, setLoading] = useState(true);
  const [graphLoading, setGraphLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [graphData, setGraphData] = useState();
  const [timeIncrement, setTimeIncrement] = useStickyState(
    DAY,
    'dashboard.time',
  );
  const [site, setSite] = useState({});
  const [avgOutput, setAvgOutput] = useState(0);
  const [totalOutput, setTotalOutput] = useState(0);
  const match = useMatch('/sites/:siteId');
  const siteId = match?.params?.siteId;
  const [activeSiteAlerts, setActiveSiteAlerts] = useState([]);
  const [resolvedSiteAlerts, setResolvedSiteAlerts] = useState([]);
  const navigate = useNavigate();

  if (!siteId) {
    return redirect('/sites');
  }

  // TODO: This data should all come from a single site overview endpoint

  useEffect(() => {
    getStackedTimeSeriesData(
      siteId,
      getRoundedTimeFromOffset(timeIncrement),
      new Date(),
    )
      .then(({ data }) => {
        const parsedData = parseStackedTimeSeriesData(data);
        setGraphData(parsedData);
        setGraphLoading(false);
      })
      .catch((e) => console.log(e));
    getAvgTotal(site, timeIncrement).then(({ data }) => {
      setAvgOutput(data.aggregations[AVG_AGGREGATION].value);
      setTotalOutput(data.aggregations[TOTAL_AGGREGATION].value);
    });
    getAlarmData().then(({ data }) => {
      const timeFilteredAlerts = data.filter((alert) => {
        return (
          new Date(alert.startDate) >
          new Date(new Date().getTime() - timeIncrement)
        );
      });
      const siteAlerts = timeFilteredAlerts.filter(
        (alert) => alert.deviceSite === site.name,
      );

      setActiveSiteAlerts(siteAlerts.filter((d) => d.state > 0));
      setResolvedSiteAlerts(siteAlerts.filter((d) => d.state === 0));
    });
  }, [timeIncrement]);

  useEffect(() => {
    getDevices().then(({ data }) => {
      const site = data.find((d) => d.id === siteId);
      setSite(site);

      const devices = data
        .filter((device) => !device.virtual)
        .filter((device) => device.site === site.name)
        .sort(sortDevices);

      setDevices(devices);
      setLoading(false);
    });
  }, []);

  if (loading || graphLoading) {
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
            <span className='text-lg font-bold'>{site.deviceName}</span>
            <span className='text-xs text-text-secondary'>
              id: {site.clientId}
            </span>
            <span className='text-sm text-neutral-500'>
              {site.city && site.country && `${site.city}, ${site.country}`}
            </span>
          </div>
          <TimeIncrementSelector
            setTimeIncrement={setTimeIncrement}
            timeIncrement={timeIncrement}
          />
        </div>
        <div className='mb-4 flex space-x-4'>
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
          <div className='ml-auto flex w-full flex-col items-end'>
            <span className='text-base'>
              Total: <FormattedNumber value={totalOutput} /> kWH
            </span>
            <span className='text-lg font-bold'>
              Average: <FormattedNumber value={avgOutput} /> kW
            </span>
          </div>
        </div>
        <SiteDetailsGraph
          deviceNames={devices.map((d) => d.deviceName)}
          graphData={graphData}
        />
        <SiteDevicesOverview
          activeSiteAlerts={activeSiteAlerts}
          devices={devices}
          resolvedSiteAlerts={resolvedSiteAlerts}
          timeIncrement={timeIncrement}
        />
      </div>
    </main>
  );
}
