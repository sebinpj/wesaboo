import * as d3 from 'd3';

const margin = {left: 40, right: 10, top: 10, bottom: 50};

const width = 600 - margin.left - margin.right,
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
        <div class="day">${d.key.toUpperCase()}</div>
        <div class="value">${d.value}AED</div>
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
      .duration(0)
      .style("opacity", 0);
  });


const preData = {
  monday: 2200,
  tuesday: 1400,
  wednesday: 2350,
  thursday: 1700,
  friday: 1900,
  saturday: 1000,
  sunday: 2400
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
  .attr('transform', `translate(0,${height})`)
  .call(xAxisCall)
  .selectAll('text')
  .attr('x', '8')
  .attr('y', '30')
  .attr('text-anchor', 'end')
  .style('color','#ffffff')
  .style('font-size','20px')
  .text((d) => {
    if(d === 'monday'){
      return 'M';
    }else if(d === 'tuesday'){
      return 'T';
    }else if(d === 'wednesday'){
      return 'W'
    }else if(d === 'thursday'){
      return 'T'
    }else if(d === 'friday'){
      return 'F'
    }else if(d === 'saturday'){
      return 'S'
    }else {
      return 'Sn'
    }
  });


const yAxisCall = d3.axisLeft(yAxis)
  .ticks(6)
  .tickFormat(d => {
    if (d < 1000) {
      return `${(d / 1000)}k`
    }
    return d3.format(".0s")(d)
  });

calorieSVGGroup.append('g')
  .attr('class', 'remove-axis')
  .call(yAxisCall)
  .attr('transform','translate(20,0)')
  .style('font-size','20px')
  .style('color','#ffffff');

const rectangles = calorieSVGGroup.selectAll('rect')
  .data(data); // graph data elements


rectangles.enter() // draw background for all values
  .append('rect')
  .attr('width', x.bandwidth())
  .attr('height', y(d3.max(data, (d) => d.value)))
  .attr('rx', rx)
  .attr('ry', ry)
  .attr('y', 0)
  .attr('x', (d) => x(d.key))
  .attr('fill', () => backgroundColor)
  .on('click',onClick);


rectangles.enter() // draw bars according to value and scale
  .append('rect')
  .attr('width', x.bandwidth())
  .attr('height', (d) => {
    return y(d.value);
  })
  .attr('rx', rx)
  .attr('ry', ry)
  // tslint:disable-next-line:no-shadowed-variable
  .attr('y', (d) => y(d3.max(data, (d) => d.value)) - y(d.value))
  .attr('x', (d) => x(d.key))
  .attr('fill', (d) => color(d.key))
  .on('click',onClick);
