/* eslint-env jest */
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import Navbar from '../../../components/nav/Navbar';
import * as utils from '../../../utils/Utils';

// Mock the external dependencies
jest.mock('@aws-amplify/ui-react', () => ({
  useAuthenticator: jest.fn(),
}));

jest.mock('usehooks-ts', () => ({
  useOnClickOutside: jest.fn(),
}));

jest.mock('../../../utils/Utils', () => ({
  getDaysLeftInTrial: jest.fn(),
  useStickyState: jest.fn(),
}));

// Mock ProfileMenu component
jest.mock('../../../components/nav/ProfileMenu', () => {
  return function MockProfileMenu({ trialDate }) {
    return (
      <div data-testid='profile-menu'>
        Profile Menu - Trial Date: {trialDate}
      </div>
    );
  };
});

const renderWithRouter = (component, initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>{component}</MemoryRouter>,
  );
};

describe('Navbar', () => {
  const mockUser = { username: 'testuser' };
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useAuthenticator
    useAuthenticator.mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });

    // Mock getDaysLeftInTrial
    utils.getDaysLeftInTrial.mockReturnValue('5 days left');

    // Mock useStickyState
    utils.useStickyState.mockReturnValue(['', jest.fn()]);
  });

  describe('Desktop Navigation', () => {
    test('renders brand logo with link to home', () => {
      renderWithRouter(<Navbar trialDate={30} />);

      const logoLink = screen.getByRole('link', { name: /brand/i });
      expect(logoLink).toHaveAttribute('href', '/');

      const logo = screen.getByAltText('brand');
      expect(logo).toBeInTheDocument();
    });

    test('renders all navigation links on desktop', () => {
      renderWithRouter(<Navbar trialDate={30} />);

      // Check main navigation links - use getAllByRole since there are duplicates (desktop + mobile)
      const dashboardLinks = screen.getAllByRole('link', { name: 'Dashboard' });
      const reportsLinks = screen.getAllByRole('link', { name: 'Reports' });
      const alertsLinks = screen.getAllByRole('link', { name: 'Alerts' });
      const manageLinks = screen.getAllByRole('link', { name: 'Manage' });

      // Desktop links (first in array)
      expect(dashboardLinks[0]).toHaveAttribute('href', '/');
      expect(reportsLinks[0]).toHaveAttribute('href', '/reports');
      expect(alertsLinks[0]).toHaveAttribute('href', '/alerts');
      expect(manageLinks[0]).toHaveAttribute('href', '/manage');
    });

    test('applies active link styling for current route', () => {
      renderWithRouter(<Navbar trialDate={30} />, '/reports');

      const reportsLinks = screen.getAllByRole('link', { name: 'Reports' });
      const [desktopReportsLink] = reportsLinks; // Desktop link
      expect(desktopReportsLink).toHaveClass('border-b-2');
    });

    test('renders ProfileMenu component', () => {
      renderWithRouter(<Navbar trialDate={30} />);

      expect(screen.getByTestId('profile-menu')).toBeInTheDocument();
      expect(screen.getByTestId('profile-menu')).toHaveTextContent(
        'Trial Date: 30',
      );
    });
  });

  describe('Mobile Navigation', () => {
    test('displays current page name on mobile', () => {
      renderWithRouter(<Navbar trialDate={30} />, '/reports');

      // Look for the mobile page name span (there will be multiple "Reports" text)
      const pageNameSpans = screen.getAllByText('Reports');
      // The mobile page name should be in a span with specific classes
      const mobilePageName = pageNameSpans.find(
        (element) =>
          element.classList.contains('text-xl') &&
          element.classList.contains('font-bold'),
      );
      expect(mobilePageName).toBeInTheDocument();
    });

    test('renders hamburger menu button on mobile', () => {
      renderWithRouter(<Navbar trialDate={30} />);

      // Look for the hamburger button container instead of specific icon class
      const hamburgerContainer = document.querySelector(
        '.mr-6.flex.items-center.justify-center',
      );
      expect(hamburgerContainer).toBeInTheDocument();

      // Check for SVG element (React icons render as SVG)
      const hamburgerIcon = hamburgerContainer.querySelector('svg');
      expect(hamburgerIcon).toBeInTheDocument();
    });

    test('opens slide menu when hamburger is clicked', () => {
      renderWithRouter(<Navbar trialDate={30} />);

      const hamburgerContainer = document.querySelector(
        '.mr-6.flex.items-center.justify-center',
      );
      const hamburgerIcon = hamburgerContainer.querySelector('svg');
      fireEvent.click(hamburgerIcon);

      // Check if slide menu is visible (not translated away)
      const slideMenu = document.querySelector('.Navbar2SlideMenu');
      expect(slideMenu).toHaveClass('translate-x-0');
    });

    test('closes slide menu when X button is clicked', () => {
      renderWithRouter(<Navbar trialDate={30} />);

      // Open menu first
      const hamburgerContainer = document.querySelector(
        '.mr-6.flex.items-center.justify-center',
      );
      const hamburgerIcon = hamburgerContainer.querySelector('svg');
      fireEvent.click(hamburgerIcon);

      // Then close it
      const closeButton = screen.getByRole('button', { name: 'close menu' });
      fireEvent.click(closeButton);

      const slideMenu = document.querySelector('.Navbar2SlideMenu');
      expect(slideMenu).toHaveClass('translate-x-full');
    });
  });

  describe('Slide Menu Content', () => {
    beforeEach(() => {
      renderWithRouter(<Navbar trialDate={30} />);
      // Open the slide menu
      const hamburgerContainer = document.querySelector(
        '.mr-6.flex.items-center.justify-center',
      );
      const hamburgerIcon = hamburgerContainer.querySelector('svg');
      fireEvent.click(hamburgerIcon);
    });

    test('renders all navigation links in slide menu', () => {
      // Get all links with same name (desktop + mobile)
      const dashboardLinks = screen.getAllByRole('link', { name: 'Dashboard' });
      const reportsLinks = screen.getAllByRole('link', { name: 'Reports' });
      const alertsLinks = screen.getAllByRole('link', { name: 'Alerts' });
      const manageLinks = screen.getAllByRole('link', { name: 'Manage' });

      // Should have 2 of each (desktop + mobile)
      expect(dashboardLinks).toHaveLength(2);
      expect(reportsLinks).toHaveLength(2);
      expect(alertsLinks).toHaveLength(2);
      expect(manageLinks).toHaveLength(2);

      // Mobile-only links
      expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute(
        'href',
        '/profile',
      );
    });

    test('renders sign out button in slide menu', () => {
      const signOutButton = screen.getByRole('button', { name: 'Sign Out' });
      expect(signOutButton).toBeInTheDocument();
    });

    test('calls signOut when sign out button is clicked', () => {
      const signOutButton = screen.getByRole('button', { name: 'Sign Out' });
      fireEvent.click(signOutButton);

      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe('Trial Date Display', () => {
    test('shows trial information when trial date is positive', () => {
      renderWithRouter(<Navbar trialDate={30} />);

      // Open slide menu to see trial info
      const hamburgerContainer = document.querySelector(
        '.mr-6.flex.items-center.justify-center',
      );
      const hamburgerIcon = hamburgerContainer.querySelector('svg');
      fireEvent.click(hamburgerIcon);

      expect(screen.getByText('5 days left in trial')).toBeInTheDocument();
      expect(utils.getDaysLeftInTrial).toHaveBeenCalledWith(30);
    });

    test('hides trial information when trial date is zero or negative', () => {
      renderWithRouter(<Navbar trialDate={0} />);

      // Open slide menu
      const hamburgerContainer = document.querySelector(
        '.mr-6.flex.items-center.justify-center',
      );
      const hamburgerIcon = hamburgerContainer.querySelector('svg');
      fireEvent.click(hamburgerIcon);

      expect(screen.queryByText(/in trial/)).not.toBeInTheDocument();
    });
  });

  describe('Page Name Detection', () => {
    test('displays correct page names for different routes', () => {
      const routes = [
        { path: '/', expected: 'Dashboard' },
        { path: '/sites', expected: 'Sites' },
        { path: '/sites/123', expected: 'Sites' },
        { path: '/reports', expected: 'Reports' },
        { path: '/alerts', expected: 'Alerts' },
        { path: '/manage', expected: 'Manage' },
        { path: '/unknown', expected: '' },
      ];

      routes.forEach(({ path, expected }) => {
        const { unmount } = renderWithRouter(<Navbar trialDate={30} />, path);

        // Find the mobile page name element
        const pageNameElement = document.querySelector(
          '.sm\\:hidden .text-xl.font-bold',
        );

        if (expected) {
          expect(pageNameElement).toHaveTextContent(expected);
        } else {
          // For unknown routes, the text should be empty
          expect(pageNameElement).toHaveTextContent('');
        }

        unmount();
      });
    });
  });

  describe('Active Link Styling', () => {
    test('applies correct active styling for desktop links', () => {
      const routes = [
        { path: '/', linkText: 'Dashboard' },
        { path: '/reports', linkText: 'Reports' },
        { path: '/alerts', linkText: 'Alerts' },
        { path: '/manage', linkText: 'Manage' },
      ];

      routes.forEach(({ path, linkText }) => {
        const { unmount } = renderWithRouter(<Navbar trialDate={30} />, path);

        const [activeLink] = screen.getAllByRole('link', { name: linkText }); // Desktop link
        expect(activeLink).toHaveClass(
          'border-b-2',
          'border-black',
          'dark:border-white',
        );

        unmount();
      });
    });

    test('applies correct active styling for mobile slide menu links', () => {
      renderWithRouter(<Navbar trialDate={30} />, '/reports');

      // Open slide menu
      const hamburgerContainer = document.querySelector(
        '.mr-6.flex.items-center.justify-center',
      );
      const hamburgerIcon = hamburgerContainer.querySelector('svg');
      fireEvent.click(hamburgerIcon);

      const reportsLinks = screen.getAllByRole('link', {
        name: 'Reports',
      });
      const [, mobileReportsLink] = reportsLinks; // Mobile link (second item)
      expect(mobileReportsLink).toHaveClass(
        'border-b-2',
        'border-black',
        'dark:border-gray-100',
      );
    });
  });

  describe('Responsive Behavior', () => {
    test('hides desktop navigation on small screens and shows mobile elements', () => {
      renderWithRouter(<Navbar trialDate={30} />);

      // Desktop navigation should have hidden classes
      const desktopNav = document.querySelector('nav');
      expect(desktopNav).toHaveClass('hidden', 'sm:flex');

      // Mobile elements should have responsive classes
      const mobilePageName = document.querySelector('.sm\\:hidden .text-xl');
      expect(mobilePageName).toBeInTheDocument();
    });

    test('shows desktop profile menu and hides mobile hamburger on large screens', () => {
      renderWithRouter(<Navbar trialDate={30} />);

      const desktopProfileContainer =
        screen.getByTestId('profile-menu').parentElement;
      expect(desktopProfileContainer).toHaveClass('hidden', 'sm:flex');

      const hamburgerContainer = document.querySelector(
        '.mr-6.flex.items-center.justify-center',
      );
      expect(hamburgerContainer).toHaveClass('sm:hidden');
    });
  });

  describe('Accessibility', () => {
    test('close button has proper aria-label', () => {
      renderWithRouter(<Navbar trialDate={30} />);

      // Open slide menu
      const hamburgerContainer = document.querySelector(
        '.mr-6.flex.items-center.justify-center',
      );
      const hamburgerIcon = hamburgerContainer.querySelector('svg');
      fireEvent.click(hamburgerIcon);

      const closeButton = screen.getByRole('button', { name: 'close menu' });
      expect(closeButton).toHaveAttribute('aria-label', 'close menu');
    });

    test('logo has proper alt text', () => {
      renderWithRouter(<Navbar trialDate={30} />);

      const logo = screen.getByAltText('brand');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    test('applies correct CSS classes to main navbar', () => {
      const { container } = renderWithRouter(<Navbar trialDate={30} />);

      const navbar = container.querySelector('.Navbar2');
      expect(navbar).toHaveClass(
        'flex',
        'h-[4.5rem]',
        'w-full',
        'items-center',
        'justify-between',
        'border-b',
        'border-gray-400',
        'dark:border-b-0',
        'sm:h-[6.25rem]',
      );
    });

    test('applies correct classes to slide menu', () => {
      renderWithRouter(<Navbar trialDate={30} />);

      const slideMenu = document.querySelector('.Navbar2SlideMenu');
      expect(slideMenu).toHaveClass(
        'fixed',
        'top-0',
        'right-0',
        'h-screen',
        'w-3/4',
        'bg-white',
        'dark:bg-gray-900',
        'shadow-panel',
        'z-10',
        'transition-all',
        'duration-300',
        'ease-in-out',
      );
    });
  });
});
