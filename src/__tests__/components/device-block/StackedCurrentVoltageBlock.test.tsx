/* eslint-env jest */
import { render } from '@testing-library/react';

import StackedCurrentVoltageBlock from '../../../components/device-block/StackedCurrentVoltageBlock';

// Mock StackedStatBlock component
jest.mock('../../../components/device-block/StackedStatBlock', () => {
  return function MockStackedStatBlock(props: {
    upperTitle: string;
    upperValue: number | null;
    upperUnit: string;
    lowerTitle: string;
    lowerValue: number | null;
    lowerUnit: string;
    className?: string;
    onClick?: () => void;
    upperHover?: number | null;
    upperHoverUnit?: string;
    lowerHover?: number | null;
    lowerHoverUnit?: string;
  }) {
    const {
      upperTitle,
      upperValue,
      upperUnit,
      lowerTitle,
      lowerValue,
      lowerUnit,
      className,
      onClick,
      upperHover,
      upperHoverUnit,
      lowerHover,
      lowerHoverUnit,
      ...restProps
    } = props;

    return (
      <div
        className={className}
        data-testid='stacked-stat-block'
        onClick={onClick}
        {...restProps}
      >
        <div data-testid='upper-title'>{upperTitle}</div>
        <div data-testid='upper-value'>{upperValue}</div>
        <div data-testid='upper-unit'>{upperUnit}</div>
        <div data-testid='upper-hover'>{upperHover}</div>
        <div data-testid='upper-hover-unit'>{upperHoverUnit}</div>
        <div data-testid='lower-title'>{lowerTitle}</div>
        <div data-testid='lower-value'>{lowerValue}</div>
        <div data-testid='lower-unit'>{lowerUnit}</div>
        <div data-testid='lower-hover'>{lowerHover}</div>
        <div data-testid='lower-hover-unit'>{lowerHoverUnit}</div>
      </div>
    );
  };
});

describe('StackedCurrentVoltageBlock', () => {
  test('renders StackedStatBlock with correct voltage and current data', () => {
    render(<StackedCurrentVoltageBlock current={12.5} voltage={240} />);

    expect(
      document.querySelector('[data-testid="stacked-stat-block"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-testid="upper-title"]'),
    ).toHaveTextContent('Voltage:');
    expect(
      document.querySelector('[data-testid="upper-value"]'),
    ).toHaveTextContent('240');
    expect(
      document.querySelector('[data-testid="upper-unit"]'),
    ).toHaveTextContent('Volts');
    expect(
      document.querySelector('[data-testid="lower-title"]'),
    ).toHaveTextContent('Current:');
    expect(
      document.querySelector('[data-testid="lower-value"]'),
    ).toHaveTextContent('12.5');
    expect(
      document.querySelector('[data-testid="lower-unit"]'),
    ).toHaveTextContent('Amps');
  });

  test('applies custom className to StackedStatBlock', () => {
    render(
      <StackedCurrentVoltageBlock
        className='custom-voltage-block'
        current={5.2}
        voltage={120}
      />,
    );

    const component = document.querySelector(
      '[data-testid="stacked-stat-block"]',
    );
    expect(component).toHaveClass(
      'StackedCurrentVoltage',
      'custom-voltage-block',
    );
  });

  test('renders empty div when current is 0', () => {
    const { container } = render(
      <StackedCurrentVoltageBlock current={0} voltage={240} />,
    );

    const emptyDiv = container.querySelector('div');
    expect(emptyDiv).toHaveClass('min-h-[52px]');
    expect(
      document.querySelector('[data-testid="stacked-stat-block"]'),
    ).not.toBeInTheDocument();
  });

  test('renders empty div when voltage is 0', () => {
    const { container } = render(
      <StackedCurrentVoltageBlock current={15.0} voltage={0} />,
    );

    const emptyDiv = container.querySelector('div');
    expect(emptyDiv).toHaveClass('min-h-[52px]');
    expect(
      document.querySelector('[data-testid="stacked-stat-block"]'),
    ).not.toBeInTheDocument();
  });

  test('renders empty div when both current and voltage are 0', () => {
    const { container } = render(
      <StackedCurrentVoltageBlock current={0} voltage={0} />,
    );

    const emptyDiv = container.querySelector('div');
    expect(emptyDiv).toHaveClass('min-h-[52px]');
    expect(
      document.querySelector('[data-testid="stacked-stat-block"]'),
    ).not.toBeInTheDocument();
  });

  test('renders normally with decimal values', () => {
    render(<StackedCurrentVoltageBlock current={12.75} voltage={240.5} />);

    expect(
      document.querySelector('[data-testid="upper-value"]'),
    ).toHaveTextContent('240.5');
    expect(
      document.querySelector('[data-testid="lower-value"]'),
    ).toHaveTextContent('12.75');
    expect(
      document.querySelector('[data-testid="stacked-stat-block"]'),
    ).toBeInTheDocument();
  });

  test('handles negative values as non-zero', () => {
    render(<StackedCurrentVoltageBlock current={-5.5} voltage={-120} />);

    // Negative values are not 0, so component should render normally
    expect(
      document.querySelector('[data-testid="stacked-stat-block"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-testid="upper-value"]'),
    ).toHaveTextContent('-120');
    expect(
      document.querySelector('[data-testid="lower-value"]'),
    ).toHaveTextContent('-5.5');
  });

  test('handles very small non-zero values', () => {
    render(<StackedCurrentVoltageBlock current={0.001} voltage={0.1} />);

    expect(
      document.querySelector('[data-testid="stacked-stat-block"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-testid="upper-value"]'),
    ).toHaveTextContent('0.1');
    expect(
      document.querySelector('[data-testid="lower-value"]'),
    ).toHaveTextContent('0.001');
  });

  test('handles large values', () => {
    render(<StackedCurrentVoltageBlock current={999.99} voltage={50000} />);

    expect(
      document.querySelector('[data-testid="upper-value"]'),
    ).toHaveTextContent('50000');
    expect(
      document.querySelector('[data-testid="lower-value"]'),
    ).toHaveTextContent('999.99');
  });

  test('applies default className when none provided', () => {
    render(<StackedCurrentVoltageBlock current={10} voltage={220} />);

    const component = document.querySelector(
      '[data-testid="stacked-stat-block"]',
    );
    expect(component).toHaveClass('StackedCurrentVoltage');
  });

  test('empty div has correct minimum height class', () => {
    const { container } = render(
      <StackedCurrentVoltageBlock current={0} voltage={100} />,
    );

    const emptyDiv = container.querySelector('div');
    expect(emptyDiv).toHaveClass('min-h-[52px]');
    expect(emptyDiv).toBeEmptyDOMElement();
  });

  test('renders with mixed zero and non-zero values correctly', () => {
    // Test current = 0, voltage != 0 (should render empty div)
    const { container: container1 } = render(
      <StackedCurrentVoltageBlock current={0} voltage={240} />,
    );
    expect(
      container1.querySelector('[data-testid="stacked-stat-block"]'),
    ).not.toBeInTheDocument();

    // Test current != 0, voltage = 0 (should render empty div)
    const { container: container2 } = render(
      <StackedCurrentVoltageBlock current={15} voltage={0} />,
    );
    expect(
      container2.querySelector('[data-testid="stacked-stat-block"]'),
    ).not.toBeInTheDocument();

    // Test both != 0 (should render normally)
    const { container: container3 } = render(
      <StackedCurrentVoltageBlock current={15} voltage={240} />,
    );
    expect(
      container3.querySelector('[data-testid="stacked-stat-block"]'),
    ).toBeInTheDocument();
  });
});
