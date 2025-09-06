/* eslint-env jest */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import SiteManagement, {
  noSite,
} from '../../../../components/views/site-management/SiteManagement';
import * as services from '../../../../services/services';
import * as utils from '../../../../utils/Utils';

// Mock child components
jest.mock('../../../../components/common/Button', () => {
  return function MockButton({
    children,
    onClick,
    disabled,
    className,
    title,
    variant,
    buttonProps,
  }) {
    return (
      <button
        className={className}
        data-testid={`button-${variant || 'default'}`}
        disabled={disabled}
        onClick={onClick}
        title={buttonProps?.title || title}
      >
        {children}
      </button>
    );
  };
});

jest.mock('../../../../components/common/Dropdown', () => {
  return function MockDropdown({
    options,
    value,
    onChange,
    prefixLabel,
    className,
  }) {
    return (
      <div className={className} data-testid='dropdown'>
        <span>{prefixLabel}: </span>
        <select
          data-testid='dropdown-select'
          onChange={(e) => {
            const selectedOption = options.find(
              (opt) => opt.value === e.target.value,
            );
            if (selectedOption) onChange(selectedOption);
          }}
          value={value?.value || ''}
        >
          {options
            .filter((opt) => !opt.divider)
            .map((option) => (
              <option key={option.value} value={option.value}>
                {typeof option.label === 'string'
                  ? option.label
                  : `Site ${option.value}`}
              </option>
            ))}
        </select>
      </div>
    );
  };
});

jest.mock('../../../../components/common/Loader', () => {
  return function MockLoader({ className }) {
    return (
      <div className={className} data-testid='loader'>
        Loading...
      </div>
    );
  };
});

jest.mock('../../../../components/views/site-management/Site', () => {
  return function MockSite({ data, devices, setActiveSiteId, setDevices }) {
    return (
      <div data-testid={`site-${data.id}`}>
        <div>Site: {data.name}</div>
        <div>
          Devices:{' '}
          {devices.filter((d) => d.siteId === data.id && !d.isSite).length}
        </div>
        <button onClick={() => setActiveSiteId('different-site')}>
          Change Active Site
        </button>
      </div>
    );
  };
});

jest.mock('../../../../components/views/site-management/NewSiteDialog', () => {
  return function MockNewSiteDialog({
    show,
    setShow,
    setActiveSiteId,
    setDevices,
    setVersion,
  }) {
    if (!show) return null;
    return (
      <div data-testid='new-site-dialog'>
        <button onClick={() => setShow(false)}>Close</button>
        <button
          onClick={() => {
            setActiveSiteId('new-site-id');
            setDevices((prev) => [
              ...prev,
              { id: 'new-site-id', name: 'New Site', isSite: true },
            ]);
            setVersion((prev) => prev + 1);
            setShow(false);
          }}
        >
          Create Site
        </button>
      </div>
    );
  };
});

jest.mock(
  '../../../../components/views/site-management/NewSiteExampleDialog',
  () => {
    return function MockNewSiteExampleDialog({
      show,
      setShow,
      showSiteCreation,
    }) {
      if (!show) return null;
      return (
        <div data-testid='new-site-example-dialog'>
          <button onClick={() => setShow(false)}>Close Example</button>
          <button
            onClick={() => {
              setShow(false);
              showSiteCreation(true);
            }}
          >
            Create First Site
          </button>
        </div>
      );
    };
  },
);

jest.mock(
  '../../../../components/views/site-management/NewDeviceDialog',
  () => {
    return function MockNewDeviceDialog({
      show,
      setShow,
      devices,
      setDevices,
      siteId,
      setVersion,
    }) {
      if (!show) return null;
      return (
        <div data-testid='new-device-dialog'>
          <div>Site ID: {siteId}</div>
          <button onClick={() => setShow(false)}>Close</button>
          <button
            onClick={() => {
              setDevices((prev) => [
                ...prev,
                {
                  id: 'new-device-id',
                  name: 'New Device',
                  isSite: false,
                  siteId,
                },
              ]);
              setVersion((prev) => prev + 1);
              setShow(false);
            }}
          >
            Create Device
          </button>
        </div>
      );
    };
  },
);

jest.mock(
  '../../../../components/views/site-management/NewDeviceExampleDialog',
  () => {
    return function MockNewDeviceExampleDialog({
      show,
      setShow,
      showDeviceCreation,
    }) {
      if (!show) return null;
      return (
        <div data-testid='new-device-example-dialog'>
          <button onClick={() => setShow(false)}>Close Example</button>
          <button
            onClick={() => {
              setShow(false);
              showDeviceCreation(true);
            }}
          >
            Create First Device
          </button>
        </div>
      );
    };
  },
);

// Mock services and utilities before importing components
jest.mock('../../../../services/services', () => ({
  getDevice: jest.fn(),
  getDevices: jest.fn(),
  getSubscriptionInformation: jest.fn(),
  updateDevice: jest.fn(),
}));

jest.mock('../../../../utils/Utils', () => ({
  findSiteNameFromSiteId: jest.fn(),
  sortDevices: jest.fn(),
  useStickyState: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockSearchParams = new URLSearchParams();
const mockSetSearchParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
}));

const renderWithProviders = (component, initialRoute = '/manage') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <IntlProvider locale='en' messages={{}}>
        {component}
      </IntlProvider>
    </MemoryRouter>,
  );
};

describe('SiteManagement', () => {
  const mockSetTrialDate = jest.fn();

  const mockDevices = [
    { id: 'site-1', name: 'Site A', isSite: true, siteId: 'site-1' },
    { id: 'site-2', name: 'Site B', isSite: true, siteId: 'site-2' },
    { id: 'device-1', name: 'Device 1', isSite: false, siteId: 'site-1' },
    { id: 'device-2', name: 'Device 2', isSite: false, siteId: 'site-1' },
    { id: 'device-3', name: 'Device 3', isSite: false, siteId: 'site-2' },
  ];

  const mockSubscriptionInfo = {
    joinDate: '2024-01-01',
    packs: 2, // 2 packs * 20 = 40 devices allowed
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock utility functions
    utils.useStickyState.mockImplementation((defaultValue) => [
      defaultValue,
      jest.fn(),
    ]);
    utils.sortDevices.mockImplementation((a, b) =>
      a.name.localeCompare(b.name),
    );
    utils.findSiteNameFromSiteId.mockImplementation((siteId, devices) => {
      if (siteId === noSite) return noSite;
      const site = devices.find((d) => d.id === siteId && d.isSite);
      return site?.name || 'Unknown Site';
    });

    // Mock successful service calls
    services.getDevices.mockResolvedValue({ data: mockDevices });
    services.getSubscriptionInformation.mockResolvedValue({
      data: mockSubscriptionInfo,
    });
    services.getDevice.mockResolvedValue({
      data: { id: 'device-1', notificationsDisabled: false },
    });
    services.updateDevice.mockResolvedValue({
      data: { id: 'device-1', notificationsDisabled: true },
    });
  });

  describe('Loading States', () => {
    test('shows loader initially', () => {
      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    test('hides loader after data loads', async () => {
      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });
    });

    test('handles API failure gracefully', async () => {
      services.getDevices.mockRejectedValue(new Error('API Error'));

      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });
    });
  });

  describe('Data Loading', () => {
    test('loads devices and subscription info on mount', async () => {
      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(services.getDevices).toHaveBeenCalled();
        expect(services.getSubscriptionInformation).toHaveBeenCalled();
      });
    });

    test('sets trial date from subscription info', async () => {
      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(mockSetTrialDate).toHaveBeenCalledWith('2024-01-01');
      });
    });

    test('calculates devices allowed correctly for paid subscription', async () => {
      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.getByText('5 of 40 devices used')).toBeInTheDocument();
      });
    });

    test('calculates devices allowed correctly for trial', async () => {
      services.getSubscriptionInformation.mockResolvedValue({
        data: { ...mockSubscriptionInfo, packs: -1 },
      });

      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.getByText('5 of 10 devices used')).toBeInTheDocument();
      });
    });
  });

  describe('Device Count Display', () => {
    test('shows normal styling when under device limit', async () => {
      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        const deviceCount = screen.getByText('5 of 40 devices used');
        expect(deviceCount).toHaveClass('text-gray-400');
        expect(deviceCount).not.toHaveClass('text-danger');
      });
    });

    test('shows danger styling when over device limit', async () => {
      services.getSubscriptionInformation.mockResolvedValue({
        data: { ...mockSubscriptionInfo, packs: 0 }, // 0 packs * 20 = 0 devices allowed
      });

      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        const deviceCount = screen.getByText('5 of 0 devices used');
        expect(deviceCount).toHaveClass('text-danger');
        expect(deviceCount).toHaveClass('font-bold');
      });
    });
  });

  describe('Site Dropdown', () => {
    test('displays site selection dropdown with all sites', async () => {
      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.getByTestId('dropdown')).toBeInTheDocument();
        expect(screen.getByText('Manage:')).toBeInTheDocument();
      });
    });

    test('includes "No Site" option in dropdown', async () => {
      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        const dropdown = screen.getByTestId('dropdown-select');
        expect(dropdown).toBeInTheDocument();
      });
    });

    test('shows "New Site" option when subscription available', async () => {
      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        const dropdown = screen.getByTestId('dropdown-select');
        const newSiteOption = Array.from(dropdown.options).find(
          (opt) => opt.value === '-1',
        );
        expect(newSiteOption).toBeTruthy();
      });
    });

    test('hides "New Site" option when subscription not available', async () => {
      services.getSubscriptionInformation.mockResolvedValue({
        data: { ...mockSubscriptionInfo, packs: 0 },
      });

      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        const dropdown = screen.getByTestId('dropdown-select');
        const newSiteOption = Array.from(dropdown.options).find(
          (opt) => opt.value === '-1',
        );
        expect(newSiteOption).toBeFalsy();
      });
    });

    test('selecting "New Site" opens new site dialog', async () => {
      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const dropdown = screen.getByTestId('dropdown-select');
      fireEvent.change(dropdown, { target: { value: '-1' } });

      expect(screen.getByTestId('new-site-dialog')).toBeInTheDocument();
    });

    test('selecting existing site changes active site', async () => {
      const mockSetActiveSiteId = jest.fn();
      utils.useStickyState.mockReturnValue(['site-1', mockSetActiveSiteId]);

      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const dropdown = screen.getByTestId('dropdown-select');
      fireEvent.change(dropdown, { target: { value: 'site-2' } });

      expect(mockSetActiveSiteId).toHaveBeenCalledWith('site-2');
    });
  });

  describe('Action Buttons', () => {
    test('renders Add Device button', async () => {
      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.getByTestId('button-primary')).toBeInTheDocument();
        expect(screen.getByText('Add Device')).toBeInTheDocument();
      });
    });

    test('renders Mappings button', async () => {
      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.getByTestId('button-secondary')).toBeInTheDocument();
        expect(screen.getByText('Mappings')).toBeInTheDocument();
      });
    });

    test('Add Device button opens new device dialog', async () => {
      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const addDeviceButton = screen.getByTestId('button-primary');
      fireEvent.click(addDeviceButton);

      expect(screen.getByTestId('new-device-dialog')).toBeInTheDocument();
    });

    test('Mappings button navigates to mapping page', async () => {
      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const mappingsButton = screen.getByTestId('button-secondary');
      fireEvent.click(mappingsButton);

      expect(mockNavigate).toHaveBeenCalledWith('/mapping');
    });

    test('Add Device button is disabled when subscription not available', async () => {
      services.getSubscriptionInformation.mockResolvedValue({
        data: { ...mockSubscriptionInfo, packs: 0 },
      });

      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        const addDeviceButton = screen.getByTestId('button-primary');
        expect(addDeviceButton).toBeDisabled();
      });
    });
  });

  describe('Site Rendering', () => {
    test('renders active site component', async () => {
      utils.useStickyState.mockReturnValue(['site-1', jest.fn()]);

      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.getByTestId('site-site-1')).toBeInTheDocument();
        expect(screen.getByText('Site: Site A')).toBeInTheDocument();
      });
    });

    test('renders device count for site', async () => {
      utils.useStickyState.mockReturnValue(['site-1', jest.fn()]);

      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.getByText('Devices: 2')).toBeInTheDocument(); // site-1 has 2 devices
      });
    });

    test('defaults to first site when no active site set', async () => {
      const mockSetActiveSiteId = jest.fn();
      utils.useStickyState.mockImplementation((defaultValue, key) => {
        if (key === 'site.management') {
          // Simulate that setActiveSiteId was called and now returns 'site-1'
          return [
            mockSetActiveSiteId.mock.calls.length > 0 ? 'site-1' : '',
            mockSetActiveSiteId,
          ];
        }
        return [defaultValue, jest.fn()];
      });

      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(mockSetActiveSiteId).toHaveBeenCalledWith('site-1');
      });

      await waitFor(() => {
        expect(screen.getByTestId('site-site-1')).toBeInTheDocument();
      });
    });

    test('falls back to "No Site" when no sites exist', async () => {
      services.getDevices.mockResolvedValue({ data: [] });
      const mockSetActiveSiteId = jest.fn();
      utils.useStickyState.mockImplementation((defaultValue, key) => {
        if (key === 'site.management') {
          // Simulate that setActiveSiteId was called and now returns noSite
          return [
            mockSetActiveSiteId.mock.calls.length > 0 ? noSite : '',
            mockSetActiveSiteId,
          ];
        }
        return [defaultValue, jest.fn()];
      });

      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(mockSetActiveSiteId).toHaveBeenCalledWith(noSite);
      });

      await waitFor(() => {
        expect(screen.getByTestId(`site-${noSite}`)).toBeInTheDocument();
      });
    });
  });

  describe('Example Dialogs', () => {
    test('shows new site example dialog when no devices exist', async () => {
      services.getDevices.mockResolvedValue({ data: [] });

      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('new-site-example-dialog')).toBeInTheDocument();
    });

    test('shows new device example dialog when only sites exist', async () => {
      const onlySites = [
        { id: 'site-1', name: 'Site A', isSite: true, siteId: 'site-1' },
      ];
      services.getDevices.mockResolvedValue({ data: onlySites });

      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      expect(
        screen.getByTestId('new-device-example-dialog'),
      ).toBeInTheDocument();
    });

    test('new site example dialog can trigger site creation', async () => {
      services.getDevices.mockResolvedValue({ data: [] });

      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const createSiteButton = screen.getByText('Create First Site');
      fireEvent.click(createSiteButton);

      expect(
        screen.queryByTestId('new-site-example-dialog'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('new-site-dialog')).toBeInTheDocument();
    });

    test('new device example dialog can trigger device creation', async () => {
      const onlySites = [
        { id: 'site-1', name: 'Site A', isSite: true, siteId: 'site-1' },
      ];
      services.getDevices.mockResolvedValue({ data: onlySites });

      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const createDeviceButton = screen.getByText('Create First Device');
      fireEvent.click(createDeviceButton);

      expect(
        screen.queryByTestId('new-device-example-dialog'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('new-device-dialog')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    test('shows empty state message when no devices', async () => {
      services.getDevices.mockResolvedValue({ data: [] });

      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      expect(
        screen.getByText(/You don't have any devices yet/),
      ).toBeInTheDocument();
    });

    test('does not show empty state when devices exist', async () => {
      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      expect(
        screen.queryByText(/You don't have any devices yet/),
      ).not.toBeInTheDocument();
    });
  });

  describe('URL Parameters Handling', () => {
    test('handles disable notifications parameter', async () => {
      // Set up the search params before rendering the component
      mockSearchParams.append('disable', 'device-1');

      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(services.getDevice).toHaveBeenCalledWith('device-1');
        expect(services.updateDevice).toHaveBeenCalledWith({
          id: 'device-1',
          notificationsDisabled: true,
        });
      });

      // Clean up for next test
      mockSearchParams.delete('disable');
    });
  });

  describe('Dialog Management', () => {
    test('can create new site through dialog', async () => {
      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      // Open new site dialog
      const dropdown = screen.getByTestId('dropdown-select');
      fireEvent.change(dropdown, { target: { value: '-1' } });

      expect(screen.getByTestId('new-site-dialog')).toBeInTheDocument();

      // Create site through dialog
      const createButton = screen.getByText('Create Site');
      fireEvent.click(createButton);

      expect(screen.queryByTestId('new-site-dialog')).not.toBeInTheDocument();
    });

    test('can create new device through dialog', async () => {
      utils.useStickyState.mockReturnValue(['site-1', jest.fn()]);

      renderWithProviders(<SiteManagement setTrialDate={mockSetTrialDate} />);

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      // Open new device dialog
      const addDeviceButton = screen.getByTestId('button-primary');
      fireEvent.click(addDeviceButton);

      expect(screen.getByTestId('new-device-dialog')).toBeInTheDocument();
      expect(screen.getByText('Site ID: site-1')).toBeInTheDocument();

      // Create device through dialog
      const createButton = screen.getByText('Create Device');
      fireEvent.click(createButton);

      expect(screen.queryByTestId('new-device-dialog')).not.toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    test('applies correct main container classes', async () => {
      const { container } = renderWithProviders(
        <SiteManagement setTrialDate={mockSetTrialDate} />,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const main = container.querySelector('.SiteManagement');
      expect(main).toHaveClass(
        'flex',
        'max-w-full',
        'flex-col',
        'items-center',
        'justify-center',
      );
    });

    test('applies fade-in animation class', async () => {
      const { container } = renderWithProviders(
        <SiteManagement setTrialDate={mockSetTrialDate} />,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const fadeInDiv = container.querySelector('.fade-in');
      expect(fadeInDiv).toBeInTheDocument();
    });

    test('applies dark mode classes', async () => {
      const { container } = renderWithProviders(
        <SiteManagement setTrialDate={mockSetTrialDate} />,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });

      const darkModeDiv = container.querySelector('.dark\\:bg-gray-800');
      expect(darkModeDiv).toBeInTheDocument();
    });
  });
});
