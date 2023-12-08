export const DATE_HISTO = "date_histogram#2";
export const AVG = "avg#1";
export const TOTAL_REAL_POWER = "Total Real Power";

export const HOUR = 3600000;
export const DAY = 86400000;

export const WEEK = 604800000;

export const MONTH = 2592000000;

export const YEAR = 31536000000;
function getBucketSize(start, end, type) {
  let difference = end.getTime() - start.getTime();
  let grouped = type === "groupedBarGraph";
  if (difference <= HOUR) return "1m";
  if (difference <= DAY) return grouped ? "3h" : "30m";
  if (difference <= WEEK) return grouped ? "1d" : "3h";
  if (difference <= MONTH) return grouped ? "4d" : "12h";
  return grouped ? "21d" : "1d";
}

function getTimeZone() {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}
export function getMaxCurrentBody(device) {
  let end = new Date();
  let start = new Date(end.getTime() - WEEK);
  return getJSONSearch(device.name, null, null, start, end, "maxCurrent");
}

export function getAvgTotalBody(device, start, end) {
  return getJSONSearch(device?.name, null, null, start, end, "avgTotal");
}

export function getStackedTimeSeriesBody(site, start, end, type) {
  return getJSONSearch(null, null, site.name, start, end, type);
}

export function getTimeSeriesBody(device, start, end) {
  return getJSONSearch(device.name, null, null, start, end, "timeseries");
}

export function getDataPageBody(site, deviceName, start, end, offset, size) {
  let searchJSON = getJSONSearch(deviceName, null, site, start, end, "data");
  searchJSON.offset = offset;
  searchJSON.size = size;
  return searchJSON;
}

function getJSONSearch(deviceName, deviceId, site, start, end, type) {
  return {
    deviceName: deviceName,
    deviceId: deviceId,
    endDate: end.getTime(),
    startDate: start.getTime(),
    timeZone: getTimeZone(),
    bucketSize: getBucketSize(start, end, type),
    type: type,
    site: site,
  };
}

export function parseSearchReturn(data) {
  return data.aggregations[DATE_HISTO].buckets.map((d) => {
    return { date: new Date(Number(d.key)), values: d[AVG].value };
  });
}
