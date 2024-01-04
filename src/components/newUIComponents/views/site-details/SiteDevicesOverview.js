import { useEffect, useState } from 'react';

import { parseSearchReturn } from '../../../../services/search';
import { getListTimeSeriesData } from '../../../../services/services';
import DeviceChart from './DeviceChart';

export default function SiteDevicesOverview({ devices, timeIncrement }) {
  const [deviceGraphData, setDeviceGraphData] = useState({});

  useEffect(() => {
    getListTimeSeriesData(devices, timeIncrement).then(({ data }) => {
      const parsedData = data.map((d) => parseSearchReturn(d));

      console.log('parsedData', parsedData);

      setDeviceGraphData(parsedData);
    });
  }, [devices, timeIncrement]);

  return (
    <div className='SiteDevicesOverview w-full'>
      <div className='mb-4 text-lg font-bold'>Devices</div>
      <div className='space-y-4'>
        {devices.map((device, i) => (
          <div
            className='flex w-full flex-col justify-between text-sm text-neutral-500'
            key={device.deviceName}
          >
            <div className='mb-2 font-bold'>{device.deviceName}</div>
            <DeviceChart graphData={deviceGraphData[i]} />
          </div>
        ))}
      </div>
    </div>
  );
}
