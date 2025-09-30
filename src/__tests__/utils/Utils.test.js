/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import { format } from 'date-fns';
import React from 'react';

import {
  compare,
  debounce,
  defaultIfEmpty,
  findSiteNameFromSiteId,
  formatMessage,
  getDaysLeftInTrial,
  getDeviceIdToNameMap,
  getDisplayName,
  getFormattedDate,
  getFormattedDaysHoursMinutes,
  getFormattedShortTime,
  getFormattedTime,
  getPowerScalingInformation,
  getRoundedTime,
  getRoundedTimeFromOffset,
  getWeatherIcon,
  getWeatherIconWithTippy,
  isXS,
  maybeSetTimeWindow,
  roundToDecimals,
  roundTwoDigit,
  sortDevices,
  sortDevicesWithDisabled,
  timeIncrementToText,
  timeLabel,
  TIPPY_DELAY,
  transformMultiLineForHTMLDisplay,
  truncate,
} from '../../utils/Utils';

// Mock the search service to avoid ES6 import issues
jest.mock('../../services/search', () => ({
  DAY: 86400000,
  HOUR: 3600000,
  MONTH: 2592000000,
  WEEK: 604800000,
  YEAR: 31536000000,
}));

// Mock the SiteManagement component to avoid import chain issues
jest.mock('../../components/views/site-management/SiteManagement', () => ({
  noSite: 'No Site',
}));

const { DAY, HOUR, MONTH, WEEK, YEAR } = require('../../services/search');

// Mock Tippy component
jest.mock('@tippyjs/react', () => {
  const MockTippy = ({ children, content }) => (
    <div data-content={content} data-testid='tippy'>
      {children}
    </div>
  );
  MockTippy.displayName = 'MockTippy';
  return MockTippy;
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('defaultIfEmpty', () => {
    it('returns default value when input is null', () => {
      expect(defaultIfEmpty('default', null)).toBe('default');
    });

    it('returns default value when input is undefined', () => {
      expect(defaultIfEmpty('default', undefined)).toBe('default');
    });

    it('returns default value when input is empty string', () => {
      expect(defaultIfEmpty('default', '')).toBe('default');
    });

    it('returns actual value when not empty', () => {
      expect(defaultIfEmpty('default', 'actual')).toBe('actual');
    });

    it('returns 0 when value is 0', () => {
      expect(defaultIfEmpty('default', 0)).toBe(0);
    });

    it('returns false when value is false', () => {
      expect(defaultIfEmpty('default', false)).toBe(false);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('cancels previous calls when called multiple times', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('date formatting functions', () => {
    const testDate = new Date('2023-12-25T15:30:45');

    it('getFormattedShortTime formats correctly', () => {
      const result = getFormattedShortTime(testDate);
      expect(result).toMatch(/12\/25 3:30[pa]/i);
    });

    it('getFormattedTime formats correctly', () => {
      const result = getFormattedTime(testDate);
      expect(result).toMatch(/Dec 25, 23 3:30 [pa]m/i);
    });

    it('getFormattedDate formats correctly', () => {
      const result = getFormattedDate(testDate);
      expect(result).toBe('Dec 25, 23');
    });
  });

  describe('getDisplayName', () => {
    it('returns name when available', () => {
      const device = { name: 'Device Name', deviceName: 'device_name' };
      expect(getDisplayName(device)).toBe('Device Name');
    });

    it('returns deviceName when name is null', () => {
      const device = { name: null, deviceName: 'device_name' };
      expect(getDisplayName(device)).toBe('device_name');
    });

    it('returns deviceName when name is undefined', () => {
      const device = { deviceName: 'device_name' };
      expect(getDisplayName(device)).toBe('device_name');
    });

    it('returns undefined when device is null', () => {
      expect(getDisplayName(null)).toBeUndefined();
    });
  });

  describe('findSiteNameFromSiteId', () => {
    const devices = [
      { id: '1', name: 'Site 1' },
      { id: '2', deviceName: 'Site 2' },
    ];

    it('finds site name by id', () => {
      expect(findSiteNameFromSiteId('1', devices)).toBe('Site 1');
    });

    it('finds site deviceName when name is not available', () => {
      expect(findSiteNameFromSiteId('2', devices)).toBe('Site 2');
    });

    it('returns undefined for non-existent site', () => {
      expect(findSiteNameFromSiteId('999', devices)).toBeUndefined();
    });

    it('returns noSite constant when siteId is noSite', () => {
      const noSite = 'No Site';
      expect(findSiteNameFromSiteId(noSite, devices)).toBe(noSite);
    });
  });

  describe('getDeviceIdToNameMap', () => {
    it('creates correct id to name mapping', () => {
      const devices = [
        { id: '1', name: 'Device 1' },
        { id: '2', deviceName: 'Device 2' },
      ];

      const result = getDeviceIdToNameMap(devices);
      expect(result).toEqual({
        1: 'Device 1',
        2: 'Device 2',
      });
    });

    it('handles empty array', () => {
      expect(getDeviceIdToNameMap([])).toEqual({});
    });
  });

  describe('compare', () => {
    it('compares strings correctly', () => {
      expect(compare('a', 'b')).toBeLessThan(0);
      expect(compare('b', 'a')).toBeGreaterThan(0);
      expect(compare('a', 'a')).toBe(0);
    });

    it('handles undefined values', () => {
      expect(compare(undefined, 'a')).toBe(0);
      expect(compare('a', undefined)).toBe(0);
      expect(compare(undefined, undefined)).toBe(0);
    });

    it('is case insensitive with accent sensitivity', () => {
      expect(compare('A', 'a')).toBe(0);
      expect(compare('á', 'a')).not.toBe(0);
    });
  });

  describe('sortDevices', () => {
    it('sorts by site first, then by display name', () => {
      const devices = [
        { site: 'Site B', name: 'Device A' },
        { site: 'Site A', name: 'Device B' },
        { site: 'Site A', name: 'Device A' },
      ];

      const sorted = devices.sort(sortDevices);
      expect(sorted).toEqual([
        { site: 'Site A', name: 'Device A' },
        { site: 'Site A', name: 'Device B' },
        { site: 'Site B', name: 'Device A' },
      ]);
    });
  });

  describe('sortDevicesWithDisabled', () => {
    it('sorts disabled devices to the bottom', () => {
      const devices = [
        { site: 'Site A', name: 'Device B', disabled: true },
        { site: 'Site A', name: 'Device A', disabled: false },
        { site: 'Site A', name: 'Device C', disabled: true },
      ];

      const sorted = devices.sort(sortDevicesWithDisabled);
      expect(sorted).toEqual([
        { site: 'Site A', name: 'Device A', disabled: false },
        { site: 'Site A', name: 'Device B', disabled: true },
        { site: 'Site A', name: 'Device C', disabled: true },
      ]);
    });

    it('sorts by site first, then by disabled status, then by display name', () => {
      const devices = [
        { site: 'Site B', name: 'Device A', disabled: false },
        { site: 'Site A', name: 'Device C', disabled: true },
        { site: 'Site A', name: 'Device A', disabled: false },
        { site: 'Site A', name: 'Device B', disabled: false },
      ];

      const sorted = devices.sort(sortDevicesWithDisabled);
      expect(sorted).toEqual([
        { site: 'Site A', name: 'Device A', disabled: false },
        { site: 'Site A', name: 'Device B', disabled: false },
        { site: 'Site A', name: 'Device C', disabled: true },
        { site: 'Site B', name: 'Device A', disabled: false },
      ]);
    });

    it('handles devices without disabled property', () => {
      const devices = [
        { site: 'Site A', name: 'Device B', disabled: true },
        { site: 'Site A', name: 'Device A' },
      ];

      const sorted = devices.sort(sortDevicesWithDisabled);
      expect(sorted[0]).toEqual({ site: 'Site A', name: 'Device A' });
      expect(sorted[1]).toEqual({
        site: 'Site A',
        name: 'Device B',
        disabled: true,
      });
    });
  });

  describe('time functions', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2023-12-25T15:30:45'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    describe('getRoundedTimeFromOffset', () => {
      it('handles HOUR offset correctly', () => {
        const result = getRoundedTimeFromOffset(HOUR);
        const expected = new Date(new Date().getTime() - HOUR);
        expect(result.getTime()).toBe(expected.getTime());
      });

      it('handles DAY offset correctly', () => {
        const result = getRoundedTimeFromOffset(DAY);
        const expected = new Date('2023-12-25T00:00:00');
        expect(result.getTime()).toBe(expected.getTime());
      });
    });

    describe('getRoundedTime', () => {
      it('rounds down to start of day', () => {
        const result = getRoundedTime(false, 0);
        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
        expect(result.getMilliseconds()).toBe(0);
      });

      it('rounds up to end of day', () => {
        const result = getRoundedTime(true, 0);
        expect(result.getHours()).toBe(23);
        expect(result.getMinutes()).toBe(59);
        expect(result.getSeconds()).toBe(59);
        expect(result.getMilliseconds()).toBe(999);
      });
    });
  });

  describe('getFormattedDaysHoursMinutes', () => {
    it('formats time with days, hours, and minutes', () => {
      const time = (2 * 86400 + 3 * 3600 + 45 * 60) * 1000; // 2d 3h 45m in ms
      expect(getFormattedDaysHoursMinutes(time)).toBe('2d 3h 45m');
    });

    it('formats time with hours and minutes only', () => {
      const time = (3 * 3600 + 45 * 60) * 1000; // 3h 45m in ms
      expect(getFormattedDaysHoursMinutes(time)).toBe('3h 45m');
    });

    it('shows 1m for very small times', () => {
      const time = 30 * 1000; // 30 seconds
      expect(getFormattedDaysHoursMinutes(time)).toBe('1m');
    });

    it('returns empty string for undefined or 0', () => {
      expect(getFormattedDaysHoursMinutes(undefined)).toBe('');
      expect(getFormattedDaysHoursMinutes(0)).toBe('');
    });
  });

  describe('weather functions', () => {
    it('getWeatherIcon returns correct icons', () => {
      const testCases = [
        'cloudy',
        'partly-cloudy-day',
        'partly-cloudy-night',
        'fog',
        'clear-day',
        'clear-night',
        'snow',
        'wind',
        'rain',
        'sleet',
      ];

      testCases.forEach((weather) => {
        const icon = getWeatherIcon(weather);
        expect(React.isValidElement(icon)).toBe(true);
      });
    });

    it('getWeatherIcon returns input for unknown weather', () => {
      expect(getWeatherIcon('unknown')).toBe('unknown');
    });

    it('getWeatherIconWithTippy creates tippy wrapper', () => {
      const result = getWeatherIconWithTippy('Sunny', 'clear-day', 0.5);
      render(result);

      expect(screen.getByTestId('tippy')).toBeInTheDocument();
    });
  });

  describe('timeIncrementToText', () => {
    it('returns correct text for time increments', () => {
      expect(timeIncrementToText(HOUR, false)).toBe('Hour');
      expect(timeIncrementToText(DAY, false)).toBe('Day');
      expect(timeIncrementToText(WEEK, false)).toBe('Week');
      expect(timeIncrementToText(MONTH, false)).toBe('Month');
      expect(timeIncrementToText(YEAR, false)).toBe('Year');
    });

    it('returns correct short text for time increments', () => {
      expect(timeIncrementToText(HOUR, true)).toBe('H');
      expect(timeIncrementToText(DAY, true)).toBe('D');
      expect(timeIncrementToText(WEEK, true)).toBe('Wk');
      expect(timeIncrementToText(MONTH, true)).toBe('Mo');
      expect(timeIncrementToText(YEAR, true)).toBe('Yr');
    });

    it('returns default for unknown increment', () => {
      expect(timeIncrementToText(999, false)).toBe('Day');
      expect(timeIncrementToText(999, true)).toBe('D');
    });
  });

  describe('formatMessage', () => {
    it('replaces unix timestamps with formatted dates', () => {
      const unixTimestamp = '1703520645'; // Unix timestamp
      const message = `Error occurred at ${unixTimestamp}`;
      const result = formatMessage(message);

      expect(result).not.toContain(unixTimestamp);
      expect(result).toMatch(/Error occurred at \w+ \d+, \d+ \d+:\d+ [ap]m/i);
    });

    it('handles millisecond timestamps', () => {
      const unixTimestamp = '1703520645123'; // Unix timestamp in ms
      const message = `Error occurred at ${unixTimestamp}`;
      const result = formatMessage(message);

      expect(result).not.toContain(unixTimestamp);
      expect(result).toMatch(/Error occurred at \w+ \d+, \d+ \d+:\d+ [ap]m/i);
    });

    it('returns original message when no timestamp found', () => {
      const message = 'No timestamp here';
      expect(formatMessage(message)).toBe(message);
    });
  });

  describe('timeLabel', () => {
    it('creates correct time label', () => {
      const startDate = new Date('2023-12-25T00:00:00');
      const increment = DAY;
      const result = timeLabel(startDate, increment);

      expect(result).toBe('Dec 25, 23 - Dec 26, 23');
    });

    it('caps end date at current time', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2023-12-25T12:00:00'));

      const startDate = new Date('2023-12-24T00:00:00');
      const increment = DAY * 2; // Would go past current time
      const result = timeLabel(startDate, increment);

      expect(result).toBe('Dec 24, 23 - Dec 25, 23');

      jest.useRealTimers();
    });
  });

  describe('maybeSetTimeWindow', () => {
    let mockSetNextDisabled, mockSetStartDate;

    beforeEach(() => {
      mockSetStartDate = jest.fn();
      mockSetNextDisabled = jest.fn();
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2023-12-25T12:00:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('sets start date when within bounds', () => {
      const startDate = new Date('2023-12-24T00:00:00');
      maybeSetTimeWindow(startDate, DAY, mockSetStartDate, mockSetNextDisabled);

      expect(mockSetStartDate).toHaveBeenCalledWith(
        new Date('2023-12-25T00:00:00'),
      );
    });

    it('does not set start date when out of bounds', () => {
      const startDate = new Date('2023-12-25T00:00:00');
      maybeSetTimeWindow(startDate, DAY, mockSetStartDate, mockSetNextDisabled);

      expect(mockSetStartDate).not.toHaveBeenCalled();
    });

    it('sets next disabled correctly', () => {
      const startDate = new Date('2023-12-23T00:00:00');
      maybeSetTimeWindow(startDate, DAY, mockSetStartDate, mockSetNextDisabled);

      expect(mockSetNextDisabled).toHaveBeenCalled();
    });
  });

  describe('roundToDecimals', () => {
    it('rounds numbers correctly', () => {
      expect(roundToDecimals(1.234, 100)).toBe(1.23);
      expect(roundToDecimals(1.236, 100)).toBe(1.24);
    });

    it('handles NaN by parsing string', () => {
      expect(roundToDecimals('1.234', 100)).toBe(1.23);
    });

    it('returns string without decimal for NaN without decimal', () => {
      expect(roundToDecimals('test', 100)).toBe('test');
    });
  });

  describe('roundTwoDigit', () => {
    it('rounds to two decimal places', () => {
      expect(roundTwoDigit(1.234)).toBe(1.23);
      expect(roundTwoDigit(1.267)).toBe(1.27);
    });
  });

  describe('truncate', () => {
    it('truncates long strings', () => {
      expect(truncate('This is a very long string', 10)).toBe('This is a...');
    });

    it('returns original string if shorter than limit', () => {
      expect(truncate('Short', 10)).toBe('Short');
    });

    it('trims whitespace before adding ellipsis', () => {
      expect(truncate('This is   ', 8)).toBe('This is...');
    });
  });

  describe('getPowerScalingInformation', () => {
    it('scales to Gigawatts for large values', () => {
      const result = getPowerScalingInformation(1500000);
      expect(result).toEqual({
        unitPrefix: 'G',
        powerValue: 1.5,
        decimals: 10,
      });
    });

    it('scales to Megawatts for medium values', () => {
      const result = getPowerScalingInformation(1500);
      expect(result).toEqual({
        unitPrefix: 'M',
        powerValue: 1.5,
        decimals: 100,
      });
    });

    it('scales to kilowatts for small values', () => {
      const result = getPowerScalingInformation(500);
      expect(result).toEqual({
        unitPrefix: 'k',
        powerValue: 500,
        decimals: 10,
      });
    });
  });

  describe('isXS', () => {
    it('returns true for small window sizes', () => {
      const windowSize = { current: [400, 800] };
      expect(isXS(windowSize)).toBe(true);
    });

    it('returns false for large window sizes', () => {
      const windowSize = { current: [800, 600] };
      expect(isXS(windowSize)).toBe(false);
    });
  });

  describe('getDaysLeftInTrial', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2023-12-25T00:00:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('calculates days left correctly', () => {
      const startDate = new Date('2023-12-20T00:00:00').getTime();
      const result = getDaysLeftInTrial(startDate);
      expect(result).toBe('85 days left');
    });

    it('handles single day correctly', () => {
      const startDate = new Date('2023-09-27T00:00:00').getTime();
      const result = getDaysLeftInTrial(startDate);
      expect(result).toBe('1 day left');
    });
  });

  describe('transformMultiLineForHTMLDisplay', () => {
    it('transforms newlines to JSX with br tags', () => {
      const error = 'Line 1\nLine 2\rLine 3\r\nLine 4';
      const result = transformMultiLineForHTMLDisplay(error);

      render(result);

      expect(screen.getByText('Line 1')).toBeInTheDocument();
      expect(screen.getByText('Line 2')).toBeInTheDocument();
      expect(screen.getByText('Line 3')).toBeInTheDocument();
      expect(screen.getByText('Line 4')).toBeInTheDocument();
    });

    it('handles single line without newlines', () => {
      const error = 'Single line error';
      const result = transformMultiLineForHTMLDisplay(error);

      render(result);
      expect(screen.getByText('Single line error')).toBeInTheDocument();
    });
  });

  describe('TIPPY_DELAY constant', () => {
    it('has correct delay value', () => {
      expect(TIPPY_DELAY).toBe(500);
    });
  });
});
