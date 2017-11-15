import uuidv1 from 'uuid';
import { multiplyMatrices, transformPoint } from './matrix';

export function addRectangle(shapes, action, fill, panX, panY, scale, gridSnapping, minorGrid) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;
    const rectangle = {
        id: uuidv1(),
        type: 'rectangle',
        x: (x + (panX * scale) - node.getBoundingClientRect().left) / scale,
        y: (y + (panY * scale) - node.getBoundingClientRect().top) / scale,
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

export function addLine(shapes, action, fill, panX, panY, scale, gridSnapping, minorGrid) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;

    const line = {
        id: uuidv1(),
        type: "line",
        x1: (x + (panX * scale) - node.getBoundingClientRect().left) / scale,
        y1: (y + (panY * scale) - node.getBoundingClientRect().top) / scale,
        x2: (x + (panX * scale) - node.getBoundingClientRect().left) / scale,
        y2: (y + (panY * scale) - node.getBoundingClientRect().top) / scale,
        stroke: formatColor(fill),
        strokeWidth: 10,
        transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}]
    };

    if (gridSnapping) {
        line.x1 = Math.round(line.x1 / minorGrid) * minorGrid;
        line.y1 = Math.round(line.y1 / minorGrid) * minorGrid;
    }

    shapes.byId[line.id] = line;
    shapes.allIds.push(line.id);
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

export function moveLineAnchor(shapes, selected, draggableData, panX, panY, scale, gridSnapping, minorGrid) {
    const { x, y, node } = draggableData;
    let mouseX = (x + (panX * scale) - node.getBoundingClientRect().left) / scale;
    let mouseY = (y + (panY * scale) - node.getBoundingClientRect().top) / scale;

    selected.map((id) => {
        const line = shapes.byId[id];
        line.x2 = mouseX;
        line.y2 = mouseY;

        if (gridSnapping) {
            line.x2 = Math.round(line.x2 / minorGrid) * minorGrid;
            line.y2 = Math.round(line.y2 / minorGrid) * minorGrid;
        }
    });

    return shapes;
}

export function resizeTextBoundingBox(shapes, selected, draggableData, handleIndex, panX, panY, scale, gridSnapping, minorGrid) {
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

export function initializeMoveShape(shapes, selected, scale, boundingBoxes, gridSnapping, minorGrid) {
    selected.map((id) => {
        const shape = shapes.byId[id];

        const boundingBox = boundingBoxes[id];
        const coords0 = transformPoint(boundingBox.x, boundingBox.y, shape.transform[0].parameters);

        if (gridSnapping) {
            shape.xOffset = coords0.x;
            shape.yOffset = coords0.y;
            shape.dragX = 0;
            shape.dragY = 0;
        }
    });

    return shapes;
}

export function moveShape(shapes, selected, action, scale, boundingBoxes, gridSnapping, minorGrid) {
    const { draggableData } = action.payload;
    const { deltaX, deltaY } = draggableData;
    const scaledDeltaX = deltaX / scale;
    const scaledDeltaY = deltaY / scale;

    selected.map((id) => {
        const shape = shapes.byId[id];
        const boundingBox = boundingBoxes[id];

        if (gridSnapping) {
            const coords0 = transformPoint(boundingBox.x, boundingBox.y, shape.transform[0].parameters);

            shape.dragX += scaledDeltaX;
            shape.dragY += scaledDeltaY;

            let newX = Math.round((shape.xOffset + shape.dragX) / minorGrid) * minorGrid;
            let newY = Math.round((shape.yOffset + shape.dragY) / minorGrid) * minorGrid;

            let moveMatrix = [1, 0, 0, 1, newX - coords0.x, newY - coords0.y];
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

export function resizeShape(shapes, boundingBoxes, selected, draggableData, handleIndex, panX, panY, scale, shapeId, selectionBoxes, gridSnapping, minorGrid) {
    if (typeof (shapes.byId[shapeId]) === "undefined") { shapeId = selected[0]; }
    let scaleXY = determineScale(shapes.byId[shapeId], boundingBoxes, draggableData, handleIndex, panX, panY, scale, gridSnapping, minorGrid);
    let handleCorner = determineHandleCorner(handleIndex, selectionBoxes, shapeId);
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

                let targetX = coords0.x + scaledDeltaX;
                let targetY = coords0.y + scaledDeltaY;

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

                len03 += scale03;
                len01 += scale01;

                newWidth = len03;
                newHeight = len01;

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

                len12 += scale12;
                len10 += scale10;

                newWidth = len12;
                newHeight = len10;

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

                len21 += scale21;
                len23 += scale23;

                newWidth = len21;
                newHeight = len23;

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

                len30 += scale30;
                len32 += scale32;

                newWidth = len30;
                newHeight = len32;

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

        if (sx !== 0 && sy !== 0) {
            if (decomposed.skewX !== 0) {
                shape.transform[0].parameters = rotateTransform(shape.transform[0].parameters, -decomposed.skewY, cx, cy);
                shape.transform[0].parameters = resizeTransform(shape.transform[0].parameters, sx, sy, cx, cy);
                shape.transform[0].parameters = rotateTransform(shape.transform[0].parameters, decomposed.skewY, cx, cy);
            } else {
                shape.transform[0].parameters = resizeTransform(shape.transform[0].parameters, sx, sy, cx, cy);
            }
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

function determineScale(shape, boundingBoxes, draggableData, handleIndex, panX, panY, scale, gridSnapping, minorGrid) {
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

export function rotateShape(shapes, boundingBoxes, selected, draggableData, handleIndex, scale, shapeId, selectionBoxes) {
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
