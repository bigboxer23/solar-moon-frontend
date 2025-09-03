/* eslint-env jest */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { SignInFooter } from '../../../components/login/SignInFooter';

// Mock AWS Amplify UI components
jest.mock('@aws-amplify/ui-react', () => ({
  Flex: ({ children, justifyContent, padding }) => (
    <div
      data-testid='flex'
      data-justify-content={justifyContent}
      data-padding={padding}
    >
      {children}
    </div>
  ),
  Link: ({ children, onClick }) => (
    <button data-testid='reset-link' onClick={onClick}>
      {children}
    </button>
  ),
  useAuthenticator: jest.fn(() => ({
    toForgotPassword: jest.fn(),
  })),
  useTheme: jest.fn(() => ({
    tokens: {
      space: {
        xs: '0.5rem',
      },
    },
  })),
}));

describe('SignInFooter', () => {
  test('renders footer component', () => {
    render(<SignInFooter />);

    expect(screen.getByTestId('flex')).toBeInTheDocument();
    expect(screen.getByTestId('reset-link')).toBeInTheDocument();
  });

  test('renders Flex component with center justification', () => {
    render(<SignInFooter />);

    const flex = screen.getByTestId('flex');
    expect(flex).toHaveAttribute('data-justify-content', 'center');
  });

  test('renders Link with correct text', () => {
    render(<SignInFooter />);

    expect(screen.getByText('Reset your password')).toBeInTheDocument();
  });

  test('applies theme padding to Flex component', () => {
    render(<SignInFooter />);

    const flex = screen.getByTestId('flex');
    expect(flex).toHaveAttribute('data-padding', '0.5rem 0 0 0');
  });

  test('calls toForgotPassword when reset link is clicked', () => {
    const mockToForgotPassword = jest.fn();
    const mockUseAuthenticator =
      require('@aws-amplify/ui-react').useAuthenticator;
    mockUseAuthenticator.mockReturnValue({
      toForgotPassword: mockToForgotPassword,
    });

    render(<SignInFooter />);

    const resetLink = screen.getByTestId('reset-link');
    fireEvent.click(resetLink);

    expect(mockToForgotPassword).toHaveBeenCalled();
  });

  test('uses AWS Amplify useTheme hook', () => {
    const mockUseTheme = require('@aws-amplify/ui-react').useTheme;

    render(<SignInFooter />);

    expect(mockUseTheme).toHaveBeenCalled();
  });

  test('uses AWS Amplify useAuthenticator hook', () => {
    const mockUseAuthenticator =
      require('@aws-amplify/ui-react').useAuthenticator;

    render(<SignInFooter />);

    expect(mockUseAuthenticator).toHaveBeenCalled();
  });

  test('accesses theme tokens for spacing', () => {
    const mockTokens = {
      space: {
        xs: '1rem',
        sm: '0.75rem',
      },
    };
    const mockUseTheme = require('@aws-amplify/ui-react').useTheme;
    mockUseTheme.mockReturnValue({ tokens: mockTokens });

    render(<SignInFooter />);

    const flex = screen.getByTestId('flex');
    expect(flex).toHaveAttribute('data-padding', '1rem 0 0 0');
  });

  test('renders without crashing when useTheme returns undefined tokens', () => {
    const mockUseTheme = require('@aws-amplify/ui-react').useTheme;
    mockUseTheme.mockReturnValue({ tokens: {} });

    render(<SignInFooter />);

    expect(screen.getByTestId('flex')).toBeInTheDocument();
  });

  test('renders without crashing when useTheme returns undefined space', () => {
    const mockUseTheme = require('@aws-amplify/ui-react').useTheme;
    mockUseTheme.mockReturnValue({ tokens: { space: {} } });

    render(<SignInFooter />);

    const flex = screen.getByTestId('flex');
    expect(flex).toHaveAttribute('data-padding', 'undefined 0 0 0');
  });

  test('handles missing toForgotPassword function', () => {
    const mockUseAuthenticator =
      require('@aws-amplify/ui-react').useAuthenticator;
    mockUseAuthenticator.mockReturnValue({});

    render(<SignInFooter />);

    const resetLink = screen.getByTestId('reset-link');
    fireEvent.click(resetLink);

    // Should not throw error when function is undefined
    expect(screen.getByTestId('reset-link')).toBeInTheDocument();
  });

  test('has correct DOM structure', () => {
    render(<SignInFooter />);

    const flex = screen.getByTestId('flex');
    const resetLink = screen.getByTestId('reset-link');

    expect(flex).toContainElement(resetLink);
    expect(resetLink.parentElement).toBe(flex);
  });

  test('component exports as named export', () => {
    expect(SignInFooter).toBeDefined();
    expect(typeof SignInFooter).toBe('function');
  });

  test('renders consistent structure across renders', () => {
    const { container: container1 } = render(<SignInFooter />);
    const { container: container2 } = render(<SignInFooter />);

    expect(container1.innerHTML).toBe(container2.innerHTML);
  });

  test('Flex component receives correct props', () => {
    render(<SignInFooter />);

    const flex = screen.getByTestId('flex');
    expect(flex).toHaveAttribute('data-justify-content', 'center');
    expect(flex).toHaveAttribute('data-padding', '0.5rem 0 0 0');
  });

  test('Link component receives correct props', () => {
    const mockToForgotPassword = jest.fn();
    const mockUseAuthenticator =
      require('@aws-amplify/ui-react').useAuthenticator;
    mockUseAuthenticator.mockReturnValue({
      toForgotPassword: mockToForgotPassword,
    });

    render(<SignInFooter />);

    const resetLink = screen.getByTestId('reset-link');
    expect(resetLink).toHaveTextContent('Reset your password');

    fireEvent.click(resetLink);
    expect(mockToForgotPassword).toHaveBeenCalledTimes(1);
  });

  test('renders with different theme tokens', () => {
    const mockUseTheme = require('@aws-amplify/ui-react').useTheme;
    mockUseTheme.mockReturnValue({
      tokens: {
        space: {
          xs: '2rem',
        },
      },
    });

    render(<SignInFooter />);

    const flex = screen.getByTestId('flex');
    expect(flex).toHaveAttribute('data-padding', '2rem 0 0 0');
  });

  test('handles authenticator hook errors gracefully', () => {
    const mockUseAuthenticator =
      require('@aws-amplify/ui-react').useAuthenticator;
    mockUseAuthenticator.mockImplementation(() => {
      throw new Error('Auth error');
    });

    expect(() => render(<SignInFooter />)).toThrow('Auth error');
  });

  test('link click handler is properly bound', () => {
    const mockToForgotPassword = jest.fn();
    const mockUseAuthenticator =
      require('@aws-amplify/ui-react').useAuthenticator;
    mockUseAuthenticator.mockReturnValue({
      toForgotPassword: mockToForgotPassword,
    });

    render(<SignInFooter />);

    const resetLink = screen.getByTestId('reset-link');

    // Click multiple times to ensure handler is stable
    fireEvent.click(resetLink);
    fireEvent.click(resetLink);
    fireEvent.click(resetLink);

    expect(mockToForgotPassword).toHaveBeenCalledTimes(3);
  });
});
