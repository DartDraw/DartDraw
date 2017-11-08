import uuidv1 from 'uuid';
import { multiplyMatrices, transformPoint } from './matrix';

export function addRectangle(shapes, action, fill, panX, panY, scale) {
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

    shapes.byId[rectangle.id] = rectangle;
    shapes.allIds.push(rectangle.id);
    return shapes;
}

export function addEllipse(shapes, action, fill, panX, panY, scale) {
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

    shapes.byId[ellipse.id] = ellipse;
    shapes.allIds.push(ellipse.id);
    return shapes;
}

export function addLine(shapes, action, fill, panX, panY, scale) {
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

    shapes.byId[line.id] = line;
    shapes.allIds.push(line.id);
    return shapes;
}

export function moveLineAnchor(shapes, selected, draggableData, scale) {
    const { deltaX, deltaY } = draggableData;
    const scaledDeltaX = deltaX / scale;
    const scaledDeltaY = deltaY / scale;

    selected.map((id) => {
        const line = shapes.byId[id];
        line.x2 += scaledDeltaX;
        line.y2 += scaledDeltaY;
    });

    return shapes;
}

export function removeShape(shapes, shapeId) {
    const index = shapes.allIds.indexOf(shapeId);
    delete shapes.byId[shapeId];
    shapes.allIds.splice(index, 1);
    return shapes;
}

export function moveShape(shapes, selected, action, scale) {
    const { draggableData } = action.payload;
    const { deltaX, deltaY } = draggableData;
    const scaledDeltaX = deltaX / scale;
    const scaledDeltaY = deltaY / scale;

    selected.map((id) => {
        const shape = shapes.byId[id];
        let moveMatrix = [1, 0, 0, 1, scaledDeltaX, scaledDeltaY];
        shape.transform[0].parameters = multiplyMatrices(moveMatrix, shape.transform[0].parameters);
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

export function resizeShape(shapes, boundingBoxes, selected, draggableData, handleIndex, scale, shapeId) {
    let scaleXY = determineScale(shapes.byId[shapeId], boundingBoxes, draggableData, handleIndex, scale);
    let scaledDeltaX = scaleXY.x;
    let scaledDeltaY = scaleXY.y;

    selected.map((id) => {
        const shape = shapes.byId[id];
        const shapeMatrix = shape.transform[0].parameters;
        const boundingBox = boundingBoxes[id];

        const coords0 = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y, shapeMatrix);
        const coords1 = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height, shapeMatrix);
        const coords2 = transformPoint(boundingBox.x, boundingBox.y + boundingBox.height, shapeMatrix);
        const coords3 = transformPoint(boundingBox.x, boundingBox.y, shapeMatrix);

        let transformedShape = transformPoint(boundingBox.x, boundingBox.y, shapeMatrix);
        transformedShape.width = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y, shapeMatrix).x - transformedShape.x;
        transformedShape.height = transformPoint(boundingBox.x, boundingBox.y + boundingBox.height, shapeMatrix).y - transformedShape.y;

        let originalWidth = transformedShape.width;
        let originalHeight = transformedShape.height;
        let sx = 0;
        let sy = 0;

        let cxCoords = {};

        switch (handleIndex) {
            case 0:
                let scaleX = calculateDistance({ x2: coords1.x, y2: coords1.y, x1: coords0.x, y1: coords0.y }, {x: coords0.x + scaledDeltaX, y: coords0.y + scaledDeltaY});
                let scaleY = calculateDistance({ x2: coords3.x, y2: coords3.y, x1: coords0.x, y1: coords0.y }, {x: coords0.x + scaledDeltaX, y: coords0.y + scaledDeltaY});

                if (scaledDeltaX < 0) scaleX *= -1;
                if (scaledDeltaY < 0) scaleY *= -1;

                transformedShape.width += scaleX;
                transformedShape.height -= scaleY;

                cxCoords = coords2;
                break;
            case 1:
                scaleX = calculateDistance({ x2: coords0.x, y2: coords0.y, x1: coords1.x, y1: coords1.y }, {x: coords1.x + scaledDeltaX, y: coords1.y + scaledDeltaY});
                scaleY = calculateDistance({ x2: coords2.x, y2: coords2.y, x1: coords1.x, y1: coords1.y }, {x: coords1.x + scaledDeltaX, y: coords1.y + scaledDeltaY});

                if (scaledDeltaX < 0) scaleX *= -1;
                if (scaledDeltaY < 0) scaleY *= -1;

                transformedShape.width += scaleX;
                transformedShape.height += scaleY;

                cxCoords = coords3;
                break;
            case 2:
                scaleX = calculateDistance({ x2: coords3.x, y2: coords3.y, x1: coords2.x, y1: coords2.y }, {x: coords2.x + scaledDeltaX, y: coords2.y + scaledDeltaY});
                scaleY = calculateDistance({ x2: coords1.x, y2: coords1.y, x1: coords2.x, y1: coords2.y }, {x: coords2.x + scaledDeltaX, y: coords2.y + scaledDeltaY});

                if (scaledDeltaX < 0) scaleX *= -1;
                if (scaledDeltaY < 0) scaleY *= -1;

                transformedShape.width -= scaleX;
                transformedShape.height += scaleY;

                cxCoords = coords0;
                break;
            case 3:

                scaleX = calculateDistance({ x2: coords2.x, y2: coords2.y, x1: coords3.x, y1: coords3.y }, {x: coords3.x + scaledDeltaX, y: coords3.y + scaledDeltaY});
                scaleY = calculateDistance({ x2: coords0.x, y2: coords0.y, x1: coords3.x, y1: coords3.y }, {x: coords3.x + scaledDeltaX, y: coords3.y + scaledDeltaY});

                if (scaledDeltaX < 0) scaleX *= -1;
                if (scaledDeltaY < 0) scaleY *= -1;

                transformedShape.width -= scaleX;
                transformedShape.height -= scaleY;

                cxCoords = coords1;
                break;
            default:
                break;
        }

        let cx = cxCoords.x;
        let cy = cxCoords.y;

        sx = originalWidth !== 0 ? transformedShape.width / originalWidth : 0;
        sy = originalHeight !== 0 ? transformedShape.height / originalHeight : 0;

        if (sx === 0) sx = 0.001; // never zero out
        if (sy === 0) sy = 0.001; // never zero out

        let decomposed = decomposeMatrix(shapeMatrix);
        if (decomposed.skewX !== 0) {
            shape.transform[0].parameters = rotateTransform(shape.transform[0].parameters, -decomposed.skewX * Math.PI / 180, cx, cy);
            shape.transform[0].parameters = resizeTransform(shape.transform[0].parameters, sx, sy, cx, cy);
            shape.transform[0].parameters = rotateTransform(shape.transform[0].parameters, decomposed.skewX * Math.PI / 180, cx, cy);
        } else {
            shape.transform[0].parameters = resizeTransform(shape.transform[0].parameters, sx, sy, cx, cy);
        }
    });

    return shapes;
}

function determineScale(shape, boundingBoxes, draggableData, handleIndex, scale) {
    let scaleXY = {};

    if (typeof (shape) === "undefined") {
        scaleXY = {
            x: draggableData.deltaX / scale,
            y: draggableData.deltaY / scale
        };
        return (scaleXY);
    }
    const mouseX = draggableData.x - 45; // hard coded - how calculate offset?
    const mouseY = draggableData.y - 42.28125; // hard coded - how calculate offset?

    const shapeMatrix = shape.transform[0].parameters;
    const boundingBox = boundingBoxes[shape.id];

    const coords0 = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y, shapeMatrix);
    const coords1 = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height, shapeMatrix);
    const coords2 = transformPoint(boundingBox.x, boundingBox.y + boundingBox.height, shapeMatrix);
    const coords3 = transformPoint(boundingBox.x, boundingBox.y, shapeMatrix);

    switch (handleIndex) {
        case 0:
            scaleXY = {
                x: mouseX - coords0.x / scale,
                y: mouseY - coords0.y / scale
            };
            break;
        case 1:
            scaleXY = {
                x: mouseX - coords1.x / scale,
                y: mouseY - coords1.y / scale
            };
            break;
        case 2:
            scaleXY = {
                x: mouseX - coords2.x / scale,
                y: mouseY - coords2.y / scale
            };
            break;
        case 3:
            scaleXY = {
                x: mouseX - coords3.x / scale,
                y: mouseY - coords3.y / scale
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

export function rotateShape(shapes, boundingBoxes, selected, draggableData, handleIndex, scale) {
    const { deltaX, deltaY } = draggableData;
    const scaledDeltaX = deltaX / scale;
    const scaledDeltaY = deltaY / scale;

    selected.map((id) => {
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

        let degree = Math.atan2(v1x, v1y) - Math.atan2(v2x, v2y);
        shape.transform[0].parameters = rotateTransform(shape.transform[0].parameters, degree, cx, cy);
    });
    return shapes;
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
    var skewX = ((180 / Math.PI) * Math.atan2(px.y, px.x) - 90);
    var skewY = ((180 / Math.PI) * Math.atan2(py.y, py.x));

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
