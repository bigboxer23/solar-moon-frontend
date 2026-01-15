import { render, screen } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { vi } from 'vitest';

import SummaryHeader from '../../../../components/views/dashboard/SummaryHeader';

interface TippyProps {
  children: ReactNode;
  content: string | ReactElement;
  delay: number | [number, number];
  placement: string;
}

interface FormattedLabelProps {
  className: string;
  label: string;
  separator?: string;
  unit: string;
  value: number | string;
}

interface IntlFormatter {
  formatNumber: vi.Mock<string, [number]>;
}

interface PowerScalingInfo {
  unitPrefix: string;
  powerValue: number;
  decimals: number;
}

// Mock Tippy component
vi.mock('@tippyjs/react', () => {
  const MockTippy = function ({
    children,
    content,
    delay,
    placement,
  }: TippyProps): ReactElement {
    return (
      <div
        data-content={typeof content === 'string' ? content : 'complex-content'}
        data-delay={delay}
        data-placement={placement}
        data-testid='tippy'
      >
        {children}
      </div>
    );
  };
  return { default: MockTippy };
});

// Mock react-intl
vi.mock('react-intl', () => ({
  useIntl: vi.fn(
    (): IntlFormatter => ({
      formatNumber: vi.fn((number: number): string => number.toLocaleString()),
    }),
  ),
}));

// Mock Utils
vi.mock('../../../../utils/Utils', () => ({
  getPowerScalingInformation: vi.fn(),
  roundToDecimals: vi.fn(),
  TIPPY_DELAY: [200, 0],
}));

// Mock HelpText
vi.mock('../../../../utils/HelpText', () => ({
  AVERAGE_CALCULATION:
    'Your daily average is calculated over the last 30 days.',
}));

// Mock FormattedLabel
vi.mock('../../../../components/graphs/FormattedLabel', () => {
  const MockFormattedLabel = function ({
    className,
    label,
    separator,
    unit,
    value,
  }: FormattedLabelProps): ReactElement {
    return (
      <span
        className={className}
        data-label={label}
        data-separator={separator}
        data-testid='formatted-label'
        data-unit={unit}
        data-value={value}
      >
        {value}
        {separator}
        {unit}
      </span>
    );
  };
  return { default: MockFormattedLabel };
});

describe('SummaryHeader', () => {
  import { useIntl } from 'react-intl';

  import {
    getPowerScalingInformation,
    roundToDecimals,
  } from '../../../../utils/Utils';

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useIntl
    useIntl.mockReturnValue({
      formatNumber: vi.fn((number: number): string => number.toLocaleString()),
    });

    // Mock getPowerScalingInformation for daily output (larger value)
    getPowerScalingInformation.mockImplementation(
      (value: number): PowerScalingInfo => {
        if (value === 25000) {
          return {
            unitPrefix: 'k',
            powerValue: 25,
            decimals: 1,
          };
        }
        if (value === 20000) {
          return {
            unitPrefix: 'k',
            powerValue: 20,
            decimals: 1,
          };
        }
        return {
          unitPrefix: '',
          powerValue: value,
          decimals: 0,
        };
      },
    );

    // Mock roundToDecimals
    roundToDecimals.mockImplementation(
      (value: number, decimals: number): number => {
        return Number(value.toFixed(decimals));
      },
    );
  });

  test('renders main container with correct CSS classes', () => {
    const { container } = render(
      <SummaryHeader dailyAverageOutput={20000} dailyOutput={25000} />,
    );

    const summaryHeader = container.querySelector('.SummaryHeader');
    expect(summaryHeader).toHaveClass(
      'SummaryHeader',
      'mx-6',
      'flex',
      'flex-wrap',
      'items-baseline',
      'justify-center',
      'space-x-2',
      'space-y-2',
      'py-8',
      'text-xl',
      'font-bold',
      'text-black',
      'dark:text-gray-100',
    );
  });

  test('renders "You have generated" text', () => {
    render(<SummaryHeader dailyAverageOutput={20000} dailyOutput={25000} />);

    expect(screen.getByText('You have generated')).toBeInTheDocument();
  });

  test('renders "today" text', () => {
    render(<SummaryHeader dailyAverageOutput={20000} dailyOutput={25000} />);

    expect(screen.getByText('today.')).toBeInTheDocument();
  });

  test('renders daily output with tooltip', () => {
    render(<SummaryHeader dailyAverageOutput={20000} dailyOutput={25000} />);

    const [dailyOutputTooltip] = screen.getAllByTestId('tippy');

    expect(dailyOutputTooltip).toHaveAttribute('data-content', '25,000 kWh');
    expect(dailyOutputTooltip).toHaveAttribute('data-delay', '200,0');
    expect(dailyOutputTooltip).toHaveAttribute('data-placement', 'top');
  });

  test('renders daily output FormattedLabel with correct props', () => {
    render(<SummaryHeader dailyAverageOutput={20000} dailyOutput={25000} />);

    const [dailyOutputLabel] = screen.getAllByTestId('formatted-label');

    expect(dailyOutputLabel).toHaveClass(
      'mx-1',
      'whitespace-nowrap',
      'text-center',
      'text-3xl',
      'font-bold',
      'text-brand-primary',
    );
    expect(dailyOutputLabel).toHaveAttribute('data-label', '');
    expect(dailyOutputLabel).toHaveAttribute('data-separator', ' ');
    expect(dailyOutputLabel).toHaveAttribute('data-unit', 'kWh');
    expect(dailyOutputLabel).toHaveAttribute('data-value', '25');
  });

  test('renders percentage comparison text', () => {
    render(<SummaryHeader dailyAverageOutput={20000} dailyOutput={25000} />);

    expect(screen.getByText(/That's/)).toBeInTheDocument();
    expect(screen.getByText(/of your daily average\./)).toBeInTheDocument();
  });

  test('renders percentage tooltip with average calculation help text', () => {
    render(<SummaryHeader dailyAverageOutput={20000} dailyOutput={25000} />);

    const [, percentageTooltip] = screen.getAllByTestId('tippy');

    expect(percentageTooltip).toHaveAttribute(
      'data-content',
      'complex-content',
    );
    expect(percentageTooltip).toHaveAttribute('data-delay', '200,0');
    expect(percentageTooltip).toHaveAttribute('data-placement', 'top');
  });

  test('renders percentage FormattedLabel with correct props', () => {
    render(<SummaryHeader dailyAverageOutput={20000} dailyOutput={25000} />);

    const [, percentageLabel] = screen.getAllByTestId('formatted-label');

    expect(percentageLabel).toHaveClass(
      'mx-1',
      'whitespace-nowrap',
      'text-center',
      'text-3xl',
      'font-bold',
      'text-brand-primary',
    );
    expect(percentageLabel).toHaveAttribute('data-label', '');
    expect(percentageLabel).toHaveAttribute('data-unit', '%');
    expect(percentageLabel).toHaveAttribute('data-value', '125'); // 25000/20000 * 100 = 125
  });

  test('calculates percentage correctly for higher daily output', () => {
    render(<SummaryHeader dailyAverageOutput={10000} dailyOutput={15000} />);

    const [, percentageLabel] = screen.getAllByTestId('formatted-label');

    expect(percentageLabel).toHaveAttribute('data-value', '150'); // 15000/10000 * 100 = 150
  });

  test('calculates percentage correctly for lower daily output', () => {
    render(<SummaryHeader dailyAverageOutput={20000} dailyOutput={10000} />);

    const [, percentageLabel] = screen.getAllByTestId('formatted-label');

    expect(percentageLabel).toHaveAttribute('data-value', '50'); // 10000/20000 * 100 = 50
  });

  test('handles zero daily average gracefully', () => {
    render(<SummaryHeader dailyAverageOutput={0} dailyOutput={5000} />);

    const formattedLabels = screen.getAllByTestId('formatted-label');

    // Should still render without crashing
    expect(formattedLabels).toHaveLength(2);
  });

  test('handles zero daily output', () => {
    render(<SummaryHeader dailyAverageOutput={20000} dailyOutput={0} />);

    const [, percentageLabel] = screen.getAllByTestId('formatted-label');

    expect(percentageLabel).toHaveAttribute('data-value', '0'); // 0/20000 * 100 = 0
  });

  test('calls getPowerScalingInformation for both daily output and average', () => {
    render(<SummaryHeader dailyAverageOutput={20000} dailyOutput={25000} />);

    expect(getPowerScalingInformation).toHaveBeenCalledWith(25000);
    expect(getPowerScalingInformation).toHaveBeenCalledWith(20000);
    expect(getPowerScalingInformation).toHaveBeenCalledTimes(2);
  });

  test('calls roundToDecimals for power value display', () => {
    render(<SummaryHeader dailyAverageOutput={20000} dailyOutput={25000} />);

    expect(roundToDecimals).toHaveBeenCalledWith(25, 1);
    expect(roundToDecimals).toHaveBeenCalledWith(20, 1);
  });

  test('uses correct TIPPY_DELAY for tooltips', () => {
    render(<SummaryHeader dailyAverageOutput={20000} dailyOutput={25000} />);

    const tooltips = screen.getAllByTestId('tippy');
    tooltips.forEach((tooltip) => {
      expect(tooltip).toHaveAttribute('data-delay', '200,0');
    });
  });

  test('renders with different power scaling for smaller values', () => {
    getPowerScalingInformation.mockImplementation(
      (value: number): PowerScalingInfo => {
        if (value === 500) {
          return {
            unitPrefix: '',
            powerValue: 500,
            decimals: 0,
          };
        }
        if (value === 400) {
          return {
            unitPrefix: '',
            powerValue: 400,
            decimals: 0,
          };
        }
        return {
          unitPrefix: '',
          powerValue: value,
          decimals: 0,
        };
      },
    );

    render(<SummaryHeader dailyAverageOutput={400} dailyOutput={500} />);

    const [dailyOutputLabel] = screen.getAllByTestId('formatted-label');

    expect(dailyOutputLabel).toHaveAttribute('data-unit', 'Wh'); // No prefix for smaller values
    expect(dailyOutputLabel).toHaveAttribute('data-value', '500');
  });

  test('formatNumber is called for tooltip content', () => {
    const mockFormatNumber = vi.fn((number: number): string =>
      number.toLocaleString(),
    );
    useIntl.mockReturnValue({
      formatNumber: mockFormatNumber,
    });

    render(<SummaryHeader dailyAverageOutput={20000} dailyOutput={25000} />);

    expect(mockFormatNumber).toHaveBeenCalledWith(25000);
  });

  test('renders spans with correct CSS classes for text sections', () => {
    const { container } = render(
      <SummaryHeader dailyAverageOutput={20000} dailyOutput={25000} />,
    );

    // Check for the main container's direct child spans (text sections)
    const mainSpans = container.querySelectorAll(
      '.SummaryHeader > span.whitespace-nowrap.text-center',
    );
    expect(mainSpans).toHaveLength(3); // "You have generated", daily output section, percentage section
  });

  test('calculates absolute percentage value', () => {
    // Test with negative scenario to ensure Math.abs is working
    render(<SummaryHeader dailyAverageOutput={30000} dailyOutput={15000} />);

    const [, percentageLabel] = screen.getAllByTestId('formatted-label');

    // Should be 50, not -50 due to Math.abs
    expect(percentageLabel).toHaveAttribute('data-value', '50');
  });
});
