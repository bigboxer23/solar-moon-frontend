import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getGroupedTimeSeriesData } from "../../services/services";
import { debounce } from "../../utils/Utils";
import Legend from "./Legend";
import {
  AVG,
  DATE_HISTO,
  DAY,
  HOUR,
  MONTH,
  WEEK,
  YEAR,
} from "../../services/search";
const GroupedBarChart = ({ device, time }) => {
  const ref = useRef();
  const [windowWidth, setWindowWidth] = useState(
    Math.min(1320, window.innerWidth),
  );
  const [graphData, setGraphData] = useState(null);
  const [colorData, setColorData] = useState([]);

  const debouncedHandleResize = debounce(function handleResize() {
    setWindowWidth(Math.min(1320, window.innerWidth));
  }, 100);

  const parseStackedTimeSeriesData = function (data) {
    let formattedData = [];
    let deviceCount = 0;
    data.aggregations[DATE_HISTO].buckets.forEach((d) => {
      let date = new Date(Number(d.key));
      deviceCount = Math.max(deviceCount, d["sterms#terms"].buckets.length);
      if (d["sterms#terms"].buckets.length >= deviceCount) {
        d["sterms#terms"].buckets.forEach((v) => {
          formattedData.push({
            date: date.toISOString(),
            name: v.key,
            avg: v[AVG] ? v[AVG].value : v["1"].value,
          });
        });
      }
    });
    return formattedData;
  };
  const drawGraph = function () {
    if (graphData === null) {
      return;
    }
    const margin = { top: 30, right: 10, bottom: 30, left: 40 },
      width = windowWidth - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const formatTime = (d) => {
      switch (time) {
        case HOUR:
          return d3.timeFormat("%I:%M%p")(d);
        case DAY:
          return d3.timeFormat("%I%p")(d);
        case WEEK:
          return d3.timeFormat("%a %e")(d);
        case MONTH:
          return d3.timeFormat("%b %e")(d);
        case YEAR:
          return d3.timeFormat("%b%e")(d);
      }
      return d3.timeFormat("%d %b")(d);
    };
    // Prepare the scales for positional and color encodings.
    // Fx encodes the state.
    const fx = d3
      .scaleBand()
      .domain(new Set(graphData.map((d) => new Date(d.date))))
      .rangeRound([margin.left, width - margin.right])
      .paddingInner(0.05);

    const xx = d3
      .scaleTime()
      .domain(d3.extent(graphData, (d) => new Date(d.date)))
      .range([margin.left, width - margin.right]);

    const deviceNames = new Set(graphData.map((d) => d.name));

    const x = d3
      .scaleBand()
      .domain(deviceNames)
      .rangeRound([0, fx.bandwidth()])
      .padding(0.1);

    const color = d3
      .scaleOrdinal()
      .domain(deviceNames)
      .range(d3.schemeTableau10)
      .unknown("#ccc");

    // Y encodes the height of the bar.
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(graphData, (d) => d.avg)])
      .nice()
      .rangeRound([height - margin.bottom, margin.top]);

    // A function to format the value in the tooltip.
    //const formatValue = (x) => (isNaN(x) ? "N/A" : x.toLocaleString("en"));

    d3.select(ref.current).select("svg").remove();
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Append a group for each state, and a rect for each age.
    svg
      .append("g")
      .selectAll()
      .data(d3.group(graphData, (d) => new Date(d.date)))
      .join("g")
      .attr("transform", ([date]) => `translate(${fx(date)},0)`)
      .selectAll()
      .data(([, d]) => d)
      .join("rect")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.avg))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.avg))
      .attr("fill", (d) => color(d.name));

    // Append the horizontal axis.
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(fx).tickSizeOuter(0).tickFormat(formatTime))
      .call((g) => g.selectAll(".domain").remove());

    // Append the vertical axis.
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, "s"))
      .call((g) => g.selectAll(".domain").remove());

    setColorData(
      Array.from(deviceNames).map((d) => {
        return { name: d, color: color(d) };
      }),
    );
  };

  useEffect(() => {
    window.addEventListener("resize", debouncedHandleResize);
    return (_) => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });

  useEffect(() => {
    drawGraph();
  }, [windowWidth, graphData]);

  useEffect(() => {
    let end = new Date();
    getGroupedTimeSeriesData(device, new Date(end.getTime() - time), end)
      .then(({ data }) => {
        setGraphData(parseStackedTimeSeriesData(data));
      })
      .catch((e) => console.log(e));
  }, [time]);

  return (
    <div>
      <Legend colorData={colorData} />
      <svg className={"time-series-graph mb-3"} ref={ref} />
    </div>
  );
};

export default GroupedBarChart;
