import { api } from './apiClient';
import {
  DAY,
  getAvgTotalBody,
  getBucketSize,
  getDataPageBody,
  GROUPED_BAR,
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

export function getSubscriptionInformation() {
  return api.get('subscription');
}

export function activateTrial() {
  return api.post('subscription');
}

export function getStripeSubscriptions() {
  return api.get('billing/subscriptions');
}

export function getDevices() {
  return api.get('devices');
}

export function getSiteOverview(siteId, start, offset, graphType) {
  const body = getAvgTotalBody(
    null,
    start,
    new Date(Math.min(start.getTime() + offset, new Date().getTime())),
  );
  body.daylight = offset === DAY;
  if (graphType === GROUPED_BAR) {
    body.bucketSize = getBucketSize(offset, GROUPED_BAR);
  }
  return api.post(`sites/${siteId}`, body);
}

export function getDevice(deviceId) {
  return api.get(`devices/${deviceId}`);
}

export function deleteDevice(deviceId) {
  return api.delete(`devices/${deviceId}`);
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
  const body = getAvgTotalBody(
    null,
    start,
    new Date(Math.min(start.getTime() + offset, new Date().getTime())),
  );
  body.daylight = offset === DAY;
  return api.post('overview', body);
}

export function getDataPage(
  deviceId,
  siteId,
  start,
  end,
  offset,
  size,
  additionalFields,
) {
  return api.post(
    'search',
    getDataPageBody(
      deviceId,
      siteId,
      new Date(Number(start)),
      new Date(Number(end)),
      offset,
      size,
      additionalFields,
    ),
  );
}

export function getDownloadPageSize(
  deviceId,
  siteId,
  start,
  end,
  offset,
  size,
) {
  return api.post(
    'download',
    getDataPageBody(
      deviceId,
      siteId,
      new Date(Number(start)),
      new Date(Number(end)),
      offset,
      size,
      null,
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
  return api.delete(`mappings/${mappingName}`);
}
