import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import AlertSection from '../../../components/common/AlertSection';

// Mock the Button component
vi.mock('../../../components/common/Button', () => {
  const MockButton = function ({
    children,
    onClick,
    variant,
    className,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant: string;
    className: string;
  }) {
    return (
      <button
        className={className}
        data-testid={`button-${variant}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };
  return { default: MockButton };
});

describe('AlertSection', () => {
  const defaultProps = {
    title: 'Test Alert',
    buttonTitle: 'Confirm',
    show: true,
    setShow: vi.fn(),
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders alert section when show is true', () => {
    render(<AlertSection {...defaultProps} />);

    expect(screen.getByText('Test Alert')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  test('does not render when show is false', () => {
    render(<AlertSection {...defaultProps} show={false} />);

    expect(screen.queryByText('Test Alert')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
  });

  test('displays the correct title', () => {
    render(<AlertSection {...defaultProps} title='Warning Message' />);

    expect(screen.getByText('Warning Message')).toBeInTheDocument();
  });

  test('displays the correct button title', () => {
    render(<AlertSection {...defaultProps} buttonTitle='Delete' />);

    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test('calls setShow(false) when Cancel button is clicked', () => {
    const mockSetShow = vi.fn();
    render(<AlertSection {...defaultProps} setShow={mockSetShow} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockSetShow).toHaveBeenCalledWith(false);
  });

  test('calls setShow(false) and onClick when action button is clicked', () => {
    const mockSetShow = vi.fn();
    const mockOnClick = vi.fn();
    render(
      <AlertSection
        {...defaultProps}
        onClick={mockOnClick}
        setShow={mockSetShow}
      />,
    );

    const actionButton = screen.getByText('Confirm');
    fireEvent.click(actionButton);

    expect(mockSetShow).toHaveBeenCalledWith(false);
    expect(mockOnClick).toHaveBeenCalled();
  });

  test('renders buttons with correct variants', () => {
    render(<AlertSection {...defaultProps} />);

    expect(screen.getByTestId('button-secondary')).toBeInTheDocument();
    expect(screen.getByTestId('button-danger')).toBeInTheDocument();
  });

  test('applies correct CSS classes to container', () => {
    render(<AlertSection {...defaultProps} />);

    const container = screen.getByText('Test Alert').closest('.mt-8')!;
    expect(container).toHaveClass(
      'mt-8',
      'rounded-lg',
      'border-2',
      'border-danger',
      'p-4',
    );
  });

  test('applies correct styling to title', () => {
    render(<AlertSection {...defaultProps} />);

    const title = screen.getByText('Test Alert');
    expect(title).toHaveClass(
      'text-lg',
      'font-bold',
      'text-black',
      'dark:text-gray-100',
    );
  });

  test('renders with proper DOM structure', () => {
    render(<AlertSection {...defaultProps} />);

    const cancelButton = screen.getByText('Cancel');
    const actionButton = screen.getByText('Confirm');

    // Check that buttons are in the correct container
    const buttonContainer = cancelButton.parentElement!;
    expect(buttonContainer).toContainElement(cancelButton);
    expect(buttonContainer).toContainElement(actionButton);
    expect(buttonContainer).toHaveClass('mt-8', 'flex', 'content-end');
  });

  test('cancel button has correct classes', () => {
    render(<AlertSection {...defaultProps} />);

    const cancelButton = screen.getByTestId('button-secondary');
    expect(cancelButton).toHaveClass('ml-auto');
  });

  test('action button has correct classes', () => {
    render(<AlertSection {...defaultProps} />);

    const actionButton = screen.getByTestId('button-danger');
    expect(actionButton).toHaveClass('ml-auto', 'ms-2');
  });

  test('handles multiple clicks correctly', () => {
    const mockSetShow = vi.fn();
    const mockOnClick = vi.fn();
    render(
      <AlertSection
        {...defaultProps}
        onClick={mockOnClick}
        setShow={mockSetShow}
      />,
    );

    const actionButton = screen.getByText('Confirm');

    fireEvent.click(actionButton);
    fireEvent.click(actionButton);

    expect(mockSetShow).toHaveBeenCalledTimes(2);
    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });

  test('works with empty title', () => {
    render(<AlertSection {...defaultProps} title='' />);

    // Should render but with empty title
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  test('works with empty button title', () => {
    render(<AlertSection {...defaultProps} buttonTitle='' />);

    expect(screen.getByText('Test Alert')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByTestId('button-danger')).toBeInTheDocument();
  });

  test('component exports as default export', () => {
    expect(AlertSection).toBeDefined();
    expect(typeof AlertSection).toBe('function');
  });
});
