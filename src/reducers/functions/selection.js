export function selectTool(state, action) {
    const updatedState = Object.assign({}, state);
    updatedState.toolType = action.payload.toolType;
    return updatedState;
}

export function selectShape(state, action) {
    const updatedState = Object.assign({}, state);
    updatedState.selected = [action.payload.shapeId]; // just one selection for now
    updatedState.editing = {};
    updatedState.editing[action.payload.shapeId] = Object.assign({}, state.drawing[action.payload.shapeId]);
    return updatedState;
}
