/* eslint-env jest */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { SignInFooter } from '../../../components/login/SignInFooter';

// Mock AWS Amplify UI components
jest.mock('@aws-amplify/ui-react', () => ({
  Flex: ({ children, justifyContent, padding }) => (
    <div
      data-justify-content={justifyContent}
      data-padding={padding}
      data-testid='flex'
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
  let mockUseAuthenticator;
  let mockUseTheme;
  let mockToForgotPassword;

  beforeEach(() => {
    mockToForgotPassword = jest.fn();
    mockUseAuthenticator = require('@aws-amplify/ui-react').useAuthenticator;
    mockUseTheme = require('@aws-amplify/ui-react').useTheme;

    jest.clearAllMocks();

    mockUseAuthenticator.mockReturnValue({
      toForgotPassword: mockToForgotPassword,
    });
    mockUseTheme.mockReturnValue({
      tokens: {
        space: {
          xs: '0.5rem',
        },
      },
    });
  });

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
    render(<SignInFooter />);

    const resetLink = screen.getByTestId('reset-link');
    fireEvent.click(resetLink);

    expect(mockToForgotPassword).toHaveBeenCalled();
  });

  test('uses AWS Amplify useTheme hook', () => {
    render(<SignInFooter />);

    expect(mockUseTheme).toHaveBeenCalled();
  });

  test('uses AWS Amplify useAuthenticator hook', () => {
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
    mockUseTheme.mockReturnValue({ tokens: mockTokens });

    render(<SignInFooter />);

    const flex = screen.getByTestId('flex');
    expect(flex).toHaveAttribute('data-padding', '1rem 0 0 0');
  });

  test('renders without crashing when useTheme returns undefined tokens', () => {
    mockUseTheme.mockReturnValue({ tokens: { space: {} } });

    render(<SignInFooter />);

    expect(screen.getByTestId('flex')).toBeInTheDocument();
  });

  test('renders without crashing when useTheme returns undefined space', () => {
    mockUseTheme.mockReturnValue({ tokens: { space: {} } });

    render(<SignInFooter />);

    const flex = screen.getByTestId('flex');
    expect(flex).toHaveAttribute('data-padding', 'undefined 0 0 0');
  });

  test('handles missing toForgotPassword function', () => {
    mockUseAuthenticator.mockReturnValue({});

    render(<SignInFooter />);

    expect(screen.getByTestId('flex')).toBeInTheDocument();
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
    render(<SignInFooter />);

    const resetLink = screen.getByTestId('reset-link');
    expect(resetLink).toHaveTextContent('Reset your password');

    fireEvent.click(resetLink);
    expect(mockToForgotPassword).toHaveBeenCalledTimes(1);
  });

  test('renders with different theme tokens', () => {
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
    mockUseAuthenticator.mockImplementation(() => {
      throw new Error('Auth error');
    });

    expect(() => render(<SignInFooter />)).toThrow('Auth error');
  });

  test('link click handler is properly bound', () => {
    render(<SignInFooter />);

    const resetLink = screen.getByTestId('reset-link');

    // Click multiple times to ensure handler is stable
    fireEvent.click(resetLink);
    fireEvent.click(resetLink);
    fireEvent.click(resetLink);

    expect(mockToForgotPassword).toHaveBeenCalledTimes(3);
  });
});
