import { render, screen } from '@testing-library/react';

import PageFooter from '../../components/PageFooter';

describe('PageFooter', () => {
  test('renders footer component', () => {
    const { container } = render(<PageFooter />);

    const footer = container.querySelector('.Footer2');
    expect(footer).toBeInTheDocument();
  });

  test('displays copyright text', () => {
    render(<PageFooter />);

    expect(screen.getByText(/Copyright ©/)).toBeInTheDocument();
    expect(screen.getByText(/Solar Moon Analytics, LLC/)).toBeInTheDocument();
  });

  test('applies footer styling classes', () => {
    const { container } = render(<PageFooter />);

    const footer = container.querySelector('.Footer2');
    expect(footer).toHaveClass('Footer2', 'flex', 'justify-center', 'pb-6');
  });

  test('applies paragraph styling classes', () => {
    const { container } = render(<PageFooter />);

    const paragraph = container.querySelector('p');
    expect(paragraph).toHaveClass('text-sm', 'text-gray-400');
  });

  test('has correct DOM structure', () => {
    const { container } = render(<PageFooter />);

    const footer = container.querySelector('.Footer2');
    const paragraph = footer!.querySelector('p');

    expect(footer).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
    expect(paragraph!.parentElement).toBe(footer);
  });

  test('contains year in copyright text', () => {
    const { container } = render(<PageFooter />);

    const paragraph = container.querySelector('p');
    const currentYear = new Date().getFullYear();

    expect(paragraph!.textContent).toContain(currentYear.toString());
    expect(paragraph!.textContent).toMatch(
      /Copyright © \d{4} Solar Moon Analytics, LLC/,
    );
  });

  test('renders without any props', () => {
    const { container } = render(<PageFooter />);

    const footer = container.querySelector('.Footer2');
    expect(footer).toBeInTheDocument();
  });

  test('footer layout is flexbox centered', () => {
    const { container } = render(<PageFooter />);

    const footer = container.querySelector('.Footer2');
    expect(footer).toHaveClass('flex', 'justify-center');
  });

  test('has bottom padding styling', () => {
    const { container } = render(<PageFooter />);

    const footer = container.querySelector('.Footer2');
    expect(footer).toHaveClass('pb-6');
  });

  test('text is properly styled', () => {
    const { container } = render(<PageFooter />);

    const paragraph = container.querySelector('p');
    expect(paragraph).toHaveClass('text-sm', 'text-gray-400');
  });

  test('copyright format is correct', () => {
    const { container } = render(<PageFooter />);

    const paragraph = container.querySelector('p');
    expect(paragraph!.textContent).toMatch(
      /^Copyright © \d{4} Solar Moon Analytics, LLC$/,
    );
  });

  test('uses current year dynamically', () => {
    const currentYear = new Date().getFullYear();
    render(<PageFooter />);

    expect(
      screen.getByText(new RegExp(`Copyright © ${currentYear}`)),
    ).toBeInTheDocument();
  });
});
