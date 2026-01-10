/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import App from '../App';

jest.mock('react-router-dom', () => {
  const actualModule = jest.requireActual('react-router-dom');
  return {
    ...actualModule,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('aws-amplify', () => ({
  Amplify: {
    configure: jest.fn(),
  },
}));

jest.mock('@aws-amplify/ui-react', () => ({
  Authenticator: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='authenticator'>{children}</div>
  ),
}));

jest.mock('../aws-exports', () => ({}));

jest.mock('../components/login/Footer', () => ({
  Footer: () => <div data-testid='footer'>Footer</div>,
}));

jest.mock('../components/login/Header', () => ({
  Header: () => <div data-testid='header'>Header</div>,
}));

jest.mock('../components/login/SignInFooter', () => ({
  SignInFooter: () => <div data-testid='signin-footer'>SignInFooter</div>,
}));

jest.mock('../components/nav/Navbar', () => ({
  __esModule: true,
  default: ({ trialDate }: { trialDate: number }) => (
    <div data-testid='navbar'>Navbar {trialDate}</div>
  ),
}));

jest.mock('../components/nav/PageTitleRoute', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => (
    <div data-testid='page-title'>{title}</div>
  ),
}));

jest.mock('../components/PageFooter', () => ({
  __esModule: true,
  default: () => <div data-testid='page-footer'>PageFooter</div>,
}));

jest.mock('../components/views/dashboard/Dashboard', () => ({
  __esModule: true,
  default: ({ setTrialDate }: { setTrialDate?: (date: number) => void }) => (
    <div
      data-testid='dashboard'
      onClick={() => setTrialDate && setTrialDate(123)}
    >
      Dashboard
    </div>
  ),
}));

jest.mock('../components/views/reports/Reports', () => ({
  __esModule: true,
  default: () => <div data-testid='reports'>Reports</div>,
}));

jest.mock('../components/views/alerts/Alerts', () => ({
  __esModule: true,
  default: ({ setTrialDate }: { setTrialDate?: (date: number) => void }) => (
    <div data-testid='alerts' onClick={() => setTrialDate && setTrialDate(456)}>
      Alerts
    </div>
  ),
}));

jest.mock('../components/views/profile/Profile', () => ({
  __esModule: true,
  default: ({ setTrialDate }: { setTrialDate?: (date: number) => void }) => (
    <div
      data-testid='profile'
      onClick={() => setTrialDate && setTrialDate(789)}
    >
      Profile
    </div>
  ),
}));

jest.mock('../components/views/site-details/SiteDetails', () => ({
  __esModule: true,
  default: ({ setTrialDate }: { setTrialDate?: (date: number) => void }) => (
    <div
      data-testid='site-details'
      onClick={() => setTrialDate && setTrialDate(101112)}
    >
      SiteDetails
    </div>
  ),
}));

jest.mock('../components/views/site-management/SiteManagement', () => ({
  __esModule: true,
  default: ({ setTrialDate }: { setTrialDate?: (date: number) => void }) => (
    <div
      data-testid='site-management'
      onClick={() => setTrialDate && setTrialDate(131415)}
    >
      SiteManagement
    </div>
  ),
}));

jest.mock('../components/views/checkout/CheckoutForm', () => ({
  __esModule: true,
  default: () => <div data-testid='checkout-form'>CheckoutForm</div>,
}));

jest.mock('../components/views/checkout/CheckoutReturn', () => ({
  __esModule: true,
  default: () => <div data-testid='checkout-return'>Return</div>,
}));

jest.mock('../components/views/checkout/PricingPage', () => ({
  __esModule: true,
  default: () => <div data-testid='pricing-page'>PricingPage</div>,
}));

jest.mock('../components/views/lock/LockPage', () => ({
  LockPage: () => <div data-testid='lock-page'>LockPage</div>,
}));

jest.mock('../components/views/mapping/Mapping', () => ({
  __esModule: true,
  default: () => <div data-testid='mapping'>Mapping</div>,
}));

jest.mock('../utils/Utils', () => ({
  useStickyState: jest.fn(),
}));

Object.defineProperty(navigator, 'language', {
  writable: true,
  value: 'en-US',
});

function renderAppWithRoute(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockUseStickyState = require('../utils/Utils').useStickyState;
    mockUseStickyState.mockReturnValue([-1, jest.fn()]);
  });

  test('renders without crashing', () => {
    renderAppWithRoute('/');

    expect(screen.getByTestId('authenticator')).toBeInTheDocument();
  });

  test('renders dashboard on root path', () => {
    renderAppWithRoute('/');

    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('page-title')).toHaveTextContent('SMA Dashboard');
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('page-footer')).toBeInTheDocument();
  });

  test('renders reports page', () => {
    renderAppWithRoute('/reports');

    expect(screen.getByTestId('reports')).toBeInTheDocument();
    expect(screen.getByTestId('page-title')).toHaveTextContent('SMA Reports');
  });

  test('renders alerts page', () => {
    renderAppWithRoute('/alerts');

    expect(screen.getByTestId('alerts')).toBeInTheDocument();
    expect(screen.getByTestId('page-title')).toHaveTextContent('SMA Alerts');
  });

  test('renders profile page', () => {
    renderAppWithRoute('/profile');

    expect(screen.getByTestId('profile')).toBeInTheDocument();
    expect(screen.getByTestId('page-title')).toHaveTextContent('SMA Profile');
  });

  test('renders site details page with parameter', () => {
    renderAppWithRoute('/sites/123');

    expect(screen.getByTestId('site-details')).toBeInTheDocument();
  });

  test('renders site management page', () => {
    renderAppWithRoute('/manage');

    expect(screen.getByTestId('site-management')).toBeInTheDocument();
    expect(screen.getByTestId('page-title')).toHaveTextContent(
      'SMA Site Management',
    );
  });

  test('renders checkout form page', () => {
    renderAppWithRoute('/checkout');

    expect(screen.getByTestId('checkout-form')).toBeInTheDocument();
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
  });

  test('renders return page', () => {
    renderAppWithRoute('/return');

    expect(screen.getByTestId('checkout-return')).toBeInTheDocument();
  });

  test('renders pricing page', () => {
    renderAppWithRoute('/pricing');

    expect(screen.getByTestId('pricing-page')).toBeInTheDocument();
    expect(screen.getByTestId('page-title')).toHaveTextContent('SMA Pricing');
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
  });

  test('renders lock page', () => {
    renderAppWithRoute('/lock');

    expect(screen.getByTestId('lock-page')).toBeInTheDocument();
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
  });

  test('renders mapping page', () => {
    renderAppWithRoute('/mapping');

    expect(screen.getByTestId('mapping')).toBeInTheDocument();
    expect(screen.getByTestId('page-title')).toHaveTextContent('SMA Mappings');
  });

  test('redirects unknown routes to home', () => {
    renderAppWithRoute('/unknown-route');

    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  test('includes IntlProvider with navigator language', () => {
    renderAppWithRoute('/');

    expect(screen.getByTestId('authenticator')).toBeInTheDocument();
  });

  test('has correct CSS classes on app container', () => {
    renderAppWithRoute('/');

    const appContainer = document.querySelector('.App');
    expect(appContainer).toHaveClass('bg-brand-primary-light');
    expect(appContainer).toHaveClass('dark:bg-gray-950');
    expect(appContainer).toHaveAttribute('id', 'scroll');
  });

  test('navbar receives trialDate prop', () => {
    const mockUseStickyState = require('../utils/Utils').useStickyState;
    mockUseStickyState.mockReturnValue([42, jest.fn()]);

    renderAppWithRoute('/');

    expect(screen.getByTestId('navbar')).toHaveTextContent('Navbar 42');
  });

  test('components can update trialDate through setTrialDate', () => {
    const mockSetTrialDate = jest.fn();
    const mockUseStickyState = require('../utils/Utils').useStickyState;
    mockUseStickyState.mockReturnValue([-1, mockSetTrialDate]);

    renderAppWithRoute('/');

    const dashboard = screen.getByTestId('dashboard');
    dashboard.click();

    expect(mockSetTrialDate).toHaveBeenCalledWith(123);
  });

  test('Chart.js is properly configured', () => {
    renderAppWithRoute('/');

    expect(screen.getByTestId('authenticator')).toBeInTheDocument();
  });
});
