import { fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { vi } from 'vitest';

import StackedStatBlock from '../../../components/device-block/StackedStatBlock';

// Mock dependencies
vi.mock('@tippyjs/react', () => {
  const MockTippy = function ({
    children,
    content,
    ...props
  }: {
    children: React.ReactNode;
    content: string;
  }) {
    return (
      <div data-testid='tippy-wrapper' title={content} {...props}>
        {children}
      </div>
    );
  };
  return { default: MockTippy };
});

vi.mock('../../../utils/Utils', () => ({
  roundTwoDigit: vi.fn((value) => {
    if (value === null || value === undefined) return value;
    const num = Number(value);
    if (isNaN(num)) return value;
    return Math.round(num * 100) / 100;
  }),
  TIPPY_DELAY: 300,
}));

const renderWithIntl = (component: React.ReactElement) => {
  return render(<IntlProvider locale='en'>{component}</IntlProvider>);
};

describe('StackedStatBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('applies correct base CSS classes', () => {
    const { container } = renderWithIntl(
      <StackedStatBlock
        lowerTitle='Current:'
        lowerUnit='A'
        lowerValue={10}
        upperTitle='Voltage:'
        upperUnit='V'
        upperValue={240}
      />,
    );

    const component = container.querySelector('.flex.flex-col');
    expect(component).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = renderWithIntl(
      <StackedStatBlock
        className='custom-stat-block'
        lowerTitle='Test'
        lowerUnit='units'
        lowerValue={5}
        upperTitle='Test'
        upperUnit='units'
        upperValue={10}
      />,
    );

    const component = container.querySelector('.custom-stat-block');
    expect(component).toBeInTheDocument();
  });

  test('handles onClick functionality', () => {
    const mockOnClick = vi.fn();
    const { container } = renderWithIntl(
      <StackedStatBlock
        lowerTitle='Test'
        lowerUnit='units'
        lowerValue={5}
        onClick={mockOnClick}
        upperTitle='Test'
        upperUnit='units'
        upperValue={10}
      />,
    );

    const component = container.querySelector('.flex.flex-col');
    if (component) {
      fireEvent.click(component);
    }

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('adds cursor-pointer class when onClick is provided', () => {
    const mockOnClick = vi.fn();
    const { container } = renderWithIntl(
      <StackedStatBlock
        lowerTitle='Test'
        lowerUnit='units'
        lowerValue={5}
        onClick={mockOnClick}
        upperTitle='Test'
        upperUnit='units'
        upperValue={10}
      />,
    );

    const component = container.querySelector('.flex.flex-col');
    expect(component).toHaveClass('cursor-pointer');
  });

  test('does not add cursor-pointer class when onClick is not provided', () => {
    const { container } = renderWithIntl(
      <StackedStatBlock
        lowerTitle='Test'
        lowerUnit='units'
        lowerValue={5}
        upperTitle='Test'
        upperUnit='units'
        upperValue={10}
      />,
    );

    const component = container.querySelector('.flex.flex-col');
    expect(component).not.toHaveClass('cursor-pointer');
  });

  test('does not display tooltip when hover values equal display values', () => {
    renderWithIntl(
      <StackedStatBlock
        lowerHover={1.5}
        lowerHoverUnit='kW'
        lowerTitle='Power:'
        lowerUnit='kW'
        lowerValue={1.5}
        upperHover={5}
        upperHoverUnit='kWh'
        upperTitle='Energy:'
        upperUnit='kWh'
        upperValue={5}
      />,
    );

    const tooltips = document.querySelectorAll('[data-testid="tippy-wrapper"]');
    expect(tooltips).toHaveLength(0);
  });

  test('does not display tooltip when hover is -1', () => {
    renderWithIntl(
      <StackedStatBlock
        lowerHover={-1}
        lowerHoverUnit='W'
        lowerTitle='Power:'
        lowerUnit='kW'
        lowerValue={1.5}
        upperHover={-1}
        upperHoverUnit='Wh'
        upperTitle='Energy:'
        upperUnit='kWh'
        upperValue={5}
      />,
    );

    const tooltips = document.querySelectorAll('[data-testid="tippy-wrapper"]');
    expect(tooltips).toHaveLength(0);
  });

  test('applies correct text styling classes to upper section', () => {
    const { container } = renderWithIntl(
      <StackedStatBlock
        lowerTitle='Test'
        lowerUnit='units'
        lowerValue={5}
        upperTitle='Test'
        upperUnit='units'
        upperValue={10}
      />,
    );

    const upperSection = container.querySelector(
      '.text-sm.text-black.dark\\:text-gray-100.xs\\:text-base',
    );
    expect(upperSection).toBeInTheDocument();
    expect(upperSection).toHaveClass(
      'flex',
      'flex-row',
      'flex-wrap',
      'space-x-1',
      'text-end',
    );
  });

  test('applies correct text styling classes to lower section', () => {
    const { container } = renderWithIntl(
      <StackedStatBlock
        lowerTitle='Test'
        lowerUnit='units'
        lowerValue={5}
        upperTitle='Test'
        upperUnit='units'
        upperValue={10}
      />,
    );

    const lowerSection = container.querySelector('.average-output');
    expect(lowerSection).toBeInTheDocument();
    expect(lowerSection).toHaveClass(
      'flex',
      'flex-row',
      'flex-wrap',
      'space-x-1',
      'text-end',
      'text-base',
      'font-bold',
      'text-black',
      'dark:text-gray-100',
      'xs:text-lg',
    );
  });

  test('unit styling has correct classes', () => {
    const { container } = renderWithIntl(
      <StackedStatBlock
        lowerTitle='Power:'
        lowerUnit='kW'
        lowerValue={10}
        upperTitle='Energy:'
        upperUnit='kWh'
        upperValue={50}
      />,
    );

    const unitSpans = container.querySelectorAll('.text-sm.text-gray-400');
    expect(unitSpans).toHaveLength(2);
    unitSpans.forEach((span) => {
      expect(span).toHaveTextContent(/k[W|W]h?/);
    });
  });
});
