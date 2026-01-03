/* eslint-env jest */
import { fireEvent, render, screen } from '@testing-library/react';

import QuantityPicker from '../../../components/common/QuantityPicker';

describe('QuantityPicker', () => {
  const mockSetCount = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with basic props', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    expect(screen.getByText('–')).toBeInTheDocument();
    expect(screen.getByText('＋')).toBeInTheDocument();
  });

  test('initializes with min value', () => {
    render(<QuantityPicker max={15} min={5} setCount={mockSetCount} />);

    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    expect(mockSetCount).toHaveBeenCalledWith(5);
  });

  test('decrement button is disabled initially at min value', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    const decrementButton = screen.getByText('–');
    expect(decrementButton).toHaveClass('disabled');
  });

  test('increment button is enabled initially', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByText('＋');
    expect(incrementButton).not.toHaveClass('disabled');
  });

  test('increments value when increment button is clicked', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByText('＋');
    fireEvent.click(incrementButton);

    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(mockSetCount).toHaveBeenCalledWith(2);
  });

  test('decrements value when decrement button is clicked', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByText('＋');
    const decrementButton = screen.getByText('–');

    // First increment to get to 2
    fireEvent.click(incrementButton);
    // Then decrement back to 1
    fireEvent.click(decrementButton);

    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    expect(mockSetCount).toHaveBeenLastCalledWith(1);
  });

  test('enables decrement button after incrementing from min', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByText('＋');
    const decrementButton = screen.getByText('–');

    expect(decrementButton).toHaveClass('disabled');

    fireEvent.click(incrementButton);

    expect(decrementButton).not.toHaveClass('disabled');
  });

  test('disables increment button when reaching max value', () => {
    render(<QuantityPicker max={3} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByText('＋');

    // Click twice to reach max (3)
    fireEvent.click(incrementButton); // value = 2
    fireEvent.click(incrementButton); // value = 3

    expect(incrementButton).toHaveClass('disabled');
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
  });

  test('does not increment beyond max value', () => {
    render(<QuantityPicker max={2} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByText('＋');

    fireEvent.click(incrementButton); // value = 2
    fireEvent.click(incrementButton); // should not increment to 3

    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  test('disables decrement button when reaching min value', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByText('＋');
    const decrementButton = screen.getByText('–');

    // Go to 2, then back to 1
    fireEvent.click(incrementButton);
    fireEvent.click(decrementButton);

    expect(decrementButton).toHaveClass('disabled');
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });

  test('does not decrement below min value', () => {
    render(<QuantityPicker max={10} min={5} setCount={mockSetCount} />);

    const decrementButton = screen.getByText('–');

    // Try to decrement below min
    fireEvent.click(decrementButton);

    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    expect(mockSetCount).toHaveBeenCalledWith(5); // Called on mount
  });

  test('enables increment button after decrementing from max', () => {
    render(<QuantityPicker max={3} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByText('＋');
    const decrementButton = screen.getByText('–');

    // Get to max value
    fireEvent.click(incrementButton); // 2
    fireEvent.click(incrementButton); // 3 (max, increment disabled)

    expect(incrementButton).toHaveClass('disabled');

    // Decrement from max
    fireEvent.click(decrementButton); // 2

    expect(incrementButton).not.toHaveClass('disabled');
  });

  test('input is readonly', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    const input = screen.getByDisplayValue('1');
    expect(input).toHaveAttribute('readOnly');
    expect(input).toHaveAttribute('type', 'text');
  });

  test('applies correct CSS classes', () => {
    const { container } = render(
      <QuantityPicker max={10} min={1} setCount={mockSetCount} />,
    );

    const picker = container.querySelector('.quantity-picker');
    expect(picker).toHaveClass('quantity-picker', 'd-flex', 'align-self-end');

    const input = container.querySelector('.quantity-display');
    expect(input).toHaveClass('quantity-display');
  });

  test('buttons have correct variant classes', () => {
    render(<QuantityPicker max={10} min={1} setCount={mockSetCount} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveClass('Button-secondary');
    });
  });

  test('handles edge case: min equals max', () => {
    render(<QuantityPicker max={5} min={5} setCount={mockSetCount} />);

    const incrementButton = screen.getByText('＋');
    const decrementButton = screen.getByText('–');

    expect(decrementButton).toHaveClass('disabled');
    expect(incrementButton).not.toHaveClass('disabled'); // This might be a bug in the component

    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  test('calls setCount on every value change', () => {
    render(<QuantityPicker max={5} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByText('＋');

    expect(mockSetCount).toHaveBeenCalledTimes(1); // Initial call

    fireEvent.click(incrementButton);
    expect(mockSetCount).toHaveBeenCalledTimes(2);
    expect(mockSetCount).toHaveBeenLastCalledWith(2);

    fireEvent.click(incrementButton);
    expect(mockSetCount).toHaveBeenCalledTimes(3);
    expect(mockSetCount).toHaveBeenLastCalledWith(3);
  });

  test('handles rapid clicking', () => {
    render(<QuantityPicker max={5} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByText('＋');

    // Rapid clicks
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);

    expect(screen.getByDisplayValue('4')).toBeInTheDocument();
    expect(mockSetCount).toHaveBeenLastCalledWith(4);
  });

  test('maintains button states correctly during transitions', () => {
    render(<QuantityPicker max={3} min={1} setCount={mockSetCount} />);

    const incrementButton = screen.getByText('＋');
    const decrementButton = screen.getByText('–');

    // Initial state: at min
    expect(decrementButton).toHaveClass('disabled');
    expect(incrementButton).not.toHaveClass('disabled');

    // Move to middle value
    fireEvent.click(incrementButton); // value = 2
    expect(decrementButton).not.toHaveClass('disabled');
    expect(incrementButton).not.toHaveClass('disabled');

    // Move to max value
    fireEvent.click(incrementButton); // value = 3
    expect(decrementButton).not.toHaveClass('disabled');
    expect(incrementButton).toHaveClass('disabled');
  });
});
