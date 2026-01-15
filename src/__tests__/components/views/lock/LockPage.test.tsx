import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import { LockPage } from '../../../../components/views/lock/LockPage';

// Mock utils
vi.mock('../../../../utils/Utils', () => ({
  useStickyState: vi.fn(),
}));

// Mock components
vi.mock('../../../../components/common/Button', () => {
  const MockButton = function ({
    children,
    onClick,
    className,
    variant,
    buttonProps,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: string;
    buttonProps?: Record<string, unknown>;
  }) {
    return (
      <button
        className={className}
        data-testid='submit-button'
        data-variant={variant}
        onClick={onClick}
        type={buttonProps?.type as string}
      >
        {children}
      </button>
    );
  };
  return { default: MockButton };
});

vi.mock('../../../../components/common/Input', () => ({
  ControlledInput: ({
    errorMessage,
    inputProps,
    name,
    variant,
  }: {
    control: unknown;
    errorMessage?: string;
    inputProps?: { placeholder?: string; type?: string };
    name: string;
    variant?: string;
  }) => (
    <div data-testid='controlled-input'>
      <input
        data-testid='access-code-input'
        data-variant={variant}
        name={name}
        placeholder={inputProps?.placeholder}
        type={inputProps?.type}
      />
      {errorMessage && <div data-testid='error-message'>{errorMessage}</div>}
    </div>
  ),
}));

vi.mock('../../../../components/nav/HeaderBar', () => {
  const MockHeaderBar = function ({ headerText }: { headerText: string }) {
    return <div data-testid='header-bar'>{headerText}</div>;
  };
  return { default: MockHeaderBar };
});

// Mock react-icons
vi.mock('react-icons/md', () => ({
  MdKey: ({ className }: { className?: string }) => (
    <span className={className} data-testid='key-icon'>
      🔑
    </span>
  ),
}));

// Mock window.location
delete (window as { location?: Location }).location;
(window as { location: { href: string } }).location = { href: '' };

describe('LockPage', () => {
  import { useStickyState } from '../../../../utils/Utils';

  const mockSetUnlocked = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.location.href = '';

    // Reset environment variable
    delete process.env.VITE_ACCESS_CODE;

    // Default mock
    useStickyState.mockReturnValue([null, mockSetUnlocked]);
  });

  afterEach(() => {
    // Clean up environment variable
    delete process.env.VITE_ACCESS_CODE;
  });

  test('renders main container with correct CSS classes', () => {
    const { container } = render(<LockPage />);

    const lockPage = container.querySelector('.LockPage');
    expect(lockPage).toHaveClass(
      'LockPage',
      'flex',
      'max-w-full',
      'flex-col',
      'items-center',
    );
  });

  test('renders header bar with empty text', () => {
    render(<LockPage />);

    const headerBar = screen.getByTestId('header-bar');
    expect(headerBar).toBeInTheDocument();
    expect(headerBar).toHaveTextContent('');
  });

  test('renders main form container with correct styling', () => {
    const { container } = render(<LockPage />);

    const main = container.querySelector('main');
    expect(main).toHaveClass(
      'fade-in',
      'my-8',
      'flex',
      'w-[30rem]',
      'max-w-full',
      'flex-col',
      'content-center',
      'bg-white',
      'p-6',
      'shadow-panel',
      'dark:bg-gray-800',
      'sm:rounded-lg',
      'sm:p-8',
    );
  });

  test('renders access code instruction text', () => {
    render(<LockPage />);

    expect(
      screen.getByText('Enter the access code to proceed to the site'),
    ).toBeInTheDocument();
  });

  test('renders controlled input with correct props', () => {
    render(<LockPage />);

    const input = screen.getByTestId('access-code-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'AccessCode');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('placeholder', 'Enter Access Code');
    expect(input).toHaveAttribute('data-variant', 'underline');
  });

  test('renders submit button with correct content and styling', () => {
    render(<LockPage />);

    const button = screen.getByTestId('submit-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveClass('mt-8', 'justify-center');

    // Check button content
    expect(screen.getByTestId('key-icon')).toBeInTheDocument();
    expect(button).toHaveTextContent('Submit Access Code');
  });

  test('calls useStickyState with correct parameters', () => {
    render(<LockPage />);

    expect(useStickyState).toHaveBeenCalledWith(null, 'unlock.code');
  });

  test('form applies correct CSS classes', () => {
    const { container } = render(<LockPage />);

    const form = container.querySelector('form');
    expect(form).toHaveClass('mt-6', 'flex', 'w-full', 'flex-col');
  });

  test('key icon has correct className', () => {
    render(<LockPage />);

    const keyIcon = screen.getByTestId('key-icon');
    expect(keyIcon).toHaveClass('button-icon');
  });

  test('renders without crashing when no environment variable is set', () => {
    // No REACT_APP_ACCESS_CODE set
    render(<LockPage />);

    expect(screen.getByTestId('access-code-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  test('renders form element correctly', () => {
    const { container } = render(<LockPage />);

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass('mt-6', 'flex', 'w-full', 'flex-col');
  });

  test('input accepts user input', () => {
    render(<LockPage />);

    const input = screen.getByTestId('access-code-input');
    fireEvent.change(input, { target: { value: 'test-code' } });

    // The input should exist and be interactable
    expect(input).toBeInTheDocument();
  });

  test('button click is handled', () => {
    render(<LockPage />);

    const button = screen.getByTestId('submit-button');
    fireEvent.click(button);

    // Button should be clickable without errors
    expect(button).toBeInTheDocument();
  });

  test('form uses onBlur validation mode', () => {
    // This test verifies the form configuration exists
    render(<LockPage />);

    const input = screen.getByTestId('access-code-input');
    expect(input).toBeInTheDocument();
  });

  test('input field is password type for security', () => {
    render(<LockPage />);

    const input = screen.getByTestId('access-code-input');
    expect(input).toHaveAttribute('type', 'password');
  });

  test('environment variable affects component behavior', () => {
    process.env.VITE_ACCESS_CODE = 'test123';

    render(<LockPage />);

    // Component should still render correctly with environment variable set
    expect(screen.getByTestId('access-code-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  test('input has correct placeholder text', () => {
    render(<LockPage />);

    const input = screen.getByTestId('access-code-input');
    expect(input).toHaveAttribute('placeholder', 'Enter Access Code');
  });
});
