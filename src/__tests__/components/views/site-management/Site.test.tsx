import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import Site from '../../../../components/views/site-management/Site';
import { deleteDevice, getDevices } from '../../../../services/services';
import { sortDevicesWithDisabled } from '../../../../utils/Utils';

vi.mock('../../../../services/services', () => ({
  deleteDevice: vi.fn(),
  getDevices: vi.fn(),
}));

vi.mock('../../../../utils/Utils', () => ({
  sortDevicesWithDisabled: vi.fn((a, b) => a.name.localeCompare(b.name)),
}));

vi.mock('react-icons/ai', () => ({
  AiOutlineDelete: () => <div data-testid='delete-icon' />,
}));

// Mock child components
vi.mock('../../../../components/views/site-management/Device', () => {
  const MockDevice = function ({ data }) {
    return <div data-testid={`device-${data.id}`}>{data.name}</div>;
  };
  return { default: MockDevice };
});

vi.mock('../../../../components/views/site-management/SiteAttributes', () => {
  const MockSiteAttributes = function ({ data }) {
    return <div data-testid={`site-attributes-${data.id}`}>{data.name}</div>;
  };
  return { default: MockSiteAttributes };
});

vi.mock('../../../../components/views/site-management/SiteManagement', () => ({
  noSite: 'no-site',
}));

describe('Site', () => {
  const mockSetDevices = vi.fn();
  const mockSetActiveSiteId = vi.fn();

  const mockSiteData = {
    id: 'site-1',
    name: 'Test Site',
    isSite: true,
  };

  const mockDevices = [
    {
      id: 'site-1',
      name: 'Test Site',
      site: 'Test Site',
      isSite: true,
    },
    {
      id: 'device-1',
      name: 'Test Device 1',
      siteId: 'site-1',
      isSite: false,
    },
    {
      id: 'device-2',
      name: 'Test Device 2',
      siteId: 'site-1',
      isSite: false,
    },
    {
      id: 'other-device',
      name: 'Other Device',
      siteId: 'other-site',
      isSite: false,
    },
  ];

  const defaultProps = {
    data: mockSiteData,
    devices: mockDevices,
    setDevices: mockSetDevices,
    setActiveSiteId: mockSetActiveSiteId,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    getDevices.mockResolvedValue({ data: [] });
    deleteDevice.mockResolvedValue();
  });

  test('renders site attributes for matching sites', () => {
    render(<Site {...defaultProps} />);

    expect(screen.getByTestId('site-attributes-site-1')).toBeInTheDocument();
    expect(screen.getByText('Test Site')).toBeInTheDocument();
  });

  test('renders devices for the site', () => {
    render(<Site {...defaultProps} />);

    expect(screen.getByTestId('device-device-1')).toBeInTheDocument();
    expect(screen.getByTestId('device-device-2')).toBeInTheDocument();
    expect(screen.getByText('Test Device 1')).toBeInTheDocument();
    expect(screen.getByText('Test Device 2')).toBeInTheDocument();
  });

  test('does not render devices from other sites', () => {
    render(<Site {...defaultProps} />);

    expect(screen.queryByTestId('device-other-device')).not.toBeInTheDocument();
    expect(screen.queryByText('Other Device')).not.toBeInTheDocument();
  });

  test('renders delete site button when site is not noSite', () => {
    render(<Site {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /delete site/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
  });

  test('does not render delete site button when site is noSite', () => {
    const noSiteData = { id: 'no-site', name: 'No Site', isSite: true };
    render(<Site {...defaultProps} data={noSiteData} />);

    expect(
      screen.queryByRole('button', { name: /delete site/i }),
    ).not.toBeInTheDocument();
  });

  test('shows delete confirmation dialog when delete button is clicked', () => {
    render(<Site {...defaultProps} />);

    const deleteButton = screen.getByRole('button', { name: /delete site/i });
    fireEvent.click(deleteButton);

    expect(
      screen.getByText('Are you sure you want to delete this site?'),
    ).toBeInTheDocument();
  });

  test('calls deleteDevice when delete is confirmed', async () => {
    render(<Site {...defaultProps} />);

    const deleteButton = screen.getByRole('button', { name: /delete site/i });
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getAllByRole('button', {
      name: /delete site/i,
    });
    const [, confirmButton] = confirmDeleteButton; // The second one is in the modal
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteDevice).toHaveBeenCalledWith('site-1');
    });
  });

  test('fetches devices after successful deletion', async () => {
    render(<Site {...defaultProps} />);

    const deleteButton = screen.getByRole('button', { name: /delete site/i });
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getAllByRole('button', {
      name: /delete site/i,
    });
    const [, confirmButton] = confirmDeleteButton;
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(getDevices).toHaveBeenCalled();
    });
  });

  test('updates devices list after successful deletion', async () => {
    const newDevicesData = [
      { id: 'remaining-device', name: 'Remaining Device' },
    ];
    getDevices.mockResolvedValue({ data: newDevicesData });

    render(<Site {...defaultProps} />);

    const deleteButton = screen.getByRole('button', { name: /delete site/i });
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getAllByRole('button', {
      name: /delete site/i,
    });
    const [, confirmButton] = confirmDeleteButton;
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockSetDevices).toHaveBeenCalledWith(newDevicesData);
    });
  });

  test('sets active site to noSite after successful deletion', async () => {
    render(<Site {...defaultProps} />);

    const deleteButton = screen.getByRole('button', { name: /delete site/i });
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getAllByRole('button', {
      name: /delete site/i,
    });
    const [, confirmButton] = confirmDeleteButton;
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockSetActiveSiteId).toHaveBeenCalledWith('no-site');
    });
  });

  test('handles deletion error gracefully', async () => {
    deleteDevice.mockRejectedValue(new Error('Deletion failed'));

    render(<Site {...defaultProps} />);

    const deleteButton = screen.getByRole('button', { name: /delete site/i });
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getAllByRole('button', {
      name: /delete site/i,
    });
    const [, confirmButton] = confirmDeleteButton;
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteDevice).toHaveBeenCalled();
    });

    // Should not call getDevices if deletion failed
    expect(getDevices).not.toHaveBeenCalled();
    expect(mockSetDevices).not.toHaveBeenCalled();
  });

  test('shows spinner when loading', async () => {
    deleteDevice.mockImplementation(() => new Promise(() => {})); // Never resolving promise

    const { container } = render(<Site {...defaultProps} />);

    const deleteButton = screen.getByRole('button', { name: /delete site/i });
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getAllByRole('button', {
      name: /delete site/i,
    });
    const [, confirmButton] = confirmDeleteButton;
    fireEvent.click(confirmButton);

    await waitFor(() => {
      const spinner = container.querySelector('svg.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  test('disables delete button when loading', async () => {
    deleteDevice.mockImplementation(() => new Promise(() => {})); // Never resolving promise

    render(<Site {...defaultProps} />);

    const deleteButton = screen.getByRole('button', { name: /delete site/i });
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getAllByRole('button', {
      name: /delete site/i,
    });
    const [, confirmButton] = confirmDeleteButton;
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteButton).toBeDisabled();
    });
  });

  test('sorts devices using sortDevicesWithDisabled utility', () => {
    render(<Site {...defaultProps} />);

    expect(sortDevicesWithDisabled).toHaveBeenCalled();
  });

  test('filters devices correctly', () => {
    render(<Site {...defaultProps} />);

    // Should render devices that belong to this site (siteId matches)
    expect(screen.getByTestId('device-device-1')).toBeInTheDocument();
    expect(screen.getByTestId('device-device-2')).toBeInTheDocument();

    // Should not render devices from other sites
    expect(screen.queryByTestId('device-other-device')).not.toBeInTheDocument();
  });

  test('renders site attributes for matching site names', () => {
    render(<Site {...defaultProps} />);

    // Should render site attributes for sites that match the site name
    expect(screen.getByTestId('site-attributes-site-1')).toBeInTheDocument();
  });

  test('handles empty devices array', () => {
    render(<Site {...defaultProps} devices={[]} />);

    // Should not render any devices or site attributes
    expect(screen.queryByTestId(/device-/)).not.toBeInTheDocument();
    expect(screen.queryByTestId(/site-attributes-/)).not.toBeInTheDocument();

    // Should still render delete button if site is not noSite
    expect(
      screen.getByRole('button', { name: /delete site/i }),
    ).toBeInTheDocument();
  });

  test('renders with correct component structure', () => {
    const { container } = render(<Site {...defaultProps} />);

    const siteContainer = container.querySelector('.space-y-6');
    expect(siteContainer).toBeInTheDocument();
  });
});
