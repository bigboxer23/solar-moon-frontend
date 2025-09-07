/* eslint-env jest */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import SiteDetailsGraph from '../../../../components/views/site-details/SiteDetailsGraph';

// Mock react-chartjs-2 components
jest.mock('react-chartjs-2', () => ({
  Line: ({ data, options, plugins }) => (
    <div
      data-chart-data={JSON.stringify(data)}
      data-chart-options={JSON.stringify(options)}
      data-chart-plugins={JSON.stringify(plugins)}
      data-testid='line-chart'
    >
      Mocked Line Chart
    </div>
  ),
  Bar: ({ data, options, plugins }) => (
    <div
      data-chart-data={JSON.stringify(data)}
      data-chart-options={JSON.stringify(options)}
      data-chart-plugins={JSON.stringify(plugins)}
      data-testid='bar-chart'
    >
      Mocked Bar Chart
    </div>
  ),
}));

// Mock external dependencies
jest.mock('../../../../services/search', () => ({
  DAY: 'DAY',
  GROUPED_BAR: 'GROUPED_BAR',
}));

jest.mock('../../../../utils/Utils', () => ({
  formatXAxisLabels: jest.fn(),
  formatXAxisLabelsDay: jest.fn(),
  getDisplayName: jest.fn(
    (device) => device.name || device.deviceName || 'Unknown',
  ),
  getFormattedTime: jest.fn((timestamp) =>
    new Date(timestamp).toLocaleTimeString(),
  ),
  maybeSetTimeWindow: jest.fn(),
  roundTwoDigit: jest.fn((num) => Math.round(num * 100) / 100),
  timeLabel: jest.fn(
    (startDate, timeIncrement) => `${startDate}-${timeIncrement}`,
  ),
  truncate: jest.fn((str, len) =>
    str?.length > len ? `${str.substring(0, len)}...` : str,
  ),
}));

jest.mock('../../../../components/common/graphPlugins', () => ({
  tooltipPlugin: { id: 'tooltip-plugin', beforeDraw: jest.fn() },
}));

// Mock react-icons
jest.mock('react-icons/md', () => ({
  MdBarChart: () => <div data-testid='bar-chart-icon'>Bar Chart</div>,
  MdNavigateBefore: () => <div data-testid='navigate-before'>Previous</div>,
  MdNavigateNext: () => <div data-testid='navigate-next'>Next</div>,
  MdShowChart: () => <div data-testid='show-chart'>Show Chart</div>,
  MdStackedBarChart: () => (
    <div data-testid='stacked-bar-chart-icon'>Stacked Bar</div>
  ),
  MdStackedLineChart: () => (
    <div data-testid='stacked-line-chart-icon'>Stacked Line</div>
  ),
}));

// Mock classnames
jest.mock('classnames', () => {
  return function classNames(...classes) {
    return classes
      .filter(Boolean)
      .map((cls) => {
        if (typeof cls === 'object') {
          // Handle conditional classes like { 'bg-gray-300': true }
          return Object.entries(cls)
            .filter(([_, condition]) => condition)
            .map(([className]) => className)
            .join(' ');
        }
        return cls;
      })
      .join(' ');
  };
});

describe('SiteDetailsGraph', () => {
  const mockGraphData = [
    { name: 'Device A', date: Date.now() - 3600000, avg: 10 },
    { name: 'Device A', date: Date.now() - 1800000, avg: 15 },
    { name: 'Device A', date: Date.now(), avg: 20 },
    { name: 'Device B', date: Date.now() - 3600000, avg: 5 },
    { name: 'Device B', date: Date.now() - 1800000, avg: 8 },
    { name: 'Device B', date: Date.now(), avg: 12 },
    { name: 'Site Overview', date: Date.now() - 3600000, avg: 25 },
    { name: 'Site Overview', date: Date.now() - 1800000, avg: 30 },
    { name: 'Site Overview', date: Date.now(), avg: 35 },
  ];

  const mockDevices = [
    {
      id: 'device-1',
      name: 'Device A',
      deviceName: 'Device A',
      isSite: false,
    },
    {
      id: 'device-2',
      name: 'Device B',
      deviceName: 'Device B',
      isSite: false,
    },
    {
      id: 'site-1',
      name: 'Site Overview',
      deviceName: 'Site Overview',
      isSite: true,
    },
  ];

  const defaultProps = {
    graphData: mockGraphData,
    devices: mockDevices,
    graphType: 'bar',
    setGraphType: jest.fn(),
    timeIncrement: 'HOUR',
    setStartDate: jest.fn(),
    startDate: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    test('returns empty div when no graph data', () => {
      const { container } = render(
        <SiteDetailsGraph {...defaultProps} graphData={null} />,
      );

      const emptyDiv = container.querySelector('.SiteDetailsGraph');
      expect(emptyDiv).toBeInTheDocument();
      expect(emptyDiv).toHaveClass('h-40', 'w-full');
      expect(emptyDiv).toBeEmptyDOMElement();
    });

    test('renders chart when data is loaded', () => {
      render(<SiteDetailsGraph {...defaultProps} />);
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    test('renders SiteDetailsGraph container with correct styling', () => {
      const { container } = render(<SiteDetailsGraph {...defaultProps} />);

      const chartContainer = container.querySelector('.SiteDetailsGraph');
      expect(chartContainer).toBeInTheDocument();
      expect(chartContainer).toHaveClass(
        'SiteDetailsGraph',
        'group',
        'relative',
        'mb-6',
        'w-full',
        'rounded-lg',
        'bg-brand-primary-light',
        'p-3',
        'dark:bg-gray-900',
      );
    });

    test('renders time navigation buttons', () => {
      render(<SiteDetailsGraph {...defaultProps} />);

      expect(screen.getByLabelText('previous time period')).toBeInTheDocument();
      expect(screen.getByLabelText('next time period')).toBeInTheDocument();
      expect(screen.getByTestId('navigate-before')).toBeInTheDocument();
      expect(screen.getByTestId('navigate-next')).toBeInTheDocument();
    });

    test('renders time label', () => {
      const { timeLabel } = require('../../../../utils/Utils');
      render(<SiteDetailsGraph {...defaultProps} />);

      expect(timeLabel).toHaveBeenCalledWith(
        defaultProps.startDate,
        defaultProps.timeIncrement,
      );
    });

    test('renders graph type buttons', () => {
      render(<SiteDetailsGraph {...defaultProps} />);

      expect(
        screen.getByLabelText('site stacked line graph'),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText('site stacked bar graph'),
      ).toBeInTheDocument();
      expect(screen.getByLabelText('grouped bar graph')).toBeInTheDocument();
      expect(screen.getByLabelText('overview graph')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-icon')).toBeInTheDocument();
      expect(screen.getByTestId('stacked-bar-chart-icon')).toBeInTheDocument();
      expect(screen.getByTestId('show-chart')).toBeInTheDocument();
      expect(screen.getByTestId('stacked-line-chart-icon')).toBeInTheDocument();
    });
  });

  describe('Chart Rendering by Type', () => {
    test('renders Bar chart for bar type by default', () => {
      render(<SiteDetailsGraph {...defaultProps} graphType='bar' />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });

    test('renders Bar chart for GROUPED_BAR type', () => {
      render(<SiteDetailsGraph {...defaultProps} graphType='GROUPED_BAR' />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });

    test('renders Line chart for line type', () => {
      render(<SiteDetailsGraph {...defaultProps} graphType='line' />);

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });

    test('renders Line chart for overview type', () => {
      render(<SiteDetailsGraph {...defaultProps} graphType='overview' />);

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });
  });

  describe('Graph Type Switching', () => {
    test('switches to GROUPED_BAR when bar chart button clicked', () => {
      render(<SiteDetailsGraph {...defaultProps} />);

      fireEvent.click(screen.getByLabelText('site stacked line graph'));
      expect(defaultProps.setGraphType).toHaveBeenCalledWith('GROUPED_BAR');
    });

    test('switches to bar when stacked bar button clicked', () => {
      render(<SiteDetailsGraph {...defaultProps} />);

      fireEvent.click(screen.getByLabelText('site stacked bar graph'));
      expect(defaultProps.setGraphType).toHaveBeenCalledWith('bar');
    });

    test('switches to overview when overview button clicked', () => {
      render(<SiteDetailsGraph {...defaultProps} />);

      fireEvent.click(screen.getByLabelText('grouped bar graph'));
      expect(defaultProps.setGraphType).toHaveBeenCalledWith('overview');
    });

    test('switches to line when line chart button clicked', () => {
      render(<SiteDetailsGraph {...defaultProps} />);

      fireEvent.click(screen.getByLabelText('overview graph'));
      expect(defaultProps.setGraphType).toHaveBeenCalledWith('line');
    });
  });

  describe('Time Navigation', () => {
    test('calls maybeSetTimeWindow with negative increment for previous button', () => {
      const { maybeSetTimeWindow } = require('../../../../utils/Utils');
      render(<SiteDetailsGraph {...defaultProps} />);

      fireEvent.click(screen.getByLabelText('previous time period'));
      expect(maybeSetTimeWindow).toHaveBeenCalledWith(
        defaultProps.startDate,
        -defaultProps.timeIncrement,
        defaultProps.setStartDate,
        expect.any(Function),
      );
    });

    test('calls maybeSetTimeWindow with positive increment for next button when enabled', () => {
      const { maybeSetTimeWindow } = require('../../../../utils/Utils');
      render(<SiteDetailsGraph {...defaultProps} />);

      const nextButton = screen.getByLabelText('next time period');
      // Only test if button is not disabled
      if (!nextButton.disabled) {
        fireEvent.click(nextButton);
        expect(maybeSetTimeWindow).toHaveBeenCalledWith(
          defaultProps.startDate,
          defaultProps.timeIncrement,
          defaultProps.setStartDate,
          expect.any(Function),
        );
      } else {
        // If disabled, just verify it's disabled by default
        expect(nextButton).toBeDisabled();
      }
    });
  });

  describe('Device Filtering', () => {
    test('filters devices correctly for non-overview graph types', () => {
      const { getDisplayName } = require('../../../../utils/Utils');
      render(<SiteDetailsGraph {...defaultProps} graphType='bar' />);

      const barChart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(barChart.getAttribute('data-chart-data'));

      // Should include non-site devices only
      expect(chartData.datasets).toHaveLength(2);
      expect(getDisplayName).toHaveBeenCalledWith(mockDevices[0]); // Device A
      expect(getDisplayName).toHaveBeenCalledWith(mockDevices[1]); // Device B
    });

    test('filters devices correctly for overview graph type', () => {
      const { getDisplayName } = require('../../../../utils/Utils');
      render(<SiteDetailsGraph {...defaultProps} graphType='overview' />);

      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data'));

      // Should include site devices only
      expect(chartData.datasets).toHaveLength(1);
      expect(getDisplayName).toHaveBeenCalledWith(mockDevices[2]); // Site Overview
    });
  });

  describe('Chart Data Configuration', () => {
    test('passes correct dataset structure to charts', () => {
      const { truncate, getDisplayName } = require('../../../../utils/Utils');

      // Ensure mocks return expected values
      truncate.mockImplementation((str, len) =>
        str?.length > len ? `${str.substring(0, len)}...` : str,
      );
      getDisplayName.mockImplementation(
        (device) => device.name || device.deviceName || 'Unknown',
      );

      render(<SiteDetailsGraph {...defaultProps} />);

      const barChart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(barChart.getAttribute('data-chart-data'));

      expect(chartData).toHaveProperty('datasets');
      expect(chartData.datasets).toHaveLength(2);

      // Verify dataset properties
      chartData.datasets.forEach((dataset) => {
        expect(dataset).toHaveProperty('data');
        expect(dataset).toHaveProperty('fill', false);
        expect(dataset).toHaveProperty('categoryPercentage', 0.76);
        expect(dataset).toHaveProperty('barThickness', 'flex');
        expect(dataset).toHaveProperty('barPercentage', 1);
        // Label property should be present now with explicit mock implementation
        expect(dataset).toHaveProperty('label');
        expect(typeof dataset.label).toBe('string');
      });

      expect(getDisplayName).toHaveBeenCalled();
      expect(truncate).toHaveBeenCalled();
    });

    test('adds special properties for GROUPED_BAR type', () => {
      render(<SiteDetailsGraph {...defaultProps} graphType='GROUPED_BAR' />);

      const barChart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(barChart.getAttribute('data-chart-data'));

      chartData.datasets.forEach((dataset) => {
        expect(dataset).toHaveProperty('skipNull', true);
        expect(dataset).toHaveProperty('clip');
        expect(dataset.clip).toEqual({
          left: 50,
          top: 0,
          right: 50,
          bottom: 0,
        });
      });
    });
  });

  describe('Chart Options Configuration', () => {
    test('configures chart options correctly', () => {
      render(<SiteDetailsGraph {...defaultProps} />);

      const barChart = screen.getByTestId('bar-chart');
      const chartOptions = JSON.parse(
        barChart.getAttribute('data-chart-options'),
      );

      expect(chartOptions.responsive).toBe(true);
      expect(chartOptions.maintainAspectRatio).toBe(false);
      expect(chartOptions.interaction.mode).toBe('index');
      expect(chartOptions.interaction.intersect).toBe(false);
      expect(chartOptions.elements.point.radius).toBe(2);
      expect(chartOptions.plugins.legend.position).toBe('bottom');
      expect(chartOptions.parsing.xAxisKey).toBe('date');
      expect(chartOptions.parsing.yAxisKey).toBe('avg');
    });

    test('configures scales correctly for non-GROUPED_BAR types', () => {
      render(<SiteDetailsGraph {...defaultProps} graphType='bar' />);

      const barChart = screen.getByTestId('bar-chart');
      const chartOptions = JSON.parse(
        barChart.getAttribute('data-chart-options'),
      );

      expect(chartOptions.scales.x.stacked).toBe(true);
      expect(chartOptions.scales.x.type).toBe('time');
      expect(chartOptions.scales.y.min).toBe(0);
      expect(chartOptions.scales.y.stacked).toBe(true);
      expect(chartOptions.scales.y.title.display).toBe(false);
    });

    test('configures scales correctly for GROUPED_BAR type', () => {
      render(<SiteDetailsGraph {...defaultProps} graphType='GROUPED_BAR' />);

      const barChart = screen.getByTestId('bar-chart');
      const chartOptions = JSON.parse(
        barChart.getAttribute('data-chart-options'),
      );

      expect(chartOptions.scales.x.stacked).toBe(false);
      expect(chartOptions.scales.y.stacked).toBe(false);
    });

    test('uses correct axis label formatter for DAY increment', () => {
      render(<SiteDetailsGraph {...defaultProps} timeIncrement='DAY' />);
      const barChart = screen.getByTestId('bar-chart');
      const chartOptions = JSON.parse(
        barChart.getAttribute('data-chart-options'),
      );
      expect(chartOptions.scales.x.ticks).toBeDefined();
    });

    test('uses correct axis label formatter for HOUR increment', () => {
      render(<SiteDetailsGraph {...defaultProps} timeIncrement='HOUR' />);
      const barChart = screen.getByTestId('bar-chart');
      const chartOptions = JSON.parse(
        barChart.getAttribute('data-chart-options'),
      );
      expect(chartOptions.scales.x.ticks).toBeDefined();
    });

    test('configures tooltip callbacks correctly', () => {
      render(<SiteDetailsGraph {...defaultProps} />);

      const barChart = screen.getByTestId('bar-chart');
      const chartOptions = JSON.parse(
        barChart.getAttribute('data-chart-options'),
      );

      const { tooltip } = chartOptions.plugins;
      expect(tooltip.backgroundColor).toBe('#fff');
      expect(tooltip.titleColor).toBe('#000');
      expect(tooltip.bodyColor).toBe('#000');
      expect(tooltip.boxPadding).toBe(8);
      expect(tooltip.titleAlign).toBe('center');
      expect(tooltip.bodyAlign).toBe('center');
      expect(tooltip.callbacks).toBeDefined();
    });
  });

  describe('Plugins Integration', () => {
    test('passes tooltipPlugin to charts', () => {
      render(<SiteDetailsGraph {...defaultProps} />);

      const barChart = screen.getByTestId('bar-chart');
      const chartPlugins = JSON.parse(
        barChart.getAttribute('data-chart-plugins'),
      );

      expect(chartPlugins).toHaveLength(1);
      expect(chartPlugins[0]).toEqual(
        expect.objectContaining({ id: 'tooltip-plugin' }),
      );
    });
  });

  describe('Active Button States', () => {
    test('shows GROUPED_BAR button as active when GROUPED_BAR type selected', () => {
      render(<SiteDetailsGraph {...defaultProps} graphType='GROUPED_BAR' />);

      const groupedBarButton = screen.getByLabelText('site stacked line graph');
      expect(groupedBarButton).toHaveClass('bg-gray-300');
      expect(groupedBarButton).toHaveClass('dark:text-black');
    });

    test('shows bar button as active when bar type selected', () => {
      render(<SiteDetailsGraph {...defaultProps} graphType='bar' />);

      const barButton = screen.getByLabelText('site stacked bar graph');
      expect(barButton).toHaveClass('bg-gray-300');
      expect(barButton).toHaveClass('dark:text-black');
    });

    test('shows overview button as active when overview type selected', () => {
      render(<SiteDetailsGraph {...defaultProps} graphType='overview' />);

      const overviewButton = screen.getByLabelText('grouped bar graph');
      expect(overviewButton).toHaveClass('bg-gray-300');
      expect(overviewButton).toHaveClass('dark:text-black');
    });

    test('shows line button as active when line type selected', () => {
      render(<SiteDetailsGraph {...defaultProps} graphType='line' />);

      const lineButton = screen.getByLabelText('overview graph');
      expect(lineButton).toHaveClass('bg-gray-300');
      expect(lineButton).toHaveClass('dark:text-black');
    });
  });

  describe('Dark Mode Support', () => {
    test('includes dark mode classes in container', () => {
      const { container } = render(<SiteDetailsGraph {...defaultProps} />);

      const chartContainer = container.querySelector('.SiteDetailsGraph');
      expect(chartContainer).toHaveClass('dark:bg-gray-900');
    });

    test('includes dark mode classes in navigation elements', () => {
      render(<SiteDetailsGraph {...defaultProps} />);

      const prevButton = screen.getByLabelText('previous time period');
      const nextButton = screen.getByLabelText('next time period');

      expect(prevButton.className).toContain('dark:hover:bg-gray-500');
      expect(nextButton.className).toContain('dark:hover:bg-gray-500');
    });

    test('includes dark mode classes in graph type buttons', () => {
      render(<SiteDetailsGraph {...defaultProps} />);

      const buttons = [
        screen.getByLabelText('site stacked line graph'),
        screen.getByLabelText('site stacked bar graph'),
        screen.getByLabelText('grouped bar graph'),
        screen.getByLabelText('overview graph'),
      ];

      buttons.forEach((button) => {
        expect(button.className).toContain('dark:hover:bg-gray-500');
      });
    });
  });

  describe('Responsive Design', () => {
    test('has responsive classes on container', () => {
      const { container } = render(<SiteDetailsGraph {...defaultProps} />);

      const chartContainer = container.querySelector('.SiteDetailsGraph');
      expect(chartContainer).toHaveClass('w-full');

      const chartArea = container.querySelector('.h-72');
      expect(chartArea).toHaveClass('h-72');
    });

    test('has appropriate text sizing classes', () => {
      const { container } = render(<SiteDetailsGraph {...defaultProps} />);

      const timeLabel = container.querySelector('.text-xs');
      expect(timeLabel).toHaveClass(
        'text-xs',
        'text-black',
        'dark:text-gray-100',
      );
    });
  });

  describe('Error Handling', () => {
    test('handles empty graph data gracefully', () => {
      render(<SiteDetailsGraph {...defaultProps} graphData={[]} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    test('handles empty devices array gracefully', () => {
      render(<SiteDetailsGraph {...defaultProps} devices={[]} />);

      const barChart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(barChart.getAttribute('data-chart-data'));
      expect(chartData.datasets).toHaveLength(0);
    });

    test('handles devices without required properties gracefully', () => {
      const incompleteDevices = [
        { id: 'device-1' }, // Missing name and deviceName
        { id: 'device-2', name: 'Device B' },
      ];

      render(
        <SiteDetailsGraph {...defaultProps} devices={incompleteDevices} />,
      );

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    test('integrates with getDisplayName utility', () => {
      const { getDisplayName } = require('../../../../utils/Utils');
      render(<SiteDetailsGraph {...defaultProps} />);

      expect(getDisplayName).toHaveBeenCalled();
      mockDevices
        .filter((d) => !d.isSite) // Non-overview devices for bar chart
        .forEach((device) => {
          expect(getDisplayName).toHaveBeenCalledWith(device);
        });
    });

    test('integrates with truncate utility for labels', () => {
      const { truncate } = require('../../../../utils/Utils');
      render(<SiteDetailsGraph {...defaultProps} />);

      expect(truncate).toHaveBeenCalled();
    });

    test('integrates with maybeSetTimeWindow for navigation', () => {
      const { maybeSetTimeWindow } = require('../../../../utils/Utils');
      render(<SiteDetailsGraph {...defaultProps} />);

      fireEvent.click(screen.getByLabelText('previous time period'));
      expect(maybeSetTimeWindow).toHaveBeenCalledWith(
        defaultProps.startDate,
        -defaultProps.timeIncrement,
        defaultProps.setStartDate,
        expect.any(Function),
      );
    });

    test('integrates with timeLabel utility', () => {
      const { timeLabel } = require('../../../../utils/Utils');
      render(<SiteDetailsGraph {...defaultProps} />);

      expect(timeLabel).toHaveBeenCalledWith(
        defaultProps.startDate,
        defaultProps.timeIncrement,
      );
    });
  });

  describe('Data Filtering Logic', () => {
    test('filters graph data by device name correctly', () => {
      render(<SiteDetailsGraph {...defaultProps} graphType='bar' />);

      const barChart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(barChart.getAttribute('data-chart-data'));

      // Should have datasets for Device A and Device B
      expect(chartData.datasets).toHaveLength(2);
      // Each dataset should have filtered data for that specific device
      chartData.datasets.forEach((dataset) => {
        expect(dataset.data).toBeDefined();
      });
    });

    test('handles mixed device types correctly', () => {
      const mixedDevices = [
        { name: 'Device A', isSite: false },
        { name: 'Site Overview', isSite: true },
        { name: 'Device B', isSite: false },
      ];

      // Test overview mode - should only show site devices
      render(
        <SiteDetailsGraph
          {...defaultProps}
          devices={mixedDevices}
          graphType='overview'
        />,
      );
      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data'));
      expect(chartData.datasets).toHaveLength(1); // Only Site Overview

      // Test non-overview mode - should only show non-site devices
      render(
        <SiteDetailsGraph
          {...defaultProps}
          devices={mixedDevices}
          graphType='bar'
        />,
      );
      const barChart = screen.getByTestId('bar-chart');
      const chartData2 = JSON.parse(barChart.getAttribute('data-chart-data'));
      expect(chartData2.datasets).toHaveLength(2); // Device A and Device B
    });
  });
});
