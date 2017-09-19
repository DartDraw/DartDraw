import * as actions from './actions';
import jsondiffpatch from 'jsondiffpatch'

const initialState = {
    drawing: {},
    zIndexedShapeIds: [],
    nextShapeId: 0, // replace with guid
    past: [],
    future: []
};

function DartDraw(state = initialState, action) {
    switch (action.type) {
        case actions.ADD_SHAPE: {

            // Create a copy of the drawing and then add the new shape:
            const currentState = Object.assign({}, state);
            const updatedState = Object.assign({}, state);
            action.shape.id = currentState.nextShapeId;
            updatedState.drawing[currentState.nextShapeId] = action.shape;

            // add the new shape:
            updatedState.zIndexedShapeIds = updatedState.zIndexedShapeIds.slice();
            updatedState.zIndexedShapeIds.push(currentState.nextShapeId);
            updatedState.nextShapeId = currentState.nextShapeId + 1

            // get the diff
            const delta = jsondiffpatch.create().diff(currentState, updatedState);

            updatedState.past = updatedState.past.slice();
            updatedState.past.push(delta);

            return updatedState;
        }
        case actions.UNDO:
          const updatedState = Object.assign({}, state);

          updatedState.past = updatedState.past.slice();
          const delta = updatedState.past.pop();

          const newState = jsondiffpatch.create().unpatch(updatedState, delta)
          updatedState.drawing = newState.drawing;
          updatedState.zIndexedShapeIds = newState.zIndexedShapeIds
          updatedState.nextShapeId = newState.nextShapeId

          updatedState.future = updatedState.future.slice();
          updatedState.future.push(delta);

          return updatedState;
        default: {
            return state;
        }
    }
}

export default DartDraw;
