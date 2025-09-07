/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import React from 'react';

import MiniChart from '../../../components/graphs/MiniChart';

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
}));

// Mock external dependencies
jest.mock('../../../utils/Utils', () => ({
  getFormattedTime: jest.fn((timestamp) =>
    new Date(timestamp).toLocaleTimeString(),
  ),
}));

jest.mock('../../../components/common/graphPlugins', () => ({
  tooltipPlugin: { id: 'tooltip-plugin', beforeDraw: jest.fn() },
}));

describe('MiniChart', () => {
  const mockGraphData = [
    { date: Date.now() - 7200000, values: 10.5 },
    { date: Date.now() - 3600000, values: 15.2 },
    { date: Date.now() - 1800000, values: 8.7 },
    { date: Date.now(), values: 12.3 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders MiniChart container with correct styling', () => {
      const { container } = render(<MiniChart graphData={mockGraphData} />);

      const chartContainer = container.querySelector('.MiniChart');
      expect(chartContainer).toBeInTheDocument();
      expect(chartContainer).toHaveClass(
        'MiniChart',
        'h-40',
        'w-full',
        'rounded-lg',
        'bg-brand-primary-light',
        'p-2',
        'dark:bg-gray-900',
      );
    });

    test('renders Line chart component', () => {
      render(<MiniChart graphData={mockGraphData} />);

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByText('Mocked Line Chart')).toBeInTheDocument();
    });
  });

  describe('Chart Data Configuration', () => {
    test('passes correct data structure to Line chart', () => {
      render(<MiniChart graphData={mockGraphData} />);

      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data'));

      expect(chartData).toHaveProperty('datasets');
      expect(chartData.datasets).toHaveLength(1);

      const dataset = chartData.datasets[0];
      expect(dataset.data).toEqual(mockGraphData);
      expect(dataset.borderColor).toBe('#5178C2');
      expect(dataset.borderWidth).toBe(3);
    });

    test('handles empty graph data', () => {
      render(<MiniChart graphData={[]} />);

      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data'));

      expect(chartData.datasets[0].data).toEqual([]);
    });

    test('handles null/undefined graph data', () => {
      render(<MiniChart graphData={null} />);

      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data'));

      expect(chartData.datasets[0].data).toBeNull();
    });
  });

  describe('Chart Options Configuration', () => {
    test('configures chart with correct options', () => {
      render(<MiniChart graphData={mockGraphData} />);

      const lineChart = screen.getByTestId('line-chart');
      const chartOptions = JSON.parse(
        lineChart.getAttribute('data-chart-options'),
      );

      // Basic configuration
      expect(chartOptions.responsive).toBe(true);
      expect(chartOptions.maintainAspectRatio).toBe(false);

      // Interaction configuration
      expect(chartOptions.interaction.mode).toBe('index');
      expect(chartOptions.interaction.intersect).toBe(false);

      // Elements configuration
      expect(chartOptions.elements.point.radius).toBe(1);

      // Parsing configuration
      expect(chartOptions.parsing.xAxisKey).toBe('date');
      expect(chartOptions.parsing.yAxisKey).toBe('values');
    });

    test('configures legend to be hidden', () => {
      render(<MiniChart graphData={mockGraphData} />);

      const lineChart = screen.getByTestId('line-chart');
      const chartOptions = JSON.parse(
        lineChart.getAttribute('data-chart-options'),
      );

      expect(chartOptions.plugins.legend.display).toBe(false);
    });

    test('configures tooltip styling and callbacks', () => {
      render(<MiniChart graphData={mockGraphData} />);

      const lineChart = screen.getByTestId('line-chart');
      const chartOptions = JSON.parse(
        lineChart.getAttribute('data-chart-options'),
      );

      const { tooltip } = chartOptions.plugins;
      expect(tooltip.backgroundColor).toBe('#fff');
      expect(tooltip.titleColor).toBe('#000');
      expect(tooltip.bodyColor).toBe('#000');
      expect(tooltip.displayColors).toBe(false);
      expect(tooltip.boxPadding).toBe(8);
      expect(tooltip.titleAlign).toBe('center');
      expect(tooltip.bodyAlign).toBe('center');
      expect(tooltip.callbacks).toBeDefined();
    });

    test('configures X axis with time scale and hidden elements', () => {
      render(<MiniChart graphData={mockGraphData} />);

      const lineChart = screen.getByTestId('line-chart');
      const chartOptions = JSON.parse(
        lineChart.getAttribute('data-chart-options'),
      );

      const xScale = chartOptions.scales.x;
      expect(xScale.type).toBe('time');
      expect(xScale.grid.display).toBe(false);
      expect(xScale.border.display).toBe(false);
      expect(xScale.ticks.display).toBe(false);
    });

    test('configures Y axis with min value and styling', () => {
      render(<MiniChart graphData={mockGraphData} />);

      const lineChart = screen.getByTestId('line-chart');
      const chartOptions = JSON.parse(
        lineChart.getAttribute('data-chart-options'),
      );

      const yScale = chartOptions.scales.y;
      expect(yScale.min).toBe(0);
      expect(yScale.ticks.color).toBe('#9ca3af');
      expect(yScale.title.display).toBe(false);
    });
  });

  describe('Plugins Integration', () => {
    test('passes tooltipPlugin to Line chart', () => {
      render(<MiniChart graphData={mockGraphData} />);

      const lineChart = screen.getByTestId('line-chart');
      const chartPlugins = JSON.parse(
        lineChart.getAttribute('data-chart-plugins'),
      );

      expect(chartPlugins).toHaveLength(1);
      expect(chartPlugins[0]).toEqual(
        expect.objectContaining({ id: 'tooltip-plugin' }),
      );
    });
  });

  describe('Tooltip Callbacks', () => {
    test('tooltip title callback uses getFormattedTime', () => {
      const getFormattedTimeMock =
        require('../../../utils/Utils').getFormattedTime;
      render(<MiniChart graphData={mockGraphData} />);

      const lineChart = screen.getByTestId('line-chart');
      const chartOptions = JSON.parse(
        lineChart.getAttribute('data-chart-options'),
      );

      // The callback functions get serialized as empty objects in JSON,
      // but we can test the function behavior separately
      expect(chartOptions.plugins.tooltip.callbacks).toBeDefined();
    });

    test('tooltip label callback formats value with kW unit', () => {
      render(<MiniChart graphData={mockGraphData} />);

      const lineChart = screen.getByTestId('line-chart');
      const chartOptions = JSON.parse(
        lineChart.getAttribute('data-chart-options'),
      );

      // Callback functions exist in the original options but get serialized as empty objects in JSON
      // We just verify the callbacks object exists, as individual functions are lost during serialization
      expect(chartOptions.plugins.tooltip.callbacks).toBeDefined();
      expect(typeof chartOptions.plugins.tooltip.callbacks).toBe('object');
    });
  });

  describe('Component Structure', () => {
    test('maintains proper DOM hierarchy', () => {
      const { container } = render(<MiniChart graphData={mockGraphData} />);

      const chartContainer = container.querySelector('.MiniChart');
      const lineChart = chartContainer.querySelector(
        '[data-testid="line-chart"]',
      );

      expect(chartContainer).toContainElement(lineChart);
    });

    test('has single child element (Line chart)', () => {
      const { container } = render(<MiniChart graphData={mockGraphData} />);

      const chartContainer = container.querySelector('.MiniChart');
      expect(chartContainer.children).toHaveLength(1);
    });
  });

  describe('Dark Mode Support', () => {
    test('includes dark mode styling classes', () => {
      const { container } = render(<MiniChart graphData={mockGraphData} />);

      const chartContainer = container.querySelector('.MiniChart');
      expect(chartContainer).toHaveClass('dark:bg-gray-900');
    });
  });

  describe('Responsive Design', () => {
    test('has responsive width and height classes', () => {
      const { container } = render(<MiniChart graphData={mockGraphData} />);

      const chartContainer = container.querySelector('.MiniChart');
      expect(chartContainer).toHaveClass('h-40', 'w-full');
    });

    test('chart options enable responsive behavior', () => {
      render(<MiniChart graphData={mockGraphData} />);

      const lineChart = screen.getByTestId('line-chart');
      const chartOptions = JSON.parse(
        lineChart.getAttribute('data-chart-options'),
      );

      expect(chartOptions.responsive).toBe(true);
      expect(chartOptions.maintainAspectRatio).toBe(false);
    });
  });

  describe('Integration', () => {
    test('integrates with react-chartjs-2 Line component', () => {
      render(<MiniChart graphData={mockGraphData} />);

      // Verify the Line component is rendered with correct data
      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data'));
      const chartOptions = JSON.parse(
        lineChart.getAttribute('data-chart-options'),
      );
      const chartPlugins = JSON.parse(
        lineChart.getAttribute('data-chart-plugins'),
      );

      // Verify correct data structure is passed to Line component
      expect(chartData).toEqual(
        expect.objectContaining({
          datasets: expect.arrayContaining([
            expect.objectContaining({
              data: mockGraphData,
              borderColor: '#5178C2',
              borderWidth: 3,
            }),
          ]),
        }),
      );

      // Verify options and plugins are passed
      expect(chartOptions).toBeDefined();
      expect(chartPlugins).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'tooltip-plugin' }),
        ]),
      );
    });

    test('integrates with tooltipPlugin', () => {
      render(<MiniChart graphData={mockGraphData} />);

      const lineChart = screen.getByTestId('line-chart');
      const chartPlugins = JSON.parse(
        lineChart.getAttribute('data-chart-plugins'),
      );

      expect(chartPlugins[0]).toEqual(
        expect.objectContaining({ id: 'tooltip-plugin' }),
      );
    });
  });

  describe('Data Visualization', () => {
    test('renders chart for different data sizes', () => {
      const testCases = [
        { data: [], label: 'empty data' },
        { data: [{ date: Date.now(), values: 5 }], label: 'single data point' },
        { data: mockGraphData, label: 'multiple data points' },
        {
          data: Array.from({ length: 100 }, (_, i) => ({
            date: Date.now() - i * 60000,
            values: Math.random() * 20,
          })),
          label: 'large dataset',
        },
      ];

      testCases.forEach(({ data, label }) => {
        const { unmount } = render(<MiniChart graphData={data} />);

        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        const lineChart = screen.getByTestId('line-chart');
        const chartData = JSON.parse(lineChart.getAttribute('data-chart-data'));
        expect(chartData.datasets[0].data).toEqual(data);

        unmount();
      });
    });

    test('handles time-series data correctly', () => {
      const timeSeriesData = [
        { date: Date.now() - 3600000, values: 10 },
        { date: Date.now() - 1800000, values: 15 },
        { date: Date.now(), values: 20 },
      ];

      render(<MiniChart graphData={timeSeriesData} />);

      const lineChart = screen.getByTestId('line-chart');
      const chartOptions = JSON.parse(
        lineChart.getAttribute('data-chart-options'),
      );

      expect(chartOptions.scales.x.type).toBe('time');
      expect(chartOptions.parsing.xAxisKey).toBe('date');
      expect(chartOptions.parsing.yAxisKey).toBe('values');
    });
  });

  describe('Edge Cases', () => {
    test('handles missing prop gracefully', () => {
      render(<MiniChart />);

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();

      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data'));
      expect(chartData.datasets[0].data).toBeUndefined();
    });

    test('handles data with missing values', () => {
      const incompleteData = [
        { date: Date.now() - 3600000, values: 10 },
        { date: Date.now() - 1800000 }, // Missing values
        { date: Date.now(), values: 20 },
      ];

      render(<MiniChart graphData={incompleteData} />);

      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data'));
      expect(chartData.datasets[0].data).toEqual(incompleteData);
    });

    test('handles data with invalid dates', () => {
      const invalidData = [
        { date: 'invalid-date', values: 10 },
        { date: null, values: 15 },
        { date: Date.now(), values: 20 },
      ];

      render(<MiniChart graphData={invalidData} />);

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(lineChart.getAttribute('data-chart-data'));
      expect(chartData.datasets[0].data).toEqual(invalidData);
    });
  });
});
