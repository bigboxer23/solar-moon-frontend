import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AVG_AGGREGATION,
  getAggregationValue,
  parseSearchReturn,
  TOTAL_AGGREGATION,
} from '../../../services/search';
import PowerBlock from '../../common/PowerBlock';
import StatBlock from '../../common/StatBlock';
import DeviceBlock from '../../device-block/DeviceBlock';
import StackedTotAvg from '../../device-block/StackedTotAvg';
import DeviceChart from './DeviceChart';

export default function SiteDevicesOverview({
  devices,
  activeSiteAlerts,
  resolvedSiteAlerts,
  avgData,
  totalData,
  timeSeriesData,
}) {
  const [expandedDevice, setExpandedDevice] = useState(-1);
  const navigate = useNavigate();

  return (
    <div className='SiteDevicesOverview w-full'>
      <div>
        <div className='mb-4 text-lg font-bold text-black dark:text-neutral-100'>
          {devices.length} Devices
        </div>
        <div className='grid grid-cols-2 gap-4'>
          {devices.map((device, i) => (
            <DeviceBlock
              device={device}
              graph={
                <DeviceChart
                  graphData={parseSearchReturn(timeSeriesData[device.id])}
                />
              }
              key={device.id}
              statBlocks={[
                <PowerBlock currentPower={0} key={0} max={0} />, // Power gauge here
                <StackedTotAvg
                  avg={getAggregationValue(avgData[device.id], AVG_AGGREGATION)}
                  key={1}
                  total={getAggregationValue(
                    totalData[device.id],
                    TOTAL_AGGREGATION,
                  )}
                />,
                <StatBlock
                  className='text-black dark:text-neutral-100'
                  key={2}
                  onClick={() => navigate(`/alerts?device=${device.id}`)}
                  title='active alerts'
                  value={
                    activeSiteAlerts.filter((d) => d.deviceId === device.id)
                      .length
                  }
                />,
                <StatBlock
                  className='text-text-secondary'
                  key={3}
                  onClick={() => navigate(`/alerts?device=${device.id}`)}
                  title='resolved alerts'
                  value={
                    resolvedSiteAlerts.filter((d) => d.deviceId === device.id)
                      .length
                  }
                />,
              ]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
