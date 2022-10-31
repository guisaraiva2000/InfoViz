import * as d3 from "d3";
import {useContext, useEffect} from "react";
import styles from '../styles/Home.module.css'
import {Context} from "./Context"

function DrawStereotypesFilter(stereotypes, setStereotype, currentStereotypes) {
  const stereotypesDiv = d3.select("#stereotypes")

  const everything = stereotypesDiv.selectAll("*");
  everything.remove();

  stereotypesDiv
    .selectAll(styles["labels-container"])
    .data(Object.keys(stereotypes))
    .join("div")
    .attr("class", `w3-container ${styles["labels-container"]}`)
    .style("outline", (d) => `1px solid ${stereotypes[d].color}`)
    /*.style("background", d => `${currentStereotypes.includes(Number(d)) ?  stereotypes[d].color : ' '}` )*/
    .style("-webkit-box-shadow", d => `${currentStereotypes.includes(Number(d)) ?  "inset 0 0 30px " + stereotypes[d].color : ' '}` )
    .style("-moz-box-shadow", d => `${currentStereotypes.includes(Number(d)) ? "inset 0 0 30px " + stereotypes[d].color : ' '}` )
    .style("box-shadow", d => `${currentStereotypes.includes(Number(d)) ?  "inset 0 0 30px " + stereotypes[d].color : ' '}` )
    .style("color", (d) => "white") //stereotypes[d].color)
    .html((d: string) => String.fromCharCode(Number(d) + 1 + 64))
    .on('click', (e, d: any) => {
      let remove = currentStereotypes.includes(Number(d))
      setStereotype(d, remove)
    })
    .on('mouseover', function (e, d) {
      d3.select(styles["labels-container"])
        .style("outline", `1px solid ${stereotypes[d].color}`)
        .style("font-weight", "normal")
      d3.select(this)
        .style("outline", `2px solid ${stereotypes[d].color}`)
        .style("font-weight", "bold")
    })
    .on('mouseout', function(e, d) {
      d3.select(this)
        .style("outline", `1px solid ${stereotypes[d].color}`)
        .style("font-weight", "normal")

    })
}

const StereotypesFilter = () => {
  const context = useContext(Context);
  let stereotypes = context.state.stereotypes
  let currentStereotypes = context.state.currentStereotypes
  const setStereotype = context.setStereotype

  useEffect(() => {
    DrawStereotypesFilter(stereotypes, setStereotype, currentStereotypes);
  },  [stereotypes, context])
}

export default StereotypesFilter;
