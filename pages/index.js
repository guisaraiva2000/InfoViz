import Head from 'next/head'
import styles from '../styles/Home.module.css'

import RadarChart from "../visualizations/RadarChart.tsx";
import UsaChart from "../visualizations/USA.tsx";

import {ContextProvider} from "../visualizations/Context"

import {useEffect, useState} from "react";

import SankeyDiagram from "../visualizations/SankeyDiagram";


import * as d3 from "d3";
import StereotypesFilter from "../visualizations/Stereotypes";
import StereotypeScatter from "../visualizations/StereotypeScatter";

import IndexScatter from "../visualizations/IndexScatter";


export default function Home() {

  let [killersData, setKillersData] = useState([]);
  let [mapData, setMapData] = useState([]);
  let [victimsData, setVictimsData] = useState(null);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);

  useEffect(() => {
    d3.json("datasets/serial_killers.json").then((d) => {
      d.map(k  => {
        k.stereotype = k.Stereotype
        k.stereotype_pos = k["Stereotype Position"]
        k["Served in the military?"] = k["Served in the military?"] == null ? false : k["Served in the military?"]
        k["Served in the military?"] = typeof k["Served in the military?"] !== "boolean"  ? true : k["Served in the military?"]
        k["Spent time incarcerated?"] = k["Spent time incarcerated?"] == null ? false : k["Spent time incarcerated?"]
        k["Marital status"] = k["Marital status"] == null ? "Single" : k["Marital status"]
        k["Gender of victims"] = k["Gender of victims"] == null ? "Male" : k["Gender of victims"]
        k["Sexual preference"] = k["Sexual preference"] == null ? "Heterosexual" : k["Sexual preference"]
        k["Sexual preference"] = k["Sexual preference"].length > 20 ? "Heterosexual" : k["Sexual preference"]
      } )
      setKillersData(d);
      setLoading1(false);
    });
    d3.json("datasets/us_w_counties.json").then((d) => {
      setMapData(d);
      setLoading2(false);
    });
    d3.csv("datasets/victims_by_state.csv").then((d) => {
      const victimsData = new Map()
      d.forEach(s =>
        victimsData.set(s.State, {
            "serialKillersVictims": s.serialKillersVictims,
            "serialKillersVictimsPerCapita": s.serialKillersVictimsPerCapita
        })
      )
      setVictimsData(victimsData);
      setLoading3(false);
    });
    return () => undefined;
  }, []);

  return (
    <div>
      <Head>
        <title>Serial Killers Viz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={styles.title}>
          <h2>Known Serial Killers in the U.S.A</h2>
        </div>
        <ContextProvider>
          {/* insert visualizations here */}
          <div className={styles.grid}>
            <div className={styles.card}>
              <h2>U.S.A.: Serial Killer Distribution & Victims per State</h2>
              {loading2 && loading3 && <div>loading</div>}
              {!loading2 && !loading3 && <UsaChart
                className={styles.chart}
                mapData={mapData}
                killersData={killersData}
                victimsData={victimsData}
              />
              }
            </div>
            <div className={styles.labels}>
              <h2>Stereotypes</h2>
              <div id="stereotypes">
                {loading1 && <div>loading</div>}
                {!loading1 && <StereotypesFilter className={styles.chart}/>}
              </div>
            </div>
            <div className={styles.card}>
              <SankeyDiagram data={killersData}/>
            </div>
          </div>
        <div className={styles.grid}>
            <div className={styles.card}>
              <StereotypeScatter data={killersData}/>
            </div>
            <div className={styles.card}>
              <h2>Stereotype Indexes</h2>
              {loading1 && <div>loading</div>}
              {!loading1 && <RadarChart className={styles.chart} data={killersData}/>}
            </div>
            <div className={styles.card}>
              <h2>Index Scatter</h2>
              {loading1 && <div>loading</div>}
              {!loading1 && <IndexScatter className={styles.chart} data={killersData} />}
            </div>
          </div>
        </ContextProvider>
      </main>
    </div>
  )

}
