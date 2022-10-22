import { createContext } from "react";
const Context = createContext({
  val : {
    currentKiller: null,
    currentStereotypes: null
  },
  setVal : (newVal) => {}
})

export default Context;