import type { WeatherData } from './chart';
import type { Alarm, Customer, Device, Mapping } from './models';

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

export interface OverviewDataOverall {
  avg: SearchAggregation;
  total: SearchAggregation;
  timeSeries: SearchResponse;
  dailyEnergyConsumedTotal: SearchAggregation;
  dailyEnergyConsumedAverage: number;
}

export interface SitesOverviewData {
  [siteName: string]: {
    timeSeries: SearchResponse;
    weeklyMaxPower: SearchResponse;
    avg: SearchAggregation;
    total: SearchAggregation;
    weather?: WeatherData;
  };
}

export interface OverviewData {
  devices: Device[];
  alarms: Alarm[];
  overall: OverviewDataOverall;
  sitesOverviewData: SitesOverviewData;
  subscription?: {
    joinDate?: number | string;
    customerId?: string;
    manualSubscriptionDate?: number;
    packs?: number;
  };
  customer?: Customer;
}

export interface SiteOverviewData {
  site: Device;
  devices: Device[];
  alarms: Alarm[];
  timeSeries: SearchResponse;
  weather?: WeatherData;
  total?: SearchResponse;
  avg?: SearchResponse;
  weeklyMaxPower?: SearchResponse;
  deviceAvg?: Record<string, SearchResponse>;
  deviceTotals?: Record<string, SearchResponse>;
  deviceWeeklyMaxPower?: Record<string, SearchResponse>;
  deviceTimeSeries?: Record<string, SearchResponse>;
  localTime?: string;
  trialDate?: unknown;
}

export type DeviceResponse = Device;

export type DevicesResponse = Device[];

export type MappingsResponse = Mapping[];

export type CustomerResponse = Customer;

export type AlarmsResponse = Alarm[];

export interface CheckoutSessionResponse {
  url?: string;
  sessionId?: string;
  clientSecret: string;
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
  quantity?: number;
  interval?: 'month' | 'year';
  [key: string]: unknown;
}

export type StripeSubscriptionsResponse = StripeSubscription[];
