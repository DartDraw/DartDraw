import jsondiffpatch from 'jsondiffpatch';

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
    }

    return updatedState;
}
