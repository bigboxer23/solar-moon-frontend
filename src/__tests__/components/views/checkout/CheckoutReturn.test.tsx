import { act, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import CheckoutReturn from '../../../../components/views/checkout/CheckoutReturn';

// Mock services
vi.mock('../../../../services/services', () => ({
  checkoutStatus: vi.fn(),
}));

// Mock components
vi.mock('../../../../components/common/Loader', () => {
  const MockLoader = function () {
    return <div data-testid='loader'>Loading...</div>;
  };
  return { default: MockLoader };
});

// Mock window.location.search
delete (window as { location?: Location }).location;
(window as { location: { search: string } }).location = { search: '' };

const renderWithRouter = (
  component: React.ReactElement,
  initialRoute = '/return',
) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>{component}</MemoryRouter>,
  );
};

describe('CheckoutReturn', () => {
  import { checkoutStatus } from '../../../../services/services';

  beforeEach(() => {
    vi.clearAllMocks();
    window.location.search = '';
    checkoutStatus.mockResolvedValue({
      data: {
        status: 'complete',
        customer_email: 'test@example.com', // eslint-disable-line camelcase
      },
    });
  });

  test('shows loader initially while fetching status', async () => {
    window.location.search = '?session_id=test_session_123';
    checkoutStatus.mockImplementation(() => new Promise(() => {})); // Never resolves

    await act(async () => {
      renderWithRouter(<CheckoutReturn />);
    });

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('calls checkoutStatus with session_id from URL', async () => {
    window.location.search = '?session_id=test_session_123';

    await act(async () => {
      renderWithRouter(<CheckoutReturn />);
    });

    expect(checkoutStatus).toHaveBeenCalledWith('test_session_123');
  });

  test('renders success message when status is complete', async () => {
    window.location.search = '?session_id=test_session_123';

    await act(async () => {
      renderWithRouter(<CheckoutReturn />);
    });

    await waitFor(() => {
      expect(
        screen.getByText(/thank you, we appreciate your business!/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /a confirmation email will be sent to test@example.com/i,
        ),
      ).toBeInTheDocument();
    });
  });

  test('hides loader after successful API call', async () => {
    window.location.search = '?session_id=test_session_123';

    await act(async () => {
      renderWithRouter(<CheckoutReturn />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });

  test('renders email contact link', async () => {
    window.location.search = '?session_id=test_session_123';

    await act(async () => {
      renderWithRouter(<CheckoutReturn />);
    });

    await waitFor(() => {
      const emailLink = screen.getByRole('link', {
        name: /info@solarmoonanalytics.com/i,
      });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute(
        'href',
        'mailto:info@solarmoonanalytics.com',
      );
    });
  });

  test('handles API error gracefully', async () => {
    checkoutStatus.mockRejectedValue(new Error('API Error'));
    window.location.search = '?session_id=test_session_123';

    await act(async () => {
      renderWithRouter(<CheckoutReturn />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      expect(
        screen.queryByText(/thank you, we appreciate your business!/i),
      ).not.toBeInTheDocument();
    });
  });

  test('handles missing session_id parameter', async () => {
    window.location.search = '';

    await act(async () => {
      renderWithRouter(<CheckoutReturn />);
    });

    expect(checkoutStatus).not.toHaveBeenCalled();
  });

  test('applies correct CSS classes to main container', async () => {
    window.location.search = '?session_id=test_session_123';

    let container: HTMLElement;
    await act(async () => {
      const { container: testContainer } = renderWithRouter(<CheckoutReturn />);
      container = testContainer;
    });

    await waitFor(() => {
      const mainContainer = container!.querySelector(
        '.my-8.flex.max-w-full.flex-col.items-center',
      );
      expect(mainContainer).toBeInTheDocument();
    });
  });

  test('applies correct CSS classes to success panel', async () => {
    window.location.search = '?session_id=test_session_123';

    let container: HTMLElement;
    await act(async () => {
      const { container: testContainer } = renderWithRouter(<CheckoutReturn />);
      container = testContainer;
    });

    await waitFor(() => {
      const successPanel = container!.querySelector('main');
      expect(successPanel).toHaveClass(
        'fade-in',
        'my-8',
        'w-[25rem]',
        'max-w-full',
        'rounded-lg',
        'bg-white',
        'p-6',
        'shadow-panel',
        'dark:bg-gray-800',
        'sm:w-[55rem]',
        'sm:p-8',
      );
    });
  });

  test('renders complete message with customer email', async () => {
    window.location.search = '?session_id=test_session_123';
    checkoutStatus.mockResolvedValue({
      data: {
        status: 'complete',
        customer_email: 'customer@test.com', // eslint-disable-line camelcase
      },
    });

    await act(async () => {
      renderWithRouter(<CheckoutReturn />);
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          /a confirmation email will be sent to customer@test.com/i,
        ),
      ).toBeInTheDocument();
    });
  });
});
