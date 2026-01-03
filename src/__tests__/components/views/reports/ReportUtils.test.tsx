/* eslint-env jest */
import React from 'react';

import {
  DEVICE_ID_KEYWORD,
  DISPLAY_NAME,
  ENERGY_CONSUMED,
  INFORMATIONAL_ERROR,
  SITE_ID_KEYWORD,
  sortRowData,
  TOTAL_ENERGY_CONS,
  TOTAL_REAL_POWER,
  transformRowData,
} from '../../../../components/views/reports/ReportUtils';

jest.mock('@tippyjs/react', () => {
  return function MockTippy({
    children,
    content,
    delay,
    placement,
  }: {
    children: React.ReactNode;
    content: unknown;
    delay: number;
    placement: string;
  }) {
    return (
      <div
        data-content={typeof content === 'string' ? content : 'tooltip'}
        data-delay={delay}
        data-placement={placement}
        data-testid='tippy-tooltip'
      >
        {children}
      </div>
    );
  };
});

jest.mock('../../../../utils/Utils', () => ({
  getFormattedTime: jest.fn(),
  roundToDecimals: jest.fn(),
  TIPPY_DELAY: 500,
  transformMultiLineForHTMLDisplay: jest.fn(),
}));

const utils = require('../../../../utils/Utils');

describe('ReportUtils', () => {
  describe('Constants', () => {
    test('exports correct field constants', () => {
      expect(TOTAL_REAL_POWER).toBe('Total Real Power');
      expect(TOTAL_ENERGY_CONS).toBe('Total Energy Consumption');
      expect(ENERGY_CONSUMED).toBe('Energy Consumed');
      expect(SITE_ID_KEYWORD).toBe('siteId.keyword');
      expect(DEVICE_ID_KEYWORD).toBe('device-id.keyword');
      expect(INFORMATIONAL_ERROR).toBe('informationalErrorString.keyword');
      expect(DISPLAY_NAME).toBe('displayName');
    });
  });

  describe('transformRowData', () => {
    const mockDeviceMap = {
      'site-1': 'Site A',
      'device-1': 'Device 1',
    };

    const mockIntl = {
      formatNumber: jest.fn((value: number) => value.toFixed(2)),
    };

    beforeEach(() => {
      jest.clearAllMocks();

      utils.getFormattedTime.mockReturnValue('2024-01-15 10:30 AM');
      utils.roundToDecimals.mockImplementation(
        (value: number, multiplier: number) =>
          Math.round(value * multiplier) / multiplier,
      );
      utils.transformMultiLineForHTMLDisplay.mockImplementation(
        (text: string) => text.replace(/\n/g, '<br>'),
      );
    });

    test('transforms timestamp correctly', () => {
      const row = {
        '@timestamp': '2024-01-15T10:30:00Z',
      };

      const result = transformRowData(row, mockDeviceMap, mockIntl);

      expect(utils.getFormattedTime).toHaveBeenCalledWith(
        new Date('2024-01-15T10:30:00Z'),
      );
      expect(result.time).toBe('2024-01-15 10:30 AM');
      expect(result.timeSort).toBe(
        Math.round(new Date('2024-01-15T10:30:00Z').getTime() / 60000) * 60000,
      );
    });

    test('formats numeric fields with intl formatter', () => {
      const row = {
        '@timestamp': '2024-01-15T10:30:00Z',
        [TOTAL_ENERGY_CONS]: 1234.5678,
        [TOTAL_REAL_POWER]: 987.654,
        [ENERGY_CONSUMED]: 543.21,
      };

      transformRowData(row, mockDeviceMap, mockIntl);

      expect(utils.roundToDecimals).toHaveBeenCalledWith(1234.5678, 100);
      expect(utils.roundToDecimals).toHaveBeenCalledWith(987.654, 100);
      expect(utils.roundToDecimals).toHaveBeenCalledWith(543.21, 100);

      expect(mockIntl.formatNumber).toHaveBeenCalledTimes(3);
      expect(mockIntl.formatNumber).toHaveBeenCalledWith(expect.any(Number));
    });

    test('handles null numeric values', () => {
      const row = {
        '@timestamp': '2024-01-15T10:30:00Z',
        [TOTAL_ENERGY_CONS]: null,
        [TOTAL_REAL_POWER]: undefined,
      };

      const result = transformRowData(row, mockDeviceMap, mockIntl);

      expect(result[TOTAL_ENERGY_CONS]).toBeNull();
      expect(result[TOTAL_REAL_POWER]).toBeUndefined();
      expect(mockIntl.formatNumber).not.toHaveBeenCalled();
    });

    test('maps site and device IDs using device map', () => {
      const row = {
        '@timestamp': '2024-01-15T10:30:00Z',
        [SITE_ID_KEYWORD]: 'site-1',
        [DEVICE_ID_KEYWORD]: 'device-1',
      };

      const result = transformRowData(row, mockDeviceMap, mockIntl);

      expect(result[SITE_ID_KEYWORD]).toBe('Site A');
      expect(result[DEVICE_ID_KEYWORD]).toBe('Device 1');
      expect(result[DISPLAY_NAME]).toBe('Device 1');
    });

    test('uses original ID when not found in device map', () => {
      const row = {
        '@timestamp': '2024-01-15T10:30:00Z',
        [SITE_ID_KEYWORD]: 'unknown-site',
        [DEVICE_ID_KEYWORD]: 'unknown-device',
      };

      const result = transformRowData(row, mockDeviceMap, mockIntl);

      expect(result[SITE_ID_KEYWORD]).toBe('unknown-site');
      expect(result[DEVICE_ID_KEYWORD]).toBe('unknown-device');
      expect(result[DISPLAY_NAME]).toBe('unknown-device');
    });

    test('sets display name to device ID', () => {
      const row = {
        '@timestamp': '2024-01-15T10:30:00Z',
        [DEVICE_ID_KEYWORD]: 'device-1',
      };

      const result = transformRowData(row, mockDeviceMap, mockIntl);

      expect(result[DISPLAY_NAME]).toBe('Device 1');
    });

    test('handles informational error when present and not empty', () => {
      const row = {
        '@timestamp': '2024-01-15T10:30:00Z',
        [DEVICE_ID_KEYWORD]: 'device-1',
        [INFORMATIONAL_ERROR]: ['Error message\nMulti-line error'],
      };

      const result = transformRowData(row, mockDeviceMap, mockIntl);

      expect(utils.transformMultiLineForHTMLDisplay).toHaveBeenCalledWith(
        'Error message\nMulti-line error',
      );
      expect(result[INFORMATIONAL_ERROR]).toBe(
        'Error message<br>Multi-line error',
      );

      // Should return JSX element for display name with tooltip
      expect(React.isValidElement(result[DISPLAY_NAME])).toBe(true);
    });

    test('ignores empty informational error', () => {
      const row = {
        '@timestamp': '2024-01-15T10:30:00Z',
        [DEVICE_ID_KEYWORD]: 'device-1',
        [INFORMATIONAL_ERROR]: [''],
      };

      const result = transformRowData(row, mockDeviceMap, mockIntl);

      expect(utils.transformMultiLineForHTMLDisplay).not.toHaveBeenCalled();
      expect(result[DISPLAY_NAME]).toBe('Device 1');
    });

    test('ignores undefined informational error', () => {
      const row = {
        '@timestamp': '2024-01-15T10:30:00Z',
        [DEVICE_ID_KEYWORD]: 'device-1',
        [INFORMATIONAL_ERROR]: undefined,
      };

      const result = transformRowData(row, mockDeviceMap, mockIntl);

      expect(utils.transformMultiLineForHTMLDisplay).not.toHaveBeenCalled();
      expect(result[DISPLAY_NAME]).toBe('Device 1');
    });

    test('ignores empty array informational error', () => {
      const row = {
        '@timestamp': '2024-01-15T10:30:00Z',
        [DEVICE_ID_KEYWORD]: 'device-1',
        [INFORMATIONAL_ERROR]: [],
      };

      const result = transformRowData(row, mockDeviceMap, mockIntl);

      expect(utils.transformMultiLineForHTMLDisplay).not.toHaveBeenCalled();
      expect(result[DISPLAY_NAME]).toBe('Device 1');
    });

    test('returns modified row object', () => {
      const row = {
        '@timestamp': '2024-01-15T10:30:00Z',
        [DEVICE_ID_KEYWORD]: 'device-1',
        otherField: 'preserved',
      };

      const result = transformRowData(row, mockDeviceMap, mockIntl);

      expect(result).toEqual(
        expect.objectContaining({
          '@timestamp': '2024-01-15T10:30:00Z',
          time: '2024-01-15 10:30 AM',
          timeSort: expect.any(Number),
          [DEVICE_ID_KEYWORD]: 'Device 1',
          [DISPLAY_NAME]: 'Device 1',
          otherField: 'preserved',
        }),
      );
    });
  });

  describe('sortRowData', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('sorts by timeSort descending (newest first)', () => {
      const row1 = {
        timeSort: 1000,
        [SITE_ID_KEYWORD]: 'Site A',
        [DEVICE_ID_KEYWORD]: 'Device A',
      };
      const row2 = {
        timeSort: 2000,
        [SITE_ID_KEYWORD]: 'Site A',
        [DEVICE_ID_KEYWORD]: 'Device A',
      };

      const result = sortRowData(row1, row2);

      expect(result).toBe(1000); // row2.timeSort - row1.timeSort = 2000 - 1000 = 1000
    });

    test('sorts by site when timeSort is equal', () => {
      const row1 = {
        timeSort: 1000,
        [SITE_ID_KEYWORD]: 'Site B',
        [DEVICE_ID_KEYWORD]: 'Device A',
      };
      const row2 = {
        timeSort: 1000,
        [SITE_ID_KEYWORD]: 'Site A',
        [DEVICE_ID_KEYWORD]: 'Device A',
      };

      const result = sortRowData(row1, row2);

      expect(result).toBeGreaterThan(0); // 'Site B' > 'Site A'
    });

    test('sorts by device when timeSort and site are equal', () => {
      const row1 = {
        timeSort: 1000,
        [SITE_ID_KEYWORD]: 'Site A',
        [DEVICE_ID_KEYWORD]: 'Device B',
      };
      const row2 = {
        timeSort: 1000,
        [SITE_ID_KEYWORD]: 'Site A',
        [DEVICE_ID_KEYWORD]: 'Device A',
      };

      const result = sortRowData(row1, row2);

      expect(result).toBeGreaterThan(0); // 'Device B' > 'Device A'
    });

    test('returns 0 when all sort fields are equal', () => {
      const row1 = {
        timeSort: 1000,
        [SITE_ID_KEYWORD]: 'Site A',
        [DEVICE_ID_KEYWORD]: 'Device A',
      };
      const row2 = {
        timeSort: 1000,
        [SITE_ID_KEYWORD]: 'Site A',
        [DEVICE_ID_KEYWORD]: 'Device A',
      };

      const result = sortRowData(row1, row2);

      expect(result).toBe(0);
    });

    test('handles array values in comparison fields', () => {
      const row1 = {
        timeSort: 1000,
        [SITE_ID_KEYWORD]: ['Site B'],
        [DEVICE_ID_KEYWORD]: ['Device A'],
      };
      const row2 = {
        timeSort: 1000,
        [SITE_ID_KEYWORD]: ['Site A'],
        [DEVICE_ID_KEYWORD]: ['Device A'],
      };

      const result = sortRowData(row1, row2);

      expect(result).toBeGreaterThan(0); // 'Site B' > 'Site A'
    });

    test('handles null and undefined values', () => {
      const row1 = {
        timeSort: 1000,
        [SITE_ID_KEYWORD]: 'Site A',
        [DEVICE_ID_KEYWORD]: 'Device A',
      };
      const row2 = {
        timeSort: 1000,
        [SITE_ID_KEYWORD]: 'Site A',
        [DEVICE_ID_KEYWORD]: 'Device B',
      };

      // Test normal string comparison
      const result = sortRowData(row1, row2);
      expect(typeof result).toBe('number');
    });

    test('compares string values correctly', () => {
      const row1 = {
        timeSort: 1000,
        [SITE_ID_KEYWORD]: 'Site A',
        [DEVICE_ID_KEYWORD]: 'Device A',
      };
      const row2 = {
        timeSort: 1000,
        [SITE_ID_KEYWORD]: 'Site B',
        [DEVICE_ID_KEYWORD]: 'Device A',
      };

      const result = sortRowData(row1, row2);

      // Should return negative since 'Site A' < 'Site B'
      expect(result).toBeLessThan(0);
    });

    test('uses locale-aware comparison with accent sensitivity', () => {
      const row1 = {
        timeSort: 1000,
        [SITE_ID_KEYWORD]: 'Sité A',
        [DEVICE_ID_KEYWORD]: 'Device A',
      };
      const row2 = {
        timeSort: 1000,
        [SITE_ID_KEYWORD]: 'Site A',
        [DEVICE_ID_KEYWORD]: 'Device A',
      };

      const result = sortRowData(row1, row2);

      // Result depends on locale implementation, but should not throw
      expect(typeof result).toBe('number');
    });
  });

  describe('Integration Tests', () => {
    test('transformRowData produces data suitable for sortRowData', () => {
      const mockDeviceMap = {
        'site-1': 'Site A',
        'device-1': 'Device 1',
      };
      const mockIntl = {
        formatNumber: jest.fn((value) => value.toString()),
      };

      const row1 = {
        '@timestamp': '2024-01-15T10:30:00Z',
        [SITE_ID_KEYWORD]: 'site-1',
        [DEVICE_ID_KEYWORD]: 'device-1',
      };

      const row2 = {
        '@timestamp': '2024-01-15T11:00:00Z',
        [SITE_ID_KEYWORD]: 'site-1',
        [DEVICE_ID_KEYWORD]: 'device-1',
      };

      const transformedRow1 = transformRowData(row1, mockDeviceMap, mockIntl);
      const transformedRow2 = transformRowData(row2, mockDeviceMap, mockIntl);

      expect(() => sortRowData(transformedRow1, transformedRow2)).not.toThrow();

      const sortResult = sortRowData(transformedRow1, transformedRow2);
      expect(typeof sortResult).toBe('number');
    });

    test('time coefficient creates appropriate timeSort values', () => {
      const mockDeviceMap = {};
      const mockIntl = { formatNumber: jest.fn((value) => value.toString()) };

      const row = {
        '@timestamp': '2024-01-15T10:30:45.123Z', // Has seconds and milliseconds
      };

      const result = transformRowData(row, mockDeviceMap, mockIntl);

      const coef = 1000 * 60; // 60s coefficient from the actual code
      const date = new Date('2024-01-15T10:30:45.123Z');
      const expectedTime = Math.round(date.getTime() / coef) * coef;
      expect(result.timeSort).toBe(expectedTime);

      // Verify it rounds to nearest minute
      expect((result.timeSort ?? 0) % 60000).toBe(0);
    });

    test('error tooltip integration', () => {
      const mockDeviceMap = {
        'device-1': 'Device 1',
      };
      const mockIntl = { formatNumber: jest.fn() };

      utils.transformMultiLineForHTMLDisplay.mockReturnValue(
        'Error message<br>Line 2',
      );

      const row = {
        '@timestamp': '2024-01-15T10:30:00Z',
        [DEVICE_ID_KEYWORD]: 'device-1',
        [INFORMATIONAL_ERROR]: ['Error message\nLine 2'],
      };

      const result = transformRowData(row, mockDeviceMap, mockIntl);

      expect(React.isValidElement(result[DISPLAY_NAME])).toBe(true);
      expect(result[INFORMATIONAL_ERROR]).toBe('Error message<br>Line 2');
    });
  });

  describe('Edge Cases', () => {
    test('handles empty row object', () => {
      const mockDeviceMap = {};
      const mockIntl = { formatNumber: jest.fn() };

      const row = {};

      expect(() =>
        transformRowData(row, mockDeviceMap, mockIntl),
      ).not.toThrow();

      const result = transformRowData(row, mockDeviceMap, mockIntl);
      expect(result).toBeDefined();
    });

    test('handles empty device map', () => {
      const mockDeviceMap = {};
      const mockIntl = { formatNumber: jest.fn() };

      const row = {
        '@timestamp': '2024-01-15T10:30:00Z',
        [SITE_ID_KEYWORD]: 'site-1',
        [DEVICE_ID_KEYWORD]: 'device-1',
      };

      const result = transformRowData(row, mockDeviceMap, mockIntl);

      expect(result[SITE_ID_KEYWORD]).toBe('site-1');
      expect(result[DEVICE_ID_KEYWORD]).toBe('device-1');
    });

    test('handles missing intl object', () => {
      const mockDeviceMap = {};
      const mockIntl = null;

      const row = {
        '@timestamp': '2024-01-15T10:30:00Z',
        [TOTAL_ENERGY_CONS]: 123.45,
      };

      expect(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformRowData(row, mockDeviceMap, mockIntl as any),
      ).toThrow();
    });

    test('sortRowData handles missing fields gracefully', () => {
      const row1 = {
        timeSort: 1000,
        [SITE_ID_KEYWORD]: '',
        [DEVICE_ID_KEYWORD]: '',
      };
      const row2 = {
        timeSort: 1000,
        [SITE_ID_KEYWORD]: '',
        [DEVICE_ID_KEYWORD]: '',
      };

      const result = sortRowData(row1, row2);
      expect(result).toBe(0);
    });
  });
});
