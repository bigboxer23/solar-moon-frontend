import type { Alarm, Customer, Device, Mapping, Subscription } from './models';

export interface ApiResponse<T> {
  data: T;
  status?: number;
  message?: string;
}

export interface SearchBody {
  deviceId?: string | null;
  siteId?: string | null;
  startDate: number;
  endDate: number;
  timeZone: string;
  bucketSize: string;
  type: string;
  daylight?: boolean;
  filterErrors?: boolean;
  offset?: number;
  size?: number;
  additionalFields?: string[] | null;
}

export interface SearchAggregation {
  value?: number;
  buckets?: SearchBucket[];
}

export interface SearchBucket {
  key: string | number;
  key_as_string?: string;
  doc_count?: number;
  // Dynamic aggregation fields
  [key: string]: unknown;
}

export interface SearchHit {
  fields: Record<string, unknown[]>;
  _source?: Record<string, unknown>;
}

export interface SearchResponse {
  aggregations: {
    [key: string]: SearchAggregation;
  };
  hits: {
    hits: SearchHit[];
    total?: {
      value: number;
      relation: string;
    };
  };
}

export interface OverviewData {
  devices?: Device[];
  alarms?: Alarm[];
  customer?: Customer;
  subscription?: Subscription;
  [key: string]: unknown;
}

export interface SiteOverviewData {
  timeSeries?: unknown[];
  alarms?: Alarm[];
  weather?: unknown;
  [key: string]: unknown;
}

export interface MappingsResponse {
  mappings: Mapping[];
}

export interface DeviceResponse {
  device: Device;
}

export interface DevicesResponse {
  devices: Device[];
}

export interface CustomerResponse {
  customer: Customer;
}

export interface AlarmsResponse {
  alarms: Alarm[];
}

export interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}

export interface CheckoutStatusResponse {
  status: string;
  customer_email?: string;
}

export interface BillingPortalSessionResponse {
  url: string;
}

export interface StripeSubscription {
  id: string;
  status: string;
  current_period_end: number;
  current_period_start: number;
  [key: string]: unknown;
}

export interface StripeSubscriptionsResponse {
  subscriptions: StripeSubscription[];
}
