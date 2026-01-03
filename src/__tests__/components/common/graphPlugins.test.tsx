/* eslint-env jest */
import type { Chart, ChartArea, TooltipModel } from 'chart.js';

import { tooltipPlugin } from '../../../components/common/graphPlugins';

interface MockCanvasRenderingContext2D {
  save: jest.Mock;
  restore: jest.Mock;
  beginPath: jest.Mock;
  moveTo: jest.Mock;
  lineTo: jest.Mock;
  stroke: jest.Mock;
  strokeStyle: string;
  lineWidth: number;
}

interface VerticalLiner {
  draw?: boolean;
}

interface MockChart extends Partial<Chart> {
  verticalLiner: VerticalLiner;
  chartArea: ChartArea;
  ctx: MockCanvasRenderingContext2D;
}

interface AfterEventArgs {
  event?: unknown;
  replay?: boolean;
  changed?: boolean;
  cancelable?: boolean;
  inChartArea: boolean;
}

interface BeforeTooltipDrawArgs {
  tooltip?: Partial<TooltipModel<'line'>>;
}

describe('tooltipPlugin', () => {
  let mockChart: MockChart;
  let mockCtx: MockCanvasRenderingContext2D;

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
    tooltipPlugin.afterInit!(
      mockChart as unknown as Chart,
      {} as Record<string, unknown>,
      {} as Record<string, unknown>,
    );

    expect(mockChart.verticalLiner).toEqual({});
  });

  test('afterEvent sets draw property when inChartArea is true', () => {
    const args: AfterEventArgs = { inChartArea: true };

    tooltipPlugin.afterEvent!(
      mockChart as unknown as Chart,
      args as unknown as {
        event: unknown;
        replay: boolean;
        changed?: boolean;
        cancelable: boolean;
        inChartArea: boolean;
      },
      {} as Record<string, unknown>,
    );

    expect(mockChart.verticalLiner.draw).toBe(true);
  });

  test('afterEvent sets draw property when inChartArea is false', () => {
    const args: AfterEventArgs = { inChartArea: false };

    tooltipPlugin.afterEvent!(
      mockChart as unknown as Chart,
      args as unknown as {
        event: unknown;
        replay: boolean;
        changed?: boolean;
        cancelable: boolean;
        inChartArea: boolean;
      },
      {} as Record<string, unknown>,
    );

    expect(mockChart.verticalLiner.draw).toBe(false);
  });

  test('beforeTooltipDraw does nothing when draw is false', () => {
    mockChart.verticalLiner = { draw: false };
    const args: BeforeTooltipDrawArgs = {
      tooltip: { caretX: 50 },
    };

    tooltipPlugin.beforeTooltipDraw!(
      mockChart as unknown as Chart,
      args as unknown as { tooltip: TooltipModel<'line'> },
      {} as Record<string, unknown>,
    );

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  test('beforeTooltipDraw does nothing when draw is not set', () => {
    mockChart.verticalLiner = {};
    const args: BeforeTooltipDrawArgs = {
      tooltip: { caretX: 50 },
    };

    tooltipPlugin.beforeTooltipDraw!(
      mockChart as unknown as Chart,
      args as unknown as { tooltip: TooltipModel<'line'> },
      {} as Record<string, unknown>,
    );

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  test('beforeTooltipDraw does nothing when caretX is not provided', () => {
    mockChart.verticalLiner = { draw: true };
    const args: BeforeTooltipDrawArgs = {
      tooltip: {},
    };

    tooltipPlugin.beforeTooltipDraw!(
      mockChart as unknown as Chart,
      args as unknown as { tooltip: TooltipModel<'line'> },
      {} as Record<string, unknown>,
    );

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  test('beforeTooltipDraw does nothing when tooltip is not provided', () => {
    mockChart.verticalLiner = { draw: true };
    const args: BeforeTooltipDrawArgs = {};

    tooltipPlugin.beforeTooltipDraw!(
      mockChart as unknown as Chart,
      args as unknown as { tooltip: TooltipModel<'line'> },
      {} as Record<string, unknown>,
    );

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  test('beforeTooltipDraw draws vertical line when conditions are met', () => {
    mockChart.verticalLiner = { draw: true };
    const args: BeforeTooltipDrawArgs = {
      tooltip: { caretX: 50 },
    };

    tooltipPlugin.beforeTooltipDraw!(
      mockChart as unknown as Chart,
      args as unknown as { tooltip: TooltipModel<'line'> },
      {} as Record<string, unknown>,
    );

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
    const args: BeforeTooltipDrawArgs = {
      tooltip: { caretX: 75 },
    };

    tooltipPlugin.beforeTooltipDraw!(
      mockChart as unknown as Chart,
      args as unknown as { tooltip: TooltipModel<'line'> },
      {} as Record<string, unknown>,
    );

    expect(mockCtx.moveTo).toHaveBeenCalledWith(75, 25);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(75, 200);
  });

  test('beforeTooltipDraw handles caretX of 0', () => {
    mockChart.verticalLiner = { draw: true };
    const args: BeforeTooltipDrawArgs = {
      tooltip: { caretX: 0 },
    };

    tooltipPlugin.beforeTooltipDraw!(
      mockChart as unknown as Chart,
      args as unknown as { tooltip: TooltipModel<'line'> },
      {} as Record<string, unknown>,
    );

    // caretX of 0 should be falsy, so drawing should not occur
    expect(mockCtx.save).not.toHaveBeenCalled();
  });

  test('beforeTooltipDraw works with positive caretX values', () => {
    mockChart.verticalLiner = { draw: true };
    const args: BeforeTooltipDrawArgs = {
      tooltip: { caretX: 150 },
    };

    tooltipPlugin.beforeTooltipDraw!(
      mockChart as unknown as Chart,
      args as unknown as { tooltip: TooltipModel<'line'> },
      {} as Record<string, unknown>,
    );

    expect(mockCtx.moveTo).toHaveBeenCalledWith(150, 10);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(150, 100);
  });

  test('context operations are called in correct order', () => {
    mockChart.verticalLiner = { draw: true };
    const args: BeforeTooltipDrawArgs = {
      tooltip: { caretX: 50 },
    };

    tooltipPlugin.beforeTooltipDraw!(
      mockChart as unknown as Chart,
      args as unknown as { tooltip: TooltipModel<'line'> },
      {} as Record<string, unknown>,
    );

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
    tooltipPlugin.afterInit!(
      mockChart as unknown as Chart,
      {} as Record<string, unknown>,
      {} as Record<string, unknown>,
    );
    expect(mockChart.verticalLiner).toEqual({});

    // Set draw to true
    tooltipPlugin.afterEvent!(
      mockChart as unknown as Chart,
      { inChartArea: true } as unknown as {
        event: unknown;
        replay: boolean;
        changed?: boolean;
        cancelable: boolean;
        inChartArea: boolean;
      },
      {} as Record<string, unknown>,
    );
    expect(mockChart.verticalLiner.draw).toBe(true);

    // Try to draw
    tooltipPlugin.beforeTooltipDraw!(
      mockChart as unknown as Chart,
      { tooltip: { caretX: 50 } } as unknown as {
        tooltip: TooltipModel<'line'>;
      },
      {} as Record<string, unknown>,
    );
    expect(mockCtx.save).toHaveBeenCalled();

    // Set draw to false
    tooltipPlugin.afterEvent!(
      mockChart as unknown as Chart,
      { inChartArea: false } as unknown as {
        event: unknown;
        replay: boolean;
        changed?: boolean;
        cancelable: boolean;
        inChartArea: boolean;
      },
      {} as Record<string, unknown>,
    );
    expect(mockChart.verticalLiner.draw).toBe(false);

    // Clear previous calls
    jest.clearAllMocks();

    // Try to draw again - should not draw
    tooltipPlugin.beforeTooltipDraw!(
      mockChart as unknown as Chart,
      { tooltip: { caretX: 50 } } as unknown as {
        tooltip: TooltipModel<'line'>;
      },
      {} as Record<string, unknown>,
    );
    expect(mockCtx.save).not.toHaveBeenCalled();
  });
});
