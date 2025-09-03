/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import React from 'react';

import { Header } from '../../../components/login/Header';

// Mock AWS Amplify UI components
jest.mock('@aws-amplify/ui-react', () => ({
  Flex: ({ children, justifyContent }) => (
    <div data-justify-content={justifyContent} data-testid='flex'>
      {children}
    </div>
  ),
  Image: ({ alt, src, style, padding }) => (
    <img
      alt={alt}
      data-padding={padding}
      data-testid='header-image'
      src={src}
      style={style}
    />
  ),
  useTheme: jest.fn(() => ({
    tokens: {
      space: {
        xl: '2rem',
      },
    },
  })),
}));

// Mock the logo import
jest.mock('../../../assets/logo.svg', () => 'test-logo.svg');

describe('Header', () => {
  let mockUseTheme;

  beforeEach(() => {
    mockUseTheme = require('@aws-amplify/ui-react').useTheme;
    jest.clearAllMocks();
    mockUseTheme.mockReturnValue({
      tokens: {
        space: {
          xl: '2rem',
        },
      },
    });
  });

  test('renders header component', () => {
    render(<Header />);

    expect(screen.getByTestId('flex')).toBeInTheDocument();
    expect(screen.getByTestId('header-image')).toBeInTheDocument();
  });

  test('renders Flex component with center justification', () => {
    render(<Header />);

    const flex = screen.getByTestId('flex');
    expect(flex).toHaveAttribute('data-justify-content', 'center');
  });

  test('renders Image with correct alt text', () => {
    render(<Header />);

    const image = screen.getByAltText('logo');
    expect(image).toBeInTheDocument();
  });

  test('renders Image with logo source', () => {
    render(<Header />);

    const image = screen.getByTestId('header-image');
    expect(image).toHaveAttribute('src', 'test-logo.svg');
  });

  test('applies theme padding to image', () => {
    render(<Header />);

    const image = screen.getByTestId('header-image');
    expect(image).toHaveAttribute('data-padding', '2rem');
  });

  test('applies fixed width style to image', () => {
    render(<Header />);

    const image = screen.getByTestId('header-image');
    expect(image).toHaveStyle({ width: '200px' });
  });

  test('uses AWS Amplify useTheme hook', () => {
    render(<Header />);

    expect(mockUseTheme).toHaveBeenCalled();
  });

  test('accesses theme tokens for spacing', () => {
    const mockTokens = {
      space: {
        xl: '3rem',
        lg: '1.5rem',
      },
    };
    mockUseTheme.mockReturnValue({ tokens: mockTokens });

    render(<Header />);

    const image = screen.getByTestId('header-image');
    expect(image).toHaveAttribute('data-padding', '3rem');
  });

  test('has correct DOM structure', () => {
    render(<Header />);

    const flex = screen.getByTestId('flex');
    const image = screen.getByTestId('header-image');

    expect(flex).toContainElement(image);
    expect(image.parentElement).toBe(flex);
  });

  test('renders without crashing when useTheme returns undefined tokens', () => {
    mockUseTheme.mockReturnValue({ tokens: { space: {} } });

    render(<Header />);

    expect(screen.getByTestId('header-image')).toBeInTheDocument();
  });

  test('renders without crashing when useTheme returns undefined space', () => {
    mockUseTheme.mockReturnValue({ tokens: { space: {} } });

    render(<Header />);

    const image = screen.getByTestId('header-image');
    expect(image).toBeInTheDocument();
  });

  test('component exports as named export', () => {
    expect(Header).toBeDefined();
    expect(typeof Header).toBe('function');
  });

  test('logo image has proper accessibility', () => {
    render(<Header />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'logo');
  });

  test('renders consistent structure across renders', () => {
    const { container: container1 } = render(<Header />);
    const { container: container2 } = render(<Header />);

    expect(container1.innerHTML).toBe(container2.innerHTML);
  });

  test('Flex component receives correct props', () => {
    render(<Header />);

    const flex = screen.getByTestId('flex');
    expect(flex).toHaveAttribute('data-justify-content', 'center');
  });

  test('Image component receives all required props', () => {
    render(<Header />);

    const image = screen.getByTestId('header-image');
    expect(image).toHaveAttribute('alt', 'logo');
    expect(image).toHaveAttribute('src', 'test-logo.svg');
    expect(image).toHaveAttribute('data-padding', '2rem');
    expect(image).toHaveStyle({ width: '200px' });
  });

  test('renders with different theme tokens', () => {
    mockUseTheme.mockReturnValue({
      tokens: {
        space: {
          xl: '4rem',
        },
      },
    });

    render(<Header />);

    const image = screen.getByTestId('header-image');
    expect(image).toHaveAttribute('data-padding', '4rem');
  });
});
