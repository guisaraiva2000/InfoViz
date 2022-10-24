import {useState} from "react";

function TestLoading() {
  let PlotComponent = useState(null)
  if (!PlotComponent) return <div id={"hi"}>Loading graphics....</div>

  return <div id={"hi"}><PlotComponent
    data={[
      {
        x: [1, 2, 3],
        y: [2, 6, 3],
        type: 'scatter',
        mode: 'lines+markers',
        marker: {color: 'red'},
      },
      {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
    ]}
    layout={{width: 320, height: 240, title: 'A Fancy Plot'}}
  /></div>
}
