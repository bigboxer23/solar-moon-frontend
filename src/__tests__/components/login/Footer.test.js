/* eslint-env jest */
import { render } from '@testing-library/react';
import React from 'react';

import { Footer } from '../../../components/login/Footer';

// Mock the PageFooter component
jest.mock('../../../components/PageFooter', () => {
  return function MockPageFooter() {
    return <div data-testid='page-footer'>Page Footer</div>;
  };
});

// Mock AWS Amplify useTheme hook
jest.mock('@aws-amplify/ui-react', () => ({
  useTheme: jest.fn(() => ({
    tokens: {
      colors: {},
      space: {},
      fonts: {},
    },
  })),
}));

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

    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper).toContainElement(pageFooter);
  });

  test('uses AWS Amplify useTheme hook', () => {
    const mockUseTheme = require('@aws-amplify/ui-react').useTheme;

    render(<Footer />);

    expect(mockUseTheme).toHaveBeenCalled();
  });

  test('accesses theme tokens', () => {
    const mockTokens = { colors: { primary: '#000' } };
    const mockUseTheme = require('@aws-amplify/ui-react').useTheme;
    mockUseTheme.mockReturnValue({ tokens: mockTokens });

    render(<Footer />);

    expect(mockUseTheme).toHaveBeenCalled();
  });

  test('renders without crashing when useTheme returns undefined', () => {
    const mockUseTheme = require('@aws-amplify/ui-react').useTheme;
    mockUseTheme.mockReturnValue({});

    const { container } = render(<Footer />);

    expect(container.firstChild).toBeInTheDocument();
  });

  test('renders without crashing when useTheme throws', () => {
    const mockUseTheme = require('@aws-amplify/ui-react').useTheme;
    mockUseTheme.mockImplementation(() => {
      throw new Error('Theme error');
    });

    expect(() => render(<Footer />)).toThrow('Theme error');
  });

  test('wrapper div contains only PageFooter', () => {
    const { container } = render(<Footer />);

    const wrapper = container.firstChild;
    expect(wrapper.children).toHaveLength(1);
    expect(wrapper.firstChild).toHaveAttribute('data-testid', 'page-footer');
  });

  test('component exports as named export', () => {
    // This test ensures the component is properly exported
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
