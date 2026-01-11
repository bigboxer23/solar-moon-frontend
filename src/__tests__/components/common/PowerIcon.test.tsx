/* eslint-env jest */
import { render } from '@testing-library/react';
import React from 'react';

import PowerIcon from '../../../components/common/PowerIcon';

describe('PowerIcon', () => {
  test('renders power icon with default props', () => {
    const { container } = render(<PowerIcon percent={50} />);

    const powerIcon = container.querySelector('.PowerIcon');
    expect(powerIcon).toBeInTheDocument();
  });

  test('applies correct base CSS classes', () => {
    const { container } = render(<PowerIcon percent={75} />);

    const powerIcon = container.querySelector('.PowerIcon');
    expect(powerIcon).toHaveClass(
      'PowerIcon',
      'flex',
      'h-full',
      'w-[10px]',
      'items-end',
      'rounded-sm',
      'border-2',
    );
  });

  test('applies default border styling when activeAlert is false', () => {
    const { container } = render(
      <PowerIcon activeAlert={false} percent={60} />,
    );

    const powerIcon = container.querySelector('.PowerIcon');
    expect(powerIcon).toHaveClass('border-black', 'dark:border-gray-100');
    expect(powerIcon).not.toHaveClass('border-red-500');
  });

  test('applies default border styling when activeAlert is not provided', () => {
    const { container } = render(<PowerIcon percent={60} />);

    const powerIcon = container.querySelector('.PowerIcon');
    expect(powerIcon).toHaveClass('border-black', 'dark:border-gray-100');
    expect(powerIcon).not.toHaveClass('border-red-500');
  });

  test('applies alert border styling when activeAlert is true', () => {
    const { container } = render(<PowerIcon activeAlert={true} percent={80} />);

    const powerIcon = container.querySelector('.PowerIcon');
    expect(powerIcon).toHaveClass('border-red-500');
    expect(powerIcon).not.toHaveClass('border-black', 'dark:border-gray-100');
  });

  test('sets correct height based on percent', () => {
    const { container } = render(<PowerIcon percent={75} />);

    const innerDiv = container.querySelector('.PowerIcon > div');
    expect(innerDiv).toHaveStyle({ height: '75%' });
  });

  test('caps height at 100% for percentages over 100', () => {
    const { container } = render(<PowerIcon percent={150} />);

    const innerDiv = container.querySelector('.PowerIcon > div');
    expect(innerDiv).toHaveStyle({ height: '100%' });
  });

  test('handles 0 percent correctly', () => {
    const { container } = render(<PowerIcon percent={0} />);

    const innerDiv = container.querySelector('.PowerIcon > div');
    expect(innerDiv).toHaveStyle({ height: '0%' });
  });

  test('handles 100 percent correctly', () => {
    const { container } = render(<PowerIcon percent={100} />);

    const innerDiv = container.querySelector('.PowerIcon > div');
    expect(innerDiv).toHaveStyle({ height: '100%' });
  });

  test('applies red background for low percentages (< 15%)', () => {
    const { container } = render(<PowerIcon percent={10} />);

    const innerDiv = container.querySelector('.PowerIcon > div');
    expect(innerDiv).toHaveClass('bg-red-500');
  });

  test('applies red background for edge case at 14%', () => {
    const { container } = render(<PowerIcon percent={14} />);

    const innerDiv = container.querySelector('.PowerIcon > div');
    expect(innerDiv).toHaveClass('bg-red-500');
  });

  test('applies brand-primary background for medium percentages (15-95%)', () => {
    const { container } = render(<PowerIcon percent={50} />);

    const innerDiv = container.querySelector('.PowerIcon > div');
    expect(innerDiv).toHaveClass('bg-brand-primary');
  });

  test('applies brand-primary background for edge case at 15%', () => {
    const { container } = render(<PowerIcon percent={15} />);

    const innerDiv = container.querySelector('.PowerIcon > div');
    expect(innerDiv).toHaveClass('bg-brand-primary');
  });

  test('applies brand-primary background for edge case at 95%', () => {
    const { container } = render(<PowerIcon percent={95} />);

    const innerDiv = container.querySelector('.PowerIcon > div');
    expect(innerDiv).toHaveClass('bg-brand-primary');
  });

  test('applies green background for high percentages (> 95%)', () => {
    const { container } = render(<PowerIcon percent={96} />);

    const innerDiv = container.querySelector('.PowerIcon > div');
    expect(innerDiv).toHaveClass('bg-green-500');
  });

  test('applies green background for 100%', () => {
    const { container } = render(<PowerIcon percent={100} />);

    const innerDiv = container.querySelector('.PowerIcon > div');
    expect(innerDiv).toHaveClass('bg-green-500');
  });

  test('inner div has correct base classes', () => {
    const { container } = render(<PowerIcon percent={50} />);

    const innerDiv = container.querySelector('.PowerIcon > div');
    expect(innerDiv).toHaveClass('w-full');
  });

  test('handles negative percentages gracefully', () => {
    const { container } = render(<PowerIcon percent={-10} />);

    const innerDiv = container.querySelector('.PowerIcon > div');
    // Negative percentages should still render, height would be negative but CSS handles it
    expect(innerDiv).toHaveStyle({ height: '-10%' });
    expect(innerDiv).toHaveClass('bg-red-500'); // < 15 condition
  });

  test('handles decimal percentages', () => {
    const { container } = render(<PowerIcon percent={33.5} />);

    const innerDiv = container.querySelector('.PowerIcon > div');
    expect(innerDiv).toHaveStyle({ height: '33.5%' });
    expect(innerDiv).toHaveClass('bg-brand-primary');
  });

  test('combines activeAlert with different color backgrounds', () => {
    // Test low percent with alert
    const { container: lowContainer } = render(
      <PowerIcon activeAlert={true} percent={5} />,
    );

    const lowIcon = lowContainer.querySelector('.PowerIcon');
    const lowInnerDiv = lowContainer.querySelector('.PowerIcon > div');

    expect(lowIcon).toHaveClass('border-red-500');
    expect(lowInnerDiv).toHaveClass('bg-red-500');

    // Test high percent with alert
    const { container: highContainer } = render(
      <PowerIcon activeAlert={true} percent={97} />,
    );

    const highIcon = highContainer.querySelector('.PowerIcon');
    const highInnerDiv = highContainer.querySelector('.PowerIcon > div');

    expect(highIcon).toHaveClass('border-red-500');
    expect(highInnerDiv).toHaveClass('bg-green-500');
  });

  test('handles undefined percent gracefully', () => {
    const { container } = render(
      <PowerIcon percent={undefined as unknown as number} />,
    );

    const powerIcon = container.querySelector('.PowerIcon');
    expect(powerIcon).toBeInTheDocument();

    // undefined percent would result in NaN in calculations, but component should still render
    const innerDiv = container.querySelector('.PowerIcon > div');
    expect(innerDiv).toBeInTheDocument();
  });

  test('boundary testing for color transitions', () => {
    // Test exact boundary values
    const testCases = [
      { percent: 14.99, expectedColor: 'bg-red-500' },
      { percent: 15.01, expectedColor: 'bg-brand-primary' },
      { percent: 94.99, expectedColor: 'bg-brand-primary' },
      { percent: 95.01, expectedColor: 'bg-green-500' },
    ];

    testCases.forEach(({ percent, expectedColor }) => {
      const { container } = render(<PowerIcon percent={percent} />);
      const innerDiv = container.querySelector('.PowerIcon > div');
      expect(innerDiv).toHaveClass(expectedColor);
    });
  });
});
