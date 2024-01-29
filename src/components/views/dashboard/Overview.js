import { useEffect, useState } from 'react';
import { FormattedNumber } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import {
  AVG_AGGREGATION,
  DAY,
  getAggregationValue,
  TOTAL_AGGREGATION,
} from '../../../services/search';
import { getOverviewData } from '../../../services/services';
import {
  getRoundedTimeFromOffset,
  sortDevices,
  useStickyState,
} from '../../../utils/Utils';
import Loader from '../../common/Loader';
import StatBlock from '../../common/StatBlock';
import OverviewSiteList from './dashboard-site-list/OverviewSiteList';
import OverviewChart from './OverviewChart';
import SummaryHeader from './SummaryHeader';
import TimeIncrementSelector from './TimeIncrementSelector';

export default function Overview() {
  const [sites, setSites] = useState([]);
  const [devices, setDevices] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const [timeIncrement, setTimeIncrement] = useStickyState(
    DAY,
    'dashboard.time',
  );
  const [startDate, setStartDate] = useState(
    new Date(getRoundedTimeFromOffset(timeIncrement)),
  );
  const [totalOutput, setTotalOutput] = useState(0);
  const [averageOutput, setAverageOutput] = useState(0);
  const [overallTimeSeries, setOverallTimeSeries] = useState(null);
  const [sitesGraphData, setSitesGraphData] = useState(null);
  const [dailyOutputTotal, setDailyOutputTotal] = useState(0);
  const [dailyAverageOutput, setDailyAverageOutput] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const start = new Date(getRoundedTimeFromOffset(timeIncrement));
    setStartDate(start);
    loadOverview(startDate, timeIncrement);
  }, [timeIncrement]);

  useEffect(() => {
    loadOverview(startDate, timeIncrement);
  }, [startDate]);

  const loadOverview = (start, increment) => {
    getOverviewData(start, increment).then(({ data }) => {
      handleDevices(data.devices);
      handleAlarms(data.alarms);
      handleOverviewTotal(data.overall.avg, data.overall.total);
      setOverallTimeSeries(data.overall.timeSeries);
      setSitesGraphData(data.sitesOverviewData);
      handleSummaryHeader(data.overall);
      setLoading(false);
    });
  };

  const handleSummaryHeader = (data) => {
    setDailyOutputTotal(
      getAggregationValue(data.dailyEnergyConsumedTotal, TOTAL_AGGREGATION),
    );
    setDailyAverageOutput(data.dailyEnergyConsumedAverage);
  };

  const handleOverviewTotal = (avg, total) => {
    setTotalOutput(getAggregationValue(total, TOTAL_AGGREGATION));
    setAverageOutput(getAggregationValue(avg, AVG_AGGREGATION));
  };

  const handleAlarms = (data) => {
    const active = data.filter((d) => d.state > 0);
    const resolved = data.filter((d) => d.state === 0);

    const resolvedInTimeIncrement = resolved.filter((d) => {
      return (
        new Date(d.startDate) > new Date(new Date().getTime() - timeIncrement)
      );
    });

    setResolvedAlerts(resolvedInTimeIncrement);
    setActiveAlerts(active);
  };
  const handleDevices = (data) => {
    const sites = data.filter((d) => d.isSite).sort(sortDevices);
    const devices = data.filter((d) => !d.isSite);

    const mappedSites = sites.map((s) => {
      return {
        ...s,
        devices: devices.filter((d) => d.site === s.name),
      };
    });

    setDevices(devices);
    setSites(mappedSites);
  };

  if (loading) return <Loader />;

  return (
    <div className='flex max-w-full flex-col items-center'>
      <SummaryHeader
        dailyAverageOutput={dailyAverageOutput}
        dailyOutput={dailyOutputTotal}
      />
      <div className='Overview fade-in mb-8 w-[55rem] max-w-full bg-white p-6 shadow-panel sm:rounded-lg sm:p-8 dark:bg-neutral-700'>
        <div className='mb-4 flex w-full items-center justify-between text-lg font-bold text-black dark:text-neutral-100'>
          Overview
          <TimeIncrementSelector
            setTimeIncrement={setTimeIncrement}
            timeIncrement={timeIncrement}
          />
        </div>
        <div className='mb-6 flex justify-between'>
          <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
            <StatBlock
              className='text-black dark:text-neutral-100'
              title='sites'
              value={sites.length}
            />
            <StatBlock
              className='mr-2 text-black dark:text-neutral-100'
              title='devices'
              value={devices.length}
            />
            <StatBlock
              className={
                'cursor-pointer' +
                (activeAlerts > 0
                  ? ' text-danger'
                  : 'text-black dark:text-neutral-100')
              }
              onClick={() => navigate('/alerts')}
              title='active alerts'
              value={activeAlerts.length}
            />
            <StatBlock
              className='text-text-secondary'
              onClick={() => navigate('/alerts')}
              title='resolved alerts'
              value={resolvedAlerts.length}
            />
          </div>
          <div className='flex flex-col items-end'>
            <div className='flex flex-col space-x-1 text-end text-base text-black sm:flex-row dark:text-neutral-100'>
              <div>Total:</div>
              <div>
                <FormattedNumber value={totalOutput} /> kWH
              </div>
            </div>
            <div className='average-output flex flex-col space-x-1 text-end text-xl font-bold text-black sm:flex-row dark:text-neutral-100'>
              <div>Average:</div>
              <div>
                <FormattedNumber value={averageOutput} /> kW
              </div>
            </div>
          </div>
        </div>
        <OverviewChart
          overviewData={overallTimeSeries}
          setStartDate={setStartDate}
          sites={sites}
          sitesData={sitesGraphData}
          startDate={startDate}
          timeIncrement={timeIncrement}
        />
        <OverviewSiteList
          alerts={[...resolvedAlerts, ...activeAlerts]}
          devices={devices}
          sites={sites}
          sitesGraphData={sitesGraphData}
          timeIncrement={timeIncrement}
        />
      </div>
    </div>
  );
}
