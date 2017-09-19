export const ADD_SHAPE = 'ADD_SHAPE';
export const ADD_ACTION = 'ADD_ACTION';
export const UNDO = 'UNDO';
export const REDO = 'REDO';

export function addShape(shape) {
    return { type: ADD_SHAPE, shape };
}

export function undo(shape) {
    return { type: UNDO, shape };
}

export function redo() {
    return { type: REDO };
}
