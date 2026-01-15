import { act, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import CheckoutForm from '../../../../components/views/checkout/CheckoutForm';

// Mock Stripe components
vi.mock('@stripe/react-stripe-js', () => ({
  EmbeddedCheckout: () => (
    <div data-testid='embedded-checkout'>Embedded Checkout</div>
  ),
  EmbeddedCheckoutProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='embedded-checkout-provider'>{children}</div>
  ),
}));

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({ mockStripe: true })),
}));

// Mock services
vi.mock('../../../../services/services', () => ({
  checkout: vi.fn(),
}));

// Mock components
vi.mock('../../../../components/common/Loader', () => {
  const MockLoader = function ({ className }: { className?: string }) {
    return (
      <div className={className} data-testid='loader'>
        Loading...
      </div>
    );
  };
  return { default: MockLoader };
});

vi.mock('../../../../components/nav/HeaderBar', () => {
  const MockHeaderBar = function ({ headerText }: { headerText: string }) {
    return <div data-testid='header-bar'>{headerText}</div>;
  };
  return { default: MockHeaderBar };
});

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaArrowLeft: () => <span data-testid='arrow-left-icon'>←</span>,
}));

const renderWithRouter = (
  component: React.ReactElement,
  initialRoute = '/checkout?price=plan1&count=1',
) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>{component}</MemoryRouter>,
  );
};

describe('CheckoutForm', () => {
  import { checkout } from '../../../../services/services';

  beforeEach(() => {
    vi.clearAllMocks();
    checkout.mockResolvedValue({
      data: {
        clientSecret: 'test-client-secret',
      },
    });
  });

  test('renders header bar with correct text', () => {
    renderWithRouter(<CheckoutForm />);

    expect(screen.getByTestId('header-bar')).toHaveTextContent(
      'Enter payment details',
    );
  });

  test('renders back to plans link', () => {
    renderWithRouter(<CheckoutForm />);

    const backLink = screen.getByRole('link', { name: /back to plans/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/pricing');
  });

  test('shows loader initially while fetching checkout session', async () => {
    checkout.mockImplementation(() => new Promise(() => {})); // Never resolves

    await act(async () => {
      renderWithRouter(<CheckoutForm />);
    });

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('calls checkout service with price and count from URL params', async () => {
    await act(async () => {
      renderWithRouter(<CheckoutForm />, '/checkout?price=premium&count=5');
    });

    expect(checkout).toHaveBeenCalledWith('premium', 5);
  });

  test('renders embedded checkout after successful API call', async () => {
    await act(async () => {
      renderWithRouter(<CheckoutForm />);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('embedded-checkout-provider'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('embedded-checkout')).toBeInTheDocument();
    });
  });

  test('hides loader after successful API call', async () => {
    await act(async () => {
      renderWithRouter(<CheckoutForm />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });

  test('handles checkout API error gracefully', async () => {
    checkout.mockRejectedValue(new Error('API Error'));

    await act(async () => {
      renderWithRouter(<CheckoutForm />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });

  test('renders arrow icon in back link', async () => {
    await act(async () => {
      renderWithRouter(<CheckoutForm />);
    });

    expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
  });

  test('handles missing URL parameters gracefully', async () => {
    await act(async () => {
      renderWithRouter(<CheckoutForm />, '/checkout');
    });

    expect(checkout).toHaveBeenCalledWith(null, 0);
  });

  test('applies correct CSS classes to main container', async () => {
    let container: HTMLElement;
    await act(async () => {
      const { container: testContainer } = renderWithRouter(<CheckoutForm />);
      container = testContainer;
    });

    const main = container!.querySelector('main');
    expect(main).toHaveClass('flex', 'w-full', 'flex-col', 'py-8');
  });

  test('applies correct CSS classes to back link container', async () => {
    let container: HTMLElement;
    await act(async () => {
      const { container: testContainer } = renderWithRouter(<CheckoutForm />);
      container = testContainer;
    });

    const linkContainer = container!.querySelector('.fade-in');
    expect(linkContainer).toHaveClass(
      'fade-in',
      'ml-6',
      'flex',
      'w-[55rem]',
      'max-w-full',
      'flex-col',
      'dark:bg-gray-800',
      'sm:ml-8',
      'sm:rounded-lg',
    );
  });
});
