import uuidv1 from 'uuid';
import { multiplyMatrices, transformPoint } from './matrix';
import { deepCopy } from './object';

export function addRectangle(shapes, action, fill, panX, panY, scale, gridSnapping, minorGrid, rectangleRadius) {
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
        transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}]
    };

    if (gridSnapping) {
        rectangle.x = Math.round(rectangle.x / minorGrid) * minorGrid;
        rectangle.y = Math.round(rectangle.y / minorGrid) * minorGrid;
    }

    shapes.byId[rectangle.id] = rectangle;
    shapes.allIds.push(rectangle.id);
    return shapes;
}

export function addEllipse(shapes, action, fill, panX, panY, scale, gridSnapping, minorGrid) {
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
        transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}]
    };

    if (gridSnapping) {
        ellipse.cx = Math.round(ellipse.cx / minorGrid) * minorGrid;
        ellipse.cy = Math.round(ellipse.cy / minorGrid) * minorGrid;
    }

    shapes.byId[ellipse.id] = ellipse;
    shapes.allIds.push(ellipse.id);
    return shapes;
}

export function addPolygon(shapes, action, fill, panX, panY, scale, gridSnapping, minorGrid) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;

    const polygon = {
        id: uuidv1(),
        type: 'polyline',
        points: [(x + (panX * scale) - node.getBoundingClientRect().left) / scale,
            (y + (panY * scale) - node.getBoundingClientRect().top) / scale],
        fill: formatColor(fill),
        transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}],
        stroke: 'black',
        strokeWidth: 5
    };

    if (gridSnapping) {
        polygon.points[0] = Math.round(polygon.points[0] / minorGrid) * minorGrid;
        polygon.points[1] = Math.round(polygon.points[1] / minorGrid) * minorGrid;
    }

    shapes.byId[polygon.id] = polygon;
    shapes.allIds.push(polygon.id);
    return shapes;
}

export function addPolygonPoint(shapes, selected, action, panX, panY, scale, gridSnapping, minorGrid) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;

    const polygon = shapes.byId[selected[0]];
    let xCoord = (x + (panX * scale) - node.getBoundingClientRect().left) / scale;
    let yCoord = (y + (panY * scale) - node.getBoundingClientRect().top) / scale;

    if (gridSnapping) {
        xCoord = (Math.round(xCoord / minorGrid) * minorGrid);
        yCoord = (Math.round(yCoord / minorGrid) * minorGrid);
    }

    if (Math.abs(xCoord - polygon.points[0]) < (5 / scale) &&
          Math.abs(yCoord - polygon.points[1]) < (5 / scale)) {
        // close the polygon
        xCoord = polygon.points[0];
        yCoord = polygon.points[1];
        polygon.type = 'polygon';
    }

    polygon.points.push(xCoord);
    polygon.points.push(yCoord);

    return shapes;
}

export function addLine(shapes, action, fill, panX, panY, scale, gridSnapping, minorGrid) {
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
        transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}]
    };

    if (gridSnapping) {
        line.points[0] = Math.round(line.points[0] / minorGrid) * minorGrid;
        line.points[1] = Math.round(line.points[1] / minorGrid) * minorGrid;
    }

    shapes.byId[line.id] = line;
    shapes.allIds.push(line.id);
    return shapes;
}

export function addArc(shapes, action, fill, panX, panY, scale, gridSnapping, minorGrid) {
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
        transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}]
    };

    if (gridSnapping) {
        arc.points[0] = Math.round(arc.points[0] / minorGrid) * minorGrid;
        arc.points[1] = Math.round(arc.points[1] / minorGrid) * minorGrid;
    }

    arc.points[2] = arc.points[0];
    arc.points[3] = arc.points[1];

    shapes.byId[arc.id] = arc;
    shapes.allIds.push(arc.id);
    return shapes;
}

export function addFreehandPath(shapes, action, fill, panX, panY, scale, gridSnapping, minorGrid) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;

    const path = {
        id: uuidv1(),
        type: 'freehandPath',
        points: [(x + (panX * scale) - node.getBoundingClientRect().left) / scale,
            (y + (panY * scale) - node.getBoundingClientRect().top) / scale],
        fill: formatColor(fill),
        transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}],
        stroke: 'black',
        strokeWidth: 1
    };

    if (gridSnapping) {
        path.points[0] = Math.round(path.points[0] / minorGrid) * minorGrid;
        path.points[1] = Math.round(path.points[1] / minorGrid) * minorGrid;
    }

    shapes.byId[path.id] = path;
    shapes.allIds.push(path.id);
    return shapes;
}

export function addText(shapes, action, fill, panX, panY, scale, gridSnapping, minorGrid) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;

    const text = {
        id: uuidv1(),
        type: 'text',
        text: '',
        x: (x + (panX * scale) - node.getBoundingClientRect().left) / scale,
        y: (y + (panY * scale) - node.getBoundingClientRect().top) / scale,
        width: 0,
        height: 0,
        fill: formatColor(fill),
        transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}]
    };

    if (gridSnapping) {
        text.x = Math.round(text.x / minorGrid) * minorGrid;
        text.y = Math.round(text.y / minorGrid) * minorGrid;
    }

    shapes.byId[text.id] = text;
    shapes.allIds.push(text.id);
    return shapes;
}

export function moveLineAnchor(shapes, selected, draggableData, panX, panY, scale, gridSnapping, minorGrid, centeredControl) {
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
            line.points[2] = Math.round(line.points[2] / minorGrid) * minorGrid;
            line.points[3] = Math.round(line.points[3] / minorGrid) * minorGrid;
        }

        if (centeredControl) {
            line.points[0] -= (line.points[2] - oldX2);
            line.points[1] -= (line.points[3] - oldY2);
        }
    });

    return shapes;
}

export function moveArcAnchor(shapes, selected, draggableData, panX, panY, scale, gridSnapping, minorGrid) {
    const { x, y, node } = draggableData;
    let mouseX = (x + (panX * scale) - node.getBoundingClientRect().left) / scale;
    let mouseY = (y + (panY * scale) - node.getBoundingClientRect().top) / scale;

    selected.map((id) => {
        const arc = shapes.byId[id];
        arc.points[2] = mouseX;
        arc.points[3] = mouseY;

        if (gridSnapping) {
            arc.points[2] = Math.round(arc.points[2] / minorGrid) * minorGrid;
            arc.points[3] = Math.round(arc.points[3] / minorGrid) * minorGrid;
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

export function addFreehandPathPoint(shapes, selected, draggableData, panX, panY, scale, gridSnapping, minorGrid) {
    const { x, y, node } = draggableData;
    let mouseX = (x + (panX * scale) - node.getBoundingClientRect().left) / scale;
    let mouseY = (y + (panY * scale) - node.getBoundingClientRect().top) / scale;

    if (gridSnapping) {
        mouseX = Math.round(mouseX / minorGrid) * minorGrid;
        mouseY = Math.round(mouseY / minorGrid) * minorGrid;
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

export function initializeMoveShape(shapes, selected, scale, boundingBoxes, selectionBoxes, gridSnapping, minorGrid, align) {
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
    coords[0] = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y, shape.transform[0].parameters);
    coords[1] = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height, shape.transform[0].parameters);
    coords[2] = transformPoint(boundingBox.x, boundingBox.y + boundingBox.height, shape.transform[0].parameters);
    coords[3] = transformPoint(boundingBox.x, boundingBox.y, shape.transform[0].parameters);

    let center = getCenter(boundingBox, shape.transform[0].parameters);
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
    selectionBoxes, gridSnapping, minorGrid, align, shiftDirection) {
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

                let newX = Math.round((shape.xOffset + shape.dragX) / minorGrid) * minorGrid;
                let newY = Math.round((shape.yOffset + shape.dragY) / minorGrid) * minorGrid;

                let moveMatrix = [1, 0, 0, 1, newX - coord.x, newY - coord.y];
                shape.transform[0].parameters = multiplyMatrices(moveMatrix, shape.transform[0].parameters);
            }
        } else {
            let moveMatrix = [1, 0, 0, 1, scaledDeltaX, scaledDeltaY];
            shape.transform[0].parameters = multiplyMatrices(moveMatrix, shape.transform[0].parameters);
        }
    });

    return shapes;
}

export function keyboardMoveShape(shapes, selected, action, scale, boundingBoxes, selectionBoxes, gridSnapping, minorGrid, align) {
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

            let dragX = scaledDeltaX * minorGrid;
            let dragY = scaledDeltaY * minorGrid;

            let newX = Math.round((coord.x + dragX) / minorGrid) * minorGrid;
            let newY = Math.round((coord.y + dragY) / minorGrid) * minorGrid;

            let moveMatrix = [1, 0, 0, 1, newX - coord.x, newY - coord.y];
            shape.transform[0].parameters = multiplyMatrices(moveMatrix, shape.transform[0].parameters);
        } else {
            let moveMatrix = [1, 0, 0, 1, scaledDeltaX, scaledDeltaY];
            shape.transform[0].parameters = multiplyMatrices(moveMatrix, shape.transform[0].parameters);
        }
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
        members: []
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
    return shape;
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
            case 'arc':
                for (let i = 0; i < shape.points.length; i += 2) {
                    let coords = transformPoint(shape.points[i], shape.points[i + 1], shapeMatrix);
                    shape.points[i] = coords.x;
                    shape.points[i + 1] = coords.y;
                    shape.center = transformPoint(shape.center.x, shape.center.y, shapeMatrix);
                }

                let rxSign = Math.sign(shape.rx);
                let rySign = Math.sign(shape.ry);

                shape.rx = (transformPoint(0, 0, shapeMatrix).x - transformPoint(shape.rx, 0, shapeMatrix).x);
                shape.ry = (transformPoint(0, 0, shapeMatrix).y - transformPoint(0, shape.ry, shapeMatrix).y);

                if (!((Math.sign(shape.rx) === rxSign && Math.sign(shape.ry) === rySign) ||
                        (Math.sign(shape.rx) !== rxSign && Math.sign(shape.ry) !== rySign))) {
                    shape.points = [shape.points[2], shape.points[3], shape.points[0], shape.points[1]];
                }

                shape.transform[0].parameters = [1, 0, 0, 1, 0, 0];
                break;
            default:
                break;
        }
    });
    return shapes;
}

export function reshape(shapes, selected, draggableData, handleIndex, panX, panY, scale, gridSnapping, minorGrid) {
    const { x, y, node } = draggableData;
    let mouseX = (x + (panX * scale) - node.parentNode.getBoundingClientRect().left) / scale;
    let mouseY = (y + (panY * scale) - node.parentNode.getBoundingClientRect().top) / scale;

    if (gridSnapping) {
        mouseX = Math.round(mouseX / minorGrid) * minorGrid;
        mouseY = Math.round(mouseY / minorGrid) * minorGrid;
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
            default:
                break;
        }
    });
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
    panX, panY, scale, shapeId, selectionBoxes, gridSnapping, minorGrid, shiftDirection, centeredControl) {
    if (typeof (shapes.byId[shapeId]) === "undefined") { shapeId = selected[0]; }

    let handleCorner = determineHandleCorner(handleIndex, selectionBoxes, shapeId);
    let scaleXY = determineScale(shapes.byId[shapeId], boundingBoxes, draggableData, handleIndex,
        panX, panY, scale, gridSnapping, minorGrid, shiftDirection);
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
                    targetX = Math.round(targetX / minorGrid) * minorGrid;
                    targetY = Math.round(targetY / minorGrid) * minorGrid;
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
                    targetX = Math.round(targetX / minorGrid) * minorGrid;
                    targetY = Math.round(targetY / minorGrid) * minorGrid;
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
                    targetX = Math.round(targetX / minorGrid) * minorGrid;
                    targetY = Math.round(targetY / minorGrid) * minorGrid;
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
                    targetX = Math.round(targetX / minorGrid) * minorGrid;
                    targetY = Math.round(targetY / minorGrid) * minorGrid;
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

        if (sx === 0) sx = 0.000001;
        if (sy === 0) sy = 0.000001;

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

function determineScale(shape, boundingBoxes, draggableData, handleIndex,
    panX, panY, scale, gridSnapping, minorGrid, shiftDirection) {
    let scaleXY = {};

    const { x, y, node } = draggableData;
    let mouseX = (x + (panX * scale) - node.getBoundingClientRect().left) / scale;
    let mouseY = (y + (panY * scale) - node.getBoundingClientRect().top) / scale;

    const shapeMatrix = shape.transform[0].parameters;
    const boundingBox = boundingBoxes[shape.id];

    let coords0 = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y, shapeMatrix);
    let coords1 = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height, shapeMatrix);
    let coords2 = transformPoint(boundingBox.x, boundingBox.y + boundingBox.height, shapeMatrix);
    let coords3 = transformPoint(boundingBox.x, boundingBox.y, shapeMatrix);

    if (gridSnapping) {
        mouseX = Math.round(mouseX / minorGrid) * minorGrid;
        mouseY = Math.round(mouseY / minorGrid) * minorGrid;
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
