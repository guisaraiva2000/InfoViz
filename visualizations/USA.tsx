import * as d3 from "d3";
import {legendColor, legendHelpers} from "d3-svg-legend";
import {feature} from "topojson-client";
import {FunctionComponent, useEffect, useRef} from "react";
import styles from '../styles/Home.module.css'
import {initialState} from "./Context";
import {Killers} from "../interfaces/killers";


function getColorScale(victimsData, perCapita) {
  const domain = perCapita ?
    [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0]
    :
    [100, 200, 300, 400, 500, 600, 700, 800, 900]
  return d3.scaleThreshold()
      .domain(domain)
      .range(["#f9e5e5", "#f4cccc", "#efb2b2", "#ea9999", "#e57f7f", "#e06666", "#db4c4c", "#d63232", "#d11919", "#cc0000"])
}

function getColor(victimsData, d, perCapita) {
  let value = victimsData.filter((row: any) => row.State == d.properties.name)[0]
  const attr = perCapita ? "serialKillersVictimsPerCapita" : "serialKillersVictims"
  if (value)
      return getColorScale(victimsData, perCapita)(Number(value[attr]))
}

function drawLegend(victimsData, perCapita: boolean, svg) {
  const prevLabel = svg.selectAll(".mapLabel");
  prevLabel.remove();

  const legend = legendColor()
    .labelFormat(d3.format(".0f"))
    .labels(legendHelpers.thresholdLabels)
    .scale(getColorScale(victimsData, perCapita))

  svg.append("g")
    .attr("class", "mapLabel")
    .attr("transform", "translate(5,50)")
    .attr('font-size', '12px')
    .style("text-shadow", "2px 2px 4px black, 0 0 2em black, 0 0 0.4em black")
    .style("fill", "white")
    .call(legend);
}

function DrawUsaChart(svgRef, usMap, killersData: [Killers], victimsData) {
  let perCapita = false;

  const svg = d3.select(svgRef.current)
    .on("click", reset);

  const everything = svg.selectAll("*");
  everything.remove();

  //Calculate width and height
  const height = Number(svg.style("height").replace("px", ""));
  const width = Number(svg.style("width").replace("px", ""));

  const path = d3.geoPath();

  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

  drawLegend(victimsData, perCapita, svg);

  const toggle = svg.append("g");

  toggle.append("rect")
    .attr('class', 'toggle-rect')
    .style("x", "84%")
    .style("y", "90%")
    .style("rx", "10")
    .style("ry", "10")
    .style("height", "7%")
    .style("width", "15%")
    .style("stroke", "white")
    .style("strokeWidth", "0.5")

  toggle.append("text")
    .attr('class', 'toggle-text')
    .attr("x", "91.5%")
    .attr("y", "93.5%")
    .attr('font-size', '13px')
    .attr('text-anchor', 'middle')
    .attr("dominant-baseline", "middle")
    .style('fill', "white")
    .text("per capita")

  toggle
    .on('mouseover', function () {
      d3.selectAll('.toggle-rect')
        .style("stroke", "red")
        .style("strokeWidth", "1")
      d3.selectAll(".toggle-text")
        .style("font-weight", "bold")
        .style('fill', "red")
    })
    .on('mouseout', () => {
      if (perCapita) return;
      d3.selectAll('.toggle-rect')
        .style("stroke", "white")
        .style("strokeWidth", "0.5")
      d3.selectAll(".toggle-text")
        .style("font-weight", "normal")
        .style('fill', "white")
    })
    .on('click', function () {
      d3.selectAll('.toggle-rect')
        .style("stroke", "red")
        .style("strokeWidth", "1")
      d3.selectAll(".toggle-text")
        .style("font-weight", "bold")
        .style('fill', "red")

      perCapita = !perCapita

      g.selectAll("path")
        .attr("fill", d => getColor(victimsData, d, perCapita))

      drawLegend(victimsData, perCapita, svg);
    })

  const g = svg.append("g");

  g.append("g")
    .attr("cursor", "pointer")
    .selectAll("path")
      .data(feature(usMap, usMap.objects.states).features)
      .join("path")
      .attr("d", d3.geoPath())
      .on("click", clicked)
      .attr("fill", d => getColor(victimsData, d, perCapita))
      .attr("stroke", "black")
      .attr("stroke-width", "0.1px")
      .append("title")
      .text((d: any) => d.properties.name)

  g.append("g")
    .attr("class", "bubble")
    .selectAll("circle")
    .data(killersData)
    .enter()
    .append("circle")
    .attr("data-killerid", (d, i) => i)
      .attr("data-stereotype", (d, i) => d["stereotype"])
      .attr("cx", d => getPosition(d)[0])
      .attr("cy", d=> getPosition(d)[1])
    .attr("r", 3)
    .style("fill", (d) => initialState.stereotypes[d.stereotype].color)

  svg.call(zoom);

  function getPosition(d) {
    const loc = d.Location.split(",");
    const state = loc.slice(-1)[0].trim()
    let county = loc.length > 1 ? loc.slice(-2)[0].trim() : ""

    if (county) {
      let countyEl = feature(usMap, usMap.objects.counties).features.find(c => (c.properties.name === county))
      return countyEl && path.centroid(countyEl);
    } else {
      let stateEl = feature(usMap, usMap.objects.states).features.find(s => (s.properties.name === state))
      return stateEl && path.centroid(stateEl);
    }
  }

  function reset() {
    g.selectAll("path")
      .attr("fill", d => getColor(victimsData, d, perCapita))

    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
    );
  }

  function clicked(event, d) {
    g.selectAll("path")
      .attr("fill", d => getColor(victimsData, d, perCapita))

    const [[x0, y0], [x1, y1]] = path.bounds(d);
    event.stopPropagation();
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
      d3.pointer(event, svg.node())
    );
  }

  function zoomed(event) {
    const {transform} = event;
    g.attr("transform", transform);
    g.attr("stroke-width", 1 / transform.k);
  }

  return svg.node();
}

const UsaChart: FunctionComponent = (props: any) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    DrawUsaChart(
      svgRef,
      props.mapData,
      props.killersData,
      props.victimsData,
    );
    setTimeout(        () => { for(let s of initialState.currentStereotypes) {
          d3.selectAll(`#usaChart circle[data-stereotype="${s}"]`).attr("class", "selectedS")
        }}, 1000)
  }, [
    props.mapData,
    props.killersData,
    props.victimsData,
    props.currentStereotypes,
    props.stereotypes]
  )

  return (
    <svg ref={svgRef} className={styles.chart} id="usaChart"/>
  );
}

export default UsaChart;
