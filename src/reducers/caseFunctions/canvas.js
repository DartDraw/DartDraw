import { addRectangle, addLine, removeShape, resizeShape, moveLineAnchor } from '../utilities/shapes';
import { selectShape, updateSelectionBoxes } from '../utilities/selection';
import { addMarqueeBox, resizeMarqueeBox } from '../utilities/marquee';
import { pan, zoomTo } from '../caseFunctions/zoom';

export function dragStart(stateCopy, action, root) {
    stateCopy.editInProgress = true;
    stateCopy.lastSavedShapes = root.drawingState.shapes;
    switch (root.menuState.toolType) {
        case "rectangleTool":
            stateCopy.shapes = addRectangle(stateCopy.shapes, action, root.menuState.color, stateCopy.panX, stateCopy.panY, stateCopy.scale);
            let shapeIds = stateCopy.shapes.allIds;
            let addedShapeId = shapeIds[shapeIds.length - 1];
            stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            break;
        case "lineTool":
            stateCopy.shapes = addLine(stateCopy.shapes, action, root.menuState.color, stateCopy.panX, stateCopy.panY, stateCopy.scale);
            shapeIds = stateCopy.shapes.allIds;
            addedShapeId = shapeIds[shapeIds.length - 1];
            stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            break;
        case "selectTool":
            stateCopy.selected = selectShape([], null);
            break;
        case "zoomTool":
            stateCopy.marqueeBox = addMarqueeBox(action, stateCopy.panX, stateCopy.panY, stateCopy.scale);
            break;
        default: break;
    }
    return stateCopy;
}

export function drag(stateCopy, action, root) {
    const { draggableData } = action.payload;
    switch (root.menuState.toolType) {
        case "rectangleTool":
            stateCopy.shapes = resizeShape(stateCopy.shapes, stateCopy.boundingBoxes, stateCopy.selected, draggableData, 1, stateCopy.scale);
            break;
        case "lineTool":
            stateCopy.shapes = moveLineAnchor(stateCopy.shapes, stateCopy.selected, draggableData, stateCopy.scale);
            break;
        case "panTool":
            const { panX, panY } = pan(stateCopy, draggableData);
            stateCopy.panX = panX;
            stateCopy.panY = panY;
            break;
        case "zoomTool":
            stateCopy.marqueeBox = resizeMarqueeBox(stateCopy.marqueeBox, draggableData, stateCopy.scale);
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
            if (Math.abs(stateCopy.shapes.byId[addedShapeId].width) < 1 ||
                Math.abs(stateCopy.shapes.byId[addedShapeId].height) < 1) {
                stateCopy.shapes = removeShape(stateCopy.shapes, addedShapeId);
                stateCopy.selected = selectShape([], null);
            }
            break;
        case "lineTool":
            shapeIds = stateCopy.shapes.allIds;
            addedShapeId = shapeIds[shapeIds.length - 1];
            let line = stateCopy.shapes.byId[addedShapeId];
            if (line.x1 === line.x2 && line.y1 === line.y2) {
                stateCopy.shapes = removeShape(stateCopy.shapes, addedShapeId);
                stateCopy.selected = selectShape([], null);
            }
            break;
        case "zoomTool":
            if (stateCopy.marqueeBox.width !== 0 || stateCopy.marqueeBox.height !== 0) {
                const { panX, panY, scale } = zoomTo(stateCopy.marqueeBox, stateCopy.canvasWidth, stateCopy.canvasHeight);
                stateCopy.panX = panX;
                stateCopy.panY = panY;
                stateCopy.scale = scale;
            }
            stateCopy.marqueeBox = null;
            break;
        default:
            break;
    }
    stateCopy.editInProgress = false;
    return stateCopy;
}

export function handleBoundingBoxUpdate(stateCopy, action, root) {
    const { boundingBoxes } = action.payload;
    stateCopy.boundingBoxes = boundingBoxes;
    stateCopy.selectionBoxes = updateSelectionBoxes(stateCopy.selected, stateCopy.shapes, stateCopy.selectionBoxes, stateCopy.boundingBoxes);
    return stateCopy;
}
