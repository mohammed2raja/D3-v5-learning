import "./styles.css";
import * as d3 from "d3";

const container = d3.select(".container");

container
  .append("h1")
  .attr("id", "title")
  .text("Area Chart");

// include the SVG frame and the group element in which the visualization will be actually displayed
const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20
};
const width = 600 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;
const minYAxisValue = 99;

const svgContainer = container
  .append("svg")
  .attr(
    "viewBox",
    `0 0 ${width + margin.left + margin.right} ${height +
      margin.top +
      margin.bottom}`
  );

const svgCanvas = svgContainer
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

let data = [
  [1571308738000, 100.8],
  [1571308738000, 100.8],
  [1571308738000, 100.8],
  [1571308738000, 100.8],
  [1571585001000, 100.8],
  [1571585001000, 100.8],
  [1571585001000, 100.8],
  [1571585001000, 100.8],
  [1571671541000, 100.9],
  [1571671541000, 100.9],
  [1571671541000, 100.9],
  [1571671541000, 100.9],
  [1571764444000, 101.0],
  [1571764444000, 101.0],
  [1571764444000, 101.0],
  [1571764444000, 101.0],
  [1571844201000, 101.1],
  [1571844201000, 101.1],
  [1571844201000, 101.1],
  [1571844201000, 101.1],
  [1571930601000, 101.1],
  [1571930601000, 101.1],
  [1571930601000, 101.1],
  [1571930601000, 101.1],
  [1572017055000, 100.9],
  [1572017055000, 100.9],
  [1572017055000, 100.9],
  [1572017055000, 100.9],
  [1572103504000, 101.5],
  [1572103504000, 101.5],
  [1572103504000, 101.5],
  [1572103504000, 101.5],
  [1572189801000, 101.1],
  [1572189801000, 101.1],
  [1572189801000, 101.1],
  [1572189801000, 101.1],
  [1572276255000, 101.5],
  [1572276255000, 101.5],
  [1572276255000, 101.5],
  [1572276255000, 101.5],
  [1572362741000, 101.2],
  [1572449141000, 101.2],
  [1572449141000, 101.2],
  [1572449141000, 101.2],
  [1572449141000, 101.2]
];
// format the data
data = data.map(d => {
  return {
    date: new Date(d[0]),
    value: +d[1]
  };
});
/* Y Axix */
const yScale = d3
  .scaleLinear()
  .domain([minYAxisValue, d3.max(data, d => d.value)])
  .nice()
  .range([height - margin.bottom, margin.top]);
const yAxis = g =>
  g
    .attr("transform", `translate(${margin.left},0)`)
    .attr("id", "y-axis")
    .attr("class", "axis")
    .call(d3.axisLeft(yScale));

/* X axis */
const xScale = d3
  .scaleUtc()
  .domain(d3.extent(data, d => d.date))
  .range([margin.left, width - margin.right]);
const xAxis = g =>
  g
    .attr("id", "x-axis")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(10));

var areaGradient = svgContainer
  .append("defs")
  .append("linearGradient")
  .attr("id", "temperature-gradient")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "0%")
  .attr("y2", "100%");

areaGradient
  .append("stop")
  .attr("offset", "0%")
  .attr("stop-color", "#f00")
  .attr("stop-opacity", 0.6);
areaGradient
  .append("stop")
  .attr("offset", "80%")
  .attr("stop-color", "white")
  .attr("stop-opacity", 0);

const curve = d3.curveLinear;
const area = d3
  .area()
  .curve(curve)
  .x(d => xScale(d.date))
  .y0(yScale(minYAxisValue))
  .y1(d => yScale(d.value));

svgCanvas
  .append("path")
  .datum(data)
  .attr("class", "area")
  .attr("d", area);

svgCanvas.append("g").call(yAxis);
svgCanvas.append("g").call(xAxis);

// target all the horizontal ticks and include line elements making up vertical grid lines
const xGrid = d3
  .selectAll("#x-axis g.tick")
  .append("line")
  .attr("class", "grid-line")
  .attr("x1", 0)
  .attr("x2", 0)
  .attr("y1", 0)
  .attr("y2", -(height - (margin.top + margin.bottom)));

// repeat the operation, but with regards to horizontal grid lines
const yGrid = d3
  .selectAll("#y-axis g.tick")
  .append("line")
  .attr("class", "grid-line")
  .attr("x1", 0)
  .attr("x2", width - (margin.left + margin.right))
  .attr("y1", 0)
  .attr("y2", 0);
