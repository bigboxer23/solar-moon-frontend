const DATE_HISTO = "date_histogram#2";
const AVG = "avg#1";
const TIMESTAMP = "@timestamp";
const TOTAL_REAL_POWER = "Total Real Power";

export const HOUR = 60 * 60 * 1000;
export const DAY = 24 * HOUR;

export const WEEK = 7 * DAY;

export const MONTH = 30 * DAY;

export const YEAR = 365 * DAY;
function getBucketSize(start, end) {
  let difference = end.getTime() - start.getTime();
  console.log(difference + " " + DAY);
  if (difference <= HOUR) return "1m";
  if (difference <= DAY) return "30m";
  if (difference <= WEEK) return "3h";
  if (difference <= MONTH) return "12h";
  return "1d";
}

function getTimeZone() {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}
export function getSearchBody(device, start, end) {
  return {
    deviceName: device.name,
    endDate: end.getTime(),
    startDate: start.getTime(),
    timeZone: getTimeZone(),
    bucketSize: getBucketSize(start, end),
  };
}

export function getSearchBodyDirect(device, start, end) {
  let data = {
    aggregations: {
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
    },
    size: 0,
    stored_fields: ["*"],
    script_fields: {},
    docvalue_fields: [
      {
        field: TIMESTAMP,
        format: "date_time",
      },
    ],
    _source: {
      excludes: [],
    },
    query: {
      bool: {},
    },
  };
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
  return data;
}

export function parseSearchReturn(data) {
  return data.aggregations[DATE_HISTO].buckets.map((d) => {
    return { date: new Date(Number(d.key)), values: d[AVG].value };
  });
}
