export const ADD_SHAPE = 'ADD_SHAPE';
export const UNDO = 'UNDO';
export const REDO = 'REDO';
export const SELECT = 'SELECT';

export function addShape(shape) {
    return { type: ADD_SHAPE, shape };
}

export function undo(shape) {
    return { type: UNDO, shape };
}

export function redo() {
    return { type: REDO };
}

export function select(id) {
    return { type: ADD_SHAPE, id };
}
