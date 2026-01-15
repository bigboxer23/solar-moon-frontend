import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import CustomerInformation from '../../../../components/views/profile/CustomerInformation';
import { updateCustomer } from '../../../../services/services';

// Mock dependencies
vi.mock('../../../../services/services', () => ({
  updateCustomer: vi.fn(),
}));

// Use manual mock from __mocks__ directory
vi.mock('react-timezone-select');

describe('CustomerInformation', () => {
  const mockCustomer = {
    email: 'test@example.com',
    name: 'John Doe',
    defaultTimezone: 'America/New_York',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock Intl.DateTimeFormat for consistent testing
    global.Intl.DateTimeFormat = vi.fn().mockImplementation(() => ({
      resolvedOptions: vi
        .fn()
        .mockReturnValue({ timeZone: 'America/New_York' }),
    }));
  });

  test('renders customer information form with all fields', () => {
    render(<CustomerInformation customer={mockCustomer} />);

    expect(screen.getByText('Customer Information')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Default Timezone')).toBeInTheDocument();
  });

  test('displays customer email and name as read-only', () => {
    render(<CustomerInformation customer={mockCustomer} />);

    const emailInput = screen.getByLabelText('Email Address');
    const nameInput = screen.getByLabelText('Name');

    expect(emailInput).toHaveValue('test@example.com');
    expect(emailInput).toHaveAttribute('readonly');

    expect(nameInput).toHaveValue('John Doe');
    expect(nameInput).toHaveAttribute('readonly');
  });

  test('displays current timezone in dropdown', () => {
    render(<CustomerInformation customer={mockCustomer} />);

    const timezoneSelect = screen.getByLabelText('Default Timezone');
    expect(timezoneSelect).toHaveValue('America/New_York');
  });

  test('handles customer with missing fields gracefully', () => {
    const incompleteCustomer = {
      email: null,
      name: undefined,
      defaultTimezone: null,
    };

    render(<CustomerInformation customer={incompleteCustomer} />);

    const emailInput = screen.getByLabelText('Email Address');
    const nameInput = screen.getByLabelText('Name');

    expect(emailInput).toHaveValue('');
    expect(nameInput).toHaveValue('');
  });

  test('handles undefined customer prop', () => {
    render(<CustomerInformation customer={undefined} />);

    const emailInput = screen.getByLabelText('Email Address');
    const nameInput = screen.getByLabelText('Name');

    expect(emailInput).toHaveValue('');
    expect(nameInput).toHaveValue('');
  });

  test('uses system timezone when customer has no default timezone', () => {
    const customerWithoutTimezone = {
      email: 'test@example.com',
      name: 'John Doe',
      defaultTimezone: null,
    };

    render(<CustomerInformation customer={customerWithoutTimezone} />);

    // Should use system timezone (mocked to America/New_York)
    const timezoneSelect = screen.getByLabelText('Default Timezone');
    expect(timezoneSelect).toHaveValue('America/New_York');
  });

  test('calls updateCustomer when timezone is changed', () => {
    render(<CustomerInformation customer={mockCustomer} />);

    const timezoneSelect = screen.getByLabelText('Default Timezone');

    fireEvent.change(timezoneSelect, { target: { value: 'Europe/London' } });

    expect(updateCustomer).toHaveBeenCalledWith({
      ...mockCustomer,
      defaultTimezone: 'Europe/London',
    });
  });

  test('has correct input field properties', () => {
    render(<CustomerInformation customer={mockCustomer} />);

    const emailInput = screen.getByLabelText('Email Address');
    const nameInput = screen.getByLabelText('Name');

    // Check if inputs exist and have readonly attribute
    expect(emailInput).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('readonly');
    expect(nameInput).toHaveAttribute('readonly');
  });

  test('applies correct CSS classes and styling', () => {
    const { container } = render(
      <CustomerInformation customer={mockCustomer} />,
    );

    const mainContainer = container.querySelector('.fade-in');
    expect(mainContainer).toHaveClass(
      'fade-in',
      'my-8',
      'w-[40rem]',
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
