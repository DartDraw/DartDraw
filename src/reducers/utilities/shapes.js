import uuidv1 from 'uuid';
import { multiplyMatrices, transformPoint } from './matrix';
import { calculateBoundingBox } from './groups';

export function addRectangle(shapes, action, fill, matrix) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;

    const rectangle = {
        id: uuidv1(),
        type: 'rectangle',
        x: (x - node.getBoundingClientRect().left - matrix[4]) / matrix[0],
        y: (y - node.getBoundingClientRect().top - matrix[5]) / matrix[3],
        width: 1,
        height: 1,
        fill: formatColor(fill),
        transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}]
    };

    shapes.byId[rectangle.id] = rectangle;
    shapes.allIds.push(rectangle.id);
    return shapes;
}

export function addLine(shapes, action, fill, matrix) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;

    const line = {
        id: uuidv1(),
        type: "line",
        x1: (x - node.getBoundingClientRect().left - matrix[4]) / matrix[0],
        y1: (y - node.getBoundingClientRect().top - matrix[5]) / matrix[3],
        x2: (x - node.getBoundingClientRect().left - matrix[4]) / matrix[0],
        y2: (y - node.getBoundingClientRect().top - matrix[5]) / matrix[3],
        stroke: formatColor(fill),
        strokeWidth: 10
    };

    shapes.byId[line.id] = line;
    shapes.allIds.push(line.id);
    return shapes;
}

export function moveLineAnchor(shapes, selected, draggableData, matrix) {
    const { deltaX, deltaY } = draggableData;
    const scaledDeltaX = deltaX / matrix[0];
    const scaledDeltaY = deltaY / matrix[3];

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

export function moveShape(shapes, selected, action, matrix) {
    const { draggableData } = action.payload;
    const { deltaX, deltaY } = draggableData;
    const scaledDeltaX = deltaX / matrix[0];
    const scaledDeltaY = deltaY / matrix[3];

    selected.map((id) => {
        const shape = shapes.byId[id];

        if (shape.type === "line") {
            shape.x1 += scaledDeltaX;
            shape.y1 += scaledDeltaY;
            shape.x2 += scaledDeltaX;
            shape.y2 += scaledDeltaY;
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

    // set new x, y, height, width of group shape
    let boundingBox = calculateBoundingBox(group, shapes);
    group.x = boundingBox.x;
    group.y = boundingBox.y;
    group.width = boundingBox.x2 - boundingBox.x;
    group.height = boundingBox.y2 - boundingBox.y;

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
    if (shape.type === "line") {
        const transformedCoordinates = transformPoint(shape.x1, shape.y1, group.transform[0].parameters);
        const transformedDimensions = transformPoint(shape.x2, shape.y2, group.transform[0].parameters);
        shape.x1 = transformedCoordinates.x;
        shape.y1 = transformedCoordinates.y;
        shape.x2 = transformedDimensions.x;
        shape.y2 = transformedDimensions.y;
    } else {
        const transformedCoordinates = transformPoint(shape.x, shape.y, group.transform[0].parameters);
        const transformedDimensions = transformPoint(shape.x + shape.width, shape.y + shape.height, group.transform[0].parameters);
        shape.x = transformedCoordinates.x;
        shape.y = transformedCoordinates.y;
        shape.width = transformedDimensions.x - shape.x;
        shape.height = transformedDimensions.y - shape.y;
    }

    if (shape.type === "group") {
        shape.transform[0].parameters = multiplyMatrices(group.transform[0].parameters, shape.transform[0].parameters);
    }

    return shape;
}

export function removeNegatives(shapes, selected) {
    selected.map((id) => {
        const shape = shapes.byId[id];

        if (shape.type === "group") {
            shapes = removeNegatives(shapes, shape.members);
        } else {
            if (shape.width < 0) {
                shape.x += shape.width;
                shape.width *= -1;
            }

            if (shape.height < 0) {
                shape.y += shape.height;
                shape.height *= -1;
            }
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

export function resizeShape(shapes, selected, draggableData, handleIndex, matrix, group, offSetX, offSetY, isMember) {
    const { deltaX, deltaY } = draggableData;
    const scaledDeltaX = deltaX / matrix[0];
    const scaledDeltaY = deltaY / matrix[3];

    selected.map((id) => {
        const shape = shapes.byId[id];

        let transformedShape = transformPoint(shape.x, shape.y, shape.transform[0].parameters);
        transformedShape.width = transformPoint(shape.x + shape.width, shape.y, shape.transform[0].parameters).x - transformedShape.x;
        transformedShape.height = transformPoint(shape.x, shape.y + shape.height, shape.transform[0].parameters).y - transformedShape.y;

        let originalWidth = transformedShape.width;
        let originalHeight = transformedShape.height;
        let cx = transformedShape.x;
        let cy = transformedShape.y;

        switch (handleIndex) {
            case 0:
                transformedShape.width += scaledDeltaX;
                transformedShape.y += scaledDeltaY;
                transformedShape.height -= scaledDeltaY;

                cx = transformPoint(shape.x, shape.y + shape.height, shape.transform[0].parameters).x;
                cy = transformPoint(shape.x, shape.y + shape.height, shape.transform[0].parameters).y;
                break;
            case 1:
                transformedShape.width += scaledDeltaX;
                transformedShape.height += scaledDeltaY;
                break;
            case 2:
                transformedShape.x += scaledDeltaX;
                transformedShape.width -= scaledDeltaX;
                transformedShape.height += scaledDeltaY;

                cx = transformPoint(shape.x + shape.width, shape.y, shape.transform[0].parameters).x;
                cy = transformPoint(shape.x + shape.width, shape.y, shape.transform[0].parameters).y;
                break;
            case 3:
                transformedShape.x += scaledDeltaX;
                transformedShape.width -= scaledDeltaX;
                transformedShape.y += scaledDeltaY;
                transformedShape.height -= scaledDeltaY;

                cx = transformPoint(shape.x + shape.width, shape.y + shape.height, shape.transform[0].parameters).x;
                cy = transformPoint(shape.x + shape.width, shape.y + shape.height, shape.transform[0].parameters).y;
                break;
            default:
                break;
        }

        let sx = originalWidth !== 0 ? transformedShape.width / originalWidth : 0;
        let sy = originalHeight !== 0 ? transformedShape.height / originalHeight : 0;

        shape.transform[0].parameters = resizeTransform(shape.transform[0].parameters, sx, sy, cx, cy);
    });
    return shapes;
}

function resizeTransform(transform1, sx, sy, cx, cy) {
    let transform2 = [1, 0, 0, 1, 0, 0];
    transform2[0] = sx;
    transform2[3] = sy;
    transform2[4] = cx - cx * sx;
    transform2[5] = cy - cy * sy;
    return multiplyMatrices(transform2, transform1);
}

export function rotateShape(shapes, selected, draggableData, handleIndex, matrix, group, offSetX, offSetY, isMember) {
    const { deltaX, deltaY } = draggableData;
    const scaledDeltaX = deltaX / matrix[0];
    const scaledDeltaY = deltaY / matrix[3];

    selected.map((id) => {
        const shape = shapes.byId[id];
        console.log(shape);

        let degree = 1 * (Math.PI / 180);
        let cx = 0;
        let cy = 0;
        let origCoords = {};
        let newCoords = {};

        switch (handleIndex) {
            case 0:
                let cxCoords = transformPoint(shape.x, shape.y + shape.height, shape.transform[0].parameters);
                origCoords = transformPoint(shape.x + shape.width, shape.y, shape.transform[0].parameters);
                cx = cxCoords.x;
                cy = cxCoords.y;

                newCoords = { x: origCoords.x + scaledDeltaX, y: origCoords.y + scaledDeltaY };
                break;
            case 1:
                cxCoords = transformPoint(shape.x, shape.y, shape.transform[0].parameters);
                origCoords = transformPoint(shape.x + shape.width, shape.y + shape.height, shape.transform[0].parameters);
                cx = cxCoords.x;
                cy = cxCoords.y;

                newCoords = { x: origCoords.x + scaledDeltaX, y: origCoords.y + scaledDeltaY };
                break;
            case 2:
                cxCoords = transformPoint(shape.x + shape.width, shape.y, shape.transform[0].parameters);
                origCoords = transformPoint(shape.x, shape.y + shape.height, shape.transform[0].parameters);
                cx = cxCoords.x;
                cy = cxCoords.y;

                newCoords = { x: origCoords.x + scaledDeltaX, y: origCoords.y + scaledDeltaY };
                break;
            case 3:
                cxCoords = transformPoint(shape.x + shape.width, shape.y + shape.height, shape.transform[0].parameters);
                origCoords = transformPoint(shape.x, shape.y, shape.transform[0].parameters);
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

        degree = Math.atan2(v1x, v1y) - Math.atan2(v2x, v2y);
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
