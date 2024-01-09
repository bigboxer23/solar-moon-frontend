import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FormattedNumber } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import {
  AVG_AGGREGATION,
  getAggregationValue,
  parseSearchReturn,
  TOTAL_AGGREGATION,
} from '../../../../services/search';
import { getDisplayName } from '../../../../utils/Utils';
import StatBlock from '../../common/StatBlock';
import DeviceChart from './DeviceChart';

export default function SiteDevicesOverview({
  devices,
  activeSiteAlerts,
  resolvedSiteAlerts,
  avgTotalData,
  timeSeriesData,
}) {
  const [expandedDevice, setExpandedDevice] = useState(-1);
  const navigate = useNavigate();

  return (
    <div className='SiteDevicesOverview w-full'>
      <div className='mb-4 text-lg font-bold'>Devices</div>
      <div className='space-y-2'>
        {devices.map((device, i) => (
          <div
            className='flex flex-col rounded-lg px-4 py-3 transition-colors hover:bg-neutral-50'
            key={device.id}
          >
            <button
              onClick={() =>
                expandedDevice === i
                  ? setExpandedDevice(-1)
                  : setExpandedDevice(i)
              }
            >
              <div className='flex flex-col'>
                <div className='flex w-full items-center justify-between text-sm'>
                  <div className='flex flex-col items-start'>
                    <div className='text-base font-bold'>
                      {getDisplayName(device)}
                    </div>
                    <div className='text-xs text-text-secondary'>
                      {device.deviceName}
                    </div>
                  </div>
                  {i === expandedDevice ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                <div className='mt-2 flex w-full items-center'>
                  <div className='flex space-x-4'>
                    <StatBlock
                      onClick={() => navigate(`/alerts?device=${device.id}`)}
                      title='active alerts'
                      value={
                        activeSiteAlerts.filter((d) => d.deviceId === device.id)
                          .length
                      }
                    />
                    <StatBlock
                      className='text-text-secondary'
                      onClick={() => navigate(`/alerts?device=${device.id}`)}
                      title='resolved alerts'
                      value={
                        resolvedSiteAlerts.filter(
                          (d) => d.deviceId === device.id,
                        ).length
                      }
                    />
                  </div>
                  <div className='flex w-full flex-col items-end'>
                    <span className='text-base'>
                      Total:{' '}
                      <FormattedNumber
                        value={getAggregationValue(
                          avgTotalData[device.id],
                          TOTAL_AGGREGATION,
                        )}
                      />{' '}
                      kWH
                    </span>
                    <span className='text-lg font-bold'>
                      Average:{' '}
                      <FormattedNumber
                        value={getAggregationValue(
                          avgTotalData[device.id],
                          AVG_AGGREGATION,
                        )}
                      />{' '}
                      kW
                    </span>
                  </div>
                </div>
              </div>
            </button>
            <div
              className={`duration-250 overflow-hidden transition-all ${
                i === expandedDevice ? 'mt-2 max-h-64' : 'mt-0 max-h-0'
              }`}
            >
              <DeviceChart
                graphData={parseSearchReturn(timeSeriesData[device.id])}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
