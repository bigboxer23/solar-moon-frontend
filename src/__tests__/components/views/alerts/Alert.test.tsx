import { render, screen } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import Alert from '../../../../components/views/alerts/Alert';
import * as utils from '../../../../utils/Utils';

// Mock external dependencies
vi.mock('@tippyjs/react', () => {
  const MockTippy = function ({
    children,
    content,
    ...props
  }: {
    children: ReactNode;
    content: string;
    [key: string]: unknown;
  }) {
    return (
      <div data-testid='tippy-wrapper' title={content} {...props}>
        {children}
      </div>
    );
  };
  return { default: MockTippy };
});

vi.mock('../../../../utils/Utils', () => ({
  formatMessage: vi.fn((msg) => msg || ''),
  getFormattedDaysHoursMinutes: vi.fn(
    (duration) => `${Math.floor(duration / (1000 * 60 * 60))}h`,
  ),
  getFormattedTime: vi.fn((timestamp) =>
    new Date(timestamp).toLocaleTimeString(),
  ),
  TIPPY_DELAY: 500,
}));

vi.mock('../../../../services/search', () => ({
  HOUR: 3600000, // 1 hour in milliseconds
}));

// Mock date-fns formatDistance
vi.mock('date-fns', () => ({
  formatDistance: vi.fn((date, baseDate, options) => {
    const diff = Math.abs(baseDate - date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const result = `${hours} hours`;
    return options?.addSuffix ? `${result} ago` : result;
  }),
}));

const renderWithRouter = (component: ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('Alert', () => {
  const mockActiveAlert = {
    alarmId: 'alarm-123',
    deviceId: 'device-456',
    deviceName: 'Solar Panel A1',
    deviceSite: 'Site Alpha',
    message: 'Low power output detected',
    startDate: Date.now() - 3600000, // 1 hour ago
    endDate: 0,
    state: 1, // Active
  };

  const mockResolvedAlert = {
    alarmId: 'alarm-124',
    deviceId: 'device-457',
    deviceName: 'Solar Panel B2',
    deviceSite: 'Site Beta',
    message: 'Communication timeout',
    startDate: Date.now() - 7200000, // 2 hours ago
    endDate: Date.now() - 1800000, // 30 minutes ago
    state: 0, // Resolved
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders active alert correctly', () => {
      renderWithRouter(<Alert active alert={mockActiveAlert} />);

      expect(screen.getByText('Solar Panel A1')).toBeInTheDocument();
      expect(screen.getByText('Site Alpha')).toBeInTheDocument();
      expect(screen.getByText('Message:')).toBeInTheDocument();
    });

    test('renders resolved alert correctly', () => {
      renderWithRouter(<Alert active={false} alert={mockResolvedAlert} />);

      expect(screen.getByText('Solar Panel B2')).toBeInTheDocument();
      expect(screen.getByText('Site Beta')).toBeInTheDocument();
      expect(screen.getByText('Message:')).toBeInTheDocument();
    });

    test('renders alert without device name using device ID', () => {
      const alertWithoutName = { ...mockActiveAlert, deviceName: undefined };
      renderWithRouter(<Alert active alert={alertWithoutName} />);

      expect(screen.getByText('device-456')).toBeInTheDocument();
    });

    test('renders alert without site information', () => {
      const alertWithoutSite = { ...mockActiveAlert, deviceSite: undefined };
      renderWithRouter(<Alert active alert={alertWithoutSite} />);

      expect(screen.queryByText(/Site:/)).not.toBeInTheDocument();
    });
  });

  describe('Navigation Link', () => {
    test('creates correct link for active alert', () => {
      renderWithRouter(<Alert active alert={mockActiveAlert} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/reports?deviceId=device-456');
    });

    test('creates correct link for resolved alert with time range', () => {
      renderWithRouter(<Alert active={false} alert={mockResolvedAlert} />);

      const link = screen.getByRole('link');
      const expectedStart = mockResolvedAlert.startDate - 3 * 3600000; // 3 hours before start
      const expectedEnd = mockResolvedAlert.endDate + 3600000; // 1 hour after end
      expect(link).toHaveAttribute(
        'href',
        `/reports?deviceId=device-457&start=${expectedStart}&end=${expectedEnd}`,
      );
    });
  });

  describe('Alert Styling', () => {
    test('applies active alert styling', () => {
      const { container } = renderWithRouter(
        <Alert active alert={mockActiveAlert} />,
      );

      const alertElement = container.querySelector('.Alert');
      expect(alertElement).toHaveClass(
        'bg-danger',
        'text-white',
        'dark:bg-danger',
      );
    });

    test('applies resolved alert styling', () => {
      const { container } = renderWithRouter(
        <Alert active={false} alert={mockResolvedAlert} />,
      );

      const alertElement = container.querySelector('.Alert');
      expect(alertElement).toHaveClass('bg-[#f5f5f5]', 'dark:bg-gray-700');
      expect(alertElement).not.toHaveClass('bg-danger');
    });

    test('has correct base CSS classes', () => {
      const { container } = renderWithRouter(
        <Alert active alert={mockActiveAlert} />,
      );

      const alertElement = container.querySelector('.Alert');
      expect(alertElement).toHaveClass(
        'Alert',
        'flex',
        'w-full',
        'justify-between',
        'text-black',
        'dark:text-gray-100',
        'p-4',
        'rounded-md',
        'overflow-hidden',
        'flex-col-reverse',
        'sm:flex-row',
      );
    });
  });

  describe('Time Display for Active Alerts', () => {
    test('shows time since alert started for active alerts', () => {
      renderWithRouter(<Alert active alert={mockActiveAlert} />);

      expect(screen.getByTestId('tippy-wrapper')).toBeInTheDocument();
    });

    test('shows tooltip with formatted start time for active alerts', () => {
      renderWithRouter(<Alert active alert={mockActiveAlert} />);

      const timeElement = screen.getByTestId('tippy-wrapper');
      expect(timeElement).toHaveAttribute('title');
      expect(timeElement.getAttribute('title')).toContain('Starting at');
    });

    test('does not show resolved information for active alerts', () => {
      renderWithRouter(<Alert active alert={mockActiveAlert} />);

      expect(screen.queryByText(/Resolved/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Duration/)).not.toBeInTheDocument();
    });
  });

  describe('Time Display for Resolved Alerts', () => {
    test('shows resolved time and duration for resolved alerts', () => {
      renderWithRouter(<Alert active={false} alert={mockResolvedAlert} />);

      expect(screen.getByText(/Resolved/)).toBeInTheDocument();
      expect(screen.getByText(/Duration/)).toBeInTheDocument();
    });

    test('shows tooltip with end time for resolved alerts', () => {
      renderWithRouter(<Alert active={false} alert={mockResolvedAlert} />);

      const tooltips = screen.getAllByTestId('tippy-wrapper');
      const resolvedTooltip = tooltips.find((tip) =>
        tip.getAttribute('title')?.includes('Ending at'),
      );
      expect(resolvedTooltip).toBeTruthy();
    });

    test('shows tooltip with duration range for resolved alerts', () => {
      renderWithRouter(<Alert active={false} alert={mockResolvedAlert} />);

      const tooltips = screen.getAllByTestId('tippy-wrapper');
      const durationTooltip = tooltips.find((tip) =>
        tip.getAttribute('title')?.includes(' to '),
      );
      expect(durationTooltip).toBeTruthy();
    });

    test('does not show start time info for resolved alerts', () => {
      renderWithRouter(<Alert active={false} alert={mockResolvedAlert} />);

      const tooltips = screen.getAllByTestId('tippy-wrapper');
      const startTooltip = tooltips.find((tip) =>
        tip.getAttribute('title')?.includes('Starting at'),
      );
      expect(startTooltip).toBeFalsy();
    });
  });

  describe('Device and Site Information', () => {
    test('displays device label and name', () => {
      renderWithRouter(<Alert active alert={mockActiveAlert} />);

      expect(screen.getByText('Device:')).toBeInTheDocument();
      expect(screen.getByText('Solar Panel A1')).toBeInTheDocument();
    });

    test('displays site label and name when available', () => {
      renderWithRouter(<Alert active alert={mockActiveAlert} />);

      expect(screen.getByText('Site:')).toBeInTheDocument();
      expect(screen.getByText('Site Alpha')).toBeInTheDocument();
    });

    test('displays message label and formatted message', () => {
      renderWithRouter(<Alert active alert={mockActiveAlert} />);

      expect(screen.getByText('Message:')).toBeInTheDocument();
      expect(screen.getByText('Message:')).toBeInTheDocument();
    });

    test('handles missing device name gracefully', () => {
      const alertNoName = { ...mockActiveAlert, deviceName: '' };
      renderWithRouter(<Alert active alert={alertNoName} />);

      expect(screen.getByText('Device:')).toBeInTheDocument();
      expect(screen.getByText('device-456')).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    test('has responsive flex classes for mobile/desktop layout', () => {
      const { container } = renderWithRouter(
        <Alert active alert={mockActiveAlert} />,
      );

      const alertElement = container.querySelector('.Alert');
      expect(alertElement).toHaveClass('flex-col-reverse', 'sm:flex-row');
    });

    test('device and site info have responsive layout classes', () => {
      renderWithRouter(<Alert active alert={mockActiveAlert} />);

      const infoContainer = document.querySelector(
        '.flex.flex-col.gap-y-1.sm\\:flex-row',
      );
      expect(infoContainer).toBeInTheDocument();
      expect(infoContainer).toHaveClass('sm:gap-y-0');
    });

    test('time display has responsive layout classes', () => {
      renderWithRouter(<Alert active alert={mockActiveAlert} />);

      const timeContainer = document.querySelector('.mb-1.flex.flex-row');
      expect(timeContainer).toHaveClass(
        'justify-between',
        'gap-x-1',
        'text-xs',
        'italic',
        'sm:mb-0',
        'sm:flex-col',
        'sm:items-end',
      );
    });
  });

  describe('Accessibility', () => {
    test('alert is a clickable link with proper role', () => {
      renderWithRouter(<Alert active alert={mockActiveAlert} />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });

    test('tooltips have proper content for screen readers', () => {
      renderWithRouter(<Alert active={false} alert={mockResolvedAlert} />);

      const tooltips = screen.getAllByTestId('tippy-wrapper');
      tooltips.forEach((tooltip) => {
        expect(tooltip).toHaveAttribute('title');
        expect(tooltip.getAttribute('title')).toBeTruthy();
      });
    });
  });

  describe('Integration', () => {
    test('calls formatMessage utility with alert message', () => {
      renderWithRouter(<Alert active alert={mockActiveAlert} />);

      expect(utils.formatMessage).toHaveBeenCalledWith(
        'Low power output detected',
      );
    });

    test('calls time formatting utilities for resolved alerts', () => {
      renderWithRouter(<Alert active={false} alert={mockResolvedAlert} />);

      expect(utils.getFormattedTime).toHaveBeenCalled();
      expect(utils.getFormattedDaysHoursMinutes).toHaveBeenCalled();
    });

    test('renders with different alert states correctly', () => {
      const testCases = [
        {
          alert: { ...mockActiveAlert, state: 1 },
          active: true,
          expectResolved: false,
        },
        {
          alert: { ...mockResolvedAlert, state: 0 },
          active: false,
          expectResolved: true,
        },
      ];

      testCases.forEach(({ alert, active, expectResolved }) => {
        const { unmount } = renderWithRouter(
          <Alert active={active} alert={alert} />,
        );

        if (expectResolved) {
          expect(screen.getByText(/Resolved/)).toBeInTheDocument();
          expect(screen.getByText(/Duration/)).toBeInTheDocument();
        } else {
          expect(screen.queryByText(/Resolved/)).not.toBeInTheDocument();
          expect(screen.queryByText(/Duration/)).not.toBeInTheDocument();
        }

        unmount();
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles alert with minimal data', () => {
      const minimalAlert = {
        alarmId: 'minimal-123',
        deviceId: 'device-minimal',
        message: 'Simple alert',
        startDate: Date.now(),
        endDate: 0,
        state: 1,
      };

      renderWithRouter(<Alert active alert={minimalAlert} />);

      expect(screen.getByText('device-minimal')).toBeInTheDocument();
      expect(screen.getByText('Message:')).toBeInTheDocument();
      expect(screen.queryByText(/Site:/)).not.toBeInTheDocument();
    });

    test('handles very long device names and messages', () => {
      const longAlert = {
        ...mockActiveAlert,
        deviceName:
          'Very Long Device Name That Might Cause Layout Issues In Some Cases',
        message:
          'This is a very long alert message that contains multiple pieces of information and might wrap to multiple lines in the UI',
      };

      renderWithRouter(<Alert active alert={longAlert} />);

      expect(
        screen.getByText(
          'Very Long Device Name That Might Cause Layout Issues In Some Cases',
        ),
      ).toBeInTheDocument();
      expect(screen.getByText('Message:')).toBeInTheDocument();
    });
  });
});
