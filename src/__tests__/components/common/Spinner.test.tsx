import { render } from '@testing-library/react';

import Spinner from '../../../components/common/Spinner';

describe('Spinner', () => {
  test('renders spinner icon', () => {
    const { container } = render(<Spinner />);

    const spinner = container.querySelector('svg')!;
    expect(spinner).toBeInTheDocument();
  });

  test('applies animate-spin class by default', () => {
    const { container } = render(<Spinner />);

    const spinner = container.querySelector('svg')!;
    expect(spinner).toHaveClass('animate-spin');
  });

  test('applies custom className', () => {
    const { container } = render(<Spinner className='custom-spinner' />);

    const spinner = container.querySelector('svg')!;
    expect(spinner).toHaveClass('animate-spin', 'custom-spinner');
  });

  test('applies multiple custom classes', () => {
    const { container } = render(<Spinner className='class1 class2 class3' />);

    const spinner = container.querySelector('svg')!;
    expect(spinner).toHaveClass('animate-spin', 'class1', 'class2', 'class3');
  });

  test('handles undefined className gracefully', () => {
    const { container } = render(<Spinner className={undefined} />);

    const spinner = container.querySelector('svg')!;
    expect(spinner).toHaveClass('animate-spin');
    expect(spinner).not.toHaveClass('undefined');
  });

  test('handles null className gracefully', () => {
    const { container } = render(
      <Spinner className={null as unknown as string} />,
    );

    const spinner = container.querySelector('svg')!;
    expect(spinner).toHaveClass('animate-spin');
    expect(spinner).not.toHaveClass('null');
  });

  test('handles empty string className', () => {
    const { container } = render(<Spinner className='' />);

    const spinner = container.querySelector('svg')!;
    expect(spinner).toHaveClass('animate-spin');
  });

  test('handles whitespace-only className', () => {
    const { container } = render(<Spinner className='   ' />);

    const spinner = container.querySelector('svg')!;
    expect(spinner).toHaveClass('animate-spin');
  });

  test('renders FaRotate icon', () => {
    const { container } = render(<Spinner />);

    const spinner = container.querySelector('svg')!;
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('fill', 'currentColor');
  });

  test('works without any props', () => {
    const { container } = render(<Spinner />);

    const spinner = container.querySelector('svg')!;
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  test('maintains icon structure', () => {
    const { container } = render(<Spinner />);

    const spinner = container.querySelector('svg')!;
    expect(spinner.tagName).toBe('svg');
    expect(spinner.querySelector('path')).toBeInTheDocument();
  });

  test('applies className with leading/trailing spaces', () => {
    const { container } = render(<Spinner className='  my-class  ' />);

    const spinner = container.querySelector('svg')!;
    expect(spinner).toHaveClass('animate-spin', 'my-class');
  });
});
