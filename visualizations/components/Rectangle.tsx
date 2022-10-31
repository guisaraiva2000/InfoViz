
export default function Rect({index, x0, x1, y0, y1, name, size, strokeDasharray, value, length, colors, currentStereotype}) {
    return (
        <>
            <g>
                <rect
                    x={x0}
                    y={y0 - 2.5}
                    width={x1 - x0}
                    height={5 + y1 - y0}
                    fill={"#dddddd"} //colors(index / length)}
                    data-index={index}
                    strokeDasharray={`0, ${5 - y1 - y0} ,${x1 - x0} `}
                    stroke={""}
                />
                <text
                    xmlSpace={"preserve"}
                    x={x0 < size.width / 2 ? x1 + 6 : x0 - 6}
                    y={(y1 + y0) / 2}
                    style={{
                        fill: "#dddddd",//d3.rgb(colors(index / length)).darker(),
                        alignmentBaseline: "middle",
                        fontSize: 14,
                        textShadow: " 2px 2px 3px black",
                        textAnchor: x0 < size.width / 2 ? "start" : "end",
                        zIndex: 1330,
                    }}
                >
                    {name}
                </text>
            </g>
        </>
    );
};
