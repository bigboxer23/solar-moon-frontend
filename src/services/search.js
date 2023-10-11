export function getSearchBody(device, start, end) {
  let data = {
    aggs: {
      2: {
        date_histogram: {
          field: "@timestamp",
          fixed_interval: "30m",
          time_zone: "America/Chicago",
          min_doc_count: 1,
        },
        aggs: {
          1: {
            avg: {
              field: "Total Real Power",
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
        field: "@timestamp",
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
  return data.aggregations["2"].buckets.map((d) => {
    return { date: new Date(d.key), values: d[1].value };
  });
}

export const HOUR = 60 * 60 * 1000;
export const DAY = 24 * HOUR;

export const WEEK = 7 * DAY;

export const MONTH = 30 * DAY;

export const YEAR = 365 * DAY;
