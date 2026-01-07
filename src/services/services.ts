import type { AxiosResponse } from 'axios';

import type {
  AlarmsResponse,
  BillingPortalSessionResponse,
  CheckoutSessionResponse,
  CheckoutStatusResponse,
  CustomerResponse,
  DeviceResponse,
  DevicesResponse,
  MappingsResponse,
  OverviewData,
  SearchResponse,
  SiteOverviewData,
  StripeSubscriptionsResponse,
} from '../types/api';
import type { Customer, Device, Mapping, Subscription } from '../types/models';
import { api } from './apiClient';
import {
  DAY,
  getAvgTotalBody,
  getBucketSize,
  getDataPageBody,
  GROUPED_BAR,
} from './search';

export function getCustomer(): Promise<AxiosResponse<CustomerResponse>> {
  return api.get<CustomerResponse>('customer');
}

export function updateCustomer(
  customerData: Partial<Customer>,
): Promise<AxiosResponse<CustomerResponse>> {
  return api.post<CustomerResponse>('customer', customerData);
}

export const deleteCustomer = (): Promise<AxiosResponse<void>> => {
  return api.delete<void>('customer/');
};

export function getUserPortalSession(): Promise<
  AxiosResponse<BillingPortalSessionResponse>
> {
  return api.post<BillingPortalSessionResponse>('billing/portal');
}

export function checkout(
  item: string,
  count: number,
): Promise<AxiosResponse<CheckoutSessionResponse>> {
  return api.post<CheckoutSessionResponse>('billing/checkout', {
    id: item,
    count: count,
  });
}

export function checkoutStatus(
  sessionId: string,
): Promise<AxiosResponse<CheckoutStatusResponse>> {
  return api.get<CheckoutStatusResponse>(
    `billing/status?session_id=${sessionId}`,
  );
}

export function getSubscriptionInformation(): Promise<
  AxiosResponse<Subscription>
> {
  return api.get<Subscription>('subscription');
}

export function activateTrial(): Promise<AxiosResponse<Subscription>> {
  return api.post<Subscription>('subscription');
}

export function getStripeSubscriptions(): Promise<
  AxiosResponse<StripeSubscriptionsResponse>
> {
  return api.get<StripeSubscriptionsResponse>('billing/subscriptions');
}

export function getDevices(): Promise<AxiosResponse<DevicesResponse>> {
  return api.get<DevicesResponse>('devices');
}

export function getSiteOverview(
  siteId: string,
  start: Date,
  offset: number,
  graphType: string,
): Promise<AxiosResponse<SiteOverviewData>> {
  const body = getAvgTotalBody(
    null,
    start,
    new Date(Math.min(start.getTime() + offset, new Date().getTime())),
  );
  body.daylight = offset === DAY;
  if (graphType === GROUPED_BAR) {
    body.bucketSize = getBucketSize(offset, GROUPED_BAR);
  }
  return api.post<SiteOverviewData>(`sites/${siteId}`, body);
}

export function getDevice(
  deviceId: string,
): Promise<AxiosResponse<DeviceResponse>> {
  return api.get<DeviceResponse>(`devices/${deviceId}`);
}

export function deleteDevice(deviceId: string): Promise<AxiosResponse<void>> {
  return api.delete<void>(`devices/${deviceId}`);
}

export function updateDevice(
  device: Partial<Device> & { id: string },
): Promise<AxiosResponse<DeviceResponse>> {
  return api.post<DeviceResponse>('devices', device);
}

export function addDevice(
  device: Omit<Device, 'id'>,
): Promise<AxiosResponse<DeviceResponse>> {
  return api.put<DeviceResponse>('devices', device);
}

export function getAlarmData(): Promise<AxiosResponse<AlarmsResponse>> {
  return api.post<AlarmsResponse>('alarms', {});
}

export function getOverviewData(
  start: Date,
  offset: number,
): Promise<AxiosResponse<OverviewData>> {
  const body = getAvgTotalBody(
    null,
    start,
    new Date(Math.min(start.getTime() + offset, new Date().getTime())),
  );
  body.daylight = offset === DAY;
  return api.post<OverviewData>('overview', body);
}

export function getDataPage(
  deviceId: string | null,
  siteId: string | null,
  filterErrors: string,
  start: string,
  end: string,
  offset: number,
  size: number,
  additionalFields?: string[] | null,
): Promise<AxiosResponse<SearchResponse>> {
  return api.post<SearchResponse>(
    'search',
    getDataPageBody(
      deviceId,
      siteId,
      filterErrors === 'true',
      new Date(Number(start)),
      new Date(Number(end)),
      offset,
      size,
      additionalFields,
    ),
  );
}

export function getDownloadPageSize(
  deviceId: string | null,
  siteId: string | null,
  filterErrors: string,
  start: string,
  end: string,
  offset: number,
  size: number,
): Promise<AxiosResponse<number>> {
  return api.post<number>(
    'download',
    getDataPageBody(
      deviceId,
      siteId,
      filterErrors === 'true',
      new Date(Number(start)),
      new Date(Number(end)),
      offset,
      size,
      null,
    ),
  );
}

export function addMapping(
  attribute: string,
  mappingName: string,
): Promise<AxiosResponse<Mapping>> {
  return api.put<Mapping>('mappings', {
    attribute: attribute,
    mappingName: mappingName,
  });
}

export function getMappings(): Promise<AxiosResponse<MappingsResponse>> {
  return api.get<MappingsResponse>('mappings');
}

export function deleteMapping(
  mappingName: string,
): Promise<AxiosResponse<void>> {
  return api.delete<void>(`mappings/${mappingName}`);
}
