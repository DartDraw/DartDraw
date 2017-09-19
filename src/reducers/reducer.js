import * as actions from './../actions/actions';
import jsondiffpatch from 'jsondiffpatch';

const initialState = {
    drawing: {},
    zIndexedShapeIds: [],
    nextShapeId: 0, // replace with guid
    past: [],
    future: []
};

function addShape(state, action) {
    // Create a copy of the drawing and then add the new shape:
    const currentState = Object.assign({}, state);
    const updatedState = Object.assign({}, state);
    action.shape.id = currentState.nextShapeId;
    updatedState.drawing[currentState.nextShapeId] = action.shape;

    // add the new shape:
    updatedState.zIndexedShapeIds = updatedState.zIndexedShapeIds.slice();
    updatedState.zIndexedShapeIds.push(currentState.nextShapeId);
    updatedState.nextShapeId = currentState.nextShapeId + 1;

    // get the diff
    const delta = jsondiffpatch.create().diff(currentState, updatedState);

    updatedState.future = [];
    updatedState.past = updatedState.past.slice();
    updatedState.past.push(delta);

    return updatedState;
}

function undo(state) {
    const updatedState = Object.assign({}, state);

    updatedState.past = updatedState.past.slice();
    const delta = updatedState.past.pop();

    const newState = jsondiffpatch.create().unpatch(updatedState, delta);
    updatedState.drawing = newState.drawing;
    updatedState.zIndexedShapeIds = newState.zIndexedShapeIds;
    updatedState.nextShapeId = newState.nextShapeId;

    updatedState.future = updatedState.future.slice();
    updatedState.future.push(delta);

    return updatedState;
}

function redo(state) {
    const updatedState = Object.assign({}, state);

    updatedState.future = updatedState.future.slice();
    const delta = updatedState.future.pop();

    const newState = jsondiffpatch.create().patch(updatedState, delta);
    updatedState.drawing = newState.drawing;
    updatedState.zIndexedShapeIds = newState.zIndexedShapeIds;
    updatedState.nextShapeId = newState.nextShapeId;

    updatedState.past = updatedState.past.slice();
    updatedState.past.push(delta);

    return updatedState;
}

function DartDraw(state = initialState, action) {
    switch (action.type) {
        case actions.ADD_SHAPE:
            return addShape(state, action);
        case actions.UNDO:
            return undo(state);
        case actions.REDO:
            return redo(state);
        default:
            return state;
    }
}

export default DartDraw;
