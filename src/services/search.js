const DATE_HISTO = "date_histogram#2";
const AVG = "avg#1";
const TIMESTAMP = "@timestamp";
export const TOTAL_REAL_POWER = "Total Real Power";

export const HOUR = 60 * 60 * 1000;
export const DAY = 24 * HOUR;

export const WEEK = 7 * DAY;

export const MONTH = 30 * DAY;

export const YEAR = 365 * DAY;
function getBucketSize(start, end) {
  let difference = end.getTime() - start.getTime();
  if (difference <= HOUR) return "1m";
  if (difference <= DAY) return "30m";
  if (difference <= WEEK) return "3h";
  if (difference <= MONTH) return "12h";
  return "1d";
}

function getTimeZone() {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}
export function getMaxCurrentBody(device, direct) {
  let end = new Date();
  let start = new Date(end.getTime() - WEEK);
  if (!direct) {
    return getJSONSearch(device, start, end, "maxCurrent");
  }
  let data = getBaseData();
  data.size = 1;
  data["aggregations"] = {
    "max#max": {
      max: {
        field: "Total Real Power",
      },
    },
  };
  data.sort = [
    {
      "@timestamp": {
        order: "desc",
      },
    },
  ];
  addFilters(data, device, start, end);
  return data;
}
export function getAvgTotalBody(device, start, end, direct) {
  if (!direct) {
    return getJSONSearch(device, start, end, "avgTotal");
  }
  let data = getBaseData();
  data["aggregations"] = {
    "avg#avg": {
      avg: {
        field: "Total Real Power",
      },
    },
    "sum#total": {
      sum: {
        field: "Energy Consumed",
      },
    },
  };
  addFilters(data, device, start, end);
  return data;
}

export function getTimeSeriesBody(device, start, end, direct) {
  if (!direct) {
    return getJSONSearch(device, start, end, "timeseries");
  }
  let data = getBaseData();
  data["aggregations"] = {
    "date_histogram#2": {
      date_histogram: {
        field: TIMESTAMP,
        fixed_interval: getBucketSize(start, end),
        time_zone: getTimeZone(),
        min_doc_count: 1,
      },
      aggregations: {
        "avg#1": {
          avg: {
            field: TOTAL_REAL_POWER,
          },
        },
      },
    },
  };
  addFilters(data, device, start, end);
  return data;
}

function getJSONSearch(device, start, end, type) {
  return {
    deviceName: device.name,
    endDate: end.getTime(),
    startDate: start.getTime(),
    timeZone: getTimeZone(),
    bucketSize: getBucketSize(start, end),
    type: type,
  };
}

function getBaseData() {
  return {
    size: 0,
    stored_fields: ["*"],
    script_fields: {},
    docvalue_fields: [
      {
        field: TIMESTAMP,
        format: "date_time",
      },
      {
        field: TOTAL_REAL_POWER,
      },
    ],
    _source: {
      excludes: ["*"],
    },
    query: {
      bool: {},
    },
  };
}
function addFilters(data, device, start, end) {
  data.query.bool.filter = [
    {
      match_phrase: {
        "device-name": device.name,
      },
    },
    {
      range: {
        "@timestamp": {
          gte: start.toISOString(),
          lte: end.toISOString(),
          format: "strict_date_optional_time",
        },
      },
    },
  ];
  if (device.virtual) {
    data.query.bool.filter.push({
      match_phrase: {
        Virtual: true,
      },
    });
  }
}

export function parseSearchReturn(data) {
  return data.aggregations[DATE_HISTO].buckets.map((d) => {
    return { date: new Date(Number(d.key)), values: d[AVG].value };
  });
}
