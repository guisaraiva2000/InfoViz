
import Plotly from "plotly.js"

function ScatterComponent(props){
    let is3D = useState(true)
    let plotSpace = useRef()

    Plotly.newPlot()

    return  <div ref={plotSpace}></div>

    /*<div>{
       is3D ? <TreeD_Scatter points={props.points}></TreeD_Scatter> :
           <TwoD_Scatter></TwoD_Scatter>   } </div>

     */

}

export default ScatterComponent;
