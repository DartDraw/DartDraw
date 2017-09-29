import * as shape from './shape';
import * as selection from './selection';

export function start(state, action) {
    if (action.type === 'SHAPE_DRAG_START') {
        action.payload.draggableData.node = action.payload.draggableData.node.parentNode;
    }
    switch (state.toolType) {
        case "rectangleTool":
            return shape.addShape(state, action);
        case "selectTool":
            return selection.selectShape(state, action);
        default:
            return state;
    }
}

export function drag(state, action) {
    if (action.type === 'SHAPE_DRAG') {
        action.payload.draggableData.node = action.payload.draggableData.node.parentNode;
    }
    switch (state.toolType) {
        case "rectangleTool":
            return shape.resizeShape(state, action);
        case "selectTool":
            return shape.moveShape(state, action);
        default:
            return state;
    }
}

export function stop(state, action) {
    switch (state.toolType) {
        case "rectangleTool":
            return shape.saveNewShape(state, action);
        case "selectTool":
            return shape.saveShapeMove(state, action);
        default:
            return state;
    }
}
