import * as d3 from "d3";
import {useContext, useEffect, useRef, useState} from "react";
import {Context} from "./Context";
import {Killers} from "../interfaces/killers";
import {ScaleLinear} from "d3";
import sync from 'css-animation-sync';

//remove preselection
function handleOnMouseOut(event, setKiller) {
    console.log("outt")
    let preselected = document.querySelector("#scatter-stero>g>circle.pre-selected")
    if (preselected !== null) {
        preselected.classList.remove("pre-selected")
//            if(!preselected.classList.contains("selectedKiller")){
        //               setKiller(null)
        //          }
    }
}


// pre select closes point
function handleMouseMove(event, currentKiller, setKiller,) {
    let chart = event.target.closest("svg").getBoundingClientRect()
    let mouse = [event.pageX - chart.left, event.pageY - chart.top]
    let circles = Array(...document.querySelectorAll("#scatter-stero>g>circle"))
    circles.map(e => e.classList.remove("pre-selected"))
    let closest_circle: Element = circles.sort((a: SVGCircleElement, b: SVGCircleElement) => {
            let [ax, ay] = [Number(a.getAttribute("cx")), Number(a.getAttribute("cy"))]
            let [bx, by] = [Number(b.getAttribute("cx")), Number(b.getAttribute("cy"))]
            let aDist = Math.sqrt((ax - mouse[0]) ** 2 + (ay - mouse[1]) ** 2) // Norm distance
            let bDist = Math.sqrt((bx - mouse[0]) ** 2 + (by - mouse[1]) ** 2) // Norm distance
            return aDist - bDist
        }
    )[0]
    closest_circle.classList.add("pre-selected")
    if (currentKiller !== closest_circle.dataset["killerid"]) setKiller(closest_circle.dataset["killerid"])
}


// select closest point
function handleClick(event, setKiller, setSelectedKiller) {
    let line: SVGPathElement = event.target as SVGPathElement
    let stereotype = line.dataset["stereotype"]
    let preselected = document.querySelector("#scatter-stero>g>circle.pre-selected")
    let killer_id = preselected?.dataset["killerid"]
    let previousKiller = document.querySelector("#scatter-stero>g>circle#selectedKiller")

    let clickingOnSelected = preselected == null
    if (clickingOnSelected) { // un toggle killer
        if(previousKiller) previousKiller.id = "" // if the mouse does not move for a moment there will be no prev selection
        setSelectedKiller(null)
    } else if (killer_id === undefined) return
    else {
        previousKiller?.setAttribute("id", "")
        preselected.id = ("selectedKiller")
        setSelectedKiller(killer_id)
        setKiller(killer_id)
    }
}

export default function StereotypeScatter(props: { data: [Killers] }) {
    let context = useContext(Context)
    let setKiller = context.setKiller
    let plotRef = useRef(null)
    let [data, setData] = useState(null)
    let [size, setSize] = useState({width: 400, height: 300})
    let [selectedKiller, setSelectedKiller] = useState("selectedKiller")
    if (data != props.data) setData(props.data)

    useEffect(() => {
            sync("selectedSterAnim")
            let Tooltip = d3.select("#scatter-stero-container   typo to disablethis")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "rgba(200, 200, 200, 0.71)")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")
                .style("z-index", "10000")
                .style("position", "absolute")
                .html("HH")
            console.log(Tooltip)

            d3.selectAll("#scatter-stero")
                .on("mouseover", d => Tooltip.style("opacity", 1))
                .on("mousemove", d => {

                        Tooltip.html("Name: SOMETHING IDK")
                            .style("left", (d.offsetX+30) + "px")
                            .style("top", d.offsetY + "px")
                    }
                )
                .on("mouseleave", d => Tooltip.style("opacity", 0))

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
        let isSelectedKiller = selectedKiller == i
        return <circle key={i}

                       data-killerid={i}
                       data-stereotype={k.stereotype}
                       cx={x(k.stereotype_pos[0])}
                       cy={y(k.stereotype_pos[1])}
                       r={4} fill={context.state.stereotypes[k.stereotype].color}
                       className={(isSelectedKiller ? "selectedKiller" : "") + (isSelectedStereo ? "selectedS" : "") + (isCurrentKiller ? "currentKiller" : "")}
                       stroke={isCurrentKiller ? "white" : "none"}
                       strokeWidth={isCurrentKiller ? "3px" : "none"}
        />


    })
    return <div ref={plotRef} id={"scatter-stero-container"}
                style={{overflow: "display", width: "95%", height: "95%", transform: "translate(45px, -20px)"}}>
        <svg id={"scatter-stero"}

             style={{zIndex: 20, overflow: "visible"}}
             height={"100%"} width={"100%"}
             onClick={e => handleClick(e, setKiller, setSelectedKiller)}
             onMouseLeave={e => handleOnMouseOut(e, setKiller)}
             onMouseMove={e => handleMouseMove(e, context.state.currentKiller, setKiller)}>
            <g>{points}</g>
        </svg>
    </div>
}
