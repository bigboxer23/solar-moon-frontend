import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getStackedTimeSeriesData } from "../../services/services";
import { debounce } from "../../utils/Utils";
import Legend from "./Legend";
import { AVG, DATE_HISTO } from "../../services/search";
const StackedTimeSeries = ({ device, time }) => {
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
    data.aggregations[DATE_HISTO].buckets.forEach((d) => {
      let date = new Date(Number(d.key));
      d["sterms#terms"].buckets.forEach((v) => {
        formattedData.push({
          date: date.toISOString(),
          name: v.key,
          avg: v[AVG].value,
        });
      });
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

    // Determine the series that need to be stacked.
    const series = d3
      .stack()
      .keys(d3.union(graphData.map((d) => d.name))) // distinct series keys, in input order
      .value(([, D], key) => D.get(key).avg)(
      // get value for each series key and stack
      d3.index(
        graphData,
        (d) => new Date(d.date),
        (d) => d.name,
      ),
    ); // group by stack then series key

    // Prepare the scales for positional and color encodings.
    const x = d3
      .scaleTime()
      .domain(d3.extent(graphData, (d) => new Date(d.date)))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
      .rangeRound([height - margin.bottom, margin.top]);

    const color = d3
      .scaleOrdinal()
      .domain(series.map((d) => d.key))
      .range(d3.schemeTableau10);

    // Construct an area shape.
    const area = d3
      .area()
      .x((d) => x(d.data[0]))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]));

    d3.select(ref.current).select("svg").remove();
    // Create the SVG container.
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

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

    // Append a path for each series.
    svg
      .append("g")
      .selectAll()
      .data(series)
      .join("path")
      .attr("fill", (d) => color(d.key))
      .attr("d", area)
      .append("title")
      .text((d) => d.key);

    // Append the horizontal axis atop the area.
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    setColorData(
      series.map((d) => {
        return { name: d.key, color: color(d.key) };
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
    getStackedTimeSeriesData(device, new Date(end.getTime() - time), end)
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

export default StackedTimeSeries;
