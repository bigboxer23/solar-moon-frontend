import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { getTimeSeriesData } from "../../services/services";
import { getSearchBody, parseSearchReturn } from "../../services/search";
const TimeSeries = ({ device, time }) => {
  const ref = useRef();

  useEffect(() => {
    let start = new Date(new Date().getTime() - time);
    getTimeSeriesData(getSearchBody(device, new Date(start), new Date())).then(
      ({ data }) => {
        let graphData = parseSearchReturn(data);

        const margin = { top: 30, right: 10, bottom: 30, left: 40 },
          width = 900 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

        // Declare the x (horizontal position) scale.
        const x = d3.scaleUtc(
          d3.extent(graphData, (d) => new Date(d.date)),
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
          .x((d) => x(new Date(d.date)))
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
        svg.append("path").attr("fill", "steelblue").attr("d", area(graphData));

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
              .attr("x", -margin.left)
              .attr("y", 10)
              .attr("fill", "currentColor")
              .attr("text-anchor", "start")
              .text(device.name),
          );
      },
    );
  }, [time]);

  return <svg width={900} height={400} ref={ref} />;
};

export default TimeSeries;
