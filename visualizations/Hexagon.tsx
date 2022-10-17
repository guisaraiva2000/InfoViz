import * as d3 from "d3";
import {FunctionComponent, useEffect, useState, useRef} from "react";
import styles from '../styles/Home.module.css'

async function GetRadarChart(svgRef, data)
{
  const attributes = [
      "Number of victims",
      "IQ",
      "Brutality",
      "Childhood Trauma",
      "Psychological Perversion",
      "Killing Severity"
  ];

    let attrMaxValues = []
    attributes.forEach(attribute => {
        attrMaxValues = [...attrMaxValues, d3.max(data, (d:any) => parseFloat(d[attribute]))];
    })

  let parsedData = [];
  data.forEach(d => {
    let pd = [];
    attributes.forEach(attribute => {
      pd = [...pd, {axis: attribute, value: d[attribute] === null ? 0 : d[attribute]}]
    })
    parsedData = [...parsedData, pd];
  })
  console.log(parsedData)

  /*var rows = [];
  var rawData = await d3.csv(
      "test.csv",
      ({problem, shot_count}) => ({axis: problem, value: +shot_count})
  )

  console.log("ola: " + rawData)

  console.log(rows)
  var total = 0;
  var max = 0;

  for (let i = 0; i < rawData.length; ++i) {
    if (rawData[i]["axis"] != "GREAT SHOT") {
      total += rawData[i]["value"];
      if (rawData[i]["value"] > max) {
        max = rawData[i]["value"];
      }
    }
  }

  var maxPercentage = max/total;
  var levels = [];

  for (let i = 0; i < 5; ++i) {
    levels.push(maxPercentage * (i/4));
  }

  console.log(levels);

  for (let i = 0; i < rawData.length; ++i) {
    if ((rawData[i]["axis"] != "GREAT SHOT") && !(rawData[i]["value"]/total < .04)) {
      data.push(rawData[i]);
    }
  }

  data = [data];

  console.log(data);

  const color = d3.scaleOrdinal().range(["#EDC951", "#CC333F", "#00A0B0"]);

  const radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 0.5,
    levels: 5,
    roundStrokes: true,
    color: color
  };*/

  //Call function to draw the Radar chart
  return _GetRadarChart(svgRef, parsedData.slice(4, 7), attrMaxValues);
}


/*function _GetRadarChart(data, options, levels, svgRef) {
  //Taken from http://bl.ocks.org/mbostock/7555321
  //Wraps SVG text
  function wrap(text, width) {
    text.each(function() {
      let text = d3.select(this),
        words = text
          .text()
          .split(/\s+/)
          .reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.4, // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  } //wrap

  const cfg = {
    w: 600, //Width of the circle
    h: 600, //Height of the circle
    margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
    levels: 3, //How many levels or inner circles should there be drawn
    maxValue: 0, //What is the value that the biggest circle will represent
    labelFactor: 1.25, //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.35, //The opacity of the area of the blob
    dotRadius: 4, //The size of the colored circles of each blog
    opacityCircles: 0.1, //The opacity of the circles of each blob
    strokeWidth: 2, //The width of the stroke around each blob
    roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed)
    color: d3.scaleOrdinal(d3.schemeCategory10) //Color function
  };

  //Put all the options into a variable called cfg
  if ("undefined" !== typeof options) {
    for (const i in options) {
      if ("undefined" !== typeof options[i]) {
        cfg[i] = options[i];
      }
    } //for i
  } //if

  //If the supplied maxValue is smaller than the actual one, replace by the max in the data
  const maxValue = Math.max(
    cfg.maxValue,
    Number(d3.max(data, function (i: Array<any>) {
      return d3.max(
          i.map(function (o) {
            return o.value;
          })
      );
    }))
  );

  const allAxis = data[0].map(function(i) {
      return i.axis;
    }), //Names of each axis
    total = allAxis.length, //The number of different axes
    radius = Math.min(cfg.w / 2, cfg.h / 2), //Radius of the outermost circle
    Format = d3.format(".0%"), //Percentage formatting
    angleSlice = (Math.PI * 2) / total; //The width in radians of each "slice"

  //Scale for the radius
  const rScale = d3
    .scaleLinear()
    .range([0, radius])
    .domain([0, maxValue]);

  /////////////////////////////////////////////////////////
  //////////// Create the container SVG and g /////////////
  /////////////////////////////////////////////////////////

  //Initiate the radar chart SVG
  const svg = d3.select(svgRef.current);

  //Calculate width and height
  const height = Number(svg.style("height").replace("px", ""));
  const width = Number(svg.style("width").replace("px", ""));

  console.log(svg.style("height"))

  //Append a g element
  const g = svg
      .append("g")
      .attr(
          "transform",
          `translate(${width / 2}, ${height / 2})`
      );

  /////////////////////////////////////////////////////////
  /////////////// Draw the Circular grid //////////////////
  /////////////////////////////////////////////////////////

  //Wrapper for the grid & axes
  const axisGrid = g.append("g").attr("class", "axisWrapper");

  //Draw the background circles
  axisGrid
    .selectAll(".levels")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", function(d) {
      return (radius / cfg.levels) * d;
    })
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", cfg.opacityCircles)
    .style("filter", "url(#glow)");

  //Text indicating at what % each level is
  axisGrid
    .selectAll(".axisLabel")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", 4)
    .attr("y", function(d) {
      return (-d * radius) / cfg.levels;
    })
    .attr("dy", "0.4em")
    .style("font-size", "10px")
    .attr("fill", "#737373")
    .text(function(d) {
      return Format(levels[d-1]);
    });

  /////////////////////////////////////////////////////////
  //////////////////// Draw the axes //////////////////////
  /////////////////////////////////////////////////////////

  //Create the straight lines radiating outward from the center
  const axis = axisGrid
    .selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");

  //Append the lines
  axis
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", function(d, i) {
      return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("y2", function(d, i) {
      return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-width", "2px");

  //Append the labels at each axis
  axis
    .append("text")
    .attr("class", "legend")
    .style("font-size", "11px")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("x", function(d, i) {
      return (
        rScale(maxValue * cfg.labelFactor) *
        Math.cos(angleSlice * i - Math.PI / 2)
      );
    })
    .attr("y", function(d, i) {
      return (
        rScale(maxValue * cfg.labelFactor) *
        Math.sin(angleSlice * i - Math.PI / 2)
      );
    })
    .text(function(d: string) {
      return d;
    })
    .call(wrap, cfg.wrapWidth);

  /////////////////////////////////////////////////////////
  ///////////// Draw the radar chart blobs ////////////////
  /////////////////////////////////////////////////////////

  //The radial line function
  const radarLine = d3
    .lineRadial()
    .curve(d3.curveLinearClosed)
    .radius((d: any) => rScale(d.value))
    .angle(function(d, i) {
      return i * angleSlice;
    });

  if (cfg.roundStrokes) {
    radarLine.curve(d3.curveLinearClosed);
  }

  //Create a wrapper for the blobs
  const blobWrapper = g
    .selectAll(".radarWrapper")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "radarWrapper");

  //Append the backgrounds
  blobWrapper
    .append("path")
    .attr("class", "radarArea")
    .attr("d", function(d: any) {
      return radarLine(d);
    })
    .style("fill", function(d, i: any) {
      return cfg.color(i);
    })
    .style("fill-opacity", cfg.opacityArea)
    .on("mouseover", function() {
      //Dim all blobs
      d3.selectAll(".radarArea")
        .transition()
        .duration(200)
        .style("fill-opacity", 0.1);
      //Bring back the hovered over blob
      d3.select(this)
        .transition()
        .duration(200)
        .style("fill-opacity", 0.7);
    })
    .on("mouseout", function() {
      //Bring back all blobs
      d3.selectAll(".radarArea")
        .transition()
        .duration(200)
        .style("fill-opacity", cfg.opacityArea);
    });

  //Create the outlines
  blobWrapper
    .append("path")
    .attr("class", "radarStroke")
    .attr("d", function(d: any) {
      return radarLine(d);
    })
    .style("stroke-width", cfg.strokeWidth + "px")
    .style("stroke", function(d, i: any) {
      return cfg.color(i);
    })
    .style("fill", "none")
    .style("filter", "url(#glow)");

  //Append the circles
  blobWrapper
    .selectAll(".radarCircle")
    .data(function(d: unknown[]) {
      return d;
    })
    .enter()
    .append("circle")
    .attr("class", "radarCircle")
    .attr("r", cfg.dotRadius)
    .attr("cx", function(d: any, i) {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("cy", function(d: any, i) {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .style("fill", function() {
      return "#737373";
    })
    .style("fill-opacity", 0.8);

  /////////////////////////////////////////////////////////
  //////// Append invisible circles for tooltip ///////////
  /////////////////////////////////////////////////////////

  //Wrapper for the invisible circles on top
  const blobCircleWrapper = g
    .selectAll(".radarCircleWrapper")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "radarCircleWrapper");

  //Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper
    .selectAll(".radarInvisibleCircle")
    .data(function(d: unknown[]) {
      return d;
    })
    .enter()
    .append("circle")
    .attr("class", "radarInvisibleCircle")
    .attr("r", cfg.dotRadius * 1.5)
    .attr("cx", function(d: any, i) {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("cy", function(d: any, i) {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function(d) {
      const newX = parseFloat(d3.select(this).attr("cx")) - 10;
      const newY = parseFloat(d3.select(this).attr("cy")) - 10;

      tooltip
        .attr("x", newX)
        .attr("y", newY)
        .text(Format(d.value))
        .transition()
        .duration(200)
        .style("opacity", 1);
    })
    .on("mouseout", function() {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0);
    });

  //Set up the small tooltip for when you hover over a circle
  const tooltip = g
    .append("text")
    .attr("class", "tooltip")
    .style("opacity", 0);

  return svg.node();
}*/

function _GetRadarChart(svgRef, data, attrMaxValues)
{
    console.log(data)
  const svg = d3.select(svgRef.current)

    //Calculate width and height
  const height = Number(svg.style("height").replace("px", ""))/ 1.3;
  const width = Number(svg.style("width").replace("px", ""))/1.3;


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

  //If supplied maxValue is smaller than the actual one, replace by the max in the data
  /*const maxValue = Math.max(
      config.maxValue,
      Number(d3.max(data, (i: Array<any>) => d3.max(i.map(o => o.value))))
  )*/

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
      .attr('r', function(d) {
        console.log((radius / config.levels) * d)
        return (radius / config.levels) * d;
      })
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
      .attr('x2', (d,i) => r(maxValue) * Math.cos(angleSlice * i - Math.PI / 2) )
      .attr('y2', (d,i) => r(maxValue) * Math.sin(angleSlice * i - Math.PI / 2) )
      .attr('class', 'line')
      .style('stroke', '#CDCDCD')
      .style('stroke-width', '1px')

  axis.append('text')
      .attr('class', 'legend')
      .attr('font-size', '11px')
      .attr('text-anchor', 'middle')
      .style('fill', "white")
      .attr('dy', '0.35em')
      .attr('x', (d,i) => r(maxValue * config.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2) )
      .attr('y', (d,i) => r(maxValue * config.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2) )
      .text((d: string) => d)

  //// Draw radar chart blobs
  const radarLine = d3.lineRadial()
      .curve(d3.curveLinearClosed)
      .radius(function (d: any, i) {
          console.log(d)
        return r(parseFloat(d.value) / attrMaxValues[i] * 100)
      })
      .angle((d,i) => i * angleSlice)

  // inner glow effect
  const inverseArea = d3.areaRadial()
      .curve(d3.curveLinearClosed)
      .innerRadius((d: any, i) => r(d.value / attrMaxValues[i] * 100))
      .outerRadius(0)
      .angle((d,i) => i * angleSlice)

  const defs = svg.append("defs")

  const filter = defs.append("filter")
      .attr("id", 'blur2')

  filter.append("feGaussianBlur")
      .attr("stdDeviation", 15)
      .attr("result","blur2")

  const feMerge = filter.append("feMerge")
  feMerge.append("feMergeNode").attr("in","blur")
  feMerge.append("feMergeNode").attr("in","SourceGraphic")

  defs
      .selectAll('clipPath')
      .data(data)
      .join('clipPath')
      .attr('id',  (d,i) => 'clipPath-' + i)
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
      .on('mouseover', function() {
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
      .style('stroke', (d,i: any): any => c(i))
      .style('fill', 'none')
      .attr("filter", 'url(#blur2)')
      .attr("clip-path", (d,i) => 'url(#clipPath-'+ i +')')

  //Append dots
  blobWrapper.selectAll('.radarCircle')
      .data((d: any) => d)
      .join('circle')
      .attr('class', 'radarCircle')
      .attr('r', config.dotRadius)
      .attr('cx', (d: any,i) => r(d.value / attrMaxValues[i] * 100) * Math.cos(angleSlice * i - Math.PI / 2) )
      .attr('cy', (d: any,i) => r(d.value / attrMaxValues[i] * 100) * Math.sin(angleSlice * i - Math.PI / 2) )
      .style('fill', (d,i,j: any): any => c(j))
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
      .attr('cx', (d: any, i) => r(d.value / attrMaxValues[i] * 100) * Math.cos(angleSlice * i - Math.PI / 2) )
      .attr('cy', (d: any, i) => r(d.value / attrMaxValues[i] * 100) * Math.sin(angleSlice * i - Math.PI / 2) )
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', function(event, d: any){
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


const RadarChart: FunctionComponent = () => {
  const svg = useRef<SVGSVGElement>(null);

  let [data, setData] = useState([]);
  useEffect(() => {
    d3.json("clean_final.json").then(setData);
  }, []);

  if (svg !== null)
    GetRadarChart(svg, data)

  return (
    <svg ref={svg} className={styles.chart}/>
  );
}

export default RadarChart;
