import { api, openSearch } from "./apiClient";

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

export function getTimeSeriesData(searchBody) {
  return openSearch.post("_search", searchBody);
}
