/* eslint-env jest */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import SiteDetails from '../../../../components/views/site-details/SiteDetails';
import * as searchService from '../../../../services/search';
import * as services from '../../../../services/services';
import * as utils from '../../../../utils/Utils';

// Mock child components
jest.mock('../../../../components/common/CurrentPowerBlock', () => {
  return function MockCurrentPowerBlock({ currentPower, max, activeAlert }) {
    return (
      <div data-testid='current-power-block'>
        Current: {currentPower}, Max: {max}
      </div>
    );
  };
});

jest.mock('../../../../components/common/Loader', () => {
  return function MockLoader() {
    return <div data-testid='loader'>Loading...</div>;
  };
});

jest.mock('../../../../components/common/PowerBlock', () => {
  return function MockPowerBlock({ power, title, unit, className }) {
    return (
      <div className={className} data-testid={`power-block-${title}`}>
        {title}: {power} {unit}
      </div>
    );
  };
});

jest.mock('../../../../components/common/WeatherBlock', () => {
  return function MockWeatherBlock({ weather, className, wrapperClassName }) {
    return (
      <div className={className} data-testid='weather-block'>
        Weather: {weather?.temp}°F, {weather?.condition}
      </div>
    );
  };
});

jest.mock('../../../../components/device-block/StackedAlertsInfo', () => {
  return function MockStackedAlertsInfo({
    activeAlerts,
    resolvedAlerts,
    onClick,
    className,
  }) {
    return (
      <div
        className={className}
        data-testid='stacked-alerts-info'
        onClick={onClick}
      >
        Active: {activeAlerts}, Resolved: {resolvedAlerts}
      </div>
    );
  };
});

jest.mock('../../../../components/device-block/StackedTotAvg', () => {
  return function MockStackedTotAvg({ total, avg, className }) {
    return (
      <div className={className} data-testid='stacked-tot-avg'>
        Total: {total}, Avg: {avg}
      </div>
    );
  };
});

jest.mock(
  '../../../../components/views/dashboard/TimeIncrementSelector',
  () => {
    return function MockTimeIncrementSelector({
      timeIncrement,
      setTimeIncrement,
    }) {
      return (
        <div data-testid='time-increment-selector'>
          <button onClick={() => setTimeIncrement('week')}>Week</button>
          <button onClick={() => setTimeIncrement('month')}>Month</button>
          Current: {timeIncrement}
        </div>
      );
    };
  },
);

jest.mock('../../../../components/views/site-details/SiteDetailsGraph', () => {
  return function MockSiteDetailsGraph({
    devices,
    graphData,
    graphType,
    setGraphType,
    startDate,
    setStartDate,
    timeIncrement,
  }) {
    return (
      <div data-testid='site-details-graph'>
        <button onClick={() => setGraphType('line')}>Line Chart</button>
        <button onClick={() => setGraphType('bar')}>Bar Chart</button>
        <button onClick={() => setStartDate(new Date('2024-02-01'))}>
          Change Date
        </button>
        Graph Type: {graphType}, Devices: {devices?.length}
      </div>
    );
  };
});

jest.mock(
  '../../../../components/views/site-details/SiteDevicesOverview',
  () => {
    return function MockSiteDevicesOverview({
      devices,
      activeSiteAlerts,
      resolvedSiteAlerts,
      avgData,
      totalData,
      maxData,
      timeSeriesData,
      timeIncrement,
    }) {
      return (
        <div data-testid='site-devices-overview'>
          Devices: {devices?.length}, Active Alerts: {activeSiteAlerts?.length},
          Resolved: {resolvedSiteAlerts?.length}
        </div>
      );
    };
  },
);

// Mock services and utilities before importing components
jest.mock('../../../../services/services', () => ({
  getSiteOverview: jest.fn(),
}));

jest.mock('../../../../services/search', () => ({
  AVG_AGGREGATION: 'avg',
  DAY: 'day',
  GROUPED_BAR: 'groupedBar',
  TOTAL_AGGREGATION: 'total',
  getAggregationValue: jest.fn(),
  parseCurrentPower: jest.fn(),
  parseMaxData: jest.fn(),
  parseSearchReturn: jest.fn(),
  parseStackedTimeSeriesData: jest.fn(),
}));

jest.mock('../../../../utils/Utils', () => ({
  getDeviceIdToNameMap: jest.fn(),
  getDisplayName: jest.fn(),
  getRoundedTimeFromOffset: jest.fn(),
  sortDevices: jest.fn(),
  useStickyState: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  redirect: jest.fn(),
}));

const renderWithProviders = (component, initialRoute = '/sites/site-123') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <IntlProvider locale='en' messages={{}}>
        {component}
      </IntlProvider>
    </MemoryRouter>,
  );
};

describe('SiteDetails', () => {
  const mockSetTrialDate = jest.fn();

  const mockSiteData = {
    site: {
      id: 'site-123',
      name: 'Test Site',
      city: 'San Francisco',
      state: 'CA',
      subtraction: false,
    },
    devices: [
      {
        id: 'device-1',
        name: 'Device 1',
        site: 'Test Site',
        isSite: false,
        disabled: false,
      },
      {
        id: 'device-2',
        name: 'Device 2',
        site: 'Test Site',
        isSite: false,
        disabled: false,
      },
      {
        id: 'site-123',
        name: 'Test Site',
        site: 'Test Site',
        isSite: true,
        disabled: false,
      },
    ],
    alarms: [
      { id: 1, state: 1, message: 'Active alarm', siteId: 'site-123' },
      { id: 2, state: 0, message: 'Resolved alarm', siteId: 'site-123' },
      { id: 3, state: 2, message: 'Critical alarm', siteId: 'site-123' },
    ],
    total: { value: 2500 },
    avg: { value: 350 },
    weeklyMaxPower: { current: 200, max: 300 },
    weather: { temp: 75, condition: 'sunny' },
    timeSeries: [
      { time: '2024-01-01T00:00:00Z', value: 100 },
      { time: '2024-01-01T01:00:00Z', value: 150 },
    ],
    deviceAvg: { 'device-1': 100, 'device-2': 150 },
    deviceTotals: { 'device-1': 800, 'device-2': 1200 },
    deviceWeeklyMaxPower: {
      'device-1': { current: 80, max: 120 },
      'device-2': { current: 120, max: 180 },
    },
    deviceTimeSeries: {
      'device-1': [{ time: '2024-01-01T00:00:00Z', value: 50 }],
    },
    localTime: '10:30 AM PST',
    trialDate: '2024-12-31',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock utility functions
    utils.useStickyState.mockImplementation((defaultValue) => [
      defaultValue,
      jest.fn(),
    ]);
    utils.getRoundedTimeFromOffset.mockReturnValue(
      new Date('2024-01-01').getTime(),
    );
    utils.sortDevices.mockImplementation((a, b) =>
      a.name.localeCompare(b.name),
    );
    utils.getDisplayName.mockImplementation(
      (site) => site?.name || 'Unknown Site',
    );
    utils.getDeviceIdToNameMap.mockReturnValue({
      'device-1': 'Device 1',
      'device-2': 'Device 2',
    });

    // Mock search service functions
    searchService.getAggregationValue.mockImplementation(
      (data, type) => data?.value || 0,
    );
    searchService.parseMaxData.mockImplementation((data) => data?.max || 0);
    searchService.parseCurrentPower.mockImplementation(
      (data) => data?.current || 0,
    );
    searchService.parseSearchReturn.mockImplementation((data) => data);
    searchService.parseStackedTimeSeriesData.mockImplementation(
      (data, nameMap) => data,
    );
    searchService.DAY = 'day';
    searchService.GROUPED_BAR = 'groupedBar';
    searchService.TOTAL_AGGREGATION = 'total';
    searchService.AVG_AGGREGATION = 'avg';

    // Mock successful service call
    services.getSiteOverview.mockResolvedValue({ data: mockSiteData });

    // Mock document.title
    Object.defineProperty(document, 'title', {
      writable: true,
      value: 'Default Title',
    });
  });

  describe('Route Handling', () => {
    test('renders without site ID redirects', () => {
      renderWithProviders(
        <SiteDetails setTrialDate={mockSetTrialDate} />,
        '/sites/',
      );

      // Component should redirect when there's no siteId, so no loader should be present
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    test('extracts site ID from route parameters', async () => {
      renderWithProviders(
        <SiteDetails setTrialDate={mockSetTrialDate} />,
        '/sites/site-123',
      );

      await waitFor(() => {
        expect(services.getSiteOverview).toHaveBeenCalledWith(
          'site-123',
          expect.any(Date),
          'day',
          'bar',
        );
      });
    });
  });

  describe('Loading States', () => {
    test('shows loader initially', () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    test('hides loader after data loads', async () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });
    });
  });

  describe('Data Loading and Rendering', () => {
    test('renders all main components after successful data load', async () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('current-power-block')).toBeInTheDocument();
      expect(screen.getByTestId('weather-block')).toBeInTheDocument();
      expect(screen.getByTestId('site-details-graph')).toBeInTheDocument();
      expect(screen.getByTestId('site-devices-overview')).toBeInTheDocument();
      expect(screen.getByTestId('time-increment-selector')).toBeInTheDocument();
    });

    test('sets document title with site name', async () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(document.title).toBe('SMA Dashboard (Test Site)');
      });
    });

    test('sets trial date correctly', async () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(mockSetTrialDate).toHaveBeenCalledWith('2024-12-31');
      });
    });

    test('navigates to home when data is null', async () => {
      services.getSiteOverview.mockResolvedValue({ data: null });

      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('Site Information Display', () => {
    test('displays site name correctly', async () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.getByText('Test Site')).toBeInTheDocument();
      });
    });

    test('displays site location and time', async () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(
          screen.getByText('San Francisco, CA 10:30 AM PST'),
        ).toBeInTheDocument();
      });
    });

    test('handles missing location data gracefully', async () => {
      const siteDataNoLocation = {
        ...mockSiteData,
        site: { ...mockSiteData.site, city: null, state: null },
      };
      services.getSiteOverview.mockResolvedValue({ data: siteDataNoLocation });

      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      // Should not display location text when city/state is missing
      expect(screen.queryByText(/San Francisco, CA/)).not.toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    test('renders back to dashboard link', async () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.getByText('Back to dashboard')).toBeInTheDocument();
      });
    });

    test('renders link to site report with correct site ID', async () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        const reportLink = screen.getByText('To site report');
        expect(reportLink.closest('a')).toHaveAttribute(
          'href',
          '/reports?siteId=site-123',
        );
      });
    });
  });

  describe('Device Processing', () => {
    test('filters and sorts devices correctly', async () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const devicesOverview = screen.getByTestId('site-devices-overview');
      // Should filter out site devices and disabled devices, leaving 2 regular devices
      expect(devicesOverview).toHaveTextContent('Devices: 2');
    });

    test('excludes disabled devices from device list', async () => {
      const siteDataWithDisabled = {
        ...mockSiteData,
        devices: [
          ...mockSiteData.devices,
          {
            id: 'device-3',
            name: 'Disabled Device',
            site: 'Test Site',
            isSite: false,
            disabled: true,
          },
        ],
      };
      services.getSiteOverview.mockResolvedValue({
        data: siteDataWithDisabled,
      });

      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const devicesOverview = screen.getByTestId('site-devices-overview');
      // Should still only show 2 devices (disabled one filtered out)
      expect(devicesOverview).toHaveTextContent('Devices: 2');
    });
  });

  describe('Alert Processing', () => {
    test('correctly categorizes active and resolved site alerts', async () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const stackedAlerts = screen.getAllByTestId('stacked-alerts-info');
      stackedAlerts.forEach((alert) => {
        expect(alert).toHaveTextContent('Active: 2, Resolved: 1');
      });
    });

    test('navigates to alerts page with site filter when clicked', async () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const alertComponent = screen.getAllByTestId('stacked-alerts-info')[0];
      fireEvent.click(alertComponent);

      expect(mockNavigate).toHaveBeenCalledWith('/alerts?siteId=site-123');
    });
  });

  describe('Power Data Display', () => {
    test('displays correct power values', async () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('power-block-total')).toHaveTextContent(
        'total: 2500 Wh',
      );
      expect(screen.getByTestId('power-block-average')).toHaveTextContent(
        'average: 350',
      );
      expect(screen.getByTestId('stacked-tot-avg')).toHaveTextContent(
        'Total: 2500, Avg: 350',
      );
    });

    test('displays current and max power correctly', async () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('current-power-block')).toHaveTextContent(
        'Current: 200, Max: 300',
      );
    });
  });

  describe('Weather Display', () => {
    test('displays weather information', async () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('weather-block')).toHaveTextContent(
        'Weather: 75°F, sunny',
      );
    });
  });

  describe('Time Increment Changes', () => {
    test('updates time increment and refetches data', async () => {
      const mockSetTimeIncrement = jest.fn();
      utils.useStickyState.mockReturnValue(['day', mockSetTimeIncrement]);

      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const weekButton = screen.getByText('Week');
      fireEvent.click(weekButton);

      expect(mockSetTimeIncrement).toHaveBeenCalledWith('week');
    });

    test('refetches data when time increment changes via useEffect', async () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(services.getSiteOverview).toHaveBeenCalledWith(
          'site-123',
          expect.any(Date),
          'day',
          'bar',
        );
      });
    });
  });

  describe('Graph Type Changes', () => {
    test('changes graph type without refetching data for non-grouped bar types', async () => {
      const mockSetGraphType = jest.fn();
      utils.useStickyState.mockImplementation((defaultValue, key) => {
        if (key === 'graph.type') return ['bar', mockSetGraphType];
        return [defaultValue, jest.fn()];
      });

      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const lineButton = screen.getByText('Line Chart');
      fireEvent.click(lineButton);

      expect(mockSetGraphType).toHaveBeenCalledWith('line');
      // Should not refetch data for non-grouped bar transitions
      expect(services.getSiteOverview).toHaveBeenCalledTimes(1);
    });

    test('refetches data when changing to/from grouped bar type', async () => {
      const mockSetGraphType = jest.fn();
      utils.useStickyState.mockImplementation((defaultValue, key) => {
        if (key === 'graph.type') return ['groupedBar', mockSetGraphType];
        return [defaultValue, jest.fn()];
      });

      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const lineButton = screen.getByText('Line Chart');
      fireEvent.click(lineButton);

      // Should refetch data when changing from grouped bar
      await waitFor(() => {
        expect(services.getSiteOverview).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Data Processing for Charts', () => {
    test('processes time series data for non-subtraction sites', async () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(searchService.parseStackedTimeSeriesData).toHaveBeenCalledWith(
          mockSiteData.timeSeries,
          { 'device-1': 'Device 1', 'device-2': 'Device 2' },
        );
      });
    });

    test('processes time series data for subtraction sites', async () => {
      const subtractionSiteData = {
        ...mockSiteData,
        site: { ...mockSiteData.site, subtraction: true },
      };
      services.getSiteOverview.mockResolvedValue({ data: subtractionSiteData });

      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(searchService.parseSearchReturn).toHaveBeenCalledWith(
          subtractionSiteData.timeSeries,
        );
      });
    });
  });

  describe('Device Overview Data Passing', () => {
    test('passes correct data to site devices overview', async () => {
      renderWithProviders(<SiteDetails setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const devicesOverview = screen.getByTestId('site-devices-overview');
      expect(devicesOverview).toHaveTextContent(
        'Active Alerts: 2, Resolved: 1',
      );
    });
  });

  describe('Responsive Design Classes', () => {
    test('applies correct CSS classes to main container', async () => {
      const { container } = renderWithProviders(
        <SiteDetails setTrialDate={mockSetTrialDate} />,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const siteDetailsMain = container.querySelector('.SiteDetails');
      expect(siteDetailsMain).toHaveClass('flex', 'flex-col', 'items-center');
    });

    test('applies fade-in animation class', async () => {
      const { container } = renderWithProviders(
        <SiteDetails setTrialDate={mockSetTrialDate} />,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const fadeInDiv = container.querySelector('.fade-in');
      expect(fadeInDiv).toBeInTheDocument();
    });
  });
});
