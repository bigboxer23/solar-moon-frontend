/* eslint-env jest */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import PriceTile from '../../../../components/views/checkout/PriceTile';

// Mock services
jest.mock('../../../../services/services', () => ({
  activateTrial: jest.fn(),
}));

// Mock components
jest.mock('../../../../components/common/Button', () => {
  return function MockButton({
    children,
    onClick,
    className,
    variant,
    type,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    className: string;
    variant: string;
    type: string;
  }) {
    return (
      <button
        className={className}
        data-testid='button'
        data-variant={variant}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    );
  };
});

jest.mock('../../../../components/views/checkout/QuantityPicker', () => {
  return function MockQuantityPicker({
    className,
    max,
    min,
    setCount,
  }: {
    className: string;
    max: number;
    min: number;
    setCount?: (count: number) => void;
  }) {
    return (
      <div
        className={className}
        data-max={max}
        data-min={min}
        data-testid='quantity-picker'
        onClick={() => setCount && setCount(2)}
      >
        Quantity Picker
      </div>
    );
  };
});

describe('PriceTile', () => {
  const defaultProps = {
    label: 'Premium Plan',
    label2: 'per month',
    label3: '(Popular)',
    count: 2,
    setCount: jest.fn(),
    priceId: 'price_premium',
    price: 50,
    checkoutClicked: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders price tile with all labels', () => {
    render(<PriceTile {...defaultProps} />);

    expect(screen.getByText('Premium Plan')).toBeInTheDocument();
    expect(screen.getByText('(Popular)')).toBeInTheDocument();
    expect(screen.getByText('per month')).toBeInTheDocument();
  });

  test('calculates and displays device count correctly', () => {
    render(<PriceTile {...defaultProps} />);

    // 20 * count = 20 * 2 = 40 devices
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('devices')).toBeInTheDocument();
  });

  test('calculates and displays total price correctly', () => {
    render(<PriceTile {...defaultProps} />);

    // price * count = 50 * 2 = $100
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  test('displays per seat pricing', () => {
    render(<PriceTile {...defaultProps} />);

    expect(screen.getByText('$50 per seat per month')).toBeInTheDocument();
  });

  test('renders quantity picker when showBottomContent is true', () => {
    render(<PriceTile {...defaultProps} />);

    expect(screen.getByTestId('quantity-picker')).toBeInTheDocument();
    expect(screen.getByText('Seats')).toBeInTheDocument();
  });

  test('hides quantity picker when showBottomContent is false', () => {
    render(<PriceTile {...defaultProps} showBottomContent={false} />);

    expect(screen.queryByTestId('quantity-picker')).not.toBeInTheDocument();
    expect(screen.queryByText('Seats')).not.toBeInTheDocument();
  });

  test('hides per seat pricing when showBottomContent is false', () => {
    render(<PriceTile {...defaultProps} showBottomContent={false} />);

    expect(
      screen.queryByText('$50 per seat per month'),
    ).not.toBeInTheDocument();
  });

  test('renders button with default text', () => {
    render(<PriceTile {...defaultProps} />);

    const button = screen.getByTestId('button');
    expect(button).toHaveTextContent('Choose plan');
  });

  test('renders button with custom text', () => {
    render(<PriceTile {...defaultProps} buttonText='Start Trial' />);

    const button = screen.getByTestId('button');
    expect(button).toHaveTextContent('Start Trial');
  });

  test('calls checkoutClicked when button is clicked', () => {
    render(<PriceTile {...defaultProps} />);

    const button = screen.getByTestId('button');
    fireEvent.click(button);

    expect(defaultProps.checkoutClicked).toHaveBeenCalledWith(
      'price_premium',
      2,
    );
  });

  test('passes correct props to QuantityPicker', () => {
    render(<PriceTile {...defaultProps} />);

    const quantityPicker = screen.getByTestId('quantity-picker');
    expect(quantityPicker).toHaveAttribute('data-max', '10');
    expect(quantityPicker).toHaveAttribute('data-min', '1');
    expect(quantityPicker).toHaveClass('mb-3', 'self-center');
  });

  test('passes correct props to Button', () => {
    render(<PriceTile {...defaultProps} />);

    const button = screen.getByTestId('button');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveClass('mt-3', 'justify-center');
  });

  test('renders without label2 when not provided', () => {
    const propsWithoutLabel2 = { ...defaultProps, label2: undefined };
    render(<PriceTile {...propsWithoutLabel2} />);

    // Should not render label2 in price section
    expect(screen.queryByText('per month')).not.toBeInTheDocument();
    // Should still render the total price
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  test('applies correct CSS classes to main container', () => {
    const { container } = render(<PriceTile {...defaultProps} />);

    const priceTile = container.querySelector('.PriceTile');
    expect(priceTile).toHaveClass(
      'PriceTile',
      'fade-in',
      'grow-1',
      'm-3',
      'my-8',
      'me-2',
      'ms-2',
      'flex',
      'min-h-[17rem]',
      'w-full',
      'max-w-[17rem]',
      'flex-col',
      'rounded-lg',
      'bg-white',
      'p-8',
      'shadow-panel',
      'dark:bg-gray-800',
      'sm:me-5',
      'sm:ms-5',
    );
  });

  test('renders with different count values', () => {
    render(<PriceTile {...defaultProps} count={3} />);

    // 20 * 3 = 60 devices
    expect(screen.getByText('60')).toBeInTheDocument();
    // 50 * 3 = $150
    expect(screen.getByText('$150')).toBeInTheDocument();
  });

  test('renders with different price values', () => {
    render(<PriceTile {...defaultProps} price={25} />);

    // 25 * 2 = $50
    expect(screen.getByText('$50')).toBeInTheDocument();
    // Per seat pricing
    expect(screen.getByText('$25 per seat per month')).toBeInTheDocument();
  });

  test('handles edge case with count of 1', () => {
    render(<PriceTile {...defaultProps} count={1} />);

    // 20 * 1 = 20 devices
    expect(screen.getByText('20')).toBeInTheDocument();
    // 50 * 1 = $50
    expect(screen.getByText('$50')).toBeInTheDocument();
  });

  test('handles edge case with price of 0', () => {
    render(<PriceTile {...defaultProps} price={0} />);

    // 0 * 2 = $0
    expect(screen.getByText('$0')).toBeInTheDocument();
    // Per seat pricing
    expect(screen.getByText('$0 per seat per month')).toBeInTheDocument();
  });
});
