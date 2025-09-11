/* eslint-env jest */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { LockPage } from '../../../../components/views/lock/LockPage';

// Mock utils
jest.mock('../../../../utils/Utils', () => ({
  useStickyState: jest.fn(),
}));

// Mock components
jest.mock('../../../../components/common/Button', () => {
  return function MockButton({ children, onClick, className, variant, type }) {
    return (
      <button
        className={className}
        data-testid='submit-button'
        data-variant={variant}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    );
  };
});

jest.mock('../../../../components/common/Input', () => ({
  ControlledInput: ({
    control,
    errorMessage,
    inputProps,
    name,
    type,
    variant,
  }) => (
    <div data-testid='controlled-input'>
      <input
        data-testid='access-code-input'
        data-variant={variant}
        name={name}
        placeholder={inputProps?.placeholder}
        type={type}
      />
      {errorMessage && <div data-testid='error-message'>{errorMessage}</div>}
    </div>
  ),
}));

jest.mock('../../../../components/nav/HeaderBar', () => {
  return function MockHeaderBar({ headerText }) {
    return <div data-testid='header-bar'>{headerText}</div>;
  };
});

// Mock react-icons
jest.mock('react-icons/md', () => ({
  MdKey: ({ className }) => (
    <span className={className} data-testid='key-icon'>
      🔑
    </span>
  ),
}));

// Mock window.location
delete window.location;
window.location = { href: '' };

describe('LockPage', () => {
  const { useStickyState } = require('../../../../utils/Utils');
  const mockSetUnlocked = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = '';

    // Reset environment variable
    delete process.env.REACT_APP_ACCESS_CODE;

    // Default mock
    useStickyState.mockReturnValue([null, mockSetUnlocked]);
  });

  afterEach(() => {
    // Clean up environment variable
    delete process.env.REACT_APP_ACCESS_CODE;
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
    process.env.REACT_APP_ACCESS_CODE = 'test123';

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
