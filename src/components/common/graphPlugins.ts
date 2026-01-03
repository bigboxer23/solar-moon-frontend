import type { Chart, ChartArea, Plugin, TooltipModel } from 'chart.js';

interface VerticalLiner {
  draw?: boolean;
}

interface ChartWithVerticalLiner extends Chart {
  verticalLiner: VerticalLiner;
  chartArea: ChartArea;
}

export const tooltipPlugin: Plugin<'line'> = {
  id: 'verticalLiner',
  afterInit: (chart: Chart) => {
    (chart as ChartWithVerticalLiner).verticalLiner = {};
  },
  afterEvent: (
    chart: Chart,
    args: {
      event: unknown;
      replay: boolean;
      changed?: boolean;
      cancelable: boolean;
      inChartArea: boolean;
    },
  ) => {
    const { inChartArea } = args;
    (chart as ChartWithVerticalLiner).verticalLiner = { draw: inChartArea };
  },
  beforeTooltipDraw: (
    chart: Chart,
    args: { tooltip: TooltipModel<'line'> },
  ) => {
    const chartWithLiner = chart as ChartWithVerticalLiner;
    const { draw } = chartWithLiner.verticalLiner;
    if (!draw) return;

    const { ctx } = chart;
    const { top, bottom } = chartWithLiner.chartArea;
    const { tooltip } = args;
    const x = tooltip?.caretX;
    if (!x) return;

    ctx.save();

    ctx.beginPath();
    ctx.strokeStyle = '#5178C2';
    ctx.lineWidth = 2;
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();

    ctx.restore();
  },
};
