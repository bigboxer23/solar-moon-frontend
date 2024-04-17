import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AVG_AGGREGATION,
  DAY,
  getAggregationValue,
  parseCurrentPower,
  parseMaxData,
  TOTAL_AGGREGATION,
} from '../../../services/search';
import { getOverviewData } from '../../../services/services';
import {
  getRoundedTimeFromOffset,
  sortDevices,
  useStickyState,
} from '../../../utils/Utils';
import CurrentPowerBlock from '../../common/CurrentPowerBlock';
import Error from '../../common/Error';
import Loader from '../../common/Loader';
import PowerBlock from '../../common/PowerBlock';
import StatBlock from '../../common/StatBlock';
import StackedAlertsInfo from '../../device-block/StackedAlertsInfo';
import StackedTotAvg from '../../device-block/StackedTotAvg';
import OverviewChart from './OverviewChart';
import OverviewSiteList from './OverviewSiteList';
import SummaryHeader from './SummaryHeader';
import TimeIncrementSelector from './TimeIncrementSelector';

export default function Overview() {
  const [error, setError] = useState(false);
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
  const [maxPower, setMaxPower] = useState(0);
  const [currentPower, setCurrentPower] = useState(0);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getOverviewData(startDate, timeIncrement)
      .then(({ data }) => {
        if (data.devices.length === 0) {
          window.location.href = '/manage';
          return;
        }
        handleDevices(data.devices);
        handleAlarms(data.alarms);
        handleOverviewTotal(data.overall.avg, data.overall.total);
        handleMax(data.sitesOverviewData);
        setOverallTimeSeries(data.overall.timeSeries);
        setSitesGraphData(data.sitesOverviewData);
        handleSummaryHeader(data.overall);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(true);
      });
  }, [timeIncrement, startDate]);

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
    setResolvedAlerts(data.filter((d) => d.state === 0));
    setActiveAlerts(data.filter((d) => d.state > 0));
  };

  const handleMax = (data) => {
    let max = 0;
    let currentPower = 0;
    Object.entries(data).forEach(([siteName, data]) => {
      max += parseMaxData(data?.weeklyMaxPower);
      currentPower += parseCurrentPower(data?.weeklyMaxPower);
    });
    setMaxPower(max);
    setCurrentPower(currentPower);
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

  const setTimeIncrementWrapper = (timeIncrement) => {
    setTimeIncrement(timeIncrement);
    setStartDate(new Date(getRoundedTimeFromOffset(timeIncrement)));
  };

  if (loading) return <Loader />;

  if (error) return <Error />;

  return (
    <div className='flex max-w-full flex-col items-center'>
      <SummaryHeader
        dailyAverageOutput={dailyAverageOutput}
        dailyOutput={dailyOutputTotal}
      />
      <div className='Overview fade-in mb-8 w-[55rem] max-w-full bg-white p-4 shadow-panel dark:bg-gray-800 sm:rounded-lg sm:p-8'>
        <div className='mb-4 flex w-full items-center justify-between text-lg font-bold text-black dark:text-gray-100'>
          Overview
          <TimeIncrementSelector
            setTimeIncrement={setTimeIncrementWrapper}
            timeIncrement={timeIncrement}
          />
        </div>
        <div className='mb-6 flex justify-between'>
          <div className='flex flex-row items-start space-x-6 sm:items-center'>
            <CurrentPowerBlock currentPower={currentPower} max={maxPower} />
            <StackedAlertsInfo
              activeAlerts={activeAlerts.length}
              className='hidden xs:flex md:hidden'
              onClick={() => navigate('/alerts')}
              resolvedAlerts={resolvedAlerts.length}
            />
            <StatBlock
              className={classNames('hidden md:flex', {
                'text-danger': activeAlerts.length > 0,
                'text-gray-400': activeAlerts.length === 0,
              })}
              onClick={() => navigate('/alerts')}
              title='active alerts'
              value={activeAlerts.length}
            />
            <StatBlock
              className='hidden text-gray-400 md:flex'
              onClick={() => navigate('/alerts')}
              title='resolved alerts'
              value={resolvedAlerts.length}
            />
          </div>
          <div className='flex flex-col space-y-2 xs:flex-row xs:space-y-0 sm:space-x-6'>
            <PowerBlock
              className='hidden md:flex'
              power={totalOutput}
              title='total'
              unit='Wh'
            />
            <PowerBlock
              className='hidden md:flex'
              power={averageOutput}
              title='average'
            />
            <StackedTotAvg
              avg={averageOutput}
              className='ml-auto block items-end md:hidden'
              total={totalOutput}
            />
            <StackedAlertsInfo
              activeAlerts={activeAlerts.length}
              className='flex items-end xs:hidden'
              onClick={() => navigate('/alerts')}
              resolvedAlerts={resolvedAlerts.length}
            />
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
        />
      </div>
    </div>
  );
}
