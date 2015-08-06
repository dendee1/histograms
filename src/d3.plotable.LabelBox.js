/*
 * d3.plotable.LabelBox
 *
 * d3.plotable which draws a box containg the label of the histogram.
 *
 * Data API
 * --------
 * The data object is a string. 
 *
 *
 * Configuration
 * -------------
 * The possible configuration keys are:
 *
 * * `color`: The color of the text as a CSS-compatible string
 *            (default: '#000000')
 * * `x`: Initial position of the top-left corner of the box along x in px
 *        (default: 10)
 * * `y`: Initial position of the top-left corner of the box along y in px
 *        (default: 10)
 */
(function(d3, undefined) {
  'use strict';
  var LabelBox = function(name, data, config) {
    if (config === undefined) {
      config = {};
    }
    if (config.color === undefined) {
      config.color = '#000000';
    }
    if (config.x === undefined) {
      config.x = 70;
    }
    if (config.y === undefined) {
      config.y = 20;
    }
    return {
      name: name,
      data: data,
      xDomain: function() { return []; },
      yDomain: function() { return []; },
      draw: function(axes, g, transition) {
        if (arguments.length === 0) {
          console.error('Cannot draw ' + this.name + ', no arguments given');
          return;
        }
        if (transition === undefined) {
          transition = false;
        }
        g.classed('TextBox', true);
        // Create 'background' rectangle
        var width = this.data.length*9+10,
            height = 20;
        g.selectAll('rect').data([null]).enter()
          .append('rect')
          .attr('x', 0)
          .attr('y', -19)
          .attr('width', width)
          .attr('height', height)
          .style('fill', '#ffffff')
          .style('stroke', '#000000')
          .style('stroke-width', '1px');
        // Create join data, one <text> element per datum
//        var join = g.selectAll('g').data("");
//        join.enter().append('g')
//          .classed('legend-item', true);
        g.selectAll('text').data([null])
          .enter()
          .append('text')
          .attr('x', 5)
          .attr('y', -4)
          .attr("font-family","sans-serif")
          .style("font-weight", "normal")
          .style("text-anchor", "start")
          .style('fill', config.color)
          .text(this.data);
        // Set up dragging on the container element
        var initPosition = g.data()[0] === undefined ? [{x: config.x, y: config.y}] : g.data();
        g.data(initPosition);
        g.attr('transform', 'translate(' + initPosition[0].x + ',' + initPosition[0].y + ')');
        var drag = d3.behavior.drag()
          .origin(function(d, i) { return d; })
          .on('drag', function (d, i) {
            d3.select(this)
              .attr('transform', 'translate(' + (d.x = d3.event.x) + ',' + (d.y = d3.event.y) + ')');
          });
        g.call(drag);
        return;
      }
    };
  };

  d3.plotable = d3.plotable || {};
  d3.plotable.LabelBox = LabelBox;
})(window.d3);
