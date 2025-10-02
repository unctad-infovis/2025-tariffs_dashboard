import React, { useRef, useEffect } from 'react';
import { select } from 'd3-selection';
import { axisRight } from 'd3-axis';
import PropTypes from 'prop-types';

function Axis({ scale = null, width = 0 }) {
  const axisRef = useRef(null);

  useEffect(() => {
    if (axisRef.current && scale) {
      const axis = axisRight(scale)
        .tickValues([10, 20, 30, 40, 50]) // only show 10,20,30,40
        .tickFormat(d => `${d}%`) // append %
        .tickSize(0); // no default short ticks

      const g = select(axisRef.current);
      g.call(axis);

      // Remove vertical domain line
      g.select('.domain').remove();

      // Style grid lines
      g.selectAll('.tick line')
        .attr('x2', -width + 40) // draw grid lines to the left
        .attr('stroke-dasharray', '2,2')
        .attr('stroke', '#AEA29A') // your line color
        .attr('stroke-width', 0.5);

      // Style labels
      g.selectAll('.tick text')
        .attr('x', -25) // small padding from right axis line
        .attr('dy', '-0.30em') // shift upward so it's on top of line
        .attr('text-anchor', 'start')
        .style('fill', '#7c7067') // your text color
        .style('font-size', '12px');
    }
  }, [scale, width]);

  return <g ref={axisRef} transform={`translate(${width - 20},0)`} />;
}

Axis.propTypes = {
  scale: PropTypes.func,
  width: PropTypes.number
};

export default Axis;
