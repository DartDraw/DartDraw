import jsondiffpatch from 'jsondiffpatch';
import * as selection from './selection';

export function undo(state) {
    const updatedState = Object.assign({}, state);

    updatedState.past = updatedState.past.slice();
    const delta = updatedState.past.pop();

    if (typeof (delta) !== 'undefined') {
        const newState = jsondiffpatch.create().unpatch(updatedState, delta);
        updatedState.drawing = newState.drawing;
        updatedState.zIndexedShapeIds = newState.zIndexedShapeIds;

        updatedState.future = updatedState.future.slice();
        updatedState.future.push(delta);

        updatedState.selected = [];
        if ((updatedState.past.length) > 0) {
            updatedState.selected = Object.keys(updatedState.past[updatedState.past.length - 1].drawing);
        }

        updatedState.selectionBoxes = selection.generateSelectionBoxes(updatedState);
    }

    return updatedState;
}

export function redo(state) {
    const updatedState = Object.assign({}, state);

    updatedState.future = updatedState.future.slice();
    const delta = updatedState.future.pop();

    if (typeof (delta) !== 'undefined') {
        const newState = jsondiffpatch.create().patch(updatedState, delta);
        updatedState.drawing = newState.drawing;
        updatedState.zIndexedShapeIds = newState.zIndexedShapeIds;

        updatedState.past = updatedState.past.slice();
        updatedState.past.push(delta);

        updatedState.selected = Object.keys(delta.drawing);
        updatedState.selectionBoxes = selection.generateSelectionBoxes(updatedState);
    }

    return updatedState;
}
