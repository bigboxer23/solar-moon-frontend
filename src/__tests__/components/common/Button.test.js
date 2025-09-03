/* eslint-env jest */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import Button from '../../../components/common/Button';

describe('Button', () => {
  test('renders button with children', () => {
    const { container } = render(<Button>Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  test('applies primary variant styles by default', () => {
    const { container } = render(<Button>Primary</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('Button-primary', 'flex');
    expect(button).toHaveClass(
      'bg-brand-primary',
      'text-white',
      'rounded-full',
    );
  });

  test('applies secondary variant styles', () => {
    const { container } = render(
      <Button variant='secondary'>Secondary</Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('Button-secondary');
    expect(button).toHaveClass('bg-gray-200', 'dark:bg-gray-500', 'text-black');
  });

  test('applies outline-primary variant styles', () => {
    const { container } = render(
      <Button variant='outline-primary'>Outline Primary</Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('Button-outline-primary');
    expect(button).toHaveClass(
      'bg-white',
      'text-brand-primary',
      'border-brand-primary',
    );
  });

  test('applies outline-secondary variant styles', () => {
    const { container } = render(
      <Button variant='outline-secondary'>Outline Secondary</Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('Button-outline-secondary');
    expect(button).toHaveClass('bg-white', 'text-black', 'border-gray-300');
  });

  test('applies danger variant styles', () => {
    const { container } = render(<Button variant='danger'>Danger</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('Button-danger');
    expect(button).toHaveClass('bg-danger', 'text-white');
  });

  test('applies outline-danger variant styles', () => {
    const { container } = render(
      <Button variant='outline-danger'>Outline Danger</Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('Button-outline-danger');
    expect(button).toHaveClass('border-red-700', 'text-red-700');
  });

  test('applies text variant styles', () => {
    const { container } = render(<Button variant='text'>Text Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('Button-text');
    expect(button).toHaveClass('font-bold', 'underline', 'text-black');
  });

  test('applies icon variant styles', () => {
    const { container } = render(<Button variant='icon'>Icon</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('Button-icon');
    expect(button).toHaveClass('text-gray-600');
  });

  test('applies custom className', () => {
    const { container } = render(
      <Button className='custom-class'>Custom</Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class', 'Button-primary', 'flex');
  });

  test('handles onClick event', () => {
    const mockClick = jest.fn();
    const { container } = render(<Button onClick={mockClick}>Click me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  test('applies disabled state', () => {
    const { container } = render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-70', 'pointer-events-none');
  });

  test('disabled button does not trigger onClick', () => {
    const mockClick = jest.fn();
    const { container } = render(
      <Button disabled onClick={mockClick}>
        Disabled
      </Button>,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockClick).not.toHaveBeenCalled();
  });

  test('passes additional button props', () => {
    const { container } = render(
      <Button buttonProps={{ 'data-testid': 'custom-button', type: 'submit' }}>
        Submit
      </Button>,
    );

    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  test('handles undefined className gracefully', () => {
    const { container } = render(<Button className={undefined}>Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('Button-primary', 'flex');
  });

  test('handles null onClick gracefully', () => {
    const { container } = render(<Button onClick={null}>Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
  });

  test('disabled false explicitly works correctly', () => {
    const mockClick = jest.fn();
    const { container } = render(
      <Button disabled={false} onClick={mockClick}>
        Enabled
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
    expect(button).not.toHaveClass('opacity-70');

    fireEvent.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  test('renders with complex children', () => {
    const { container } = render(
      <Button>
        <span>Icon</span> Text
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Icon Text');
    expect(button.querySelector('span')).toHaveTextContent('Icon');
  });

  test('applies multiple custom classes', () => {
    const { container } = render(
      <Button className='class1 class2 class3'>Multiple Classes</Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('class1', 'class2', 'class3', 'Button-primary');
  });

  test('combines buttonProps with default props correctly', () => {
    const mockClick = jest.fn();
    const { container } = render(
      <Button
        buttonProps={{ 'aria-label': 'Custom label', tabIndex: 0 }}
        onClick={mockClick}
      >
        Combined Props
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Custom label');
    expect(button).toHaveAttribute('tabIndex', '0');

    fireEvent.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
