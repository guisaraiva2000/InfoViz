import * as d3 from "d3";
import {useContext, useEffect} from "react";
import styles from '../styles/Home.module.css'
import {Context} from "./Context"

function DrawStereotypesFilter(data, stereotypes, setStereotype) {
  const stereotypesDiv = d3.select("#stereotypes")

  const everything = stereotypesDiv.selectAll("*");
  everything.remove();

  stereotypesDiv
    .selectAll(styles["labels-container"])
    .data(Object.keys(stereotypes))
    .join("div")
    .attr("class", `w3-container ${styles["labels-container"]}`)
    .style("border", (d) => `1px solid ${stereotypes[d].color}`)
    .style("color", (d) => stereotypes[d].color)
    .html((d: string) => d)
    .on('click', (e, d: any) => {setStereotype(d)})
    .on('mouseover', function (e, d) {
      d3.select(styles["labels-container"])
        .style("border", `1px solid ${stereotypes[d].color}`)
        .style("font-weight", "normal")
      d3.select(this)
        .style("border", `2px solid ${stereotypes[d].color}`)
        .style("font-weight", "bold")
    })
    .on('mouseout', function(e, d) {
      d3.select(this)
        .style("border", `1px solid ${stereotypes[d].color}`)
        .style("font-weight", "normal")

    })
}

const StereotypesFilter = (props) => {
  const context = useContext(Context);
  let stereotypes = context.state.stereotypes
  const setStereotype = context.setStereotype

  useEffect(() => {
    DrawStereotypesFilter(props.data, stereotypes, setStereotype);
  },  [props.data, stereotypes, context])
}

export default StereotypesFilter;