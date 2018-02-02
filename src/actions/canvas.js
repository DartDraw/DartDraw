export const CANVAS_DRAG = 'CANVAS_DRAG';
export const CANVAS_DRAG_START = 'CANVAS_DRAG_START';
export const CANVAS_DRAG_STOP = 'CANVAS_DRAG_STOP';
export const SHAPE_DRAG_START = 'SHAPE_DRAG_START';
export const SHAPE_DRAG = 'SHAPE_DRAG';
export const SHAPE_DRAG_STOP = 'SHAPE_DRAG_STOP';
export const SHAPE_CLICK = 'SHAPE_CLICK';
export const GROUP_DRAG_START = 'GROUP_DRAG_START';
export const GROUP_DRAG = 'GROUP_DRAG';
export const GROUP_DRAG_STOP = 'GROUP_DRAG_STOP';
export const GROUP_CLICK = 'GROUP_CLICK';
export const HANDLE_DRAG_START = 'HANDLE_DRAG_START';
export const HANDLE_DRAG = 'HANDLE_DRAG';
export const HANDLE_DRAG_STOP = 'HANDLE_DRAG_STOP';
export const ADD_POINT_DRAG_STOP = 'ADD_POINT_DRAG_STOP';
export const CONTROL_DRAG_START = 'CONTROL_DRAG_START';
export const CONTROL_DRAG = 'CONTROL_DRAG';
export const CONTROL_DRAG_STOP = 'CONTROL_DRAG_STOP';
export const TEXT_INPUT_CHANGE = 'TEXT__INPUT_CHANGE';
export const UPDATE_BOUNDING_BOXES = 'UPDATE_BOUNDING_BOXES';

export function canvasDrag(draggableData) {
    return { type: CANVAS_DRAG, payload: { draggableData } };
}

export function canvasDragStart(draggableData) {
    return { type: CANVAS_DRAG_START, payload: { draggableData } };
}

export function canvasDragStop() {
    return { type: CANVAS_DRAG_STOP };
}

export function shapeDragStart(shapeId, draggableData) {
    return { type: SHAPE_DRAG_START, payload: { shapeId, draggableData } };
}

export function shapeDrag(shapeId, draggableData) {
    return { type: SHAPE_DRAG, payload: { shapeId, draggableData } };
}

export function shapeDragStop(shapeId) {
    return { type: SHAPE_DRAG_STOP, payload: { shapeId } };
}

export function shapeClick(shapeId) {
    return { type: SHAPE_CLICK, payload: { shapeId } };
}

export function groupDragStart(shapeId, draggableData) {
    return { type: GROUP_DRAG_START, payload: { shapeId, draggableData } };
}

export function groupDrag(shapeId, draggableData) {
    return { type: GROUP_DRAG, payload: { shapeId, draggableData } };
}

export function groupDragStop(shapeId, draggableData) {
    return { type: GROUP_DRAG_STOP, payload: { shapeId, draggableData } };
}

export function groupClick(shapeId, event) {
    return { type: GROUP_CLICK, payload: { shapeId } };
}

export function handleDragStart(shapeId, handleIndex, draggableData) {
    return { type: HANDLE_DRAG_START, payload: { shapeId, handleIndex, draggableData } };
}

export function handleDrag(shapeId, handleIndex, draggableData) {
    return { type: HANDLE_DRAG, payload: { shapeId, handleIndex, draggableData } };
}

export function handleDragStop(shapeId, handleIndex, draggableData) {
    return { type: HANDLE_DRAG_STOP, payload: { shapeId, handleIndex, draggableData } };
}

export function controlDragStart(shapeId, handleIndex, draggableData) {
    return { type: CONTROL_DRAG_START, payload: { shapeId, handleIndex, draggableData } };
}

export function controlDrag(shapeId, handleIndex, draggableData) {
    return { type: CONTROL_DRAG, payload: { shapeId, handleIndex, draggableData } };
}

export function controlDragStop(shapeId, handleIndex, draggableData) {
    return { type: CONTROL_DRAG_STOP, payload: { shapeId, handleIndex, draggableData } };
}

export function addPointDragStop(shapeId, handleIndex, draggableData) {
    return { type: ADD_POINT_DRAG_STOP, payload: { shapeId, handleIndex, draggableData } };
}

export function textInputChange(shapeId, value, focused, selectionRange) {
    return { type: TEXT_INPUT_CHANGE, payload: { shapeId, value, focused, selectionRange } };
}

export function updateBoundingBoxes(boundingBoxes) {
    return { type: UPDATE_BOUNDING_BOXES, payload: { boundingBoxes } };
}
