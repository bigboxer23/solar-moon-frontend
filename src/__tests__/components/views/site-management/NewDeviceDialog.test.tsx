/* eslint-env jest */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import NewDeviceDialog from '../../../../components/views/site-management/NewDeviceDialog';
import { addDevice } from '../../../../services/services';
import { findSiteNameFromSiteId } from '../../../../utils/Utils';

jest.mock('../../../../services/services', () => ({
  addDevice: jest.fn(),
}));

jest.mock('../../../../utils/Utils', () => ({
  findSiteNameFromSiteId: jest.fn(),
}));

describe('NewDeviceDialog', () => {
  const mockSetShow = jest.fn();
  const mockSetDevices = jest.fn();
  const mockSetVersion = jest.fn();

  const mockDevices = [
    {
      id: 'site-1',
      name: 'Test Site 1',
      isSite: true,
    },
    {
      id: 'site-2',
      name: 'Test Site 2',
      isSite: true,
    },
    {
      id: 'device-1',
      name: 'Test Device',
      isSite: false,
    },
  ];

  const defaultProps = {
    show: true,
    setShow: mockSetShow,
    devices: mockDevices,
    setDevices: mockSetDevices,
    setVersion: mockSetVersion,
    siteId: 'site-1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    findSiteNameFromSiteId.mockImplementation((id, devices) => {
      const site = devices.find((d) => d.id === id);
      return site ? site.name : 'Unknown Site';
    });
    addDevice.mockResolvedValue({
      data: {
        device: {
          id: 'new-device-1',
          deviceName: 'new-device',
          name: 'New Device',
          siteId: 'site-1',
        },
      },
    });
  });

  test('renders modal when show is true', () => {
    render(<NewDeviceDialog {...defaultProps} />);

    expect(screen.getByText('Create New Device')).toBeInTheDocument();
  });

  test('does not render modal when show is false', () => {
    render(<NewDeviceDialog {...defaultProps} show={false} />);

    expect(screen.queryByText('Create New Device')).not.toBeInTheDocument();
  });

  test('renders all form fields', () => {
    render(<NewDeviceDialog {...defaultProps} />);

    expect(screen.getByLabelText(/device name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/site/i)).toBeInTheDocument();
  });

  test('renders site options in select', () => {
    render(<NewDeviceDialog {...defaultProps} />);

    const siteSelect = screen.getByRole('combobox', { name: /site/i });
    expect(siteSelect).toBeInTheDocument();
  });

  test('renders create device button', () => {
    render(<NewDeviceDialog {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /create device/i }),
    ).toBeInTheDocument();
  });

  test('closes modal when close button is clicked', () => {
    render(<NewDeviceDialog {...defaultProps} />);

    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find((button) =>
      button.className.includes('Button-icon'),
    );
    fireEvent.click(closeButton);

    expect(mockSetShow).toHaveBeenCalledWith(false);
  });

  test('validates required fields', async () => {
    render(<NewDeviceDialog {...defaultProps} />);

    const createButton = screen.getByRole('button', { name: /create device/i });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Device name is required')).toBeInTheDocument();
      expect(screen.getByText('Display name is required')).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    render(<NewDeviceDialog {...defaultProps} />);

    const deviceNameInput = screen.getByLabelText(/device name/i);
    const displayNameInput = screen.getByLabelText(/display name/i);
    const createButton = screen.getByRole('button', { name: /create device/i });

    fireEvent.change(deviceNameInput, { target: { value: 'test-device' } });
    fireEvent.change(displayNameInput, { target: { value: 'Test Device' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(addDevice).toHaveBeenCalledWith({
        deviceName: 'test-device',
        name: 'Test Device',
        siteId: 'site-1',
        site: 'Test Site 1',
      });
    });
  });

  test('updates devices list after successful creation', async () => {
    render(<NewDeviceDialog {...defaultProps} />);

    const deviceNameInput = screen.getByLabelText(/device name/i);
    const displayNameInput = screen.getByLabelText(/display name/i);
    const createButton = screen.getByRole('button', { name: /create device/i });

    fireEvent.change(deviceNameInput, { target: { value: 'test-device' } });
    fireEvent.change(displayNameInput, { target: { value: 'Test Device' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockSetDevices).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  test('increments version after successful creation', async () => {
    render(<NewDeviceDialog {...defaultProps} />);

    const deviceNameInput = screen.getByLabelText(/device name/i);
    const displayNameInput = screen.getByLabelText(/display name/i);
    const createButton = screen.getByRole('button', { name: /create device/i });

    fireEvent.change(deviceNameInput, { target: { value: 'test-device' } });
    fireEvent.change(displayNameInput, { target: { value: 'Test Device' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockSetVersion).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  test('closes modal after successful creation', async () => {
    render(<NewDeviceDialog {...defaultProps} />);

    const deviceNameInput = screen.getByLabelText(/device name/i);
    const displayNameInput = screen.getByLabelText(/display name/i);
    const createButton = screen.getByRole('button', { name: /create device/i });

    fireEvent.change(deviceNameInput, { target: { value: 'test-device' } });
    fireEvent.change(displayNameInput, { target: { value: 'Test Device' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockSetShow).toHaveBeenCalledWith(false);
    });
  });

  test('handles creation error gracefully', async () => {
    addDevice.mockRejectedValue(new Error('Creation failed'));

    render(<NewDeviceDialog {...defaultProps} />);

    const deviceNameInput = screen.getByLabelText(/device name/i);
    const displayNameInput = screen.getByLabelText(/display name/i);
    const createButton = screen.getByRole('button', { name: /create device/i });

    fireEvent.change(deviceNameInput, { target: { value: 'test-device' } });
    fireEvent.change(displayNameInput, { target: { value: 'Test Device' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(addDevice).toHaveBeenCalled();
    });

    expect(mockSetDevices).not.toHaveBeenCalled();
    expect(mockSetShow).not.toHaveBeenCalledWith(false);
  });

  test('includes site name in addDevice call', async () => {
    render(<NewDeviceDialog {...defaultProps} />);

    const deviceNameInput = screen.getByLabelText(/device name/i);
    const displayNameInput = screen.getByLabelText(/display name/i);
    const createButton = screen.getByRole('button', { name: /create device/i });

    fireEvent.change(deviceNameInput, { target: { value: 'test-device' } });
    fireEvent.change(displayNameInput, { target: { value: 'Test Device' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(findSiteNameFromSiteId).toHaveBeenCalledWith(
        'site-1',
        mockDevices,
      );
      expect(addDevice).toHaveBeenCalledWith(
        expect.objectContaining({
          site: 'Test Site 1',
        }),
      );
    });
  });

  test('uses default siteId if provided', () => {
    render(<NewDeviceDialog {...defaultProps} siteId='site-2' />);

    const siteSelect = screen.getByRole('combobox', { name: /site/i });
    expect(siteSelect).toHaveValue('site-2');
  });

  test('filters devices to show only sites in select', () => {
    render(<NewDeviceDialog {...defaultProps} />);

    expect(findSiteNameFromSiteId).toHaveBeenCalledWith('site-1', mockDevices);
    expect(findSiteNameFromSiteId).toHaveBeenCalledWith('site-2', mockDevices);
    expect(findSiteNameFromSiteId).not.toHaveBeenCalledWith(
      'device-1',
      mockDevices,
    );
  });

  test('submits form when enter key is pressed', async () => {
    render(<NewDeviceDialog {...defaultProps} />);

    const deviceNameInput = screen.getByLabelText(/device name/i);
    const displayNameInput = screen.getByLabelText(/display name/i);

    fireEvent.change(deviceNameInput, { target: { value: 'test-device' } });
    fireEvent.change(displayNameInput, { target: { value: 'Test Device' } });

    // Submit the form by pressing enter on the form itself
    const form = screen.getByRole('dialog').querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(addDevice).toHaveBeenCalled();
    });
  });

  test('validates form on blur', async () => {
    render(<NewDeviceDialog {...defaultProps} />);

    const deviceNameInput = screen.getByLabelText(/device name/i);
    fireEvent.blur(deviceNameInput);

    await waitFor(() => {
      expect(screen.getByText('Device name is required')).toBeInTheDocument();
    });
  });

  test('clears validation errors when valid input is provided', async () => {
    render(<NewDeviceDialog {...defaultProps} />);

    const deviceNameInput = screen.getByLabelText(/device name/i);

    fireEvent.blur(deviceNameInput);
    await waitFor(() => {
      expect(screen.getByText('Device name is required')).toBeInTheDocument();
    });

    fireEvent.change(deviceNameInput, {
      target: { value: 'valid-device-name' },
    });
    fireEvent.blur(deviceNameInput);

    await waitFor(() => {
      expect(
        screen.queryByText('Device name is required'),
      ).not.toBeInTheDocument();
    });
  });
});
