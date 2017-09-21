import guid from 'guid';

export function resizeShape(state, action) {
    // Create a copy of the drawing and then add the new shape:
    const updatedState = Object.assign({}, state);

    updatedState.drawing = Object.assign({}, state.drawing);

    const shape = Object.assign({}, state.drawing[state.selected[0]]);

    if (action.shape.moveDeltaX > 0) {
        shape.x = action.shape.mouseDownPositionX;
        shape.width = action.shape.moveDeltaX;
    } else {
        shape.x = action.shape.mouseDownPositionX + action.shape.moveDeltaX;
        shape.width = -action.shape.moveDeltaX;
    }

    if (action.shape.moveDeltaY > 0) {
        shape.y = action.shape.mouseDownPositionY;
        shape.height = action.shape.moveDeltaY;
    } else {
        shape.y = action.shape.mouseDownPositionY + action.shape.moveDeltaY;
        shape.height = -action.shape.moveDeltaY;
    }

    updatedState.drawing[state.selected[0]] = shape;

    return updatedState;
}

function createSquare(shape) {
    const newShape = {};
    newShape.id = guid.create();
    newShape.x = shape.x;
    newShape.y = shape.y;
    newShape.width = 0;
    newShape.height = 0;
    return newShape;
}

export function addShape(state, action) {
    // Create a copy of the drawing and then add the new shape:
    const updatedState = Object.assign({}, state);

    const shape = createSquare(action.shape); // default to square for now

    updatedState.drawing = Object.assign({}, state.drawing);
    updatedState.drawing[shape.id] = shape;
    updatedState.selected = [shape.id];

    // add the new shape:
    updatedState.zIndexedShapeIds = updatedState.zIndexedShapeIds.slice();
    updatedState.zIndexedShapeIds.push(shape.id);

    return updatedState;
}

export function dragRelease(state) {
    return state;
}
