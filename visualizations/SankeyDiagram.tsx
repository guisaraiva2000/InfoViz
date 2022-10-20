import * as d3 from "d3";

import {MutableRefObject, useEffect, useRef, useState} from "react";
import {sankeyJustify, sankeyLinkHorizontal, sankey, SankeyGraph} from "d3-sankey";
import {group} from "d3";

const size = {
    width: 700,
    height: 600
};

const getMousePosition = event => {
    const CTM = event.target.getScreenCTM();

    return {
        x: (event.clientX - CTM.e) / CTM.a,
        y: (event.clientY - CTM.f) / CTM.d
    };
};


const Rect = ({index, x0, x1, y0, y1, name, value, length, colors}) => {
    return (
        <>
            <rect
                x={x0}
                y={y0}
                width={x1 - x0}
                height={y1 - y0}
                fill={"#dddddd"} //colors(index / length)}
                data-index={index}
            />
            <text
                x={x0 < size.width / 2 ? x1 + 6 : x0 - 6}
                y={(y1 + y0) / 2}
                style={{
                    fill: "#dddddd",//d3.rgb(colors(index / length)).darker(),
                    alignmentBaseline: "middle",
                    fontSize: 9,
                    textAnchor: x0 < size.width / 2 ? "start" : "end",
                    pointerEvents: "none",
                    userSelect: "none"
                }}
            >
                {name}
            </text>
        </>
    );
};

function getSterotypeColor(sterotype: number) {
    return ["red", "yellow", "blue", "white", "orange"][sterotype]

}

const Link = ({data, width, length, colors}) => {
    const link = sankeyLinkHorizontal();


    return (
        <>
            <defs>
                <linearGradient
                    id={`gradient-${data.index}`}
                    gradientUnits="userSpaceOnUse"
                    x1={data.source.x1}
                    x2={data.target.x0}
                >
                    <stop offset="0" stopColor={data.killerid //colors(data.source.index / length)} />}
                    }></stop>
                    <stop offset="100%" stopColor={"red"}/>
                </linearGradient>
            </defs>
            <path
                data-killerid={data.killerid}
                data-stereotype={data.stereotype}

                d={link(data)}
                fill={"none"}
                stroke={`url(#gradient-${data.index})`}
                //stroke={getSterotypeColor(data.stereotype)}
                strokeOpacity={0.1}
                strokeWidth={width}
            />
        </>
    );
};

export interface Killers {
    name: boolean | string;
    alias: string;
    "Mother abused drugs/alcohol "?: boolean | Branch;
    "Highest grade in school"?: boolean | number | string;
    "Highest degree"?: boolean | string;
    "Served in the military?": boolean;
    Branch?: boolean | string;
    "Type of discharge"?: boolean | string;
    "Types of jobs worked"?: boolean | string;
    "Sexual preference"?: boolean | SexualPreferenceEnum;
    "Marital status"?: boolean | MaritalStatus;
    "Number of children": number | string;
    "Lives with his children": boolean;
    "Living with"?: boolean | string;
    "Abused drugs?": boolean;
    "Abused alcohol?": boolean;
    "Committed previous crimes? ": boolean;
    "Spend time in jail? ": boolean;
    "Spend time in prison? ": boolean;
    "Number of victims": boolean | number | string;
    "Victim type"?: boolean | string;
    "Killer age at start of series": boolean | number | string;
    "Date of first kill in series"?: boolean | number | string;
    "Date of final kill in series"?: boolean | number | string;
    "Gender of victims": boolean | Sex;
    "Race of victims"?: boolean | string;
    "Age of victims"?: boolean | number | string;
    "Method of killing"?: boolean | string;
    Weapon?: boolean | string;
    "Was gun used?": boolean;
    "Did killer have a partner?": boolean;
    "Type of serial killer"?: boolean | string;
    "How close did killer live?"?: boolean | string;
    "Location of first contact"?: boolean | string;
    "Location of killing"?: boolean | string;
    "Killing occurred in home of victim?": boolean;
    "Killing occurred in home of killer?": boolean;
    "Victim abducted or killed at contact?"?: boolean | string;
    "Rape?": boolean;
    "Tortured victims?": boolean;
    "Bound the victims?": boolean;
    "Sex with the body?": boolean;
    "Mutilated body?"?: boolean;
    "Ate part of the body?"?: boolean;
    "Drank victim’s blood?"?: boolean;
    "Posed the body?"?: boolean;
    "Took totem – body part"?: boolean;
    "Took totem – personal item": boolean;
    "Robbed victim or location": boolean;
    "Left at scene, no attempt to hide": boolean;
    "Date killer arrested"?: boolean | number | string;
    "Date convicted"?: boolean | number | string;
    Sentence: boolean | string;
    "Killer executed?"?: boolean;
    "Did killer plead NGRI?": boolean;
    "Did serial killer confess?"?: boolean | string;
    "Name and state of prison"?: boolean | string;
    "Killer committed suicide?"?: boolean;
    "Killer killed in prison?"?: boolean;
    "Date of death"?: boolean | number | string;
    "Left at scene, hidden": boolean;
    "Left at scene, buried": boolean;
    "Applied for job as a cop?": boolean;
    "Overkill?": boolean;
    "Quick & efficient?": boolean;
    "Used blindfold?": boolean;
    "Fired from jobs?": boolean;
    "Animal torture ": boolean;
    "Fire setting ": boolean;
    "Bed wetting ": boolean;
    "Stalked victims?": boolean;
    "Cut-op and disposed of": boolean;
    "Was the NGRI plea successful?": WasTheNgriPleaSuccessful;
    "Saw combat duty": boolean | WasTheNgriPleaSuccessful;
    "Been to a psychologist?": boolean;
    "Moved, too home": boolean;
    "Time in forensic hospital?": boolean;
    "Killed prior to series?  Age? ": boolean;
    "Father abused drugs/alcohol": boolean;
    "Mother abused drugs/alcohol": boolean;
    "Sexually abused?": boolean;
    "Physically abused?": boolean;
    "Psychologically abused?": boolean;
    "Physically attractive?": boolean;
    "Speech defect?": boolean;
    "Head injury?": boolean;
    "Physical defect?": boolean;
    "Problems in school?": boolean;
    "Teased while in school?": boolean;
    stereotype: number;
    stereotype_pos2D: number[];
    stereotype_pos3D: number[];
    Sex?: Sex;
    Race?: Branch;
    Religion?: string;
    "Country where killing occurred"?: CountryWhereKillingOccurred;
    "States where killing occurred"?: boolean | string;
    "Date of birth"?: boolean | number | string;
    Location?: string;
    "Birth order"?: string;
    "Number of siblings"?: boolean | number | string;
    "XYY?"?: boolean | DidKillerConfessToThisMurderEnum;
    "Raised by"?: boolean | string;
    "Birth category"?: boolean | string;
    "Parent’s marital status"?: boolean | string;
    "Family event"?: boolean | string;
    "Age of family event"?: boolean | number | string;
    "Father’s occupation"?: boolean | string;
    "Age of first sexual experience"?: boolean | number | string;
    "Age when first had intercourse"?: boolean | number | string;
    "Mother’s occupation"?: boolean | string;
    "Highest grade in school "?: boolean | number | string;
    "Highest degree "?: boolean | string;
    "Grades in school "?: boolean | string;
    "IQ "?: boolean | number | string;
    "Killed enemy during service?"?: boolean | DidKillerConfessToThisMurderEnum;
    "Worked in law enforcement?"?: boolean | string;
    "Employment status during series"?: boolean | string;
    Diagnosis?: boolean | string;
    "Took totem – body part "?: boolean;
    "Took totem – personal item "?: boolean;
    "Robbed victim or location "?: boolean | string;
    "Moved, no attempt to hide"?: boolean;
    "Moved, buried"?: boolean;
    C?: string;
    h?: string;
    ""?: boolean | number | string;
    "April 1"?: number;
    "May 16"?: number;
    "May 18"?: number;
    "December "?: number | string;
    "May 1"?: number;
    "August 26"?: number;
    "November "?: number | string;
    "October 24"?: number;
    "January 6"?: number;
    "March 20"?: number;
    "January 22"?: number;
    February?: number;
    "June 27"?: number;
    "July 26"?: number;
    "July 27"?: number;
    "Country where killing "?: string;
    "States where killing "?: string;
    "Age of first sexual "?: string;
    "Age when first had "?: string;
    "Mother abused "?: string;
    "Grades in school"?: boolean | string;
    IQ?: boolean | number | string;
    "Killed enemy during "?: string;
    "Worked in law "?: string;
    "Employment status during "?: string;
    "Animal torture"?: boolean;
    "Fire setting"?: boolean | string;
    "Bed wetting"?: boolean | Branch;
    "Committed previous "?: string;
    "Spend time in jail?"?: boolean;
    "Spend time in prison?"?: boolean | string;
    "Killed prior to series?  Age?"?: boolean | string;
    "Killing occurred in home "?: string;
    "Sex with the body? "?: boolean;
    "Left at scene, no attempt to "?: string;
    "Cut-up and disposed of"?: boolean | string;
    D?: string;
    W?: string;
    "Source of IQ information"?: boolean | string;
    "Been to a psychologist (prior to killing)?"?: boolean | Branch;
    "Time in forensic hospital (prior to killing)?"?: boolean | string;
    "Spent time in jail? "?: boolean;
    "Spent time in prison? "?: boolean;
    "Number of victims (suspected of) "?: number | string;
    "Number of victims (confessed to) "?: string;
    "Number of victims (convicted of) "?: number;
    "Killer age at end of series"?: number | string;
    "Type of victim"?: boolean | string;
    Type?: string;
    "Name of partner"?: boolean | string;
    "Sex of partner"?: boolean | string;
    "Relationship of partner"?: boolean | string;
    "Intentionally went out that day to kill?"?: boolean | string;
    "Moved, hidden"?: boolean | string;
    "Burned body"?: boolean | string;
    "Dumped body in lake, river, etc."?: boolean | string;
    "Moved, took home"?: boolean;
    "Cause of death"?: boolean | string;
    Name?: string;
    "Date killed"?: string;
    "Date body was found"?: string;
    Gender?: string;
    Age?: Branch | number;
    "How killed"?: string;
    "State killed"?: boolean | string;
    "City killed"?: string;
    "County killed"?: boolean | string;
    "Type of target"?: string;
    "Did killer confess to this murder?"?: boolean | DidKillerConfessToThisMurderEnum;
    "Was killer convicted of this murder?"?: boolean | DidKillerConfessToThisMurderEnum;
    "Committed previous crimes?"?: boolean | string;
    "Spent time in prison?"?: boolean | string;
    "Victim abducted or killed at contact? "?: boolean;
    "In an interview with the Associate Press, Hall claims to have abducted 39 women "?: string;
    "Time in forensic hospital (prior to "?: string;
    "Confessed: "?: string;
    "August 21, "?: number;
    "Type of killer"?: boolean | string;
    Height?: boolean | string;
    A?: string;
    "Source of IQ information "?: boolean | string;
    "Killing occurred in home of "?: string;
    "Rape? "?: boolean | string;
    "Tortured victims? "?: boolean;
    "Stalked victims? "?: boolean | string;
    "Country where killing occurred "?: CountryWhereKillingOccurred;
    "States where killing occurred "?: string;
    "Type of killer "?: string;
    "Bound victims?"?: boolean;
    "Father abused drugs/alcohol "?: boolean | string;
    "Drank victim†s blood?"?: boolean;
    "References "?: boolean | string;
    "Lives with his children "?: boolean | string;
    "Living with  "?: string;
    "Age when first had intercourse "?: boolean | string;
    "Mother’s occupation "?: boolean | string;
    "Lives with her children"?: boolean | string;
    "Moved, to home"?: boolean | string;
    "Did serial killer live with a step-parent?"?: boolean;
    "Abused drugs? "?: boolean | string;
    "4"?: number;
    "Cut-up and disposed of body"?: boolean;
    Sentencing?: boolean | string;
    "Spent time in jail?"?: boolean;
    "Number of victims "?: boolean | number | string;
    "Victim type "?: string;
    "Left at scene, no attempt to hide "?: boolean;
    "Left at scene, hidden "?: boolean;
    "Left at scene, buried "?: boolean | string;
    "Moved, no attempt to hide "?: boolean;
    P?: string;
    "Number of victims (suspected of)"?: number | string;
    "Number of victims (confessed to)"?: boolean | number | string;
    "Number of victims (convicted of)"?: boolean | number | string;
    "Killed enemy during     "?: string;
    "Victim abducted or killed at "?: string;
    "Quick & efficient? "?: boolean;
    "Used blindfold? "?: boolean | string;
    "Bound the victims? "?: boolean | string;
    "After Death Behavior"?: string;
    "Killer age at start of series "?: number;
    "Killer committed suicide? "?: boolean;
    "Killer killed in prison? "?: boolean;
    "Date of death "?: boolean | number | string;
    M?: string;
    "Age when first had    "?: string;
    "Mother’s Occupation"?: boolean | string;
    "Killing occurred in home of   "?: string;
    "Killing occurred in home of    "?: string;
    E?: string;
    "Abused alcohol? "?: boolean | string;
    "Been to a psychologist? "?: boolean;
    "Time in forensic hospital? "?: boolean | string;
    "Diagnosis "?: boolean | string;
    "How close did killer live? "?: string;
    "Killing occurred in home of victim? "?: boolean;
    "Killing occurred in home of killer? "?: boolean;
    "Weapon "?: boolean | string;
    "Height "?: boolean | string;
    B?: string;
    S?: string;
    "April 16-"?: string;
    "April 19, "?: number;
    "April 30, "?: number;
    "May 1, "?: number;
    "May 12, "?: number;
    "May 23, "?: number;
    "January 5-"?: string;
    "February "?: string;
    "March "?: number;
    "March 2, "?: number;
    "April 1, "?: number;
    "May 5, "?: number;
    "May 6, "?: number;
    "May 14, "?: number;
    "May 16, "?: number;
    "May 17, "?: number;
    "May 18, "?: number;
    "June 28, "?: number;
    "July 6, "?: number;
    "October 6, "?: number;
    "April 28, "?: number;
    "September "?: string;
    "March 20, "?: number;
    "April 5, "?: number;
    "May "?: string;
    "Did serial killer spend time in an orphanage?"?: boolean;
    "Did serial killer spend time in a foster home?"?: boolean;
    "Was serial killer ever raised by a relative?"?: boolean | string;
    "Did serial killer ever live with adopted family?"?: boolean;
    "Cities where killing occurred"?: boolean | string;
    "Date of first kill in series "?: number | string;
    "Name and state of prison "?: string;
    F?: string;
    N?: string;
    "Lives with his/her children"?: boolean;
    "Lives with children"?: boolean;
    "Did serial killer ever live with a step-parent?"?: boolean;
    "Been to a psychologist (prior to killing)? "?: boolean;
    "Time in forensic hospital (prior to killing)? "?: boolean;
    "Country killed"?: string;
    "Did killer confess to this murder"?: boolean;
    "Type of  target"?: string;
    "Was the killer convicted of this murder?"?: boolean;
    "Date Killed"?: string;
    "How Killed"?: string;
    "State Killed"?: string;
    "City Killed"?: string;
    "Did the killer confess to this murder?"?: boolean;
    "Multiple other victims were unidentified "?: string;
    K?: string;
    G?: string;
    "Date killer arrested "?: boolean;
    R?: string;
    "Overkill? "?: boolean;
    "Cause of death "?: string;
    "Cities where killing occurred "?: string;
    T?: boolean | string;
    "Date of Death"?: Branch;
    "("?: string;
    "Time in forensic hospital"?: boolean;
    "Used blindfold "?: boolean;
    "Been to a psychologist (prior to "?: string;
    "3"?: number;
    "5"?: string;
    "7"?: string;
    J?: number;
    "Books "?: string;
    O?: string;
    "Served in the military? "?: boolean;
    "Branch "?: Branch;
    "Mutilated body? "?: boolean;
    "Ate part of the body? "?: boolean;
    "Introduction to a Serial Killer "?: string;
    "Marital status "?: MaritalStatus;
    "Number of children "?: boolean | number;
    "Counties where killing occurred"?: string;
    "Victim 2"?: Branch;
    "Physical defect"?: boolean;
    "Living at"?: string;
    "Tortured Victim?"?: boolean;
    "again, and third marriage ends in divorce.  Hicks then "?: string;
    "Fired setting "?: boolean;
    "Types of jobs worked "?: string;
    "Employment status during series "?: string;
    "Abused drugs?  "?: boolean;
    "Killer Psychological "?: string;
    "Killed prior to series?  "?: string;
    "Was the NGRI plea "?: string;
    "room at Boarding Home of Mrs. John Jones and stayed "?: string;
    H?: string;
    "September 18, "?: string;
}

export enum Branch {
    NA = "N/A",
    White = "White",
}

export enum CountryWhereKillingOccurred {
    England = "England",
    GreatBritain = "Great Britain",
    UnitedStates = "United States",
}

export enum DidKillerConfessToThisMurderEnum {
    DidKillerConfessToThisMurder = "-----",
    DidKillerConfessToThisMurderNA = "n/a",
    Empty = "--",
    NA = "N/A",
    Na = "NA",
    PurpleNA = "N/a",
}

export enum Sex {
    Both = "both",
    Female = "Female",
    Male = "Male",
}

export enum MaritalStatus {
    Divorced = "Divorced",
    Married = "Married",
    Single = "Single",
}

export enum WasTheNgriPleaSuccessful {
    False = "False",
}

export enum SexualPreferenceEnum {
    Bisexual = "Bisexual",
    Heterosexual = "Heterosexual",
    Homosexual = "Homosexual",
}


function getStandardDeviation(array) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

class Props {
    data: [Killers] // json with killers data
    targets: []  // datapoints of interest
}

function handleClick(e: PointerEvent, graph: SankeyGraph<any, any>, type) {
    let line: SVGPathElement = e.target as SVGPathElement
    console.log(line)
    let killer_id = line.dataset["killerid"]
    let stereotype = line.dataset["stereotype"]
    document.querySelectorAll(`path[data-stereotype="${stereotype}"]`).forEach((e, p) => {
        e.setAttributeNS(null, "stroke", getSterotypeColor(Number(stereotype)))
    })
    return

    if (type == "leave") {
        document.querySelectorAll(`path[data-killerid="${killer_id}"]`).forEach((e, p) => {
            console.log("LEAVE")
            e.setAttributeNS(null, "stroke-width", "1")
            e.style.stopcolor = "black"
            console.log(e, p)
        })

    }
    document.querySelectorAll(`path[data-killerid="${killer_id}"]`).forEach((e, p) => {
        e.setAttributeNS(null, "stroke-width", "10")
        e.style.stopcolor = "yellow"

        console.log(e, p)
    })
    graph.links.forEach((l) => {

            if (l.killerid == killer_id) {
                console.log("OMG")

            }
        }
    )

}

const sterotypes_types = [...Array(8).keys()]


export default function SankeyDiagram(props: Props) {
    /* Select killer by line One line -> one killer
    * Color killers by sterotype
    * Filter/Reorder&Highlight data according to idxs
    *
    * On highlight fade everyone else
    * Add reorder hability
    * */
    const [data, setData] = useState(null);
    const dragElement = useRef(null);
    const graph = useRef(null);
    const offset = useRef(null);
    useEffect(() => {
        fetch("https://raw.githubusercontent.com/ozlongblack/d3/master/energy.json")
            .then(res => res.json())
            .then(data => setData(data));
    }, []);

    useEffect(() => {
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);

        return () => {
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, []);
    let som = "stereotype"
    let keysOfInterst = [
        "Served in the military?",
        "Marital status",
        "Spend time in jail?",
        "Sexual preference", "Gender of victims", "Gender"
    ]
    let sankeyRef = useRef<MutableRefObject<SVGElement>>(null)
    let labelsRef = useRef(null)

    // find the most uniform attributes for the targets
    let killers: [Killers] = props.data
    if (killers.length === 1) return <div> Loding</div>
    let frequencies = {}
    let data_length = props.data.length
    for (let k of keysOfInterst) frequencies[k] = {}
    if (props.targets.length == 0) {// use all data
        // get frequencies of values
        for (let i = 0; i < props.data.length; i++) {
            let person = killers[i]
            for (let k of keysOfInterst) {
                let f = frequencies[k]
                let value = person[k]
                f[value] = f[value] === undefined ? 1 : f[value] + 1
            }
        }
    }

    useEffect(
        () => {
            let labels = Array(...document.querySelectorAll("text"))
            console.log("Labels", labels.reduce(
                (group, label) => {
                    console.log("l", label)
                    let x_axis = label.getAttribute("x")
                    group[x_axis] = label
                    return group
                }, {}
            ))
        }
        , [sankeyRef.current, labelsRef.current])


    // data keys// values of the data // their frequencies

    if (killers.length == 0) return <div>Loas</div>

    function standard_deviation(values_by_category) {
        let values = values_by_category
        const mean = d3.reduce(values, (prev, current, index) => (prev + index * current), 0) / data_length
        let res = values.map((x, index) => Math.pow(x - mean, 2)).reduce((p, n) => p + n, 0)
        console.log("mean", mean, "res", res)
        return res
    }

    /*
    document.querySelectorAll('text').forEach((t) => {
        let your_text = t.innerHTML
        let _ = document.createElement("div")
            _.innerText = your_text.split("<br>")[0]
        let _1 = document.createElement("div")
            _1.innerText = your_text.split("<br>")[1]
        t.innerHTML = ""
        t.appendChild(_)
        t.appendChild(_1)
    })

     */

    let ordered_frequencies = Object.keys(frequencies).map((key) => [key, frequencies[key]]);
    console.log(ordered_frequencies)
    let n = ordered_frequencies.sort((key1, key2) =>
        standard_deviation(
            Object.values(key1[1])
        ) > standard_deviation(
            Object.values(key2[1])
        ) ? -1 : 1
    )
    console.log("Sorted", n)


    /*
    for (let k of keysOfInterst) {
       let f = frequencies[k]
       for (let v of f) f[v]= f[v] / data_length
       }
    }

     */

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
    _nodes = _nodes.sort((a, b) => a.name.slice(0, -2) == b.name.slice(0, -2) ? 0 : -1)

    console.log("Frequencies", frequencies)
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
                source: _nodes.findIndex(v => v.name == source_name + " " + source_value + " " + kil.stereotype),
                target: _nodes.findIndex(v => v.name == target_name + " " + target_value + " " + kil.stereotype),
                value: kil.stereotype,
                color: "#ddddd",
                killerid: killers.indexOf(kil),
                stereotype: kil.stereotype
            })
        }
    }
    _links = _links.sort((e, b) => e.stereotype == b.stereotype ? 1 : -1)
    console.log("links", _links)
    //for (let i = 1; i < ordered_frequencies.length; i++) {
    //   let l = {
    //       source: keysOfInterst.indexOf(ordered_frequencies[i - 1][0]),
    //       target: keysOfInterst.indexOf(ordered_frequencies[i][0]),
    //       value: 10,
    //       color: "#ddddd"
    //   }
    //   _links.push(l)
    // }
    let sankeyData = {
        nodes: _nodes,
        links: _links
    }
    console.log("SUNK", sankeyData)


    //sankeyData = data
    console.log("sank", data)


    let _sankey = sankey(sankeyData)
        .nodeWidth(10)
        .nodePadding(10)
        .extent([[0, 0], [size.width, size.height]])
    _sankey = _sankey.iterations(0)


    const onMouseUp = e => {
        dragElement.current = null;
    };

    const onMouseDown = e => {
        if (e.target.tagName === "rect") {
            dragElement.current = e.target;
            offset.current = getMousePosition(e);
            offset.current.y -= parseFloat(e.target.getAttributeNS(null, "y"));
        }
    };

    const onMouseMove = e => {
        if (dragElement.current) {
            const coord = getMousePosition(e);
            dragElement.current.setAttributeNS(null, "y", coord.y - offset.current.y);
        }
    };

    graph.current = _sankey(sankeyData)
    //graph.current.linkSort(null);
    const {links, nodes} = graph.current;
    console.log(graph.current)
    if (links == null || nodes == null) return <div>Loading</div>
    console.log(nodes)
    console.log(links)


    return (
        <div>
            <svg ref={(s) => {
                sankeyRef["current"] = s
                if (s === null) return
                document.querySelectorAll("path").forEach((p) => {
                    p.onclick = (e) => handleClick(e, graph.current)

                    //    p.onmouseenter = (e)=>handleClick(e,graph.current)
                    //   p.onmouseleave = (e)=>handleClick(e,graph.current,"leave")
                })
                /* D3 SUCKS!
                d3.selectAll("path").on({
                    "click" : console.log,
                    "mouseover" : console.log,
                    "mouseout" : console.log,
                })
                 */

                //.forEach(t=> t.innerHTML  = "")
                //s.querySelector()

            }
            } width={size.width} height={size.height}>
                <g>
                    {links.map((d, i) => (
                        <Link
                            data={d}
                            width={3 //d.width}
                            }
                            length={nodes.length}
                            colors={"#dddddd"}
                        />
                    ))}
                </g>
                <g>
                    {nodes.map((d, i) => (
                        <Rect
                            index={d.index}
                            x0={d.x0}
                            x1={d.x1}
                            y0={d.y0}
                            y1={d.y1}
                            name={d.name}
                            value={d.value}
                            length={nodes.length}
                            colors={"#dddddd"}
                        />
                    ))}
                </g>
            </svg>
            <div>
                <Labels></Labels>
            </div>
        </div>
    );

    function Labels(){
        let labels = Array(...document.querySelectorAll("text"))
        let attrs = ( labels.reduce(
            (group, label) => {
                let x_axis = label.getAttribute("x")
                group[x_axis] = label
                return group
            }, {}
        ))
        console.log("HERE", attrs)
        if(Object.keys(attrs).length === 0 ) return <div></div>

        let final_labels = []
        for (let group in attrs){
            final_labels.push(<div>group[3].innerHTML</div>)
            console.log(final_labels)
        }
        console.log(attrs)
        return <div style={{"display":"flex", "fontSize": "100px" }}><div>hii</div>{final_labels
        }</div>
    }

    /*
    console.log(sankey.sankey())
    if(sankeyRef.current != null)
    d3.select(sankeyRef.current).append("g").selectAll("path").data(sankeyData.links).join("path").attr("d",sankey.sankeyLinkHorizontal())

       return <svg id={"sankey"} ref={sankeyRef}></svg>
       */
}