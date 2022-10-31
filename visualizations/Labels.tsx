import {useLayoutEffect, useState} from "react";

import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {render} from "react-dom";

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
        <div className={"inter"} ref={setNodeRef} style={{...style, ...props.style}} {...attributes} {...listeners}>
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
    let [items, setItems] = useState(props.label_names)
    if(props.label_names != items) setItems(props.label_names) // the library has to handle the change of values!

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    console.log("items",items)

    function handleDragEnd(event) {
        const {active, over} = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                let new_items =   arrayMove(items, oldIndex, newIndex);
                props.onLabelChange(new_items)
                return new_items
            });
        }
    }
    return <div className={"sankeylabels"} style={{ display: "flex", width: "100%",fontSize: "13px", justifyContent: "space-between"}}>
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items}
                strategy={horizontalListSortingStrategy}
            >
                {items.map(
                    attr => <SortableItem key={attr} id={attr} style={{fontSize: "15px", display: "flex", width: "50px"}}>{attr}</SortableItem>
                )}
            </SortableContext>
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
