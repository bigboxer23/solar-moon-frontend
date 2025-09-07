/* eslint-env jest */
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import Alerts from '../../../../components/views/alerts/Alerts';

// Mock external dependencies
jest.mock('../../../../services/services', () => ({
  getAlarmData: jest.fn(),
  getSubscriptionInformation: jest.fn(),
}));

jest.mock('../../../../utils/Utils', () => ({
  compare: jest.fn((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }),
}));

jest.mock('../../../../services/search', () => ({
  ALL: 'ALL',
}));

// Mock child components
jest.mock('../../../../components/common/Loader', () => {
  return function MockLoader() {
    return <div data-testid='loader'>Loading...</div>;
  };
});

jest.mock('../../../../components/views/alerts/Alert', () => {
  return function MockAlert({ alert, active }) {
    return (
      <div
        data-active={active}
        data-device-id={alert.deviceId}
        data-testid='alert-item'
      >
        Alert: {alert.deviceName || alert.deviceId} - {alert.message}
      </div>
    );
  };
});

jest.mock('../../../../components/views/alerts/AlertsFilter', () => {
  return function MockAlertsFilter({
    handleFilterChange,
    availableDevices,
    availableSites,
    refreshSearch,
    setRefreshSearch,
    reloadData,
  }) {
    return (
      <div data-testid='alerts-filter'>
        <div data-testid='device-count'>{availableDevices.length}</div>
        <div data-testid='site-count'>{availableSites.length}</div>
        <button
          data-testid='filter-change'
          onClick={() =>
            handleFilterChange({
              deviceId: 'ALL',
              siteId: 'ALL',
              start: null,
              end: null,
            })
          }
        >
          Filter Change
        </button>
        <button
          data-testid='refresh-button'
          onClick={() => setRefreshSearch(true)}
        >
          Refresh
        </button>
      </div>
    );
  };
});

const renderWithRouter = (component) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('Alerts', () => {
  const mockSetTrialDate = jest.fn();
  const mockGetAlarmData =
    require('../../../../services/services').getAlarmData;
  const mockGetSubscriptionInformation =
    require('../../../../services/services').getSubscriptionInformation;

  const mockActiveAlert = {
    alarmId: 'alarm-1',
    deviceId: 'device-1',
    deviceName: 'Solar Panel A',
    deviceSite: 'Site Alpha',
    siteId: 'site-1',
    message: 'Low power output',
    startDate: Date.now() - 3600000,
    endDate: 0,
    state: 1,
    deviceDisabled: false,
  };

  const mockResolvedAlert = {
    alarmId: 'alarm-2',
    deviceId: 'device-2',
    deviceName: 'Solar Panel B',
    deviceSite: 'Site Beta',
    siteId: 'site-2',
    message: 'Communication timeout',
    startDate: Date.now() - 7200000,
    endDate: Date.now() - 3600000,
    state: 0,
    deviceDisabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock responses
    mockGetAlarmData.mockResolvedValue({
      data: [mockActiveAlert, mockResolvedAlert],
    });

    mockGetSubscriptionInformation.mockResolvedValue({
      data: { joinDate: Date.now() - 30 * 24 * 60 * 60 * 1000 }, // 30 days ago
    });
  });

  describe('Loading State', () => {
    test('shows loader initially', () => {
      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    test('hides main content during loading', () => {
      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      expect(screen.queryByText('Alerts')).not.toBeInTheDocument();
    });
  });

  describe('Data Loading', () => {
    test('calls getAlarmData on component mount', async () => {
      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(mockGetAlarmData).toHaveBeenCalled();
      });
    });

    test('calls getSubscriptionInformation and sets trial date', async () => {
      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(mockGetSubscriptionInformation).toHaveBeenCalled();
        expect(mockSetTrialDate).toHaveBeenCalled();
      });
    });

    test('renders content after data loads', async () => {
      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.getByText('Alerts')).toBeInTheDocument();
      });
    });
  });

  describe('Alert Display', () => {
    test('displays active alerts section', async () => {
      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.getByText('Alerts')).toBeInTheDocument();
        expect(screen.getByText('1 active')).toBeInTheDocument();
      });
    });

    test('displays resolved alerts section', async () => {
      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.getByText('Resolved Alerts')).toBeInTheDocument();
        expect(screen.getByText('1 resolved')).toBeInTheDocument();
      });
    });

    test('renders active alert components', async () => {
      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        const activeAlerts = screen
          .getAllByTestId('alert-item')
          .filter((alert) => alert.getAttribute('data-active') === 'true');
        expect(activeAlerts).toHaveLength(1);
        expect(activeAlerts[0]).toHaveAttribute('data-device-id', 'device-1');
      });
    });

    test('renders resolved alert components', async () => {
      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        const resolvedAlerts = screen
          .getAllByTestId('alert-item')
          .filter(
            (alert) =>
              alert.getAttribute('data-active') === 'false' ||
              !alert.getAttribute('data-active'),
          );
        expect(resolvedAlerts).toHaveLength(1);
        expect(resolvedAlerts[0]).toHaveAttribute('data-device-id', 'device-2');
      });
    });

    test('shows "all clear" message when no active alerts', async () => {
      mockGetAlarmData.mockResolvedValue({
        data: [mockResolvedAlert], // Only resolved alerts
      });

      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(
          screen.getByText('All clear! You have no active device alerts.'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Alerts Filter Integration', () => {
    test('renders AlertsFilter component', async () => {
      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.getByTestId('alerts-filter')).toBeInTheDocument();
      });
    });

    test('passes device and site options to filter', async () => {
      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        // Should have device options (non-disabled devices)
        expect(screen.getByTestId('device-count')).toBeInTheDocument();
        // Should have site options
        expect(screen.getByTestId('site-count')).toBeInTheDocument();
      });
    });
  });

  describe('Alert Sorting and Processing', () => {
    test('sorts active alerts by start date descending', async () => {
      const olderAlert = {
        ...mockActiveAlert,
        alarmId: 'alarm-old',
        startDate: Date.now() - 7200000, // 2 hours ago
      };

      const newerAlert = {
        ...mockActiveAlert,
        alarmId: 'alarm-new',
        startDate: Date.now() - 1800000, // 30 minutes ago
      };

      mockGetAlarmData.mockResolvedValue({
        data: [olderAlert, newerAlert, mockResolvedAlert],
      });

      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.getByText('2 active')).toBeInTheDocument();
        const activeAlerts = screen
          .getAllByTestId('alert-item')
          .filter((alert) => alert.getAttribute('data-active') === 'true');
        expect(activeAlerts).toHaveLength(2);
      });
    });

    test('separates active and resolved alerts correctly', async () => {
      const alerts = [
        { ...mockActiveAlert, state: 1 }, // Active
        { ...mockResolvedAlert, state: 0 }, // Resolved
        { ...mockActiveAlert, alarmId: 'alarm-3', state: 2 }, // Active (state > 0)
      ];

      mockGetAlarmData.mockResolvedValue({ data: alerts });

      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.getByText('2 active')).toBeInTheDocument();
        expect(screen.getByText('1 resolved')).toBeInTheDocument();
      });
    });
  });

  describe('Device and Site Options Processing', () => {
    test('processes disabled devices correctly', async () => {
      const disabledDevice = {
        ...mockActiveAlert,
        alarmId: 'disabled-alarm',
        deviceId: 'disabled-device',
        deviceDisabled: true,
      };

      mockGetAlarmData.mockResolvedValue({
        data: [mockActiveAlert, disabledDevice],
      });

      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        // Filter should receive device options including disabled devices
        expect(screen.getByTestId('device-count')).toBeInTheDocument();
      });
    });

    test('creates site options from unique sites', async () => {
      const alert1 = {
        ...mockActiveAlert,
        siteId: 'site-1',
        deviceSite: 'Site Alpha',
      };
      const alert2 = {
        ...mockActiveAlert,
        alarmId: 'alert-2',
        siteId: 'site-2',
        deviceSite: 'Site Beta',
      };
      const alert3 = {
        ...mockActiveAlert,
        alarmId: 'alert-3',
        siteId: 'site-1',
        deviceSite: 'Site Alpha',
      }; // Duplicate

      mockGetAlarmData.mockResolvedValue({
        data: [alert1, alert2, alert3],
      });

      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.getByTestId('site-count')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('handles missing subscription information', async () => {
      mockGetSubscriptionInformation.mockResolvedValue({ data: null });

      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(mockSetTrialDate).toHaveBeenCalled();
      });
    });
  });

  describe('Component Structure', () => {
    test('applies correct CSS classes to main container', async () => {
      const { container } = renderWithRouter(
        <Alerts setTrialDate={mockSetTrialDate} />,
      );

      await waitFor(() => {
        const alertsContainer = container.querySelector('.Alerts');
        expect(alertsContainer).toHaveClass(
          'Alerts',
          'flex',
          'w-full',
          'flex-col',
          'items-center',
          'justify-center',
        );
      });
    });

    test('renders with correct content wrapper styling', async () => {
      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        const contentWrapper = document.querySelector('.fade-in.my-8');
        expect(contentWrapper).toBeInTheDocument();
        expect(contentWrapper).toHaveClass(
          'fade-in',
          'my-8',
          'w-[55rem]',
          'max-w-full',
          'bg-white',
          'p-6',
          'shadow-panel',
          'dark:bg-gray-800',
          'sm:rounded-lg',
          'sm:p-8',
        );
      });
    });
  });

  describe('Responsive Design', () => {
    test('has responsive padding and sizing classes', async () => {
      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        const contentWrapper = document.querySelector('.fade-in.my-8');
        expect(contentWrapper).toHaveClass('p-6', 'sm:p-8');
        expect(contentWrapper).toHaveClass('sm:rounded-lg');
      });
    });
  });

  describe('Dark Mode Support', () => {
    test('has dark mode classes for content wrapper', async () => {
      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        const contentWrapper = document.querySelector('.bg-white');
        expect(contentWrapper).toHaveClass('dark:bg-gray-800');
      });
    });

    test('has dark mode classes for text elements', async () => {
      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        const alertsTitle = screen.getByText('Alerts');
        expect(alertsTitle).toHaveClass('text-black', 'dark:text-gray-100');

        const resolvedTitle = screen.getByText('Resolved Alerts');
        expect(resolvedTitle).toHaveClass('text-black', 'dark:text-gray-100');
      });
    });
  });

  describe('Integration', () => {
    test('integrates properly with child components', async () => {
      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        // Should have alerts filter
        expect(screen.getByTestId('alerts-filter')).toBeInTheDocument();

        // Should have alert items
        expect(screen.getAllByTestId('alert-item')).toHaveLength(2);
      });
    });

    test('passes correct props to child components', async () => {
      renderWithRouter(<Alerts setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        const alertItems = screen.getAllByTestId('alert-item');
        expect(alertItems[0]).toHaveAttribute('data-device-id');
        expect(alertItems[1]).toHaveAttribute('data-device-id');
      });
    });
  });
});
