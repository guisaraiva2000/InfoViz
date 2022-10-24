import {useEffect, useState} from "react";

export default function useSize(initial_state, ref) {
    const [size, setSize] = useState(initial_state)
    useEffect(
        () => {
            let r = ref.current
            if (r == null) return
            setSize({width: size.width, height: r.getBoundingClientRect().height})
        }
        , [ref]
    )
    return [size, setSize]
}
