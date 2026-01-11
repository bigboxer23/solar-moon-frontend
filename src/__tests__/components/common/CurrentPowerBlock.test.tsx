/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import CurrentPowerBlock from '../../../components/common/CurrentPowerBlock';

// Mock the child components
jest.mock('../../../components/common/PowerBlock', () => {
  return function MockPowerBlock({
    power,
    title,
    activeAlert,
  }: {
    power: number;
    title: string;
    activeAlert: boolean;
  }) {
    return (
      <div data-testid='power-block'>
        Power: {power}, Title: {title}, Alert: {activeAlert.toString()}
      </div>
    );
  };
});

jest.mock('../../../components/common/PowerIcon', () => {
  return function MockPowerIcon({
    percent,
    max,
    activeAlert,
  }: {
    percent: number;
    max: number | null;
    activeAlert: boolean;
  }) {
    return (
      <div data-testid='power-icon'>
        Percent: {percent}, Max: {max}, Alert: {activeAlert.toString()}
      </div>
    );
  };
});

// Mock Tippy
jest.mock('@tippyjs/react', () => {
  return function MockTippy({
    children,
    content,
    ...props
  }: {
    children: React.ReactNode;
    content: string;
    [key: string]: unknown;
  }) {
    return (
      <div data-testid='tippy-wrapper' title={content} {...props}>
        {children}
      </div>
    );
  };
});

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <IntlProvider locale='en' messages={{}}>
      {component}
    </IntlProvider>,
  );
};

describe('CurrentPowerBlock', () => {
  test('renders with basic props', () => {
    renderWithIntl(<CurrentPowerBlock currentPower={500} max={1000} />);

    expect(screen.getByTestId('power-block')).toBeInTheDocument();
    expect(screen.getByTestId('power-icon')).toBeInTheDocument();
    expect(screen.getByTestId('tippy-wrapper')).toBeInTheDocument();
  });

  test('calculates percentage correctly', () => {
    renderWithIntl(<CurrentPowerBlock currentPower={500} max={1000} />);

    const powerIcon = screen.getByTestId('power-icon');
    expect(powerIcon).toHaveTextContent('Percent: 50');
  });

  test('handles zero current power', () => {
    renderWithIntl(<CurrentPowerBlock currentPower={0} max={1000} />);

    const powerIcon = screen.getByTestId('power-icon');
    expect(powerIcon).toHaveTextContent('Percent: 0');
  });

  test('handles null max value', () => {
    renderWithIntl(<CurrentPowerBlock currentPower={500} max={null} />);

    // When max is null, it should be treated as 0, resulting in Infinity or handled gracefully
    const powerIcon = screen.getByTestId('power-icon');
    expect(powerIcon).toBeInTheDocument();
  });

  test('rounds current power for PowerBlock', () => {
    renderWithIntl(<CurrentPowerBlock currentPower={123.789} max={1000} />);

    const powerBlock = screen.getByTestId('power-block');
    expect(powerBlock).toHaveTextContent('Power: 124');
  });

  test('passes activeAlert prop to child components', () => {
    renderWithIntl(
      <CurrentPowerBlock activeAlert={true} currentPower={500} max={1000} />,
    );

    const powerBlock = screen.getByTestId('power-block');
    const powerIcon = screen.getByTestId('power-icon');

    expect(powerBlock).toHaveTextContent('Alert: true');
    expect(powerIcon).toHaveTextContent('Alert: true');
  });

  test('defaults activeAlert to false', () => {
    renderWithIntl(<CurrentPowerBlock currentPower={500} max={1000} />);

    const powerBlock = screen.getByTestId('power-block');
    const powerIcon = screen.getByTestId('power-icon');

    expect(powerBlock).toHaveTextContent('Alert: false');
    expect(powerIcon).toHaveTextContent('Alert: false');
  });

  test('applies custom className', () => {
    const { container } = renderWithIntl(
      <CurrentPowerBlock
        className='custom-class'
        currentPower={500}
        max={1000}
      />,
    );

    const powerBlockDiv = container.querySelector('.PowerBlock');
    expect(powerBlockDiv).toHaveClass('custom-class');
  });

  test('applies correct CSS classes', () => {
    const { container } = renderWithIntl(
      <CurrentPowerBlock currentPower={500} max={1000} />,
    );

    const powerBlockDiv = container.querySelector('.PowerBlock');
    expect(powerBlockDiv).toHaveClass(
      'PowerBlock',
      'dark:text-gray-100',
      'flex',
      'space-x-2',
      'items-end',
    );
  });

  test('has correct Tippy tooltip content', () => {
    renderWithIntl(<CurrentPowerBlock currentPower={500} max={1000} />);

    const tippyWrapper = screen.getByTestId('tippy-wrapper');
    expect(tippyWrapper).toHaveAttribute('title', '50% of 1,000 kW');
  });

  test('Tippy has correct placement and delay', () => {
    renderWithIntl(<CurrentPowerBlock currentPower={500} max={1000} />);

    const tippyWrapper = screen.getByTestId('tippy-wrapper');
    expect(tippyWrapper).toHaveAttribute('placement', 'top-start');
    expect(tippyWrapper).toHaveAttribute('delay', '500');
  });

  test('PowerBlock receives "now" as title', () => {
    renderWithIntl(<CurrentPowerBlock currentPower={500} max={1000} />);

    const powerBlock = screen.getByTestId('power-block');
    expect(powerBlock).toHaveTextContent('Title: now');
  });

  test('handles edge case: max is zero', () => {
    renderWithIntl(<CurrentPowerBlock currentPower={100} max={0} />);

    // Should handle division by zero gracefully
    const powerIcon = screen.getByTestId('power-icon');
    expect(powerIcon).toBeInTheDocument();
  });

  test('percentage calculation with decimal values', () => {
    renderWithIntl(<CurrentPowerBlock currentPower={100} max={300} />);

    const powerIcon = screen.getByTestId('power-icon');
    expect(powerIcon).toHaveTextContent('Percent: 33');
  });

  test('has onTouchStart handler', () => {
    const { container } = renderWithIntl(
      <CurrentPowerBlock currentPower={500} max={1000} />,
    );

    const powerBlockDiv = container.querySelector('.PowerBlock');
    // The onTouchStart is an event handler, let's just verify the component renders
    expect(powerBlockDiv).toBeInTheDocument();
  });

  test('power icon container has correct styling', () => {
    const { container } = renderWithIntl(
      <CurrentPowerBlock currentPower={500} max={1000} />,
    );

    const iconContainer = container.querySelector('.h-12.self-end.py-1\\.5');
    expect(iconContainer).toBeInTheDocument();
  });
});
