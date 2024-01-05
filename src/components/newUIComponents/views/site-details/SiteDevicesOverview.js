import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FormattedNumber } from 'react-intl';

import {
  AVG_AGGREGATION,
  parseSearchReturn,
  TOTAL_AGGREGATION,
} from '../../../../services/search';
import {
  getListAvgTotal,
  getListTimeSeriesData,
} from '../../../../services/services';
import StatBlock from '../../common/StatBlock';
import DeviceChart from './DeviceChart';

export default function SiteDevicesOverview({
  devices,
  timeIncrement,
  activeSiteAlerts,
  resolvedSiteAlerts,
}) {
  const [deviceGraphData, setDeviceGraphData] = useState([]);
  const [deviceAvgTotal, setDeviceAvgTotal] = useState([]);
  const [expandedDevice, setExpandedDevice] = useState(-1);

  useEffect(() => {
    getListTimeSeriesData(devices, timeIncrement).then(({ data }) => {
      const parsedData = data.map((d) => parseSearchReturn(d));
      setDeviceGraphData(parsedData);
    });
    getListAvgTotal(devices, timeIncrement).then(({ data }) => {
      const parsedData = data.map((d) => {
        return {
          avg: d.aggregations[AVG_AGGREGATION].value,
          total: d.aggregations[TOTAL_AGGREGATION].value,
        };
      });
      setDeviceAvgTotal(parsedData);
    });
  }, [devices, timeIncrement]);

  return (
    <div className='SiteDevicesOverview w-full'>
      <div className='mb-4 text-lg font-bold'>Devices</div>
      <div className='space-y-2'>
        {devices.map((device, i) => (
          <div
            className='flex flex-col rounded-lg px-4 py-3 transition-colors hover:bg-neutral-50'
            key={device.deviceName}
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
                      {device.deviceName}
                    </div>
                    <div className='text-xs text-text-secondary'>
                      id: {device.id}
                    </div>
                  </div>
                  {i === expandedDevice ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                <div className='mt-2 flex w-full items-center'>
                  <div className='flex space-x-4'>
                    <StatBlock
                      title='active alerts'
                      value={
                        activeSiteAlerts.filter(
                          (d) => d.deviceName === device.deviceName,
                        ).length
                      }
                    />
                    <StatBlock
                      className='text-text-secondary'
                      title='resolved alerts'
                      value={
                        resolvedSiteAlerts.filter(
                          (d) => d.deviceName === device.deviceName,
                        ).length
                      }
                    />
                  </div>
                  <div className='flex w-full flex-col items-end'>
                    <span className='text-base'>
                      Total:{' '}
                      <FormattedNumber value={deviceAvgTotal[i]?.total} /> kWH
                    </span>
                    <span className='text-lg font-bold'>
                      Average:{' '}
                      <FormattedNumber value={deviceAvgTotal[i]?.avg} /> kWH
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
              <DeviceChart graphData={deviceGraphData[i]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
