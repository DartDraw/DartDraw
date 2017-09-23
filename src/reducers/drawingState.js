import * as actions from './../actions/actions';
import * as selection from './functions/selection';
import * as undoredo from './functions/undoredo';
import jsondiffpatch from 'jsondiffpatch';
import guid from 'guid';

const initialState = {
    drawing: {},
    zIndexedShapeIds: [],
    past: [],
    future: []
};

function addShape(state, action) {
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

function DartDraw(state = initialState, action) {
    switch (action.type) {
        case actions.ADD_SHAPE:
            return addShape(state, action);
        case actions.UNDO:
            return undoredo.undo(state);
        case actions.REDO:
            return undoredo.redo(state);
        case actions.SELECT:
            return selection.select(state, action);
        default:
            return state;
    }
}

export default DartDraw;
