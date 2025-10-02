import React, {
  useState, useEffect, useRef, useCallback
} from 'react';
import '../styles/styles.less';

// https://www.npmjs.com/package/react-is-visible
import 'intersection-observer';
import { useIsVisible } from 'react-is-visible';

import Select from 'react-select';

// Load helpers.
import ChartMap from './components/ChartMap.jsx';
import ChartSwarm from './components/ChartSwarm.jsx';

function App() {
  const appRef = useRef(null);
  const isVisibleApp = useIsVisible(appRef);

  const [data, setData] = useState(false);

  const [type, setType] = useState('pre');
  const [category, setCategory] = useState('total');
  const [country, setCountry] = useState(null);

  const [swarmCollapsed, setSwarmCollapsed] = useState(false);

  const fetchExternalData = () => {
    const dataPath = `${(window.location.href.includes('unctad.org')) ? 'https://storage.unctad.org/2025-tariffs_dashboard/' : (window.location.href.includes('localhost:80')) ? './' : 'https://unctad-infovis.github.io/2025-tariffs_dashboard/'}assets/data/`;

    const topology_file = 'worldmap-economies-54030.topo.json';
    const data_file = 'data.json';
    let values;
    try {
      values = Promise.all([
        fetch(dataPath + topology_file),
        fetch(dataPath + data_file),
      ]).then(results => Promise.all(results.map(result => result.json())));
    } catch (error) {
      console.error(error);
    }
    return values;
  };

  const checkWidth = useCallback(() => {
    if (appRef.current.offsetWidth < 600) {
      setTimeout(() => {
        setSwarmCollapsed(true);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (isVisibleApp === true) {
      checkWidth();
    }
  }, [checkWidth, isVisibleApp]);

  useEffect(() => {
    fetchExternalData().then((result) => setData(result));
  }, []);

  const changeType = (element) => {
    appRef.current.querySelectorAll('.selection_container.type_selection button').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    setType(element.value);
  };

  const changeCategory = (element) => {
    appRef.current.querySelectorAll('.selection_container.category_selection button').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    setCategory(element.value);
  };

  const changeCountry = (option) => {
    setCountry(option && (!Array.isArray(option) || option.length) ? option : null);
  };

  return (
    <div className="app" ref={appRef}>
      <div className="title_container">
        <img src="https://static.dwcdn.net/custom/themes/unctad-2024-rebrand/Blue%20arrow.svg" className="logo" alt="UN Trade and Development logo" />
        <div className="title">
          <h3>Tariffs dashboard</h3>
          <h4>Evolution of the tariff landscape in the United States</h4>
        </div>
      </div>
      <div className="label_container"><h4>Select time frame</h4></div>
      <div className="selection_container type_selection">
        <div className="selector_container">
          <button type="button" className="active" value="pre" onClick={(event) => changeType(event.currentTarget)}>
            <div className="title">Pre</div>
            <div className="subtitle">January 2025</div>
          </button>
        </div>
        <div className="selector_container">
          <button type="button" value="during" onClick={(event) => changeType(event.currentTarget)}>
            <div className="title">During</div>
            <div className="subtitle">90-day pause</div>
          </button>
        </div>
        <div className="selector_container">
          <button type="button" value="now" onClick={(event) => changeType(event.currentTarget)}>
            <div className="title">After</div>
            <div className="subtitle">90-day pause</div>
          </button>
        </div>
      </div>
      <div className="label_container"><h4>Select commodity group</h4></div>
      <div className="selection_container category_selection">
        <div className="selector_container">
          <button type="button" className="active" value="total" onClick={(event) => changeCategory(event.currentTarget)}>
            <div className="title">Total</div>
          </button>
        </div>
        <div className="selector_container">
          <button type="button" value="manufacturing" onClick={(event) => changeCategory(event.currentTarget)}>
            <div className="title">Manufacturing</div>
          </button>
        </div>
        <div className="selector_container">
          <button type="button" value="agriculture" onClick={(event) => changeCategory(event.currentTarget)}>
            <div className="title">Agriculture</div>
          </button>
        </div>
        <div className="selector_container">
          <button type="button" value="fuels_mining" onClick={(event) => changeCategory(event.currentTarget)}>
            <div className="title">Fuels and mining</div>
          </button>
        </div>
      </div>
      <div className="label_container"><h4>Choose a country</h4></div>
      <div className="selection_container">
        <div className="selector_container">
          {data
          && (
          <Select
            className="basic-single"
            classNamePrefix="select"
            defaultValue=""
            isClearable
            isDisabled={false}
            isLoading={false}
            isRtl={false}
            isSearchable
            name="country"
            value={country}
            onChange={(selectedOption) => changeCountry(selectedOption)}
            options={data[1].slice().sort((a, b) => a.Country.localeCompare(b.Country)).map((el) => ({ value: el.Country, label: el.Country }))}
            placeholder="Select a country"
          />
          )}
        </div>
      </div>
      <div className="legend_container">
        <div className="legend_item developed">Developed</div>
        <div className="legend_item developing">Developing</div>
        <div className="legend_item ldc">Least developed</div>
        <div className="legend_item selected">Selected country</div>
      </div>
      <div className="visualization_container">
        <div className="map_wrapper">
          {data !== false && (
          <ChartMap
            category={category}
            country={country}
            swarm_collapsed={swarmCollapsed}
            setCountry={setCountry}
            type={type}
            values={data}
          />
          )}
        </div>

        {data !== false && (
          <div className={`swarm_wrapper ${swarmCollapsed ? 'collapsed' : ''}`}>
            <button type="button" onClick={() => setSwarmCollapsed(!swarmCollapsed)}>
              {swarmCollapsed ? '◀◀' : '▶▶'}
            </button>
            <ChartSwarm
              category={category}
              country={country}
              swarm_collapsed={swarmCollapsed}
              setCountry={setCountry}
              type={type}
              values={data}
            />
          </div>
        )}
      </div>
      <div className="caption_container">
        <em>Source:</em>
        {' '}
        UN Trade and Development (UNCTAD) based on USITC and US presidential actions, including the Executive Orders published by the White House.
        <br />
        <em>Note:</em>
        {' '}
        Trade weights are for the year 2024. Tariffs are calculated at the HS 8-digit level. Tariffs during the 90-day pause reflect the situation as of 18 June 2025. The analysis excludes Section 232 steel and aluminum tariffs on derivatives under HS chapters 1-70, where the additional duty applies only to the metal content which is expected to be low. Tariffs for Belarus, Cuba, North Korea, and the Russian Federation are not presented, as separate schedules apply. Special industrial zones were not considered in tariff calculations. Data updated as of 12 September 2025.
        {' '}
        <a href="https://unctad.org/page/map-disclaimer" target="_blank" rel="noreferrer">Map disclaimer</a>
      </div>
    </div>
  );
}

export default App;
