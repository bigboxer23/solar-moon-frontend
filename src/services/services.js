import { api, openSearch } from "./apiClient";
import { getTileBody, getTimeSeriesBody } from "./search";

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

export function getTileData(device, start, end, direct) {
  if (!direct) {
    return api.post("search", getTileBody(device, start, end, direct));
  }
  return openSearch.post("_search", getTileBody(device, start, end, direct));
}
