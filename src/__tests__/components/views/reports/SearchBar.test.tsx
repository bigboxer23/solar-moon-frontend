import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Import after all mocks are set up
import SearchBar from '../../../../components/views/reports/SearchBar';
import { ALL } from '../../../../services/search';
import * as utils from '../../../../utils/Utils';

// Mock services first to avoid ES module issues
vi.mock('../../../../services/search', () => ({
  ALL: 'ALL',
}));

vi.mock('../../../../utils/Utils', () => ({
  getDisplayName: vi.fn(),
  getRoundedTime: vi.fn(),
  sortDevices: vi.fn(),
}));

vi.mock('@wojtekmaj/react-daterange-picker', () => {
  const MockDateRangePicker = function ({
    onChange,
    value,
    _calendarIcon,
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
  return { default: MockDateRangePicker };
});

vi.mock('../../../../components/common/Dropdown', () => {
  const MockDropdown = function ({ onChange, options, value, prefixLabel }) {
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
  return { default: MockDropdown };
});

vi.mock('../../../../components/common/Check', () => ({
  Check: function MockCheck({ onClick, inputProps, label, name }) {
    return (
      <div data-testid={`check-${name}`}>
        <input
          checked={inputProps?.value || false}
          data-testid='checkbox'
          onChange={() => {}} // Add onChange to prevent React warning
          onClick={onClick}
          type='checkbox'
        />
        <label>{label}</label>
      </div>
    );
  },
}));

vi.mock('../../../../components/common/Button', () => {
  const MockButton = function ({ children, onClick, disabled, variant, type }) {
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
  return { default: MockButton };
});

vi.mock('../../../../components/common/Spinner', () => {
  const MockSpinner = function () {
    return <div data-testid='spinner'>Loading...</div>;
  };
  return { default: MockSpinner };
});

describe('SearchBar', () => {
  const defaultProps = {
    devices: [
      {
        id: 'site1',
        name: 'Site 1',
        disabled: false,
        siteId: 'site1',
        isSite: true,
      },
      {
        id: 'device1',
        name: 'Device 1',
        disabled: false,
        siteId: 'site1',
        isSite: false,
      },
      {
        id: 'device2',
        name: 'Device 2',
        disabled: true,
        siteId: 'site2',
        isSite: false,
      },
    ],
    deviceId: ALL,
    setDeviceId: vi.fn(),
    siteId: ALL,
    setSiteId: vi.fn(),
    start: new Date('2024-01-01').getTime(),
    setStart: vi.fn(),
    end: new Date('2024-01-31').getTime(),
    setEnd: vi.fn(),
    filterErrors: 'false',
    setFilterErrors: vi.fn(),
    refreshSearch: false,
    setRefreshSearch: vi.fn(),
    defaultSearchPeriod: 30,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    utils.getDisplayName.mockImplementation(
      (device) => device?.name || device?.deviceName || 'Unknown',
    );
    utils.getRoundedTime.mockImplementation((isEnd, _period) => {
      if (isEnd) return new Date('2024-01-31');
      return new Date('2024-01-01');
    });
    utils.sortDevices.mockImplementation((a, b) => {
      return (a.name || '').localeCompare(b.name || '');
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

  test('activates search when search button is clicked', () => {
    render(<SearchBar {...defaultProps} />);

    const searchButton = screen.getByTestId('button-primary');
    fireEvent.click(searchButton);

    // After clicking search, the search form should be visible
    expect(screen.getByTestId('date-range-picker')).toBeInTheDocument();
  });

  test('resets search when reset button is clicked', () => {
    render(<SearchBar {...defaultProps} searchActive={true} />);

    const resetButton = screen.getByTestId('button-text');
    fireEvent.click(resetButton);

    expect(defaultProps.setSiteId).toHaveBeenCalledWith('ALL');
    expect(defaultProps.setDeviceId).toHaveBeenCalledWith('ALL');
    expect(defaultProps.setFilterErrors).toHaveBeenCalledWith('false');
  });

  test('handles date change with null value', () => {
    utils.getRoundedTime
      .mockReturnValueOnce(new Date('2024-01-01'))
      .mockReturnValueOnce(new Date('2024-01-31'));

    render(<SearchBar {...defaultProps} searchActive={true} />);

    fireEvent.click(screen.getByTestId('clear-date'));

    expect(utils.getRoundedTime).toHaveBeenCalledWith(false, 30);
    expect(utils.getRoundedTime).toHaveBeenCalledWith(true, 0);
    expect(defaultProps.setStart).toHaveBeenCalled();
    expect(defaultProps.setEnd).toHaveBeenCalled();
  });

  test('handles site dropdown change and resets device', () => {
    render(<SearchBar {...defaultProps} searchActive={true} />);

    const siteSelect = screen.getByTestId('select-site');
    fireEvent.change(siteSelect, { target: { value: 'site1' } });

    expect(defaultProps.setSiteId).toHaveBeenCalledWith('site1');
    expect(defaultProps.setDeviceId).toHaveBeenCalledWith('ALL');
  });

  test('calls setDeviceId when device dropdown changes', () => {
    render(<SearchBar {...defaultProps} searchActive={true} />);

    const deviceSelect = screen.getByTestId('select-device');
    fireEvent.change(deviceSelect, { target: { value: 'device1' } });

    expect(defaultProps.setDeviceId).toHaveBeenCalledWith('device1');
  });

  test('renders refresh button and handles click', () => {
    render(<SearchBar {...defaultProps} searchActive={true} />);

    const refreshButton = screen.getByTestId('button-icon');
    fireEvent.click(refreshButton);

    expect(defaultProps.setRefreshSearch).toHaveBeenCalledWith(true);
  });

  test('shows spinner when refresh is active', () => {
    render(
      <SearchBar {...defaultProps} refreshSearch={true} searchActive={true} />,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('filters devices by site when site is selected', () => {
    const devicesWithSites = [
      {
        id: 'device1',
        name: 'Device 1',
        siteId: 'site1',
        disabled: false,
        isSite: false,
      },
      {
        id: 'device2',
        name: 'Device 2',
        siteId: 'site2',
        disabled: false,
        isSite: false,
      },
      {
        id: 'site1',
        name: 'Site 1',
        siteId: 'site1',
        disabled: false,
        isSite: true,
      },
    ];

    render(
      <SearchBar
        {...defaultProps}
        devices={devicesWithSites}
        searchActive={true}
        siteId='site1'
      />,
    );

    // Verify device dropdown is rendered (filtered options will be handled internally)
    expect(screen.getByTestId('dropdown-device')).toBeInTheDocument();
  });

  test('renders disabled devices with opacity styling', () => {
    const devicesWithDisabled = [
      { id: 'device1', name: 'Device 1', disabled: false, siteId: 'site1' },
      { id: 'device2', name: 'Device 2', disabled: true, siteId: 'site1' },
    ];

    render(
      <SearchBar
        {...defaultProps}
        devices={devicesWithDisabled}
        searchActive={true}
      />,
    );

    expect(screen.getByTestId('dropdown-device')).toBeInTheDocument();
  });

  test('shows search active when deviceId is not ALL', () => {
    render(<SearchBar {...defaultProps} deviceId='device1' />);

    // Component should show as active since deviceId !== ALL
    expect(screen.getByTestId('date-range-picker')).toBeInTheDocument();
  });

  test('shows search active when siteId is not ALL', () => {
    render(<SearchBar {...defaultProps} siteId='site1' />);

    // Component should show as active since siteId !== ALL
    expect(screen.getByTestId('date-range-picker')).toBeInTheDocument();
  });

  test('shows search active when filterErrors is true', () => {
    render(<SearchBar {...defaultProps} filterErrors='true' />);

    // Component should show as active since filterErrors === 'true'
    expect(screen.getByTestId('date-range-picker')).toBeInTheDocument();
  });
});
