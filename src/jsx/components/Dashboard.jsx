import Select from '@unctad-infovis/general-tools/components/Select.jsx';
import Tooltip from '@unctad-infovis/general-tools/components/Tooltip.jsx';
import LoadFile from '@unctad-infovis/general-tools/helpers/LoadFile.js';
import useIsVisible from '@unctad-infovis/general-tools/helpers/UseIsVisible.js';

import { useCallback, useEffect, useState } from 'react';

// Load helpers.
import ChartMap from './dashboard/ChartMap.jsx';
import ChartSwarm from './dashboard/ChartSwarm.jsx';

import './Dashboard.css';

function App({ meta }) {
  const [setAppNode, isVisibleApp, appNode] = useIsVisible(0.1);

  const [data, setData] = useState(false);

  const [type, setType] = useState('pre');
  const [category, setCategory] = useState('total');
  const [country, setCountry] = useState(null);
  const [hoverCountry, setHoverCountry] = useState(null);

  const [swarmState, setSwarmState] = useState('expanded');

  const fetchExternalData = useCallback(async () => {
    const data = {};

    data.data = await (await LoadFile(`./assets/data/data.json?${meta.updated_file}`)).json();
    data.topology = await (await LoadFile('./assets/data/worldmap-economies-54030.topo.json')).json();

    return data;
  }, [meta.updated_file]);

  useEffect(() => {
    const load = async () => {
      const result = await fetchExternalData();

      setData(result);
    };

    load();
  }, [fetchExternalData]);

  const checkWidth = useCallback(() => {
    if (appNode && appNode.offsetWidth < 600) {
      setTimeout(() => {
        setSwarmState('collapsed');
      }, 1500);
    }
  }, [appNode]);

  useEffect(() => {
    if (isVisibleApp === true) {
      checkWidth();
    }
  }, [checkWidth, isVisibleApp]);

  const changeType = element => {
    for (const el of appNode.querySelectorAll('.selection_container.type_selection button')) el.classList.remove('active');
    element.classList.add('active');
    setType(element.value);
  };

  const changeCategory = element => {
    for (const el of appNode.querySelectorAll('.selection_container.category_selection button')) el.classList.remove('active');
    element.classList.add('active');
    setCategory(element.value);
  };

  const changeCountry = option => {
    setCountry(option ?? null);
    setHoverCountry(option ?? null);
  };

  return (
    <figure className="container_custom app" ref={setAppNode}>
      <div className="title_container">
        <div className="text_container">
          <div className="main_title_container">
            <img src="https://static.dwcdn.net/custom/themes/unctad-2024-rebrand/Blue%20arrow.svg" className="logo" alt="UN Trade and Development logo" width="44" height="44" />
            <div className="title">
              <h3>How much have US tariffs really changed?</h3>
            </div>
          </div>
          {/* <h4>Public discussions tend to focus on “reciprocal” tariffs, but they are only part of the story. Applied tariffs differ also because of older tariff rules, exemptions, and sectoral tariffs.</h4> */}
        </div>
      </div>
      <div className="visualizations_container">
        <div className="content">
          <div className="controls_container">
            <div className="control_container">
              <div className="label_container">
                <h4>
                  <span>1</span>
                  Select time frame
                </h4>
              </div>
              <div className="selection_container type_selection">
                <div className="selector_container">
                  <button type="button" className="active" value="pre" onClick={event => changeType(event.currentTarget)}>
                    <div className="title">Pre-January 2025</div>
                  </button>
                </div>
                <div className="selector_container">
                  <button type="button" value="feb26" onClick={event => changeType(event.currentTarget)}>
                    <div className="title">February 2026</div>
                  </button>
                </div>
                <div className="selector_container">
                  <button type="button" value="now" onClick={event => changeType(event.currentTarget)}>
                    <div className="title">Current tariffs</div>
                  </button>
                </div>
              </div>
            </div>
            <div className="control_container">
              <div className="label_container">
                <h4>
                  <span>2</span>
                  Select type of product
                </h4>
              </div>
              <div className="selection_container category_selection">
                <div className="selector_container">
                  <button type="button" className="active all" value="total" onClick={event => changeCategory(event.currentTarget)}>
                    <div className="title">ALL</div>
                  </button>
                </div>
                <div className="selector_container">
                  <button type="button" value="manufacturing" onClick={event => changeCategory(event.currentTarget)}>
                    <div className="title">Manufacturing</div>
                  </button>
                </div>
                <div className="selector_container">
                  <button type="button" value="agriculture" onClick={event => changeCategory(event.currentTarget)}>
                    <div className="title">Agriculture</div>
                  </button>
                </div>
                <div className="selector_container">
                  <button type="button" value="fuels_mining" onClick={event => changeCategory(event.currentTarget)}>
                    <div className="title">Fuels &amp; mining</div>
                  </button>
                </div>
              </div>
            </div>
            <div className="control_container">
              <div className="label_container">
                <h4>
                  <span>3</span>
                  Select economy
                </h4>
              </div>
              <div className="selection_container">
                <div className="selector_container">
                  {data && (
                    <Select
                      className="country_select"
                      clearable
                      name="country"
                      onChange={selectedOption => changeCountry(selectedOption)}
                      options={data.data
                        .slice()
                        .sort((a, b) => a.Country.localeCompare(b.Country))
                        .map(el => ({ value: el.Country, label: el.Country }))}
                      placeholder="Select economy"
                      searchable
                      value={country}
                    />
                  )}
                </div>
              </div>
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
              <p>
                <strong>Mapping the size</strong>
                <br />
                Trade-weighted average <Tooltip className="circle_info" content="The trade-weighted average tariff rate applied to each economy is based on the composition of exports to the US in 2024." />
              </p>
              {data !== false && <ChartMap category={category} country={country} hover_country={hoverCountry} swarm_collapsed={swarmState} setCountry={setCountry} setHoverCountry={setHoverCountry} type={type} values={data} />}
            </div>
            {data !== false && (
              <div className={`swarm_wrapper ${swarmState}`}>
                <div className="swarm_controls_container">
                  {swarmState !== 'full' && appNode?.offsetWidth < 900 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSwarmState(prev => {
                          if (prev === 'collapsed') return 'expanded';
                          if (prev === 'expanded') return 'collapsed';
                          if (prev === 'full') return 'expanded';
                          return prev;
                        });
                      }}
                    >
                      {swarmState === 'collapsed' ? '◀◀' : '▶▶'}
                    </button>
                  )}{' '}
                  {appNode?.offsetWidth > 900 && false && (
                    <button
                      type="button"
                      onClick={() => {
                        setSwarmState(prev => {
                          if (prev === 'full') return 'expanded';
                          if (prev === 'expanded') return 'full';
                          return prev;
                        });
                      }}
                    >
                      {swarmState === 'full' ? '▶▶' : '⛶'}
                    </button>
                  )}
                </div>
                <p>
                  <strong>Mapping the difference</strong>
                  <br />
                  Trade-weighted average <Tooltip className="circle_info" content="The trade-weighted average tariff rate applied to each economy is based on the composition of exports to the US in 2024." />
                </p>
                <ChartSwarm category={category} country={country} hover_country={hoverCountry} setCountry={setCountry} setHoverCountry={setHoverCountry} swarm_collapsed={swarmState} type={type} values={data} />
              </div>
            )}
          </div>
          <div className="caption_container">
            <em>Source:</em> UN Trade and Development (UNCTAD) based on USITC and US presidential actions, including the Executive Orders published by the White House.
            <br />
            <em>Note:</em> February 2026 corresponds to the last day when IEEPA tariffs were still in force. Trade weights are for the year 2024. Tariffs are calculated at the HS 8-digit level. Agriculture includes agricultural raw materials and food. Fuels and mining include fuels, ores, metals, precious stones and
            non-monetary gold. The analysis excludes Section 232 steel and aluminum tariffs on derivatives under HS chapters 1-70, where the additional duty applies only to the metal content which is expected to be low. Tariffs for Belarus, Cuba, North Korea, and the Russian Federation are not presented, as separate
            schedules apply. Special industrial zones were not considered in tariff calculations. Classification of goods by sectors according to UNCTAD Handbook of Statistics 2024; more goods are contained in total results than in the three broad sectoral groups. Data updated as of {meta.updated_text}.{' '}
            <a href="https://unctad.org/page/map-disclaimer" target="_blank" rel="noreferrer">
              Map disclaimer
            </a>
            .
            <br />
            <a href="https://storage.unctad.org/2025-tariffs_dashboard/assets/data/data.csv?february" target="_blank" rel="noreferrer">
              Get the data
            </a>
          </div>
        </div>
      </div>
    </figure>
  );
}

export default App;
