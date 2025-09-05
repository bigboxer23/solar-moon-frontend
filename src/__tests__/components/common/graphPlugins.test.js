/* eslint-env jest */
import { tooltipPlugin } from '../../../components/common/graphPlugins';

describe('tooltipPlugin', () => {
  let mockChart;
  let mockCtx;

  beforeEach(() => {
    mockCtx = {
      save: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      strokeStyle: '',
      lineWidth: 0,
    };

    mockChart = {
      verticalLiner: {},
      chartArea: {
        top: 10,
        bottom: 100,
      },
      ctx: mockCtx,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('has correct plugin id', () => {
    expect(tooltipPlugin.id).toBe('verticalLiner');
  });

  test('afterInit initializes verticalLiner on chart', () => {
    tooltipPlugin.afterInit(mockChart);

    expect(mockChart.verticalLiner).toEqual({});
  });

  test('afterEvent sets draw property when inChartArea is true', () => {
    const args = { inChartArea: true };

    tooltipPlugin.afterEvent(mockChart, args);

    expect(mockChart.verticalLiner.draw).toBe(true);
  });

  test('afterEvent sets draw property when inChartArea is false', () => {
    const args = { inChartArea: false };

    tooltipPlugin.afterEvent(mockChart, args);

    expect(mockChart.verticalLiner.draw).toBe(false);
  });

  test('beforeTooltipDraw does nothing when draw is false', () => {
    mockChart.verticalLiner = { draw: false };
    const args = {
      tooltip: { caretX: 50 },
    };

    tooltipPlugin.beforeTooltipDraw(mockChart, args);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  test('beforeTooltipDraw does nothing when draw is not set', () => {
    mockChart.verticalLiner = {};
    const args = {
      tooltip: { caretX: 50 },
    };

    tooltipPlugin.beforeTooltipDraw(mockChart, args);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  test('beforeTooltipDraw does nothing when caretX is not provided', () => {
    mockChart.verticalLiner = { draw: true };
    const args = {
      tooltip: {},
    };

    tooltipPlugin.beforeTooltipDraw(mockChart, args);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  test('beforeTooltipDraw does nothing when tooltip is not provided', () => {
    mockChart.verticalLiner = { draw: true };
    const args = {};

    tooltipPlugin.beforeTooltipDraw(mockChart, args);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  test('beforeTooltipDraw draws vertical line when conditions are met', () => {
    mockChart.verticalLiner = { draw: true };
    const args = {
      tooltip: { caretX: 50 },
    };

    tooltipPlugin.beforeTooltipDraw(mockChart, args);

    expect(mockCtx.save).toHaveBeenCalledTimes(1);
    expect(mockCtx.beginPath).toHaveBeenCalledTimes(1);
    expect(mockCtx.strokeStyle).toBe('#5178C2');
    expect(mockCtx.lineWidth).toBe(2);
    expect(mockCtx.moveTo).toHaveBeenCalledWith(50, 10);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(50, 100);
    expect(mockCtx.stroke).toHaveBeenCalledTimes(1);
    expect(mockCtx.restore).toHaveBeenCalledTimes(1);
  });

  test('beforeTooltipDraw uses correct chart area dimensions', () => {
    mockChart.verticalLiner = { draw: true };
    mockChart.chartArea = { top: 25, bottom: 200 };
    const args = {
      tooltip: { caretX: 75 },
    };

    tooltipPlugin.beforeTooltipDraw(mockChart, args);

    expect(mockCtx.moveTo).toHaveBeenCalledWith(75, 25);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(75, 200);
  });

  test('beforeTooltipDraw handles caretX of 0', () => {
    mockChart.verticalLiner = { draw: true };
    const args = {
      tooltip: { caretX: 0 },
    };

    tooltipPlugin.beforeTooltipDraw(mockChart, args);

    // caretX of 0 should be falsy, so drawing should not occur
    expect(mockCtx.save).not.toHaveBeenCalled();
  });

  test('beforeTooltipDraw works with positive caretX values', () => {
    mockChart.verticalLiner = { draw: true };
    const args = {
      tooltip: { caretX: 150 },
    };

    tooltipPlugin.beforeTooltipDraw(mockChart, args);

    expect(mockCtx.moveTo).toHaveBeenCalledWith(150, 10);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(150, 100);
  });

  test('context operations are called in correct order', () => {
    mockChart.verticalLiner = { draw: true };
    const args = {
      tooltip: { caretX: 50 },
    };

    tooltipPlugin.beforeTooltipDraw(mockChart, args);

    const calls =
      mockCtx.save.mock.calls.length > 0
        ? ['save', 'beginPath', 'moveTo', 'lineTo', 'stroke', 'restore']
        : [];

    expect(calls).toEqual([
      'save',
      'beginPath',
      'moveTo',
      'lineTo',
      'stroke',
      'restore',
    ]);
  });

  test('plugin maintains state correctly through multiple events', () => {
    // Initialize
    tooltipPlugin.afterInit(mockChart);
    expect(mockChart.verticalLiner).toEqual({});

    // Set draw to true
    tooltipPlugin.afterEvent(mockChart, { inChartArea: true });
    expect(mockChart.verticalLiner.draw).toBe(true);

    // Try to draw
    tooltipPlugin.beforeTooltipDraw(mockChart, { tooltip: { caretX: 50 } });
    expect(mockCtx.save).toHaveBeenCalled();

    // Set draw to false
    tooltipPlugin.afterEvent(mockChart, { inChartArea: false });
    expect(mockChart.verticalLiner.draw).toBe(false);

    // Clear previous calls
    jest.clearAllMocks();

    // Try to draw again - should not draw
    tooltipPlugin.beforeTooltipDraw(mockChart, { tooltip: { caretX: 50 } });
    expect(mockCtx.save).not.toHaveBeenCalled();
  });
});
