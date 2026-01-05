/* eslint-env jest */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import SiteAttributes from '../../../../components/views/site-management/SiteAttributes';
import { getDevices, updateDevice } from '../../../../services/services';

jest.mock('../../../../services/services', () => ({
  getDevices: jest.fn(),
  updateDevice: jest.fn(),
}));

describe('SiteAttributes', () => {
  const mockSetDevices = jest.fn();
  const mockSetActiveSiteId = jest.fn();

  const mockSiteData = {
    id: 'site-1',
    name: 'Test Site',
    city: 'Test City',
    state: 'Test State',
    country: 'Test Country',
    latitude: 40.7128,
    longitude: -74.006,
  };

  const defaultProps = {
    data: mockSiteData,
    setDevices: mockSetDevices,
    setActiveSiteId: mockSetActiveSiteId,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    updateDevice.mockResolvedValue({ data: { ...mockSiteData } });
    getDevices.mockResolvedValue({ data: { devices: [] } });
  });

  test('renders site attributes form', () => {
    render(<SiteAttributes {...defaultProps} />);

    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/state, province, or region/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
  });

  test('renders form fields with default values', () => {
    render(<SiteAttributes {...defaultProps} />);

    expect(screen.getByDisplayValue('Test Site')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test City')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test State')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Country')).toBeInTheDocument();
  });

  test('renders update site button', () => {
    render(<SiteAttributes {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /update site/i }),
    ).toBeInTheDocument();
  });

  test('displays latitude and longitude when available', () => {
    render(<SiteAttributes {...defaultProps} />);

    expect(screen.getByText('40.7128,-74.006')).toBeInTheDocument();
  });

  test('hides latitude and longitude when not available', () => {
    const siteWithoutLocation = {
      ...mockSiteData,
      latitude: -1,
      longitude: -1,
    };

    const { container } = render(
      <SiteAttributes {...defaultProps} data={siteWithoutLocation} />,
    );

    const locationDiv = container.querySelector('.smaller-text');
    expect(locationDiv).toHaveClass('opacity-0');
  });

  test('validates required name field', async () => {
    render(<SiteAttributes {...defaultProps} />);

    const nameInput = screen.getByDisplayValue('Test Site');
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(screen.getByText('Site name is required')).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    render(<SiteAttributes {...defaultProps} />);

    const nameInput = screen.getByDisplayValue('Test Site');
    const updateButton = screen.getByRole('button', { name: /update site/i });

    fireEvent.change(nameInput, { target: { value: 'Updated Site Name' } });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updateDevice).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'site-1',
          name: 'Updated Site Name',
          displayName: 'Updated Site Name',
          site: 'Updated Site Name',
          city: 'Test City',
          state: 'Test State',
          country: 'Test Country',
          latitude: 40.7128,
          longitude: -74.006,
        }),
      );
    });
  });

  test('updates location coordinates when location fields change', async () => {
    render(<SiteAttributes {...defaultProps} />);

    const cityInput = screen.getByDisplayValue('Test City');
    const updateButton = screen.getByRole('button', { name: /update site/i });

    fireEvent.change(cityInput, { target: { value: 'New City' } });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updateDevice).toHaveBeenCalledWith(
        expect.objectContaining({
          city: 'New City',
          latitude: -1,
          longitude: -1,
        }),
      );
    });
  });

  test('preserves location coordinates when location fields do not change', async () => {
    render(<SiteAttributes {...defaultProps} />);

    const nameInput = screen.getByDisplayValue('Test Site');
    const updateButton = screen.getByRole('button', { name: /update site/i });

    fireEvent.change(nameInput, { target: { value: 'Updated Name Only' } });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updateDevice).toHaveBeenCalledWith(
        expect.objectContaining({
          latitude: 40.7128,
          longitude: -74.006,
        }),
      );
    });
  });

  test('sets active site id after successful update', async () => {
    render(<SiteAttributes {...defaultProps} />);

    const updateButton = screen.getByRole('button', { name: /update site/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockSetActiveSiteId).toHaveBeenCalledWith('site-1');
    });
  });

  test('fetches devices after successful update', async () => {
    render(<SiteAttributes {...defaultProps} />);

    const updateButton = screen.getByRole('button', { name: /update site/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(getDevices).toHaveBeenCalled();
    });
  });

  test('updates devices list after successful update', async () => {
    const newDevicesData = [{ id: 'device-1', name: 'Test Device' }];
    getDevices.mockResolvedValue({ data: { devices: newDevicesData } });

    render(<SiteAttributes {...defaultProps} />);

    const updateButton = screen.getByRole('button', { name: /update site/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockSetDevices).toHaveBeenCalledWith(newDevicesData);
    });
  });

  test('handles update error gracefully', async () => {
    updateDevice.mockRejectedValue(new Error('Update failed'));

    render(<SiteAttributes {...defaultProps} />);

    const updateButton = screen.getByRole('button', { name: /update site/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updateDevice).toHaveBeenCalled();
    });

    // Should not call getDevices if update failed
    expect(getDevices).not.toHaveBeenCalled();
    expect(mockSetDevices).not.toHaveBeenCalled();
  });

  test('shows spinner when loading', async () => {
    updateDevice.mockImplementation(() => new Promise(() => {})); // Never resolving promise

    const { container } = render(<SiteAttributes {...defaultProps} />);

    const updateButton = screen.getByRole('button', { name: /update site/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      const spinner = container.querySelector('svg.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  test('disables button when loading', async () => {
    updateDevice.mockImplementation(() => new Promise(() => {})); // Never resolving promise

    render(<SiteAttributes {...defaultProps} />);

    const updateButton = screen.getByRole('button', { name: /update site/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updateButton).toBeDisabled();
    });
  });

  test('submits form when form is submitted', async () => {
    const { container } = render(<SiteAttributes {...defaultProps} />);

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(updateDevice).toHaveBeenCalled();
    });
  });

  test('handles empty location values correctly', async () => {
    const siteWithEmptyLocation = {
      ...mockSiteData,
      city: '',
      state: '',
      country: '',
    };

    render(<SiteAttributes {...defaultProps} data={siteWithEmptyLocation} />);

    const updateButton = screen.getByRole('button', { name: /update site/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updateDevice).toHaveBeenCalledWith(
        expect.objectContaining({
          city: '',
          state: '',
          country: '',
          // Should preserve existing coordinates since location didn't change
          latitude: 40.7128,
          longitude: -74.006,
        }),
      );
    });
  });

  test('renders component with correct styling classes', () => {
    const { container } = render(<SiteAttributes {...defaultProps} />);

    const siteAttributesDiv = container.querySelector('.SiteAttributes');
    expect(siteAttributesDiv).toBeInTheDocument();
    expect(siteAttributesDiv).toHaveClass(
      'mb-4',
      'flex',
      'items-center',
      'rounded-md',
      'bg-white',
      'p-6',
      'dark:bg-gray-700',
    );
  });

  test('clears validation errors when valid input is provided', async () => {
    render(<SiteAttributes {...defaultProps} />);

    const nameInput = screen.getByDisplayValue('Test Site');

    // First trigger validation error
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(screen.getByText('Site name is required')).toBeInTheDocument();
    });

    // Then provide valid input
    fireEvent.change(nameInput, { target: { value: 'Valid Site Name' } });
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(
        screen.queryByText('Site name is required'),
      ).not.toBeInTheDocument();
    });
  });

  test('updates all location fields and resets coordinates', async () => {
    render(<SiteAttributes {...defaultProps} />);

    const cityInput = screen.getByDisplayValue('Test City');
    const stateInput = screen.getByDisplayValue('Test State');
    const countryInput = screen.getByDisplayValue('Test Country');
    const updateButton = screen.getByRole('button', { name: /update site/i });

    fireEvent.change(cityInput, { target: { value: 'New City' } });
    fireEvent.change(stateInput, { target: { value: 'New State' } });
    fireEvent.change(countryInput, { target: { value: 'New Country' } });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updateDevice).toHaveBeenCalledWith(
        expect.objectContaining({
          city: 'New City',
          state: 'New State',
          country: 'New Country',
          latitude: -1,
          longitude: -1,
        }),
      );
    });
  });
});
