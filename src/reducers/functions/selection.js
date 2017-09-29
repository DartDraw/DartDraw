import guid from 'guid';

export function selectTool(state, action) {
    const updatedState = Object.assign({}, state);
    updatedState.toolType = action.payload.toolType;
    return updatedState;
}

export function selectShape(state, action) {
    if (!action.payload.shapeId) { return state; }
    const updatedState = Object.assign({}, state);
    updatedState.selected = [action.payload.shapeId]; // just one selection for now
    updatedState.editing = {};
    updatedState.editing[action.payload.shapeId] = Object.assign({}, state.drawing[action.payload.shapeId]);

    updatedState.selectionBoxes = generateSelectionBoxes(updatedState);
    return updatedState;
}

export function generateSelectionBoxes(state) {
    const selectionBoxes = {};
    state.selected.map((id) => {
        const shape = state.drawing[id];
        selectionBoxes[id] = {
            id: guid.create().toString(),
            type: 'selectionBox',
            x: shape.x,
            y: shape.y,
            width: shape.width,
            height: shape.height
        };
    });
    return selectionBoxes;
}
