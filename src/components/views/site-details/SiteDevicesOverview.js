import classNames from 'classnames';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AVG_AGGREGATION,
  getAggregationValue,
  parseCurrentPower,
  parseMaxData,
  parseSearchReturn,
  TOTAL_AGGREGATION,
} from '../../../services/search';
import { getDisplayName } from '../../../utils/Utils';
import CurrentPowerBlock from '../../common/CurrentPowerBlock';
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
  maxData,
}) {
  const [expandedDevice, setExpandedDevice] = useState(-1);
  const navigate = useNavigate();

  return (
    <div className='SiteDevicesOverview w-full'>
      <div>
        <div className='mb-4 text-lg font-bold text-black dark:text-gray-100'>
          {devices.length} Devices
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {devices.map((device, i) => {
            const activeAlerts = activeSiteAlerts.filter(
              (d) => d.deviceId === device.id,
            ).length;

            return (
              <DeviceBlock
                expandableBody={
                  <DeviceChart
                    graphData={parseSearchReturn(timeSeriesData[device.id])}
                  />
                }
                key={device.id}
                statBlocks={[
                  <CurrentPowerBlock
                    currentPower={parseCurrentPower(maxData[device.id])}
                    key={0}
                    max={parseMaxData(maxData[device.id])}
                  />,
                  <StackedTotAvg
                    avg={getAggregationValue(
                      avgData[device.id],
                      AVG_AGGREGATION,
                    )}
                    key={1}
                    total={getAggregationValue(
                      totalData[device.id],
                      TOTAL_AGGREGATION,
                    )}
                  />,
                  <StatBlock
                    className={classNames('ml-[18px]', {
                      'text-danger': activeAlerts > 0,
                      'text-gray-400': activeAlerts === 0,
                    })}
                    key={2}
                    onClick={() => navigate(`/alerts?device=${device.id}`)}
                    title='active alerts'
                    value={
                      activeSiteAlerts.filter((d) => d.deviceId === device.id)
                        .length
                    }
                  />,
                  <StatBlock
                    className='text-gray-400 dark:text-gray-400'
                    key={3}
                    onClick={() => navigate(`/alerts?device=${device.id}`)}
                    title='resolved alerts'
                    value={
                      resolvedSiteAlerts.filter((d) => d.deviceId === device.id)
                        .length
                    }
                  />,
                ]}
                subtitle={device.deviceName}
                title={getDisplayName(device)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
