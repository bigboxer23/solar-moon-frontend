import { useEffect, useState } from 'react';
import { getOverviewData } from '../../../services/services';
import SiteList from './site-list/SiteList';
import OverviewChart from './OverviewChart';
import TimeIncrementSelector from './TimeIncrementSelector';
import { DAY, getAggregationValue } from '../../../services/search';
import Loader from '../common/Loader';
import { useStickyState } from '../../../utils/Utils';
import classNames from 'classnames';
import { FormattedNumber } from 'react-intl';
import SummaryHeader from '../SummaryHeader';

function StatBlock({ title, value, className }) {
  const style = classNames('StatBlock flex', className);

  return (
    <div className={style}>
      <div className='align-self-end inline-block text-5xl font-bold leading-[3rem]'>
        {value}
      </div>
      <div className='align-self-end mb-1 ml-2 inline-block max-w-[3.125rem] text-base font-bold leading-[1.125rem]'>
        {title}
      </div>
    </div>
  );
}

export default function Overview() {
  const [sites, setSites] = useState([]);
  const [devices, setDevices] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const [timeIncrement, setTimeIncrement] = useStickyState(
    DAY,
    'dashboard.time',
  );
  const [totalOutput, setTotalOutput] = useState(0);
  const [averageOutput, setAverageOutput] = useState(0);
  const [overallTimeSeries, setOverallTimeSeries] = useState(null);
  const [sitesGraphData, setSitesGraphData] = useState(null);
  const [dailyOutputTotal, setDailyOutputTotal] = useState(0);
  const [dailyAverageOutput, setDailyAverageOutput] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOverviewData(timeIncrement).then(({ data }) => {
      handleDevices(data.devices);
      handleAlarms(data.alarms);
      handleOverviewTotal(data.overall.totalAvg);
      setOverallTimeSeries(data.overall.timeSeries);
      setSitesGraphData(data.sitesOverviewData);
      handleSummaryHeader(data.overall);
      setLoading(false);
    });
  }, [timeIncrement]);

  const handleSummaryHeader = (data) => {
    setDailyOutputTotal(
      getAggregationValue(data.dailyEnergyConsumedTotal, 'sum#total'),
    );
    setDailyAverageOutput(data.dailyEnergyConsumedAverage);
  };

  const handleOverviewTotal = (data) => {
    setTotalOutput(getAggregationValue(data, 'sum#total'));
    setAverageOutput(getAggregationValue(data, 'avg#avg'));
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
    const sites = data.filter((d) => d.virtual);
    const devices = data.filter((d) => !d.virtual);

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
    <div className='flex flex-col items-center'>
      <SummaryHeader
        dailyOutput={dailyOutputTotal}
        dailyAverageOutput={dailyAverageOutput}
      />
      <div className='Overview fade-in mb-8 w-[55rem] rounded-lg bg-white p-8 shadow-panel'>
        <div className='mb-4 flex w-full items-center justify-between text-lg font-bold'>
          Overview
          <TimeIncrementSelector
            setTimeIncrement={setTimeIncrement}
            timeIncrement={timeIncrement}
          />
        </div>
        <div className='mb-6 flex justify-between'>
          <div className='flex space-x-4'>
            <StatBlock title='sites' value={sites.length} />
            <StatBlock title='devices' value={devices.length} />
            <StatBlock
              title='active alerts'
              value={activeAlerts.length}
              className={activeAlerts > 0 ? 'text-danger' : ''}
            />
            <StatBlock
              title='resolved alerts'
              value={resolvedAlerts.length}
              className='text-text-secondary'
            />
          </div>
          <div className='flex flex-col items-end'>
            <span className='text-base'>
              Total: <FormattedNumber value={totalOutput} /> kWH
            </span>
            <span className='average-output text-xl font-bold'>
              Average: <FormattedNumber value={averageOutput} /> kW
            </span>
          </div>
        </div>
        <OverviewChart
          siteData={overallTimeSeries}
          sites={sites}
          timeIncrement={timeIncrement}
        />
        <SiteList
          sitesGraphData={sitesGraphData}
          sites={sites}
          devices={devices}
          timeIncrement={timeIncrement}
          alerts={[...resolvedAlerts, ...activeAlerts]}
        />
      </div>
    </div>
  );
}
