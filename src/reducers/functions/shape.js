import guid from 'guid';
import jsondiffpatch from 'jsondiffpatch';

export function resizeShape(state, action) {
    // Create a copy of the drawing and then add the new shape:
    const updatedState = Object.assign({}, state);

    updatedState.drawing = Object.assign({}, state.drawing);

    const shape = Object.assign({}, state.drawing[state.selected[0]]);
    const mouseX = action.shape.x - action.shape.node.getBoundingClientRect().left;
    const mouseY = action.shape.y - action.shape.node.getBoundingClientRect().top;

    if (mouseX > shape.originX) {
        shape.x = shape.originX;
        shape.width = mouseX - shape.x;
    } else if (mouseX < shape.originX) {
        shape.x = mouseX;
        shape.width = shape.originX - mouseX;
    }

    if (mouseY > shape.originY) {
        shape.y = shape.originY;
        shape.height = mouseY - shape.y;
    } else if (mouseY < shape.originY) {
        shape.y = mouseY;
        shape.height = shape.originY - mouseY;
    }

    updatedState.drawing[state.selected[0]] = shape;

    return updatedState;
}

function createSquare(shape) {
    const x = shape.x - shape.node.getBoundingClientRect().left;
    const y = shape.y - shape.node.getBoundingClientRect().top;
    const newShape = {};
    newShape.id = guid.create();
    newShape.originX = x;
    newShape.originY = y;
    newShape.x = x;
    newShape.y = y;
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
    const updatedState = Object.assign({}, state);

    const oldState = Object.assign({}, state);
    oldState.drawing = Object.assign({}, state.drawing);
    oldState.zIndexedShapeIds = state.zIndexedShapeIds.slice();

    state.selected.forEach(function(id) {
        if (typeof (state.editing[id]) !== 'undefined') {
            oldState.drawing[id] = state.editing[id];
        } else {
            delete oldState.drawing[id];
            const index = oldState.zIndexedShapeIds.indexOf(id);
            oldState.zIndexedShapeIds.splice(index, 1);
        }
    });

    const delta = jsondiffpatch.create().diff(oldState, updatedState);
    updatedState.future = [];
    updatedState.past = updatedState.past.slice();
    updatedState.past.push(delta);

    return updatedState;
}
