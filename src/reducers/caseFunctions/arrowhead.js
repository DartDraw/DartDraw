import { reshape, setArrowheadType } from '../utilities/arrowhead';

export function arrowheadHandleDragStart(stateCopy, action, root) {
    console.log("dragStart");
    return stateCopy;
}

export function arrowheadHandleDrag(stateCopy, action, root) {
    console.log("dragging");

    const { draggableData, handleIndex } = action.payload;

    stateCopy.currentArrowhead = reshape(stateCopy.currentArrowhead, draggableData, handleIndex);

    return stateCopy;
}

export function arrowheadHandleDragStop(stateCopy, action, root) {
    console.log("dragStop");
    return stateCopy;
}

export function changeArrowheadType(stateCopy, action, root) {
    const { arrowheadType } = action.payload;

    stateCopy.currentArrowhead = setArrowheadType(arrowheadType);

    return stateCopy;
}

export function editArrowhead(stateCopy, action, root) {
    stateCopy.currentArrowhead = action.payload.arrowhead;
    return stateCopy;
}
