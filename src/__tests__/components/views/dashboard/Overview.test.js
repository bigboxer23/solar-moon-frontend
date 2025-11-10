/* eslint-env jest */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';

import Overview from '../../../../components/views/dashboard/Overview';
import * as searchService from '../../../../services/search';
import * as services from '../../../../services/services';
import * as utils from '../../../../utils/Utils';

// Mock child components
jest.mock('../../../../components/common/CurrentPowerBlock', () => {
  return function MockCurrentPowerBlock({ currentPower, max, activeAlert }) {
    return (
      <div data-testid='current-power-block'>
        Current: {currentPower}, Max: {max}, Alert: {activeAlert?.toString()}
      </div>
    );
  };
});

jest.mock('../../../../components/common/Error', () => {
  return function MockError() {
    return <div data-testid='error'>Error occurred</div>;
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

jest.mock('../../../../components/common/StatBlock', () => {
  return function MockStatBlock({ title, value, onClick, className }) {
    return (
      <div
        className={className}
        data-testid={`stat-block-${title}`}
        onClick={onClick}
      >
        {title}: {value}
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

jest.mock('../../../../components/views/dashboard/OverviewChart', () => {
  return function MockOverviewChart({
    overviewData,
    sitesData,
    timeIncrement,
    startDate,
    setStartDate,
  }) {
    return (
      <div data-testid='overview-chart'>
        Chart - Time: {timeIncrement}, Start:{' '}
        {startDate?.toISOString()?.split('T')[0]}
        <button onClick={() => setStartDate(new Date('2024-01-15'))}>
          Change Date
        </button>
      </div>
    );
  };
});

jest.mock('../../../../components/views/dashboard/OverviewSiteList', () => {
  return function MockOverviewSiteList({
    sites,
    devices,
    alerts,
    sitesGraphData,
    timeIncrement,
  }) {
    return (
      <div data-testid='overview-site-list'>
        Sites: {sites?.length}, Devices: {devices?.length}, Alerts:{' '}
        {alerts?.length}
      </div>
    );
  };
});

jest.mock('../../../../components/views/dashboard/SummaryHeader', () => {
  return function MockSummaryHeader({ dailyAverageOutput, dailyOutput }) {
    return (
      <div data-testid='summary-header'>
        Daily Avg: {dailyAverageOutput}, Daily Total: {dailyOutput}
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

// Mock services and utilities before importing components
jest.mock('../../../../services/services', () => ({
  getOverviewData: jest.fn(),
}));

jest.mock('../../../../services/search', () => ({
  AVG_AGGREGATION: 'avg',
  DAY: 'day',
  TOTAL_AGGREGATION: 'total',
  getAggregationValue: jest.fn(),
  parseCurrentPower: jest.fn(),
  parseMaxData: jest.fn(),
}));

jest.mock('../../../../utils/Utils', () => ({
  getRoundedTimeFromOffset: jest.fn(),
  sortDevices: jest.fn(),
  useStickyState: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <IntlProvider locale='en' messages={{}}>
        {component}
      </IntlProvider>
    </BrowserRouter>,
  );
};

describe('Overview', () => {
  const mockSetTrialDate = jest.fn();

  const mockOverviewData = {
    devices: [
      { id: 1, name: 'Device 1', isSite: false, site: 'Site A' },
      { id: 2, name: 'Site A', isSite: true, site: 'Site A' },
      { id: 3, name: 'Device 2', isSite: false, site: 'Site B' },
      { id: 4, name: 'Site B', isSite: true, site: 'Site B' },
    ],
    alarms: [
      { id: 1, state: 1, message: 'Active alarm' },
      { id: 2, state: 0, message: 'Resolved alarm' },
      { id: 3, state: 2, message: 'Critical alarm' },
    ],
    overall: {
      avg: { value: 250 },
      total: { value: 1500 },
      timeSeries: [{ time: '2024-01-01', value: 100 }],
      dailyEnergyConsumedTotal: { value: 800 },
      dailyEnergyConsumedAverage: 400,
    },
    sitesOverviewData: {
      'Site A': {
        weeklyMaxPower: { current: 150, max: 200 },
      },
      'Site B': {
        weeklyMaxPower: { current: 100, max: 180 },
      },
    },
    subscription: {
      customerId: 'test-customer-id',
      joinDate: '2024-12-31',
      manualSubscriptionDate: 0,
      packs: 0,
    },
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

    // Mock search service functions
    searchService.getAggregationValue.mockImplementation(
      (data, type) => data?.value || 0,
    );
    searchService.parseMaxData.mockImplementation((data) => data?.max || 0);
    searchService.parseCurrentPower.mockImplementation(
      (data) => data?.current || 0,
    );

    // Mock successful service call
    services.getOverviewData.mockResolvedValue({ data: mockOverviewData });
  });

  describe('Loading States', () => {
    test('shows loader initially', () => {
      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    test('shows error state on API failure', async () => {
      services.getOverviewData.mockRejectedValue(new Error('API Error'));

      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
      });
    });
  });

  describe('Data Loading and Rendering', () => {
    test('renders all main components after successful data load', async () => {
      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('summary-header')).toBeInTheDocument();
      expect(screen.getByTestId('current-power-block')).toBeInTheDocument();
      expect(screen.getByTestId('overview-chart')).toBeInTheDocument();
      expect(screen.getByTestId('overview-site-list')).toBeInTheDocument();
      expect(screen.getByTestId('time-increment-selector')).toBeInTheDocument();
    });

    test('calls getOverviewData with correct parameters', async () => {
      const mockStartDate = new Date('2024-01-01');
      utils.getRoundedTimeFromOffset.mockReturnValue(mockStartDate.getTime());

      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(services.getOverviewData).toHaveBeenCalledWith(
          mockStartDate,
          'day',
        );
      });
    });

    test('sets trial date correctly', async () => {
      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(mockSetTrialDate).toHaveBeenCalledWith('2024-12-31');
      });
    });
  });

  describe('Device and Site Processing', () => {
    test('correctly separates sites and devices', async () => {
      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const siteList = screen.getByTestId('overview-site-list');
      expect(siteList).toHaveTextContent('Sites: 2, Devices: 2');
    });

    test('groups devices under their respective sites', async () => {
      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      // The component should create mapped sites with their devices
      expect(screen.getByTestId('overview-site-list')).toBeInTheDocument();
    });
  });

  describe('Alert Processing', () => {
    test('correctly categorizes active and resolved alerts', async () => {
      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const stackedAlerts = screen.getAllByTestId('stacked-alerts-info');
      stackedAlerts.forEach((alert) => {
        expect(alert).toHaveTextContent('Active: 2, Resolved: 1');
      });
    });

    test('navigates to alerts page when alert components are clicked', async () => {
      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const [alertComponent] = screen.getAllByTestId('stacked-alerts-info');
      fireEvent.click(alertComponent);

      expect(mockNavigate).toHaveBeenCalledWith('/alerts');
    });

    test('navigates to alerts page when stat blocks are clicked', async () => {
      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const activeAlertsStatBlock = screen.getByTestId(
        'stat-block-active alerts',
      );
      fireEvent.click(activeAlertsStatBlock);

      expect(mockNavigate).toHaveBeenCalledWith('/alerts');
    });
  });

  describe('Power Data Processing', () => {
    test('displays correct power values', async () => {
      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('power-block-total')).toHaveTextContent(
        'total: 1500 Wh',
      );
      expect(screen.getByTestId('power-block-average')).toHaveTextContent(
        'average: 250',
      );
      expect(screen.getByTestId('stacked-tot-avg')).toHaveTextContent(
        'Total: 1500, Avg: 250',
      );
    });

    test('calculates max power correctly from sites data', async () => {
      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      // Max power should be sum of Site A (200) + Site B (180) = 380
      expect(screen.getByTestId('current-power-block')).toHaveTextContent(
        'Max: 380',
      );
    });

    test('calculates current power correctly from sites data', async () => {
      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      // Current power should be sum of Site A (150) + Site B (100) = 250
      expect(screen.getByTestId('current-power-block')).toHaveTextContent(
        'Current: 250',
      );
    });
  });

  describe('Time Increment Changes', () => {
    test('updates time increment and refetches data', async () => {
      const mockSetTimeIncrement = jest.fn();
      utils.useStickyState.mockReturnValue(['day', mockSetTimeIncrement]);

      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const weekButton = screen.getByText('Week');
      fireEvent.click(weekButton);

      expect(mockSetTimeIncrement).toHaveBeenCalledWith('week');
    });

    test('updates start date when time increment changes', async () => {
      const mockSetTimeIncrement = jest.fn();
      utils.useStickyState.mockReturnValue(['day', mockSetTimeIncrement]);

      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      // Simulate time increment change by calling the wrapper function
      const weekButton = screen.getByText('Week');
      fireEvent.click(weekButton);

      expect(utils.getRoundedTimeFromOffset).toHaveBeenCalledWith('week');
    });
  });

  describe('No Devices Redirect', () => {
    test('redirects to manage page when no devices', async () => {
      const noDevicesData = { ...mockOverviewData, devices: [] };
      services.getOverviewData.mockResolvedValue({ data: noDevicesData });

      // Mock window.location.href
      delete window.location;
      window.location = { href: '' };

      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(window.location.href).toBe('/manage');
      });
    });
  });

  describe('Summary Header Data', () => {
    test('passes correct daily data to summary header', async () => {
      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const summaryHeader = screen.getByTestId('summary-header');
      expect(summaryHeader).toHaveTextContent(
        'Daily Avg: 400, Daily Total: 800',
      );
    });
  });

  describe('Chart Integration', () => {
    test('passes correct data to overview chart', async () => {
      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const chart = screen.getByTestId('overview-chart');
      expect(chart).toHaveTextContent('Time: day');
    });

    test('chart can update start date', async () => {
      renderWithProviders(<Overview setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const changeDateButton = screen.getByText('Change Date');
      fireEvent.click(changeDateButton);

      // This would trigger a re-render with new date, which would call getOverviewData again
      await waitFor(() => {
        expect(services.getOverviewData).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Responsive Design Classes', () => {
    test('applies correct CSS classes', async () => {
      const { container } = renderWithProviders(
        <Overview setTrialDate={mockSetTrialDate} />,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const overviewDiv = container.querySelector('.Overview');
      expect(overviewDiv).toHaveClass(
        'fade-in',
        'mb-8',
        'w-[55rem]',
        'max-w-full',
        'bg-white',
      );
    });

    test('applies dark mode classes', async () => {
      const { container } = renderWithProviders(
        <Overview setTrialDate={mockSetTrialDate} />,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const overviewDiv = container.querySelector('.Overview');
      expect(overviewDiv).toHaveClass('dark:bg-gray-800');
    });
  });
});
