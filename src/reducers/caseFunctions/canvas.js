import { addRectangle, addLine, removeShape, resizeShape, moveLineAnchor, removeNegatives } from '../utilities/shapes';
import { selectShape, generateSelectionBoxes, updateSelectionBoxes } from '../utilities/selection';
import { pan, addZoomShape, resizeZoomShape, zoomTo } from '../utilities/zoom';

export function dragStart(stateCopy, action, root) {
    stateCopy.editInProgress = true;
    stateCopy.lastSavedShapes = root.drawingState.shapes;
    switch (root.menuState.toolType) {
        case "rectangleTool":
            stateCopy.shapes = addRectangle(stateCopy.shapes, action, root.menuState.color, stateCopy.canvasTransformationMatrix);
            let shapeIds = stateCopy.shapes.allIds;
            let addedShapeId = shapeIds[shapeIds.length - 1];
            stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            stateCopy.selectionBoxes = generateSelectionBoxes(stateCopy.selected, stateCopy.shapes);
            break;
        case "lineTool":
            stateCopy.shapes = addLine(stateCopy.shapes, action, root.menuState.color, stateCopy.canvasTransformationMatrix);
            shapeIds = stateCopy.shapes.allIds;
            addedShapeId = shapeIds[shapeIds.length - 1];
            stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            stateCopy.selectionBoxes = generateSelectionBoxes(stateCopy.selected, stateCopy.shapes);
            break;
        case "selectTool":
            stateCopy.selected = selectShape([], null);
            stateCopy.selectionBoxes = generateSelectionBoxes([], []);
            break;
        case "zoomTool":
            stateCopy.zoomShape = addZoomShape(stateCopy.zoomShape, action, stateCopy.canvasTransformationMatrix);
            break;
        default: break;
    }
    return stateCopy;
}

export function drag(stateCopy, action, root) {
    const { draggableData } = action.payload;
    switch (root.menuState.toolType) {
        case "rectangleTool":
            stateCopy.shapes = resizeShape(stateCopy.shapes, stateCopy.selected, draggableData, 1, stateCopy.canvasTransformationMatrix);
            stateCopy.selectionBoxes = updateSelectionBoxes(stateCopy.shapes, stateCopy.selectionBoxes);
            break;
        case "lineTool":
            stateCopy.shapes = moveLineAnchor(stateCopy.shapes, stateCopy.selected, draggableData, stateCopy.canvasTransformationMatrix);
            stateCopy.selectionBoxes = updateSelectionBoxes(stateCopy.shapes, stateCopy.selectionBoxes);
            break;
        case "panTool":
            stateCopy.canvasTransformationMatrix = pan(stateCopy.canvasTransformationMatrix, draggableData);
            break;
        case "zoomTool":
            stateCopy.zoomShape = resizeZoomShape(stateCopy.zoomShape, draggableData, stateCopy.canvasTransformationMatrix);
            break;
        default: break;
    }
    return stateCopy;
}

export function dragStop(stateCopy, action, root) {
    switch (root.menuState.toolType) {
        case "rectangleTool":
            let shapeIds = stateCopy.shapes.allIds;
            let addedShapeId = shapeIds[shapeIds.length - 1];
            if (Math.abs(stateCopy.shapes.byId[addedShapeId].width) === 0 ||
                Math.abs(stateCopy.shapes.byId[addedShapeId].height) === 0) {
                stateCopy.shapes = removeShape(stateCopy.shapes, addedShapeId);
                stateCopy.selected = selectShape([], null);
                stateCopy.selectionBoxes = generateSelectionBoxes([], []);
            }
            stateCopy.shapes = removeNegatives(stateCopy.shapes, stateCopy.selected);
            stateCopy.selectionBoxes = updateSelectionBoxes(stateCopy.shapes, stateCopy.selectionBoxes);

            break;
        case "lineTool":
            shapeIds = stateCopy.shapes.allIds;
            addedShapeId = shapeIds[shapeIds.length - 1];
            let line = stateCopy.shapes.byId[addedShapeId];
            if (line.x1 === line.x2 && line.y1 === line.y2) {
                stateCopy.shapes = removeShape(stateCopy.shapes, addedShapeId);
                stateCopy.selected = selectShape([], null);
                stateCopy.selectionBoxes = generateSelectionBoxes([], []);
            }
            stateCopy.selectionBoxes = updateSelectionBoxes(stateCopy.shapes, stateCopy.selectionBoxes);
            break;
        case "zoomTool":
            if (stateCopy.zoomShape.width !== 0 || stateCopy.zoomShape.height !== 0) {
                stateCopy.canvasTransformationMatrix = zoomTo(stateCopy.zoomShape, stateCopy.canvasWidth, stateCopy.canvasHeight);
            }
            stateCopy.zoomShape = null;
            break;
        default:
            break;
    }
    stateCopy.editInProgress = false;
    return stateCopy;
}
