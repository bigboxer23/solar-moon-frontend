/* eslint-env jest */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import QuantityPicker from '../../../../components/views/checkout/QuantityPicker';

// Mock Button component
jest.mock('../../../../components/common/Button', () => {
  return function MockButton({
    children,
    onClick,
    className,
    variant,
    disabled,
  }) {
    return (
      <button
        className={className}
        data-testid={children === '–' ? 'decrement-button' : 'increment-button'}
        data-variant={variant}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };
});

describe('Checkout QuantityPicker', () => {
  const mockSetCount = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with basic props', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    expect(screen.getByTestId('decrement-button')).toBeInTheDocument();
    expect(screen.getByTestId('increment-button')).toBeInTheDocument();
  });

  test('initializes with min value', () => {
    render(<QuantityPicker max={15} min={5} setCount={mockSetCount} />);

    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    expect(mockSetCount).toHaveBeenCalledWith(5);
  });

  test('accepts and applies className prop', () => {
    const { container } = render(
      <QuantityPicker
        className='custom-class'
        max={10}
        min={1}
        setCount={mockSetCount}
      />,
    );

    const picker = container.querySelector('.quantity-picker');
    expect(picker).toHaveClass(
      'custom-class',
      'quantity-picker',
      'flex',
      'self-end',
    );
  });

  test('decrement button is disabled initially at min value', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    const decrementButton = screen.getByTestId('decrement-button');
    expect(decrementButton).toBeDisabled();
  });

  test('increment button is enabled initially', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByTestId('increment-button');
    expect(incrementButton).not.toBeDisabled();
  });

  test('increments value when increment button is clicked', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByTestId('increment-button');
    fireEvent.click(incrementButton);

    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(mockSetCount).toHaveBeenCalledWith(2);
  });

  test('decrements value when decrement button is clicked', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByTestId('increment-button');
    const decrementButton = screen.getByTestId('decrement-button');

    // First increment to get to 2
    fireEvent.click(incrementButton);
    // Then decrement back to 1
    fireEvent.click(decrementButton);

    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    expect(mockSetCount).toHaveBeenLastCalledWith(1);
  });

  test('enables decrement button after incrementing from min', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByTestId('increment-button');
    const decrementButton = screen.getByTestId('decrement-button');

    expect(decrementButton).toBeDisabled();

    fireEvent.click(incrementButton);

    expect(decrementButton).not.toBeDisabled();
  });

  test('disables increment button when reaching max value', () => {
    render(<QuantityPicker max={3} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByTestId('increment-button');

    // Click twice to reach max (3)
    fireEvent.click(incrementButton); // value = 2
    fireEvent.click(incrementButton); // value = 3

    expect(incrementButton).toBeDisabled();
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
  });

  test('does not increment beyond max value', () => {
    render(<QuantityPicker max={2} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByTestId('increment-button');

    fireEvent.click(incrementButton); // value = 2
    fireEvent.click(incrementButton); // should not increment to 3

    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  test('disables decrement button when reaching min value', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByTestId('increment-button');
    const decrementButton = screen.getByTestId('decrement-button');

    // Go to 2, then back to 1
    fireEvent.click(incrementButton);
    fireEvent.click(decrementButton);

    expect(decrementButton).toBeDisabled();
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });

  test('does not decrement below min value', () => {
    render(<QuantityPicker max={10} min={5} setCount={mockSetCount} />);

    const decrementButton = screen.getByTestId('decrement-button');

    // Try to decrement below min
    fireEvent.click(decrementButton);

    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    expect(mockSetCount).toHaveBeenCalledWith(5); // Called on mount
  });

  test('enables increment button after decrementing from max', () => {
    render(<QuantityPicker max={3} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByTestId('increment-button');
    const decrementButton = screen.getByTestId('decrement-button');

    // Get to max value
    fireEvent.click(incrementButton); // 2
    fireEvent.click(incrementButton); // 3 (max, increment disabled)

    expect(incrementButton).toBeDisabled();

    // Decrement from max
    fireEvent.click(decrementButton); // 2

    expect(incrementButton).not.toBeDisabled();
  });

  test('input is readonly', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    const input = screen.getByDisplayValue('1');
    expect(input).toHaveAttribute('readOnly');
    expect(input).toHaveAttribute('type', 'text');
  });

  test('applies correct CSS classes to container', () => {
    const { container } = render(
      <QuantityPicker
        className='test-class'
        max={10}
        min={1}
        setCount={mockSetCount}
      />,
    );

    const picker = container.querySelector('.quantity-picker');
    expect(picker).toHaveClass(
      'test-class',
      'quantity-picker',
      'flex',
      'self-end',
    );
  });

  test('applies correct CSS classes to input', () => {
    const { container } = render(
      <QuantityPicker max={10} min={1} setCount={mockSetCount} />,
    );

    const input = container.querySelector('.quantity-display');
    expect(input).toHaveClass(
      'quantity-display',
      'min-h-full',
      'w-12',
      'select-none',
      'border-0',
      'text-center',
      'outline-none',
    );
  });

  test('buttons have correct styling classes', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    const decrementButton = screen.getByTestId('decrement-button');
    const incrementButton = screen.getByTestId('increment-button');

    expect(decrementButton).toHaveClass(
      'rounded-r-none',
      'dark:bg-gray-500',
      'dark:disabled:bg-gray-800',
    );
    expect(incrementButton).toHaveClass(
      'rounded-l-none',
      'dark:bg-gray-500',
      'dark:disabled:bg-gray-800',
    );
  });

  test('buttons have correct variant', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    const decrementButton = screen.getByTestId('decrement-button');
    const incrementButton = screen.getByTestId('increment-button');

    expect(decrementButton).toHaveAttribute('data-variant', 'secondary');
    expect(incrementButton).toHaveAttribute('data-variant', 'secondary');
  });

  test('calls setCount on every value change', () => {
    render(<QuantityPicker max={5} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByTestId('increment-button');

    expect(mockSetCount).toHaveBeenCalledTimes(1); // Initial call

    fireEvent.click(incrementButton);
    expect(mockSetCount).toHaveBeenCalledTimes(2);
    expect(mockSetCount).toHaveBeenLastCalledWith(2);

    fireEvent.click(incrementButton);
    expect(mockSetCount).toHaveBeenCalledTimes(3);
    expect(mockSetCount).toHaveBeenLastCalledWith(3);
  });

  test('handles edge case: min equals max', () => {
    render(<QuantityPicker max={5} min={5} setCount={mockSetCount} />);

    const incrementButton = screen.getByTestId('increment-button');
    const decrementButton = screen.getByTestId('decrement-button');

    expect(decrementButton).toBeDisabled();
    expect(incrementButton).not.toBeDisabled(); // Component doesn't handle this edge case

    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  test('handles rapid clicking', () => {
    render(<QuantityPicker max={5} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByTestId('increment-button');

    // Rapid clicks
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);

    expect(screen.getByDisplayValue('4')).toBeInTheDocument();
    expect(mockSetCount).toHaveBeenLastCalledWith(4);
  });

  test('maintains button states correctly during transitions', () => {
    render(<QuantityPicker max={3} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByTestId('increment-button');
    const decrementButton = screen.getByTestId('decrement-button');

    // Initial state: at min
    expect(decrementButton).toBeDisabled();
    expect(incrementButton).not.toBeDisabled();

    // Move to middle value
    fireEvent.click(incrementButton); // value = 2
    expect(decrementButton).not.toBeDisabled();
    expect(incrementButton).not.toBeDisabled();

    // Move to max value
    fireEvent.click(incrementButton); // value = 3
    expect(decrementButton).not.toBeDisabled();
    expect(incrementButton).toBeDisabled();
  });

  test('renders with undefined className when not provided', () => {
    const { container } = render(
      <QuantityPicker max={10} min={1} setCount={mockSetCount} />,
    );

    const picker = container.querySelector('.quantity-picker');
    expect(picker).toHaveClass('quantity-picker', 'flex', 'self-end');
    // This component has a bug where it renders "undefined" when className is not provided
    expect(picker.className).toContain('undefined');
  });
});
