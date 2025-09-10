/* eslint-env jest */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import PricingPage from '../../../../components/views/checkout/PricingPage';

// Mock AWS Amplify
jest.mock('@aws-amplify/ui-react', () => ({
  useAuthenticator: jest.fn(),
}));

// Mock services
jest.mock('../../../../services/services', () => ({
  activateTrial: jest.fn(),
  getSubscriptionInformation: jest.fn(),
}));

jest.mock('../../../../services/search', () => ({
  MONTH: 30 * 24 * 60 * 60 * 1000,
}));

// Mock components
jest.mock('../../../../components/nav/HeaderBar', () => {
  return function MockHeaderBar({ headerText, leftContent }) {
    return (
      <div data-testid='header-bar'>
        <span>{headerText}</span>
        {leftContent}
      </div>
    );
  };
});

jest.mock('../../../../components/views/checkout/PriceTile', () => {
  return function MockPriceTile({
    label,
    buttonText,
    checkoutClicked,
    count,
    price,
    priceId,
  }) {
    return (
      <div data-label={label} data-testid={`price-tile-${label.toLowerCase()}`}>
        <span>{label}</span>
        <button
          data-testid={`${label.toLowerCase()}-button`}
          onClick={() => checkoutClicked(priceId, count)}
        >
          {buttonText || 'Choose plan'}
        </button>
      </div>
    );
  };
});

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaArrowLeft: ({ onClick, title }) => (
    <span data-testid='arrow-left-icon' onClick={onClick} title={title}>
      ←
    </span>
  ),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  createSearchParams: (params) => ({
    toString: () =>
      Object.entries(params)
        .map(([k, v]) => `${k}=${v}`)
        .join('&'),
  }),
}));

const renderWithRouter = (component) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('PricingPage', () => {
  const { useAuthenticator } = require('@aws-amplify/ui-react');
  const {
    activateTrial,
    getSubscriptionInformation,
  } = require('../../../../services/services');

  const mockUser = { username: 'testuser' };
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();

    useAuthenticator.mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });

    getSubscriptionInformation.mockResolvedValue({
      data: {
        packs: 1,
        joinDate: new Date().getTime() - 1000 * 60 * 60 * 24,
      },
    });

    activateTrial.mockResolvedValue();

    process.env.REACT_APP_PRICE_MO = 'price_monthly_123';
    process.env.REACT_APP_PRICE_YR = 'price_yearly_123';
  });

  test('renders header bar with correct text', () => {
    renderWithRouter(<PricingPage />);

    expect(screen.getByTestId('header-bar')).toBeInTheDocument();
    expect(screen.getByText('Choose a billing plan')).toBeInTheDocument();
  });

  test('renders monthly and yearly pricing tiles', () => {
    renderWithRouter(<PricingPage />);

    expect(screen.getByTestId('price-tile-monthly')).toBeInTheDocument();
    expect(screen.getByTestId('price-tile-yearly')).toBeInTheDocument();
  });

  test('handles checkout click for monthly plan', () => {
    renderWithRouter(<PricingPage />);

    const monthlyButton = screen.getByTestId('monthly-button');
    fireEvent.click(monthlyButton);

    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/checkout',
      search: 'price=price_monthly_123&count=1',
    });
  });

  test('handles checkout click for yearly plan', () => {
    renderWithRouter(<PricingPage />);

    const yearlyButton = screen.getByTestId('yearly-button');
    fireEvent.click(yearlyButton);

    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/checkout',
      search: 'price=price_yearly_123&count=1',
    });
  });

  test('handles sign out click', () => {
    renderWithRouter(<PricingPage />);

    const signOutButton = screen.getByTestId('arrow-left-icon');
    fireEvent.click(signOutButton);

    expect(mockSignOut).toHaveBeenCalled();
  });

  test('renders plans features list', () => {
    renderWithRouter(<PricingPage />);

    expect(screen.getByText('Plans include')).toBeInTheDocument();
    expect(screen.getByText('Up to 20 devices per seat')).toBeInTheDocument();
    expect(screen.getByText('Live data reporting')).toBeInTheDocument();
  });

  test('renders trial features list', () => {
    renderWithRouter(<PricingPage />);

    expect(screen.getByText('Trial include')).toBeInTheDocument();
    expect(
      screen.getByText('All features from paid plans'),
    ).toBeInTheDocument();
    expect(screen.getByText('Up to 10 devices')).toBeInTheDocument();
  });

  test('renders trial tile when trial is available', async () => {
    const { MONTH } = require('../../../../services/search');
    getSubscriptionInformation.mockResolvedValue({
      data: {
        packs: 0,
        joinDate: new Date().getTime() - MONTH,
      },
    });

    renderWithRouter(<PricingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('price-tile-trial')).toBeInTheDocument();
    });
  });

  test('does not render trial tile when trial is not available', async () => {
    renderWithRouter(<PricingPage />);

    await waitFor(() => {
      expect(screen.queryByTestId('price-tile-trial')).not.toBeInTheDocument();
    });
  });

  test('renders trial over message when trial is over', async () => {
    const { MONTH } = require('../../../../services/search');
    getSubscriptionInformation.mockResolvedValue({
      data: {
        packs: -1,
        joinDate: new Date().getTime() - MONTH * 4,
      },
    });

    renderWithRouter(<PricingPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/thank you for trialing solar moon analytics/i),
      ).toBeInTheDocument();
    });
  });

  test('handles trial click', async () => {
    const { MONTH } = require('../../../../services/search');
    getSubscriptionInformation.mockResolvedValue({
      data: {
        packs: 0,
        joinDate: new Date().getTime() - MONTH,
      },
    });

    renderWithRouter(<PricingPage />);

    await waitFor(() => {
      const trialButton = screen.getByTestId('trial-button');
      fireEvent.click(trialButton);
    });

    expect(activateTrial).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/manage');
    });
  });
});
