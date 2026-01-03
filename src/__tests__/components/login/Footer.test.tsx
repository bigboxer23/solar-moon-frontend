/* eslint-env jest */
import { render } from '@testing-library/react';

import { Footer } from '../../../components/login/Footer';

// Mock the PageFooter component
jest.mock('../../../components/PageFooter', () => {
  return function MockPageFooter() {
    return <div data-testid='page-footer'>Page Footer</div>;
  };
});

describe('Footer', () => {
  test('renders footer component', () => {
    const { container } = render(<Footer />);

    expect(container.firstChild).toBeInTheDocument();
  });

  test('renders PageFooter component', () => {
    const { getByTestId } = render(<Footer />);

    expect(getByTestId('page-footer')).toBeInTheDocument();
  });

  test('applies margin-top styling', () => {
    const { container } = render(<Footer />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('mt-8');
  });

  test('has correct DOM structure', () => {
    const { container, getByTestId } = render(<Footer />);

    const wrapper = container.firstChild;
    const pageFooter = getByTestId('page-footer');

    expect((wrapper as Element).tagName).toBe('DIV');
    expect(wrapper).toContainElement(pageFooter);
  });

  test('wrapper div contains only PageFooter', () => {
    const { container } = render(<Footer />);

    const wrapper = container.firstChild;
    expect((wrapper as Element).children).toHaveLength(1);
    expect(wrapper!.firstChild).toHaveAttribute('data-testid', 'page-footer');
  });

  test('component exports as named export', () => {
    expect(Footer).toBeDefined();
    expect(typeof Footer).toBe('function');
  });

  test('renders consistent structure', () => {
    const { container: container1 } = render(<Footer />);
    const { container: container2 } = render(<Footer />);

    expect(container1.innerHTML).toBe(container2.innerHTML);
  });

  test('PageFooter is wrapped in div with mt-8', () => {
    const { container, getByTestId } = render(<Footer />);

    const wrapper = container.firstChild;
    const pageFooter = getByTestId('page-footer');

    expect(wrapper).toHaveClass('mt-8');
    expect(wrapper).toContainElement(pageFooter);
    expect(pageFooter.parentElement).toBe(wrapper);
  });
});
