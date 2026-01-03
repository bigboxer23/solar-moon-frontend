/* eslint-env jest */
import { fireEvent, render } from '@testing-library/react';

import StackedAlertsInfo from '../../../components/device-block/StackedAlertsInfo';

describe('StackedAlertsInfo', () => {
  test('renders alert information correctly', () => {
    const { container } = render(
      <StackedAlertsInfo activeAlerts={3} resolvedAlerts={7} />,
    );

    const component = container.querySelector('.StackedAlertsInfo');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('3 active alerts');
    expect(component).toHaveTextContent('7 resolved alerts');
  });

  test('applies correct base CSS classes', () => {
    const { container } = render(
      <StackedAlertsInfo activeAlerts={2} resolvedAlerts={5} />,
    );

    const component = container.querySelector('.StackedAlertsInfo');
    expect(component).toHaveClass(
      'StackedAlertsInfo',
      'flex',
      'flex-col',
      'items-start',
      'text-base',
      'space-y-1',
      'justify-end',
      'text-sm',
      'xs:text-base',
    );
  });

  test('applies custom className', () => {
    const { container } = render(
      <StackedAlertsInfo
        activeAlerts={1}
        className='custom-class'
        resolvedAlerts={3}
      />,
    );

    const component = container.querySelector('.StackedAlertsInfo');
    expect(component).toHaveClass('custom-class');
  });

  test('applies red text color when active alerts > 0', () => {
    const { container } = render(
      <StackedAlertsInfo activeAlerts={5} resolvedAlerts={2} />,
    );

    const activeAlertsElement = container.querySelector(
      '.StackedAlertsInfo > div:first-child',
    );
    expect(activeAlertsElement).toHaveClass('text-red-500');
    expect(activeAlertsElement).not.toHaveClass(
      'text-black',
      'dark:text-gray-100',
    );
  });

  test('applies default text color when active alerts = 0', () => {
    const { container } = render(
      <StackedAlertsInfo activeAlerts={0} resolvedAlerts={10} />,
    );

    const activeAlertsElement = container.querySelector(
      '.StackedAlertsInfo > div:first-child',
    );
    expect(activeAlertsElement).toHaveClass('text-black', 'dark:text-gray-100');
    expect(activeAlertsElement).not.toHaveClass('text-red-500');
  });

  test('resolved alerts always have gray text color', () => {
    const { container } = render(
      <StackedAlertsInfo activeAlerts={3} resolvedAlerts={8} />,
    );

    const resolvedAlertsElement = container.querySelector(
      '.StackedAlertsInfo > div:last-child',
    );
    expect(resolvedAlertsElement).toHaveClass('leading-4', 'text-gray-400');
  });

  test('handles onClick prop correctly', () => {
    const mockOnClick = jest.fn();
    const { container } = render(
      <StackedAlertsInfo
        activeAlerts={2}
        onClick={mockOnClick}
        resolvedAlerts={4}
      />,
    );

    const component = container.querySelector('.StackedAlertsInfo');
    if (component) {
      fireEvent.click(component);
    }

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('adds cursor-pointer class when onClick is provided', () => {
    const mockOnClick = jest.fn();
    const { container } = render(
      <StackedAlertsInfo
        activeAlerts={1}
        onClick={mockOnClick}
        resolvedAlerts={2}
      />,
    );

    const component = container.querySelector('.StackedAlertsInfo');
    expect(component).toHaveClass('cursor-pointer');
  });

  test('does not add cursor-pointer class when onClick is not provided', () => {
    const { container } = render(
      <StackedAlertsInfo activeAlerts={1} resolvedAlerts={2} />,
    );

    const component = container.querySelector('.StackedAlertsInfo');
    expect(component).not.toHaveClass('cursor-pointer');
  });

  test('handles zero active alerts', () => {
    const { container } = render(
      <StackedAlertsInfo activeAlerts={0} resolvedAlerts={15} />,
    );

    expect(container).toHaveTextContent('0 active alerts');
    expect(container).toHaveTextContent('15 resolved alerts');
  });

  test('handles zero resolved alerts', () => {
    const { container } = render(
      <StackedAlertsInfo activeAlerts={8} resolvedAlerts={0} />,
    );

    expect(container).toHaveTextContent('8 active alerts');
    expect(container).toHaveTextContent('0 resolved alerts');
  });

  test('handles both alerts being zero', () => {
    const { container } = render(
      <StackedAlertsInfo activeAlerts={0} resolvedAlerts={0} />,
    );

    const activeAlertsElement = container.querySelector(
      '.StackedAlertsInfo > div:first-child',
    );
    expect(container).toHaveTextContent('0 active alerts');
    expect(container).toHaveTextContent('0 resolved alerts');
    expect(activeAlertsElement).toHaveClass('text-black', 'dark:text-gray-100');
  });

  test('applies correct layout and spacing classes', () => {
    const { container } = render(
      <StackedAlertsInfo activeAlerts={3} resolvedAlerts={7} />,
    );

    const activeAlertsElement = container.querySelector(
      '.StackedAlertsInfo > div:first-child',
    );
    const resolvedAlertsElement = container.querySelector(
      '.StackedAlertsInfo > div:last-child',
    );

    expect(activeAlertsElement).toHaveClass('leading-4');
    expect(resolvedAlertsElement).toHaveClass('leading-4');
    expect(container.querySelector('.StackedAlertsInfo')).toHaveClass(
      'space-y-1',
    );
  });

  test('handles large numbers correctly', () => {
    const { container } = render(
      <StackedAlertsInfo activeAlerts={999} resolvedAlerts={1234} />,
    );

    expect(container).toHaveTextContent('999 active alerts');
    expect(container).toHaveTextContent('1234 resolved alerts');
  });

  test('onClick callback receives event object', () => {
    const mockOnClick = jest.fn();
    const { container } = render(
      <StackedAlertsInfo
        activeAlerts={1}
        onClick={mockOnClick}
        resolvedAlerts={1}
      />,
    );

    const component = container.querySelector('.StackedAlertsInfo');
    if (component) {
      fireEvent.click(component);
    }

    expect(mockOnClick).toHaveBeenCalledWith(expect.any(Object));
  });
});
