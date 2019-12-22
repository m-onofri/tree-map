const w = 1200;
const h =1030;
const margin= {top: 50, bottom: 100, left: 50, right: 50};

const colors = d3.scaleOrdinal(d3.schemeAccent);

const graph = d3.select(".canvas")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

const tip = d3.tip()
              .attr("id","tooltip")
              .offset([-8, 0])
              .html(function(d){return d});

graph.call(tip);
d3.json("https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json")
  .then(data => {
  
    const categories = data.children.map(c => c.name);
    colors.domain(categories);
  
    var root = d3.hierarchy(data).sum(function(d) {
      return d.value;
    });
  
    d3.treemap()
    .size([w, h])
    (root)
  
  var map = graph.append("g")
    .attr("class", "map")
    .attr("id", "map")
    .attr("transform", function(d, i) {
      return "translate(0, 100)";
    });
  
  
   var nodes = map
      .selectAll('g')
      .data(root.leaves())
      .enter().append('g')
      .attr('transform', function(d) {return 'translate(' + [d.x0, d.y0] + ')'})

nodes
  .append('rect')
  .attr("class", "tile")
  .attr('width', function (d) { return d.x1 - d.x0; })
  .attr('height', function (d) { return d.y1 - d.y0; })
  .attr('data-name', function(d) {return d.data.name})
  .attr('data-category', function(d) {return d.data.category})
  .attr('data-value', function(d) {return d.data.value})
  .style("stroke", "black")
  .attr("fill", function(d) {return colors(d.data.category)})
  .on("mouseover", function(d) {
    const html = "Name: " + d.data.name + '<br/>' + 
                 "Category: " + d.data.category + '<br/>' +
                 "Value: " + d.data.value;
    tip.attr('data-value', d.data.value);
    tip.show(html, this);
  })
  .on("mouseout", tip.hide);

nodes
    .append("text")
    .attr('class', 'tile-text')
    .selectAll("tspan")
    .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z\s])/g); })
    .enter().append("tspan")
    .attr("x", 4)
    .attr("y", function(d, i) { return 13 + i * 10; })
    .text(function(d) { return d; });
  
  //Legend
  
    var legendBlock = graph.append("g")
    .attr("class", "legend")
    .attr("id", "legend")
    .attr("transform", function(d, i) {
      return "translate(30, 50)";
    })
    
    var legend = legendBlock.selectAll('g')
      .data(colors.domain())
      .enter().append('g')
      .attr('transform', function(d,i) {return 'translate(' + (i * 150 + 120) + ',0)'})
    
    legend.append('rect')
      .attr("class", "legend-item")
      .attr("x", 0)
      .attr("y",0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colors);

  legend.append("text")
    .attr("x", -6)
    .attr("y", 8)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .style("font-size", "1.5rem")
    .text(function(d) {
        return d;
      });
})