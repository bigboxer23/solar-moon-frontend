/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import React from 'react';

import WeatherDetailsChart from '../../../../components/views/site-details/WeatherDetailsChart';

describe('WeatherDetailsChart', () => {
  describe('Basic Rendering', () => {
    test('renders WeatherDetailsChart component', () => {
      render(<WeatherDetailsChart />);

      const weatherChart = screen.getByText('Weather Details');
      expect(weatherChart).toBeInTheDocument();
    });

    test('renders as a div element', () => {
      const { container } = render(<WeatherDetailsChart />);

      const divElement = container.querySelector('div');
      expect(divElement).toBeInTheDocument();
      expect(divElement).toHaveTextContent('Weather Details');
    });

    test('renders with correct text content', () => {
      render(<WeatherDetailsChart />);

      expect(screen.getByText('Weather Details')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('has single div as root element', () => {
      const { container } = render(<WeatherDetailsChart />);

      expect(container.children).toHaveLength(1);
      expect(container.firstChild.tagName).toBe('DIV');
    });

    test('contains only text content with no child elements', () => {
      const { container } = render(<WeatherDetailsChart />);

      const divElement = container.querySelector('div');
      expect(divElement.children).toHaveLength(0);
      expect(divElement.textContent).toBe('Weather Details');
    });
  });

  describe('Accessibility', () => {
    test('has accessible text content', () => {
      render(<WeatherDetailsChart />);

      const element = screen.getByText('Weather Details');
      expect(element).toBeVisible();
    });

    test('does not have any aria attributes', () => {
      const { container } = render(<WeatherDetailsChart />);

      const divElement = container.querySelector('div');
      expect(divElement).not.toHaveAttribute('aria-label');
      expect(divElement).not.toHaveAttribute('aria-labelledby');
      expect(divElement).not.toHaveAttribute('role');
    });
  });

  describe('Props Handling', () => {
    test('renders correctly with no props', () => {
      render(<WeatherDetailsChart />);

      expect(screen.getByText('Weather Details')).toBeInTheDocument();
    });

    test('ignores any props passed to it', () => {
      render(<WeatherDetailsChart anotherProp={123} someProp='test' />);

      expect(screen.getByText('Weather Details')).toBeInTheDocument();
    });
  });

  describe('Component Behavior', () => {
    test('is a functional component', () => {
      expect(typeof WeatherDetailsChart).toBe('function');
    });

    test('returns JSX element', () => {
      const result = WeatherDetailsChart();
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.type).toBe('div');
    });

    test('component function name is correct', () => {
      expect(WeatherDetailsChart.name).toBe('WeatherDetailsChart');
    });
  });

  describe('Rendering Consistency', () => {
    test('renders the same content on multiple renders', () => {
      const { unmount } = render(<WeatherDetailsChart />);
      expect(screen.getByText('Weather Details')).toBeInTheDocument();
      unmount();

      render(<WeatherDetailsChart />);
      expect(screen.getByText('Weather Details')).toBeInTheDocument();
    });

    test('renders consistently with different React keys', () => {
      const { rerender } = render(<WeatherDetailsChart key='first' />);
      expect(screen.getByText('Weather Details')).toBeInTheDocument();

      rerender(<WeatherDetailsChart key='second' />);
      expect(screen.getByText('Weather Details')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    test('can be rendered within other components', () => {
      const WrapperComponent = () => (
        <div>
          <h1>Parent Component</h1>
          <WeatherDetailsChart />
        </div>
      );

      render(<WrapperComponent />);

      expect(screen.getByText('Parent Component')).toBeInTheDocument();
      expect(screen.getByText('Weather Details')).toBeInTheDocument();
    });

    test('does not interfere with sibling components', () => {
      const MultipleComponents = () => (
        <div>
          <div>Sibling 1</div>
          <WeatherDetailsChart />
          <div>Sibling 2</div>
        </div>
      );

      render(<MultipleComponents />);

      expect(screen.getByText('Sibling 1')).toBeInTheDocument();
      expect(screen.getByText('Weather Details')).toBeInTheDocument();
      expect(screen.getByText('Sibling 2')).toBeInTheDocument();
    });
  });

  describe('DOM Structure', () => {
    test('creates minimal DOM structure', () => {
      const { container } = render(<WeatherDetailsChart />);

      expect(container.innerHTML).toBe('<div>Weather Details</div>');
    });

    test('has no CSS classes applied', () => {
      const { container } = render(<WeatherDetailsChart />);

      const divElement = container.querySelector('div');
      expect(divElement.className).toBe('');
    });

    test('has no inline styles', () => {
      const { container } = render(<WeatherDetailsChart />);

      const divElement = container.querySelector('div');
      expect(divElement).not.toHaveAttribute('style');
    });
  });

  describe('Component Export', () => {
    test('is exported as default export', () => {
      expect(WeatherDetailsChart).toBeDefined();
      expect(typeof WeatherDetailsChart).toBe('function');
    });
  });
});
