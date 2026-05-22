import { forceCollide, forceSimulation, forceX, scaleLinear /* forceY, */ } from 'd3';
import Highcharts from 'highcharts';
import { useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Axis from './swarm/Axis.jsx';
import Tooltip from './swarm/Tooltip.jsx';

function ChartSwarm({ category, hover_country = null, country = null, setHoverCountry, setCountry, swarm_collapsed, type, values }) {
  const chartSwarmRef = useRef(null);

  const tooltipRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [nodes, setNodes] = useState([]);

  // Measure container size
  useEffect(() => {
    const updateSize = () => {
      if (chartSwarmRef.current) {
        setContainerSize({
          height: chartSwarmRef.current.offsetHeight,
          width: chartSwarmRef.current.offsetWidth
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (!hover_country || !nodes.length) {
      tooltipRef.current?.hide();
    } else {
      const circle = nodes.find(p => p.Country === hover_country.label);
      if (!circle) return;

      const svg = chartSwarmRef.current.querySelector('svg');
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const eventLike = {
        clientX: rect.left + circle.x,
        clientY: rect.top + circle.y
      };

      tooltipRef.current?.show(eventLike, circle, type, category);
    }
  }, [hover_country, nodes, type, category]);

  const yScale = useMemo(
    () =>
      scaleLinear()
        .domain([-2, 60])
        .range([containerSize.height - 10, 20])
        .clamp(true),
    [containerSize.height]
  );

  // Compute nodes
  useEffect(() => {
    if (!values?.data || containerSize.width === 0 || !yScale) return;

    const centerX = containerSize.width / 2; // offset for axis
    const swarmData = values.data;

    const initialNodes = swarmData
      .filter(d => d.data[type][category] !== null)
      .map(d => {
        let bubbleColor = '#999';
        if (d.dev_status === 'Developed') bubbleColor = '#004987';
        else if (d.dev_status === 'Developing') bubbleColor = '#009edb';
        else if (d.dev_status === 'Least developed') bubbleColor = '#fbaf17';

        const isSelected = country?.value === d.Country;
        const hasSelection = !!country?.value;
        const fillColor = isSelected ? bubbleColor : hasSelection ? Highcharts.color(bubbleColor).setOpacity(0.65).get('rgba') : bubbleColor;
        const fillOpacity = isSelected ? 1 : hasSelection ? 0.65 : 1;

        // Define stroke for selected
        const strokeColor = isSelected ? '#eb1f48' : 'none';
        const strokeWidth = isSelected ? 1 : 0;
        const radius = isSelected ? 8 : containerSize.width > 500 ? 5.5 : 4.5;

        return {
          ...d,
          fillColor,
          fillOpacity,
          id: d?.ISO3 || uuidv4(),
          r: radius,
          strokeColor,
          strokeWidth,
          // x: centerX + (Math.random() - 0.5) * 200,
          x: centerX,
          y: yScale(parseFloat(d.data[type][category]) || 0)
        };
      });

    // Create simulation
    const simulation = forceSimulation(initialNodes)
      .force('forceX', forceX(centerX).strength(swarm_collapsed === 'full' ? 0.01 : 0.02))
      // .force('forceY', forceY(d => yScale(parseFloat(d.data[type][category]) || 0)).strength((swarm_collapsed === 'full') ? 9 : 1.5))
      .force(
        'collide',
        forceCollide(d => d.r * (swarm_collapsed === 'full' ? 1.4 : 1.2))
      )
      .force('lockY', () => {
        initialNodes.forEach(node => {
          node.y = yScale(parseFloat(node.data[type][category]) || 0);
        });
      })
      .stop();

    // Run simulation steps
    for (let i = 0; i < 200; i++) simulation.tick();

    setNodes(initialNodes);
  }, [values, containerSize, category, type, country, swarm_collapsed, yScale]);

  return (
    <div ref={chartSwarmRef} className="swarm_container">
      <Tooltip ref={tooltipRef} />
      <svg width={containerSize.width} height={containerSize.height} className="svg_container">
        <title>Circle</title>
        {nodes.map(circle => (
          // biome-ignore lint/a11y/useSemanticElements: SVG g elements cannot be replaced with button elements
          <g
            aria-label={circle.Country}
            key={circle.id}
            onClick={() => {
              if (!setCountry) return;
              const labelen = circle.Country;
              setCountry(prev => (prev?.value === labelen ? null : { value: labelen, label: labelen }));
            }}
            onMouseEnter={e => {
              setHoverCountry({ value: circle.ISO3, label: circle.Country });
              tooltipRef.current?.show(e, circle, type, category);
            }}
            onMouseLeave={() => {
              setHoverCountry(null);
              tooltipRef.current?.hide();
            }}
            role="button"
            style={{ cursor: 'pointer' }}
            tabIndex={0}
          >
            <circle
              cx={circle.x}
              cy={circle.y}
              fill={circle.fillColor}
              fillOpacity={circle.fillOpacity}
              r={circle.r}
              stroke={circle.strokeColor}
              strokeWidth={circle.strokeWidth}
              style={{
                cursor: 'pointer',
                transition: 'cx 0.6s, cy 0.6s, fill 0.6s, fill-opacity 0.6s, stroke 0.6s, stroke-width 0.6s'
              }}
            />
          </g>
        ))}
        <Axis scale={yScale} width={containerSize.width} />
      </svg>
    </div>
  );
}

export default ChartSwarm;
