// calculate margins according to window size on load
var margin = {top: 60, right: 60, bottom: 60, left: 40},
  w = parseInt(d3.select("#chart-container").style("width")),
  w = w - margin.left - margin.right,
  chartRatio = 0.4,
  h = w * chartRatio;


function drawBarChart(dataset) {
  
  // get the first year in the dataset
  var minDate = dataset[0][0].substr(0,4);
  minDate = new Date(minDate);
  
  // get the most recent year in the dataset
  var maxDate = dataset[dataset.length - 1][0].substr(0,4);
  maxDate = new Date(maxDate);
  
  // x-axis scale
  var xScale = d3.time.scale()
                        .domain([minDate, maxDate])
                        .range([0, w]);

  // y-axis scale
  var yScale = d3.scale.linear()
                        .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                        .range([h, 0]);
  
  
  // draw x-axis
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  
  // draw y-axis
  var yAxis = d3.svg.axis().scale(yScale).orient("left");
  
  // svg space position and size
  var svg = d3.select("#chart-container")
      .append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  //tooltip
  var tooltip = d3.select("#chart-container").append("div")
                  .attr("class", "tooltip")
                  .style("opacity", 0);

  // draw the bar chart
  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr({
      x: function(d, i) { return margin.left + (i * (w / dataset.length)); },
      y: function(d) { return yScale(d[1]); },
      width: (w / dataset.length),
      height: function(d) { return h - yScale(d[1]); },
      fill: "#3F51B5"
    })
    .on("mouseover", function(d) {
      
      // format dates
      var date = new Date(d[0]);
      var formatDate = d3.time.format("%B %Y");
    
      tooltip.transition()
              .duration(300)
              .style("opacity", 0.90)
      tooltip.html("<p><span class='bigger-text'>" + formatDate(date) + "</span></p><p>GDP: <span class='bigger-text'>$" + d[1] + " b</span></p>")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 100) + "px")
    })
    .on("mouseout", function() {
      tooltip.transition()
             .duration(300)
             .style("opacity", 0);
    });
  
  // draw x-axis
  svg.append("g").call(xAxis)
                .attr("class", "axis")
                .attr("transform", "translate(" + margin.left + "," + h + ")");
  
  // x-axis label
  svg.append("text")
      .attr("transform", "translate(" + (margin.left + (w / 2)) + ", " + (h + (margin.bottom * 0.75)) + ")")
      .attr("class", "bigger-text")
      .style("text-anchor", "middle")
      .text("Year");
  
  // draw y-axis
  svg.append("g").call(yAxis)
                .attr("class", "axis")
                .attr("transform", "translate(" + margin.left + ", 0)");
  
  // y-axis label
  svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (h / 2))
        .attr("dy", "1em")
        .attr("class", "bigger-text")
        .style("text-anchor", "middle")
        .text("Value ($billion)");
}


// JSON call
d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(error, data) {

  if (error) {
    console.log("error");
  }
   
  var dataset = data.data;
  drawBarChart(dataset);
  
  // footer small print
  var updated = data.updated_at.substr(0, 10);
  
  d3.select("#chart-container").append("div")
      .attr('id', 'footer')
      .attr("x", margin.left + margin.right + (w / 2))
      .attr("y", h)
      .html("<h6>" + data.description + "</h6><h6> Last updated: " + updated + "</h6>");

});
