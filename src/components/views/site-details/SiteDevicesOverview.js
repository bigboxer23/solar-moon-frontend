import { useNavigate } from 'react-router-dom';

import {
  AVG_AGGREGATION,
  getAggregationValue,
  getBucketSize,
  getInformationalErrorInfo,
  parseCurrentAmperage,
  parseCurrentPower,
  parseCurrentVoltage,
  parseMaxData,
  parseSearchReturn,
  TOTAL_AGGREGATION,
} from '../../../services/search';
import { getDisplayName, getRoundedTimeFromOffset } from '../../../utils/Utils';
import CurrentPowerBlock from '../../common/CurrentPowerBlock';
import DeviceBlock from '../../device-block/DeviceBlock';
import StackedAlertsInfo from '../../device-block/StackedAlertsInfo';
import StackedCurrentVoltageBlock from '../../device-block/StackedCurrentVoltageBlock';
import StackedTotAvg from '../../device-block/StackedTotAvg';
import MiniChart from '../../graphs/MiniChart';

export default function SiteDevicesOverview({
  devices,
  activeSiteAlerts,
  resolvedSiteAlerts,
  avgData,
  totalData,
  timeSeriesData,
  maxData,
  timeIncrement,
}) {
  const navigate = useNavigate();
  const bucketSize = getBucketSize(timeIncrement, 'avgTotal');

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
            const reportLink = `/reports?deviceId=${device.id}&siteId=${device.siteId}&start=${getRoundedTimeFromOffset(timeIncrement).getTime()}&end=${new Date().getTime()}`;
            return (
              <DeviceBlock
                body={
                  <MiniChart
                    graphData={parseSearchReturn(
                      timeSeriesData[device.id],
                      bucketSize,
                    )}
                  />
                }
                informationalErrors={getInformationalErrorInfo(
                  timeSeriesData[device.id],
                )}
                informationalErrorsLink={`${reportLink}&err=true`}
                key={device.id}
                reportLink={reportLink}
                statBlocks={[
                  <CurrentPowerBlock
                    activeAlert={activeAlerts > 0}
                    currentPower={parseCurrentPower(maxData[device.id])}
                    key={0}
                    max={parseMaxData(maxData[device.id])}
                  />,
                  <StackedTotAvg
                    avg={getAggregationValue(
                      avgData[device.id],
                      AVG_AGGREGATION,
                    )}
                    className='items-end'
                    key={1}
                    total={getAggregationValue(
                      totalData[device.id],
                      TOTAL_AGGREGATION,
                    )}
                  />,
                  <StackedCurrentVoltageBlock
                    current={parseCurrentAmperage(maxData[device.id])}
                    key={2}
                    voltage={parseCurrentVoltage(maxData[device.id])}
                  />,
                  <StackedAlertsInfo
                    activeAlerts={
                      activeSiteAlerts.filter((d) => d.deviceId === device.id)
                        .length
                    }
                    className='items-end justify-center'
                    key={3}
                    onClick={() => navigate(`/alerts?deviceId=${device.id}`)}
                    resolvedAlerts={
                      resolvedSiteAlerts.filter((d) => d.deviceId === device.id)
                        .length
                    }
                  />,
                ]}
                subtitle={device.deviceName}
                title={getDisplayName(device)}
                truncationLength={20}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
