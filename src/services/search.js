import { TOTAL_REAL_POWER } from '../components/views/reports/ReportUtils';

export const DATE_HISTO = 'date_histogram#2';
const INFORMATIONAL_ERROR = 'sterms#informationalErrorString';
export const AVG = 'avg#1';

const CURRENT = 'Average Current';

const VOLTAGE = 'Average Voltage (L-N)';

export const TWENTY_MINUTES = 1200000;
export const FORTY_FIVE = 2700000;

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

/**
 * Determines if the last time bucket should be dropped due to incomplete data.
 * Given that data arrives every ~15 minutes, we need different strategies per bucket size.
 *
 * @param {string} bucketSize - The bucket size (e.g., '1m', '30m', '1h', '3h', '6h', '1d', '4d', '21d')
 * @param {number} lastBucketTimestamp - Timestamp of the last bucket in milliseconds
 * @param {number} now - Current timestamp in milliseconds (defaults to Date.now())
 * @returns {boolean} - True if the last bucket should be dropped
 */
export function shouldDropLastBucket(
  bucketSize,
  lastBucketTimestamp,
  now = Date.now(),
) {
  const bucketAge = now - lastBucketTimestamp;

  // For minute/sub-hour buckets: always drop (definitely incomplete with 15-min data cadence)
  if (bucketSize === '1m' || bucketSize === '30m' || bucketSize === '1h') {
    return true;
  }

  // For 3h/6h buckets: drop if bucket started less than 20 minutes ago
  if (bucketSize === '3h' || bucketSize === '6h') {
    return bucketAge < TWENTY_MINUTES;
  }

  // For daily/multi-day buckets: drop if bucket started less than 1 hour ago
  if (bucketSize === '1d' || bucketSize === '4d' || bucketSize === '21d') {
    return bucketAge < HOUR;
  }

  return false;
}

function getTimeZone() {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getAvgTotalBody(deviceId, start, end) {
  return getJSONSearch(deviceId, null, start, end, 'avgTotal');
}

export function getDataPageBody(
  deviceId,
  siteId,
  filterErrors,
  start,
  end,
  offset,
  size,
  additionalFields,
) {
  const searchJSON = getJSONSearch(deviceId, siteId, start, end, 'data');
  searchJSON.filterErrors = filterErrors;
  searchJSON.offset = offset;
  searchJSON.size = size;
  if (additionalFields) {
    searchJSON.additionalFields = additionalFields;
  }
  return searchJSON;
}

function getJSONSearch(deviceId, siteId, start, end, type) {
  return {
    deviceId: deviceId,
    endDate: end.getTime(),
    startDate: start.getTime(),
    timeZone: getTimeZone(),
    bucketSize: getBucketSize(end.getTime() - start.getTime(), type),
    type: type,
    siteId: siteId,
  };
}

export function parseSearchReturn(data, bucketSize = null) {
  let { buckets } = data.aggregations[DATE_HISTO];

  // Drop last bucket if incomplete
  if (bucketSize && buckets.length > 0) {
    const lastBucket = buckets[buckets.length - 1];
    const lastBucketTimestamp = Number(lastBucket.key);
    if (shouldDropLastBucket(bucketSize, lastBucketTimestamp)) {
      buckets = buckets.slice(0, -1);
    }
  }

  return buckets.map((d) => {
    return { date: new Date(Number(d.key)), values: d[AVG].value };
  });
}

export function getAggregationValue(data, label) {
  return data !== undefined ? Math.round(data.aggregations[label].value) : 0;
}

export function getInformationalErrorInfo(data) {
  const errorSet = new Set(
    data.aggregations[INFORMATIONAL_ERROR].buckets
      .flatMap((error) => error.key.split('\n'))
      .filter((line) => line.trim() !== '')
      .filter((line) => 'Waiting For Restart' !== line),
  );
  return errorSet.size === 0 ? null : Array.from(errorSet).join('\n');
}

export const parseStackedTimeSeriesData = function (
  data,
  deviceIdToName,
  bucketSize = null,
) {
  let { buckets } = data.aggregations[DATE_HISTO];

  // Drop last bucket if incomplete
  if (bucketSize && buckets.length > 0) {
    const lastBucket = buckets[buckets.length - 1];
    const lastBucketTimestamp = Number(lastBucket.key);
    if (shouldDropLastBucket(bucketSize, lastBucketTimestamp)) {
      buckets = buckets.slice(0, -1);
    }
  }

  const formattedData = [];
  buckets.forEach((d) => {
    const date = new Date(Number(d.key)).toISOString();
    d['sterms#terms'].buckets.forEach((v) => {
      formattedData.push({
        date: date,
        name: deviceIdToName[v.key] || v.key,
        avg: v[AVG] ? v[AVG].value : v['1'].value,
      });
    });
  });
  return formattedData;
};

export const parseMaxData = function (data) {
  return data.aggregations['max#max'].value;
};

export const parseCurrentPower = function (data) {
  return safeParseHits(data, TOTAL_REAL_POWER);
};

export const parseCurrentVoltage = function (data) {
  return safeParseHits(data, VOLTAGE);
};

export const parseCurrentAmperage = function (data) {
  return safeParseHits(data, CURRENT);
};

const safeParseHits = function (data, fieldName) {
  if (data.hits.hits.length <= 0) {
    return 0;
  }
  if (isDataStale(data)) {
    return 0;
  }
  const field = data.hits.hits[0].fields[fieldName];
  if (field && field.length > 0) {
    return field[0];
  }
  return 0;
};

const isDataStale = function (data) {
  try {
    return (
      new Date(data.hits.hits[0].fields['@timestamp']).getTime() <
      new Date().getTime() - FORTY_FIVE
    );
  } catch (e) {
    return false;
  }
};

export const parseAndCondenseStackedTimeSeriesData = function (
  data,
  bucketSize = null,
) {
  let { buckets } = data.aggregations[DATE_HISTO];

  // Drop last bucket if incomplete
  if (bucketSize && buckets.length > 0) {
    const lastBucket = buckets[buckets.length - 1];
    const lastBucketTimestamp = Number(lastBucket.key);
    if (shouldDropLastBucket(bucketSize, lastBucketTimestamp)) {
      buckets = buckets.slice(0, -1);
    }
  }

  const formattedData = [];
  buckets.forEach((d) => {
    const point = { date: new Date(Number(d.key)), values: 0 };
    formattedData.push(point);
    d['sterms#terms'].buckets.forEach((v) => {
      point.values = point.values + (v[AVG] ? v[AVG].value : v['1'].value);
    });
  });
  return formattedData;
};
