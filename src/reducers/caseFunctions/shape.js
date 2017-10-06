import { addShape, removeShape, resizeShape, moveShape } from '../utilities/shapes';
import { selectShape, generateSelectionBoxes, updateSelectionBoxes } from '../utilities/selection';

export function dragStart(stateCopy, action, root) {
    stateCopy.editInProgress = true;
    stateCopy.lastSavedShapes = root.drawingState.shapes;
    action.payload.draggableData.node = action.payload.draggableData.node.parentNode;
    switch (root.menuState.toolType) {
        case "rectangleTool":
            stateCopy.shapes = addShape(stateCopy.shapes, action);
            const shapeIds = stateCopy.shapes.allIds;
            const addedShapeId = shapeIds[shapeIds.length - 1];
            stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            stateCopy.selectionBoxes = generateSelectionBoxes(stateCopy.selected, stateCopy.shapes);
            break;
        case "selectTool":
            stateCopy.selected = selectShape(stateCopy.selected, action.payload.shapeId);
            stateCopy.selectionBoxes = generateSelectionBoxes(stateCopy.selected, stateCopy.shapes);
            break;
        default: break;
    }
    return stateCopy;
}

export function drag(stateCopy, action, root) {
    action.payload.draggableData.node = action.payload.draggableData.node.parentNode;
    switch (root.menuState.toolType) {
        case "rectangleTool":
            stateCopy.shapes = resizeShape(stateCopy.shapes, stateCopy.selected, action);
            stateCopy.selectionBoxes = updateSelectionBoxes(stateCopy.shapes, stateCopy.selectionBoxes);
            break;
        case "selectTool":
            stateCopy.shapes = moveShape(stateCopy.shapes, action);
            stateCopy.selectionBoxes = generateSelectionBoxes(stateCopy.selected, stateCopy.shapes);
            break;
        default: break;
    }
    return stateCopy;
}

export function dragStop(stateCopy, action, root) {
    switch (root.menuState.toolType) {
        case "rectangleTool":
            const shapeIds = stateCopy.shapes.allIds;
            const addedShapeId = shapeIds[shapeIds.length - 1];
            if (stateCopy.shapes.byId[addedShapeId].width < 1 ||
              stateCopy.shapes.byId[addedShapeId].height < 1) {
                stateCopy.shapes = removeShape(stateCopy.shapes, addedShapeId);
                stateCopy.selected = selectShape([], null);
                stateCopy.selectionBoxes = generateSelectionBoxes([], []);
            }
            break;
        default:
            break;
    }
    stateCopy.editInProgress = false;
    return stateCopy;
}
