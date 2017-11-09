import { addRectangle, addEllipse, addLine, removeShape, resizeShape, moveLineAnchor } from '../utilities/shapes';
import { selectShape, updateSelectionBoxes } from '../utilities/selection';
import { transformPoint } from '../utilities/matrix';
import { addMarqueeBox, resizeMarqueeBox } from '../utilities/marquee';
import { pan, zoomToMarqueeBox } from '../caseFunctions/zoom';

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
        case "ellipseTool":
            stateCopy.shapes = addEllipse(stateCopy.shapes, action, root.menuState.color, stateCopy.panX, stateCopy.panY, stateCopy.scale);
            shapeIds = stateCopy.shapes.allIds;
            addedShapeId = shapeIds[shapeIds.length - 1];
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
        case "ellipseTool":
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
        case "ellipseTool":
        case "lineTool":
            const shapeIds = stateCopy.shapes.allIds;
            const addedShapeId = shapeIds[shapeIds.length - 1];
            const addedShape = stateCopy.shapes.byId[addedShapeId];
            const addedShapeBoundingBox = stateCopy.boundingBoxes[addedShapeId];
            const { x, y, width, height } = addedShapeBoundingBox;
            const transformedBoundingBox = {};
            transformedBoundingBox.width = transformPoint(x + width, y, addedShape.transform[0].parameters).x - x;
            transformedBoundingBox.height = transformPoint(x, y + height, addedShape.transform[0].parameters).y - y;

            if (Math.abs(transformedBoundingBox.width) <= 1 ||
                Math.abs(transformedBoundingBox.height) <= 1) {
                stateCopy.shapes = removeShape(stateCopy.shapes, addedShapeId);
            }
            stateCopy.selected = [];
            break;
        case "zoomTool":
            if (stateCopy.marqueeBox.width !== 0 || stateCopy.marqueeBox.height !== 0) {
                const { panX, panY, scale } = zoomToMarqueeBox(stateCopy.marqueeBox, stateCopy.canvasWidth, stateCopy.canvasHeight);
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

export function canvasColorChange(stateCopy, action, root) {
    const { color } = action.payload;
    stateCopy.canvasFill = color;
    return stateCopy;
}
