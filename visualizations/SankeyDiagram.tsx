import * as d3 from "d3";

import {MutableRefObject, useContext, useEffect, useLayoutEffect, useRef, useState} from "react";
import {sankeyJustify, sankeyLinkHorizontal, sankey, SankeyGraph} from "d3-sankey";
import {group, lab} from "d3";
import Labels from "./Labels";
import {Context} from "./Context"
import Rect from "./components/Rectangle";
import {Killers} from "../interfaces/killers";
import Link from "./components/Link"
import useSize from "./hooks/useSize";


function handleClick(e: PointerEvent, graph: SankeyGraph<any, any>, setSteoretype) {
    let line: SVGPathElement = e.target as SVGPathElement
    let stereotype = line.dataset["stereotype"]
    setSteoretype(Number(stereotype))
}

function standard_deviation(values_by_category, data_length) {
    let values = values_by_category
    const mean = d3.reduce(values, (prev, current, index) => (prev + index * current), 0) / data_length
    let res = values.map((x, index) => Math.pow(x - mean, 2)).reduce((p, n) => p + n, 0)
    //console.log("mean", mean, "res", res)
    return res
}

let keysOfInterst = [
    "Served in the military?",
    "Marital status",
    "Spent time incarcerated?",
    "Sexual preference", "Gender of victims", "Gender of killer"
]

let simpleKeys = {
    "Served in the military?": "Military",
    "Marital status": "Marriage",
    "Spent time incarcerated?": "Incarcerated",
    "Sexual preference": "Orientation",
    "Gender of victims": "Victim's Gender",
    "Gender of killer": "Gender"
}


function buildLinks() {

}


function buildOrder() {

}


function buildNodes(frequencies: {}, sterotypes_types: number[] | [string], selectedSterotypes) {
    let _nodes = []
    for (let attribute in frequencies) {
        for (let category in frequencies[attribute]) {
            _nodes.push(
                {
                    name: attribute + " " + category
                }
            )
        }
    }
    let _s_nodes = []
    for (let n of _nodes) {
        for (let s of sterotypes_types) {
            _s_nodes.push({...n, name: n.name + " " + s})
        }
    }
    _nodes = _s_nodes
    // sort so all of the same values are together
    _nodes = _nodes.sort((a, b) => a.name.slice(0, -2) == b.name.slice(0, -2) ? 0 : -1)
    _nodes = _nodes.sort((a, b) => {
        let Aattr = a.name.slice(0, -2)
        let Battr = b.name.slice(0, -2)
        let Astero = a.name[a.name.length - 1]
        let Bstero = b.name[b.name.length - 1]
        //console.log(Astero, Bstero, Aattr, Battr)
        // first sort acording to attributes
        if (Aattr != Battr) return Aattr < Battr ? -1 : 1
        let Aselected = selectedSterotypes.includes(Number(Astero))
        let Bselected = selectedSterotypes.includes(Number(Bstero))
        // if they are of the same "group" normal string ordering
        if (Aselected && Bselected || !Aselected && !Bselected) return Astero < Bstero ? -1 : 1
        return Aselected ? 1 : -1 // else give priority to the node selected

    })
    //console.log(_nodes)
    //console.log(_nodes.map(n => n.name))
    return _nodes
}

export default function SankeyDiagram(props: { data: [Killers] }) {
    const graph = useRef(null);
    let context = useContext(Context)
    let setStereotype = context.setStereotype
    let setKiller = context.setKill
    let currentKiller = context.state.currentKiller
    let currentStereotype = context.state.currentStereotypes.length == 0 ? null : context.state.currentStereotypes[0] // the stereotype which the graph will be ordered by
    let selectedStereotypes = context.state.currentStereotypes.length == 0 ? [0, 1, 2, 3, 4, 5, 6, 7] : context.state.currentStereotypes

    let sankeyRef = useRef<MutableRefObject<SVGElement>>(null)
    let sankeyContainerRef = useRef(null)
    let [size, setSize] = useSize({width: 400, height: 300}, sankeyContainerRef)


    // find the most uniform attributes for the targets
    let killers: [Killers] = props.data
    let frequencies = {}
    for (let k of keysOfInterst) frequencies[k] = {}
    let killers_for_order = currentStereotype != null ? killers.filter(k => k.stereotype == currentStereotype) : killers
    // get frequencies of values
    for (let i = 0; i < killers.length; i++) {
        let person = killers[i]
        for (let k of keysOfInterst) {
            let f = frequencies[k]
            let value = person[k]
            if (killers_for_order.indexOf(person) == -1) {
                f[value] = f[value] === undefined ? 1 : f[value]
            } else f[value] = f[value] === undefined ? 1 : f[value] + 1
        }
    }
    // data keys// values of the data // their frequencies


    let ordered_frequencies: [string, any] = Object.keys(frequencies).map((key) => [key, frequencies[key]])

    ordered_frequencies = ordered_frequencies.sort((key1, key2) =>
        standard_deviation(
            Object.values(key1[1]), killers_for_order.length
        ) > standard_deviation(
            Object.values(key2[1]), killers_for_order.length
        ) ? -1 : 1
    )

    let [attributeOrder, setAttributeOrder] = useState(ordered_frequencies.map(v => v[0]))
    ordered_frequencies = ordered_frequencies.sort((a, b) => attributeOrder.indexOf(a[0]) - attributeOrder.indexOf(b[0]))

    if (killers.length == 0) return <div>Loading :)</div>


    const sterotypes_types = currentStereotype != null ? [0, 1, 2, 3, 4, 5, 6, 7] : [" "]
    let _nodes = buildNodes(frequencies, sterotypes_types, selectedStereotypes);


    //console.log("Frequencies", frequencies)
    let _links = []
    for (let kil of killers) {
        for (let i = 1; i < ordered_frequencies.length; i++) {
            let source_name = ordered_frequencies[i - 1][0]
            let source_value = kil[source_name]
            //console.log(source_name, source_value)

            let target_name = ordered_frequencies[i][0]
            let target_value = kil[target_name]
            // console.log(target_name, target_value)
            _links.push({
                source: _nodes.findIndex(v => v.name == source_name + " " + source_value + " " + (currentStereotype == null ? " " : kil.stereotype)),
                target: _nodes.findIndex(v => v.name == target_name + " " + target_value + " " + (currentStereotype == null ? " " : kil.stereotype)),
                value: kil.stereotype,
                color: "#ddddd",
                killerid: killers.indexOf(kil),
                stereotype: kil.stereotype
            })
        }
    }
    let sankeyData = {
        nodes: _nodes,
        links: _links
    }

    let _sankey = sankey(sankeyData)
        .nodeAlign(sankeyJustify)
        .nodeWidth(10)
        .nodePadding(10)
        .extent([[0, 0], [size.width, size.height]])
    _sankey = _sankey.iterations(0)


    graph.current = _sankey(sankeyData)
    //graph.current.linkSort(null);
    const {links, nodes} = graph.current;
    if (links == null || nodes == null) return <div>Loading</div>
    console.log(nodes, links)

    //if (size.width != s.clientWidth || size.height != s.clientHeight) setSize({width: s.getBBox().width, height : s.getBBox().height})
    let r: Element = sankeyContainerRef.current
    if (r != null && r.getBoundingClientRect().height != size.height && r.getBoundingClientRect().width != size.width) {
        setSize({width: r.getBoundingClientRect().width, height: r.getBoundingClientRect().height})
    }


    return (
        <>
            <h2 onClick={() => setAttributeOrder(ordered_frequencies.sort((key1, key2) =>
                standard_deviation(
                    Object.values(key1[1]), killers_for_order.length
                ) > standard_deviation(
                    Object.values(key2[1]), killers_for_order.length
                ) ? -1 : 1
            ).map(v => v[0]))}><span className={"inter"}>Sankey Diagram</span></h2>
            <div ref={sankeyContainerRef} id={"sankeyContainer"}
                 style={{overflow: "show", zIndex: "1000", width: "100%", height: "80%"}}>

                <svg id="sankey" className="sankey" ref={(s) => {
                    sankeyRef["current"] = s
                    if (s === null) return
                    document.querySelectorAll("path").forEach((p) => {
                        p.onclick = (e) => handleClick(e, graph.current, (new_stereotype) => setStereotype(new_stereotype))
                    })
                }
                } width={size.width} height={size.height}>
                    <g>
                        <defs>
                            <filter id="red-glow" filterUnits="userSpaceOnUse"
                                    x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur5"/>
                                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur10"/>
                                <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur20"/>
                                <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur30"/>
                                <feGaussianBlur in="SourceGraphic" stdDeviation="50" result="blur50"/>
                                <feMerge result="blur-merged">
                                    <feMergeNode in="blur10"/>
                                    <feMergeNode in="blur20"/>
                                    <feMergeNode in="blur30"/>
                                    <feMergeNode in="blur50"/>
                                </feMerge>
                                <feColorMatrix result="red-blur" in="blur-merged" type="matrix"
                                               values="1 0 0 0 0
                             0 0.06 0 0 0
                             0 0 0.44 0 0
                             0 0 0 1 0"/>
                                <feMerge>
                                    <feMergeNode in="red-blur"/>
                                    <feMergeNode in="blur5"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>


                        {links.map((d, i) => {
                            let isCurrentKiller = d.killerid == currentKiller
                            //console.log(isCurrentKiller, d.killerid, currentKiller)
                            let allSteortpesSelected = selectedStereotypes.length == 8
                            //console.log(selectedStereotypes, "JJJJJJJJJJJJJJJJJJJJJJ")
                            let isFromSelectedStereotye = selectedStereotypes.includes(d.stereotype)

                            // Select stroke color
                            let strokeColor = `url(#gradient-${d.index})` // default color
                            if (isCurrentKiller) strokeColor = "white"
                            else if (allSteortpesSelected) strokeColor = strokeColor
                            else if (isFromSelectedStereotye) strokeColor = context.state.stereotypes[d.stereotype].color

                            // Select opacity
                            let opacity = 0.1 // default opacity
                            if (isCurrentKiller) opacity = 1
                            else if (allSteortpesSelected) opacity = 0.4
                            else if (isFromSelectedStereotye) opacity = 0.25

                            // Select stroke width
                            let strokeWidth = 4
                            if (isCurrentKiller) strokeWidth = 5
                            else if (allSteortpesSelected) strokeWidth = 1


                            return (
                                <Link
                                    data={d}
                                    width={6}
                                    length={nodes.length}
                                    colors={"#dddddd"}
                                    stopColor={allSteortpesSelected ? "red" : "0"}
                                    strokeWidth={strokeWidth}
                                    strokeOpacity={opacity}
                                    stroke={strokeColor}
                                    key={i}
                                />
                            );
                        })
                        }
                    </g>
                    <g>
                        {nodes.map((d, i) => {
                                let final_name = ""//d.name.split(" ").filter(v => v != "")
                                let thisSteorotype = d.name.split(" ").filter(v => v != "").filter(v => !isNaN(Number(v)))[0]

                                let thisNodeAttr = nodes[i]?.name.slice(0, -2)
                                let nextNodeAttr = nodes[i + 1]?.name.slice(0, -2)
                                let prevNodeAttr = nodes[i - 1]?.name.slice(0, -2)
                                let isBoundary = thisNodeAttr != nextNodeAttr || thisNodeAttr !== prevNodeAttr
                                if (isBoundary) final_name = "--------"
                                let j, k, found=false;
                                for (j = 0; j <= 4; j++) {
                                    let nextNodeAttr = nodes[i + j]?.name.slice(0, -2)
                                    if (nextNodeAttr != thisNodeAttr) {
                                        found = true
                                        break
                                    }
                                }
                                for (k = 0; k < 4; k++) {
                                    let nextNodeAttr = nodes[i - k]?.name.slice(0, -2)
                                    if (nextNodeAttr != thisNodeAttr) break
                                }
                                if (j == 4 && found) {
                                    final_name = thisNodeAttr.split(" ")
                                    final_name = final_name[final_name.length-1]
                                }

                                return <Rect
                                    key={i}
                                    currentStereotype={currentStereotype}
                                    index={d.index}
                                    x0={d.x0}
                                    x1={d.x1}
                                    y0={d.y0}
                                    y1={d.y1}
                                    name={final_name}
                                    value={d.value}
                                    length={nodes.length}
                                    colors={"#dddddd"}
                                    strokeDasharray={` ${d.x0 - d.x1}, ,0,0,00` //} thisSteorotype == 0 ? "10,0,0,0" : thisSteorotype == 8 ? "0,0,0,10" : 0}
                                    }
                                    size={size}
                                />
                            }
                        )
                        }
                    </g>
                </svg>
                {<Labels onLabelChange={(items) => setAttributeOrder(items.map(v =>
                    Object.keys(simpleKeys).find(key => simpleKeys[key] == v)   // convert to "complex" key name
                ))
                } label_names={ordered_frequencies.map(f => simpleKeys[f[0]])}></Labels>}
            </div>
        </>
    );
}
