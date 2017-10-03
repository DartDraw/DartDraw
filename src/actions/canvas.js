export const CANVAS_DRAG = 'CANVAS_DRAG';
export const CANVAS_DRAG_START = 'CANVAS_DRAG_START';
export const CANVAS_DRAG_STOP = 'CANVAS_DRAG_STOP';
export const SHAPE_DRAG_START = 'SHAPE_DRAG_START';
export const SHAPE_DRAG = 'SHAPE_DRAG';
export const SHAPE_DRAG_STOP = 'SHAPE_DRAG_STOP';
export const HANDLE_DRAG_START = 'HANDLE_DRAG_START';
export const HANDLE_DRAG = 'HANDLE_DRAG';
export const HANDLE_DRAG_STOP = 'HANDLE_DRAG_STOP';

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

export function handleDragStart(shapeId, handleIndex, draggableData) {
    return { type: HANDLE_DRAG_START, payload: { shapeId, handleIndex, draggableData } };
}

export function handleDrag(shapeId, handleIndex, draggableData) {
    return { type: HANDLE_DRAG, payload: { shapeId, handleIndex, draggableData } };
}

export function handleDragStop(shapeId, handleIndex, draggableData) {
    return { type: HANDLE_DRAG_STOP, payload: { shapeId, handleIndex, draggableData } };
}
