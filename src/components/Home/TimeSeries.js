import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getTimeSeriesData } from "../../services/services";
import { parseSearchReturn } from "../../services/search";
import { debounce } from "../../utils/Utils";
const TimeSeries = ({ device, time }) => {
  const ref = useRef();
  const [windowWidth, setWindowWidth] = useState(
    Math.min(1320, window.innerWidth),
  );
  const [graphData, setGraphData] = useState(null);

  const debouncedHandleResize = debounce(function handleResize() {
    setWindowWidth(Math.min(1320, window.innerWidth));
  }, 100);

  const drawGraph = function () {
    if (graphData === null) {
      return;
    }
    const margin = { top: 30, right: 10, bottom: 30, left: 40 },
      width = windowWidth - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // Declare the x (horizontal position) scale.
    const x = d3.scaleTime(
      d3.extent(graphData, (d) => d.date),
      [margin.left, width - margin.right],
    );
    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear(
      [0, d3.max(graphData, (d) => d.values)],
      [height - margin.bottom, margin.top],
    );

    // Declare the area generator.
    const area = d3
      .area()
      .x((d) => x(d.date))
      .y0(y(0))
      .y1((d) => y(d.values));

    d3.select(ref.current).select("svg").remove();
    // Create the SVG container.
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Append a path for the area (under the axes).
    svg
      .append("path")
      .attr("fill", device.virtual ? "rgba(240, 207, 96, 100)" : "#5178c2")
      .attr("d", area(graphData));

    // Add the x-axis.
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0),
      );

    // Add the y-axis, remove the domain line, add grid lines and a label.
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width - margin.left - margin.right)
          .attr("stroke-opacity", 0.1),
      )
      .call((g) =>
        g
          .append("text")
          .attr("x", -margin.left + 20)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("class", "fw-bold")
          .text(device.name),
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
    getTimeSeriesData(device, new Date(end.getTime() - time), end)
      .then(({ data }) => {
        setGraphData(parseSearchReturn(data));
      })
      .catch((e) => console.log(e));
  }, [time]);

  return <svg className={"time-series-graph mb-3"} ref={ref} />;
};

export default TimeSeries;
