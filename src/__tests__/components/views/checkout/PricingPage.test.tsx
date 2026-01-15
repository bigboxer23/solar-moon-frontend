import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import PricingPage from '../../../../components/views/checkout/PricingPage';

// Mock AWS Amplify
vi.mock('@aws-amplify/ui-react', () => ({
  useAuthenticator: vi.fn(),
}));

// Mock services
vi.mock('../../../../services/services', () => ({
  activateTrial: vi.fn(),
  getSubscriptionInformation: vi.fn(),
}));

vi.mock('../../../../services/search', () => ({
  MONTH: 30 * 24 * 60 * 60 * 1000,
}));

// Mock components
vi.mock('../../../../components/nav/HeaderBar', () => {
  const MockHeaderBar = function ({
    headerText,
    leftContent,
  }: {
    headerText: string;
    leftContent?: React.ReactNode;
  }) {
    return (
      <div data-testid='header-bar'>
        <span>{headerText}</span>
        {leftContent}
      </div>
    );
  };
  return { default: MockHeaderBar };
});

vi.mock('../../../../components/views/checkout/PriceTile', () => {
  const MockPriceTile = function ({
    label,
    buttonText,
    checkoutClicked,
    count,
    price: _price,
    priceId,
  }: {
    label: string;
    buttonText?: string;
    checkoutClicked: (priceId: string, count: number) => void;
    count: number;
    price: number;
    priceId: string;
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
  return { default: MockPriceTile };
});

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaArrowLeft: ({
    onClick,
    title,
  }: {
    onClick?: () => void;
    title?: string;
  }) => (
    <span data-testid='arrow-left-icon' onClick={onClick} title={title}>
      ←
    </span>
  ),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  createSearchParams: (params: Record<string, string>) => ({
    toString: () =>
      Object.entries(params)
        .map(([k, v]) => `${k}=${v}`)
        .join('&'),
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('PricingPage', () => {
  import { useAuthenticator } from '@aws-amplify/ui-react';

  import {
    activateTrial,
    getSubscriptionInformation,
  } from '../../../../services/services';

  const mockUser = { username: 'testuser' };
  const mockSignOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
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

    activateTrial.mockResolvedValue({});

    process.env.VITE_PRICE_MO = 'price_monthly_123';
    process.env.VITE_PRICE_YR = 'price_yearly_123';
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
    import { MONTH } from '../../../../services/search';

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
    import { MONTH } from '../../../../services/search';

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
    import { MONTH } from '../../../../services/search';

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
