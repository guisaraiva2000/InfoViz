import * as d3 from "d3";
import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import {Killers} from "../interfaces/killers";
import {Context} from "./Context";
import Props from "../interfaces/killers"
import sync from 'css-animation-sync';
import {ScaleLinear, select, zip} from "d3";
import styles from '../styles/Home.module.css'
import { handleClientScriptLoad } from "next/script";


// get the axis 
// start with IQ(x) vs Victims killed(y)
let x_data = "IQ"
let y_data = "Number of victims"

// Scatter
function DrawIndexScatter(svgRef, data: [Killers]) {
    
    let context = useContext(Context)

    // Add tooltip if needed
    // useEffect(() => {...})

    if (data == null) return <div>Loading...</div>

    let x_coor = data.map(k => k[x_data])
    let y_coor = data.map(k => k[y_data])
    // any null values removes row from plot
    for (let i = 0; i < x_coor.length; i++) {
        if (x_coor[i] == null || y_coor[i] == null) {
            y_coor[i] = null
            x_coor[i] = null
        }
    }
    x_coor = x_coor.filter(x => x !== null)
    y_coor = y_coor.filter(x => x !== null)
    console.log(x_coor)
    console.log(y_coor)
    let x_max = Number(d3.max(x_coor))
    let y_max = Number(d3.max(y_coor))

    var svg = d3.select(svgRef.current)
    
    const height = Number(svg.style("height").replace("px", ""));
    const width = Number(svg.style("width").replace("px", ""));
    
    console.log("H: " + height + "W: " + width)

    var margin = {top:30, right:30, bottom:30, left:40}
    let x = d3.scaleLinear()
        .domain([0, x_max + 10])
        .range([margin.left * 1.5, width - margin.right])

    let y = d3.scaleLinear()
        .domain([0, y_max + 10])
        .range([height - margin.bottom * 1.5, margin.top])

    // add labels
    svg.append("text")
        .attr("x", margin.left + (width - margin.left - margin.right) / 2)
        .attr("y", height - margin.bottom / 5)
        .attr("class", "label")
        .style("fill", "white")
        .text(x_data);
    
    svg.append("text")
        .attr("y", margin.left / 4)
        .attr("x", -height / 1.5)
        .attr("transform", "rotate(-90)")
        .attr("class", "label")
        .style("fill", "white")
        .text(y_data);

    // Add axis
    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom * 1.5) + ")")
        .call(d3.axisBottom(x))
    
    svg.append("g")
        .attr("transform", "translate(" + (margin.left * 1.5) + ", 0)")
        .call(d3.axisLeft(y))

    // null values get -100000
    svg.selectAll("dot")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", (d) => x(d[x_data]) || -1000000) // null values get out of the plot
       .attr("cy", (d) => y(d[y_data]) || -1000000)
       .attr("r", 4)
       .attr("fill", (d) => context.state.stereotypes[d.stereotype].color)
       .on("mouseout", function() {
            d3.select(this)
              .style("stroke", "black")
              .style("stroke-width", 0.3)
              .transition()
              .duration(1200)
              .attr("r", 4)
       })
       .on("mouseover", function() {
            d3.select(this)
              .style("stroke", "white")
              .style("stroke-width", 1)
              .transition()
              .duration(1200)
              .attr("r", 8)
       })
       .on("click", function() {
            d3.select(this)
              .transition()
              .duration(1200)
              .attr("r", 16)
              .style("stroke", "white")
              .style("stroke-width", 2)
            
       })
       .on("mousemove", function(event, d) {
            
       })
    return svg.node()
}

const IndexScatter: FunctionComponent = (props: Props) => {
    const svgRef = useRef<SVGSVGElement>(null);

    const context = useContext(Context);
    const stereotypes = context.state.stereotypes
    let currentStereotypes = context.state.currentStereotypes
    const setStereotype = context.setStereotype

    if (svgRef.current !== null)
        DrawIndexScatter(svgRef, props.data /*currentStereotypes, stereotypes, setStereotype*/);

    return (
        <svg ref={svgRef} className={styles.chart}/>
    );
}

export default IndexScatter;
