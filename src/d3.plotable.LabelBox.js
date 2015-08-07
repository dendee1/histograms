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
      config.x = 0;
    }
    if (config.y === undefined) {
      config.y = 20;
    }
    if (config.bkg === undefined) {
      config.bkg = "transparent";
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
        //put margin to x coordinate:
        config.x = config.x + axes.margins.left;
        g.classed('TextBox', true);
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
        // Create 'background' rectangle
        var width = g.selectAll('text').node().getComputedTextLength()+10,
            height = 20;
        //maximum width
        if (width>axes.width()) width = axes.width();
        //move to the left if the name is too long
        if (config.x + width > axes.margins.left+axes.width()) config.x = axes.margins.left + axes.width() - width;
        //still be visible
        if(config.x<0) config.x = 0;
        g.selectAll('rect').data([null]).enter()
          .append('rect')
          .attr('x', 0)
          .attr('y', -19)
          .attr('width', width)
          .attr('height', height)
          .style('fill', config.bkg)
          .style('stroke', '#000000')
          .style('stroke-width', '1px');
        g.selectAll('text').moveToFront();
        g.classed('legend-item', true);
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

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

  d3.plotable = d3.plotable || {};
  d3.plotable.LabelBox = LabelBox;
})(window.d3);
