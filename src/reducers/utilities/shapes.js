import uuidv1 from 'uuid';
import { multiplyMatrices, transformPoint } from './matrix';
import { deepCopy } from './object';
import { EditorState, ContentState } from 'draft-js';

export function addRectangle(shapes, action, fill, stroke, panX, panY, scale, gridSnapping, gridSnapInterval, rectangleRadius) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;
    const rectangle = {
        id: uuidv1(),
        type: 'rectangle',
        x: (x + (panX * scale) - node.getBoundingClientRect().left) / scale,
        y: (y + (panY * scale) - node.getBoundingClientRect().top) / scale,
        rx: rectangleRadius.x,
        ry: rectangleRadius.y,
        width: 1,
        height: 1,
        fill: formatColor(fill),
        stroke: formatColor(stroke),
        transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}]
    };

    if (gridSnapping) {
        rectangle.x = Math.round(rectangle.x / gridSnapInterval) * gridSnapInterval;
        rectangle.y = Math.round(rectangle.y / gridSnapInterval) * gridSnapInterval;
    }

    shapes.byId[rectangle.id] = rectangle;
    shapes.allIds.push(rectangle.id);
    return shapes;
}

export function addEllipse(shapes, action, fill, stroke, panX, panY, scale, gridSnapping, gridSnapInterval) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;
    const ellipse = {
        id: uuidv1(),
        type: 'ellipse',
        cx: (x + (panX * scale) - node.getBoundingClientRect().left) / scale,
        cy: (y + (panY * scale) - node.getBoundingClientRect().top) / scale,
        rx: 0.5,
        ry: 0.5,
        fill: formatColor(fill),
        stroke: formatColor(stroke),
        transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}]
    };

    if (gridSnapping) {
        ellipse.cx = Math.round(ellipse.cx / gridSnapInterval) * gridSnapInterval;
        ellipse.cy = Math.round(ellipse.cy / gridSnapInterval) * gridSnapInterval;
    }

    shapes.byId[ellipse.id] = ellipse;
    shapes.allIds.push(ellipse.id);
    return shapes;
}

export function addPolygon(shapes, action, fill, stroke, panX, panY, scale, gridSnapping, gridSnapInterval) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;

    const polygon = {
        id: uuidv1(),
        type: 'polyline',
        points: [(x + (panX * scale) - node.getBoundingClientRect().left) / scale,
            (y + (panY * scale) - node.getBoundingClientRect().top) / scale],
        fill: formatColor(fill),
        stroke: formatColor(stroke),
        transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}],
        strokeWidth: 5
    };

    if (gridSnapping) {
        polygon.points[0] = Math.round(polygon.points[0] / gridSnapInterval) * gridSnapInterval;
        polygon.points[1] = Math.round(polygon.points[1] / gridSnapInterval) * gridSnapInterval;
    }

    polygon.points.push(polygon.points[0]);
    polygon.points.push(polygon.points[1]);

    shapes.byId[polygon.id] = polygon;
    shapes.allIds.push(polygon.id);
    return shapes;
}

export function addPolygonPoint(shapes, selected, action, panX, panY, scale, gridSnapping, gridSnapInterval) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;

    const polygon = shapes.byId[selected[0]];
    let xCoord = (x + (panX * scale) - node.getBoundingClientRect().left) / scale;
    let yCoord = (y + (panY * scale) - node.getBoundingClientRect().top) / scale;

    if (gridSnapping) {
        xCoord = (Math.round(xCoord / gridSnapInterval) * gridSnapInterval);
        yCoord = (Math.round(yCoord / gridSnapInterval) * gridSnapInterval);
    }

    if (Math.abs(xCoord - polygon.points[0]) < (5 / scale) &&
          Math.abs(yCoord - polygon.points[1]) < (5 / scale)) {
        // close the polygon
        xCoord = polygon.points[0];
        yCoord = polygon.points[1];
        polygon.type = 'polygon';
    }

    polygon.points[polygon.points.length - 2] = xCoord;
    polygon.points[polygon.points.length - 1] = yCoord;

    if (polygon.type !== 'polygon') {
        // temp point
        polygon.points.push(xCoord);
        polygon.points.push(yCoord);
    }

    return shapes;
}

export function addTempPolygonPoint(shapes, selected, action, offset, panX, panY, scale, gridSnapping, gridSnapInterval) {
    const { x, y } = action.payload;

    const polygon = shapes.byId[selected[0]];
    if (!polygon || polygon.type === 'polygon') { return shapes; }

    let xCoord = (x + (panX * scale) - offset.x) / scale;
    let yCoord = (y + (panY * scale) - offset.y) / scale;

    if (gridSnapping) {
        xCoord = (Math.round(xCoord / gridSnapInterval) * gridSnapInterval);
        yCoord = (Math.round(yCoord / gridSnapInterval) * gridSnapInterval);
    }

    polygon.points[polygon.points.length - 2] = xCoord;
    polygon.points[polygon.points.length - 1] = yCoord;

    return shapes;
}

export function addBezier(shapes, action, fill, stroke, panX, panY, scale, gridSnapping, gridSnapInterval) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;

    const bezier = {
        id: uuidv1(),
        type: 'bezier',
        points: [(x + (panX * scale) - node.getBoundingClientRect().left) / scale,
            (y + (panY * scale) - node.getBoundingClientRect().top) / scale],
        controlPoints: {},
        fill: formatColor(fill),
        stroke: formatColor(stroke),
        transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}],
        strokeWidth: 5
    };

    if (gridSnapping) {
        bezier.points[0] = Math.round(bezier.points[0] / gridSnapInterval) * gridSnapInterval;
        bezier.points[1] = Math.round(bezier.points[1] / gridSnapInterval) * gridSnapInterval;
    }

    bezier.points.push(bezier.points[0]);
    bezier.points.push(bezier.points[1]);

    bezier.controlPoints = smoothPath(bezier);

    shapes.byId[bezier.id] = bezier;
    shapes.allIds.push(bezier.id);
    return shapes;
}

export function addBezierPoint(shapes, selected, action, panX, panY, scale, gridSnapping, gridSnapInterval) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;

    const bezier = shapes.byId[selected[0]];

    let xCoord = (x + (panX * scale) - node.getBoundingClientRect().left) / scale;
    let yCoord = (y + (panY * scale) - node.getBoundingClientRect().top) / scale;

    if (gridSnapping) {
        xCoord = (Math.round(xCoord / gridSnapInterval) * gridSnapInterval);
        yCoord = (Math.round(yCoord / gridSnapInterval) * gridSnapInterval);
    }

    if (Math.abs(xCoord - bezier.points[0]) < (5 / scale) &&
          Math.abs(yCoord - bezier.points[1]) < (5 / scale)) {
        bezier.closed = true;
        xCoord = bezier.points[0];
        yCoord = bezier.points[1];
    }

    if ((Math.abs(xCoord - bezier.points[bezier.points.length - 4]) < (5 / scale) &&
          Math.abs(yCoord - bezier.points[bezier.points.length - 3]) < (5 / scale))) {
        bezier.points.pop();
        bezier.points.pop();
        bezier.open = true;
    }

    bezier.points[bezier.points.length - 2] = xCoord;
    bezier.points[bezier.points.length - 1] = yCoord;
    bezier.controlPoints = smoothPath(bezier);

    if (!bezier.closed && !bezier.open) {
        // temp point
        bezier.points.push(xCoord);
        bezier.points.push(yCoord);
        bezier.controlPoints = smoothPath(bezier);
    }
    return shapes;
}

export function addTempBezierPoint(shapes, selected, action, offset, panX, panY, scale, gridSnapping, gridSnapInterval) {
    const { x, y } = action.payload;

    const bezier = shapes.byId[selected[0]];
    if (!bezier || bezier.closed || bezier.open) { return shapes; }

    let xCoord = (x + (panX * scale) - offset.x) / scale;
    let yCoord = (y + (panY * scale) - offset.y) / scale;

    if (gridSnapping) {
        xCoord = (Math.round(xCoord / gridSnapInterval) * gridSnapInterval);
        yCoord = (Math.round(yCoord / gridSnapInterval) * gridSnapInterval);
    }

    bezier.points[bezier.points.length - 2] = xCoord;
    bezier.points[bezier.points.length - 1] = yCoord;

    bezier.controlPoints = smoothPath(bezier);
    return shapes;
}

export function addLine(shapes, action, fill, panX, panY, scale, gridSnapping, gridSnapInterval) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;

    const line = {
        id: uuidv1(),
        type: "line",
        points: [(x + (panX * scale) - node.getBoundingClientRect().left) / scale,
            (y + (panY * scale) - node.getBoundingClientRect().top) / scale,
            (x + (panX * scale) - node.getBoundingClientRect().left) / scale,
            (y + (panY * scale) - node.getBoundingClientRect().top) / scale],
        stroke: formatColor(fill),
        strokeWidth: 10,
        strokeDasharray: '1, 0',
        transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}],
        arrowhead: {},
        arrowId: uuidv1(),
        arrowLength: 30,
        arrowShown: 'yes'
    };

    const arrow = {
        id: line.arrowId,
        shapeId: line.id
    };

    if (gridSnapping) {
        line.points[0] = Math.round(line.points[0] / gridSnapInterval) * gridSnapInterval;
        line.points[1] = Math.round(line.points[1] / gridSnapInterval) * gridSnapInterval;
    }

    shapes.byId[line.id] = line;
    shapes.allIds.push(line.id);

    shapes.byArrowId[arrow.id] = line;
    shapes.allArrows.push(arrow.id);

    return shapes;
}

export function addArc(shapes, action, fill, panX, panY, scale, gridSnapping, gridSnapInterval) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;
    const arc = {
        id: uuidv1(),
        type: "arc",
        points: [ (x + (panX * scale) - node.getBoundingClientRect().left) / scale,
            (y + (panY * scale) - node.getBoundingClientRect().top) / scale],
        rx: 0,
        ry: 0,
        stroke: formatColor(fill),
        strokeWidth: 10,
        largeArc: 0,
        startAngle: 0,
        sweepAngle: Math.PI / 2,
        flipArc: false,
        transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}]
    };

    if (gridSnapping) {
        arc.points[0] = Math.round(arc.points[0] / gridSnapInterval) * gridSnapInterval;
        arc.points[1] = Math.round(arc.points[1] / gridSnapInterval) * gridSnapInterval;
    }

    arc.points[2] = arc.points[0];
    arc.points[3] = arc.points[1];

    shapes.byId[arc.id] = arc;
    shapes.allIds.push(arc.id);
    return shapes;
}

export function addFreehandPath(shapes, action, fill, panX, panY, scale, gridSnapping, gridSnapInterval) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;

    const path = {
        id: uuidv1(),
        type: 'freehandPath',
        points: [(x + (panX * scale) - node.getBoundingClientRect().left) / scale,
            (y + (panY * scale) - node.getBoundingClientRect().top) / scale],
        fill: formatColor(fill),
        transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}],
        stroke: formatColor(fill),
        strokeWidth: 1
    };

    if (gridSnapping) {
        path.points[0] = Math.round(path.points[0] / gridSnapInterval) * gridSnapInterval;
        path.points[1] = Math.round(path.points[1] / gridSnapInterval) * gridSnapInterval;
    }

    shapes.byId[path.id] = path;
    shapes.allIds.push(path.id);
    return shapes;
}

export function addText(shapes, action, fill, panX, panY, scale, gridSnapping, gridSnapInterval) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;

    const text = {
        id: uuidv1(),
        editorState: EditorState.createWithContent(ContentState.createFromText('hello')),
        type: 'text',
        text: '',
        x: (x + (panX * scale) - node.getBoundingClientRect().left) / scale,
        y: (y + (panY * scale) - node.getBoundingClientRect().top) / scale,
        width: 120,
        height: 30,
        fontFamily: 'helvetica',
        fontSize: '24',
        lineHeight: '24',
        fontStyle: 'normal',
        textAlign: 'left',
        textDecoration: 'none',
        fontWeight: 'normal',
        fill: formatColor(fill),
        transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}]
    };

    if (gridSnapping) {
        text.x = Math.round(text.x / gridSnapInterval) * gridSnapInterval;
        text.y = Math.round(text.y / gridSnapInterval) * gridSnapInterval;
    }

    shapes.byId[text.id] = text;
    shapes.allIds.push(text.id);
    return shapes;
}

export function moveLineAnchor(shapes, selected, draggableData, panX, panY, scale, gridSnapping, gridSnapInterval, centeredControl) {
    const { x, y, node } = draggableData;
    let mouseX = (x + (panX * scale) - node.getBoundingClientRect().left) / scale;
    let mouseY = (y + (panY * scale) - node.getBoundingClientRect().top) / scale;

    selected.map((id) => {
        const line = shapes.byId[id];
        let oldX2 = line.points[2];
        let oldY2 = line.points[3];
        line.points[2] = mouseX;
        line.points[3] = mouseY;

        if (gridSnapping) {
            line.points[2] = Math.round(line.points[2] / gridSnapInterval) * gridSnapInterval;
            line.points[3] = Math.round(line.points[3] / gridSnapInterval) * gridSnapInterval;
        }

        if (centeredControl) {
            line.points[0] -= (line.points[2] - oldX2);
            line.points[1] -= (line.points[3] - oldY2);
        }
    });

    return shapes;
}

export function moveArcAnchor(shapes, selected, draggableData, panX, panY, scale, gridSnapping, gridSnapInterval) {
    const { x, y, node } = draggableData;
    let mouseX = (x + (panX * scale) - node.getBoundingClientRect().left) / scale;
    let mouseY = (y + (panY * scale) - node.getBoundingClientRect().top) / scale;

    selected.map((id) => {
        const arc = shapes.byId[id];
        arc.points[2] = mouseX;
        arc.points[3] = mouseY;

        if (gridSnapping) {
            arc.points[2] = Math.round(arc.points[2] / gridSnapInterval) * gridSnapInterval;
            arc.points[3] = Math.round(arc.points[3] / gridSnapInterval) * gridSnapInterval;
        }

        arc.rx = arc.points[2] - arc.points[0];
        arc.ry = arc.points[3] - arc.points[1];

        if (Math.sign(arc.rx) === Math.sign(arc.ry)) {
            arc.center = {x: arc.points[0], y: arc.points[3]};
        } else {
            arc.center = {x: arc.points[2], y: arc.points[1]};
        }
    });

    return shapes;
}

export function addFreehandPathPoint(shapes, selected, draggableData, panX, panY, scale, gridSnapping, gridSnapInterval) {
    const { x, y, node } = draggableData;
    let mouseX = (x + (panX * scale) - node.getBoundingClientRect().left) / scale;
    let mouseY = (y + (panY * scale) - node.getBoundingClientRect().top) / scale;

    if (gridSnapping) {
        mouseX = Math.round(mouseX / gridSnapInterval) * gridSnapInterval;
        mouseY = Math.round(mouseY / gridSnapInterval) * gridSnapInterval;
    }

    selected.map((id) => {
        const path = shapes.byId[id];
        path.points.push(mouseX);
        path.points.push(mouseY);
    });

    return shapes;
}

export function resizeTextBoundingBox(shapes, selected, draggableData, handleIndex, scale) {
    const { deltaX, deltaY } = draggableData;
    const scaledDeltaX = deltaX / scale;
    const scaledDeltaY = deltaY / scale;

    selected.map((id) => {
        const text = shapes.byId[id];
        switch (handleIndex) {
            case 0:
                text.width += scaledDeltaX;
                text.y += scaledDeltaY;
                text.height -= scaledDeltaY;
                break;
            case 1:
                text.width += scaledDeltaX;
                text.height += scaledDeltaY;
                break;
            case 2:
                text.x += scaledDeltaX;
                text.width -= scaledDeltaX;
                text.height += scaledDeltaY;
                break;
            case 3:
                text.x += scaledDeltaX;
                text.width -= scaledDeltaX;
                text.y += scaledDeltaY;
                text.height -= scaledDeltaY;
                break;
        }
    });

    return shapes;
}

export function removeShape(shapes, shapeId) {
    const index = shapes.allIds.indexOf(shapeId);
    delete shapes.byId[shapeId];
    shapes.allIds.splice(index, 1);
    return shapes;
}

export function initializeMoveShape(shapes, selected, scale, boundingBoxes, selectionBoxes, gridSnapping, gridSnapInterval, align) {
    selected.map((id) => {
        const shape = shapes.byId[id];
        const boundingBox = boundingBoxes[id];

        if (gridSnapping) {
            let coord = getAlignedCoord(shape, selectionBoxes[id], boundingBox, align);

            shape.xOffset = coord.x;
            shape.yOffset = coord.y;
            shape.dragX = 0;
            shape.dragY = 0;
        }
    });

    return shapes;
}

export function endMoveShape(shapes, selected) {
    selected.map((id) => {
        const shape = shapes.byId[id];
        delete shape.xOffset;
        delete shape.yOffset;
        delete shape.dragX;
        delete shape.dragY;
    });

    return shapes;
}

function getAlignedCoord(shape, selectionBox, boundingBox, align) {
    const coords = {};
    const x = shape.type === 'text' ? shape.x : boundingBox.x;
    const y = shape.type === 'text' ? shape.y : boundingBox.y;
    coords[0] = transformPoint(x + boundingBox.width, y, shape.transform[0].parameters);
    coords[1] = transformPoint(x + boundingBox.width, y + boundingBox.height, shape.transform[0].parameters);
    coords[2] = transformPoint(x, y + boundingBox.height, shape.transform[0].parameters);
    coords[3] = transformPoint(x, y, shape.transform[0].parameters);

    let center = getCenter({x, y, width: boundingBox.width, height: boundingBox.height}, shape.transform[0].parameters);
    let allXs = [coords[0].x, coords[1].x, coords[2].x, coords[3].x];
    let allYs = [coords[0].y, coords[1].y, coords[2].y, coords[3].y];

    let coord = coords[0]; // At first no selection box?
    if (selectionBox) {
        if (align[0] === 'top' && align[1] === 'left') {
            coord = coords[selectionBox.upperLeft];
        } else if (align[0] === 'top' && align[1] === 'center') {
            coord = { x: center.x, y: Math.min(...allYs) };
        } else if (align[0] === 'top' && align[1] === 'right') {
            coord = coords[selectionBox.upperRight];
        } else if (align[0] === 'center' && align[1] === 'left') {
            coord = coord = { x: Math.min(...allXs), y: center.y };
        } else if (align[0] === 'center' && align[1] === 'center') {
            coord = center;
        } else if (align[0] === 'center' && align[1] === 'right') {
            coord = coord = { x: Math.max(...allXs), y: center.y };
        } else if (align[0] === 'bottom' && align[1] === 'left') {
            coord = coords[selectionBox.lowerLeft];
        } else if (align[0] === 'bottom' && align[1] === 'center') {
            coord = { x: center.x, y: Math.max(...allYs) };
        } else if (align[0] === 'bottom' && align[1] === 'right') {
            coord = coords[selectionBox.lowerRight];
        }
    }
    return coord;
}

export function moveShape(shapes, selected, action, scale, boundingBoxes,
    selectionBoxes, gridSnapping, gridSnapInterval, align, shiftDirection) {
    const { draggableData } = action.payload;
    const { deltaX, deltaY } = draggableData;
    let scaledDeltaX = deltaX / scale;
    let scaledDeltaY = deltaY / scale;

    switch (shiftDirection) {
        case 'x':
            scaledDeltaY = 0;
            break;
        case 'y':
            scaledDeltaX = 0;
            break;
        case 'diagonal':
            let newScale = Math.min(Math.abs(scaledDeltaX), Math.abs(scaledDeltaY));

            if (scaledDeltaX < 0) {
                scaledDeltaX = newScale * -1;
            } else {
                scaledDeltaX = newScale;
            }

            if (scaledDeltaY < 0) {
                scaledDeltaY = newScale * -1;
            } else {
                scaledDeltaY = newScale;
            }
            break;
        default:
            break;
    }

    selected.map((id) => {
        const shape = shapes.byId[id];
        const boundingBox = boundingBoxes[id];

        if (gridSnapping) {
            if (!shape.dragX) shape.dragX = 0;
            if (!shape.dragY) shape.dragY = 0;
            let coord = getAlignedCoord(shape, selectionBoxes[id], boundingBox, align);

            if (coord) {
                if (!shape.xOffset) shape.xOffset = coord.x;
                if (!shape.yOffset) shape.yOffset = coord.y;

                shape.dragX += scaledDeltaX;
                shape.dragY += scaledDeltaY;

                let newX = Math.round((shape.xOffset + shape.dragX) / gridSnapInterval) * gridSnapInterval;
                let newY = Math.round((shape.yOffset + shape.dragY) / gridSnapInterval) * gridSnapInterval;

                if (shape.type === 'text') {
                    shape.x = Math.round((shape.dragX) / gridSnapInterval) * gridSnapInterval - coord.x;
                    shape.y = Math.round((shape.dragY) / gridSnapInterval) * gridSnapInterval - coord.y;
                } else {
                    let moveMatrix = [1, 0, 0, 1, newX - coord.x, newY - coord.y];
                    shape.transform[0].parameters = multiplyMatrices(moveMatrix, shape.transform[0].parameters);
                }
            }
        } else {
            if (shape.type === 'text') {
                shape.x = shape.x + scaledDeltaX;
                shape.y = shape.y + scaledDeltaY;
            } else {
                let moveMatrix = [1, 0, 0, 1, scaledDeltaX, scaledDeltaY];
                shape.transform[0].parameters = multiplyMatrices(moveMatrix, shape.transform[0].parameters);
            }
        }

        if (shape.type === 'line') {
            for (let i = 0; i < shape.points.length; i += 2) {
                let coords = transformPoint(shape.points[i], shape.points[i + 1], shape.transform[0].parameters);
                shape.points[i] = coords.x;
                shape.points[i + 1] = coords.y;
            }
            shape.transform[0].parameters = [1, 0, 0, 1, 0, 0];
        }

        shape.info = getShapeInfo(shape, boundingBoxes[id]);
    });

    return shapes;
}

export function keyboardMoveShape(shapes, selected, action, scale, boundingBoxes, selectionBoxes, gridSnapping, gridSnapInterval, align) {
    const { keyCode } = action.payload;
    let scaledDeltaX = 0;
    let scaledDeltaY = 0;

    switch (keyCode) {
        case 37:
            scaledDeltaX = -1 / scale;
            break;
        case 38:
            scaledDeltaY = -1 / scale;
            break;
        case 39:
            scaledDeltaX = 1 / scale;
            break;
        case 40:
            scaledDeltaY = 1 / scale;
            break;
        default:
            break;
    }

    selected.map((id) => {
        const shape = shapes.byId[id];
        const boundingBox = boundingBoxes[id];

        if (gridSnapping) {
            let coord = getAlignedCoord(shape, selectionBoxes[id], boundingBox, align);

            let dragX = scaledDeltaX * gridSnapInterval;
            let dragY = scaledDeltaY * gridSnapInterval;

            let newX = Math.round((coord.x + dragX) / gridSnapInterval) * gridSnapInterval;
            let newY = Math.round((coord.y + dragY) / gridSnapInterval) * gridSnapInterval;

            let moveMatrix = [1, 0, 0, 1, newX - coord.x, newY - coord.y];
            shape.transform[0].parameters = multiplyMatrices(moveMatrix, shape.transform[0].parameters);
        } else {
            let moveMatrix = [1, 0, 0, 1, scaledDeltaX, scaledDeltaY];
            shape.transform[0].parameters = multiplyMatrices(moveMatrix, shape.transform[0].parameters);
        }
        shape.info = getShapeInfo(shape, boundingBoxes[id]);
    });

    return shapes;
}

export function fillShape(shapes, selected, action) {
    const { color } = action.payload;
    selected.map((id) => {
        const shape = shapes.byId[id];
        if (shape.type === "group") {
            shapes = fillShape(shapes, shape.members, action);
        } else {
            shape.fill = formatColor(color);
        }
    });
    return shapes;
}

export function strokeShape(shapes, selected, action) {
    const { color } = action.payload;
    selected.map((id) => {
        const shape = shapes.byId[id];
        if (shape.type === "group") {
            shapes = fillShape(shapes, shape.members, action);
        } else {
            shape.stroke = formatColor(color);
        }
    });
    return shapes;
}

export function formatColor(rgba) {
    const { r, g, b, a } = rgba;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

export function flipShape(shapes, selected, selectionBoxes, boundingBoxes, vertical) {
    selected.map((id) => {
        const shape = shapes.byId[id];
        let coord = getAlignedCoord(shape, selectionBoxes[id], boundingBoxes[id], ["center", "center"]);
        if (vertical) {
            shape.transform[0].parameters = resizeTransform(shape.transform[0].parameters, -1, 1, coord.x, coord.y);
        } else {
            shape.transform[0].parameters = resizeTransform(shape.transform[0].parameters, 1, -1, coord.x, coord.y);
        }
        shape.info = getShapeInfo(shape, boundingBoxes[id]);
    });
    return shapes;
}

export function bringToFront(shapes, selected) {
    for (let i = 0; i < selected.length; i++) {
        shapes.allIds.splice(shapes.allIds.indexOf(selected[i]), 1);
        shapes.allIds.push(selected[i]);
    }
    return shapes;
}

export function sendToBack(shapes, selected) {
    for (let i = 0; i < selected.length; i++) {
        shapes.allIds.splice(shapes.allIds.indexOf(selected[i]), 1);
        shapes.allIds = [selected[i]].concat(shapes.allIds);
    }
    return shapes;
}

export function changeZIndex(shapes, selected, change) {
    if (change > 0) {
        for (let i = shapes.allIds.length - 1; i >= 0; i--) {
            if (selected.indexOf(shapes.allIds[i]) > -1) {
                if (i + 1 < shapes.allIds.length && selected.indexOf(shapes.allIds[i + 1]) < 0) {
                    let temp = shapes.allIds[i + 1];
                    shapes.allIds[i + 1] = shapes.allIds[i];
                    shapes.allIds[i] = temp;
                }
            }
        }
    } else {
        for (let i = 0; i < shapes.allIds.length; i++) {
            if (selected.indexOf(shapes.allIds[i]) > -1) {
                if (i - 1 >= 0 && selected.indexOf(shapes.allIds[i - 1]) < 0) {
                    let temp = shapes.allIds[i - 1];
                    shapes.allIds[i - 1] = shapes.allIds[i];
                    shapes.allIds[i] = temp;
                }
            }
        }
    }
    return shapes;
}

export function groupShapes(selected, shapes) {
    let group = {
        id: uuidv1(),
        type: "group",
        members: [],
        xSign: 1,
        ySign: 1
    };
    shapes.allIds.map((id) => {
        if (selected.indexOf(id) > -1) {
            shapes.byId[id].groupID = group.id;
            group.members.push(id);
        }
    });

    // initialize transofrm
    group.transform = [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}];
    return group;
}

export function ungroupShapes(selected, shapes) {
    let members = [];
    selected.map((id) => {
        if (shapes.byId[id].type === "group") {
            const group = shapes.byId[id];

            let i = shapes.allIds.indexOf(id);
            shapes.allIds.splice(shapes.allIds.indexOf(id), 1);

            shapes.byId[id].members.map((memberId) => {
                shapes.byId[memberId] = applyTransformation(shapes.byId[memberId], group);
                members.push(memberId);
                shapes.allIds.splice(i, 0, memberId);
                i += 1;
            });

            delete shapes.byId[id];
        } else {
            members.push(id);
        }
    });
    return members;
}

function applyTransformation(shape, group) {
    shape.transform[0].parameters = multiplyMatrices(group.transform[0].parameters, shape.transform[0].parameters);

    if (shape.type === 'line') {
        for (let i = 0; i < shape.points.length; i += 2) {
            let coords = transformPoint(shape.points[i], shape.points[i + 1], shape.transform[0].parameters);
            shape.points[i] = coords.x;
            shape.points[i + 1] = coords.y;
        }
        shape.transform[0].parameters = [1, 0, 0, 1, 0, 0];
    }

    return shape;
}

export function applyGroupTransformations(group, shapes) {
    let members = [];

    group.members.map((memberId) => {
        if (shapes.byId[memberId].type === 'group') {
            shapes.byId[memberId] = applyTransformation(shapes.byId[memberId], group);
            shapes.byId[memberId].members = applyGroupTransformations(shapes.byId[memberId], shapes);
            shapes.byId[memberId].transform[0].parameters = [1, 0, 0, 1, 0, 0];
        } else {
            shapes.byId[memberId] = applyTransformation(shapes.byId[memberId], group);
        }
        members.push(memberId);
    });

    return members;
}

export function removeTransformation(shapes, selected) {
    selected.map((id) => {
        let shape = shapes.byId[id];
        const shapeMatrix = shape.transform[0].parameters;
        switch (shape.type) {
            case 'line':
            case 'polygon':
                for (let i = 0; i < shape.points.length; i += 2) {
                    let coords = transformPoint(shape.points[i], shape.points[i + 1], shapeMatrix);
                    shape.points[i] = coords.x;
                    shape.points[i + 1] = coords.y;
                }
                shape.transform[0].parameters = [1, 0, 0, 1, 0, 0];
                break;
            case 'bezier':
                for (let i = 0; i < shape.points.length; i += 2) {
                    let coords = transformPoint(shape.points[i], shape.points[i + 1], shapeMatrix);
                    shape.points[i] = coords.x;
                    shape.points[i + 1] = coords.y;
                    if (shape.controlPoints[i / 2]) {
                        shape.controlPoints[i / 2][0] = transformPoint(shape.controlPoints[i / 2][0].x, shape.controlPoints[i / 2][0].y, shapeMatrix);
                        shape.controlPoints[i / 2][1] = transformPoint(shape.controlPoints[i / 2][1].x, shape.controlPoints[i / 2][1].y, shapeMatrix);
                    }
                }
                shape.transform[0].parameters = [1, 0, 0, 1, 0, 0];
                break;
            case 'arc':
                let rxSign = Math.sign(shape.rx);
                let rySign = Math.sign(shape.ry);

                let decomposed = decomposeMatrix(shapeMatrix);

                if (decomposed.skewX !== 0) {
                    let unrotatedMatrix = rotateTransform(shapeMatrix, -decomposed.skewY, 0, 0);

                    for (let i = 0; i < shape.points.length; i += 2) {
                        let coords = transformPoint(shape.points[i], shape.points[i + 1], unrotatedMatrix);
                        shape.points[i] = coords.x;
                        shape.points[i + 1] = coords.y;
                    }
                    shape.center = transformPoint(shape.center.x, shape.center.y, unrotatedMatrix);

                    shape.rx = (transformPoint(0, 0, unrotatedMatrix).x - transformPoint(shape.rx, 0, unrotatedMatrix).x);
                    shape.ry = (transformPoint(0, 0, unrotatedMatrix).y - transformPoint(0, shape.ry, unrotatedMatrix).y);
                    shape.transform[0].parameters = rotateTransform([1, 0, 0, 1, 0, 0], decomposed.skewY, 0, 0);
                } else {
                    for (let i = 0; i < shape.points.length; i += 2) {
                        let coords = transformPoint(shape.points[i], shape.points[i + 1], shapeMatrix);
                        shape.points[i] = coords.x;
                        shape.points[i + 1] = coords.y;
                    }
                    shape.center = transformPoint(shape.center.x, shape.center.y, shapeMatrix);

                    shape.rx = (transformPoint(0, 0, shapeMatrix).x - transformPoint(shape.rx, 0, shapeMatrix).x);
                    shape.ry = (transformPoint(0, 0, shapeMatrix).y - transformPoint(0, shape.ry, shapeMatrix).y);
                    shape.transform[0].parameters = [1, 0, 0, 1, 0, 0];
                }

                if (!((Math.sign(shape.rx) === rxSign && Math.sign(shape.ry) === rySign) ||
                        (Math.sign(shape.rx) !== rxSign && Math.sign(shape.ry) !== rySign))) {
                    shape.points = [shape.points[2], shape.points[3], shape.points[0], shape.points[1]];
                }

                break;
            default:
                break;
        }
    });
    return shapes;
}

export function prepareForReshape(shapes, selected) {
    let shape = shapes.byId[selected[0]];
    shape.pointsToAdd = [];

    for (let i = 0; i < shape.points.length - 2; i += 2) {
        shape.pointsToAdd[i / 2] = getPoints({x: shape.points[i], y: shape.points[i + 1]},
            {x: shape.points[i + 2], y: shape.points[i + 3]}, 25);
    }

    shape.reshapeInProgress = true;
    return shapes;
}

function getPoints(p1, p2, quantity) {
    const points = [];
    const ydiff = p2.y - p1.y;
    const xdiff = p2.x - p1.x;
    const slope = (p2.y - p1.y) / (p2.x - p1.y);

    let x = 0;
    let y = 0;

    for (let i = 0; i < quantity; i++) {
        y = slope === 0 ? 0 : ydiff * (i / quantity);
        x = slope === 0 ? xdiff * (i / quantity) : y / slope;
        points[i] = { x: x + p1.x, y: y + p1.y };
    }

    return points;
}

export function reshape(shapes, selected, draggableData, handleIndex, panX, panY, scale, gridSnapping, gridSnapInterval) {
    const { x, y, node } = draggableData;

    let offsetLeft = 0;
    let offsetTop = 0;

    if (node) {
        offsetLeft = node.parentNode.getBoundingClientRect().left;
        offsetTop = node.parentNode.getBoundingClientRect().left;
    }

    let mouseX = (x + (panX * scale) - offsetLeft) / scale;
    let mouseY = (y + (panY * scale) - offsetTop) / scale;

    if (gridSnapping) {
        mouseX = Math.round(mouseX / gridSnapInterval) * gridSnapInterval;
        mouseY = Math.round(mouseY / gridSnapInterval) * gridSnapInterval;
    }

    selected.map((id) => {
        let shape = shapes.byId[id];
        switch (shape.type) {
            case 'line':
                shape.points[handleIndex * 2] = mouseX;
                shape.points[handleIndex * 2 + 1] = mouseY;
                break;
            case 'arc':
                shape.points[handleIndex * 2] = mouseX;
                shape.points[handleIndex * 2 + 1] = mouseY;
                break;
            case 'polygon':
                shape.points[handleIndex * 2] = mouseX;
                shape.points[handleIndex * 2 + 1] = mouseY;

                if (handleIndex === 0) {
                    shape.points[shape.points.length - 2] = mouseX;
                    shape.points[shape.points.length - 1] = mouseY;
                }

                if (handleIndex === (shape.points.length / 2) - 1) {
                    shape.points[0] = mouseX;
                    shape.points[1] = mouseY;
                }

                break;
            case 'bezier':
                let deltaX = mouseX - shape.points[handleIndex * 2];
                let deltaY = mouseY - shape.points[handleIndex * 2 + 1];

                shape.points[handleIndex * 2] = mouseX;
                shape.points[handleIndex * 2 + 1] = mouseY;

                if (handleIndex === 0 && !shape.open) {
                    shape.points[shape.points.length - 2] = mouseX;
                    shape.points[shape.points.length - 1] = mouseY;
                }

                if (handleIndex === (shape.points.length / 2) - 1 && !shape.open) {
                    shape.points[0] = mouseX;
                    shape.points[1] = mouseY;
                }

                shape.controlPoints[handleIndex][0].x += deltaX;
                shape.controlPoints[handleIndex][1].x += deltaX;

                shape.controlPoints[handleIndex][0].y += deltaY;
                shape.controlPoints[handleIndex][1].y += deltaY;

                break;
            default:
                break;
        }
    });
    return shapes;
}
export function addPoint(shapes, selected, handleIndex, draggableData, panX, panY, scale) {
    let { x, y, node } = draggableData;
    x = (x + (panX * scale) - node.parentNode.parentNode.parentNode.getBoundingClientRect().top) / scale;
    y = (y + (panY * scale) - node.parentNode.parentNode.parentNode.getBoundingClientRect().top) / scale;

    selected.map((id) => {
        let shape = shapes.byId[id];
        switch (shape.type) {
            case 'polygon':
                shape.points.splice((handleIndex + 1) * 2, 0, x, y);
                break;
            case 'bezier':
                shape.points.splice((handleIndex + 1) * 2, 0, x, y);
                shape.controlPoints = smoothPath(shape);
                break;
            default:
                break;
        }
        shape.refreshSelection = true;
    });

    return shapes;
}

export function removePoint(shapes, selected, handleIndex) {
    selected.map((id) => {
        let shape = shapes.byId[id];
        switch (shape.type) {
            case 'polygon':
                shape.points.splice(handleIndex * 2, 2);

                if (handleIndex === 0) {
                    shape.points[shape.points.length - 2] = shape.points[0];
                    shape.points[shape.points.length - 1] = shape.points[1];
                }

                if (handleIndex === (shape.points.length / 2)) {
                    shape.points[0] = shape.points[shape.points.length - 2];
                    shape.points[1] = shape.points[shape.points.length - 1];
                }

                shape.refreshSelection = true;
                break;
            case 'bezier':
                shape.points.splice(handleIndex * 2, 2);

                if (handleIndex === 0) {
                    shape.points[shape.points.length - 2] = shape.points[0];
                    shape.points[shape.points.length - 1] = shape.points[1];
                }

                if (handleIndex === (shape.points.length / 2)) {
                    shape.points[0] = shape.points[shape.points.length - 2];
                    shape.points[1] = shape.points[shape.points.length - 1];
                }

                shape.controlPoints = smoothPath(shape);
                shape.refreshSelection = true;
                break;
            default:
                break;
        }
    });
    return shapes;
}

export function moveControl(shapes, selected, draggableData, handleIndex, panX, panY, scale) {
    const { x, y, node } = draggableData;

    let offsetLeft = 0;
    let offsetTop = 0;

    if (node) {
        offsetLeft = node.parentNode.parentNode.parentNode.getBoundingClientRect().left;
        offsetTop = node.parentNode.parentNode.parentNode.getBoundingClientRect().top;
    }

    let mouseX = (x + (panX * scale) - offsetLeft) / scale;
    let mouseY = (y + (panY * scale) - offsetTop) / scale;

    let shape = shapes.byId[selected[0]];
    if (shape.type === 'bezier') {
        let i1 = parseInt(handleIndex / 2);
        let i2 = 0 + handleIndex % 2;
        shape.controlPoints[i1][i2] = {x: mouseX, y: mouseY};
    }
    if (shape.type === 'arc') {
        const matrix = shape.transform[0].parameters;
        let decomposed = decomposeMatrix(matrix);
        let c = transformPoint(shape.center.x, shape.center.y, matrix);
        let angle = Math.atan2(mouseY - c.y, mouseX - c.x) - decomposed.skewX;

        let rx = Math.abs(shape.rx);
        let ry = Math.abs(shape.ry);

        if (handleIndex === 1) {
            shape.points[2] = shape.center.x + rx * Math.cos(angle);
            shape.points[3] = shape.center.y + ry * Math.sin(angle);
        } else {
            shape.points[0] = shape.center.x + rx * Math.cos(angle);
            shape.points[1] = shape.center.y + ry * Math.sin(angle);
        }

        let finalAngle = Math.atan2(shape.points[3] - shape.center.y, shape.points[2] - shape.center.x) - Math.atan2(shape.points[1] - shape.center.y, shape.points[0] - shape.center.x);
        if (finalAngle < 0) {
            finalAngle += 2 * Math.PI;
        }

        shape.largeArc = finalAngle > Math.PI ? 1 : 0;
    }
    return shapes;
}

export function deleteShapes(shapes, selected) {
    selected.map((id) => {
        if (shapes.byId[id].type === "group") {
            shapes = deleteShapes(shapes, shapes.byId[id].members);
        }
        delete shapes.byId[id];
        shapes.allIds.splice(shapes.allIds.indexOf(id), 1);
    });
    return shapes;
}

export function resizeShape(shapes, boundingBoxes, selected, draggableData, handleIndex,
    panX, panY, scale, shapeId, selectionBoxes, gridSnapping, gridSnapInterval, shiftDirection, centeredControl) {
    if (typeof (shapes.byId[shapeId]) === "undefined") { shapeId = selected[0]; }
    if (shapes.byId[shapeId].type === "group") {
        handleIndex = determineGroupHandleIndex(handleIndex, shapes.byId[shapeId]);
    }

    let handleCorner = determineHandleCorner(handleIndex, selectionBoxes, shapeId);
    let scaleXY = determineScale(shapes.byId[shapeId], boundingBoxes, selectionBoxes, draggableData, handleIndex,
        panX, panY, scale, gridSnapping, gridSnapInterval, shiftDirection);
    let scaledDeltaX = scaleXY.x;
    let scaledDeltaY = scaleXY.y;

    selected.map((id) => {
        const shape = shapes.byId[id];
        const shapeMatrix = shape.transform[0].parameters;
        const boundingBox = boundingBoxes[id];

        let coords0 = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y, shapeMatrix);
        let coords1 = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height, shapeMatrix);
        let coords2 = transformPoint(boundingBox.x, boundingBox.y + boundingBox.height, shapeMatrix);
        let coords3 = transformPoint(boundingBox.x, boundingBox.y, shapeMatrix);

        if (shape.type === 'line' && shape.arrowShown === 'yes') {
            coords0 = {x: selectionBoxes[id].handles[0].x, y: selectionBoxes[id].handles[0].y};
            coords1 = {x: selectionBoxes[id].handles[1].x, y: selectionBoxes[id].handles[1].y};
            coords2 = {x: selectionBoxes[id].handles[2].x, y: selectionBoxes[id].handles[2].y};
            coords3 = {x: selectionBoxes[id].handles[3].x, y: selectionBoxes[id].handles[3].y};
        }

        let newWidth = 0;
        let newHeight = 0;
        let originalWidth = 0;
        let originalHeight = 0;
        let targetX = 0;
        let targetY = 0;
        let sx = 0;
        let sy = 0;

        let cxCoords = {};

        let handle = determineHandle(handleCorner, selectionBoxes, id, handleIndex);
        switch (handle) {
            case 0:
                let len03 = Math.sqrt((coords3.x - coords0.x) ** 2 + (coords3.y - coords0.y) ** 2);
                let len01 = Math.sqrt((coords1.x - coords0.x) ** 2 + (coords1.y - coords0.y) ** 2);

                originalWidth = len03;
                originalHeight = len01;

                targetX = coords0.x + scaledDeltaX;
                targetY = coords0.y + scaledDeltaY;

                if (gridSnapping) {
                    targetX = Math.round(targetX / gridSnapInterval) * gridSnapInterval;
                    targetY = Math.round(targetY / gridSnapInterval) * gridSnapInterval;
                }

                let scale03 = calculateDistance({ x2: coords1.x, y2: coords1.y, x1: coords0.x, y1: coords0.y }, {x: targetX, y: targetY});
                let scale01 = calculateDistance({ x2: coords3.x, y2: coords3.y, x1: coords0.x, y1: coords0.y }, {x: targetX, y: targetY});

                let distMouse03 = Math.sqrt((targetX - coords3.x) ** 2 + (targetY - coords3.y) ** 2);
                let distMouse01 = Math.sqrt((targetX - coords1.x) ** 2 + (targetY - coords1.y) ** 2);
                let distMouse00 = Math.sqrt((targetX - coords0.x) ** 2 + (targetY - coords0.y) ** 2);

                if (distMouse03 < len03 || distMouse00 > distMouse03) scale03 *= -1;
                if (distMouse01 < len01 || distMouse00 > distMouse01) scale01 *= -1;

                newWidth = len03 + scale03;
                newHeight = len01 + scale01;

                cxCoords = coords2;
                break;
            case 1:
                let len12 = Math.sqrt((coords2.x - coords1.x) ** 2 + (coords2.y - coords1.y) ** 2);
                let len10 = Math.sqrt((coords0.x - coords1.x) ** 2 + (coords0.y - coords1.y) ** 2);

                originalWidth = len12;
                originalHeight = len10;

                targetX = coords1.x + scaledDeltaX;
                targetY = coords1.y + scaledDeltaY;

                if (gridSnapping) {
                    targetX = Math.round(targetX / gridSnapInterval) * gridSnapInterval;
                    targetY = Math.round(targetY / gridSnapInterval) * gridSnapInterval;
                }

                let scale12 = calculateDistance({ x2: coords0.x, y2: coords0.y, x1: coords1.x, y1: coords1.y }, {x: targetX, y: targetY});
                let scale10 = calculateDistance({ x2: coords2.x, y2: coords2.y, x1: coords1.x, y1: coords1.y }, {x: targetX, y: targetY});

                let distMouse12 = Math.sqrt((targetX - coords2.x) ** 2 + (targetY - coords2.y) ** 2);
                let distMouse10 = Math.sqrt((targetX - coords0.x) ** 2 + (targetY - coords0.y) ** 2);
                let distMouse11 = Math.sqrt((targetX - coords1.x) ** 2 + (targetY - coords1.y) ** 2);

                if (distMouse12 < len12 || distMouse11 > distMouse12) scale12 *= -1;
                if (distMouse10 < len10 || distMouse11 > distMouse10) scale10 *= -1;

                newWidth = len12 + scale12;
                newHeight = len10 + scale10;

                cxCoords = coords3;
                break;
            case 2:
                let len21 = Math.sqrt((coords1.x - coords2.x) ** 2 + (coords1.y - coords2.y) ** 2);
                let len23 = Math.sqrt((coords3.x - coords2.x) ** 2 + (coords3.y - coords2.y) ** 2);

                originalWidth = len21;
                originalHeight = len23;

                targetX = coords2.x + scaledDeltaX;
                targetY = coords2.y + scaledDeltaY;

                if (gridSnapping) {
                    targetX = Math.round(targetX / gridSnapInterval) * gridSnapInterval;
                    targetY = Math.round(targetY / gridSnapInterval) * gridSnapInterval;
                }

                let scale21 = calculateDistance({ x2: coords3.x, y2: coords3.y, x1: coords2.x, y1: coords2.y }, {x: targetX, y: targetY});
                let scale23 = calculateDistance({ x2: coords1.x, y2: coords1.y, x1: coords2.x, y1: coords2.y }, {x: targetX, y: targetY});

                let distMouse21 = Math.sqrt((targetX - coords1.x) ** 2 + (targetY - coords1.y) ** 2);
                let distMouse23 = Math.sqrt((targetX - coords3.x) ** 2 + (targetY - coords3.y) ** 2);
                let distMouse22 = Math.sqrt((targetX - coords2.x) ** 2 + (targetY - coords2.y) ** 2);

                if (distMouse21 < len21 || distMouse22 > distMouse21) scale21 *= -1;
                if (distMouse23 < len23 || distMouse22 > distMouse23) scale23 *= -1;

                newWidth = len21 + scale21;
                newHeight = len23 + scale23;

                cxCoords = coords0;
                break;
            case 3:
                let len30 = Math.sqrt((coords0.x - coords3.x) ** 2 + (coords0.y - coords3.y) ** 2);
                let len32 = Math.sqrt((coords2.x - coords3.x) ** 2 + (coords2.y - coords3.y) ** 2);

                originalWidth = len30;
                originalHeight = len32;

                targetX = coords3.x + scaledDeltaX;
                targetY = coords3.y + scaledDeltaY;

                if (gridSnapping) {
                    targetX = Math.round(targetX / gridSnapInterval) * gridSnapInterval;
                    targetY = Math.round(targetY / gridSnapInterval) * gridSnapInterval;
                }

                let scale30 = calculateDistance({ x2: coords2.x, y2: coords2.y, x1: coords3.x, y1: coords3.y }, {x: targetX, y: targetY});
                let scale32 = calculateDistance({ x2: coords0.x, y2: coords0.y, x1: coords3.x, y1: coords3.y }, {x: targetX, y: targetY});

                let distMouse30 = Math.sqrt((targetX - coords0.x) ** 2 + (targetY - coords0.y) ** 2);
                let distMouse32 = Math.sqrt((targetX - coords2.x) ** 2 + (targetY - coords2.y) ** 2);
                let distMouse33 = Math.sqrt((targetX - coords3.x) ** 2 + (targetY - coords3.y) ** 2);

                if (distMouse30 < len30 || distMouse33 > distMouse30) scale30 *= -1;
                if (distMouse32 < len32 || distMouse33 > distMouse32) scale32 *= -1;

                newWidth = len30 + scale30;
                newHeight = len32 + scale32;

                cxCoords = coords1;
                break;
            default:
                break;
        }

        let cx = cxCoords.x;
        let cy = cxCoords.y;

        sx = originalWidth !== 0 ? newWidth / originalWidth : 0;
        sy = originalHeight !== 0 ? newHeight / originalHeight : 0;

        let decomposed = decomposeMatrix(shapeMatrix);

        if (sx === 0) sx = -0.000001;
        if (sy === 0) sy = -0.000001;

        if (centeredControl) {
            let center = getCenter(boundingBox, shapeMatrix);
            cx = center.x;
            cy = center.y;
        }

        if (shape.type === 'rectangle') {
            // preserve rounded rectangle radius
            shape.rx = Math.abs(shape.rx / sx);
            shape.ry = Math.abs(shape.ry / sy);
        }

        if (decomposed.skewX !== 0) {
            shape.transform[0].parameters = rotateTransform(shape.transform[0].parameters, -decomposed.skewY, cx, cy);
            shape.transform[0].parameters = resizeTransform(shape.transform[0].parameters, sx, sy, cx, cy);
            shape.transform[0].parameters = rotateTransform(shape.transform[0].parameters, decomposed.skewY, cx, cy);
        } else {
            shape.transform[0].parameters = resizeTransform(shape.transform[0].parameters, sx, sy, cx, cy);
        }

        if (shape.type === 'line') {
            for (let i = 0; i < shape.points.length; i += 2) {
                let coords = transformPoint(shape.points[i], shape.points[i + 1], shape.transform[0].parameters);
                shape.points[i] = coords.x;
                shape.points[i + 1] = coords.y;
            }
            shape.transform[0].parameters = [1, 0, 0, 1, 0, 0];
        }

        if (shape.type === 'group') {
            if (sx < 0) { shape.xSign *= -1; }
            if (sy < 0) { shape.ySign *= -1; }
            shape.members = applyGroupTransformations(shape, shapes);
            shape.transform[0].parameters = [1, 0, 0, 1, 0, 0];
        }

        shape.info = getShapeInfo(shape, boundingBoxes[id]);
    });

    return shapes;
}

function determineGroupHandleIndex(handleIndex, shape) {
    switch (handleIndex) {
        case 0:
            if (shape.xSign < 0 && shape.ySign < 0) { return 2; }
            if (shape.xSign < 0) { return 3; }
            if (shape.ySign < 0) { return 1; }
            return 0;
        case 1:
            if (shape.xSign < 0 && shape.ySign < 0) { return 3; }
            if (shape.xSign < 0) { return 2; }
            if (shape.ySign < 0) { return 0; }
            return 1;
        case 2:
            if (shape.xSign < 0 && shape.ySign < 0) { return 0; }
            if (shape.xSign < 0) { return 1; }
            if (shape.ySign < 0) { return 3; }
            return 2;
        case 3:
            if (shape.xSign < 0 && shape.ySign < 0) { return 1; }
            if (shape.xSign < 0) { return 0; }
            if (shape.ySign < 0) { return 2; }
            return 3;
        default:
            break;
    }
}

export function resetShapeSigns(shapes, selected) {
    selected.map((id) => {
        let shape = shapes.byId[id];
        shape.xSign = 1;
        shape.ySign = 1;
        if (shape.type === 'group') {
            shape.members = applyGroupTransformations(shape, shapes);
            shape.transform[0].parameters = [1, 0, 0, 1, 0, 0];
        }
    });

    return shapes;
}

function determineHandleCorner(handleIndex, selectionBoxes, shapeId) {
    if (selectionBoxes) {
        let selectionBox = selectionBoxes[shapeId];
        if (selectionBox) {
            if (selectionBox.lowerLeft === handleIndex) {
                return "lowerLeft";
            } else if (selectionBox.upperLeft === handleIndex) {
                return "upperLeft";
            } else if (selectionBox.upperRight === handleIndex) {
                return "upperRight";
            } else if (selectionBox.lowerRight === handleIndex) {
                return "lowerRight";
            }
        }
    }
    return null;
}

function determineHandle(handleCorner, selectionBoxes, shapeId, handleIndex) {
    if (selectionBoxes && handleCorner) {
        let selectionBox = selectionBoxes[shapeId];
        if (selectionBox) {
            return selectionBox[handleCorner];
        }
    }
    return handleIndex;
}

function determineScale(shape, boundingBoxes, selectionBoxes, draggableData, handleIndex,
    panX, panY, scale, gridSnapping, gridSnapInterval, shiftDirection) {
    let scaleXY = {};

    const { x, y, node } = draggableData;
    let offsetLeft = 0;
    let offsetTop = 0;

    if (node) {
        offsetLeft = node.parentNode.getBoundingClientRect().left;
        offsetTop = node.parentNode.getBoundingClientRect().left;
    }

    let mouseX = (x + (panX * scale) - offsetLeft) / scale;
    let mouseY = (y + (panY * scale) - offsetTop) / scale;

    const shapeMatrix = shape.transform[0].parameters;
    const boundingBox = boundingBoxes[shape.id];

    let coords0 = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y, shapeMatrix);
    let coords1 = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height, shapeMatrix);
    let coords2 = transformPoint(boundingBox.x, boundingBox.y + boundingBox.height, shapeMatrix);
    let coords3 = transformPoint(boundingBox.x, boundingBox.y, shapeMatrix);

    if (shape.type === 'line' && shape.arrowShown === 'yes') {
        coords0 = {x: selectionBoxes[shape.id].handles[0].x, y: selectionBoxes[shape.id].handles[0].y};
        coords1 = {x: selectionBoxes[shape.id].handles[1].x, y: selectionBoxes[shape.id].handles[1].y};
        coords2 = {x: selectionBoxes[shape.id].handles[2].x, y: selectionBoxes[shape.id].handles[2].y};
        coords3 = {x: selectionBoxes[shape.id].handles[3].x, y: selectionBoxes[shape.id].handles[3].y};
    }

    if (gridSnapping) {
        mouseX = Math.round(mouseX / gridSnapInterval) * gridSnapInterval;
        mouseY = Math.round(mouseY / gridSnapInterval) * gridSnapInterval;
    }

    switch (handleIndex) {
        case 0:
            scaleXY = {
                x: (mouseX - coords0.x),
                y: (mouseY - coords0.y)
            };
            break;
        case 1:
            scaleXY = {
                x: (mouseX - coords1.x),
                y: (mouseY - coords1.y)
            };
            break;
        case 2:
            scaleXY = {
                x: (mouseX - coords2.x),
                y: (mouseY - coords2.y)
            };
            break;
        case 3:
            scaleXY = {
                x: (mouseX - coords3.x),
                y: (mouseY - coords3.y)
            };
            break;
        default:
            break;
    }

    switch (shiftDirection) {
        case 'x':
            scaleXY.y = 0;
            break;
        case 'y':
            scaleXY.x = 0;
            break;
        case 'diagonal':
            let newScale = Math.min(Math.abs(scaleXY.x), Math.abs(scaleXY.y));

            if (scaleXY.x < 0) {
                scaleXY.x = newScale * -1;
            } else {
                scaleXY.x = newScale;
            }

            if (scaleXY.y < 0) {
                scaleXY.y = newScale * -1;
            } else {
                scaleXY.y = newScale;
            }
            break;
        default:
            break;
    }

    return scaleXY;
}

function resizeTransform(transform1, sx, sy, cx, cy) {
    let transform2 = [1, 0, 0, 1, 0, 0];
    transform2[0] = sx;
    transform2[3] = sy;
    transform2[4] = cx - cx * sx;
    transform2[5] = cy - cy * sy;
    return multiplyMatrices(transform2, transform1);
}

export function rotateShape(shapes, boundingBoxes, selected, draggableData,
    handleIndex, scale, shapeId, selectionBoxes, centeredControl) {
    if (shapes.byId[shapeId].type === "group") {
        handleIndex = determineGroupHandleIndex(handleIndex, shapes.byId[shapeId]);
    }

    let handleCorner = determineHandleCorner(handleIndex, selectionBoxes, shapeId);
    let degree = determineDegree(shapes, boundingBoxes, selected, draggableData, handleIndex, scale, shapeId, selectionBoxes);

    selected.map((id) => {
        const shape = shapes.byId[id];
        const shapeMatrix = shape.transform[0].parameters;
        const boundingBox = boundingBoxes[id];

        let cx = 0;
        let cy = 0;

        let handle = determineHandle(handleCorner, selectionBoxes, id, handleIndex);
        switch (handle) {
            case 0:
                let cxCoords = transformPoint(boundingBox.x, boundingBox.y + boundingBox.height, shapeMatrix);
                cx = cxCoords.x;
                cy = cxCoords.y;
                break;
            case 1:
                cxCoords = transformPoint(boundingBox.x, boundingBox.y, shapeMatrix);
                cx = cxCoords.x;
                cy = cxCoords.y;
                break;
            case 2:
                cxCoords = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y, shapeMatrix);
                cx = cxCoords.x;
                cy = cxCoords.y;
                break;
            case 3:
                cxCoords = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height, shapeMatrix);
                cx = cxCoords.x;
                cy = cxCoords.y;
                break;
            default:
                break;
        }

        if (centeredControl) {
            let center = getCenter(boundingBox, shapeMatrix);
            cx = center.x;
            cy = center.y;
        }

        shape.transform[0].parameters = rotateTransform(shape.transform[0].parameters, degree, cx, cy);

        if (shape.type === 'line') {
            for (let i = 0; i < shape.points.length; i += 2) {
                let coords = transformPoint(shape.points[i], shape.points[i + 1], shape.transform[0].parameters);
                shape.points[i] = coords.x;
                shape.points[i + 1] = coords.y;
            }
            shape.transform[0].parameters = [1, 0, 0, 1, 0, 0];
        }

        shape.info = getShapeInfo(shape, boundingBoxes[id]);
    });
    return shapes;
}

export function determineDegree(shapes, boundingBoxes, selected, draggableData, handleIndex, scale, id, selectionBoxes) {
    const { deltaX, deltaY } = draggableData;
    const scaledDeltaX = deltaX / scale;
    const scaledDeltaY = deltaY / scale;

    const shape = shapes.byId[id];
    const shapeMatrix = shape.transform[0].parameters;
    const boundingBox = boundingBoxes[id];

    let cx = 0;
    let cy = 0;
    let origCoords = {};
    let newCoords = {};

    switch (handleIndex) {
        case 0:
            let cxCoords = transformPoint(boundingBox.x, boundingBox.y + boundingBox.height, shapeMatrix);
            origCoords = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y, shapeMatrix);
            cx = cxCoords.x;
            cy = cxCoords.y;

            newCoords = { x: origCoords.x + scaledDeltaX, y: origCoords.y + scaledDeltaY };
            break;
        case 1:
            cxCoords = transformPoint(boundingBox.x, boundingBox.y, shapeMatrix);
            origCoords = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height, shapeMatrix);
            cx = cxCoords.x;
            cy = cxCoords.y;

            newCoords = { x: origCoords.x + scaledDeltaX, y: origCoords.y + scaledDeltaY };
            break;
        case 2:
            cxCoords = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y, shapeMatrix);
            origCoords = transformPoint(boundingBox.x, boundingBox.y + boundingBox.height, shapeMatrix);
            cx = cxCoords.x;
            cy = cxCoords.y;

            newCoords = { x: origCoords.x + scaledDeltaX, y: origCoords.y + scaledDeltaY };
            break;
        case 3:
            cxCoords = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height, shapeMatrix);
            origCoords = transformPoint(boundingBox.x, boundingBox.y, shapeMatrix);
            cx = cxCoords.x;
            cy = cxCoords.y;

            newCoords = { x: origCoords.x + scaledDeltaX, y: origCoords.y + scaledDeltaY };
            break;
        default:
            break;
    }

    let v1x = origCoords.x - cx;
    let v1y = origCoords.y - cy;
    let v2x = newCoords.x - cx;
    let v2y = newCoords.y - cy;

    return Math.atan2(v2y, v2x) - Math.atan2(v1y, v1x);
}

function rotateTransform(transform1, a, cx, cy) {
    // https://stackoverflow.com/questions/15133977/how-to-calculate-svg-transform-matrix-from-rotate-translate-scale-values
    let transform2 = [Math.cos(a),
        Math.sin(a),
        -Math.sin(a),
        Math.cos(a),
        -cx * Math.cos(a) + cy * Math.sin(a) + cx,
        -cx * Math.sin(a) - cy * Math.cos(a) + cy];
    return multiplyMatrices(transform2, transform1);
}

function deltaTransformPoint(matrix, point) {
    var dx = point.x * matrix[0] + point.y * matrix[2] + 0;
    var dy = point.x * matrix[1] + point.y * matrix[3] + 0;
    return { x: dx, y: dy };
}

function decomposeMatrix(matrix) {
    // @see https://gist.github.com/2052247

    // calculate delta transform point
    var px = deltaTransformPoint(matrix, { x: 0, y: 1 });
    var py = deltaTransformPoint(matrix, { x: 1, y: 0 });

    // calculate skew
    var skewX = (Math.atan2(px.y, px.x) - 90 * (Math.PI / 180));
    var skewY = (Math.atan2(py.y, py.x));

    return {
        px: px,
        py: py,
        skewX: skewX,
        skewY: skewY
    };
}

function calculateDistance(line, point) {
    // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
    if ((line.y2 - line.y1) ** 2 + (line.x2 - line.x1) ** 2 === 0) return 0;
    return (Math.abs((line.y2 - line.y1) * point.x - (line.x2 - line.x1) * point.y + line.x2 * line.y1 - line.y2 * line.x1) / Math.sqrt((line.y2 - line.y1) ** 2 + (line.x2 - line.x1) ** 2));
}

export function copyShapes(shapes, selected) {
    let copied = {};
    selected.map((id) => {
        let shape = deepCopy(shapes.byId[id]);
        copied[shape.id] = shape;
    });
    return copied;
}

export function pasteShapes(shapes, copied, pasteOffset) {
    Object.keys(copied).map((id) => {
        let shape = deepCopy(copied[id]);
        shape.id = uuidv1();
        let moveMatrix = [1, 0, 0, 1, pasteOffset.x, pasteOffset.y];
        shape.transform[0].parameters = multiplyMatrices(moveMatrix, shape.transform[0].parameters);
        shapes.byId[shape.id] = shape;
        shapes.allIds.push(shape.id);
    });
    return shapes;
}

function getCenter(boundingBox, shapeMatrix) {
    let center = {};

    let coords0 = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y, shapeMatrix);
    let coords1 = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height, shapeMatrix);
    let coords2 = transformPoint(boundingBox.x, boundingBox.y + boundingBox.height, shapeMatrix);
    let coords3 = transformPoint(boundingBox.x, boundingBox.y, shapeMatrix);

    center.x = (coords0.x + coords1.x + coords2.x + coords3.x) / 4;
    center.y = (coords0.y + coords1.y + coords2.y + coords3.y) / 4;

    return center;
}

function getShapeInfo(shape, boundingBox) {
    const shapeInfo = {};

    if (shape.x && shape.y) {
        shapeInfo.x = transformPoint(shape.x, shape.y, shape.transform[0].parameters).x;
        shapeInfo.y = transformPoint(shape.x, shape.y, shape.transform[0].parameters).y;
    }

    shapeInfo.rotation = decomposeMatrix(shape.transform[0].parameters).skewX * 180 / Math.PI % 360;
    if (shapeInfo.rotation < 0) shapeInfo.rotation += 360;

    let coords = [];
    coords[0] = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y, shape.transform[0].parameters);
    coords[1] = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height, shape.transform[0].parameters);
    coords[2] = transformPoint(boundingBox.x, boundingBox.y + boundingBox.height, shape.transform[0].parameters);
    coords[3] = transformPoint(boundingBox.x, boundingBox.y, shape.transform[0].parameters);

    shapeInfo.width = Math.sqrt((coords[0].x - coords[3].x) ** 2 + (coords[0].y - coords[3].y) ** 2);
    shapeInfo.height = Math.sqrt((coords[0].x - coords[1].x) ** 2 + (coords[0].y - coords[1].y) ** 2);

    return shapeInfo;
}

export function moveShapeTo(shapes, selected, action, scale, boundingBoxes, selectionBoxes) {
    action.payload.draggableData = {};
    selected.map((id) => {
        const shape = shapes.byId[id];
        const boundingBox = boundingBoxes[id];
        action.payload.draggableData.deltaX = action.payload.x - transformPoint(boundingBox.x, boundingBox.y, shape.transform[0].parameters).x;
        action.payload.draggableData.deltaY = action.payload.y - transformPoint(boundingBox.x, boundingBox.y, shape.transform[0].parameters).y;
        shapes = moveShape(shapes, selected, action, scale, boundingBoxes, selectionBoxes);
    });
    return shapes;
}

export function resizeShapeTo(shapes, selected, action, scale, boundingBoxes, selectionBoxes) {
    action.payload.draggableData = {};
    let handleIndex = 0;

    selected.map((id) => {
        const shape = shapes.byId[id];
        const boundingBox = boundingBoxes[id];
        let coords = {};
        coords[3] = transformPoint(boundingBox.x, boundingBox.y, shape.transform[0].parameters);

        if (action.payload.x) {
            coords[0] = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y, shape.transform[0].parameters);
            let dt = action.payload.x;
            let d = Math.sqrt((coords[3].x - coords[0].x) ** 2 + (coords[3].y - coords[0].y) ** 2);

            if (d) {
                action.payload.draggableData.x = (1 - dt / d) * coords[3].x + dt / d * coords[0].x;
                action.payload.draggableData.y = (1 - dt / d) * coords[3].y + dt / d * coords[0].y;
            } else {
                action.payload.draggableData.x = coords[3].x + action.payload.x;
                action.payload.draggableData.y = coords[3].y;
            }
            handleIndex = 0;
        }

        if (action.payload.y) {
            coords[2] = transformPoint(boundingBox.x, boundingBox.y + boundingBox.height, shape.transform[0].parameters);
            let dt = action.payload.y;
            let d = Math.sqrt((coords[3].x - coords[2].x) ** 2 + (coords[3].y - coords[2].y) ** 2);

            if (d) {
                action.payload.draggableData.x = (1 - dt / d) * coords[3].x + dt / d * coords[2].x;
                action.payload.draggableData.y = (1 - dt / d) * coords[3].y + dt / d * coords[2].y;
            } else {
                action.payload.draggableData.x = coords[3].x;
                action.payload.draggableData.y = coords[3].y + action.payload.y;
            }
            handleIndex = 2;
        }

        shapes = resizeShape(shapes, boundingBoxes, selected, action.payload.draggableData, handleIndex,
            0, 0, scale, selected[0], selectionBoxes);
    });
    return shapes;
}

export function rotateShapeTo(shapes, selected, action, scale, boundingBoxes, selectionBoxes) {
    selected.map((id) => {
        const shape = shapes.byId[id];
        const boundingBox = boundingBoxes[id];
        let c = transformPoint(boundingBox.x, boundingBox.y, shape.transform[0].parameters);
        let degree = (action.payload.degree - shape.info.rotation);
        shape.transform[0].parameters = rotateTransform(shape.transform[0].parameters, degree * (Math.PI / 180), c.x, c.y);
        shape.info = getShapeInfo(shape, boundingBoxes[id]);
    });
    return shapes;
}

function smoothPath(bezier) {
    let points = bezier.points;

    let path = [];
    let controlPoints = {};

    path.push([points[0], points[1]]);
    path.push([points[0], points[1]]);

    for (let i = 0; i < points.length; i += 2) {
        path.push([points[i], points[i + 1]]);
    }

    if (!bezier.closed) {
        path.push([points[points.length - 4], points[points.length - 3]]);
        path.push([points[points.length - 2], points[points.length - 1]]);
    } else {
        path.push([points[2], points[3]]);
        path.push([points[4], points[5]]);
    }

    let curvePoints = getCurvePoints(path, 1, false, 1);

    for (let i = 1; i <= points.length / 2; i++) {
        controlPoints[i - 1] = {};
        controlPoints[i - 1][0] = curvePoints[i + 1][1];

        if (curvePoints[i + 2]) {
            controlPoints[i - 1][1] = curvePoints[i + 2][0];
        }
    }

    if (bezier.closed) delete controlPoints[0];

    return controlPoints;
}

function getCurvePoints(path) {
    let controlPoints = {};
    for (let i = 1; i < path.length - 1; i += 1) {
        controlPoints[i] = [{}, {}];
        controlPoints[i][0] = controlPoint(path[i - 1], path[i - 2], path[i]);
        controlPoints[i][1] = controlPoint(path[i], path[i - 1], path[i + 1], true);
    }
    // start control point
    return controlPoints;
}

// https://medium.com/@francoisromain/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
function line(pointA, pointB) {
    const lengthX = pointB[0] - pointA[0];
    const lengthY = pointB[1] - pointA[1];
    return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
    };
}

// https://medium.com/@francoisromain/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
function controlPoint(current, previous, next, reverse) {
    // When 'current' is the first or last point of the array
    // 'previous' or 'next' don't exist.
    // Replace with 'current'
    const p = previous || current;
    const n = next || current;

    // Properties of the opposed-line
    const o = line(p, n);

    // If is end-control-point, add PI to the angle to go backward
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * 0.3;

    // The control point position is relative to the current point
    const x = current[0] + Math.cos(angle) * length;
    const y = current[1] + Math.sin(angle) * length;
    return {x: x, y: y};
}
