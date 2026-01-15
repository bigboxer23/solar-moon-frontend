import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import StatBlock from '../../../components/common/StatBlock';

describe('StatBlock', () => {
  test('renders with title and value', () => {
    render(<StatBlock title='Power' value='1.2kW' />);

    expect(screen.getByText('Power')).toBeInTheDocument();
    expect(screen.getByText('1.2kW')).toBeInTheDocument();
  });

  test('applies default CSS classes', () => {
    const { container } = render(<StatBlock title='Energy' value='5.4kWh' />);

    const statBlock = container.querySelector('.StatBlock');
    expect(statBlock).toHaveClass('StatBlock', 'flex', 'space-x-2');
  });

  test('applies custom className', () => {
    const { container } = render(
      <StatBlock className='custom-class' title='Voltage' value='240V' />,
    );

    const statBlock = container.querySelector('.StatBlock');
    expect(statBlock).toHaveClass('custom-class');
  });

  test('handles onClick prop', () => {
    const mockOnClick = vi.fn();
    const { container } = render(
      <StatBlock onClick={mockOnClick} title='Current' value='12.5A' />,
    );

    const statBlock = container.querySelector('.StatBlock')!;
    fireEvent.click(statBlock);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('adds cursor-pointer class when onClick is provided', () => {
    const mockOnClick = vi.fn();
    const { container } = render(
      <StatBlock onClick={mockOnClick} title='Frequency' value='60Hz' />,
    );

    const statBlock = container.querySelector('.StatBlock');
    expect(statBlock).toHaveClass('cursor-pointer');
  });

  test('does not add cursor-pointer class when onClick is not provided', () => {
    const { container } = render(
      <StatBlock title='Temperature' value='25°C' />,
    );

    const statBlock = container.querySelector('.StatBlock');
    expect(statBlock).not.toHaveClass('cursor-pointer');
  });

  test('value has correct styling classes', () => {
    render(<StatBlock title='Test' value='123' />);

    const valueElement = screen.getByText('123');
    expect(valueElement).toHaveClass(
      'inline-block',
      'self-end',
      'text-5xl',
      'font-bold',
      'leading-[3rem]',
    );
  });

  test('title has correct styling classes', () => {
    render(<StatBlock title='Test Title' value='456' />);

    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toHaveClass(
      'mb-1',
      'inline-block',
      'max-w-[3.3rem]',
      'self-end',
      'text-left',
      'text-base',
      'font-bold',
      'leading-[1.125rem]',
    );
  });

  test('handles empty title', () => {
    render(<StatBlock title='' value='789' />);

    expect(screen.getByText('789')).toBeInTheDocument();
  });

  test('handles empty value', () => {
    render(<StatBlock title='Empty' value='' />);

    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  test('handles numeric value', () => {
    render(<StatBlock title='Number' value={42} />);

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  test('handles zero value', () => {
    render(<StatBlock title='Zero' value={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('combines custom className with cursor-pointer when both are present', () => {
    const mockOnClick = vi.fn();
    const { container } = render(
      <StatBlock
        className='custom-style'
        onClick={mockOnClick}
        title='Combined'
        value='test'
      />,
    );

    const statBlock = container.querySelector('.StatBlock');
    expect(statBlock).toHaveClass('custom-style', 'cursor-pointer');
  });

  test('handles onClick with undefined gracefully', () => {
    const { container } = render(
      <StatBlock onClick={undefined} title='Test' value='test' />,
    );

    const statBlock = container.querySelector('.StatBlock')!;
    expect(statBlock).not.toHaveClass('cursor-pointer');

    // Should not throw when clicked
    fireEvent.click(statBlock);
  });
});
