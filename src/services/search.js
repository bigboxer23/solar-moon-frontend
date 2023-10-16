import { directSearchAPI } from "./services";

export const DATE_HISTO = "date_histogram#2";
export const AVG = "avg#1";
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
export function getMaxCurrentBody(device) {
  let end = new Date();
  let start = new Date(end.getTime() - WEEK);
  if (!directSearchAPI) {
    return getJSONSearch(device, start, end, "maxCurrent");
  }
  let data = getBaseData(start, end);
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
  addDeviceFilter(data, device);
  return data;
}
export function getAvgTotalBody(device, start, end) {
  if (!directSearchAPI) {
    return getJSONSearch(device, start, end, "avgTotal");
  }
  let data = getBaseData(start, end);
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
  addDeviceFilter(data, device);
  return data;
}

export function getStackedTimeSeriesBody(device, start, end) {
  if (!directSearchAPI) {
    return getJSONSearch(device, start, end, "stackedTimeSeries");
  }
  let data = getBaseData(start, end);
  data["aggregations"] = {
    "date_histogram#2": {
      date_histogram: {
        field: TIMESTAMP,
        fixed_interval: getBucketSize(start, end),
        time_zone: getTimeZone(),
        min_doc_count: 1,
      },
      aggregations: {
        "terms#terms": {
          terms: {
            field: "device-name.keyword",
            order: {
              1: "desc",
            },
            size: 10,
          },
          aggregations: {
            1: {
              avg: {
                field: TOTAL_REAL_POWER,
              },
            },
          },
        },
      },
    },
  };
  addSiteFilter(data, device.site);
  console.log(JSON.stringify(data));
  return data;
}

export function getTimeSeriesBody(device, start, end) {
  if (!directSearchAPI) {
    return getJSONSearch(device, start, end, "timeseries");
  }
  let data = getBaseData(start, end);
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
  addDeviceFilter(data, device);
  return data;
}

function getJSONSearch(device, start, end, type) {
  return {
    deviceName: device.name,
    deviceId: device.id,
    endDate: end.getTime(),
    startDate: start.getTime(),
    timeZone: getTimeZone(),
    bucketSize: getBucketSize(start, end),
    type: type,
  };
}

function getBaseData(start, end) {
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
      bool: {
        filter: [
          {
            range: {
              "@timestamp": {
                gte: start.toISOString(),
                lte: end.toISOString(),
                format: "strict_date_optional_time",
              },
            },
          },
        ],
      },
    },
  };
}

function addSiteFilter(data, siteName) {
  data.query.bool.filter.push({
    match_phrase: {
      site: siteName,
    },
  });
  data.query.bool.must_not = [
    {
      exists: {
        field: "Virtual",
      },
    },
  ];
}
function addDeviceFilter(data, device) {
  data.query.bool.filter.push({
    match_phrase: {
      "device-name": device.name,
    },
  });
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
