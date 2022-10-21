import {useLayoutEffect, useState} from "react";

import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";

export function SortableItem(props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {props.children}
        </div>
    );
}

interface LabelsProps {
    label_names :string[],
    setLabels: (any) => null
}

export  default function Labels(props : LabelsProps) {
    let labels = props.label_names.map( (v,i) => Object.create({"id":i }))

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    let handleDragEnd;
    return <div id={"sankeylabels"} style={{"display": "flex"}}>
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            {labels.map(
                attr => <SortableItem style={{fontSize: "12px"}}>{attr}</SortableItem>
            )}
        </DndContext>
    </div>
    //if (labels == null) return <div>Loading labels</div>

    let final_labels = []
    let i = 0
    console.log("Labels",labels)
    for (let group of Object.values(labels)) {
        console.log(group)
        let t = group.innerHTML.split(" ")
        t.pop()
        t.pop()
        final_labels.push(<div key={i}>{t.join(" ")}</div>)
        i++
        console.log(final_labels)
    }
}
