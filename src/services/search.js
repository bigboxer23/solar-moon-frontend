export const DATE_HISTO = 'date_histogram#2';
export const AVG = 'avg#1';

export const MAX = 'max#1';

export const TOTAL_REAL_POWER = 'Total Real Power';

export const HOUR = 3600000;
export const DAY = 86400000;

export const WEEK = 604800000;

export const MONTH = 2592000000;

export const YEAR = 31536000000;

export const ALL = 'All';

export const AVG_AGGREGATION = 'avg#avg';

export const TOTAL_AGGREGATION = 'sum#total';

export const GROUPED_BAR = 'groupedBarGraph';

export function getBucketSize(offset, type) {
  const grouped = type === GROUPED_BAR;
  if (offset <= HOUR) return '1m';
  if (offset <= DAY) return grouped ? '1h' : '30m';
  if (offset <= WEEK + DAY) return grouped ? '1d' : '3h';
  if (offset <= MONTH + DAY) return grouped ? '4d' : '6h';
  return grouped ? '21d' : '1d';
}

function getTimeZone() {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}
export function getMaxCurrentBody(device) {
  let end = new Date();
  let start = new Date(end.getTime() - WEEK);
  return getJSONSearch(device.name, null, null, start, end, 'maxCurrent');
}

export function getAvgTotalBody(device, start, end) {
  return getJSONSearch(device?.name, null, null, start, end, 'avgTotal');
}

export function getStackedTimeSeriesBody(site, start, end, type) {
  return getJSONSearch(null, null, site.name, start, end, type);
}

export function getTimeSeriesBody(device, start, end) {
  return getJSONSearch(device.name, null, null, start, end, 'timeseries');
}

export function getDataPageBody(site, deviceName, start, end, offset, size) {
  let searchJSON = getJSONSearch(deviceName, null, site, start, end, 'data');
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
    bucketSize: getBucketSize(end.getTime() - start.getTime(), type),
    type: type,
    site: site,
  };
}

export function parseSearchReturn(data) {
  return data.aggregations[DATE_HISTO].buckets.map((d) => {
    return { date: new Date(Number(d.key)), values: d[AVG].value };
  });
}

export function parseMaxSearchReturn(data) {
  return data.aggregations[DATE_HISTO].buckets.map((d) => {
    return { date: new Date(Number(d.key)), values: d[MAX].value };
  });
}

export function getAggregationValue(data, label) {
  return data !== undefined
    ? Math.round(data.aggregations[label].value * 10) / 10
    : 0;
}

export const parseStackedTimeSeriesData = function (data) {
  const formattedData = [];
  data.aggregations[DATE_HISTO].buckets.forEach((d) => {
    const date = new Date(Number(d.key)).toISOString();
    d['sterms#terms'].buckets.forEach((v) => {
      formattedData.push({
        date: date,
        name: v.key,
        avg: v[AVG] ? v[AVG].value : v['1'].value,
      });
    });
  });
  return formattedData;
};

export const parseAndCondenseStackedTimeSeriesData = function (data) {
  const formattedData = [];
  data.aggregations[DATE_HISTO].buckets.forEach((d) => {
    const point = { date: new Date(Number(d.key)), values: 0 };
    formattedData.push(point);
    d['sterms#terms'].buckets.forEach((v) => {
      point.values = point.values + (v[AVG] ? v[AVG].value : v['1'].value);
    });
  });
  return formattedData;
};
