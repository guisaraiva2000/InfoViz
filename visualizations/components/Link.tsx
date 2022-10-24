import {sankeyLinkHorizontal} from "d3-sankey";
import {useContext} from "react";
import {Context} from "../Context";

export default function Link({data, width, length, colors, stroke, strokeOpacity, strokeWidth, stopColor}){
    const link = sankeyLinkHorizontal();
    let context = useContext(Context)
    let selectedStereotypes = context.state.currentStereotypes
    let currentKiller = context.state.currentKiller

    if (currentKiller === data.killerid) console.log("MMMMMMMMMMMMMMATCH")
    return <>
            <defs>
                <linearGradient
                    id={`gradient-${data.index}`
                    }
                    gradientUnits="userSpaceOnUse"
                    x1={data.source.x1}
                    x2={data.target.x0}
                >
                    <stop offset="0"
                          stopColor={
                              stopColor //colors(data.source.index / length)} />}
                          }></stop>
                    < stop
                        offset="100%"
                        stopColor={"red"}
                    />
                </linearGradient>
            </defs>
            < path
                data-killerid={data.killerid}
                data-stereotype={data.stereotype}

                d={link(data)}
                fill={"none"}
                stroke={stroke}
                strokeOpacity={strokeOpacity}
                strokeWidth={strokeWidth}
            />
        </>
}

