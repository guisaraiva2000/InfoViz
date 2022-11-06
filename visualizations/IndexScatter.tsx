import * as d3 from "d3";
import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
} from "react";
import {Killers} from "../interfaces/killers";
import {Context, initialState} from "./Context";
import Props from "../interfaces/killers"
import styles from '../styles/Home.module.css'


function DrawIndexScatter(svgRef, data: [Killers], stereotypes, labels) {
  let x_coor = data.map(k => k[labels.x])
  let y_coor = data.map(k => k[labels.y])
  // any null values removes row from plot
  for (let i = 0; i < x_coor.length; i++) {
    if (x_coor[i] == null || y_coor[i] == null) {
      y_coor[i] = null
      x_coor[i] = null
    }
  }
  x_coor = x_coor.filter(x => x !== null)
  y_coor = y_coor.filter(x => x !== null)
  let x_max = Number(d3.max(x_coor))
  let y_max = Number(d3.max(y_coor))

  const svg = d3.select(svgRef.current)

  const everything = svg.selectAll("*");
  everything.remove();

  const height = Number(svg.style("height").replace("px", ""));
  const width = Number(svg.style("width").replace("px", ""));

  const margin = {top: 30, right: 30, bottom: 30, left: 40}
  let x = d3.scaleLinear()
    .domain([0, x_max + 1])
    .range([margin.left * 1.5, width - margin.right])

  let y = d3.scaleLinear()
    .domain([0, y_max + 1])
    .range([height - margin.bottom * 1.5, margin.top])

  // add labels
  svg.append("text")
    .attr("x",  margin.left / 2 + width / 2)
    .attr("y", height - margin.bottom / 3)
    .attr('text-anchor', 'middle')
    .attr("class", "label")
    .style("fill", "white")
    .text(labels.x)

  svg.append("text")
    .attr("y", margin.left / 1.5)
    .attr("x", -(height / 2))
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("class", "label")
    .style("fill", "white")
    .text(labels.y)

  // Add axis
  svg.append("g")
    .attr("transform", "translate(0," + (height - margin.bottom * 1.5) + ")")
    .attr("color", "white")
    .call(d3.axisBottom(x))

  svg.append("g")
    .attr("transform", "translate(" + (margin.left * 1.5) + ", 0)")
    .attr("color", "white")
    .call(d3.axisLeft(y))

  // null values get -100000
  svg.selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d[labels.x]) || -100) // null values get out of the plot
    .attr("cy", (d) => y(d[labels.y]) || -100)
    .attr("r", 4)
    .attr("fill", (d) => stereotypes[d.stereotype].color)
    .attr("data-killerid", (d, i) => i)
    .attr("data-stereotype", (d, ) => d["stereotype"])
    .on("mouseout", function () {
      d3.select(this)
        .style("stroke", "black")
        .style("stroke-width", 0.3)
    })
    .on("mouseover", function () {
      d3.select(this)
        .style("stroke", "white")
        .style("stroke-width", 1)
    })
    .on("click", function () {
      d3.select(this)
        .transition()
        .attr("r", 16)
        .style("stroke", "white")
        .style("stroke-width", 2)
    })
  return svg.node()
}

const IndexScatter: FunctionComponent = (props: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const context = useContext(Context);
  const stereotypes = context.state.stereotypes
  const labels = context.state.labels
  const nextLabel = context.state.nextLabel

  useEffect(() => {
    DrawIndexScatter(svgRef, props.data, stereotypes, labels);
    setTimeout(() => { for(let s of initialState.currentStereotypes) {
      d3.selectAll(`#indexScatter circle[data-stereotype="${s}"]`).attr("class", "selectedS")
    }}, 1000)
    }, [
      svgRef,
      stereotypes,
      labels,
      nextLabel
    ]
  )

  return (<svg ref={svgRef} className={styles.chart} id="indexScatter"/>);
}

export default IndexScatter;
