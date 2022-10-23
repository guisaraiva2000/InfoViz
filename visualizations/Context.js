import {createContext, useState} from "react";

export const Context = createContext()

const initialState = {
  currentKiller: null,
  currentStereotypes: [0, 1, 2],
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

export function ContextProvider(props) {
  let [state, setState] = useState(initialState)

  const _setStereotype = (s, remove) => {
    console.log(s)
    s = Number(s)
    let currentStereotypes = state.currentStereotypes
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
  }

  const _setKiller = (k) => {
    setState({...state, currentKiller: k})
  }

  return <Context.Provider value={{setKiller: _setKiller, setStereotype: _setStereotype, state: state}}>
    {props.children}
  </Context.Provider>;
}
