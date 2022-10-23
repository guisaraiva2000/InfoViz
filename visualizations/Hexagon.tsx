import * as d3 from "d3";
import {FunctionComponent, useContext, useEffect, useRef} from "react";
import styles from '../styles/Home.module.css'
import Props from "../interfaces/killers";
import {Killers} from "../interfaces/killers";
import {Context} from "./Context";


const config = {
  maxValue: 0.5, //What is the value that the biggest circle will represent
  levels: 5, //How many levels or inner circles should there be drawn
  roundStrokes: true, //If true the area and stroke will follow a round path (cardinal-closed
  strokeWidth: 8, //The width of the stroke around each blob
  opacityCircles: 0.1, //The opacity of the circles of each blob
  labelFactor: 1.2, //How much farther than the radius of the outer circle should the labels be placed
  wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
  opacityArea: 0.0, //The opacity of the area of the blob
  dotRadius: 4, //The size of the colored circles of each blog
  scale: 1.5
}

const attributes = {
  "Number of victims": {avg_name: "avg_number_of_victims", scaleFactor: 1.3},
  "IQ": {avg_name: "avg_iq", scaleFactor: 1.2},
  "Brutality": {avg_name: "avg_brutality", scaleFactor: 1.3},
  "Childhood Trauma": {avg_name: "avg_childhood_trauma", scaleFactor: 1.2},
  "Psychological Perversion": {avg_name: "avg_psychological_perversion", scaleFactor: 1.4},
  "Killing Severity": {avg_name: "avg_killing_severity", scaleFactor: 1.4}
};

function getAverage(arr: Array<number>) {
  arr = arr.filter(x => x !== null)
  return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
}

function DrawRadarChart(svgRef, data: [Killers], currentStereotypes, stereotypes, setStereotype) {
  const countsAndSums = new Map();
  data.forEach(d => {
    const stereotype = d.stereotype
    if (!(currentStereotypes.includes(stereotype)))
      return
    const entry = countsAndSums.get(stereotype);
    if (!entry) {
      countsAndSums.set(stereotype, {
        stereotype,
        number_of_victims: [d["Number of victims"]],
        iq: [d.IQ],
        brutality: [d.Brutality],
        childhood_trauma: [d["Childhood Trauma"]],
        psychological_perversion: [d["Psychological Perversion"]],
        killing_severity: [d["Killing Severity"]]
      }
      );
    } else {
      entry.number_of_victims = [...entry.number_of_victims, d["Number of victims"]];
      entry.iq = [...entry.iq, d.IQ];
      entry.brutality = [...entry.brutality, d.Brutality];
      entry.childhood_trauma = [...entry.childhood_trauma, d["Childhood Trauma"]];
      entry.psychological_perversion = [...entry.psychological_perversion, d["Psychological Perversion"]];
      entry.killing_severity = [...entry.killing_severity, d["Killing Severity"]];
    }
  })

  // @ts-ignore
  const averages = [...countsAndSums.values()].map((d) => ({
      stereotype: d.stereotype,
      avg_index: {
        avg_number_of_victims: getAverage(d.number_of_victims),
        avg_iq: getAverage(d.iq),
        avg_brutality: getAverage(d.brutality),
        avg_childhood_trauma: getAverage(d.childhood_trauma),
        avg_psychological_perversion: getAverage(d.psychological_perversion),
        avg_killing_severity: getAverage(d.killing_severity)
      }
    }));

  let attrMaxValues = []
  Object.values(attributes).forEach(attribute => {
    attrMaxValues = [...attrMaxValues, d3.max(averages, d => parseFloat(d.avg_index[attribute.avg_name]))];
  })

  let parsedData = [];
  averages.forEach(d => {
    let pd = [];
    Object.keys(attributes).forEach(attribute => {
      pd = [...pd, {
        axis: attribute,
        value: d.avg_index[attributes[attribute].avg_name],
        stereotype: d.stereotype,
        scaleFactor: attributes[attribute].scaleFactor
      }]
    })
    parsedData = [...parsedData, pd];
  })

  //Call function to draw the Radar chart
  return _DrawRadarChart(svgRef, parsedData, attrMaxValues, stereotypes, setStereotype);
}

function _DrawRadarChart(svgRef, data, attrMaxValues, stereotypes, setStereotype) {
  const svg = d3.select(svgRef.current)

  const everything = svg.selectAll("*");
  everything.remove();

  //Calculate width and height
  const height = Number(svg.style("height").replace("px", "")) / config.scale;
  const width = Number(svg.style("width").replace("px", "")) / config.scale;

  const maxValue = 100;
  const allAxis = data[0].map((i) => i), //Names of each axis
    total = allAxis.length, // number of different axis
    radius = Math.min(width / 2, height / 2), // radius of the outermost circle
    angleSlice = (Math.PI * 2) / total // width in radians of each slice
  const r = d3.scaleLinear()
    .domain([0, 100])
    .range([0, radius])

  const g = svg.append('g')
    .attr('transform', `translate(${width / 2 * config.scale}, ${height / 2 * config.scale})`)

  const axisGrid = g.append("g").attr("class", "axisWrapper");

  //Draw background circles
  axisGrid.selectAll('.levels')
    .data(d3.range(1, config.levels + 1).reverse())
    .join('circle')
    .attr('class', 'gridCircle')
    .attr('r', (d) => (radius / config.levels) * d)
    .style('fill', 'none')
    .style('stroke', '#CDCDCD')
    .style('fill-opacity', config.opacityCircles)

  //// Draw axes
  const axis = axisGrid.selectAll('.axis')
    .data(allAxis)
    .join('g')
    .attr('class', 'axis')

  axis.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', (d, i) => r(maxValue) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr('y2', (d, i) => r(maxValue) * Math.sin(angleSlice * i - Math.PI / 2))
    .attr('class', 'line')
    .style('stroke', '#CDCDCD')
    .style('stroke-width', '1px')

  axis.append('text')
    .attr('class', 'legend')
    .attr('font-size', '11px')
    .attr('text-anchor', 'middle')
    .style('fill', "white")
    .attr('dy', '0.35em')
    .attr('x', (d:any, i) => r(maxValue * d.scaleFactor) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr('y', (d:any, i) => r(maxValue * d.scaleFactor) * Math.sin(angleSlice * i - Math.PI / 2))
    .text(function(d: any) {
      const tokens = d.axis.split(" ")
      return tokens.length === 1 ? tokens.toString() : tokens.slice(0, -1).toString().replace(",", " ")
    })
    .append('tspan')
    .attr('dy', '0.35em')
    .attr('x', (d:any, i) => r(maxValue * d.scaleFactor) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr('y', (d:any, i) => r(maxValue * d.scaleFactor) * Math.sin(angleSlice * i - Math.PI / 2) + 15)
    .text(function (d:any) {
      const tokens = d.axis.split(" ")
      return tokens.length === 1 ? "" : tokens.slice(-1).toString();
    })

  //// Draw radar chart blobs
  const radarLine = d3.lineRadial()
    .curve(d3.curveLinearClosed)
    .radius((d: any, i) => r(parseFloat(d.value) / attrMaxValues[i] * 100))
    .angle((d, i) => i * angleSlice)

  // inner glow effect
  const inverseArea = d3.areaRadial()
    .curve(d3.curveLinearClosed)
    .innerRadius((d: any, i) => r(d.value / attrMaxValues[i] * 100))
    .outerRadius(0)
    .angle((d, i) => i * angleSlice)

  const defs = svg.append("defs")

  const filter = defs.append("filter")
    .attr("id", 'blur2')

  filter.append("feGaussianBlur")
    .attr("stdDeviation", 15)
    .attr("result", "blur2")

  const feMerge = filter.append("feMerge")
  feMerge.append("feMergeNode").attr("in", "blur")
  feMerge.append("feMergeNode").attr("in", "SourceGraphic")

  defs
    .selectAll('clipPath')
    .data(data)
    .join('clipPath')
    .attr('id', (d, i) => 'clipPath-' + i)
    .append("path")
    .attr("d", (d: any) => inverseArea(d))
  // ---

  const blobWrapper = g.selectAll('.radarWrapper2')
    .data(data)
    .join('g')
    .attr('class', 'radarWrapper2')

  //Append backgrounds
  blobWrapper.append('path')
    .attr('class', 'radarArea2')
    .attr('d', (d: any) => radarLine(d))
    .attr('fill', (d: any) => stereotypes[d[0].stereotype].color)
    .style('fill-opacity', config.opacityArea)
    .on('mouseover', function () {
      //Dim all blobs
      d3.selectAll('.radarArea2')
        .transition()
        .duration(200)
        .style('fill-opacity', Math.min(0.1, config.opacityArea))
      //Bring back the hovered over blob
      d3.select(this)
        .transition()
        .duration(200)
        .style('fill-opacity', Math.max(0.7, config.opacityArea))
    })
    .on('mouseout', () => {
      //Bring back all blobs
      d3.selectAll('.radarArea2')
        .transition()
        .duration(200)
        .style('fill-opacity', config.opacityArea)
    })
    .on('click', (e, d: any) => {setStereotype(d[0].stereotype)})

  //Create outlines
  blobWrapper.append('path')
    .attr('class', 'radarStroke')
    .attr('d', (d: any) => radarLine(d))
    .style('stroke-width', config.strokeWidth + 'px')
    .style('stroke', (d: any) => stereotypes[d[0].stereotype].color)
    .style('fill', 'none')
    .attr("filter", 'url(#blur2)')
    .attr("clip-path", (d, i) => 'url(#clipPath-' + i + ')')

  //Append dots
  blobWrapper.selectAll('.radarCircle')
    .data((d: any) => d)
    .join('circle')
    .attr('class', 'radarCircle')
    .attr('r', config.dotRadius)
    .attr('cx', (d: any, i) => r(d.value / attrMaxValues[i] * 100) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr('cy', (d: any, i) => r(d.value / attrMaxValues[i] * 100) * Math.sin(angleSlice * i - Math.PI / 2))
    .style('fill', (d: any) => stereotypes[d.stereotype].color)
    .style('fill-opacity', 0.8)

  //// Append invisible circles for tooltip
  const blobCircleWrapper = g.selectAll('.radarCircleWrapper')
    .data(data)
    .join('g')
    .attr('class', 'radarCircleWrapper')

  //Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper.selectAll('.radarInvisibleCircle')
    .data((d: any) => d)
    .join('circle')
    .attr('class', 'radarInvisibleCircle')
    .attr('r', config.dotRadius * 1.5)
    .attr('cx', (d: any, i) => r(d.value / attrMaxValues[i] * 100) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr('cy', (d: any, i) => r(d.value / attrMaxValues[i] * 100) * Math.sin(angleSlice * i - Math.PI / 2))
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .on('mouseover', function (event, d: any) {
      const newX = parseFloat(d3.select(this).attr('cx')) - 10
      const newY = parseFloat(d3.select(this).attr('cy')) - 10

      tooltip
        .attr('x', newX)
        .attr('y', newY)
        .text(d.value)
        .transition()
        .duration(200)
        .style('opacity', 1)
    })
    .on('mouseout', () => {
      tooltip
        .transition()
        .duration(200)
        .style('opacity', 0)
    })

  const tooltip = g.append('text')
    .attr('class', 'tooltip')
    .style('opacity', 0)
    .attr("fill", "white")

  return svg.node()
}


const RadarChart: FunctionComponent = (props: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const context = useContext(Context);
  const stereotypes = context.state.stereotypes
  let currentStereotypes = context.state.currentStereotypes
  const setStereotype = context.setStereotype

  if(svgRef.current != null) DrawRadarChart(svgRef, props.data, currentStereotypes, stereotypes, setStereotype);
  return (
    <svg ref={svgRef} className={styles.chart}/>
  );
}

export default RadarChart;
