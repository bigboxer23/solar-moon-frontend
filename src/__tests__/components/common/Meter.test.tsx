/* eslint-env jest */
import { render } from '@testing-library/react';

import Meter from '../../../components/common/Meter';

describe('Meter', () => {
  test('renders meter component', () => {
    const { container } = render(<Meter value={50} />);

    const meter = container.querySelector('.Meter')!;
    expect(meter).toBeInTheDocument();
  });

  test('applies meter container styling classes', () => {
    const { container } = render(<Meter value={50} />);

    const meter = container.querySelector('.Meter')!;
    expect(meter).toHaveClass('Meter', 'h-4', 'w-20', 'rounded-full', 'border');
  });

  test('renders progress bar with correct width', () => {
    const { container } = render(<Meter value={75} />);

    const progressBar = container.querySelector('.h-full')!;
    expect(progressBar).toHaveStyle({ width: '75%' });
  });

  test('applies progress bar styling classes', () => {
    const { container } = render(<Meter value={50} />);

    const progressBar = container.querySelector('.h-full')!;
    expect(progressBar).toHaveClass(
      'h-full',
      'rounded-full',
      'bg-brand-primary',
    );
  });

  test('handles 0% value', () => {
    const { container } = render(<Meter value={0} />);

    const progressBar = container.querySelector('.h-full')!;
    expect(progressBar).toHaveStyle({ width: '0%' });
  });

  test('handles 100% value', () => {
    const { container } = render(<Meter value={100} />);

    const progressBar = container.querySelector('.h-full')!;
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

  test('handles decimal values', () => {
    const { container } = render(<Meter value={33.333} />);

    const progressBar = container.querySelector('.h-full')!;
    expect(progressBar).toHaveStyle({ width: '33.333%' });
  });

  test('handles values over 100%', () => {
    const { container } = render(<Meter value={150} />);

    const progressBar = container.querySelector('.h-full')!;
    expect(progressBar).toHaveStyle({ width: '150%' });
  });

  test('handles negative values', () => {
    const { container } = render(<Meter value={-25} />);

    const progressBar = container.querySelector('.h-full')!;
    expect(progressBar).toHaveStyle({ width: '-25%' });
  });

  test('has correct DOM structure', () => {
    const { container } = render(<Meter value={50} />);

    const meter = container.querySelector('.Meter')!;
    const progressBar = meter.querySelector('.h-full')!;

    expect(meter).toBeInTheDocument();
    expect(progressBar).toBeInTheDocument();
    expect(progressBar.parentElement).toBe(meter);
  });

  test('className prop is not used in current implementation', () => {
    const { container } = render(<Meter className='custom-class' value={50} />);

    const meter = container.querySelector('.Meter')!;
    // The className prop is accepted but not actually applied in the component
    expect(meter).not.toHaveClass('custom-class');
    expect(meter).toHaveClass('Meter');
  });

  test('handles undefined value', () => {
    const { container } = render(
      <Meter value={undefined as unknown as number} />,
    );

    const progressBar = container.querySelector('.h-full')!;
    expect(progressBar).toHaveStyle({ width: 'undefined%' });
  });

  test('handles null value', () => {
    const { container } = render(<Meter value={null as unknown as number} />);

    const progressBar = container.querySelector('.h-full')!;
    expect(progressBar).toHaveStyle({ width: 'null%' });
  });

  test('handles string value', () => {
    const { container } = render(<Meter value={'50' as unknown as number} />);

    const progressBar = container.querySelector('.h-full')!;
    expect(progressBar).toHaveStyle({ width: '50%' });
  });

  test('handles very small values', () => {
    const { container } = render(<Meter value={0.1} />);

    const progressBar = container.querySelector('.h-full')!;
    expect(progressBar).toHaveStyle({ width: '0.1%' });
  });

  test('handles very large values', () => {
    const { container } = render(<Meter value={9999} />);

    const progressBar = container.querySelector('.h-full')!;
    expect(progressBar).toHaveStyle({ width: '9999%' });
  });

  test('progress bar fills container appropriately', () => {
    const { container } = render(<Meter value={50} />);

    const meter = container.querySelector('.Meter')!;
    const progressBar = container.querySelector('.h-full')!;

    expect(meter).toHaveClass('h-4'); // Container height
    expect(progressBar).toHaveClass('h-full'); // Progress bar fills full height
  });

  test('both elements have rounded styling', () => {
    const { container } = render(<Meter value={50} />);

    const meter = container.querySelector('.Meter')!;
    const progressBar = container.querySelector('.h-full')!;

    expect(meter).toHaveClass('rounded-full');
    expect(progressBar).toHaveClass('rounded-full');
  });

  test('progress bar has brand primary background', () => {
    const { container } = render(<Meter value={50} />);

    const progressBar = container.querySelector('.h-full')!;
    expect(progressBar).toHaveClass('bg-brand-primary');
  });

  test('container has border styling', () => {
    const { container } = render(<Meter value={50} />);

    const meter = container.querySelector('.Meter')!;
    expect(meter).toHaveClass('border');
  });

  test('container has fixed dimensions', () => {
    const { container } = render(<Meter value={50} />);

    const meter = container.querySelector('.Meter')!;
    expect(meter).toHaveClass('h-4', 'w-20');
  });
});
