import {useEffect, useState} from "react";

export default function useSize(initial_state, ref) {
    const [size, setSize] = useState(initial_state)
    useEffect(
        () => {
            let r = ref.current
            if (r == null || r == undefined) return
            let dim = r.getBoundingClientRect()
            setSize({width: dim.width, height: dim.height})
            console.log("R CURRNT",r.current)
            r.getElementsByTagName("svg")[0].setAttributeNS(null,"width",  dim.width)
            r.getElementsByTagName("svg")[0].setAttributeNS(null,"height",dim.height)
        }
        , [ref.current]
    )
    return [size, setSize]
}
