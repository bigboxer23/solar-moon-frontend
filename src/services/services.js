import { api, openSearch } from "./apiClient";
import {
  getAvgTotalBody,
  getMaxCurrentBody,
  getStackedTimeSeriesBody,
  getTimeSeriesBody,
} from "./search";

export const directSearchAPI = false;
const service = directSearchAPI ? openSearch : api;
const serviceName = directSearchAPI ? "_search" : "search";

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

export function getTimeSeriesData(device, start, end) {
  return service.post(serviceName, getTimeSeriesBody(device, start, end));
}

export function getStackedTimeSeriesData(device, start, end) {
  return service.post(
    serviceName,
    getStackedTimeSeriesBody(device, start, end, "stackedTimeSeries"),
  );
}

export function getGroupedTimeSeriesData(device, start, end) {
  return service.post(
    serviceName,
    getStackedTimeSeriesBody(device, start, end, "groupedBarGraph"),
  );
}

export function getAvgTotal(device, start, end) {
  return service.post(serviceName, getAvgTotalBody(device, start, end));
}

export function getMaxCurrent(device) {
  return service.post(serviceName, getMaxCurrentBody(device));
}
