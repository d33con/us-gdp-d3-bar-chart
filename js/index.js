var w = 1000;
var h = 600;
var chartPadding = 100;
var innerPadding = chartPadding + 1;

function drawBarChart(dataset) {

  /* get max & min data values
  var minXValue = d3.min(d, function(ds) {
    return ds[0];
  });
  var maxXValue = d3.max(d, function(ds) {
    return ds[0];
  });
  var maxYValue = d3.max(dataset, function(ds) {
    return ds[1];
  });*/
  
  // get the first year in the dataset
  var minDate = dataset[0][0].substr(0,4);
  minDate = new Date(minDate);
  
  // get the most recent year in the dataset
  var maxDate = dataset[dataset.length - 1][0].substr(0,4);
  maxDate = new Date(maxDate);
  //console.log(minDate, maxDate);

  
  // x-axis scale
  var xScale = d3.time.scale()
                        .domain([minDate, maxDate])
                        .range([0, w]);

  // y-axis scale
  var yScale = d3.scale.linear()
                        .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                        .range([h, 5]);
  
  
  // x-axis draw function
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  
  // y-axis draw function
  var yAxis = d3.svg.axis().scale(yScale).orient("left");
  
  // svg space position and size
  var svg = d3.select("#d3bar")
  .append("svg")
  .attr("width", w + (chartPadding * 2))
  .attr("height", h + chartPadding / 2);
  
  // draw x-axis
  svg.append("g").call(xAxis)
                .attr("class", "axis")
                .attr("transform", "translate(" + chartPadding + ", " + h + ")");
  
  // x-axis label
  svg.append("text")
      .attr("transform", "translate(" + (w + chartPadding * 2) / 2 + ", " + (h + chartPadding / 2) + ")")
      .attr("class", "bigger-text")
      .style("text-anchor", "middle")
      .text("Year");
  
  // draw y-axis
  svg.append("g").call(yAxis)
                .attr("class", "axis")
                .attr("transform", "translate(" + chartPadding + ", 0)");
  
  // y-axis label
  svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 + (chartPadding / 4))
        .attr("x", 0 - (h / 2))
        .attr("dy", "1em")
        .attr("class", "bigger-text")
        .style("text-anchor", "middle")
        .text("Value ($billion)");
  
  //tooltip
  var tooltip = d3.select("#d3bar").append("div")
                  .attr("class", "tooltip")
                  .style("opacity", 0);

  // draw the bar chart
  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr({
      x: function(d, i) { return innerPadding + (i * (w / dataset.length)); },
      y: function(d) { return yScale(d[1]); },
      width: (w / dataset.length),
      height: function(d) { return h - yScale(d[1]) - 1; },
      fill: "#3F51B5"
    })
    .on("mouseover", function(d) {
    
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
}


// JSON call
d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(error, data) {

  if (error) {
    console.log('error');
  } else {
    //console.log(data.data);
  }
   
  var dataset = data.data;
  drawBarChart(dataset);
  
  var updated = data.updated_at.substr(0, 10);
  
  d3.select("#d3bar").append("text")
      .html("<h6>" + data.description + " Last updated: " + updated + "</h6>")

});