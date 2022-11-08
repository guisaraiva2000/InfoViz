import {useEffect, useState} from "react";
import * as d3 from "d3";

const [loading1, setLoading1] = useState(true);
const [loading2, setLoading2] = useState(true);
const [loading3, setLoading3] = useState(true);
setKillersData()
setMapData()

useEffect(() => {
  d3.json("datasets/serial_killers.json").then((d) => {
    d.map(k  => {
      k.stereotype = k.Stereotype
      k.stereotype_pos = k["Stereotype Position"]
      k["Served in the military?"] = k["Served in the military?"] == null ? false : k["Served in the military?"]
      k["Served in the military?"] = typeof k["Served in the military?"] !== "boolean"  ? true : k["Served in the military?"]
      k["Spent time incarcerated?"] = k["Spent time incarcerated?"] == null ? false : k["Spent time incarcerated?"]
      k["Marital status"] = k["Marital status"] == null ? "Single" : k["Marital status"]
      k["Gender of victims"] = k["Gender of victims"] == null ? "Male" : k["Gender of victims"]
      k["Sexual preference"] = k["Sexual preference"] == null ? "Heterosexual" : k["Sexual preference"]
      k["Sexual preference"] = k["Sexual preference"].length > 20 ? "Heterosexual" : k["Sexual preference"]
    })
    setKillersData(d);
    setLoading1(false);
    console.log("killers", d)
  });
  d3.json("datasets/us_w_counties.json").then((d) => {
    setMapData(d);
    setLoading2(false);
    console.log("us_counties",d)
  });
  d3.csv("datasets/victims_by_state.csv").then((d) => {
    const victimsData = new Map()
    d.forEach(s =>
      victimsData.set(s.State, {
        "serialKillersVictims": s.serialKillersVictims,
        "serialKillersVictimsPerCapita": s.serialKillersVictimsPerCapita
      })
    )
    setVictimsData(victimsData);
    console.log("vict data",d)
    setLoading3(false);
  });
  return () => undefined;
}, []);
