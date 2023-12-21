import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { FormattedNumber } from 'react-intl';

import { DAY, getAggregationValue } from '../../../../services/search';
import { getOverviewData } from '../../../../services/services';
import { useStickyState } from '../../../../utils/Utils';
import Loader from '../../common/Loader';
import OverviewChart from './OverviewChart';
import OverviewSiteList from './site-list/OverviewSiteList';
import SummaryHeader from './SummaryHeader';
import TimeIncrementSelector from './TimeIncrementSelector';

function StatBlock({ title, value, className }) {
  const style = classNames('StatBlock flex space-x-2', className);

  return (
    <div className={style}>
      <div className='inline-block self-end text-5xl font-bold leading-[3rem]'>
        {value}
      </div>
      <div className='mb-1 inline-block max-w-[3.3rem] self-end text-base font-bold leading-[1.125rem]'>
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
    <div className='flex max-w-full flex-col items-center'>
      <SummaryHeader
        dailyAverageOutput={dailyAverageOutput}
        dailyOutput={dailyOutputTotal}
      />
      <div className='Overview fade-in mb-8 w-[55rem] max-w-full bg-white p-6 shadow-panel sm:rounded-lg sm:p-8'>
        <div className='mb-4 flex w-full items-center justify-between text-lg font-bold'>
          Overview
          <TimeIncrementSelector
            setTimeIncrement={setTimeIncrement}
            timeIncrement={timeIncrement}
          />
        </div>
        <div className='mb-6 flex justify-between'>
          <div className='grid grid-cols-2 gap-2.5 sm:grid-cols-4'>
            <StatBlock title='sites' value={sites.length} />
            <StatBlock title='devices' value={devices.length} />
            <StatBlock
              className={activeAlerts > 0 ? 'text-danger' : ''}
              title='active alerts'
              value={activeAlerts.length}
            />
            <StatBlock
              className='text-text-secondary'
              title='resolved alerts'
              value={resolvedAlerts.length}
            />
          </div>
          <div className='flex flex-col items-end'>
            <div className='flex flex-col space-x-1 text-end text-base sm:flex-row'>
              <div>Total:</div>
              <div>
                <FormattedNumber value={totalOutput} /> kWH
              </div>
            </div>
            <div className='average-output flex flex-col space-x-1 text-end text-xl font-bold sm:flex-row'>
              <div>Average:</div>
              <div>
                <FormattedNumber value={averageOutput} /> kW
              </div>
            </div>
          </div>
        </div>
        <OverviewChart
          siteData={overallTimeSeries}
          sites={sites}
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
