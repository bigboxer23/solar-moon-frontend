import { render } from '@testing-library/react';
import React from 'react';

import Help from '../../../components/common/Help';

describe('Help', () => {
  test('renders help icon with tooltip content', () => {
    const content = 'This is help text';
    const { container } = render(<Help content={content} />);

    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveClass('cursor-pointer', 'text-gray-400');
  });

  test('applies custom className', () => {
    const content = 'Help text';
    const customClass = 'text-blue-500';
    const { container } = render(
      <Help className={customClass} content={content} />,
    );

    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toHaveClass('cursor-pointer', 'text-gray-400', customClass);
  });

  test('renders with default empty className', () => {
    const content = 'Help text';
    const { container } = render(<Help content={content} />);

    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toHaveClass('cursor-pointer', 'text-gray-400');
  });

  test('has correct icon size', () => {
    const content = 'Help text';
    const { container } = render(<Help content={content} />);

    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toHaveAttribute('width', '18');
    expect(svgIcon).toHaveAttribute('height', '18');
  });

  test('handles empty content gracefully', () => {
    const { container } = render(<Help content='' />);

    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });

  test('handles long content strings', () => {
    const longContent =
      'This is a very long help text that might span multiple lines and should still work correctly with the tooltip component';
    const { container } = render(<Help content={longContent} />);

    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });

  test('renders FaRegQuestionCircle icon', () => {
    const content = 'Help text';
    const { container } = render(<Help content={content} />);

    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveClass('cursor-pointer');
  });

  test('merges multiple className values correctly', () => {
    const content = 'Help text';
    const multipleClasses = 'text-blue-500 hover:text-blue-700 custom-class';
    const { container } = render(
      <Help className={multipleClasses} content={content} />,
    );

    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toHaveClass(
      'cursor-pointer',
      'text-gray-400',
      'text-blue-500',
      'hover:text-blue-700',
      'custom-class',
    );
  });

  test('renders with proper DOM structure', () => {
    const content = 'Help text';
    const { container } = render(<Help content={content} />);

    const svgIcon = container.querySelector('svg');
    const divContainer = svgIcon!.parentElement;
    expect(divContainer!.tagName).toBe('DIV');
    expect(svgIcon).toBeInTheDocument();
  });

  test('handles undefined className', () => {
    const content = 'Help text';
    const { container } = render(
      <Help className={undefined} content={content} />,
    );

    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toHaveClass('cursor-pointer', 'text-gray-400');
    expect(svgIcon).not.toHaveClass('undefined');
  });

  test('handles null className', () => {
    const content = 'Help text';
    const { container } = render(
      <Help className={null as unknown as string} content={content} />,
    );

    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toHaveClass('cursor-pointer', 'text-gray-400');
    expect(svgIcon).not.toHaveClass('null');
  });

  test('handles falsy className values', () => {
    const content = 'Help text';
    const { container } = render(
      <Help className={false as unknown as string} content={content} />,
    );

    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toHaveClass('cursor-pointer', 'text-gray-400');
    expect(svgIcon).not.toHaveClass('false');
  });

  test('always includes base classes regardless of custom className', () => {
    const content = 'Help text';
    const customClass = 'my-custom-class';
    const { container } = render(
      <Help className={customClass} content={content} />,
    );

    const svgIcon = container.querySelector('svg');

    // Base classes should always be present
    expect(svgIcon).toHaveClass('cursor-pointer');
    expect(svgIcon).toHaveClass('text-gray-400');
    // Custom class should also be present
    expect(svgIcon).toHaveClass(customClass);
  });

  test('handles whitespace-only className', () => {
    const content = 'Help text';
    const { container } = render(<Help className='   ' content={content} />);

    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toHaveClass('cursor-pointer', 'text-gray-400');
  });

  test('handles className with leading/trailing spaces', () => {
    const content = 'Help text';
    const { container } = render(
      <Help className='  my-class  ' content={content} />,
    );

    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toHaveClass('cursor-pointer', 'text-gray-400', 'my-class');
  });
});
