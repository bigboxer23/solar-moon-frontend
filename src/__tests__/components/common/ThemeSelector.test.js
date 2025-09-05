/* eslint-env jest */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import ThemeSelector from '../../../components/common/ThemeSelector';

// Mock dependencies
jest.mock('@tippyjs/react', () => {
  return function MockTippy({ children, content, ...props }) {
    return (
      <div data-testid='tippy-wrapper' title={content} {...props}>
        {children}
      </div>
    );
  };
});

jest.mock('../../../utils/Utils', () => ({
  TIPPY_DELAY: 300,
  useStickyState: jest.fn(),
}));

const { useStickyState } = require('../../../utils/Utils');

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock document.documentElement
Object.defineProperty(document, 'documentElement', {
  writable: true,
  value: {
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
    },
  },
});

describe('ThemeSelector', () => {
  const mockSetActiveTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useStickyState.mockReturnValue([null, mockSetActiveTheme]);
    document.documentElement.classList.add.mockClear();
    document.documentElement.classList.remove.mockClear();

    // Reset matchMedia to default behavior
    window.matchMedia.mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  test('renders compact theme selector by default', () => {
    render(<ThemeSelector />);

    // Should have 3 buttons (system, light, dark)
    expect(screen.getAllByRole('button')).toHaveLength(3);

    // Should have tooltips
    expect(screen.getByTitle('System theme')).toBeInTheDocument();
    expect(screen.getByTitle('Light theme')).toBeInTheDocument();
    expect(screen.getByTitle('Dark theme')).toBeInTheDocument();
  });

  test('renders extended theme selector when extended=true', () => {
    render(<ThemeSelector extended={true} />);

    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  test('does not render tooltips in extended mode', () => {
    render(<ThemeSelector extended={true} />);

    expect(screen.queryByTestId('tippy-wrapper')).not.toBeInTheDocument();
  });

  test('system theme button is active by default', () => {
    useStickyState.mockReturnValue([null, mockSetActiveTheme]);
    const { container } = render(<ThemeSelector />);

    const systemButton = container.querySelector('button'); // First button
    expect(systemButton).toHaveClass('bg-gray-500', 'text-gray-100');
  });

  test('light theme button is active when theme is light', () => {
    useStickyState.mockReturnValue(['light', mockSetActiveTheme]);
    const { container } = render(<ThemeSelector />);

    const [, lightButton] = container.querySelectorAll('button');
    expect(lightButton).toHaveClass('bg-gray-500', 'text-gray-100');
  });

  test('dark theme button is active when theme is dark', () => {
    useStickyState.mockReturnValue(['dark', mockSetActiveTheme]);
    const { container } = render(<ThemeSelector />);

    const [, , darkButton] = container.querySelectorAll('button');
    expect(darkButton).toHaveClass('bg-gray-500', 'text-gray-100');
  });

  test('clicking system theme calls onThemeChange with null', () => {
    render(<ThemeSelector />);

    const systemButton = screen
      .getByTitle('System theme')
      .querySelector('button');
    fireEvent.click(systemButton);

    expect(mockSetActiveTheme).toHaveBeenCalledWith(null);
  });

  test('clicking light theme calls onThemeChange with light', () => {
    render(<ThemeSelector />);

    const lightButton = screen
      .getByTitle('Light theme')
      .querySelector('button');
    fireEvent.click(lightButton);

    expect(mockSetActiveTheme).toHaveBeenCalledWith('light');
  });

  test('clicking dark theme calls onThemeChange with dark', () => {
    render(<ThemeSelector />);

    const darkButton = screen.getByTitle('Dark theme').querySelector('button');
    fireEvent.click(darkButton);

    expect(mockSetActiveTheme).toHaveBeenCalledWith('dark');
  });

  test('adds dark class to document when dark theme is selected', () => {
    render(<ThemeSelector />);

    const darkButton = screen.getByTitle('Dark theme').querySelector('button');
    fireEvent.click(darkButton);

    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
  });

  test('removes dark class when light theme is selected', () => {
    render(<ThemeSelector />);

    const lightButton = screen
      .getByTitle('Light theme')
      .querySelector('button');
    fireEvent.click(lightButton);

    expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
      'dark',
    );
  });

  test('adds dark class when system theme matches dark preference', () => {
    window.matchMedia.mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<ThemeSelector />);

    const systemButton = screen
      .getByTitle('System theme')
      .querySelector('button');
    fireEvent.click(systemButton);

    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
  });

  test('removes dark class when system theme matches light preference', () => {
    window.matchMedia.mockImplementation((query) => ({
      matches: false, // Light preference
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<ThemeSelector />);

    const systemButton = screen
      .getByTitle('System theme')
      .querySelector('button');
    fireEvent.click(systemButton);

    expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
      'dark',
    );
  });

  test('applies correct CSS classes to theme selector container', () => {
    const { container } = render(<ThemeSelector />);

    const themeSelector = container.querySelector('.ThemeSelector');
    expect(themeSelector).toHaveClass('ThemeSelector', 'w-full');
  });

  test('compact mode has correct border styling', () => {
    const { container } = render(<ThemeSelector />);

    const buttonContainer = container.querySelector(
      '.my-2.flex.w-full.rounded.border',
    );
    expect(buttonContainer).toHaveClass(
      'border-neutral-500',
      'dark:border-neutral-100',
    );
  });

  test('extended mode has correct border and text styling', () => {
    const { container } = render(<ThemeSelector extended={true} />);

    const buttonContainer = container.querySelector(
      '.my-2.flex.w-full.rounded.border',
    );
    expect(buttonContainer).toHaveClass(
      'border-neutral-500',
      'dark:border-neutral-100',
      'dark:text-gray-100',
    );
  });

  test('inactive buttons have hover styles', () => {
    useStickyState.mockReturnValue(['light', mockSetActiveTheme]); // Light is active
    const { container } = render(<ThemeSelector />);

    const [systemButton, , darkButton] = container.querySelectorAll('button');

    expect(systemButton).toHaveClass(
      'hover:bg-gray-300',
      'dark:hover:bg-gray-300',
      'dark:hover:text-gray-900',
    );
    expect(darkButton).toHaveClass(
      'hover:bg-gray-300',
      'dark:hover:bg-gray-300',
      'dark:hover:text-gray-900',
    );
  });

  test('extended mode buttons have correct icons and labels', () => {
    const { container } = render(<ThemeSelector extended={true} />);

    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();

    // Icons should have margin class in extended mode
    const icons = container.querySelectorAll('.mr-3');
    expect(icons).toHaveLength(3);
  });

  test('all buttons have consistent base styling', () => {
    const { container } = render(<ThemeSelector />);

    const buttons = container.querySelectorAll('button');
    buttons.forEach((button) => {
      expect(button).toHaveClass(
        'flex-1',
        'flex',
        'justify-center',
        'items-center',
        'py-1.5',
        'transition-colors',
        'duration-300',
        'ease-in-out',
      );
    });
  });

  test('uses useStickyState with correct parameters', () => {
    render(<ThemeSelector />);

    expect(useStickyState).toHaveBeenCalledWith(null, 'theme');
  });

  test('handles rapid theme changes', () => {
    render(<ThemeSelector />);

    const lightButton = screen
      .getByTitle('Light theme')
      .querySelector('button');
    const darkButton = screen.getByTitle('Dark theme').querySelector('button');

    fireEvent.click(lightButton);
    fireEvent.click(darkButton);
    fireEvent.click(lightButton);

    expect(mockSetActiveTheme).toHaveBeenCalledTimes(3);
    expect(mockSetActiveTheme).toHaveBeenNthCalledWith(1, 'light');
    expect(mockSetActiveTheme).toHaveBeenNthCalledWith(2, 'dark');
    expect(mockSetActiveTheme).toHaveBeenNthCalledWith(3, 'light');
  });
});
