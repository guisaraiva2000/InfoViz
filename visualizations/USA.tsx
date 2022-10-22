import * as d3 from "d3";
import {feature, mesh} from "topojson-client";
import {FunctionComponent, useEffect, useRef} from "react";
import styles from '../styles/Home.module.css'

function centroid()
{
  const path = d3.geoPath();
  return feature => path.centroid(feature);
}

function DrawUsaChart(svgRef, killersData, victimsData) {


  return _chart(svgRef, killersData, victimsData);
}

function _chart(svgRef, us, victimsData) {
  const colorScale = d3.scaleLinear()
    .domain([
      d3.min(victimsData, (d:any): number => d.serialKillersVictims),
      d3.max(victimsData, (d:any): number => d.serialKillersVictims)
    ])
    .range([0, 1])

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

  const radius = d3.scaleSqrt([0, 3], [20,40])

  g.append("g")
    .attr("cursor", "pointer")
    .selectAll("path")
      .data(feature(us, us.objects.states).features)
      .join("path")
      .attr("d", d3.geoPath())
      .on("click", clicked)
      .attr("fill", function (d:any) {
        let value = victimsData.filter((row: any) => row.State == d.properties.name)[0]
        if (value)
          return d3.interpolateReds(colorScale(value.serialKillersVictims))
      })
      .attr("stroke", "black")
      .attr("stroke-width", "0.1px")
      .append("title")
      .text((d: any) => d.properties.name)

  svg.call(zoom);

  function reset() {
    g.selectAll("path")
      .attr("fill", function (d:any) {
        let value = victimsData.filter((row: any) => row.State == d.properties.name)[0]
        if (value)
          return d3.interpolateReds(colorScale(value.serialKillersVictims))
      })
      .transition().style("fill", null);

    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
    );
  }

  function clicked(event, d) {
    g.selectAll("path")
      .attr("fill", function (d:any) {
        let value = victimsData.filter((row: any) => row.State == d.properties.name)[0]
        if (value)
          return d3.interpolateReds(colorScale(value.serialKillersVictims))
      })
      .transition().style("fill", null);

    const [[x0, y0], [x1, y1]] = path.bounds(d);
    event.stopPropagation();
    d3.select(this).transition().style("fill", "blue");
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
    DrawUsaChart(svgRef, props.mapData, props.victimsData);
  }, [props.mapData, props.victimsData])

  return (
    <svg ref={svgRef} className={styles.chart}/>
  );
}

export default UsaChart;
