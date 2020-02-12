import * as d3 from 'd3';
import d3tip from 'd3-tip';

var margin = {left: 100, right: 10, top: 10, bottom: 100};

var width = 600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;


const div = d3.select("body").append("div")
  .attr("class", "tooltips")
  .style("opacity", 0);

const onClick = (d) => {
  div.transition()
    .duration(200)
    .style("opacity", 1);

  div.html(`
      <div class="data">
        <div class="day">${d.name}</div>
        <div class="value">${d.height}AED</div>
    </div>
      `)
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px")
    .style('transform', 'translate(-41%,-55%)');
  d3.event.stopPropagation();
};

d3.select('body')
  .on('click', () => {
    div.transition()
      .duration(200)
      .style("opacity", 0);
  })

var g = d3.select("#canvas")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left
    + ", " + margin.top + ")");

d3.json(require('../data/buildings')).then(function (data) {
  data.forEach(function (d) {
    d.height = +d.height;
  });


  var x = d3.scaleBand()
    .domain(data.map(function (d) {
      return d.name;
    }))
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3);

  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) {
      return d.height;
    })])
    .range([0, height]);

  var yAxis = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) {
      return d.height;
    })])
    .range([height, 0]);


  const xAxisCall = d3.axisBottom(x);
  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxisCall)
    .selectAll('text')
    .attr('x', '-5')
    .attr('y', '10')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-40)');


  const yAxisCall = d3.axisLeft(yAxis)
    .ticks(3)
    .tickFormat(d => {
      if (d < 1000) {
        return `${(d / 1000)}k`
      }
      return d
    });

  g.append('g')
    .attr('class', 'y-axis')
    .call(yAxisCall);


  var rects = g.selectAll("rect")
    .data(data);

  rects.enter()
    .append("rect")
    .attr("y", (d) => {
      return y(d3.max(data, d => d.height)) - y(d.height)
    })
    .attr("x", function (d) {
      return x(d.name);
    })
    .attr("width", x.bandwidth)
    .attr("height", function (d) {
      return y(d.height);
    })
    .attr("fill", "white")
    .on("click", onClick)
})
