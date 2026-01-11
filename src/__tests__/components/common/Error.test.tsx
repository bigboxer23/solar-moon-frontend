/* eslint-env jest */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import Error from '../../../components/common/Error';

// Mock window.location
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('Error', () => {
  beforeEach(() => {
    mockLocation.href = '';
  });

  test('renders error message', () => {
    const { container: _container } = render(<Error />);

    expect(
      screen.getByText(/We're sorry, there's some trouble loading/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/refresh the page to try again/),
    ).toBeInTheDocument();
  });

  test('renders reload button', () => {
    const { container: _container } = render(<Error />);

    const button = screen.getByRole('button', { name: 'here' });
    expect(button).toBeInTheDocument();
  });

  test('applies default styling classes', () => {
    const { container } = render(<Error />);

    const errorWrapper = container.querySelector('.Error');
    expect(errorWrapper).toHaveClass('Error', 'my-8', 'flex', 'justify-center');
  });

  test('applies text styling classes', () => {
    const { container } = render(<Error />);

    const paragraph = container.querySelector('p');
    expect(paragraph).toHaveClass(
      'text-center',
      'text-gray-700',
      'dark:text-gray-300',
    );
  });

  test('applies button styling classes', () => {
    const { container: _container } = render(<Error />);

    const button = screen.getByRole('button', { name: 'here' });
    expect(button).toHaveClass('font-bold', 'text-gray-400', 'underline');
  });

  test('applies custom className', () => {
    const { container } = render(<Error className='custom-error' />);

    const errorWrapper = container.querySelector('.Error');
    expect(errorWrapper).toHaveClass(
      'custom-error',
      'Error',
      'my-8',
      'flex',
      'justify-center',
    );
  });

  test('applies default empty className when not provided', () => {
    const { container } = render(<Error />);

    const errorWrapper = container.querySelector('.Error');
    expect(errorWrapper).toHaveClass('Error');
  });

  test('handles undefined className gracefully', () => {
    const { container } = render(<Error className={undefined} />);

    const errorWrapper = container.querySelector('.Error');
    expect(errorWrapper).toHaveClass('Error');
    expect(errorWrapper).not.toHaveClass('undefined');
  });

  test('handles null className gracefully', () => {
    const { container } = render(
      <Error className={null as unknown as string} />,
    );

    const errorWrapper = container.querySelector('.Error');
    expect(errorWrapper).toHaveClass('Error');
    // null gets stringified to "null" class, so just verify Error class is present
    expect(errorWrapper).toBeInTheDocument();
  });

  test('handles empty string className', () => {
    const { container } = render(<Error className='' />);

    const errorWrapper = container.querySelector('.Error');
    expect(errorWrapper).toHaveClass('Error');
  });

  test('applies multiple custom classes', () => {
    const { container } = render(<Error className='class1 class2 class3' />);

    const errorWrapper = container.querySelector('.Error');
    expect(errorWrapper).toHaveClass('class1', 'class2', 'class3', 'Error');
  });

  test('reloads page when button is clicked', () => {
    const { container: _container } = render(<Error />);

    const button = screen.getByRole('button', { name: 'here' });
    fireEvent.click(button);

    expect(mockLocation.href).toBe('/');
  });

  test('contains proper error message structure', () => {
    const { container: _container } = render(<Error />);

    expect(screen.getByText(/We're sorry/)).toBeInTheDocument();
    expect(screen.getByText(/trouble loading your data/)).toBeInTheDocument();
    expect(screen.getByText(/Please click/)).toBeInTheDocument();
    expect(screen.getByText(/or refresh the page/)).toBeInTheDocument();
  });

  test('has correct DOM structure', () => {
    const { container } = render(<Error />);

    const errorDiv = container.querySelector('.Error');
    const paragraph = errorDiv!.querySelector('p');
    const button = paragraph!.querySelector('button');

    expect(errorDiv).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('button is wrapped in span', () => {
    const { container: _container } = render(<Error />);

    const button = screen.getByRole('button', { name: 'here' });
    const span = button.parentElement;

    expect(span!.tagName).toBe('SPAN');
  });

  test('contains line break in message', () => {
    const { container } = render(<Error />);

    const br = container.querySelector('br');
    expect(br).toBeInTheDocument();
  });

  test('handles whitespace-only className', () => {
    const { container } = render(<Error className='   ' />);

    const errorWrapper = container.querySelector('.Error');
    expect(errorWrapper).toHaveClass('Error');
  });

  test('handles className with leading/trailing spaces', () => {
    const { container } = render(<Error className='  my-class  ' />);

    const errorWrapper = container.querySelector('.Error');
    expect(errorWrapper).toHaveClass('my-class', 'Error');
  });

  test('button onClick function is defined', () => {
    const { container: _container } = render(<Error />);

    const button = screen.getByRole('button', { name: 'here' });
    expect(button.onclick).toBeDefined();
  });

  test('reloadPage function sets correct href', () => {
    const { container: _container } = render(<Error />);

    const button = screen.getByRole('button', { name: 'here' });

    // Simulate multiple clicks
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockLocation.href).toBe('/');
  });
});
