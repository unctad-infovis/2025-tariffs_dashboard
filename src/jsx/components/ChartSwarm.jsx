import React, {
  useRef
} from 'react';
import PropTypes from 'prop-types';

// import { v4 as uuidv4 } from 'uuid';

function ChartSwarm({ values }) {
  const chartSwarmRef = useRef(null);
  console.log(values);
  return (
    <div className="swarm_container">
      <div id="swarm_container" className="" ref={chartSwarmRef}>Swarm</div>
    </div>
  );
}

export default ChartSwarm;

ChartSwarm.propTypes = {
  values: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])).isRequired
};
