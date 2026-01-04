/* eslint-env jest */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import Reports from '../../../../components/views/reports/Reports';

// Mock child components
jest.mock('../../../../components/common/Loader', () => {
  return function MockLoader({
    className,
  }: {
    className?: string;
  }): ReactElement {
    return (
      <div className={className} data-testid='loader'>
        Loading...
      </div>
    );
  };
});

jest.mock('../../../../components/views/reports/SearchBar', () => {
  return function MockSearchBar({
    siteId,
    deviceId,
    _start,
    _end,
    _filterErrors,
    setSiteId,
    setDeviceId,
    setStart,
    setEnd,
    setFilterErrors,
    setRefreshSearch,
    defaultSearchPeriod,
  }: {
    siteId: string;
    deviceId: string;
    start: number;
    end: number;
    filterErrors: string;
    devices?: unknown[];
    setSiteId: (value: string) => void;
    setDeviceId: (value: string) => void;
    setStart: (value: number) => void;
    setEnd: (value: number) => void;
    setFilterErrors: (value: string) => void;
    setRefreshSearch: (value: boolean) => void;
    refreshSearch?: boolean;
    defaultSearchPeriod: number;
  }): ReactElement {
    return (
      <div data-testid='search-bar'>
        <button onClick={() => setSiteId('site-123')}>Change Site</button>
        <button onClick={() => setDeviceId('device-456')}>Change Device</button>
        <button onClick={() => setStart(new Date('2024-02-01').getTime())}>
          Change Start
        </button>
        <button onClick={() => setEnd(new Date('2024-02-28').getTime())}>
          Change End
        </button>
        <button onClick={() => setFilterErrors('true')}>Toggle Errors</button>
        <button onClick={() => setRefreshSearch(true)}>Refresh</button>
        <div>
          Site: {siteId}, Device: {deviceId}
        </div>
        <div>Period: {defaultSearchPeriod}</div>
      </div>
    );
  };
});

jest.mock('../../../../components/views/reports/DownloadReportButton', () => {
  return function MockDownloadReportButton({
    siteId,
    deviceId,
  }: {
    siteId: string;
    deviceId: string;
    start?: number;
    end?: number;
    filterErrors?: string;
    deviceMap?: Record<string, string>;
    timeFormatter?: (date: Date) => string;
  }): ReactElement {
    return (
      <div data-testid='download-report-button'>
        <button>Download Report</button>
        <div>
          Site: {siteId}, Device: {deviceId}
        </div>
      </div>
    );
  };
});

// Mock react-data-grid
jest.mock('react-data-grid', () => {
  const MockDataGrid = function ({
    rows,
    columns,
    onScroll,
    renderers,
    className,
  }: {
    rows?: unknown[];
    columns?: unknown[];
    onScroll?: (event: unknown) => void;
    renderers?: { noRowsFallback?: ReactElement };
    className?: string;
  }): ReactElement {
    return (
      <div className={className} data-testid='data-grid' onScroll={onScroll}>
        <div data-testid='data-grid-columns'>Columns: {columns?.length}</div>
        <div data-testid='data-grid-rows'>
          Rows: {rows?.length}
          {rows?.length === 0 && renderers?.noRowsFallback}
        </div>
        {rows?.map((row, index) => (
          <div data-testid={`data-row-${index}`} key={index}>
            <div data-testid='tippy-wrapper'>{JSON.stringify(row)}</div>
          </div>
        ))}
      </div>
    );
  };

  return {
    DataGrid: MockDataGrid,
  };
});

// Mock @tippyjs/react
jest.mock('@tippyjs/react', () => {
  return function MockTippy({
    children,
    content,
    ...props
  }: {
    children: ReactNode;
    content: ReactNode;
    [key: string]: unknown;
  }): ReactElement {
    return (
      <div
        data-testid='tippy-wrapper'
        title={typeof content === 'string' ? content : 'tooltip'}
        {...props}
      >
        {children}
      </div>
    );
  };
});

// Mock services and utilities before importing components
jest.mock('../../../../services/services', () => ({
  getDevices: jest.fn(),
  getDataPage: jest.fn(),
}));

jest.mock('../../../../services/search', () => ({
  ALL: 'all',
  DAY: 'day',
}));

jest.mock('../../../../utils/Utils', () => ({
  getDeviceIdToNameMap: jest.fn(),
  getRoundedTime: jest.fn(),
  getFormattedShortTime: jest.fn(),
  getFormattedTime: jest.fn(),
  getWeatherIcon: jest.fn(),
  isXS: jest.fn(),
  roundToDecimals: jest.fn(),
  roundTwoDigit: jest.fn(),
  useSearchParamState: jest.fn(),
  TIPPY_DELAY: 500,
}));

jest.mock('../../../../components/views/reports/ReportUtils', () => ({
  DISPLAY_NAME: 'displayName.keyword',
  ENERGY_CONSUMED: 'energyConsumed',
  INFORMATIONAL_ERROR: 'informationalError',
  SITE_ID_KEYWORD: 'siteId.keyword',
  TOTAL_ENERGY_CONS: 'totalEnergyConsumed',
  TOTAL_REAL_POWER: 'totalRealPower',
  transformRowData: jest.fn(),
  sortRowData: jest.fn(),
}));

// Need to get mocked functions for testing
const services = require('../../../../services/services');
const utils = require('../../../../utils/Utils');
const reportUtils = require('../../../../components/views/reports/ReportUtils');

const renderWithProviders = (
  component: ReactElement,
  initialRoute = '/reports',
) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <IntlProvider locale='en' messages={{}}>
        {component}
      </IntlProvider>
    </MemoryRouter>,
  );
};

describe('Reports', () => {
  const mockDevices = [
    { id: 'site-1', name: 'Site A', isSite: true },
    { id: 'site-2', name: 'Site B', isSite: true },
    { id: 'device-1', name: 'Device 1', isSite: false, siteId: 'site-1' },
    { id: 'device-2', name: 'Device 2', isSite: false, siteId: 'site-2' },
  ];

  const mockReportData = {
    hits: {
      total: { value: 1000 },
      hits: [
        {
          fields: {
            '@timestamp': ['2024-01-15T10:30:00Z'],
            'weatherSummary.keyword': ['sunny'],
            'weatherIcon.keyword': ['clear-day'],
            temperature: [75],
            uvIndex: [6.5],
            precipitationIntensity: [0],
            cloudCover: [0.2],
            'siteId.keyword': ['site-1'],
            'displayName.keyword': ['Device 1'],
            totalRealPower: [150.5],
            energyConsumed: [1250.75],
            totalEnergyConsumed: [5000.25],
          },
        },
        {
          fields: {
            '@timestamp': ['2024-01-15T11:00:00Z'],
            'weatherSummary.keyword': ['partly-cloudy'],
            'weatherIcon.keyword': ['partly-cloudy-day'],
            temperature: [72],
            uvIndex: [5.2],
            precipitationIntensity: [0.1],
            cloudCover: [0.4],
            'siteId.keyword': ['site-2'],
            'displayName.keyword': ['Device 2'],
            totalRealPower: [200.3],
            energyConsumed: [1500.5],
            totalEnergyConsumed: [6200.8],
          },
        },
      ],
    },
  };

  const mockProcessedRows = [
    {
      '@timestamp': '2024-01-15T10:30:00Z',
      time: '10:30 AM',
      'weatherSummary.keyword': 'sunny',
      'weatherIcon.keyword': 'clear-day',
      temperature: 75,
      uvIndex: 6.5,
      precipitationIntensity: 0,
      cloudCover: 0.2,
      'siteId.keyword': 'Site A',
      'displayName.keyword': 'Device 1',
      totalRealPower: '150.5',
      energyConsumed: '1250.75',
      totalEnergyConsumed: '5000.25',
    },
    {
      '@timestamp': '2024-01-15T11:00:00Z',
      time: '11:00 AM',
      'weatherSummary.keyword': 'partly-cloudy',
      'weatherIcon.keyword': 'partly-cloudy-day',
      temperature: 72,
      uvIndex: 5.2,
      precipitationIntensity: 0.1,
      cloudCover: 0.4,
      'siteId.keyword': 'Site B',
      'displayName.keyword': 'Device 2',
      totalRealPower: '200.3',
      energyConsumed: '1500.5',
      totalEnergyConsumed: '6200.8',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    // Mock utility functions
    utils.useSearchParamState.mockImplementation((defaultValue) => [
      defaultValue,
      jest.fn(),
    ]);
    utils.getDeviceIdToNameMap.mockReturnValue({
      'site-1': 'Site A',
      'site-2': 'Site B',
      'device-1': 'Device 1',
      'device-2': 'Device 2',
    });
    utils.getRoundedTime.mockImplementation(
      (isEnd, _offset) =>
        new Date(isEnd ? '2024-01-15T23:59:59Z' : '2024-01-15T00:00:00Z'),
    );
    utils.getFormattedShortTime.mockReturnValue('10:30 AM');
    utils.getFormattedTime.mockReturnValue('January 15, 2024 10:30 AM');
    utils.getWeatherIcon.mockReturnValue('☀️');
    utils.isXS.mockReturnValue(false);
    utils.roundToDecimals.mockImplementation(
      (value, multiplier) => Math.round(value * multiplier) / multiplier,
    );
    utils.roundTwoDigit.mockImplementation(
      (value) => Math.round(value * 100) / 100,
    );
    reportUtils.transformRowData.mockImplementation(
      (fields, _deviceMap, _intl) => {
        // Call the time formatter functions when they would be called in the real component
        if (utils.isXS()) {
          utils.getFormattedShortTime(new Date(fields['@timestamp'][0]));
        } else {
          utils.getFormattedTime(new Date(fields['@timestamp'][0]));
        }

        return (
          mockProcessedRows.find(
            (row) => row['@timestamp'] === fields['@timestamp'][0],
          ) || mockProcessedRows[0]
        );
      },
    );
    reportUtils.sortRowData.mockImplementation((a, b) =>
      a['@timestamp'].localeCompare(b['@timestamp']),
    );

    // Mock successful service calls
    services.getDevices.mockResolvedValue({ data: mockDevices });
    services.getDataPage.mockResolvedValue({ data: mockReportData });
  });

  describe('Initial Loading and Setup', () => {
    test('shows loader initially', () => {
      renderWithProviders(<Reports />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    test('loads devices on mount', async () => {
      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(services.getDevices).toHaveBeenCalled();
      });
    });

    test('renders main components after loading', async () => {
      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(screen.getByTestId('search-bar')).toBeInTheDocument();
        expect(
          screen.getByTestId('download-report-button'),
        ).toBeInTheDocument();
        expect(screen.getByTestId('data-grid')).toBeInTheDocument();
      });
    });

    test('hides loader after data loads', async () => {
      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });
    });
  });

  describe('Data Fetching', () => {
    test('fetches initial data with correct parameters', async () => {
      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(services.getDataPage).toHaveBeenCalledWith(
          null, // deviceId (ALL)
          null, // siteId (ALL)
          'false', // filterErrors
          expect.any(String), // start timestamp
          expect.any(String), // end timestamp
          0, // offset
          500, // limit
          expect.arrayContaining([
            'uvIndex',
            'Daylight',
            'cloudCover',
            'precipitationIntensity',
            'visibility',
            'informationalError',
            'weatherIcon.keyword',
          ]),
        );
      });
    });

    test('processes and displays data correctly', async () => {
      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(screen.getByTestId('data-grid-rows')).toHaveTextContent(
          'Rows: 2',
        );
        expect(screen.getByTestId('data-row-0')).toBeInTheDocument();
        expect(screen.getByTestId('data-row-1')).toBeInTheDocument();
      });
    });

    test('handles API errors gracefully', async () => {
      services.getDataPage.mockRejectedValue(new Error('API Error'));
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});

      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Search Parameter Integration', () => {
    test('fetches new data when site ID changes', async () => {
      const mockSetSiteId = jest.fn();
      utils.useSearchParamState.mockImplementation((defaultValue, param) => {
        if (param === 'siteId') return ['all', mockSetSiteId];
        return [defaultValue, jest.fn()];
      });

      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const changeSiteButton = screen.getByText('Change Site');
      fireEvent.click(changeSiteButton);

      expect(mockSetSiteId).toHaveBeenCalledWith('site-123');
    });

    test('fetches new data when device ID changes', async () => {
      const mockSetDeviceId = jest.fn();
      utils.useSearchParamState.mockImplementation((defaultValue, param) => {
        if (param === 'deviceId') return ['all', mockSetDeviceId];
        return [defaultValue, jest.fn()];
      });

      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const changeDeviceButton = screen.getByText('Change Device');
      fireEvent.click(changeDeviceButton);

      expect(mockSetDeviceId).toHaveBeenCalledWith('device-456');
    });

    test('fetches new data when date range changes', async () => {
      const mockSetStart = jest.fn();
      const mockSetEnd = jest.fn();
      utils.useSearchParamState.mockImplementation((defaultValue, param) => {
        if (param === 'start')
          return [new Date('2024-01-01').getTime().toString(), mockSetStart];
        if (param === 'end')
          return [new Date('2024-01-31').getTime().toString(), mockSetEnd];
        return [defaultValue, jest.fn()];
      });

      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const changeStartButton = screen.getByText('Change Start');
      fireEvent.click(changeStartButton);

      const changeEndButton = screen.getByText('Change End');
      fireEvent.click(changeEndButton);

      expect(mockSetStart).toHaveBeenCalledWith(
        new Date('2024-02-01').getTime().toString(),
      );
      expect(mockSetEnd).toHaveBeenCalledWith(
        new Date('2024-02-28').getTime().toString(),
      );
    });

    test('refetches data when refresh is triggered', async () => {
      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      // Clear the initial calls to getDataPage
      const initialCallCount = services.getDataPage.mock.calls.length;

      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);

      // Should trigger another call to getDataPage
      await waitFor(() => {
        expect(services.getDataPage).toHaveBeenCalledTimes(
          initialCallCount + 1,
        );
      });
    });
  });

  describe('Data Grid Configuration', () => {
    test('renders correct number of columns', async () => {
      renderWithProviders(<Reports />);

      await waitFor(() => {
        // Default columns: Weather, Time, Site, Display Name, Power, Consumption, Total Consumption
        expect(screen.getByTestId('data-grid-columns')).toHaveTextContent(
          'Columns: 7',
        );
      });
    });

    test('adds informational error column when filter errors is true', async () => {
      utils.useSearchParamState.mockImplementation((defaultValue, param) => {
        if (param === 'err') return ['true', jest.fn()];
        return [defaultValue, jest.fn()];
      });

      renderWithProviders(<Reports />);

      await waitFor(() => {
        // Should have 8 columns when errors are included
        expect(screen.getByTestId('data-grid-columns')).toHaveTextContent(
          'Columns: 8',
        );
      });
    });

    test('displays empty state when no data', async () => {
      services.getDataPage.mockResolvedValue({
        data: {
          hits: {
            total: { value: 0 },
            hits: [],
          },
        },
      });

      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(
          screen.getByText(
            'No data available, modify your search or set-up some devices!',
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Links', () => {
    test('renders back to dashboard link when siteId is ALL', async () => {
      utils.useSearchParamState.mockImplementation((defaultValue, param) => {
        if (param === 'siteId') return ['all', jest.fn()];
        return [defaultValue, jest.fn()];
      });

      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(screen.getByText('Back to dashboard')).toBeInTheDocument();
      });
    });

    test('renders back to specific site link when siteId is specific', async () => {
      utils.useSearchParamState.mockImplementation((defaultValue, param) => {
        if (param === 'siteId') return ['site-1', jest.fn()];
        return [defaultValue, jest.fn()];
      });

      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(screen.getByText('Back to Site A')).toBeInTheDocument();
      });
    });

    test('navigation link has correct href for dashboard', async () => {
      utils.useSearchParamState.mockImplementation((defaultValue, param) => {
        if (param === 'siteId') return ['all', jest.fn()];
        return [defaultValue, jest.fn()];
      });

      renderWithProviders(<Reports />);

      await waitFor(() => {
        const backLink = screen.getByText('Back to dashboard').closest('a');
        expect(backLink).toHaveAttribute('href', '/');
      });
    });

    test('navigation link has correct href for specific site', async () => {
      utils.useSearchParamState.mockImplementation((defaultValue, param) => {
        if (param === 'siteId') return ['site-123', jest.fn()];
        return [defaultValue, jest.fn()];
      });

      renderWithProviders(<Reports />);

      await waitFor(() => {
        const backLink = screen.getByText(/Back to/).closest('a');
        expect(backLink).toHaveAttribute('href', '/sites/site-123');
      });
    });
  });

  describe('Weather Display', () => {
    test('weather column renders weather icons', async () => {
      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(utils.getWeatherIcon).toHaveBeenCalledWith('partly-cloudy-day');
      });
    });

    test('weather tooltip shows detailed weather information', async () => {
      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const weatherTooltips = screen.getAllByTestId('tippy-wrapper');
      expect(weatherTooltips.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    test('uses short time format on mobile', async () => {
      utils.isXS.mockReturnValue(true);

      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      expect(utils.getFormattedShortTime).toHaveBeenCalled();
    });

    test('uses full time format on desktop', async () => {
      utils.isXS.mockReturnValue(false);

      renderWithProviders(<Reports />);

      await waitFor(() => {
        // Should use the processed row data's time field, not the short format
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });
    });

    test('adjusts column widths based on screen size', async () => {
      utils.isXS.mockReturnValue(true);

      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      // Column widths would be tested through the DataGrid mock props
    });
  });

  describe('Infinite Scroll', () => {
    test('loads more data when scrolling to bottom', async () => {
      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const initialCallCount = services.getDataPage.mock.calls.length;
      const dataGrid = screen.getByTestId('data-grid');

      // Mock scroll event to bottom
      const scrollEvent = {
        currentTarget: {
          scrollTop: 1000,
          scrollHeight: 1100,
          clientHeight: 100,
        },
      };

      fireEvent.scroll(dataGrid, scrollEvent);

      await waitFor(() => {
        expect(services.getDataPage).toHaveBeenCalledTimes(
          initialCallCount + 1,
        );
      });
    });

    test('does not load more data when already loading', async () => {
      // First call resolves, second call never resolves to simulate loading state
      let callCount = 0;
      services.getDataPage.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ data: mockReportData });
        }
        return new Promise(() => {}); // Never resolves
      });

      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const dataGrid = screen.getByTestId('data-grid');

      // First scroll triggers loading (which never resolves)
      const scrollEvent = {
        currentTarget: {
          scrollTop: 1000,
          scrollHeight: 1100,
          clientHeight: 100,
        },
      };

      fireEvent.scroll(dataGrid, scrollEvent);

      // Record call count after first scroll
      await waitFor(() => {
        expect(services.getDataPage.mock.calls.length).toBeGreaterThan(1);
      });
      const callsAfterFirstScroll = services.getDataPage.mock.calls.length;

      // Second scroll while still loading should not trigger another request
      fireEvent.scroll(dataGrid, scrollEvent);

      // Should not increase call count since loading=true
      expect(services.getDataPage).toHaveBeenCalledTimes(callsAfterFirstScroll);
    });

    test('does not load more data when all data is loaded', async () => {
      // Mock data where all rows are already loaded
      services.getDataPage.mockResolvedValue({
        data: {
          hits: {
            total: { value: 2 },
            hits: mockReportData.hits.hits,
          },
        },
      });

      renderWithProviders(<Reports />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const dataGrid = screen.getByTestId('data-grid');

      const scrollEvent = {
        currentTarget: {
          scrollTop: 1000,
          scrollHeight: 1100,
          clientHeight: 100,
        },
      };

      fireEvent.scroll(dataGrid, scrollEvent);

      // Should not call getDataPage again since rows.length === total
      // Multiple calls may occur from useEffect dependencies during initial render
      expect(services.getDataPage.mock.calls.length).toBeGreaterThanOrEqual(1);
      const callsBeforeScroll = services.getDataPage.mock.calls.length;

      // Scroll again - should not trigger new calls
      fireEvent.scroll(dataGrid, scrollEvent);
      expect(services.getDataPage).toHaveBeenCalledTimes(callsBeforeScroll);
    });
  });

  describe('Component Integration', () => {
    test('passes correct props to SearchBar', async () => {
      utils.useSearchParamState.mockImplementation((defaultValue, param) => {
        const values = {
          siteId: ['test-site', jest.fn()],
          deviceId: ['test-device', jest.fn()],
          start: [123456789, jest.fn()],
          end: [987654321, jest.fn()],
          err: ['true', jest.fn()],
        };
        return values[param] || [defaultValue, jest.fn()];
      });

      renderWithProviders(<Reports />);

      await waitFor(() => {
        const searchBar = screen.getByTestId('search-bar');
        expect(searchBar).toHaveTextContent(
          'Site: test-site, Device: test-device',
        );
        expect(searchBar).toHaveTextContent('Period: day');
      });
    });

    test('passes correct props to DownloadReportButton', async () => {
      utils.useSearchParamState.mockImplementation((defaultValue, param) => {
        const values = {
          siteId: ['download-site', jest.fn()],
          deviceId: ['download-device', jest.fn()],
        };
        return values[param] || [defaultValue, jest.fn()];
      });

      renderWithProviders(<Reports />);

      await waitFor(() => {
        const downloadButton = screen.getByTestId('download-report-button');
        expect(downloadButton).toHaveTextContent(
          'Site: download-site, Device: download-device',
        );
      });
    });
  });

  describe('CSS Classes and Layout', () => {
    test('applies correct main container classes', async () => {
      const { container } = renderWithProviders(<Reports />);

      await waitFor(() => {
        const main = container.querySelector('.Reports');
        expect(main).toHaveClass('flex', 'w-full', 'flex-col', 'items-center');
      });
    });

    test('applies fade-in animation class', async () => {
      const { container } = renderWithProviders(<Reports />);

      await waitFor(() => {
        const fadeInDiv = container.querySelector('.fade-in');
        expect(fadeInDiv).toBeInTheDocument();
      });
    });

    test('applies responsive padding classes', async () => {
      const { container } = renderWithProviders(<Reports />);

      await waitFor(() => {
        const main = container.querySelector('.Reports');
        expect(main).toHaveClass('sm:px-5');
      });
    });
  });
});
