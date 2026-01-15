import { render } from '@testing-library/react';

import Loader from '../../../components/common/Loader';

describe('Loader', () => {
  test('renders loader component', () => {
    const { container } = render(<Loader />);

    const loader = container.querySelector('.Loader')!;
    expect(loader).toBeInTheDocument();
  });

  test('renders ellipsis loader structure', () => {
    const { container } = render(<Loader />);

    const ellipsis = container.querySelector('.loader-ellipsis')!;
    expect(ellipsis).toBeInTheDocument();
  });

  test('renders four loader dots', () => {
    const { container } = render(<Loader />);

    const dots = container.querySelectorAll('.loader-ellipsis div');
    expect(dots).toHaveLength(4);
  });

  test('applies custom className', () => {
    const { container } = render(<Loader className='custom-loader' />);

    const loader = container.querySelector('.Loader')!;
    expect(loader).toHaveClass('custom-loader', 'Loader');
  });

  test('applies default empty className', () => {
    const { container } = render(<Loader />);

    const loader = container.querySelector('.Loader')!;
    expect(loader).toHaveClass('Loader');
  });

  test('handles undefined className gracefully', () => {
    const { container } = render(<Loader className={undefined} />);

    const loader = container.querySelector('.Loader')!;
    expect(loader).toHaveClass('Loader');
    expect(loader).not.toHaveClass('undefined');
  });

  test('handles null className gracefully', () => {
    const { container } = render(
      <Loader className={null as unknown as string} />,
    );

    const loader = container.querySelector('.Loader')!;
    expect(loader).toHaveClass('Loader');
  });

  test('handles empty string className', () => {
    const { container } = render(<Loader className='' />);

    const loader = container.querySelector('.Loader')!;
    expect(loader).toHaveClass('Loader');
  });

  test('applies multiple custom classes', () => {
    const { container } = render(<Loader className='class1 class2 class3' />);

    const loader = container.querySelector('.Loader')!;
    expect(loader).toHaveClass('class1', 'class2', 'class3', 'Loader');
  });

  test('has correct DOM structure', () => {
    const { container } = render(<Loader />);

    const loader = container.querySelector('.Loader')!;
    const ellipsis = loader.querySelector('.loader-ellipsis')!;
    const dots = ellipsis.querySelectorAll('div');

    expect(loader).toBeInTheDocument();
    expect(ellipsis).toBeInTheDocument();
    expect(dots).toHaveLength(4);

    // Each dot should be a simple div
    dots.forEach((dot) => {
      expect(dot.tagName).toBe('DIV');
    });
  });

  test('works without any props', () => {
    const { container } = render(<Loader />);

    const loader = container.querySelector('.Loader')!;
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('Loader');
  });

  test('handles whitespace-only className', () => {
    const { container } = render(<Loader className='   ' />);

    const loader = container.querySelector('.Loader')!;
    expect(loader).toHaveClass('Loader');
  });

  test('handles className with leading/trailing spaces', () => {
    const { container } = render(<Loader className='  my-class  ' />);

    const loader = container.querySelector('.Loader')!;
    expect(loader).toHaveClass('my-class', 'Loader');
  });
});
