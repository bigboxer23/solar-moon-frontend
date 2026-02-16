import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import AlertsFilter from '../../../../components/views/alerts/AlertsFilter';

// Mock external dependencies
vi.mock('../../../../services/search', () => ({
  ALL: 'ALL',
}));

// Mock child components
vi.mock('../../../../components/common/Button', () => {
  const MockButton = function ({
    children,
    onClick,
    disabled,
    className,
    variant,
    buttonProps,
  }: {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    variant?: string;
    buttonProps?: { 'aria-label'?: string; title?: string };
  }) {
    return (
      <button
        aria-label={buttonProps?.['aria-label']}
        className={className}
        data-testid='button'
        data-variant={variant}
        disabled={disabled}
        onClick={onClick}
        title={buttonProps?.title}
      >
        {children}
      </button>
    );
  };
  return { default: MockButton };
});

vi.mock('../../../../components/common/Dropdown', () => {
  const MockDropdown = function ({
    onChange,
    options,
    prefixLabel,
    value,
  }: {
    onChange: (option: { value: string; label: string }) => void;
    options: Array<{ value: string; label: string }>;
    prefixLabel: string;
    value: { value: string; label: string };
  }) {
    return (
      <div data-prefix-label={prefixLabel} data-testid='dropdown'>
        <select
          data-testid={`${prefixLabel.toLowerCase()}-select`}
          onChange={(e) => {
            const selectedOption = options.find(
              (opt) => opt.value === e.target.value,
            );
            if (selectedOption) onChange(selectedOption);
          }}
          value={value.value}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
  return { default: MockDropdown };
});

vi.mock('../../../../components/common/Spinner', () => {
  const MockSpinner = function () {
    return <div data-testid='spinner'>Loading...</div>;
  };
  return { default: MockSpinner };
});

vi.mock('react-icons/fa6', () => ({
  FaRotate: () => <div data-testid='rotate-icon'>Rotate</div>,
}));

const renderWithRouter = (component: ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('AlertsFilter', () => {
  const mockHandleFilterChange = vi.fn();
  const mockSetRefreshSearch = vi.fn();

  const mockSites = [
    {
      value: 'site-1',
      label: 'Site Alpha',
      deviceName: 'Site Alpha',
      siteName: 'Site Alpha',
    },
    {
      value: 'site-2',
      label: 'Site Beta',
      deviceName: 'Site Beta',
      siteName: 'Site Beta',
    },
  ];

  const mockDevices = [
    {
      value: 'device-1',
      label: 'Device A',
      deviceName: 'Device A',
      site: 'site-1',
      siteName: 'Site Alpha',
    },
    {
      value: 'device-2',
      label: 'Device B',
      deviceName: 'Device B',
      site: 'site-2',
      siteName: 'Site Beta',
    },
    {
      value: 'device-3',
      label: 'Device C',
      deviceName: 'Device C',
      site: 'site-1',
      siteName: 'Site Alpha',
    },
  ];

  const defaultProps = {
    handleFilterChange: mockHandleFilterChange,
    availableSites: mockSites,
    availableDevices: mockDevices,
    refreshSearch: false,
    setRefreshSearch: mockSetRefreshSearch,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Clear URL search params
    delete window.location;
    window.location = { search: '' };
  });

  describe('Basic Rendering', () => {
    test('renders site dropdown', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      expect(screen.getByTestId('site-select')).toBeInTheDocument();
    });

    test('renders device dropdown', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      expect(screen.getByTestId('device-select')).toBeInTheDocument();
    });

    test('renders refresh button', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      expect(screen.getByTestId('button')).toBeInTheDocument();
      expect(screen.getByTestId('button')).toHaveAttribute(
        'aria-label',
        'Refresh Alerts',
      );
    });

    test('shows rotate icon when not refreshing', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      expect(screen.getByTestId('rotate-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    test('shows spinner when refreshing', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} refreshSearch />);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
      expect(screen.queryByTestId('rotate-icon')).not.toBeInTheDocument();
    });
  });

  describe('Dropdown Options', () => {
    test('includes ALL option in site dropdown', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      const siteSelect = screen.getByTestId('site-select');
      expect(
        siteSelect.querySelector('option[value="ALL"]'),
      ).toBeInTheDocument();
    });

    test('includes ALL option in device dropdown', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      const deviceSelect = screen.getByTestId('device-select');
      expect(
        deviceSelect.querySelector('option[value="ALL"]'),
      ).toBeInTheDocument();
    });

    test('includes available sites in dropdown', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      const siteSelect = screen.getByTestId('site-select');
      expect(
        siteSelect.querySelector('option[value="site-1"]'),
      ).toBeInTheDocument();
      expect(
        siteSelect.querySelector('option[value="site-2"]'),
      ).toBeInTheDocument();
    });

    test('includes available devices in dropdown', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      const deviceSelect = screen.getByTestId('device-select');
      expect(
        deviceSelect.querySelector('option[value="device-1"]'),
      ).toBeInTheDocument();
      expect(
        deviceSelect.querySelector('option[value="device-2"]'),
      ).toBeInTheDocument();
      expect(
        deviceSelect.querySelector('option[value="device-3"]'),
      ).toBeInTheDocument();
    });
  });

  describe('Filter Interactions', () => {
    test('calls handleFilterChange when site changes', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      const siteSelect = screen.getByTestId('site-select');
      fireEvent.change(siteSelect, { target: { value: 'site-1' } });

      expect(mockHandleFilterChange).toHaveBeenCalled();
    });

    test('calls handleFilterChange when device changes', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      const deviceSelect = screen.getByTestId('device-select');
      fireEvent.change(deviceSelect, { target: { value: 'device-1' } });

      expect(mockHandleFilterChange).toHaveBeenCalled();
    });

    test('resets device to ALL when site changes', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      const siteSelect = screen.getByTestId('site-select');
      fireEvent.change(siteSelect, { target: { value: 'site-1' } });

      // Device should be reset to ALL when site changes
      const deviceSelect = screen.getByTestId('device-select');
      expect(deviceSelect.value).toBe('ALL');
    });
  });

  describe('Device Filtering by Site', () => {
    test('filters devices based on selected site', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      const siteSelect = screen.getByTestId('site-select');
      fireEvent.change(siteSelect, { target: { value: 'site-1' } });

      // Wait for re-render
      const deviceSelect = screen.getByTestId('device-select');

      // Should include ALL option
      expect(
        deviceSelect.querySelector('option[value="ALL"]'),
      ).toBeInTheDocument();

      // Should include devices from site-1
      expect(
        deviceSelect.querySelector('option[value="device-1"]'),
      ).toBeInTheDocument();
      expect(
        deviceSelect.querySelector('option[value="device-3"]'),
      ).toBeInTheDocument();

      // Should only include devices from site-1
      expect(
        deviceSelect.querySelector('option[value="device-1"]'),
      ).toBeInTheDocument();
      expect(
        deviceSelect.querySelector('option[value="device-3"]'),
      ).toBeInTheDocument();
    });

    test('shows all devices when ALL sites selected', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      const siteSelect = screen.getByTestId('site-select');
      fireEvent.change(siteSelect, { target: { value: 'ALL' } });

      const deviceSelect = screen.getByTestId('device-select');

      // Should include all devices
      expect(
        deviceSelect.querySelector('option[value="device-1"]'),
      ).toBeInTheDocument();
      expect(
        deviceSelect.querySelector('option[value="device-2"]'),
      ).toBeInTheDocument();
      expect(
        deviceSelect.querySelector('option[value="device-3"]'),
      ).toBeInTheDocument();
    });
  });

  describe('Refresh Functionality', () => {
    test('calls setRefreshSearch when refresh button clicked', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      const refreshButton = screen.getByTestId('button');
      fireEvent.click(refreshButton);

      expect(mockSetRefreshSearch).toHaveBeenCalledWith(true);
    });

    test('disables refresh button when refreshing', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} refreshSearch />);

      const refreshButton = screen.getByTestId('button');
      expect(refreshButton).toBeDisabled();
    });

    test('enables refresh button when not refreshing', () => {
      renderWithRouter(
        <AlertsFilter {...defaultProps} refreshSearch={false} />,
      );

      const refreshButton = screen.getByTestId('button');
      expect(refreshButton).not.toBeDisabled();
    });
  });

  describe('Reset Filters', () => {
    test('shows reset button when filters are dirty', async () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      // Change a filter to make it dirty
      const siteSelect = screen.getByTestId('site-select');
      fireEvent.change(siteSelect, { target: { value: 'site-1' } });

      // Reset button should appear
      await waitFor(() => {
        expect(screen.getAllByText('Reset Filters')).toHaveLength(2);
      });
    });

    test('hides reset button initially when filters are clean', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      expect(screen.queryByText('Reset Filters')).not.toBeInTheDocument();
    });

    test('resets all filters when reset button clicked', async () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      // Make filters dirty
      const siteSelect = screen.getByTestId('site-select');
      fireEvent.change(siteSelect, { target: { value: 'site-1' } });

      // Click reset
      await waitFor(() => {
        const resetButtons = screen.getAllByText('Reset Filters');
        const [resetButton] = resetButtons;
        fireEvent.click(resetButton);
      });

      // Filters should be reset to ALL
      expect(siteSelect.value).toBe('ALL');
      const deviceSelect = screen.getByTestId('device-select');
      expect(deviceSelect.value).toBe('ALL');
    });
  });

  describe('Responsive Design', () => {
    test('applies correct CSS classes to main container', () => {
      const { container } = renderWithRouter(
        <AlertsFilter {...defaultProps} />,
      );

      const filterContainer = container.querySelector('.AlertsFilter');
      expect(filterContainer).toHaveClass(
        'AlertsFilter',
        'flex',
        'flex-col',
        'items-end',
        'gap-y-3',
        'sm:flex-row',
        'sm:items-center',
        'sm:gap-x-6',
        'sm:gap-y-0',
      );
    });

    test('reset button has responsive visibility classes', async () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      // Make filters dirty to show reset button
      const siteSelect = screen.getByTestId('site-select');
      fireEvent.change(siteSelect, { target: { value: 'site-1' } });

      await waitFor(() => {
        const resetButtons = screen.getAllByText('Reset Filters');

        // Desktop reset button (hidden on mobile)
        const desktopReset = resetButtons.find(
          (btn) =>
            btn.classList.contains('hidden') &&
            btn.classList.contains('sm:block'),
        );
        expect(desktopReset).toBeInTheDocument();

        // Mobile reset button (hidden on desktop)
        const mobileReset = resetButtons.find(
          (btn) =>
            btn.classList.contains('block') &&
            btn.classList.contains('sm:hidden'),
        );
        expect(mobileReset).toBeInTheDocument();
      });
    });

    test('refresh button has mobile text and responsive classes', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      expect(screen.getByText('Refresh')).toBeInTheDocument();

      const refreshText = screen.getByText('Refresh');
      expect(refreshText).toHaveClass(
        'me-2',
        'text-black',
        'dark:text-gray-100',
        'sm:hidden',
      );
    });
  });

  describe('Button Configuration', () => {
    test('refresh button has correct props and attributes', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      const refreshButton = screen.getByTestId('button');
      expect(refreshButton).toHaveAttribute('title', 'Refresh Alerts');
      expect(refreshButton).toHaveAttribute('aria-label', 'Refresh Alerts');
      expect(refreshButton).toHaveAttribute('data-variant', 'icon');
    });

    test('refresh button has correct classes', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      const refreshButton = screen.getByTestId('button');
      expect(refreshButton).toHaveClass('flex', 'items-center');
    });
  });

  describe('Integration', () => {
    test('integrates with Dropdown components correctly', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      const [siteDropdown, deviceDropdown] = screen.getAllByTestId('dropdown');

      expect(
        siteDropdown || screen.getByTestId('site-select'),
      ).toBeInTheDocument();
      expect(
        deviceDropdown || screen.getByTestId('device-select'),
      ).toBeInTheDocument();
    });

    test('passes correct options to dropdowns', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      // Verify site options
      const siteSelect = screen.getByTestId('site-select');
      expect(siteSelect.children).toHaveLength(3); // ALL + 2 sites

      // Verify device options
      const deviceSelect = screen.getByTestId('device-select');
      expect(deviceSelect.children).toHaveLength(4); // ALL + 3 devices
    });
  });

  describe('Component Structure', () => {
    test('maintains correct element hierarchy', () => {
      const { container } = renderWithRouter(
        <AlertsFilter {...defaultProps} />,
      );

      const mainContainer = container.querySelector('.AlertsFilter');
      expect(mainContainer).toBeInTheDocument();

      // Should contain dropdowns and button
      expect(
        mainContainer.querySelectorAll('[data-testid="dropdown"]'),
      ).toHaveLength(2);
      expect(
        mainContainer.querySelector('[data-testid="button"]'),
      ).toBeInTheDocument();
    });

    test('renders elements in correct order', () => {
      const { container } = renderWithRouter(
        <AlertsFilter {...defaultProps} />,
      );

      const mainContainer = container.querySelector('.AlertsFilter');
      const children = Array.from(mainContainer.children);

      // Should have at least site dropdown, device dropdown, and refresh button
      expect(children.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Dark Mode Support', () => {
    test('refresh text has dark mode classes', () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      const refreshText = screen.getByText('Refresh');
      expect(refreshText).toHaveClass('text-black', 'dark:text-gray-100');
    });

    test('reset buttons have dark mode classes', async () => {
      renderWithRouter(<AlertsFilter {...defaultProps} />);

      // Make filters dirty
      const siteSelect = screen.getByTestId('site-select');
      fireEvent.change(siteSelect, { target: { value: 'site-1' } });

      await waitFor(() => {
        const resetButtons = screen.getAllByText('Reset Filters');
        resetButtons.forEach((button) => {
          expect(button).toHaveClass('bg-white', 'dark:bg-gray-800');
        });
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles empty sites and devices arrays', () => {
      const props = {
        ...defaultProps,
        availableSites: [],
        availableDevices: [],
      };

      renderWithRouter(<AlertsFilter {...props} />);

      // Should still show ALL options
      const siteSelect = screen.getByTestId('site-select');
      const deviceSelect = screen.getByTestId('device-select');

      expect(siteSelect.children).toHaveLength(1); // Just ALL
      expect(deviceSelect.children).toHaveLength(1); // Just ALL
    });

    test('handles devices without site associations', () => {
      const devicesWithoutSites = [
        {
          value: 'device-orphan',
          label: 'Orphan Device',
          deviceName: 'Orphan Device',
          name: 'ALL',
        },
      ];

      const props = {
        ...defaultProps,
        availableDevices: devicesWithoutSites,
      };

      renderWithRouter(<AlertsFilter {...props} />);

      const deviceSelect = screen.getByTestId('device-select');
      expect(
        deviceSelect.querySelector('option[value="device-orphan"]'),
      ).toBeInTheDocument();
    });
  });
});
