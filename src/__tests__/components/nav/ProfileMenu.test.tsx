/* eslint-env jest */
import { fetchUserAttributes } from '@aws-amplify/auth';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';

import ProfileMenu from '../../../components/nav/ProfileMenu';
import * as utils from '../../../utils/Utils';

// Mock the external dependencies
jest.mock('@aws-amplify/auth', () => ({
  fetchUserAttributes: jest.fn(),
}));

jest.mock('@aws-amplify/ui-react', () => ({
  useAuthenticator: jest.fn(),
}));

jest.mock('../../../utils/Utils', () => ({
  getDaysLeftInTrial: jest.fn(),
}));

// Mock Avatar component
jest.mock('../../../components/common/Avatar', () => {
  return function MockAvatar({
    attributes,
  }: {
    attributes: Record<string, string> | null | undefined;
  }) {
    return (
      <div data-testid='avatar'>
        Avatar - Email: {attributes?.email || 'No email'}
      </div>
    );
  };
});

// Mock ThemeSelector component
jest.mock('../../../components/common/ThemeSelector', () => {
  return function MockThemeSelector() {
    return <div data-testid='theme-selector'>Theme Selector</div>;
  };
});

// Mock the react-menu library
jest.mock('@szhsin/react-menu', () => ({
  Menu: ({
    children,
    menuButton,
    boundingBoxPadding,
    gap,
  }: {
    children: React.ReactNode;
    menuButton: React.ReactNode;
    boundingBoxPadding?: string;
    gap?: number;
  }) => (
    <div
      data-bounding-box-padding={boundingBoxPadding}
      data-gap={gap}
      data-testid='menu'
    >
      {menuButton}
      <div data-testid='menu-items'>{children}</div>
    </div>
  ),
  MenuButton: ({ children }: { children: React.ReactNode }) => (
    <button data-testid='menu-button'>{children}</button>
  ),
  MenuItem: ({
    children,
    onClick,
    disabled,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  }) => (
    <div
      aria-disabled={disabled}
      className={className}
      data-testid='menu-item'
      onClick={disabled ? undefined : onClick}
      role='menuitem'
    >
      {children}
    </div>
  ),
}));

const renderWithRouter = (component: ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('ProfileMenu', () => {
  const mockUserAttributes = {
    email: 'test@example.com',
    name: 'Test User',
    sub: '123-456-789',
  };
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useAuthenticator
    (useAuthenticator as jest.Mock).mockReturnValue({
      signOut: mockSignOut,
    });

    // Mock fetchUserAttributes
    (fetchUserAttributes as jest.Mock).mockResolvedValue(mockUserAttributes);

    // Mock getDaysLeftInTrial
    (utils.getDaysLeftInTrial as jest.Mock).mockReturnValue('5 days left');
  });

  describe('Basic Rendering', () => {
    test('renders profile menu with avatar', async () => {
      renderWithRouter(<ProfileMenu trialDate={30} />);

      expect(screen.getByTestId('menu')).toBeInTheDocument();
      expect(screen.getByTestId('menu-button')).toBeInTheDocument();
      expect(screen.getByTestId('avatar')).toBeInTheDocument();

      // Wait for user attributes to load
      await waitFor(() => {
        expect(screen.getByTestId('avatar')).toHaveTextContent(
          'Email: test@example.com',
        );
      });
    });

    test('fetches user attributes on mount', async () => {
      renderWithRouter(<ProfileMenu trialDate={30} />);

      await waitFor(() => {
        expect(fetchUserAttributes).toHaveBeenCalled();
      });
    });

    test('passes user attributes to Avatar component', async () => {
      renderWithRouter(<ProfileMenu trialDate={30} />);

      await waitFor(() => {
        expect(screen.getByTestId('avatar')).toHaveTextContent(
          'Email: test@example.com',
        );
      });
    });
  });

  describe('Trial Date Display', () => {
    test('displays trial information when trial date is positive', () => {
      renderWithRouter(<ProfileMenu trialDate={30} />);

      expect(screen.getByText('5 days left in trial')).toBeInTheDocument();
      expect(utils.getDaysLeftInTrial).toHaveBeenCalledWith(30);
    });

    test('hides trial information when trial date is zero', () => {
      renderWithRouter(<ProfileMenu trialDate={0} />);

      expect(screen.queryByText(/in trial/)).not.toBeInTheDocument();
      expect(utils.getDaysLeftInTrial).not.toHaveBeenCalled();
    });

    test('hides trial information when trial date is negative', () => {
      renderWithRouter(<ProfileMenu trialDate={-5} />);

      expect(screen.queryByText(/in trial/)).not.toBeInTheDocument();
      expect(utils.getDaysLeftInTrial).not.toHaveBeenCalled();
    });
  });

  describe('Menu Items', () => {
    test('renders all menu items', () => {
      renderWithRouter(<ProfileMenu trialDate={30} />);

      const menuItems = screen.getAllByTestId('menu-item');
      expect(menuItems).toHaveLength(3);

      // Check for ThemeSelector
      expect(screen.getByTestId('theme-selector')).toBeInTheDocument();

      // Check for Profile link
      expect(screen.getByRole('link', { name: 'Profile' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute(
        'href',
        '/profile',
      );

      // Check for Sign out button
      expect(screen.getByText('Sign out')).toBeInTheDocument();
    });

    test('theme selector menu item is disabled', () => {
      renderWithRouter(<ProfileMenu trialDate={30} />);

      const menuItems = screen.getAllByTestId('menu-item');
      const themeMenuItem = menuItems.find((item) =>
        item.querySelector('[data-testid="theme-selector"]'),
      );

      expect(themeMenuItem).toHaveAttribute('aria-disabled', 'true');
    });

    test('profile menu item has correct styling', () => {
      renderWithRouter(<ProfileMenu trialDate={30} />);

      const menuItems = screen.getAllByTestId('menu-item');
      const profileMenuItem = menuItems.find((item) =>
        item.querySelector('a[href="/profile"]'),
      );

      expect(profileMenuItem).toHaveClass(
        'flex',
        'items-center',
        'space-x-2',
        'text-text-primary',
        'hover:bg-gray-200',
        'dark:bg-gray-700',
        'px-4',
        'py-1',
        'hover:dark:bg-gray-500',
        'cursor-pointer',
      );
    });

    test('sign out menu item has correct styling', () => {
      renderWithRouter(<ProfileMenu trialDate={30} />);

      const menuItems = screen.getAllByTestId('menu-item');
      const signOutMenuItem = menuItems.find((item) =>
        item.textContent.includes('Sign out'),
      );

      expect(signOutMenuItem).toHaveClass(
        'flex',
        'items-center',
        'space-x-2',
        'text-text-primary',
        'hover:bg-gray-200',
        'dark:bg-gray-700',
        'px-4',
        'py-1',
        'hover:dark:bg-gray-500',
        'cursor-pointer',
      );
    });

    test('theme selector menu item has no-hover styling', () => {
      renderWithRouter(<ProfileMenu trialDate={30} />);

      const menuItems = screen.getAllByTestId('menu-item');
      const themeMenuItem = menuItems.find((item) =>
        item.querySelector('[data-testid="theme-selector"]'),
      );

      expect(themeMenuItem).toHaveClass(
        'flex',
        'items-center',
        'space-x-2',
        'text-text-primary',
        'dark:bg-gray-700',
        'px-4',
        'py-1',
        'cursor-pointer',
      );

      // Should not have hover classes
      expect(themeMenuItem).not.toHaveClass(
        'hover:bg-gray-200',
        'hover:dark:bg-gray-500',
      );
    });
  });

  describe('User Interactions', () => {
    test('calls signOut when sign out menu item is clicked', () => {
      renderWithRouter(<ProfileMenu trialDate={30} />);

      const signOutMenuItem = screen
        .getByText('Sign out')
        .closest('[data-testid="menu-item"]');
      fireEvent.click(signOutMenuItem!);

      expect(mockSignOut).toHaveBeenCalled();
    });

    test('profile link navigates to profile page', () => {
      renderWithRouter(<ProfileMenu trialDate={30} />);

      const profileLink = screen.getByRole('link', { name: 'Profile' });
      expect(profileLink).toHaveAttribute('href', '/profile');
    });
  });

  describe('Integration', () => {
    test('integrates with Avatar component correctly', async () => {
      renderWithRouter(<ProfileMenu trialDate={30} />);

      await waitFor(() => {
        expect(fetchUserAttributes).toHaveBeenCalled();
        expect(screen.getByTestId('avatar')).toBeInTheDocument();
      });
    });

    test('integrates with ThemeSelector component correctly', () => {
      renderWithRouter(<ProfileMenu trialDate={30} />);

      expect(screen.getByTestId('theme-selector')).toBeInTheDocument();
    });

    test('integrates with utils functions correctly', () => {
      renderWithRouter(<ProfileMenu trialDate={15} />);

      expect(utils.getDaysLeftInTrial).toHaveBeenCalledWith(15);
    });
  });

  describe('Menu Configuration', () => {
    test('menu has correct styling and configuration', () => {
      renderWithRouter(<ProfileMenu trialDate={30} />);

      const menu = screen.getByTestId('menu');
      expect(menu).toHaveAttribute('data-bounding-box-padding', '12');
      expect(menu).toHaveAttribute('data-gap', '12');
    });
  });

  describe('Component Structure', () => {
    test('applies correct CSS classes to main container', () => {
      const { container } = renderWithRouter(<ProfileMenu trialDate={30} />);

      const profileMenu = container.querySelector('.ProfileMenu');
      expect(profileMenu).toHaveClass(
        'ProfileMenu',
        'flex',
        'items-center',
        'text-black',
        'dark:text-gray-100',
      );
    });

    test('trial date span has correct styling when displayed', () => {
      renderWithRouter(<ProfileMenu trialDate={30} />);

      const trialSpan = screen.getByText('5 days left in trial');
      expect(trialSpan).toHaveClass('mr-4', 'text-sm', 'text-gray-400');
    });
  });

  describe('Error Handling', () => {
    test('renders avatar with null attributes initially', () => {
      renderWithRouter(<ProfileMenu trialDate={30} />);

      expect(screen.getByTestId('avatar')).toHaveTextContent('Email: No email');
    });
  });
});
