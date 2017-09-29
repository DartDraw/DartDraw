export const UNDO_CLICK = 'UNDO_CLICK';
export const REDO_CLICK = 'REDO_CLICK';
export const SELECT = 'SELECT';

export function undoClick(shape) {
    return { type: UNDO_CLICK, shape };
}

export function redoClick() {
    return { type: REDO_CLICK };
}

export function select(id) {
    return { type: SELECT, id };
}

export const CANVAS_DRAG = 'CANVAS_DRAG';
export const CANVAS_DRAG_START = 'CANVAS_DRAG_START';
export const CANVAS_DRAG_STOP = 'CANVAS_DRAG_STOP';
export const SHAPE_DRAG = 'SHAPE_DRAG';
export const SHAPE_DRAG_STOP = 'SHAPE_DRAG_STOP';

export function canvasDrag(shape) {
    return { type: CANVAS_DRAG, shape };
}

export function canvasDragStart(shape) {
    return { type: CANVAS_DRAG_START, shape };
}

export function canvasDragStop() {
    return { type: CANVAS_DRAG_STOP };
}

export function shapeDrag(shapeId, draggableData) {
    return { type: SHAPE_DRAG, payload: { shapeId, draggableData } };
}

export function shapeDragStop(shapeId) {
    return { type: SHAPE_DRAG_STOP, payload: { shapeId } };
}
