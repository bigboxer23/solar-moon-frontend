import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import ManagePlanTile from '../../../../components/views/profile/ManagePlanTile';
import {
  getStripeSubscriptions,
  getSubscriptionInformation,
  getUserPortalSession,
} from '../../../../services/services';
import { getDaysLeftInTrial } from '../../../../utils/Utils';

// Mock dependencies
vi.mock('../../../../services/services', () => ({
  getStripeSubscriptions: vi.fn(),
  getSubscriptionInformation: vi.fn(),
  getUserPortalSession: vi.fn(),
}));

vi.mock('../../../../utils/Utils', () => ({
  getDaysLeftInTrial: vi.fn(),
}));

vi.mock('react-icons/md', () => ({
  MdOutlineSubscriptions: () => <svg data-testid='subscription-icon' />,
}));

// Mock window location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
  },
  writable: true,
});

describe('ManagePlanTile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.location.href = '';
  });

  test('shows loading state initially', () => {
    getStripeSubscriptions.mockReturnValue(new Promise(() => {})); // Never resolves

    render(<ManagePlanTile />);

    expect(screen.getByText('Billing Information')).toBeInTheDocument();
    // Loader should be visible while loading - check for loader container
    const loaderContainer = document.querySelector('.Loader');
    expect(loaderContainer).toBeInTheDocument();
  });

  test('displays subscription information for monthly plan', async () => {
    const mockSubscription = {
      quantity: 2,
      interval: 'month',
    };

    getStripeSubscriptions.mockResolvedValue({
      data: [mockSubscription],
    });

    render(<ManagePlanTile />);

    await waitFor(() => {
      expect(screen.getByText('Monthly')).toBeInTheDocument();
    });

    expect(screen.getByText('40')).toBeInTheDocument(); // 20 * 2 devices
    expect(screen.getByText('devices')).toBeInTheDocument();
    expect(screen.getByText('$80')).toBeInTheDocument(); // $40 * 2 quantity
    expect(screen.getByText('per mo')).toBeInTheDocument();
    expect(
      screen.getByText('2 Seats, $40 per seat per mo'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /manage/i })).toBeInTheDocument();
  });

  test('displays subscription information for yearly plan', async () => {
    const mockSubscription = {
      quantity: 1,
      interval: 'year',
    };

    getStripeSubscriptions.mockResolvedValue({
      data: [mockSubscription],
    });

    render(<ManagePlanTile />);

    await waitFor(() => {
      expect(screen.getByText('Yearly')).toBeInTheDocument();
    });

    expect(screen.getByText('20')).toBeInTheDocument(); // 20 * 1 devices
    expect(screen.getByText('$432')).toBeInTheDocument(); // $432 * 1 quantity
    expect(screen.getByText('per yr')).toBeInTheDocument();
    expect(
      screen.getByText('1 Seats, $432 per seat per yr'),
    ).toBeInTheDocument();
  });

  test('displays trial mode when no subscription exists', async () => {
    const mockTrialInfo = {
      packs: -1,
      joinDate: '2023-01-01',
    };

    getStripeSubscriptions.mockResolvedValue({ data: [] });
    getSubscriptionInformation.mockResolvedValue({ data: mockTrialInfo });
    getDaysLeftInTrial.mockReturnValue(15);

    render(<ManagePlanTile />);

    await waitFor(() => {
      expect(screen.getByText('Trial Mode')).toBeInTheDocument();
    });

    expect(screen.getByText('10')).toBeInTheDocument(); // devices in trial
    expect(screen.getByText('15')).toBeInTheDocument(); // days left
    expect(
      screen.getByRole('button', { name: /change subscription/i }),
    ).toBeInTheDocument();
  });

  test('displays invalid state when subscription is invalid', async () => {
    const mockInvalidInfo = {
      packs: 5, // Not -1, so invalid
    };

    getStripeSubscriptions.mockResolvedValue({ data: [] });
    getSubscriptionInformation.mockResolvedValue({ data: mockInvalidInfo });

    render(<ManagePlanTile />);

    await waitFor(() => {
      expect(screen.getByText('No Active Plan')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /manage/i })).toBeInTheDocument();
  });

  test('handles manage button click for active subscription', async () => {
    const mockPortalUrl = 'https://billing.stripe.com/session/123';

    getStripeSubscriptions.mockResolvedValue({
      data: [{ quantity: 1, interval: 'month' }],
    });
    getUserPortalSession.mockResolvedValue({ data: { url: mockPortalUrl } });

    render(<ManagePlanTile />);

    await waitFor(() => {
      expect(screen.getByText('Monthly')).toBeInTheDocument();
    });

    const manageButton = screen.getByRole('button', { name: /manage/i });
    manageButton.click();

    await waitFor(() => {
      expect(getUserPortalSession).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(window.location.href).toBe(mockPortalUrl);
    });
  });

  test('handles portal session error gracefully', async () => {
    getStripeSubscriptions.mockResolvedValue({
      data: [{ quantity: 1, interval: 'month' }],
    });
    getUserPortalSession.mockRejectedValue(new Error('Portal error'));

    render(<ManagePlanTile />);

    await waitFor(() => {
      expect(screen.getByText('Monthly')).toBeInTheDocument();
    });

    const manageButton = screen.getByRole('button', { name: /manage/i });
    manageButton.click();

    await waitFor(() => {
      expect(getUserPortalSession).toHaveBeenCalled();
    });

    // Button should not be disabled after error
    expect(manageButton).not.toBeDisabled();
  });

  test('disables manage button while loading portal session', async () => {
    getStripeSubscriptions.mockResolvedValue({
      data: [{ quantity: 1, interval: 'month' }],
    });
    getUserPortalSession.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<ManagePlanTile />);

    await waitFor(() => {
      expect(screen.getByText('Monthly')).toBeInTheDocument();
    });

    const manageButton = screen.getByRole('button', { name: /manage/i });
    manageButton.click();

    await waitFor(() => {
      expect(manageButton).toBeDisabled();
    });

    // Check that spinner is shown instead of subscription icon
    expect(screen.queryByTestId('subscription-icon')).not.toBeInTheDocument();
  });

  test('redirects to pricing for trial mode', async () => {
    getStripeSubscriptions.mockResolvedValue({ data: [] });
    getSubscriptionInformation.mockResolvedValue({
      data: { packs: -1, joinDate: '2023-01-01' },
    });
    getDaysLeftInTrial.mockReturnValue(15);

    render(<ManagePlanTile />);

    await waitFor(() => {
      expect(screen.getByText('Trial Mode')).toBeInTheDocument();
    });

    const subscriptionButton = screen.getByRole('button', {
      name: /change subscription/i,
    });
    subscriptionButton.click();

    expect(window.location.href).toBe('/pricing');
  });

  test('redirects to pricing for invalid plan', async () => {
    getStripeSubscriptions.mockResolvedValue({ data: [] });
    getSubscriptionInformation.mockResolvedValue({
      data: { packs: 5 },
    });

    render(<ManagePlanTile />);

    await waitFor(() => {
      expect(screen.getByText('No Active Plan')).toBeInTheDocument();
    });

    const manageButton = screen.getByRole('button', { name: /manage/i });
    manageButton.click();

    expect(window.location.href).toBe('/pricing');
  });

  test('applies correct CSS classes and styling', async () => {
    getStripeSubscriptions.mockResolvedValue({
      data: [{ quantity: 1, interval: 'month' }],
    });

    const { container } = render(<ManagePlanTile />);

    await waitFor(() => {
      expect(screen.getByText('Monthly')).toBeInTheDocument();
    });

    const mainContainer = container.querySelector('.price');
    expect(mainContainer).toHaveClass(
      'price',
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
