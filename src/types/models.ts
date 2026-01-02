export interface Device {
  id: string;
  name?: string;
  deviceName: string;
  siteId?: string;
  site?: string;
  isSite?: boolean | string;
  disabled?: boolean;
  notificationsDisabled?: boolean;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  virtual?: boolean;
  city?: string;
  state?: string;
  subtraction?: number;
}

export interface Site extends Device {
  isSite: true;
}

export interface Customer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  timezone?: string;
}

export interface Alarm {
  id: string;
  deviceId: string;
  message: string;
  timestamp: number;
  severity?: 'warning' | 'error' | 'info';
  state?: string;
  acknowledged?: boolean;
}

export interface Subscription {
  joinDate?: number;
  packs: number;
  active: boolean;
  planId?: string;
  customerId?: string;
  status?: string;
}

export interface Mapping {
  attribute: string;
  mappingName: string;
  id?: string;
}

export interface UserAttributes {
  email?: string;
  name?: string;
  phone_number?: string;
  sub?: string;
  [key: string]: string | undefined;
}
