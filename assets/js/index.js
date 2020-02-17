import * as d3 from 'd3';

const margin = {left: 40, right: 10, top: 10, bottom: 50};

const width = 600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

const div = d3.select("body").append("div")
  .attr("class", "tooltips")
  .style("opacity", 0);

const credit = false;
const returnStringOf = (d, n) => {
  if (n == 0) {
    return d.charAt(0).toUpperCase();
  } else {
    return d.charAt(0).toUpperCase() + d.slice(1, n);
  }
};

let dashedLine;

const onClick = (d) => {
  div.transition()
    .duration(0)
    .style("opacity", 1);
  div.html(`
      <div class="data">
        <div class="day">${d.key.toUpperCase()}</div>
        <div class="value">${d.value}AED</div>
    </div>
      `)
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px")
    .style('transform', 'translate(-47%,-90%)');
  if (dashedLine) {
    d3.select('.dashed').remove();
  }
  dashedLine = calorieSVGGroup.append('line')
    .attr('class', 'dashed')
    .attr('x1', x(d.key) + 5)
    .attr('y1', y(d3.max(data, (d) => d.value)))
    .attr('x2', x(d.key) + 5)
    .attr('y2', yAxis(d.value))
  d3.event.stopPropagation();
};

d3.select('body')
  .on('click', () => {
    if (dashedLine) {
      d3.select('.dashed').remove();
    }
    div.transition()
      .duration(0)
      .style("opacity", 0);
  });


const preData = {
  monday: 500,
  tuesday: 1000,
  wednesday: 900,
  thursday: 1400,
  friday: 1100,
  saturday: 1700,
  sunday: 1200
};

const capitalize = (d) => {
  return d.charAt(0).toUpperCase() + d.slice(1);
};

const data = [];

for (const item of Object.keys(preData)) {
  data.push({ // transforming data to be used for d3 scales
    key: item,
    value: preData[item]
  });
}

const backgroundColor = '#be8600'; // the background color of bar

const color = d3.scaleOrdinal()
  .domain(data.map((d) => d.key))
  .range(['#ffffff']); // setting colours

const calorieSVGGroup = d3.select('#calorie-graph').append('svg')
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const rx = 9, ry = rx, fontSize = '20px', legendRadius = 8;


const y = d3.scaleLinear()
  .domain([0, d3.max(data, (d) => d.value)])
  .range([0, height]);

const x = d3.scaleBand()
  .domain(data.map(d => d.key))
  .range([0, width])
  .paddingInner(0.7)
  .paddingOuter(0.7);

var yAxis = d3.scaleLinear()
  .domain([0, d3.max(data, function (d) {
    return d.value;
  })])
  .range([height, 0]);


const xAxisCall = d3.axisBottom(x);

calorieSVGGroup.append('g')
  .attr('class', 'remove-axis')
  .attr('transform', `translate(-5,${height})`)
  .call(xAxisCall)
  .selectAll('text')
  .attr('x', '0')
  .attr('y', '30')
  .attr('text-anchor', 'middle')
  .style('color', '#ffffff')
  .style('font-size', '20px')
  .text((d) => {
    if (!credit) {
      if (d === 'sunday') {
        return 'Sn'
      } else {
        return returnStringOf(d, 0)
      }
    } else {
      return returnStringOf(d, 3);
    }
  });


const yAxisCall = d3.axisLeft(yAxis)
  .ticks(4)
  .tickFormat(d => {
    return `${(d / 1000)}k`
  });

calorieSVGGroup.append('g')
  .attr('class', 'remove-axis')
  .call(yAxisCall)
  .attr('transform', 'translate(20,0)')
  .style('font-size', '20px')
  .style('color', '#ffffff');

// drop-shadow for line
const filter = calorieSVGGroup.append('defs')
  .append('filter')
  .attr('id', 'drop-shadow')
  .attr('filterUnits', 'userSpaceOnUse');

filter.append('feGaussianBlur')
  .attr('in', 'SourceAlpha')
  .attr('stdDeviation', 10);

filter.append('feOffset')
  .attr('dx', 10)
  .attr('dy', 10);

const feComponentTransfer = filter.append('feComponentTransfer');
feComponentTransfer
  .append('feFuncA')
  .attr('type', 'identity')
  .attr('slope', 20);

const feMerge = filter.append('feMerge');
feMerge.append('feMergeNode');
feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

// 7. d3's line generator
const line = d3.line()
  .x((d) => x(d.key)) // set the x values for the line generator
  .y((d) => yAxis(d.value)) // set the y values for the line generator
  .curve(d3.curveMonotoneX) // apply smoothing to the line


calorieSVGGroup.append("path")
  .datum(data) // 10. Binds data to the line
  .attr("class", "line") // Assign a class for styling
  .attr("d", line) // 11. Calls the line generator
  .attr('filter', 'url(#drop-shadow');

const returnLastPoint = () => {
  const lastEl = data[data.length - 1];
  const maxY = yAxis(lastEl.value);
  let maxX = x(lastEl.key) + 5;
  return {
    maxX,
    maxY
  }
};

calorieSVGGroup.append('circle')
  .attr('stroke', 'white')
  .attr('stroke-width', 4)
  .attr('fill', 'transparent')
  .attr('r', 4)
  .attr('cx', returnLastPoint().maxX)
  .attr('cy', returnLastPoint().maxY);


// tooltip enabling
calorieSVGGroup.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('y', (d) => y(d3.max(data, (d) => d.value)) - y(d.value) - 25)
  .attr('x', (d) => x(d.key) - 10)
  .attr('width', 50)
  .attr('height', 50)
  .attr('opacity', 0)
  .on('click', onClick);


