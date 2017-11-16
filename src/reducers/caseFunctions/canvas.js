import { addRectangle, addEllipse, addPolygon, addPolygonPoint, addLine, addArc, addText, removeShape, resizeShape, moveLineAnchor, moveArcAnchor, resizeTextBoundingBox } from '../utilities/shapes';
import { selectShape, selectShapes, updateSelectionBoxes, updateSelectionBoxesCorners, updateTextInputs } from '../utilities/selection';
import { transformPoint } from '../utilities/matrix';
import { addMarqueeBox, resizeMarqueeBox } from '../utilities/marquee';
import { pan, zoomToMarqueeBox } from '../caseFunctions/zoom';

export function dragStart(stateCopy, action, root) {
    const prevEditState = stateCopy.editInProgress;
    stateCopy.editInProgress = true;
    stateCopy.lastSavedShapes = root.drawingState.shapes;
    switch (root.menuState.toolType) {
        case "rectangleTool":
            stateCopy.shapes = addRectangle(stateCopy.shapes, action, root.menuState.color,
                stateCopy.panX, stateCopy.panY, stateCopy.scale, root.menuState.gridSnapping, root.menuState.minorGrid);
            let shapeIds = stateCopy.shapes.allIds;
            let addedShapeId = shapeIds[shapeIds.length - 1];
            stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            break;
        case "ellipseTool":
            stateCopy.shapes = addEllipse(stateCopy.shapes, action, root.menuState.color,
                stateCopy.panX, stateCopy.panY, stateCopy.scale, root.menuState.gridSnapping, root.menuState.minorGrid);
            shapeIds = stateCopy.shapes.allIds;
            addedShapeId = shapeIds[shapeIds.length - 1];
            stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            break;
        case "polygonTool":
            if (!prevEditState) {
                stateCopy.shapes = addPolygon(stateCopy.shapes, action, root.menuState.color,
                    stateCopy.panX, stateCopy.panY, stateCopy.scale, root.menuState.gridSnapping, root.menuState.minorGrid);
                shapeIds = stateCopy.shapes.allIds;
                addedShapeId = shapeIds[shapeIds.length - 1];
                stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            } else {
                stateCopy.shapes = addPolygonPoint(stateCopy.shapes, stateCopy.selected, action, stateCopy.panX, stateCopy.panY, stateCopy.scale, root.menuState.gridSnapping, root.menuState.minorGrid);
            }
            break;
        case "lineTool":
            stateCopy.shapes = addLine(stateCopy.shapes, action, root.menuState.color, stateCopy.panX, stateCopy.panY,
                stateCopy.scale, root.menuState.gridSnapping, root.menuState.minorGrid);
            shapeIds = stateCopy.shapes.allIds;
            addedShapeId = shapeIds[shapeIds.length - 1];
            stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            break;
        case "arcTool":
            stateCopy.shapes = addArc(stateCopy.shapes, action, root.menuState.color, stateCopy.panX, stateCopy.panY,
                stateCopy.scale, root.menuState.gridSnapping, root.menuState.minorGrid);
            shapeIds = stateCopy.shapes.allIds;
            addedShapeId = shapeIds[shapeIds.length - 1];
            stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            break;
        case "textTool":
            stateCopy.shapes = addText(stateCopy.shapes, action, root.menuState.color, stateCopy.panX, stateCopy.panY,
                stateCopy.scale, root.menuState.gridSnapping, root.menuState.minorGrid);
            shapeIds = stateCopy.shapes.allIds;
            addedShapeId = shapeIds[shapeIds.length - 1];
            stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            break;
        case "selectTool":
            stateCopy.selected = selectShape([], null);
            stateCopy.marqueeBox = addMarqueeBox(action, stateCopy.panX, stateCopy.panY, stateCopy.scale);
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
    let shiftSelected = 16 in root.menuState.currentKeys;
    switch (root.menuState.toolType) {
        case "rectangleTool":
            stateCopy.shapes = resizeShape(stateCopy.shapes, stateCopy.boundingBoxes,
                stateCopy.selected, draggableData, 1, stateCopy.panX, stateCopy.panY,
                stateCopy.scale, null, null, root.menuState.gridSnapping, root.menuState.minorGrid,
                shiftSelected, root.menuState.centeredControl);
            break;
        case "ellipseTool":
            stateCopy.shapes = resizeShape(stateCopy.shapes, stateCopy.boundingBoxes, stateCopy.selected,
                draggableData, 1, stateCopy.panX, stateCopy.panY, stateCopy.scale, null, null,
                root.menuState.gridSnapping, root.menuState.minorGrid, shiftSelected, root.menuState.centeredControl);
            break;
        case "lineTool":
            stateCopy.shapes = moveLineAnchor(stateCopy.shapes, stateCopy.selected, draggableData, stateCopy.panX, stateCopy.panY,
                stateCopy.scale, root.menuState.gridSnapping, root.menuState.minorGrid);
            break;
        case "arcTool":
            stateCopy.shapes = moveArcAnchor(stateCopy.shapes, stateCopy.selected, draggableData, stateCopy.panX, stateCopy.panY,
                stateCopy.scale, root.menuState.gridSnapping, root.menuState.minorGrid);
            break;
        case "textTool":
            stateCopy.shapes = resizeTextBoundingBox(stateCopy.shapes, stateCopy.selected, draggableData, 1, stateCopy.scale);
            break;
        case "panTool":
            const { panX, panY } = pan(stateCopy, draggableData);
            stateCopy.panX = panX;
            stateCopy.panY = panY;
            break;
        case "selectTool":
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

            // determine new shape width + height
            let shape = stateCopy.shapes.byId[addedShapeId];
            let transformedShape = {};
            transformedShape.width = transformPoint(shape.x + shape.width, shape.y, shape.transform[0].parameters).x - shape.x;
            transformedShape.height = transformPoint(shape.x, shape.y + shape.height, shape.transform[0].parameters).y - shape.y;

            // remove if <= 1
            if (Math.abs(transformedShape.width) <= 1 ||
                Math.abs(transformedShape.height) <= 1) {
                stateCopy.shapes = removeShape(stateCopy.shapes, addedShapeId);
            }
            stateCopy.selected = [];
            break;
        case "ellipseTool":
        case "lineTool":
            shapeIds = stateCopy.shapes.allIds;
            addedShapeId = shapeIds[shapeIds.length - 1];
            const addedShape = stateCopy.shapes.byId[addedShapeId];
            const addedShapeBoundingBox = stateCopy.boundingBoxes[addedShapeId];
            const { x, y, width, height } = addedShapeBoundingBox;
            const transformedBoundingBox = {};
            transformedBoundingBox.width = transformPoint(x + width, y, addedShape.transform[0].parameters).x - x;
            transformedBoundingBox.height = transformPoint(x, y + height, addedShape.transform[0].parameters).y - y;

            if (Math.abs(transformedBoundingBox.width) <= 1 &&
                Math.abs(transformedBoundingBox.height) <= 1) {
                stateCopy.shapes = removeShape(stateCopy.shapes, addedShapeId);
            }
            stateCopy.selected = [];
            break;
        case "selectTool":
            stateCopy.selected = selectShapes(stateCopy.shapes, stateCopy.boundingBoxes, stateCopy.marqueeBox);
            stateCopy.marqueeBox = null;
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

    if (root.menuState.toolType !== "polygonTool" || stateCopy.shapes.byId[stateCopy.selected[0]].type === "polygon") {
        stateCopy.editInProgress = false;
    }
    return stateCopy;
}

export function handleBoundingBoxUpdate(stateCopy, action, root) {
    const { boundingBoxes } = action.payload;
    stateCopy.boundingBoxes = boundingBoxes;
    stateCopy.selectionBoxes = updateSelectionBoxes(stateCopy.selected, stateCopy.shapes, stateCopy.selectionBoxes, stateCopy.boundingBoxes);
    stateCopy.selectionBoxes = updateSelectionBoxesCorners(stateCopy.selected, stateCopy.selectionBoxes);
    stateCopy.textInputs = updateTextInputs(stateCopy.selected, stateCopy.shapes, stateCopy.textInputs);
    return stateCopy;
}
