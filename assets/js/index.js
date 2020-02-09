import * as d3 from 'd3';


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


d3.json('data/buildings.json').then((data) => {
  const svg = d3.select("#canvas").append("svg")
    .attr("width", 400)
    .attr("height", 600);
  for(let d of data){
    d.height = +d.height;
  }
  const rectangles = svg.selectAll('rect')
    .data(data);

  rectangles.enter()
    .append('rect')
    .attr('width', 40)
    .attr('height',(d) => {
      console.log(d)
      return d.height;
    })
    .attr('y',0)
    .attr('x', (d,i)  => 50*i)
    .attr('fill',()=>getRandomColor())
});
