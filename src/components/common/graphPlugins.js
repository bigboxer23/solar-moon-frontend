export const tooltipPlugin = {
  id: 'verticalLiner',
  afterInit: (chart) => {
    chart.verticalLiner = {};
    /*Chart.register(Filler);*/
  },
  afterEvent: (chart, args) => {
    const { inChartArea } = args;
    chart.verticalLiner = { draw: inChartArea };
  },
  beforeTooltipDraw: (chart, args) => {
    const { draw } = chart.verticalLiner;
    if (!draw) return;

    const { ctx } = chart;
    const { top, bottom } = chart.chartArea;
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
