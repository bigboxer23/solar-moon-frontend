import { directSearchAPI } from "./services";

export const DATE_HISTO = "date_histogram#2";
export const AVG = "avg#1";
const TIMESTAMP = "@timestamp";
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

export function getStackedTimeSeriesBody(device, start, end, type) {
  if (!directSearchAPI) {
    return getJSONSearch(device, start, end, type);
  }
  let data = getBaseData(start, end);
  data["aggregations"] = {
    "date_histogram#2": {
      date_histogram: {
        field: TIMESTAMP,
        fixed_interval: getBucketSize(start, end, type),
        time_zone: getTimeZone(),
        min_doc_count: 1,
      },
      aggregations: {
        "sterms#terms": {
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
        fixed_interval: getBucketSize(start, end, "timeseries"),
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
    bucketSize: getBucketSize(start, end, type),
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
