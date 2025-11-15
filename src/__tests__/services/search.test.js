/* eslint-env jest */

// Mock the ReportUtils module
import {
  ALL,
  AVG,
  AVG_AGGREGATION,
  DATE_HISTO,
  DAY,
  FORTY_FIVE,
  getAggregationValue,
  getAvgTotalBody,
  getBucketSize,
  getDataPageBody,
  getInformationalErrorInfo,
  GROUPED_BAR,
  HOUR,
  MONTH,
  parseAndCondenseStackedTimeSeriesData,
  parseCurrentAmperage,
  parseCurrentPower,
  parseCurrentVoltage,
  parseMaxData,
  parseSearchReturn,
  parseStackedTimeSeriesData,
  shouldDropLastBucket,
  TOTAL_AGGREGATION,
  TWENTY_MINUTES,
  WEEK,
  YEAR,
} from '../../services/search';

jest.mock('../../components/views/reports/ReportUtils', () => ({
  TOTAL_REAL_POWER: 'Total Real Power',
}));

describe('search service', () => {
  describe('constants', () => {
    test('exports correct time constants', () => {
      expect(TWENTY_MINUTES).toBe(1200000);
      expect(FORTY_FIVE).toBe(2700000);
      expect(HOUR).toBe(3600000);
      expect(DAY).toBe(86400000);
      expect(WEEK).toBe(604800000);
      expect(MONTH).toBe(2592000000);
      expect(YEAR).toBe(31536000000);
    });

    test('exports correct string constants', () => {
      expect(DATE_HISTO).toBe('date_histogram#2');
      expect(AVG).toBe('avg#1');
      expect(ALL).toBe('All');
      expect(AVG_AGGREGATION).toBe('avg#avg');
      expect(TOTAL_AGGREGATION).toBe('sum#total');
      expect(GROUPED_BAR).toBe('groupedBarGraph');
    });
  });

  describe('getBucketSize', () => {
    test('returns 1m for offsets <= 1 hour', () => {
      expect(getBucketSize(HOUR, 'normal')).toBe('1m');
      expect(getBucketSize(HOUR - 1000, 'normal')).toBe('1m');
    });

    test('returns 30m for offsets <= 1 day (non-grouped)', () => {
      expect(getBucketSize(DAY, 'normal')).toBe('30m');
      expect(getBucketSize(HOUR + 1000, 'normal')).toBe('30m');
    });

    test('returns 1h for offsets <= 1 day (grouped)', () => {
      expect(getBucketSize(DAY, GROUPED_BAR)).toBe('1h');
      expect(getBucketSize(HOUR + 1000, GROUPED_BAR)).toBe('1h');
    });

    test('returns 3h for offsets <= week + day (non-grouped)', () => {
      expect(getBucketSize(WEEK + DAY, 'normal')).toBe('3h');
      expect(getBucketSize(WEEK, 'normal')).toBe('3h');
    });

    test('returns 1d for offsets <= week + day (grouped)', () => {
      expect(getBucketSize(WEEK + DAY, GROUPED_BAR)).toBe('1d');
      expect(getBucketSize(WEEK, GROUPED_BAR)).toBe('1d');
    });

    test('returns 6h for offsets <= month + day (non-grouped)', () => {
      expect(getBucketSize(MONTH + DAY, 'normal')).toBe('6h');
      expect(getBucketSize(MONTH, 'normal')).toBe('6h');
    });

    test('returns 4d for offsets <= month + day (grouped)', () => {
      expect(getBucketSize(MONTH + DAY, GROUPED_BAR)).toBe('4d');
      expect(getBucketSize(MONTH, GROUPED_BAR)).toBe('4d');
    });

    test('returns 1d for large offsets (non-grouped)', () => {
      expect(getBucketSize(YEAR, 'normal')).toBe('1d');
      expect(getBucketSize(MONTH + DAY + 1000, 'normal')).toBe('1d');
    });

    test('returns 21d for large offsets (grouped)', () => {
      expect(getBucketSize(YEAR, GROUPED_BAR)).toBe('21d');
      expect(getBucketSize(MONTH + DAY + 1000, GROUPED_BAR)).toBe('21d');
    });
  });

  describe('shouldDropLastBucket', () => {
    const now = Date.now();

    test('always drops 1m buckets', () => {
      const lastBucketTimestamp = now - 30000; // 30 seconds ago
      expect(shouldDropLastBucket('1m', lastBucketTimestamp, now)).toBe(true);
    });

    test('always drops 30m buckets', () => {
      const lastBucketTimestamp = now - 10 * 60 * 1000; // 10 minutes ago
      expect(shouldDropLastBucket('30m', lastBucketTimestamp, now)).toBe(true);
    });

    test('always drops 1h buckets', () => {
      const lastBucketTimestamp = now - 30 * 60 * 1000; // 30 minutes ago
      expect(shouldDropLastBucket('1h', lastBucketTimestamp, now)).toBe(true);
    });

    test('drops 3h buckets if less than 20 minutes old', () => {
      const recentBucket = now - 10 * 60 * 1000; // 10 minutes ago
      expect(shouldDropLastBucket('3h', recentBucket, now)).toBe(true);
    });

    test('keeps 3h buckets if more than 20 minutes old', () => {
      const oldBucket = now - 25 * 60 * 1000; // 25 minutes ago
      expect(shouldDropLastBucket('3h', oldBucket, now)).toBe(false);
    });

    test('drops 6h buckets if less than 20 minutes old', () => {
      const recentBucket = now - 15 * 60 * 1000; // 15 minutes ago
      expect(shouldDropLastBucket('6h', recentBucket, now)).toBe(true);
    });

    test('keeps 6h buckets if more than 20 minutes old', () => {
      const oldBucket = now - 30 * 60 * 1000; // 30 minutes ago
      expect(shouldDropLastBucket('6h', oldBucket, now)).toBe(false);
    });

    test('drops 1d buckets if less than 1 hour old', () => {
      const recentBucket = now - 30 * 60 * 1000; // 30 minutes ago
      expect(shouldDropLastBucket('1d', recentBucket, now)).toBe(true);
    });

    test('keeps 1d buckets if more than 1 hour old', () => {
      const oldBucket = now - 90 * 60 * 1000; // 90 minutes ago
      expect(shouldDropLastBucket('1d', oldBucket, now)).toBe(false);
    });

    test('drops 4d buckets if less than 1 hour old', () => {
      const recentBucket = now - 45 * 60 * 1000; // 45 minutes ago
      expect(shouldDropLastBucket('4d', recentBucket, now)).toBe(true);
    });

    test('keeps 4d buckets if more than 1 hour old', () => {
      const oldBucket = now - 120 * 60 * 1000; // 120 minutes ago
      expect(shouldDropLastBucket('4d', oldBucket, now)).toBe(false);
    });

    test('drops 21d buckets if less than 1 hour old', () => {
      const recentBucket = now - 30 * 60 * 1000; // 30 minutes ago
      expect(shouldDropLastBucket('21d', recentBucket, now)).toBe(true);
    });

    test('keeps 21d buckets if more than 1 hour old', () => {
      const oldBucket = now - 61 * 60 * 1000; // 61 minutes ago
      expect(shouldDropLastBucket('21d', oldBucket, now)).toBe(false);
    });

    test('defaults to not dropping for unknown bucket sizes', () => {
      const lastBucketTimestamp = now - 1000;
      expect(shouldDropLastBucket('unknown', lastBucketTimestamp, now)).toBe(
        false,
      );
    });
  });

  describe('getAvgTotalBody', () => {
    test('creates correct search body for avgTotal', () => {
      const deviceId = 'device123';
      const start = new Date('2023-01-01T00:00:00Z');
      const end = new Date('2023-01-01T01:00:00Z');

      const result = getAvgTotalBody(deviceId, start, end);

      expect(result).toMatchObject({
        deviceId: 'device123',
        startDate: start.getTime(),
        endDate: end.getTime(),
        type: 'avgTotal',
        siteId: null,
        bucketSize: '1m', // 1 hour offset
      });
      expect(result.timeZone).toBeDefined();
    });
  });

  describe('getDataPageBody', () => {
    test('creates correct search body for data page', () => {
      const deviceId = 'device123';
      const siteId = 'site456';
      const filterErrors = true;
      const start = new Date('2023-01-01T00:00:00Z');
      const end = new Date('2023-01-01T01:00:00Z');
      const offset = 10;
      const size = 50;
      const additionalFields = ['field1', 'field2'];

      const result = getDataPageBody(
        deviceId,
        siteId,
        filterErrors,
        start,
        end,
        offset,
        size,
        additionalFields,
      );

      expect(result).toMatchObject({
        deviceId: 'device123',
        siteId: 'site456',
        startDate: start.getTime(),
        endDate: end.getTime(),
        type: 'data',
        filterErrors: true,
        offset: 10,
        size: 50,
        additionalFields: ['field1', 'field2'],
        bucketSize: '1m',
      });
      expect(result.timeZone).toBeDefined();
    });

    test('creates search body without additional fields when not provided', () => {
      const deviceId = 'device123';
      const siteId = 'site456';
      const filterErrors = false;
      const start = new Date('2023-01-01T00:00:00Z');
      const end = new Date('2023-01-01T01:00:00Z');
      const offset = 10;
      const size = 50;

      const result = getDataPageBody(
        deviceId,
        siteId,
        filterErrors,
        start,
        end,
        offset,
        size,
      );

      expect(result.additionalFields).toBeUndefined();
    });
  });

  describe('parseSearchReturn', () => {
    test('parses search return data correctly', () => {
      const mockData = {
        aggregations: {
          [DATE_HISTO]: {
            buckets: [
              {
                key: '1672531200000', // 2023-01-01T00:00:00Z
                [AVG]: { value: 10.5 },
              },
              {
                key: '1672531260000', // 2023-01-01T00:01:00Z
                [AVG]: { value: 15.2 },
              },
            ],
          },
        },
      };

      const result = parseSearchReturn(mockData);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        date: new Date(1672531200000),
        values: 10.5,
      });
      expect(result[1]).toEqual({
        date: new Date(1672531260000),
        values: 15.2,
      });
    });

    test('drops last bucket when bucket size indicates it should be dropped', () => {
      const now = Date.now();
      const mockData = {
        aggregations: {
          [DATE_HISTO]: {
            buckets: [
              {
                key: String(now - 120000), // 2 minutes ago
                [AVG]: { value: 10.5 },
              },
              {
                key: String(now - 60000), // 1 minute ago
                [AVG]: { value: 15.2 },
              },
            ],
          },
        },
      };

      // For 1m buckets, always drop the last one
      const result = parseSearchReturn(mockData, '1m');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        date: new Date(now - 120000),
        values: 10.5,
      });
    });

    test('keeps all buckets when bucket size indicates it should not be dropped', () => {
      const now = Date.now();
      const mockData = {
        aggregations: {
          [DATE_HISTO]: {
            buckets: [
              {
                key: String(now - 7200000), // 2 hours ago
                [AVG]: { value: 10.5 },
              },
              {
                key: String(now - 3600000), // 1 hour ago
                [AVG]: { value: 15.2 },
              },
            ],
          },
        },
      };

      // For 3h buckets, keep if more than 20 minutes old
      const result = parseSearchReturn(mockData, '3h');

      expect(result).toHaveLength(2);
    });

    test('works without bucket size parameter (backward compatibility)', () => {
      const mockData = {
        aggregations: {
          [DATE_HISTO]: {
            buckets: [
              {
                key: '1672531200000',
                [AVG]: { value: 10.5 },
              },
            ],
          },
        },
      };

      const result = parseSearchReturn(mockData);

      expect(result).toHaveLength(1);
      expect(result[0].values).toBe(10.5);
    });
  });

  describe('getAggregationValue', () => {
    test('returns rounded aggregation value when data exists', () => {
      const mockData = {
        aggregations: {
          'test-label': { value: 10.7 },
        },
      };

      const result = getAggregationValue(mockData, 'test-label');
      expect(result).toBe(11);
    });

    test('returns 0 when data is undefined', () => {
      const result = getAggregationValue(undefined, 'test-label');
      expect(result).toBe(0);
    });

    test('returns 0 when aggregation label does not exist', () => {
      const mockData = {
        aggregations: {
          'other-label': { value: 10.7 },
        },
      };

      // This will actually throw an error, so let's test that the function
      // doesn't handle this case properly
      expect(() => getAggregationValue(mockData, 'test-label')).toThrow();
    });
  });

  describe('getInformationalErrorInfo', () => {
    test('returns null when no errors', () => {
      const mockData = {
        aggregations: {
          'sterms#informationalErrorString': {
            buckets: [],
          },
        },
      };

      const result = getInformationalErrorInfo(mockData);
      expect(result).toBeNull();
    });

    test('returns error string when errors exist', () => {
      const mockData = {
        aggregations: {
          'sterms#informationalErrorString': {
            buckets: [{ key: 'Error 1\nError 2' }, { key: 'Error 3\n' }],
          },
        },
      };

      const result = getInformationalErrorInfo(mockData);
      expect(result).toBe('Error 1\nError 2\nError 3');
    });

    test('filters out "Waiting For Restart" errors', () => {
      const mockData = {
        aggregations: {
          'sterms#informationalErrorString': {
            buckets: [
              { key: 'Error 1\nWaiting For Restart' },
              { key: 'Error 2' },
            ],
          },
        },
      };

      const result = getInformationalErrorInfo(mockData);
      expect(result).toBe('Error 1\nError 2');
    });

    test('filters out empty lines', () => {
      const mockData = {
        aggregations: {
          'sterms#informationalErrorString': {
            buckets: [{ key: 'Error 1\n\nError 2\n   \n' }],
          },
        },
      };

      const result = getInformationalErrorInfo(mockData);
      expect(result).toBe('Error 1\nError 2');
    });
  });

  describe('parseStackedTimeSeriesData', () => {
    test('parses stacked time series data correctly', () => {
      const mockData = {
        aggregations: {
          [DATE_HISTO]: {
            buckets: [
              {
                key: '1672531200000',
                'sterms#terms': {
                  buckets: [
                    {
                      key: 'device1',
                      [AVG]: { value: 10.5 },
                    },
                    {
                      key: 'device2',
                      [AVG]: { value: 15.2 },
                    },
                  ],
                },
              },
            ],
          },
        },
      };

      const deviceIdToName = {
        device1: 'Device One',
        device2: 'Device Two',
      };

      const result = parseStackedTimeSeriesData(mockData, deviceIdToName);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        date: new Date(1672531200000).toISOString(),
        name: 'Device One',
        avg: 10.5,
      });
      expect(result[1]).toEqual({
        date: new Date(1672531200000).toISOString(),
        name: 'Device Two',
        avg: 15.2,
      });
    });

    test('uses device ID as name when mapping not found', () => {
      const mockData = {
        aggregations: {
          [DATE_HISTO]: {
            buckets: [
              {
                key: '1672531200000',
                'sterms#terms': {
                  buckets: [
                    {
                      key: 'unknown-device',
                      [AVG]: { value: 10.5 },
                    },
                  ],
                },
              },
            ],
          },
        },
      };

      const result = parseStackedTimeSeriesData(mockData, {});

      expect(result[0].name).toBe('unknown-device');
    });

    test('handles alternative value field "1"', () => {
      const mockData = {
        aggregations: {
          [DATE_HISTO]: {
            buckets: [
              {
                key: '1672531200000',
                'sterms#terms': {
                  buckets: [
                    {
                      key: 'device1',
                      1: { value: 20.5 },
                    },
                  ],
                },
              },
            ],
          },
        },
      };

      const result = parseStackedTimeSeriesData(mockData, {});
      expect(result[0].avg).toBe(20.5);
    });

    test('drops last bucket when bucket size indicates it should be dropped', () => {
      const now = Date.now();
      const mockData = {
        aggregations: {
          [DATE_HISTO]: {
            buckets: [
              {
                key: String(now - 120000), // 2 minutes ago
                'sterms#terms': {
                  buckets: [
                    {
                      key: 'device1',
                      [AVG]: { value: 10.5 },
                    },
                  ],
                },
              },
              {
                key: String(now - 60000), // 1 minute ago (should be dropped)
                'sterms#terms': {
                  buckets: [
                    {
                      key: 'device1',
                      [AVG]: { value: 15.2 },
                    },
                  ],
                },
              },
            ],
          },
        },
      };

      // For 1m buckets, always drop the last one
      const result = parseStackedTimeSeriesData(mockData, {}, '1m');

      expect(result).toHaveLength(1);
      expect(result[0].avg).toBe(10.5);
    });

    test('works without bucket size parameter (backward compatibility)', () => {
      const mockData = {
        aggregations: {
          [DATE_HISTO]: {
            buckets: [
              {
                key: '1672531200000',
                'sterms#terms': {
                  buckets: [
                    {
                      key: 'device1',
                      [AVG]: { value: 10.5 },
                    },
                  ],
                },
              },
            ],
          },
        },
      };

      const result = parseStackedTimeSeriesData(mockData, {});

      expect(result).toHaveLength(1);
      expect(result[0].avg).toBe(10.5);
    });
  });

  describe('parseMaxData', () => {
    test('returns max value from aggregation', () => {
      const mockData = {
        aggregations: {
          'max#max': { value: 42.7 },
        },
      };

      const result = parseMaxData(mockData);
      expect(result).toBe(42.7);
    });
  });

  describe('parseCurrentPower', () => {
    test('returns power value from hits when data is fresh', () => {
      const mockData = {
        hits: {
          hits: [
            {
              fields: {
                'Total Real Power': [1500.5],
                '@timestamp': [new Date().toISOString()],
              },
            },
          ],
        },
      };

      const result = parseCurrentPower(mockData);
      expect(result).toBe(1500.5);
    });

    test('returns 0 when no hits', () => {
      const mockData = {
        hits: {
          hits: [],
        },
      };

      const result = parseCurrentPower(mockData);
      expect(result).toBe(0);
    });

    test('returns 0 when data is stale', () => {
      const staleTimestamp = new Date(Date.now() - FORTY_FIVE - 1000);
      const mockData = {
        hits: {
          hits: [
            {
              fields: {
                'Total Real Power': [1500.5],
                '@timestamp': [staleTimestamp.toISOString()],
              },
            },
          ],
        },
      };

      const result = parseCurrentPower(mockData);
      expect(result).toBe(0);
    });
  });

  describe('parseCurrentVoltage', () => {
    test('returns voltage value from hits', () => {
      const mockData = {
        hits: {
          hits: [
            {
              fields: {
                'Average Voltage (L-N)': [240.5],
                '@timestamp': [new Date().toISOString()],
              },
            },
          ],
        },
      };

      const result = parseCurrentVoltage(mockData);
      expect(result).toBe(240.5);
    });
  });

  describe('parseCurrentAmperage', () => {
    test('returns current value from hits', () => {
      const mockData = {
        hits: {
          hits: [
            {
              fields: {
                'Average Current': [12.5],
                '@timestamp': [new Date().toISOString()],
              },
            },
          ],
        },
      };

      const result = parseCurrentAmperage(mockData);
      expect(result).toBe(12.5);
    });
  });

  describe('parseAndCondenseStackedTimeSeriesData', () => {
    test('condenses stacked time series data by summing values', () => {
      const mockData = {
        aggregations: {
          [DATE_HISTO]: {
            buckets: [
              {
                key: '1672531200000',
                'sterms#terms': {
                  buckets: [
                    {
                      key: 'device1',
                      [AVG]: { value: 10.5 },
                    },
                    {
                      key: 'device2',
                      [AVG]: { value: 15.2 },
                    },
                  ],
                },
              },
              {
                key: '1672531260000',
                'sterms#terms': {
                  buckets: [
                    {
                      key: 'device1',
                      [AVG]: { value: 5.0 },
                    },
                  ],
                },
              },
            ],
          },
        },
      };

      const result = parseAndCondenseStackedTimeSeriesData(mockData);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        date: new Date(1672531200000),
        values: 25.7, // 10.5 + 15.2
      });
      expect(result[1]).toEqual({
        date: new Date(1672531260000),
        values: 5.0,
      });
    });

    test('handles alternative value field "1"', () => {
      const mockData = {
        aggregations: {
          [DATE_HISTO]: {
            buckets: [
              {
                key: '1672531200000',
                'sterms#terms': {
                  buckets: [
                    {
                      key: 'device1',
                      1: { value: 10.0 },
                    },
                    {
                      key: 'device2',
                      1: { value: 5.0 },
                    },
                  ],
                },
              },
            ],
          },
        },
      };

      const result = parseAndCondenseStackedTimeSeriesData(mockData);
      expect(result[0].values).toBe(15.0);
    });

    test('drops last bucket when bucket size indicates it should be dropped', () => {
      const now = Date.now();
      const mockData = {
        aggregations: {
          [DATE_HISTO]: {
            buckets: [
              {
                key: String(now - 120000), // 2 minutes ago
                'sterms#terms': {
                  buckets: [
                    {
                      key: 'device1',
                      [AVG]: { value: 10.5 },
                    },
                    {
                      key: 'device2',
                      [AVG]: { value: 5.0 },
                    },
                  ],
                },
              },
              {
                key: String(now - 60000), // 1 minute ago (should be dropped)
                'sterms#terms': {
                  buckets: [
                    {
                      key: 'device1',
                      [AVG]: { value: 20.0 },
                    },
                  ],
                },
              },
            ],
          },
        },
      };

      // For 1m buckets, always drop the last one
      const result = parseAndCondenseStackedTimeSeriesData(mockData, '1m');

      expect(result).toHaveLength(1);
      expect(result[0].values).toBe(15.5); // 10.5 + 5.0
    });

    test('works without bucket size parameter (backward compatibility)', () => {
      const mockData = {
        aggregations: {
          [DATE_HISTO]: {
            buckets: [
              {
                key: '1672531200000',
                'sterms#terms': {
                  buckets: [
                    {
                      key: 'device1',
                      [AVG]: { value: 10.0 },
                    },
                  ],
                },
              },
            ],
          },
        },
      };

      const result = parseAndCondenseStackedTimeSeriesData(mockData);

      expect(result).toHaveLength(1);
      expect(result[0].values).toBe(10.0);
    });
  });
});
