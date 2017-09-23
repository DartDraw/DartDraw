import jsondiffpatch from 'jsondiffpatch';
import guid from 'guid';

export function select(state, action) {
    // Create a copy of the drawing and then add the new shape:
    const updatedState = Object.assign({}, state);
    action.shape.id = guid.create();

    updatedState.drawing = Object.assign({}, state.drawing);
    updatedState.drawing[action.shape.id] = action.shape;

    // add the new shape:
    updatedState.zIndexedShapeIds = updatedState.zIndexedShapeIds.slice();
    updatedState.zIndexedShapeIds.push(action.shape.id);

    // get the diff
    const delta = jsondiffpatch.create().diff(state, updatedState);

    updatedState.future = [];
    updatedState.past = updatedState.past.slice();
    updatedState.past.push(delta);

    return updatedState;
}
