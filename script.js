const onLoad = () => {
    d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json")
    .then((data) => {


        const h = 1000
        const w = 1500
        const padding = 60

        const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style('opacity', 0)

        const svg = d3.select(".container")
        .append("svg")
        .attr("height", h)
        .attr("width", w)

        const root = d3.hierarchy(data).sum((d) => d.value)

        d3.treemap()
        .size([w - padding, h - padding])
        (root)

        const cats = data['children'].map((item) => item.name)
        const color = d3.scaleOrdinal().domain(cats).range(['#156456', '#1993b8', '#e297a4', '#b7c84f', '#c8b71e', '#b6f08c', '#4a0d5d'])

        const cell = svg.selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`)
        


        cell.append("rect")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("stroke", "black")
        .style("fill", d => color(d.parent.data.name))
        .attr("class", "tile")
        .attr("data-value", d => d.data.value)
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .on('mousemove', function (event, d) {
            tooltip.style('opacity', 0.9);
            tooltip
              .html(
                'Name: ' +
                  d.data.name +
                  '<br>Category: ' +
                  d.data.category +
                  '<br>Value: ' +
                  d.data.value
              )
              .attr('data-value', d.data.value)
              .style('left', event.pageX + 10 + 'px')
              .style('top', event.pageY - 28 + 'px');
          })
          .on('mouseout', function () {
            tooltip.style('opacity', 0);
          });

        cell.append('text')                                           
        .selectAll('tspan')                                       
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))         
        .enter()
        .append('tspan')                                          
        .attr('font-size', '8px')
        .attr('x', 4)
        .attr('y', (d, i) => 13 + 10 * i)                         
        .text(d => d);

        const legend = d3.select("#legend")
        .append("svg")
        .attr("width", 200)
        .attr("height", 500)
        .append("g")
        .attr("class", 'legend')
        .attr("transform", "translate(0,142)")

        const legendItem = legend.selectAll('.legend-item')
        .data(cats)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
            return 'translate(10,' + i * 30 + ')'
        });

        legendItem.append('rect')
        .attr('width', 20)
        .attr('height', 20)
        .attr('class', 'legend-item')
        .style('fill', function (d) {
            return color(d)
        });

        legendItem.append('text')
        .attr('x', 25)
        .attr('y', 15).text(function (d) {
            return d;
        })
    })
    .catch((e) => console.log(e))
}
document.addEventListener("DOMContentLoaded", onLoad())