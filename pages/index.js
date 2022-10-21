import Head from 'next/head'
import styles from '../styles/Home.module.css'
import StereotypePlot from "../visualizations/StereotypePlot";
import SankeyDiagram from "../visualizations/SankeyDiagram";
import {useEffect, useState} from "react"
import Context from "../visualizations/context"
import * as d3 from "d3";


export default function Home() {
  let [data, setData] = useState([])
  useEffect(() => {
    d3.json("s-killers.json").then(setData)
  }, [])
  let [kill, setKill] = useState(null)
  let [ster, setSter] = useState(null)
  const StereotypeProvider =  Context.Provider
  return <div>
    <Head>
      <title>Create Next App</title>
      <meta name="description" content="Generated by create next app"/>
      <link rel="icon" href="/favicon.ico"/>
    </Head>
    <main>
      <StereotypeProvider value={{setKill:setKill,setSter:setSter, val : {stereotype: ster, killer : kill}}}>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h2>U.S. Map</h2>
        </div>
        <div className={styles.card}>
          <SankeyDiagram data={data} ></SankeyDiagram>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2>Stereotypes</h2>
        </div>
        <div className={styles.card}>
          <h2>Hexagon</h2>
        </div>
        <div className={styles.card}>
          <h2>Index Scatter</h2>
        </div>
      </div>
      </StereotypeProvider>

    </main>
  </div>
}
