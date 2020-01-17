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
const minYAxisValue = 90;
const maxYAxisValue = 104;
const highlightValue1 = 95;
const highlightValue2 = 103;

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
console.log(d3.max(data, d => d.value));
/* Y Axix */
const yScale = d3
  .scaleLinear()
  .domain([minYAxisValue, maxYAxisValue])
  // .domain([minYAxisValue, d3.max(data, d => d.value) + 2])
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
    .call(
      d3
        .axisBottom(xScale)
        .ticks(20)
        .tickFormat(d3.utcFormat("%m/%d"))
    )
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
      return "rotate(-65)";
    });

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

const line = d3
  .line()
  // .curve() allows to specify the behavior of the line itself
  .curve(curve)
  .x(d => xScale(d.date))
  .y(d => yScale(d.value));
// include a path element for the line, specifying the `d` attribute through the line generator
svgCanvas
  .append("path")
  .attr("class", "line")
  .attr("d", line(data));

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
  .selectAll(".container #x-axis g.tick")
  .append("line")
  .attr("class", "grid-line")
  .attr("x1", 0)
  .attr("x2", 0)
  .attr("y1", 0)
  .attr("y2", -(height - (margin.top + margin.bottom)));

// repeat the operation, but with regards to horizontal grid lines
const yGrid = d3
  .selectAll(".container #y-axis g.tick")
  .append("line")
  .attr("class", "grid-line")
  .attr("x1", 0)
  .attr("x2", width - (margin.left + margin.right))
  .attr("y1", 0)
  .attr("y2", 0);

const drawMajorLine = value => {
  const INNER_HEIGHT = height - (margin.top + margin.bottom);
  const AVAILABLE_HEIGHT = maxYAxisValue - minYAxisValue;
  const RELATED_HEIGHT = AVAILABLE_HEIGHT - (value - minYAxisValue);
  const ACTUAL_HEIGHT = (RELATED_HEIGHT / AVAILABLE_HEIGHT) * INNER_HEIGHT;
  svgCanvas
    .append("g")
    .append("line")
    .attr("class", "highlightGrid")
    .attr("x1", margin.left)
    .attr("x2", width - margin.right)
    .attr("y1", margin.top + ACTUAL_HEIGHT)
    .attr("y2", margin.top + ACTUAL_HEIGHT);
};
drawMajorLine(highlightValue1);
drawMajorLine(highlightValue2);



function hoverMouseOn() {
  var mouse_x = d3.mouse(this)[0];
  var mouse_y = d3.mouse(this)[1];
  var graph_y = yScale.invert(mouse_y);
  var graph_x = xScale.invert(mouse_x);

  hoverLine.attr("x1", mouse_x).attr("x2", mouse_x);
  hoverLineGroup.style("opacity", 1);

  var mouseDate = xScale.invert(mouse_x);
  const bisect = d3.bisector(function(d) {
    return d.date;
  }).right;
  const idx = bisect(data, graph_x);

  var d0 = data[idx - 1];
  var d1 = data[idx];
  if (d0 && d1) {
    var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;
    hoverTT.text("Date: "+ d3.utcFormat("%m/%d")(d.date)); 
    hoverTT.attr('x', mouse_x);
    hoverTT.attr('y', yScale(d.value));

    cle
    .attr('cx', mouse_x)
    .attr('cy', yScale(d.value));
  }
}
function hoverMouseOff(d) {
  hoverLineGroup.style("opacity", 1e-6);
}

//Line chart mouse over
var hoverLineGroup = svgCanvas.append("g").attr("class", "hover-line");

var hoverLine = hoverLineGroup
  .append("line")
  .attr("stroke", "#000")
  .attr("x1", -100)
  .attr("x2", -100)
  .attr("y1", margin.top)
  .attr("y2", height - margin.bottom);

var hoverTT = hoverLineGroup.append('text')
  .attr("class", "hover-tex capo")
  .attr('dy', "0.35em");

var cle = hoverLineGroup.append("circle")
  .attr("r", 4.5);


svgCanvas.select('.area').on("mouseout", hoverMouseOff).on("mousemove", hoverMouseOn);
