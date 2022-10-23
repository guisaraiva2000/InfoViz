import * as d3 from "d3";
import {useContext, useEffect, useRef, useState} from "react";
import {Context} from "./Context";
import {Killers} from "../interfaces/killers";
import {ScaleLinear} from "d3";
import sync from 'css-animation-sync';

//remove preselection
function handleOnMouseOut(event, setKiller){
    console.log("outt")
    let preselected = document.querySelector("#scatter-stero>g>circle.pre-selected")
        if(preselected !== null) {
            preselected.classList.remove("pre-selected")
//            if(!preselected.classList.contains("selectedKiller")){
 //               setKiller(null)
  //          }
        }
}


// pre select closes point
function handleMouseMove(event, currentKiller,setKiller, y_scale: ScaleLinear<any, any>) {
    let chart = event.target.closest("svg").getBoundingClientRect()
    let mouse = [event.pageX - chart.left, event.pageY - chart.top]
    let circles = Array(...document.querySelectorAll("#scatter-stero>g>circle"))
    circles.map(e => e.classList.remove("pre-selected"))
    let closest_circle: Element = circles.sort((a: SVGCircleElement, b: SVGCircleElement) => {
            let [ax, ay] = [Number(a.getAttribute("cx")),Number( a.getAttribute("cy"))]
            let [bx, by] = [Number(b.getAttribute("cx")),Number( b.getAttribute("cy"))]
            let aDist = Math.sqrt((ax - mouse[0]) ** 2 + (ay - mouse[1]) ** 2) // Norm distance
            let bDist = Math.sqrt((bx - mouse[0]) ** 2 + (by - mouse[1]) ** 2) // Norm distance
                return aDist - bDist
        }
    )[0]
    closest_circle.classList.add("pre-selected")
    if (currentKiller !== closest_circle.dataset["killerid"]) setKiller(closest_circle.dataset["killerid"])
}


// select closest point
function handleClick(event, setKiller) {
    let line: SVGPathElement = event.target as SVGPathElement
    let stereotype = line.dataset["stereotype"]
    let preselected = document.querySelector("#scatter-stero>g>circle.pre-selected")
    let killer_id = preselected?.dataset["killerid"]
    if (killer_id !== undefined) setKiller(killer_id)
}

export default function (props: { data: [Killers] }) {
    let context = useContext(Context)
    let setKiller = context.setKiller
    let plotRef = useRef(null)
    let [data, setData] = useState(null)
    let [size, setSize] = useState({width: 400, height: 300})
    if (data != props.data) setData(props.data)

    useEffect(() => {
            sync("selectedSterAnim")
        }
        , [plotRef.current])

    let element = plotRef.current
    if ((element !== null) && data !== null) {
        let dims = element.getBoundingClientRect()
        if (dims.height != size.height || dims.width != size.width) setSize({width: dims.width, height: dims.height})
        //DrawPlot(size.width, size.height, data, element.current)
    }
    if (data == null) return <div>Loading...</div>

    let x_coordinates = data.map(k => k.stereotype_pos[0])
    let y_coordinates = data.map(k => k.stereotype_pos[1])
    let x_max = Number(d3.max(x_coordinates))
    x_max += Math.round(x_max * 0.10)
    let y_max = Number(d3.max(y_coordinates))
    y_max += Math.round(x_max * 0.10)
    let x_min = Number(d3.min(x_coordinates))
    let y_min = Number(d3.min(y_coordinates))
    x_min -= x_min * 0.1
    y_min -= y_min * 0.1

    if (isNaN(y_max)) return
    y_max += Math.round(y_max * 0.10)
    var margin = {top: 10, right: 10, bottom: 10, left: 10}
    let x = d3.scaleLinear()
        .domain([x_min, x_max])
        .range([0, size.width]);
    let y = d3.scaleLinear()// Add Y axis
        .domain([y_min, y_max])
        .range([size.height, 0]);

    let points = data.map((k, i) => {
        let isSelectedStereo = context.state.currentStereotypes.includes(k.stereotype)
        let isCurrentKiller = context.state.currentKiller == i
        return <circle key={i}
                       data-killerid={i}
                       data-stereotype={k.stereotype}
                       cx={y(k.stereotype_pos[0])}
                       cy={x(k.stereotype_pos[1])}
                       r={3} fill={context.state.stereotypes[k.stereotype].color}
                       className={ (isSelectedStereo ? "selectedS" : "") + (isCurrentKiller ?  "currentKiller" : "")}
                       stroke={isCurrentKiller ? "white" : "none"}
                       strokeWidth={isCurrentKiller ? "3px": "none"}
        />


    })
    return <div ref={plotRef} style={{overflow: "display", width: "95%", height: "95%"}}>
        <svg onClick={e => handleClick(e, setKiller)} onMouseLeave={e => handleOnMouseOut(e, setKiller)} onMouseMove={e => handleMouseMove(e, context.state.currentKiller,setKiller)} style={{zIndex: 20, overflow: "visible"}} id={"scatter-stero"}
             width={size.width} height={size.height}>
            <g>{points}</g>
        </svg>
    </div>
}
