import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { NavLink, redirect, useMatch } from 'react-router-dom';

import { DAY } from '../../../../services/search';
import {
  getDevices,
  getStackedTimeSeriesData,
} from '../../../../services/services';
import {
  getRoundedTimeFromOffset,
  parseStackedTimeSeriesData,
  useStickyState,
} from '../../../../utils/Utils';
import Loader from '../../common/Loader';
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
  const match = useMatch('/sites/:siteId');
  const siteId = match?.params?.siteId;

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
  }, [timeIncrement]);

  useEffect(() => {
    getDevices().then(({ data }) => {
      const site = data.find((d) => d.id === siteId);
      setSite(site);

      const devices = data
        .filter((device) => !device.virtual)
        .filter((device) => device.site === site.name);

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
        <div className='mb-4 flex justify-between'>
          <div className='flex flex-col'>
            <span className='text-lg font-bold'>{site.deviceName}</span>
            <span className='text-xs text-neutral-400'>{site.clientId}</span>
            <span className='text-sm text-neutral-500'>
              {`${site.city}, ${site.country}`}
            </span>
          </div>
          <TimeIncrementSelector
            setTimeIncrement={setTimeIncrement}
            timeIncrement={timeIncrement}
          />
        </div>
        <SiteDetailsGraph
          deviceNames={devices.map((d) => d.deviceName)}
          graphData={graphData}
        />
        <SiteDevicesOverview devices={devices} timeIncrement={timeIncrement} />
      </div>
    </main>
  );
}
