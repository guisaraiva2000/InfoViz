import * as d3 from "d3";
import {useContext, useEffect, useRef, useState} from "react";
import {Context} from "./Context";
import {Killers} from "../interfaces/killers";

function DrawPlot(width, height, data, div) {
    let x_max = Number(d3.max(data.map(k => k.stereotype_pos[0])))
    x_max += Math.round(x_max * 0.10)
    let y_max = Number(d3.max(data.map(k => k.stereotype_pos[1])))
    if (isNaN(y_max)) return
    y_max += Math.round(y_max * 0.10)
    console.log(data)
    console.log(x_max, y_max)
    var margin = {top: 0, right: 0, bottom: 0, left: 0}
    let svg = d3.select(div).append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    let x = d3.scaleLinear()
        .domain([0, 4000])
        .range([0, width]);
    let y = d3.scaleLinear()// Add Y axis
        .domain([0, 500000])
        .range([height, 0]);

    let points = data.map((k, i) => {
        return <circle key={i} cx={y(k.stereotype_pos[0])} cy={x(k.stereotype_pos[1])}
                       r={1.5} fill={"white"}></circle>
    })
}

function handleClick(event, context) {
    let line: SVGPathElement = event.target as SVGPathElement
    let killer_id = line.dataset["killerid"]
    let stereotype = line.dataset["stereotype"]
    console.log(stereotype, killer_id)
    if(killer_id !== undefined) context.setKiller(killer_id)
}

export default function (props: { data: [Killers] }) {
    let context = useContext(Context)
    let plotRef = useRef(null)
    let [data, setData] = useState(null)
    let [size, setSize] = useState({width: 400, height: 300})
    if (data != props.data) setData(props.data)

    useEffect(() => {
            d3.select("#scatter-stero").on("click", (e) => handleClick(e, context))
        }
        , [plotRef.current])

    let element = plotRef.current
    if ((element !== null) && data !== null) {
        let dims = element.getBoundingClientRect()
        if (dims.height != size.height && dims.width != size.width) setSize({width: dims.width, height: dims.height})
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
    console.log(data)
    console.log(x_max, y_max)
    var margin = {top: 10, right: 10, bottom: 10, left: 10}
    let x = d3.scaleLinear()
        .domain([x_min, x_max])
        .range([0, size.width]);
    let y = d3.scaleLinear()// Add Y axis
        .domain([y_min, y_max])
        .range([size.height, 0]);

    let points = data.map((k, i) => {
        return <circle key={i}
                       data-killerid={i}
                       data-stereotype={k.stereotype}
                       cx={y(k.stereotype_pos[0])}
                       cy={x(k.stereotype_pos[1])}
                       r={3} fill={context.state.stereotypes[k.stereotype].color}
                       stroke={context.state.currentKiller == i ? "white" : "none"}
        />


    })
    return <svg ref={plotRef} id={"scatter-stero"} width={size.width} height={size.height}>
        <g>{points}</g>
    </svg>
}
