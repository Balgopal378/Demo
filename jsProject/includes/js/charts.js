function getChart(fileName,id)
{
  var margin = {top: 100, right: 20, bottom: 40, left: 120},
      width = 1060 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");
      //.ticks(10, "%");
  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>Value:</strong> <span style='color:red'>" + d.y + "</span>";
      })

  var svg = d3.select(id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", 700+margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.call(tip);

  d3.json(fileName, function(error, data) {
    if (error) throw error;

    x.domain(data.map(function(d) {return d.x; }));
    y.domain([0, d3.max(data, function(d) { return d.y; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform","translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform","rotate(-60)")
        .attr("dx","-0.8em")
        .attr("dy",".25em")
        .style("text-anchor","end");


    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 15)
        .attr("dy", ".75em")
        .style("text-anchor", "end")
        .attr("class", "x axis")
        .text("Production");

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.y); })
        .attr("height", function(d) { return height - y(d.y); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

  });


}



function getStackChart(fileName,id){
  var margin = {top: 40, right: 20, bottom: 40, left: 100},
      width = 1000 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;


  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .rangeRound([height, 0]);

  var color = d3.scale.ordinal()
      .range(["#944dff", "#8a89a6","#b380ff","#b3b3ff"]);

  var div = d3.select(id).append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

      var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])





  var svg = d3.select(id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);
  d3.json(fileName, function(error, data) {
    if (error) throw error;

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "x"; }));

    data.forEach(function(d) {
      var y0 = 0;
      d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
      d.total = d.ages[d.ages.length - 1].y1;
    });

    //data.sort(function(a, b) { return b.total - a.total; });

    x.domain(data.map(function(d) { return d.x; }));
    y.domain([0, d3.max(data, function(d) { return d.total; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Values");

    var state = svg.selectAll(".state")
        .data(data)
      .enter().append("g")
        .attr("class","g")
        .attr("transform", function(d) { return "translate(" + x(d.x) + ",0)"; });

    state.selectAll("rect")
        .data(function(d) { return d.ages; })
      .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.y1); })
        .attr("height", function(d) { return y(d.y0) - y(d.y1); })
        .style("fill", function(d) { return color(d.name)})
          .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", 1);
                div	.html(d.name +" : " + (parseFloat(d.y1)-parseFloat(d.y0)))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);});

    var legend = svg.selectAll(".legend")
        .data(color.domain().slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + (i+1) * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("y","-60px")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 10)
        .attr("y", 9)
        .attr("dy", "-53px")
        .attr("dx","30px")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

  });

}
