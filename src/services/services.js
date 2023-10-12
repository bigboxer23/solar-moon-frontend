import { api, openSearch } from "./apiClient";
import {
  getAvgTotalBody,
  getMaxCurrentBody,
  getTimeSeriesBody,
} from "./search";

export function getCustomer() {
  return api.get("customer");
}

export function updateCustomer(customerData) {
  return api.post("customer", customerData);
}

export function getDevices() {
  return api.get("devices");
}

export function getDevice(deviceId) {
  return api.get("devices/" + deviceId);
}

export function deleteDevice(deviceId) {
  return api.delete("devices/" + deviceId);
}

export function updateDevice(device) {
  return api.post("devices", device);
}

export function addDevice(device) {
  return api.put("devices", device);
}

export function getTimeSeriesData(device, start, end, direct) {
  if (!direct) {
    return api.post("search", getTimeSeriesBody(device, start, end, direct));
  }
  return openSearch.post(
    "_search",
    getTimeSeriesBody(device, start, end, direct),
  );
}

export function getAvgTotal(device, start, end, direct) {
  if (!direct) {
    return api.post("search", getAvgTotalBody(device, start, end, direct));
  }
  return openSearch.post(
    "_search",
    getAvgTotalBody(device, start, end, direct),
  );
}

export function getMaxCurrent(device, direct) {
  if (!direct) {
    return api.post("search", getMaxCurrentBody(device, direct));
  }
  return openSearch.post("_search", getMaxCurrentBody(device, direct));
}
