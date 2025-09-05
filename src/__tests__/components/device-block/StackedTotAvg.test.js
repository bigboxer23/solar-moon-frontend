/* eslint-env jest */
import { render } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import StackedTotAvg from '../../../components/device-block/StackedTotAvg';

// Mock the Utils functions
jest.mock('../../../utils/Utils', () => ({
  getPowerScalingInformation: jest.fn(),
  roundToDecimals: jest.fn(),
}));

// Mock StackedStatBlock component
jest.mock('../../../components/device-block/StackedStatBlock', () => {
  return function MockStackedStatBlock(props) {
    const {
      upperTitle,
      upperValue,
      upperUnit,
      lowerTitle,
      lowerValue,
      lowerUnit,
      upperHover,
      upperHoverUnit,
      lowerHover,
      lowerHoverUnit,
      className,
      onClick,
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

const {
  getPowerScalingInformation,
  roundToDecimals,
} = require('../../../utils/Utils');

const renderWithIntl = (component) => {
  return render(<IntlProvider locale='en'>{component}</IntlProvider>);
};

describe('StackedTotAvg', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getPowerScalingInformation.mockReturnValue({
      unitPrefix: 'k',
      powerValue: 15.5,
      decimals: 2,
    });
    roundToDecimals.mockImplementation((value, decimals) =>
      Number(value.toFixed(decimals)),
    );
  });

  test('renders StackedStatBlock with correct props', () => {
    renderWithIntl(<StackedTotAvg avg={2.5} total={1500} />);

    expect(
      document.querySelector('[data-testid="stacked-stat-block"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-testid="upper-title"]'),
    ).toHaveTextContent('Total:');
    expect(
      document.querySelector('[data-testid="upper-unit"]'),
    ).toHaveTextContent('kWh');
    expect(
      document.querySelector('[data-testid="upper-hover"]'),
    ).toHaveTextContent('1500');
    expect(
      document.querySelector('[data-testid="upper-hover-unit"]'),
    ).toHaveTextContent('kWh');
    expect(
      document.querySelector('[data-testid="lower-title"]'),
    ).toHaveTextContent('Average:');
    expect(
      document.querySelector('[data-testid="lower-value"]'),
    ).toHaveTextContent('2.5');
    expect(
      document.querySelector('[data-testid="lower-unit"]'),
    ).toHaveTextContent('kW');
  });

  test('applies custom className', () => {
    const { container } = renderWithIntl(
      <StackedTotAvg avg={3.2} className='custom-class' total={2000} />,
    );

    const component = container.querySelector('.StackedTotAvg');
    expect(component).toHaveClass('custom-class');
  });

  test('calls getPowerScalingInformation with total value', () => {
    renderWithIntl(<StackedTotAvg avg={1.8} total={1200} />);

    expect(getPowerScalingInformation).toHaveBeenCalledWith(1200);
  });

  test('uses power scaling information correctly', () => {
    getPowerScalingInformation.mockReturnValue({
      unitPrefix: 'M',
      powerValue: 2.5,
      decimals: 3,
    });
    roundToDecimals.mockReturnValue(2.5);

    renderWithIntl(<StackedTotAvg avg={4.5} total={2500000} />);

    expect(
      document.querySelector('[data-testid="upper-unit"]'),
    ).toHaveTextContent('MWh');
    expect(
      document.querySelector('[data-testid="upper-value"]'),
    ).toHaveTextContent('2.5');
    expect(roundToDecimals).toHaveBeenCalledWith(2.5, 3);
  });

  test('handles zero values', () => {
    getPowerScalingInformation.mockReturnValue({
      unitPrefix: '',
      powerValue: 0,
      decimals: 0,
    });
    roundToDecimals.mockReturnValue(0);

    renderWithIntl(<StackedTotAvg avg={0} total={0} />);

    expect(
      document.querySelector('[data-testid="upper-value"]'),
    ).toHaveTextContent('0');
    expect(
      document.querySelector('[data-testid="lower-value"]'),
    ).toHaveTextContent('0');
    expect(
      document.querySelector('[data-testid="upper-unit"]'),
    ).toHaveTextContent('Wh');
  });

  test('handles large power values with appropriate scaling', () => {
    getPowerScalingInformation.mockReturnValue({
      unitPrefix: 'G',
      powerValue: 1.25,
      decimals: 2,
    });
    roundToDecimals.mockReturnValue(1.25);

    renderWithIntl(<StackedTotAvg avg={125.7} total={1250000000} />);

    expect(getPowerScalingInformation).toHaveBeenCalledWith(1250000000);
    expect(
      document.querySelector('[data-testid="upper-unit"]'),
    ).toHaveTextContent('GWh');
    expect(
      document.querySelector('[data-testid="upper-value"]'),
    ).toHaveTextContent('1.25');
    expect(
      document.querySelector('[data-testid="lower-value"]'),
    ).toHaveTextContent('125.7');
  });

  test('handles decimal average values', () => {
    renderWithIntl(<StackedTotAvg avg={3.14159} total={5000} />);

    expect(
      document.querySelector('[data-testid="lower-value"]'),
    ).toHaveTextContent('3.14159');
  });

  test('hover functionality shows original total value', () => {
    renderWithIntl(<StackedTotAvg avg={10.5} total={25000} />);

    expect(
      document.querySelector('[data-testid="upper-hover"]'),
    ).toHaveTextContent('25000');
    expect(
      document.querySelector('[data-testid="upper-hover-unit"]'),
    ).toHaveTextContent('kWh');
  });

  test('passes through className to StackedStatBlock', () => {
    const testClassName = 'test-stacked-tot-avg';
    renderWithIntl(
      <StackedTotAvg avg={5.0} className={testClassName} total={10000} />,
    );

    const component = document.querySelector(
      '[data-testid="stacked-stat-block"]',
    );
    expect(component).toHaveClass('StackedTotAvg', testClassName);
  });

  test('handles edge case with very small values', () => {
    getPowerScalingInformation.mockReturnValue({
      unitPrefix: 'm',
      powerValue: 500,
      decimals: 0,
    });
    roundToDecimals.mockReturnValue(500);

    renderWithIntl(<StackedTotAvg avg={0.001} total={0.5} />);

    expect(
      document.querySelector('[data-testid="upper-unit"]'),
    ).toHaveTextContent('mWh');
    expect(
      document.querySelector('[data-testid="upper-value"]'),
    ).toHaveTextContent('500');
    expect(
      document.querySelector('[data-testid="lower-value"]'),
    ).toHaveTextContent('0.001');
  });

  test('roundToDecimals is called with correct parameters', () => {
    getPowerScalingInformation.mockReturnValue({
      unitPrefix: 'k',
      powerValue: 123.456789,
      decimals: 2,
    });

    renderWithIntl(<StackedTotAvg avg={7.5} total={15000} />);

    expect(roundToDecimals).toHaveBeenCalledWith(123.456789, 2);
  });
});
