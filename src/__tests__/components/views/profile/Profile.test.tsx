import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import Profile from '../../../../components/views/profile/Profile';
import {
  getCustomer,
  getSubscriptionInformation,
} from '../../../../services/services';

// Mock dependencies
vi.mock('../../../../services/services', () => ({
  getCustomer: vi.fn(),
  getSubscriptionInformation: vi.fn(),
}));

// Mock child components
vi.mock('../../../../components/views/profile/CustomerInformation', () => {
  const MockCustomerInformation = function ({ customer }) {
    return (
      <div data-testid='customer-information'>
        Customer Info for {customer?.email || 'unknown'}
      </div>
    );
  };
  return { default: MockCustomerInformation };
});

vi.mock('../../../../components/views/profile/Appearance', () => {
  const MockAppearance = function () {
    return <div data-testid='appearance'>Appearance Settings</div>;
  };
  return { default: MockAppearance };
});

vi.mock('../../../../components/views/profile/ManagePlanTile', () => {
  const MockManagePlanTile = function () {
    return <div data-testid='manage-plan-tile'>Manage Plan</div>;
  };
  return { default: MockManagePlanTile };
});

vi.mock('../../../../components/views/profile/APIInformation', () => {
  const MockAPIInformation = function ({ customerData }) {
    return (
      <div data-testid='api-information'>
        API Info for {customerData?.email || 'unknown'}
      </div>
    );
  };
  return { default: MockAPIInformation };
});

vi.mock('../../../../components/views/profile/ChangePassword', () => {
  const MockChangePassword = function () {
    return <div data-testid='change-password'>Change Password</div>;
  };
  return { default: MockChangePassword };
});

vi.mock('../../../../components/views/profile/DeleteAccount', () => {
  const MockDeleteAccount = function () {
    return <div data-testid='delete-account'>Delete Account</div>;
  };
  return { default: MockDeleteAccount };
});

describe('Profile', () => {
  const mockSetTrialDate = vi.fn();
  const mockCustomerData = {
    email: 'test@example.com',
    name: 'Test User',
    customerId: '12345',
  };
  const mockSubscriptionInfo = {
    joinDate: '2023-01-01',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('shows loading state initially', () => {
    getCustomer.mockReturnValue(new Promise(() => {})); // Never resolves
    getSubscriptionInformation.mockResolvedValue({
      data: mockSubscriptionInfo,
    });

    render(<Profile setTrialDate={mockSetTrialDate} />);

    // Should show loader while loading
    const loaderContainer = document.querySelector('.Loader');
    expect(loaderContainer).toBeInTheDocument();
  });

  test('renders all profile sections when loaded', async () => {
    getCustomer.mockResolvedValue({ data: mockCustomerData });
    getSubscriptionInformation.mockResolvedValue({
      data: mockSubscriptionInfo,
    });

    render(<Profile setTrialDate={mockSetTrialDate} />);

    await waitFor(() => {
      expect(screen.getByTestId('customer-information')).toBeInTheDocument();
    });

    expect(screen.getByTestId('appearance')).toBeInTheDocument();
    expect(screen.getByTestId('manage-plan-tile')).toBeInTheDocument();
    expect(screen.getByTestId('api-information')).toBeInTheDocument();
    expect(screen.getByTestId('change-password')).toBeInTheDocument();
    expect(screen.getByTestId('delete-account')).toBeInTheDocument();
  });

  test('passes customer data to child components', async () => {
    getCustomer.mockResolvedValue({ data: mockCustomerData });
    getSubscriptionInformation.mockResolvedValue({
      data: mockSubscriptionInfo,
    });

    render(<Profile setTrialDate={mockSetTrialDate} />);

    await waitFor(() => {
      expect(
        screen.getByText('Customer Info for test@example.com'),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText('API Info for test@example.com'),
    ).toBeInTheDocument();
    expect(screen.getByText('Delete Account')).toBeInTheDocument();
  });

  test('sets trial date from subscription information', async () => {
    getCustomer.mockResolvedValue({ data: mockCustomerData });
    getSubscriptionInformation.mockResolvedValue({
      data: mockSubscriptionInfo,
    });

    render(<Profile setTrialDate={mockSetTrialDate} />);

    await waitFor(() => {
      expect(getSubscriptionInformation).toHaveBeenCalled();
    });

    expect(mockSetTrialDate).toHaveBeenCalledWith('2023-01-01');
  });

  test('handles customer data loading error gracefully', async () => {
    getCustomer.mockRejectedValue(new Error('Failed to load customer'));
    getSubscriptionInformation.mockResolvedValue({
      data: mockSubscriptionInfo,
    });

    render(<Profile setTrialDate={mockSetTrialDate} />);

    await waitFor(() => {
      // Should stop loading even on error
      const loaderContainer = document.querySelector('.Loader');
      expect(loaderContainer).not.toBeInTheDocument();
    });

    // Should still render components with undefined customer data
    expect(screen.getByTestId('customer-information')).toBeInTheDocument();
    expect(screen.getByText('Customer Info for unknown')).toBeInTheDocument();
  });

  test('renders components in correct order', async () => {
    getCustomer.mockResolvedValue({ data: mockCustomerData });
    getSubscriptionInformation.mockResolvedValue({
      data: mockSubscriptionInfo,
    });

    const { container } = render(<Profile setTrialDate={mockSetTrialDate} />);

    await waitFor(() => {
      expect(screen.getByTestId('customer-information')).toBeInTheDocument();
    });

    const components = container.querySelectorAll('[data-testid]');
    expect(components[0]).toHaveAttribute(
      'data-testid',
      'customer-information',
    );
    expect(components[1]).toHaveAttribute('data-testid', 'appearance');
    expect(components[2]).toHaveAttribute('data-testid', 'manage-plan-tile');
    expect(components[3]).toHaveAttribute('data-testid', 'api-information');
    expect(components[4]).toHaveAttribute('data-testid', 'change-password');
    expect(components[5]).toHaveAttribute('data-testid', 'delete-account');
  });

  test('applies correct main container styling', async () => {
    getCustomer.mockResolvedValue({ data: mockCustomerData });
    getSubscriptionInformation.mockResolvedValue({
      data: mockSubscriptionInfo,
    });

    const { container } = render(<Profile setTrialDate={mockSetTrialDate} />);

    await waitFor(() => {
      expect(screen.getByTestId('customer-information')).toBeInTheDocument();
    });

    const mainContainer = container.querySelector('main');
    expect(mainContainer).toHaveClass(
      'flex',
      'max-w-full',
      'flex-col',
      'items-center',
    );

    const contentContainer = mainContainer.querySelector('div');
    expect(contentContainer).toHaveClass('max-w-full');
  });

  test('calls both service functions on mount', async () => {
    getCustomer.mockResolvedValue({ data: mockCustomerData });
    getSubscriptionInformation.mockResolvedValue({
      data: mockSubscriptionInfo,
    });

    render(<Profile setTrialDate={mockSetTrialDate} />);

    expect(getCustomer).toHaveBeenCalled();
    expect(getSubscriptionInformation).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByTestId('customer-information')).toBeInTheDocument();
    });
  });
});
