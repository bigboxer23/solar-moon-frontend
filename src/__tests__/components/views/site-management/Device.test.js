/* eslint-env jest */
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import React from 'react';

import Device from '../../../../components/views/site-management/Device';
import { deleteDevice, updateDevice } from '../../../../services/services';
import { findSiteNameFromSiteId } from '../../../../utils/Utils';

jest.mock('../../../../services/services', () => ({
  deleteDevice: jest.fn(),
  updateDevice: jest.fn(),
}));

jest.mock('../../../../utils/Utils', () => ({
  findSiteNameFromSiteId: jest.fn(),
  getDisplayName: jest.fn(),
}));

jest.mock('react-icons/ai', () => ({
  AiOutlineDelete: () => <div data-testid='delete-icon' />,
}));

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

describe('Device', () => {
  const mockSetDevices = jest.fn();
  const mockDeviceData = {
    id: 'device-1',
    name: 'Test Device',
    deviceName: 'test-device',
    siteId: 'site-1',
    disabled: false,
    notificationsDisabled: false,
  };

  const mockDevices = [
    {
      id: 'site-1',
      name: 'Test Site',
      isSite: true,
    },
    {
      id: 'site-2',
      name: 'Another Site',
      isSite: true,
    },
    mockDeviceData,
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    findSiteNameFromSiteId.mockReturnValue('Test Site');
    updateDevice.mockResolvedValue({
      data: { ...mockDeviceData, id: 'device-1' },
    });
    deleteDevice.mockResolvedValue();
  });

  test('renders device component with device name', () => {
    render(
      <Device
        data={mockDeviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    expect(screen.getByText('Test Device')).toBeInTheDocument();
  });

  test('renders device name with opacity when disabled', () => {
    const disabledDevice = { ...mockDeviceData, disabled: true };
    render(
      <Device
        data={disabledDevice}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const deviceName = screen.getByText('Test Device');
    expect(deviceName.className).toContain('opacity-50');
  });

  test('renders form fields with correct default values', () => {
    render(
      <Device
        data={mockDeviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    expect(screen.getByDisplayValue('test-device')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Device')).toBeInTheDocument();
  });

  test('hides form when device is disabled', () => {
    const disabledDevice = { ...mockDeviceData, disabled: true };
    const { container } = render(
      <Device
        data={disabledDevice}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const form = container.querySelector('form');
    expect(form).toHaveClass('hidden');
  });

  test('shows form when device is enabled', () => {
    const { container } = render(
      <Device
        data={mockDeviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const form = container.querySelector('form');
    expect(form).not.toHaveClass('hidden');
  });

  test('renders site options in select', () => {
    render(
      <Device
        data={mockDeviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const siteSelect = screen.getByRole('combobox', { name: /site/i });
    expect(siteSelect).toBeInTheDocument();
  });

  test('renders enabled checkbox', () => {
    render(
      <Device
        data={mockDeviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).toBeChecked(); // enabled checkbox
  });

  test('renders notifications checkbox', () => {
    render(
      <Device
        data={mockDeviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[1]).toBeChecked(); // notifications checkbox
  });

  test('calls updateDevice when update button is clicked', async () => {
    render(
      <Device
        data={mockDeviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const updateButton = screen.getByRole('button', { name: /update device/i });

    await act(async () => {
      fireEvent.click(updateButton);
    });

    await waitFor(() => {
      expect(updateDevice).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'device-1',
          deviceName: 'test-device',
          name: 'Test Device',
          siteId: 'site-1',
          notificationsDisabled: false,
          disabled: false,
          site: 'Test Site',
        }),
      );
    });
  });

  test('updates devices list after successful update', async () => {
    render(
      <Device
        data={mockDeviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const updateButton = screen.getByRole('button', { name: /update device/i });

    await act(async () => {
      fireEvent.click(updateButton);
    });

    await waitFor(() => {
      expect(mockSetDevices).toHaveBeenCalledWith([
        ...mockDevices.filter((d) => d.id !== 'device-1'),
        { ...mockDeviceData, id: 'device-1' },
      ]);
    });
  });

  test('shows spinner when loading', async () => {
    updateDevice.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    const { container } = render(
      <Device
        data={mockDeviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const updateButton = screen.getByRole('button', { name: /update device/i });

    await act(async () => {
      fireEvent.click(updateButton);
    });

    const spinner = container.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(updateButton).toBeDisabled();
  });

  test('handles update error gracefully', async () => {
    updateDevice.mockRejectedValue(new Error('Update failed'));

    render(
      <Device
        data={mockDeviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const updateButton = screen.getByRole('button', { name: /update device/i });

    await act(async () => {
      fireEvent.click(updateButton);
    });

    await waitFor(() => {
      expect(updateDevice).toHaveBeenCalled();
    });

    expect(mockSetDevices).not.toHaveBeenCalled();
  });

  test('renders delete button', () => {
    render(
      <Device
        data={mockDeviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const deleteButton = screen.getByRole('button', { name: /delete device/i });
    expect(deleteButton).toBeInTheDocument();
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
  });

  test('shows delete confirmation dialog when delete button is clicked', () => {
    render(
      <Device
        data={mockDeviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const deleteButton = screen.getByRole('button', { name: /delete device/i });
    fireEvent.click(deleteButton);

    expect(
      screen.getByText('Are you sure you want to delete this device?'),
    ).toBeInTheDocument();
  });

  test('calls deleteDevice and updates devices list when delete is confirmed', async () => {
    render(
      <Device
        data={mockDeviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const deleteButton = screen.getByRole('button', { name: /delete device/i });
    fireEvent.click(deleteButton);

    const allDeleteButtons = screen.getAllByRole('button', {
      name: /delete device/i,
    });
    const [, confirmDeleteButton] = screen.getAllByRole('button', {
      name: /delete device/i,
    });
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(deleteDevice).toHaveBeenCalledWith('device-1');
    });

    await waitFor(() => {
      expect(mockSetDevices).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  test('handles delete error gracefully', async () => {
    deleteDevice.mockRejectedValue(new Error('Delete failed'));

    render(
      <Device
        data={mockDeviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const deleteButton = screen.getByRole('button', { name: /delete device/i });
    fireEvent.click(deleteButton);

    const allDeleteButtons = screen.getAllByRole('button', {
      name: /delete device/i,
    });
    const [, confirmDeleteButton] = screen.getAllByRole('button', {
      name: /delete device/i,
    });
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(deleteDevice).toHaveBeenCalled();
    });
  });

  test('validates required device name field', async () => {
    render(
      <Device
        data={mockDeviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const deviceNameInput = screen.getByDisplayValue('test-device');
    fireEvent.change(deviceNameInput, { target: { value: '' } });
    fireEvent.blur(deviceNameInput);

    await waitFor(() => {
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  test('disables buttons when loading', async () => {
    // Make the promise never resolve so we can check loading state
    updateDevice.mockImplementation(() => new Promise(() => {}));

    render(
      <Device
        data={mockDeviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const updateButton = screen.getByRole('button', { name: /update device/i });
    const deleteButton = screen.getByRole('button', { name: /delete device/i });

    await act(async () => {
      fireEvent.click(updateButton);
    });

    expect(updateButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  test('converts enabled state correctly for API call', async () => {
    const deviceData = { ...mockDeviceData, disabled: true };
    render(
      <Device
        data={deviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const updateButton = screen.getByRole('button', { name: /update device/i });

    await act(async () => {
      fireEvent.click(updateButton);
    });

    await waitFor(() => {
      expect(updateDevice).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: true,
        }),
      );
    });
  });

  test('converts notifications state correctly for API call', async () => {
    const deviceData = { ...mockDeviceData, notificationsDisabled: true };
    render(
      <Device
        data={deviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const updateButton = screen.getByRole('button', { name: /update device/i });

    await act(async () => {
      fireEvent.click(updateButton);
    });

    await waitFor(() => {
      expect(updateDevice).toHaveBeenCalledWith(
        expect.objectContaining({
          notificationsDisabled: true,
        }),
      );
    });
  });

  test('includes site name in update call', async () => {
    render(
      <Device
        data={mockDeviceData}
        devices={mockDevices}
        setDevices={mockSetDevices}
      />,
    );

    const updateButton = screen.getByRole('button', { name: /update device/i });

    await act(async () => {
      fireEvent.click(updateButton);
    });

    await waitFor(() => {
      expect(findSiteNameFromSiteId).toHaveBeenCalledWith(
        'site-1',
        mockDevices,
      );
      expect(updateDevice).toHaveBeenCalledWith(
        expect.objectContaining({
          site: 'Test Site',
        }),
      );
    });
  });
});
