/* eslint-env jest */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

// Import after all mocks are set up
import SearchBar from '../../../../components/views/reports/SearchBar';

// Mock services first to avoid ES module issues
jest.mock('../../../../services/search', () => ({
  ALL: 'ALL',
}));

jest.mock('../../../../utils/Utils', () => ({
  getDisplayName: jest.fn(),
  getRoundedTime: jest.fn(),
  sortDevices: jest.fn(),
}));

jest.mock('@wojtekmaj/react-daterange-picker', () => {
  return function MockDateRangePicker({
    onChange,
    value,
    calendarIcon,
    clearIcon,
    className,
  }) {
    return (
      <div className={className} data-testid='date-range-picker'>
        <div data-testid='picker-value'>
          {value?.[0]?.toISOString()} - {value?.[1]?.toISOString()}
        </div>
        <button
          data-testid='change-date'
          onClick={() =>
            onChange([new Date('2024-02-01'), new Date('2024-02-15')])
          }
        >
          Change Date
        </button>
        <button data-testid='clear-date' onClick={() => onChange(null)}>
          {clearIcon}
        </button>
      </div>
    );
  };
});

jest.mock('../../../../components/common/Dropdown', () => {
  return function MockDropdown({ onChange, options, value, prefixLabel }) {
    return (
      <div data-testid={`dropdown-${prefixLabel?.toLowerCase()}`}>
        <select
          data-testid={`select-${prefixLabel?.toLowerCase()}`}
          onChange={(e) => {
            const selectedOption = options?.find?.(
              (opt) => opt?.value === e.target.value,
            ) || { value: e.target.value, label: e.target.value };
            onChange(selectedOption);
          }}
          value={value?.value || ''}
        >
          {(options || []).map((option) => (
            <option key={option?.value || ''} value={option?.value || ''}>
              {option?.label || ''}
            </option>
          ))}
        </select>
      </div>
    );
  };
});

jest.mock('../../../../components/common/Check', () => ({
  Check: function MockCheck({ onClick, inputProps, label, name }) {
    return (
      <div data-testid={`check-${name}`}>
        <input
          checked={inputProps?.value || false}
          data-testid='checkbox'
          onClick={onClick}
          type='checkbox'
        />
        <label>{label}</label>
      </div>
    );
  },
}));

jest.mock('../../../../components/common/Button', () => {
  return function MockButton({ children, onClick, disabled, variant, type }) {
    return (
      <button
        data-testid={`button-${variant || 'default'}`}
        disabled={disabled}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    );
  };
});

jest.mock('../../../../components/common/Spinner', () => {
  return function MockSpinner() {
    return <div data-testid='spinner'>Loading...</div>;
  };
});

const utils = require('../../../../utils/Utils');
const { ALL } = require('../../../../services/search');

describe('SearchBar', () => {
  const defaultProps = {
    devices: [
      {
        deviceId: 'device1',
        name: 'Device 1',
        enabled: true,
        siteId: 'site1',
      },
      {
        deviceId: 'device2',
        name: 'Device 2',
        enabled: false,
        siteId: 'site2',
      },
    ],
    sites: [
      { siteId: 'site1', name: 'Site 1' },
      { siteId: 'site2', name: 'Site 2' },
    ],
    deviceId: ALL,
    setDeviceId: jest.fn(),
    siteId: ALL,
    setSiteId: jest.fn(),
    start: new Date('2024-01-01').getTime(),
    setStart: jest.fn(),
    end: new Date('2024-01-31').getTime(),
    setEnd: jest.fn(),
    filterErrors: 'false',
    setFilterErrors: jest.fn(),
    refreshing: false,
    setRefreshSearch: jest.fn(),
    resetSearch: jest.fn(),
    searchActive: false,
    setSearchActive: jest.fn(),
    defaultPeriod: [new Date('2024-01-01'), new Date('2024-01-31')],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    utils.getDisplayName.mockImplementation(
      (device) => device?.name || device?.deviceName || 'Unknown',
    );
    utils.getRoundedTime.mockImplementation((date) => date);
    utils.sortDevices.mockImplementation((devices) => {
      if (!Array.isArray(devices)) return [];
      return [...devices].sort((a, b) =>
        (a.name || '').localeCompare(b.name || ''),
      );
    });
  });

  test('renders search button when search is not active', () => {
    render(<SearchBar {...defaultProps} />);

    expect(screen.getByTestId('button-primary')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  test('renders search form when search is active', () => {
    render(<SearchBar {...defaultProps} searchActive={true} />);

    expect(screen.getByTestId('date-range-picker')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-site')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-device')).toBeInTheDocument();
  });

  test('calls setStart and setEnd when date changes', () => {
    render(<SearchBar {...defaultProps} searchActive={true} />);

    fireEvent.click(screen.getByTestId('change-date'));

    expect(defaultProps.setStart).toHaveBeenCalled();
    expect(defaultProps.setEnd).toHaveBeenCalled();
  });

  test('calls setSiteId when site changes', () => {
    render(<SearchBar {...defaultProps} searchActive={true} />);

    const siteSelect = screen.getByTestId('select-site');
    fireEvent.change(siteSelect, { target: { value: 'site1' } });

    expect(defaultProps.setSiteId).toHaveBeenCalled();
  });

  test('renders error filter checkbox', () => {
    render(<SearchBar {...defaultProps} searchActive={true} />);

    expect(screen.getByTestId('checkbox')).toBeInTheDocument();
  });

  test('toggles filterErrors when checkbox is clicked', () => {
    render(<SearchBar {...defaultProps} searchActive={true} />);

    const checkbox = screen.getByTestId('checkbox');
    fireEvent.click(checkbox);

    expect(defaultProps.setFilterErrors).toHaveBeenCalledWith('true');
  });
});
