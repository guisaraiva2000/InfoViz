import * as d3 from "d3";
import {FunctionComponent, useEffect, useRef} from "react";
import styles from '../styles/Home.module.css'
import Props from "../interfaces/killers";
import {Killers} from "../interfaces/killers";

function DrawRadarChart(svgRef, data: [Killers]) {
  let stereotypes = new Set([1, 2, 3])

  const attributes = {
    "Number of victims": "avg_number_of_victims",
    "IQ": "avg_iq",
    "Brutality": "avg_brutality",
    "Childhood Trauma": "avg_childhood_trauma",
    "Psychological Perversion": "avg_psychological_perversion",
    "Killing Severity": "avg_killing_severity",
  };

  const countsAndSums = new Map();
  data.forEach(d => {
    const stereotype = d.stereotype
    if (!(stereotypes.has(stereotype)))
      return
    const entry = countsAndSums.get(stereotype);
    if (!entry) {
      countsAndSums.set(stereotype, {
        stereotype,
        count: 1,
        number_of_victims: d["Number of victims"] || 0,
        iq: d.IQ || 0,
        brutality: d.Brutality || 0,
        childhood_trauma: d["Childhood Trauma"] || 0,
        psychological_perversion: d["Psychological Perversion"] || 0,
        killing_severity: d["Killing Severity"] || 0
      }
      );
    } else {
      ++entry.count;
      entry.number_of_victims += d["Number of victims"] || 0;
      entry.iq += d.IQ || 0;
      entry.brutality += d.Brutality || 0;
      entry.childhood_trauma += d["Childhood Trauma"] || 0;
      entry.psychological_perversion += d["Psychological Perversion"] || 0;
      entry.killing_severity += d["Killing Severity"] || 0;
    }
  })

  // @ts-ignore
  const averages = [...countsAndSums.values()].map(
    ({
       stereotype,
       count,
       number_of_victims,
       iq,
       brutality,
       childhood_trauma,
       psychological_perversion,
       killing_severity
    }) => ({
      stereotype: stereotype,
      avg_index: {
        avg_number_of_victims: (number_of_victims / count).toFixed(1),
        avg_iq: (iq / count).toFixed(1),
        avg_brutality: (brutality / count).toFixed(1),
        avg_childhood_trauma: (childhood_trauma / count).toFixed(1),
        avg_psychological_perversion: (psychological_perversion / count).toFixed(1),
        avg_killing_severity: (killing_severity / count).toFixed(1)
      }
    }));

  let attrMaxValues = []
  Object.values(attributes).forEach(attribute => {
    attrMaxValues = [...attrMaxValues, d3.max(averages, d => parseFloat(d.avg_index[attribute]))];
  })

  let parsedData = [];
  averages.forEach(d => {
    let pd = [];
    Object.keys(attributes).forEach(attribute => {
      pd = [...pd, {
        axis: attribute,
        value: d.avg_index[attributes[attribute]],
        stereotype: d.stereotype
      }]
    })
    parsedData = [...parsedData, pd];
  })

  //Call function to draw the Radar chart
  return _DrawRadarChart(svgRef, parsedData, attrMaxValues);
}

function _DrawRadarChart(svgRef, data, attrMaxValues) {
  const svg = d3.select(svgRef.current)

  const everything = svg.selectAll("*");
  everything.remove();

  //Calculate width and height
  const height = Number(svg.style("height").replace("px", "")) / 1.3;
  const width = Number(svg.style("width").replace("px", "")) / 1.3;

  const config = {
    maxValue: 0.5, //What is the value that the biggest circle will represent
    levels: 5, //How many levels or inner circles should there be drawn
    roundStrokes: true, //If true the area and stroke will follow a round path (cardinal-closed
    strokeWidth: 8, //The width of the stroke around each blob
    opacityCircles: 0.1, //The opacity of the circles of each blob
    labelFactor: 1.2, //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.0, //The opacity of the area of the blob
    dotRadius: 4 //The size of the colored circles of each blog
  }

  const c = d3.scaleOrdinal()
    .range(['#EDC951', '#CC333F', '#00A0B0'])

  const maxValue = 100;
  const allAxis = data[0].map((i) => i.axis), //Names of each axis
    total = allAxis.length, // number of different axis
    radius = Math.min(width / 2, height / 2), // radius of the outermost circle
    angleSlice = (Math.PI * 2) / total // width in radians of each slice
  const r = d3.scaleLinear()
    .domain([0, 100])
    .range([0, radius])

  const g = svg.append('g')
    .attr('transform', `translate(${width / 2 * 1.3}, ${height / 2 * 1.3})`)

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
    .attr("white-space", "pre-line")
    .attr('dy', '0.35em')
    .attr('x', (d, i) => r(maxValue * config.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr('y', (d, i) => r(maxValue * config.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
    .text((d: string) => d)

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
    .attr('fill', (d, i: any): any => c(i))
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

  //Create outlines
  blobWrapper.append('path')
    .attr('class', 'radarStroke')
    .attr('d', (d: any) => radarLine(d))
    .style('stroke-width', config.strokeWidth + 'px')
    .style('stroke', (d, i: any): any => c(i))
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
    .style('fill', (d, i, j: any): any => c(j))
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

  useEffect(() => {
    DrawRadarChart(svgRef, props.data);
  }, [svgRef.current, props.data])

  return (
    <svg ref={svgRef} className={styles.chart}/>
  );
}

export default RadarChart;
