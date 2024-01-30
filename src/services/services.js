import { getRoundedTime, getRoundedTimeFromOffset } from '../utils/Utils';
import { api } from './apiClient';
import {
  DAY,
  getAvgTotalBody,
  getBucketSize,
  getDataPageBody,
  getMaxCurrentBody,
  getStackedTimeSeriesBody,
  getTimeSeriesBody,
  GROUPED_BAR,
  HOUR,
} from './search';

export function getCustomer() {
  return api.get('customer');
}

export function updateCustomer(customerData) {
  return api.post('customer', customerData);
}

export const deleteCustomer = () => {
  return api.delete('customer/');
};

export function getUserPortalSession() {
  return api.post('billing/portal');
}

export function checkout(item, count) {
  return api.post('billing/checkout', { id: item, count: count });
}

export function checkoutStatus(sessionId) {
  return api.get(`billing/status?session_id=${sessionId}`);
}

export function getSeatCount() {
  return api.get('subscription');
}

export function getSubscriptions() {
  return api.get('billing/subscriptions');
}

export function getDevices() {
  return api.get('devices');
}

export function getSitesOverview() {
  return api.post(
    'sites',
    getAvgTotalBody(null, getRoundedTime(false, 0), new Date()),
  );
}

export function getSiteOverview(siteId, start, offset, graphType) {
  const body = getAvgTotalBody(
    null,
    start,
    new Date(Math.min(start.getTime() + offset, new Date().getTime())),
  );
  if (graphType === GROUPED_BAR) {
    body.bucketSize = getBucketSize(offset, GROUPED_BAR);
  }
  return api.post('sites/' + siteId, body);
}

export function getDevice(deviceId) {
  return api.get('devices/' + deviceId);
}

export function deleteDevice(deviceId) {
  return api.delete('devices/' + deviceId);
}

export function updateDevice(device) {
  return api.post('devices', device);
}

export function addDevice(device) {
  return api.put('devices', device);
}

export function getAlarmData() {
  return api.post('alarms', {});
}

export function getOverviewData(start, offset) {
  return api.post(
    'overview',
    getAvgTotalBody(
      null,
      start,
      new Date(Math.min(start.getTime() + offset, new Date().getTime())),
    ),
  );
}

export function getTimeSeriesData(device, offset, isSite) {
  const body = getTimeSeriesBody(
    device,
    getRoundedTimeFromOffset(offset),
    new Date(),
  );
  if (isSite) {
    body.isSite = true;
  }
  return api.post('search', body);
}

export function getListTimeSeriesData(devices, offset) {
  const end = new Date();
  const start = getRoundedTimeFromOffset(offset);

  const timeSeriesBodies = devices.map((device) =>
    getTimeSeriesBody(device, start, end),
  );

  return api.post('search', timeSeriesBodies);
}

export function getStackedTimeSeriesData(device, start, end) {
  return api.post(
    'search',
    getStackedTimeSeriesBody(device, start, end, 'stackedTimeSeries'),
  );
}

export function getGroupedTimeSeriesData(device, start, end) {
  return api.post(
    'search',
    getStackedTimeSeriesBody(device, start, end, GROUPED_BAR),
  );
}

export function getListAvgTotal(devices, offset) {
  const end = new Date();
  const start = getRoundedTimeFromOffset(offset);

  const avgTotalBodies = devices.map((device) =>
    getAvgTotalBody(device, start, end),
  );

  return api.post('search', avgTotalBodies);
}

export function getAvgTotal(device, offset) {
  return api.post(
    'search',
    getAvgTotalBody(device, getRoundedTimeFromOffset(offset), new Date()),
  );
}

export function getMaxCurrent(device) {
  return api.post('search', getMaxCurrentBody(device));
}

export function getTileContent(device, offset) {
  return api.post('search', [
    getAvgTotalBody(device, getRoundedTimeFromOffset(offset), new Date()),
    getMaxCurrentBody(device),
    getDataPageBody(
      device.site,
      device.name,
      getRoundedTime(false, DAY),
      getRoundedTime(true, 0),
      0,
      1,
    ),
  ]);
}

export function getOverviewTotal(offset) {
  const body = getAvgTotalBody(
    null,
    getRoundedTimeFromOffset(offset),
    new Date(),
  );
  body.isSite = true;
  return api.post('search', body);
}

export function getDataPage(site, device, start, end, offset, size) {
  return api.post(
    'search',
    getDataPageBody(
      site,
      device,
      new Date(Number(start)),
      new Date(Number(end)),
      offset,
      size,
    ),
  );
}

export function addMapping(attribute, mappingName) {
  return api.put('mappings', {
    attribute: attribute,
    mappingName: mappingName,
  });
}

export function getMappings() {
  return api.get('mappings');
}

export function deleteMapping(mappingName) {
  return api.delete('mappings/' + mappingName);
}
