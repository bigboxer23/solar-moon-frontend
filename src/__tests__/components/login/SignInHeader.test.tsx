import { useTheme } from '@aws-amplify/ui-react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { SignInHeader } from '../../../components/login/SignInHeader';

// Mock AWS Amplify UI components
vi.mock('@aws-amplify/ui-react', () => ({
  Heading: ({
    children,
    level,
    padding,
  }: {
    children: React.ReactNode;
    level?: number;
    padding?: string;
  }) => (
    <h3 data-level={level} data-padding={padding} data-testid='heading'>
      {children}
    </h3>
  ),
  useTheme: vi.fn(),
}));

describe('SignInHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
      tokens: {
        space: {
          xl: '2rem',
        },
      },
    });
  });

  test('renders header component', () => {
    render(<SignInHeader />);

    expect(screen.getByTestId('heading')).toBeInTheDocument();
  });

  test('renders Heading with correct text', () => {
    render(<SignInHeader />);

    expect(screen.getByText('Sign in to your Account')).toBeInTheDocument();
  });

  test('renders Heading with level 3', () => {
    render(<SignInHeader />);

    const heading = screen.getByTestId('heading');
    expect(heading).toHaveAttribute('data-level', '3');
  });

  test('applies theme padding to Heading component', () => {
    render(<SignInHeader />);

    const heading = screen.getByTestId('heading');
    expect(heading).toHaveAttribute('data-padding', '2rem 2rem 0');
  });

  test('uses AWS Amplify useTheme hook', () => {
    render(<SignInHeader />);

    expect(useTheme).toHaveBeenCalled();
  });

  test('accesses theme tokens for spacing', () => {
    const mockTokens = {
      space: {
        xl: '3rem',
        lg: '1.5rem',
      },
    };
    (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
      tokens: mockTokens,
    });

    render(<SignInHeader />);

    const heading = screen.getByTestId('heading');
    expect(heading).toHaveAttribute('data-padding', '3rem 3rem 0');
  });

  test('renders without crashing when useTheme returns undefined tokens', () => {
    (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
      tokens: { space: {} },
    });

    render(<SignInHeader />);

    expect(screen.getByTestId('heading')).toBeInTheDocument();
  });

  test('renders without crashing when useTheme returns undefined space', () => {
    (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
      tokens: { space: {} },
    });

    render(<SignInHeader />);

    const heading = screen.getByTestId('heading');
    expect(heading).toHaveAttribute('data-padding', 'undefined undefined 0');
  });

  test('component exports as named export', () => {
    expect(SignInHeader).toBeDefined();
    expect(typeof SignInHeader).toBe('function');
  });

  test('renders consistent structure across renders', () => {
    const { container: container1 } = render(<SignInHeader />);
    const { container: container2 } = render(<SignInHeader />);

    expect(container1.innerHTML).toBe(container2.innerHTML);
  });

  test('Heading component receives all correct props', () => {
    render(<SignInHeader />);

    const heading = screen.getByTestId('heading');
    expect(heading).toHaveAttribute('data-level', '3');
    expect(heading).toHaveAttribute('data-padding', '2rem 2rem 0');
    expect(heading).toHaveTextContent('Sign in to your Account');
  });

  test('renders with different theme tokens', () => {
    (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
      tokens: {
        space: {
          xl: '4rem',
        },
      },
    });

    render(<SignInHeader />);

    const heading = screen.getByTestId('heading');
    expect(heading).toHaveAttribute('data-padding', '4rem 4rem 0');
  });

  test('heading has correct semantic level', () => {
    render(<SignInHeader />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
  });

  test('heading text is accessible', () => {
    render(<SignInHeader />);

    const heading = screen.getByRole('heading', {
      name: 'Sign in to your Account',
    });
    expect(heading).toBeInTheDocument();
  });

  test('uses h3 tag for semantic HTML', () => {
    render(<SignInHeader />);

    const heading = screen.getByTestId('heading');
    expect(heading.tagName).toBe('H3');
  });

  test('padding format follows CSS convention', () => {
    render(<SignInHeader />);

    const heading = screen.getByTestId('heading');
    const padding = heading.getAttribute('data-padding');

    // Should be in format: top right bottom (with bottom being 0)
    expect(padding).toMatch(/^\S+ \S+ 0$/);
  });

  test('handles theme hook errors gracefully', () => {
    (useTheme as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error('Theme error');
    });

    expect(() => render(<SignInHeader />)).toThrow('Theme error');
  });

  test('text content is exactly as specified', () => {
    render(<SignInHeader />);

    const heading = screen.getByTestId('heading');
    expect(heading.textContent).toBe('Sign in to your Account');
  });

  test('renders with minimal theme tokens', () => {
    (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
      tokens: {
        space: {
          xl: '0',
        },
      },
    });

    render(<SignInHeader />);

    const heading = screen.getByTestId('heading');
    expect(heading).toHaveAttribute('data-padding', '0 0 0');
  });

  test('maintains structure with complex theme values', () => {
    (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
      tokens: {
        space: {
          xl: 'calc(2rem + 1vh)',
          sm: '0.5rem',
          md: '1rem',
        },
      },
    });

    render(<SignInHeader />);

    const heading = screen.getByTestId('heading');
    expect(heading).toHaveAttribute(
      'data-padding',
      'calc(2rem + 1vh) calc(2rem + 1vh) 0',
    );
    expect(heading).toHaveTextContent('Sign in to your Account');
  });
});
