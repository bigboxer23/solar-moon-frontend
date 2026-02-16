import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import PowerBlock from '../../../components/common/PowerBlock';
import {
  getPowerScalingInformation,
  roundToDecimals,
} from '../../../utils/Utils';

// Mock the utils
vi.mock('../../../utils/Utils', () => ({
  getPowerScalingInformation: vi.fn(),
  roundToDecimals: vi.fn(),
}));

describe('PowerBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementations
    getPowerScalingInformation.mockReturnValue({
      unitPrefix: 'k',
      powerValue: 1.5,
      decimals: 1,
    });
    roundToDecimals.mockReturnValue(1.5);
  });

  test('renders with basic props', () => {
    const { container } = render(<PowerBlock power={1500} title='test' />);

    expect(container.querySelector('.PowerBlock')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  test('calls getPowerScalingInformation with power value', () => {
    render(<PowerBlock power={2500} title='test' />);

    expect(getPowerScalingInformation).toHaveBeenCalledWith(2500);
  });

  test('calls roundToDecimals with correct parameters', () => {
    render(<PowerBlock power={1500} title='test' />);

    expect(roundToDecimals).toHaveBeenCalledWith(1.5, 1);
  });

  test('displays scaled power value', () => {
    getPowerScalingInformation.mockReturnValue({
      unitPrefix: 'M',
      powerValue: 2.5,
      decimals: 2,
    });
    roundToDecimals.mockReturnValue(2.5);

    render(<PowerBlock power={2500000} title='test' />);

    expect(screen.getByText('2.5')).toBeInTheDocument();
  });

  test('displays unit with prefix (default W)', () => {
    getPowerScalingInformation.mockReturnValue({
      unitPrefix: 'k',
      powerValue: 1.5,
      decimals: 1,
    });

    render(<PowerBlock power={1500} title='test' />);

    expect(screen.getByText('kW')).toBeInTheDocument();
  });

  test('displays custom unit with prefix', () => {
    getPowerScalingInformation.mockReturnValue({
      unitPrefix: 'M',
      powerValue: 1.5,
      decimals: 1,
    });

    render(<PowerBlock power={1500000} title='test' unit='Wh' />);

    expect(screen.getByText('MWh')).toBeInTheDocument();
  });

  test('displays title', () => {
    render(<PowerBlock power={1500} title='Custom Title' />);

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(
      <PowerBlock className='custom-class' power={1500} title='test' />,
    );

    const powerBlock = container.querySelector('.PowerBlock');
    expect(powerBlock).toHaveClass('custom-class');
  });

  test('applies correct default CSS classes', () => {
    const { container } = render(<PowerBlock power={1500} title='test' />);

    const powerBlock = container.querySelector('.PowerBlock');
    expect(powerBlock).toHaveClass(
      'PowerBlock',
      'dark:text-gray-100',
      'flex',
      'gap-x-2',
      'items-end',
      'h-full',
    );
  });

  test('applies alert styling when activeAlert is true', () => {
    roundToDecimals.mockReturnValue(1.5);
    const { container } = render(
      <PowerBlock activeAlert={true} power={1500} title='test' />,
    );

    const powerValue = container.querySelector('.text-5xl');
    expect(powerValue).toHaveClass('text-red-500');
  });

  test('does not apply alert styling when activeAlert is false', () => {
    const { container } = render(
      <PowerBlock activeAlert={false} power={1500} title='test' />,
    );

    const powerValue = container.querySelector('.text-5xl');
    expect(powerValue).not.toHaveClass('text-red-500');
  });

  test('defaults activeAlert to false', () => {
    const { container } = render(<PowerBlock power={1500} title='test' />);

    const powerValue = container.querySelector('.text-5xl');
    expect(powerValue).not.toHaveClass('text-red-500');
  });

  test('power value has correct styling classes', () => {
    roundToDecimals.mockReturnValue(1.5);
    const { container } = render(<PowerBlock power={1500} title='test' />);

    const powerValue = container.querySelector('.text-5xl');
    expect(powerValue).toHaveClass(
      'inline-block',
      'self-end',
      'text-5xl',
      'font-bold',
      'leading-[3rem]',
    );
  });

  test('unit container has correct styling', () => {
    const { container } = render(<PowerBlock power={1500} title='test' />);

    const unitContainer = container.querySelector(
      '.mb-1.flex.max-w-\\[3\\.3rem\\]',
    );
    expect(unitContainer).toHaveClass(
      'mb-1',
      'flex',
      'max-w-[3.3rem]',
      'flex-col',
      'items-start',
      'justify-end',
      'text-base',
      'font-bold',
      'leading-[1.125rem]',
    );
  });

  test('unit prefix has gray styling', () => {
    const { container: _container } = render(
      <PowerBlock power={1500} title='test' />,
    );

    const unitPrefix = screen.getByText('kW');
    expect(unitPrefix).toHaveClass('text-gray-400');
  });

  test('handles zero power value', () => {
    getPowerScalingInformation.mockReturnValue({
      unitPrefix: '',
      powerValue: 0,
      decimals: 0,
    });
    roundToDecimals.mockReturnValue(0);

    render(<PowerBlock power={0} title='zero' />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('W')).toBeInTheDocument();
  });

  test('handles negative power value', () => {
    getPowerScalingInformation.mockReturnValue({
      unitPrefix: '',
      powerValue: -500,
      decimals: 0,
    });
    roundToDecimals.mockReturnValue(-500);

    render(<PowerBlock power={-500} title='negative' />);

    expect(screen.getByText('-500')).toBeInTheDocument();
  });

  test('handles very large power values', () => {
    getPowerScalingInformation.mockReturnValue({
      unitPrefix: 'G',
      powerValue: 5.5,
      decimals: 1,
    });
    roundToDecimals.mockReturnValue(5.5);

    render(<PowerBlock power={5500000000} title='large' />);

    expect(screen.getByText('5.5')).toBeInTheDocument();
    expect(screen.getByText('GW')).toBeInTheDocument();
  });

  test('handles very small decimal values', () => {
    getPowerScalingInformation.mockReturnValue({
      unitPrefix: 'm',
      powerValue: 0.001,
      decimals: 3,
    });
    roundToDecimals.mockReturnValue(0.001);

    render(<PowerBlock power={0.000001} title='small' />);

    expect(screen.getByText('0.001')).toBeInTheDocument();
    expect(screen.getByText('mW')).toBeInTheDocument();
  });

  test('combines activeAlert with custom className', () => {
    const { container } = render(
      <PowerBlock
        activeAlert={true}
        className='custom-class'
        power={1500}
        title='test'
      />,
    );

    const powerBlock = container.querySelector('.PowerBlock');
    expect(powerBlock).toHaveClass('custom-class');

    const powerValue = container.querySelector('.text-5xl');
    expect(powerValue).toHaveClass('text-red-500');
  });
});
