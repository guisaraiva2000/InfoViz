import * as d3 from "d3";
import {legendColor, legendHelpers} from "d3-svg-legend";
import {feature} from "topojson-client";
import {FunctionComponent, useEffect, useRef} from "react";
import styles from '../styles/Home.module.css'
import {contextValue, initialState} from "./Context";
import {Killers} from "../interfaces/killers";

function distance(point1, point2) {
  return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2))
}

function getColorScale(perCapita) {
  const domain = perCapita ?
    [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0]
    :
    [100, 200, 300, 400, 500, 600, 700, 800, 900]
  return d3.scaleThreshold()
      .domain(domain)
      .range(["#f9e5e5", "#f4cccc", "#efb2b2", "#ea9999", "#e57f7f", "#e06666", "#db4c4c", "#d63232", "#d11919", "#cc0000"])
}

function getColor(victimsData, d, perCapita) {
  let value = victimsData.get(d.properties.name)
  const attr = perCapita ? "serialKillersVictimsPerCapita" : "serialKillersVictims"
  if (value)
      return getColorScale(perCapita)(Number(value[attr]))
}

function drawLegend(perCapita: boolean, svg) {
  const prevLabel = svg.selectAll(".mapLabel");
  prevLabel.remove();

  const legend = legendColor()
    .labelFormat(d3.format(".0f"))
    .labels(legendHelpers.thresholdLabels)
    .title(perCapita ? "Nr. of victims per capita" :"Nr. of victims")
    .titleWidth(70)
    .scale(getColorScale( perCapita))

  svg.append("g")
    .attr("class", "mapLabel")
    .attr("transform", "translate(5,50)")
    .attr('font-size', '12px')
    .style("text-shadow", "2px 2px 4px black, 0 0 2em black, 0 0 0.4em black")
    .style("fill", "white")
    .call(legend);
}

function drawStateStats(svg, width, height, perCapita, data) {
  const prevRect = svg.select(".statsRect");
  const prevText = svg.selectAll(".statsText");
  prevRect.remove(); prevText.remove();

  const stats = svg.append("g");

  const text = [
    "State: " + data.state,
    "Killers: " + data.totalKillers,
    perCapita ?
      "Victims per capita: " + parseFloat(data.totalVictims.serialKillersVictimsPerCapita).toFixed(1)
      :
      "Victims: " + data.totalVictims.serialKillersVictims
  ]

  stats.append("rect")
    .attr('class', 'statsRect')
    .style("x", width - 150)
    .style("y", height / 2 - height / 5)
    .style("rx", 15)
    .style("ry", 15)
    .style("height", 80)
    .style("width", 135)
    .style("stroke", "white")
    .style("strokeWidth", "0.5")
    .style("fill-opacity", "0.3")

  let textHeight = height / 2 - height / 5 + 40 - 25
  text.forEach(t => {
    stats.append("text")
      .attr('class', 'statsText')
      .attr("x", width - 150 + 67.5)
      .attr("y", textHeight)
      .attr('font-size', '13px')
      .attr('text-anchor', 'middle')
      .attr("dominant-baseline", "middle")
      .style('fill', "white")
      .style("text-shadow", "2px 2px 4px black, 0 0 2em black, 0 0 0.4em black")
      .text(t)

    textHeight += 25
  })

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

  const g = svg.append("g");

  drawLegend(perCapita, svg);

  const toggle = svg.append("g");

  toggle.append("rect")
    .attr('class', 'toggle-rect')
    .style("x", width - 95)
    .style("y", height - 30)
    .style("rx", 15)
    .style("ry", 15)
    .style("height", 25)
    .style("width", 80)
    .style("stroke", "white")
    .style("strokeWidth", "0.5")
    .style("fill-opacity", "0.3")

  toggle.append("text")
    .attr('class', 'toggle-text')
    .attr("x", width - 95 + 40)
    .attr("y", height - 30 + 12.5)
    .attr('font-size', '13px')
    .attr('text-anchor', 'middle')
    .attr("dominant-baseline", "middle")
    .style('fill', "white")
    .text("per capita")
    .style("text-shadow", "2px 2px 4px black, 0 0 2em black, 0 0 0.4em black")

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

      drawLegend(perCapita, svg);
    })

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
    .on("click", (evt,d) => {
      evt.preventDefault()
      //evt.stopPropagation()
      contextValue.setKiller(killersData.indexOf(d))
    })

  svg.call(zoom);

  function getPosition(d) {
    const loc = d.Location.split(",");
    const state = loc.slice(-1)[0].trim()
    let county = loc.length > 1 ? loc.slice(-2)[0].trim() : ""

    let stateEl = feature(usMap, usMap.objects.states).features.find(s => (s.properties.name === state))

    if (county) {
      let countyEl = feature(usMap, usMap.objects.counties).features.flatMap(c => {
        return c.properties.name === county ? [path.centroid(c)] : []
      })
      let closest;
      if (stateEl) {
        const statePoint = path.centroid(stateEl)
        closest = countyEl.reduce((a, b) => distance(a, statePoint) < distance(b, statePoint) ? a : b);
        return closest
      }
      return countyEl && path.centroid(countyEl);
    }

    return stateEl && path.centroid(stateEl);
  }

  function countKillersInState(state) {
    let count = 0
    killersData.forEach(killer => {
      const loc = killer.Location.split(",");
      const killerState = loc.slice(-1)[0].trim()
      if (killerState === state) count++
    })
    return count
  }

  function reset() {
    g.selectAll("path")
      .attr("stroke-width", "0.1px");

    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
    );
    const prevRect = svg.select(".statsRect");
    const prevText = svg.selectAll(".statsText");
    prevRect.remove(); prevText.remove();
  }

  function clicked(event, d) {
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    event.stopPropagation();
    const state = d3.select(this).data()[0].properties.name
    drawStateStats(
      svg,
      width,
      height,
      perCapita,
      {state: state, totalKillers: countKillersInState(state), totalVictims: victimsData.get(state)}
    )
    g.selectAll("path")
      .attr("stroke-width", "0.1px");
    d3.select(this)
      .transition()
      .attr("stroke-width", "2px");
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
    setTimeout(() => { for(let s of initialState.currentStereotypes) {
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
