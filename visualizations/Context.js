import {createContext, useEffect, useState} from "react";
import * as d3 from "d3";

export const Context = createContext()

export const initialState = {
  currentKiller: null,
  currentStereotypes: [0, 1, 4],
  labels: {x: "Childhood Trauma", y: "Brutality"},
  nextLabel: "x",
  stereotypes: {
    0: {color: "#CC333F"},
    1: {color: "#CC6E33"},
    2: {color: "#EDC951"},
    3: {color: "#6ECC33"},
    4: {color: "#00A0B0"},
    5: {color: "#334CCC"},
    6: {color: "#AB33CC"},
    7: {color: "#ff00ff"},
  }
};

export let contextValue = null;

export function ContextProvider(props) {
  let [state, setState] = useState(initialState)

  const _setStereotype = (s, remove) => {
    s = Number(s)
    let currentStereotypes = state.currentStereotypes

    for(let s of currentStereotypes){
      d3.selectAll(`#usaChart circle[data-stereotype="${s}"]`).attr("class", "") // remove class
      d3.selectAll(`#indexScatter circle[data-stereotype="${s}"]`).attr("class", "") // remove class
    }

    if (remove === true) { // remove
      let i = currentStereotypes.indexOf(s)
      if (i !== -1) currentStereotypes.splice(i, 1)
    } else if (currentStereotypes.length < 3) { // just add this sterotype
      currentStereotypes.splice(0, 0, s)
    } else { // swap the oldest one with the incoming
      currentStereotypes.includes(s) ?
        currentStereotypes = [s, ...currentStereotypes.filter(item => item !== s)] // move to front
        :
        currentStereotypes = [s, ...currentStereotypes].slice(0, -1);
    }
    setState({...state, currentStereotypes: currentStereotypes})
    for(let s of currentStereotypes){
      d3.selectAll(`#usaChart circle[data-stereotype="${s}"]`).attr("class", "selectedS")
      d3.selectAll(`#indexScatter circle[data-stereotype="${s}"]`).attr("class", "selectedS")
    }
  }

  const _setKiller = (k) => {
    d3.select("#usaChart circle.selectedKiller").attr("className", "")
    d3.select("#indexScatter circle.selectedKiller").attr("className", "")

    let targetKiller = state.currentKiller // old
    document.querySelector(`#usaChart circle[data-killerid="${targetKiller}"]`)?.classList.remove("selectedKiller")
    document.querySelector(`#indexScatter circle[data-killerid="${targetKiller}"]`)?.classList.remove("selectedKiller")
    targetKiller = k // new
    let newCircle = document.querySelector(`#usaChart circle[data-killerid="${targetKiller}"]`)
    if(newCircle) newCircle.classList.add("selectedKiller")

    newCircle = document.querySelector(`#indexScatter circle[data-killerid="${targetKiller}"]`)
    if(newCircle) newCircle.classList.add("selectedKiller")
    setState({...state, currentKiller: k})
  }

  const _setLabel = (label) => {
    let newLabels = state.labels
    let nextLabel = state.nextLabel
    if (newLabels.x === label) {
      newLabels.x = null;
      nextLabel = "x"
    } else if (newLabels.y === label) {
      newLabels.y = null;
      nextLabel = "y"
    } else if (newLabels[nextLabel] == null) {
      newLabels[nextLabel] = label
      nextLabel = nextLabel === "x" ? "y" : "x"
    } else {
      return;
    }
    setState({...state, labels: newLabels, nextLabel: nextLabel})
  }

  contextValue = {setKiller: _setKiller, setStereotype: _setStereotype, setLabel: _setLabel, state: state}
  return <Context.Provider value={contextValue}>
    {props.children}
  </Context.Provider>;
}
