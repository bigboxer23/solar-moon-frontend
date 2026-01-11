import { ReactElement } from 'react';
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
import type { SearchResponse } from '../../../types/api';
import type { Alarm, Device } from '../../../types/models';
import { getDisplayName, getRoundedTimeFromOffset } from '../../../utils/Utils';
import CurrentPowerBlock from '../../common/CurrentPowerBlock';
import DeviceBlock from '../../device-block/DeviceBlock';
import StackedAlertsInfo from '../../device-block/StackedAlertsInfo';
import StackedCurrentVoltageBlock from '../../device-block/StackedCurrentVoltageBlock';
import StackedTotAvg from '../../device-block/StackedTotAvg';
import MiniChart from '../../graphs/MiniChart';

interface SiteDevicesOverviewProps {
  devices: Device[];
  activeSiteAlerts: Alarm[];
  resolvedSiteAlerts: Alarm[];
  avgData: Record<string, SearchResponse>;
  totalData: Record<string, SearchResponse>;
  timeSeriesData: Record<string, SearchResponse>;
  maxData: Record<string, SearchResponse>;
  timeIncrement: number;
}

const emptySearchResponse: SearchResponse = {
  aggregations: {},
  hits: { hits: [] },
};

export default function SiteDevicesOverview({
  devices,
  activeSiteAlerts,
  resolvedSiteAlerts,
  avgData,
  totalData,
  timeSeriesData,
  maxData,
  timeIncrement,
}: SiteDevicesOverviewProps): ReactElement {
  const navigate = useNavigate();
  const bucketSize = getBucketSize(timeIncrement, 'avgTotal');

  return (
    <div className='SiteDevicesOverview w-full'>
      <div>
        <div className='mb-4 text-lg font-bold text-black dark:text-gray-100'>
          {devices.length} Devices
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {devices.map((device) => {
            const activeAlerts = activeSiteAlerts.filter(
              (d) => d.deviceId === device.id,
            ).length;
            const reportLink = `/reports?deviceId=${device.id}&siteId=${device.siteId ?? ''}&start=${getRoundedTimeFromOffset(timeIncrement).getTime()}&end=${new Date().getTime()}`;
            const deviceTimeSeriesData =
              timeSeriesData[device.id] ?? emptySearchResponse;
            const deviceMaxData = maxData[device.id] ?? emptySearchResponse;
            const deviceAvgData = avgData[device.id] ?? emptySearchResponse;
            const deviceTotalData = totalData[device.id] ?? emptySearchResponse;

            return (
              <DeviceBlock
                body={
                  <MiniChart
                    graphData={parseSearchReturn(
                      deviceTimeSeriesData,
                      bucketSize,
                    )}
                  />
                }
                informationalErrors={getInformationalErrorInfo(
                  deviceTimeSeriesData,
                )}
                informationalErrorsLink={`${reportLink}&err=true`}
                key={device.id}
                reportLink={reportLink}
                statBlocks={[
                  <CurrentPowerBlock
                    activeAlert={activeAlerts > 0}
                    currentPower={parseCurrentPower(deviceMaxData)}
                    key={0}
                    max={parseMaxData(deviceMaxData)}
                  />,
                  <StackedTotAvg
                    avg={getAggregationValue(deviceAvgData, AVG_AGGREGATION)}
                    className='items-end'
                    key={1}
                    total={getAggregationValue(
                      deviceTotalData,
                      TOTAL_AGGREGATION,
                    )}
                  />,
                  <StackedCurrentVoltageBlock
                    current={parseCurrentAmperage(deviceMaxData)}
                    key={2}
                    voltage={parseCurrentVoltage(deviceMaxData)}
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
                title={getDisplayName(device) ?? ''}
                truncationLength={20}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
