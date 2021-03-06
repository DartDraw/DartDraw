import { addRectangle, addEllipse, addPolygon, addPolygonPoint, addTempPolygonPoint, addLine, addFreehandPath,
    addArc, addText, removeShape, resizeShape, moveLineAnchor, moveArcAnchor, addFreehandPathPoint,
    resizeTextBoundingBox, addBezier, addBezierPoint, addTempBezierPoint } from '../utilities/shapes';
import { selectShape, selectShapes, updateSelectionBoxes, updateSelectionBoxesCorners } from '../utilities/selection';
import { transformPoint } from '../utilities/matrix';
import { addMarqueeBox, resizeMarqueeBox } from '../utilities/marquee';
import { pan, zoomToMarqueeBox } from '../caseFunctions/zoom';
import { updateMouseTrackers } from '../utilities/rulers';

export function dragStart(stateCopy, action, root) {
    const prevEditState = stateCopy.editInProgress;
    if (root.menuState.toolType !== "polygonTool" && root.menuState.toolType !== "bezierTool") {
        stateCopy.lastSavedShapes = root.drawingState.shapes;
    }
    stateCopy.editInProgress = true;
    stateCopy.offset = { x: action.payload.draggableData.node.getBoundingClientRect().left, y: action.payload.draggableData.node.getBoundingClientRect().left };

    switch (root.menuState.toolType) {
        case "rectangleTool":
            stateCopy.shapes = addRectangle(stateCopy.shapes, action, root.menuState.fillColor,
                root.menuState.strokeColor, stateCopy.panX, stateCopy.panY, stateCopy.scale, root.menuState.gridSnapping,
                stateCopy.gridSnapInterval, {x: 0, y: 0});
            let shapeIds = stateCopy.shapes.allIds;
            let addedShapeId = shapeIds[shapeIds.length - 1];
            stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            break;
        case "roundedRectangleTool":
            stateCopy.shapes = addRectangle(stateCopy.shapes, action, root.menuState.fillColor,
                root.menuState.strokeColor, stateCopy.panX, stateCopy.panY, stateCopy.scale, root.menuState.gridSnapping,
                stateCopy.gridSnapInterval, root.menuState.rectangleRadius);
            shapeIds = stateCopy.shapes.allIds;
            addedShapeId = shapeIds[shapeIds.length - 1];
            stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            break;
        case "ellipseTool":
            stateCopy.shapes = addEllipse(stateCopy.shapes, action, root.menuState.fillColor,
                root.menuState.strokeColor, stateCopy.panX, stateCopy.panY, stateCopy.scale, root.menuState.gridSnapping, stateCopy.gridSnapInterval);
            shapeIds = stateCopy.shapes.allIds;
            addedShapeId = shapeIds[shapeIds.length - 1];
            stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            break;
        case "polygonTool":
            stateCopy.offset = { x: action.payload.draggableData.node.getBoundingClientRect().left, y: action.payload.draggableData.node.getBoundingClientRect().left };
            if (!prevEditState) {
                stateCopy.mode = 'reshape';
                stateCopy.lastSavedShapes = root.drawingState.shapes;
                stateCopy.shapes = addPolygon(stateCopy.shapes, action, root.menuState.fillColor,
                    root.menuState.strokeColor, stateCopy.panX, stateCopy.panY, stateCopy.scale, root.menuState.gridSnapping, stateCopy.gridSnapInterval);
                shapeIds = stateCopy.shapes.allIds;
                addedShapeId = shapeIds[shapeIds.length - 1];
                stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            } else {
                stateCopy.shapes = addPolygonPoint(stateCopy.shapes, stateCopy.selected, action, stateCopy.panX, stateCopy.panY, stateCopy.scale, root.menuState.gridSnapping, stateCopy.gridSnapInterval);
                if (stateCopy.shapes.byId[stateCopy.selected[0]].type === "polygon" ||
                  stateCopy.shapes.byId[stateCopy.selected[0]].open) {
                    stateCopy.mode = '';
                    stateCopy.selected = [];
                    stateCopy.editInProgress = false;
                }
            }
            break;
        case "bezierTool":
            stateCopy.offset = { x: action.payload.draggableData.node.getBoundingClientRect().left, y: action.payload.draggableData.node.getBoundingClientRect().left };
            if (!prevEditState) {
                stateCopy.mode = 'reshape';
                stateCopy.lastSavedShapes = root.drawingState.shapes;
                stateCopy.shapes = addBezier(stateCopy.shapes, action, root.menuState.fillColor,
                    root.menuState.strokeColor, stateCopy.panX, stateCopy.panY, stateCopy.scale, root.menuState.gridSnapping, stateCopy.gridSnapInterval);
                shapeIds = stateCopy.shapes.allIds;
                addedShapeId = shapeIds[shapeIds.length - 1];
                stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            } else {
                stateCopy.shapes = addBezierPoint(stateCopy.shapes, stateCopy.selected, action, stateCopy.panX, stateCopy.panY, stateCopy.scale, root.menuState.gridSnapping, stateCopy.gridSnapInterval);
                if (stateCopy.shapes.byId[stateCopy.selected[0]].closed || stateCopy.shapes.byId[stateCopy.selected[0]].open) {
                    stateCopy.mode = '';
                    stateCopy.selected = [];
                    stateCopy.editInProgress = false;
                }
            }
            break;
        case "lineTool":
            stateCopy.shapes = addLine(stateCopy.shapes, stateCopy.shapes.arrows, action, root.menuState.strokeColor, stateCopy.panX, stateCopy.panY,
                stateCopy.scale, root.menuState.gridSnapping, stateCopy.gridSnapInterval);
            shapeIds = stateCopy.shapes.allIds;
            addedShapeId = shapeIds[shapeIds.length - 1];
            stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            break;
        case "arcTool":
            stateCopy.shapes = addArc(stateCopy.shapes, action, root.menuState.strokeColor, stateCopy.panX, stateCopy.panY,
                stateCopy.scale, root.menuState.gridSnapping, stateCopy.gridSnapInterval);
            shapeIds = stateCopy.shapes.allIds;
            addedShapeId = shapeIds[shapeIds.length - 1];
            stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            break;
        case "freehandPathTool":
            stateCopy.shapes = addFreehandPath(stateCopy.shapes, action, root.menuState.strokeColor, stateCopy.panX, stateCopy.panY,
                stateCopy.scale, root.menuState.gridSnapping, stateCopy.gridSnapInterval);
            shapeIds = stateCopy.shapes.allIds;
            addedShapeId = shapeIds[shapeIds.length - 1];
            stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            break;
        case "textTool":
            stateCopy.shapes = addText(stateCopy.shapes, action, root.menuState.strokeColor, stateCopy.panX, stateCopy.panY,
                stateCopy.scale, root.menuState.gridSnapping, stateCopy.gridSnapInterval);
            shapeIds = stateCopy.shapes.allIds;
            addedShapeId = shapeIds[shapeIds.length - 1];
            stateCopy.selected = selectShape(stateCopy.selected, addedShapeId);
            break;
        case "selectTool":
        case "rotateTool":
            if (stateCopy.mode === 'reshape') { return stateCopy; }
            if (!(16 in root.menuState.currentKeys)) {
                stateCopy.selected = selectShape([], null);
            }
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
    if (stateCopy.mode === 'reshape') { return stateCopy; }

    const { draggableData } = action.payload;
    let shiftSelected = 16 in root.menuState.currentKeys;
    stateCopy.shiftDirection = shiftSelected ? "diagonal" : null;

    stateCopy.mouseCoords.x = draggableData.x;
    stateCopy.mouseCoords.y = draggableData.y;

    switch (root.menuState.toolType) {
        case "rectangleTool":
        case "roundedRectangleTool":
            stateCopy.shapes = resizeShape(stateCopy.shapes, stateCopy.boundingBoxes,
                stateCopy.selected, draggableData, 1, stateCopy.panX, stateCopy.panY,
                stateCopy.scale, null, null, root.menuState.gridSnapping, stateCopy.gridSnapInterval,
                stateCopy.shiftDirection, root.menuState.centeredControl);
            break;
        case "ellipseTool":
            stateCopy.shapes = resizeShape(stateCopy.shapes, stateCopy.boundingBoxes, stateCopy.selected,
                draggableData, 1, stateCopy.panX, stateCopy.panY, stateCopy.scale, null, null,
                root.menuState.gridSnapping, stateCopy.gridSnapInterval, stateCopy.shiftDirection, root.menuState.centeredControl);
            break;
        case "lineTool":
            stateCopy.shapes = moveLineAnchor(stateCopy.shapes, stateCopy.selected, draggableData, stateCopy.panX, stateCopy.panY,
                stateCopy.scale, root.menuState.gridSnapping, stateCopy.gridSnapInterval, root.menuState.centeredControl);
            break;
        case "freehandPathTool":
            stateCopy.shapes = addFreehandPathPoint(stateCopy.shapes, stateCopy.selected, draggableData, stateCopy.panX, stateCopy.panY,
                stateCopy.scale, root.menuState.gridSnapping, stateCopy.gridSnapInterval);
            break;
        case "arcTool":
            stateCopy.shapes = moveArcAnchor(stateCopy.shapes, stateCopy.selected, draggableData, stateCopy.panX, stateCopy.panY,
                stateCopy.scale, root.menuState.gridSnapping, stateCopy.gridSnapInterval);
            break;
        case "textTool":
            stateCopy.shapes = resizeTextBoundingBox(stateCopy.shapes, stateCopy.selected, draggableData, 1, stateCopy.scale);
            break;
        case "panTool":
            const { ruler, panX, panY } = pan(stateCopy, draggableData);
            stateCopy.ruler = ruler;
            stateCopy.panX = panX;
            stateCopy.panY = panY;
            break;
        case "rotateTool":
        case "selectTool":
        case "zoomTool":
            stateCopy.marqueeBox = resizeMarqueeBox(stateCopy.marqueeBox, draggableData, stateCopy.scale);
            break;
        default: break;
    }
    return stateCopy;
}

export function dragStop(stateCopy, action, root) {
    if (stateCopy.mode === 'reshape') { return stateCopy; }

    switch (root.menuState.toolType) {
        case "rectangleTool":
        case "roundedRectangleTool":
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
        case "rotateTool":
        case "selectTool":
            let commandSelected = 91 in root.menuState.currentKeys;
            let shiftSelected = 16 in root.menuState.currentKeys;
            stateCopy.selected = selectShapes(stateCopy.shapes, stateCopy.selected, stateCopy.boundingBoxes, stateCopy.marqueeBox, commandSelected, shiftSelected);
            stateCopy.marqueeBox = null;
            break;
        case "arcTool":
            shapeIds = stateCopy.shapes.allIds;
            addedShapeId = shapeIds[shapeIds.length - 1];
            let addedArc = stateCopy.shapes.byId[addedShapeId];

            if (addedArc.rx === 0 && addedArc.ry === 0) {
                stateCopy.shapes = removeShape(stateCopy.shapes, addedShapeId);
            }
            stateCopy.selected = [];
            break;
        case "zoomTool":
            if (stateCopy.marqueeBox.width !== 0 || stateCopy.marqueeBox.height !== 0) {
                const { ruler, panX, panY, scale } = zoomToMarqueeBox(stateCopy);
                stateCopy.ruler = ruler;
                stateCopy.panX = panX;
                stateCopy.panY = panY;
                stateCopy.scale = scale;
            }
            stateCopy.marqueeBox = null;
            break;
        default:
            break;
    }

    if (root.menuState.toolType !== "polygonTool" && root.menuState.toolType !== "bezierTool") {
        stateCopy.editInProgress = false;
    }
    return stateCopy;
}

export function handleBoundingBoxUpdate(stateCopy, action, root) {
    const { boundingBoxes } = action.payload;
    stateCopy.boundingBoxes = boundingBoxes;
    stateCopy.selectionBoxes = updateSelectionBoxes(stateCopy.selected, stateCopy.shapes, stateCopy.selectionBoxes, stateCopy.boundingBoxes, stateCopy.mode);
    stateCopy.selectionBoxes = updateSelectionBoxesCorners(stateCopy.selected, stateCopy.selectionBoxes, stateCopy.mode);

    return stateCopy;
}

export function mouseMove(stateCopy, action, root) {
    const { x, y } = action.payload;

    stateCopy.ruler.mouseTrackers = updateMouseTrackers(x, y, stateCopy.scale, stateCopy.panX, stateCopy.panY, stateCopy.ruler.width, stateCopy.canvasWidth, stateCopy.canvasHeight, root.menuState.gridSnapping, stateCopy.gridSnapInterval);

    stateCopy.mouseCoords.x = x;
    stateCopy.mouseCoords.y = y;

    switch (root.menuState.toolType) {
        case "polygonTool":
            stateCopy.shapes = addTempPolygonPoint(stateCopy.shapes, stateCopy.selected, action, stateCopy.offset, stateCopy.panX, stateCopy.panY, stateCopy.scale, root.menuState.gridSnapping, stateCopy.gridSnapInterval);
            break;
        case "bezierTool":
            stateCopy.shapes = addTempBezierPoint(stateCopy.shapes, stateCopy.selected, action, stateCopy.offset, stateCopy.panX, stateCopy.panY, stateCopy.scale, root.menuState.gridSnapping, stateCopy.gridSnapInterval);
            break;
        default:
            break;
    }
    return stateCopy;
}

export function scroll(stateCopy, action, root) {
    const { deltaX, deltaY } = action.payload;
    const { ruler, panX, panY } = pan(stateCopy, { deltaX: -deltaX, deltaY: -deltaY });
    stateCopy.ruler = ruler;
    stateCopy.panX = panX;
    stateCopy.panY = panY;
    return stateCopy;
}
