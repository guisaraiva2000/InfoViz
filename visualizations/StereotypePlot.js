import {useEffect, useState} from "react";
import * as d3 from "d3";

function GetPlotterData(){
  let [data,setData] = useState([])
  useEffect(() => {d3.json("s-killers.json").then(setData)}, [])
  return {
    "2d": {
      x: data.map(entry => entry["stereotype_pos2D"][0]),
      y: data.map(entry => entry["stereotype_pos2D"][1])
    },

    "3d": {
      x: data.map(entry => entry["stereotype_pos3D"][0]),
      y: data.map(entry => entry["stereotype_pos3D"][1]),
      z: data.map(entry => entry["stereotype_pos3D"][2])
    },
    groups: data.map(entry => entry["stereotype"])

  }
}

export default function StereotypePlot(){
  useEffect(() => {
      import("react-plotly.js").then(p => sp(p))
    }
    ,[])

  let [p, sp] = useState(null)
  let Plot = "div"
  if(p) Plot = p.default

  let stereotypeData = GetPlotterData()
  console.log("Re renderd!")
  return <Plot
    style={{background: "black", width: "100%"}}
    data={[
      {
        x: stereotypeData["3d"].x,
        y: stereotypeData["3d"].y,
        z: stereotypeData["3d"].z,

        type: 'scatter3d',
        mode: "markers",
        marker: {color: stereotypeData.groups},
      },
    ]}
    layout={
      {
        //modebar: {remove: ["zoom2d","zoom3d","pan2d", "pan3d"]},
        scene: {
          xaxis: {
            ticks: "",
            showaxeslabels: false,
            spikesides: false,
            backgroundcolor: "white",
            color: "white"
          },
          zaxis: {
            ticks: "",
            showaxeslabels: false,
            spikesides: false,
            backgroundcolor: "white",
            color: "white"
          },
          yaxis: {
            ticks: "",
            showaxeslabels: false,
            spikesides: false,
            backgroundcolor: "white",
            color: "white"
          },
          //annotations: data.map(d => ({"text":d.name, "visible": true})), --> this is global
        }, paper_bgcolor: "black", autosize: true, title: 'A Fancy Plot'
      }}
    config={{setBackground: "transparent"}}
  />
}