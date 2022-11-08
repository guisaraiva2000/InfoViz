import * as d3 from "d3";
import Head from 'next/head'
import {useEffect, useState} from "react";

import styles from '../styles/Home.module.css'

import RadarChart from "../visualizations/RadarChart.tsx";
import UsaChart from "../visualizations/USA.tsx";
import SankeyDiagram from "../visualizations/SankeyDiagram";
import StereotypesFilter from "../visualizations/Stereotypes";
import StereotypeScatter from "../visualizations/StereotypeScatter";
import IndexScatter from "../visualizations/IndexScatter";
import {ContextProvider} from "../visualizations/Context"
import {killers, us_counties, vic_data} from "../visualizations/data";


export default function Home() {
  let [killersData, setKillersData] = useState(killers)
  let [mapData, setMapData] = useState(us_counties);
  const victimsData = new Map()
  //let [victimsData, setVictimsData] = useState(vic_data);
  vic_data.forEach(s =>
    victimsData.set(s.State, {
      "serialKillersVictims": s.serialKillersVictims,
      "serialKillersVictimsPerCapita": s.serialKillersVictimsPerCapita
    }))

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
               <UsaChart
                className={styles.chart}
                mapData={mapData}
                killersData={killersData}
                victimsData={victimsData}
              />
            </div>
            <div className={styles.labels}>
              <h2>Stereotypes</h2>
              <div id="stereotypes">
                <StereotypesFilter className={styles.chart}/>
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
              <RadarChart className={styles.chart} data={killersData}/>
            </div>
            <div className={styles.card}>
              <h2>Index Scatter</h2>
              <IndexScatter className={styles.chart} data={killersData}/>
            </div>
          </div>
        </ContextProvider>
      </main>
    </div>
  )

}
