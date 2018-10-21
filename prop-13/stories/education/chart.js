// Define margins, dimensions, and some line colors
const margin = {top: 40, right: 120, bottom: 30, left: 40};
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Define the scales and tell D3 how to draw the line
const x =  d3.scaleBand().rangeRound([0, width]).padding(1);
// const x = d3.scaleLinear().domain([1910, 2010]).range([0, width]);
const y = d3.scaleLinear().domain([0, 12000]).range([height, 0]);
const line = d3.line().x(d => x(d.year)).y(d => y(d.perStudent));

const chart = d3.select('svg').append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

const tooltip = d3.select('#spending-chart');
const tooltipLine = chart.append('line');

// Add the axes and a title
const xAxis = d3.axisBottom(x).tickFormat(d3.format('.4'));
const yAxis = d3.axisLeft(y).tickFormat(d3.format('.2s'));
chart.append('g').call(yAxis);
chart.append('g').attr('transform', 'translate(0,' + height + ')').call(xAxis);
chart.append('text').html('Per pupil spending 1969-2015').attr('x', 200);

// Load the data and draw a chart
let spending, tipBox;
d3.json('../spending.json', d => {
  spending = d;

  chart.selectAll()
    .data(spending).enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', d => d.color)
    .attr('stroke-width', 2)
    .datum(d => d.data)
    .attr('d', line);

  chart.selectAll()
    .data(spending).enter()
    .append('text')
    .html(d => d.name)
    .attr('fill', d => d.color)
    .attr('alignment-baseline', 'middle')
    .attr('x', width)
    .attr('dx', '.5em')
    .attr('y', d => y(d.data));

  tipBox = chart.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('opacity', 0)
    .on('mousemove', drawTooltip)
    .on('mouseout', removeTooltip);
})

function removeTooltip() {
  if (tooltip) tooltip.style('display', 'none');
  if (tooltipLine) tooltipLine.attr('stroke', 'none');
}

function drawTooltip() {
  const year = Math.floor((x.invert(d3.mouse(tipBox.node())[0]) + 5) / 10) * 10;

  spending.sort((a, b) => {
    return b.data.find(h => h.year == year).perStudent - a.data.find(h => h.year == year).perStudent;
  })

  tooltipLine.attr('stroke', 'black')
    .attr('x1', x(year))
    .attr('x2', x(year))
    .attr('y1', 0)
    .attr('y2', height);

  tooltip.html(year)
    .style('display', 'block')
    .style('left', d3.event.pageX + 20)
    .style('top', d3.event.pageY - 20)
    .selectAll()
    .data(spending).enter()
    .append('div')
    .style('color', d => d.color)
    .html(d => d.name + ': ' + d.data.find(h => h.year == year).perStudent);
}
