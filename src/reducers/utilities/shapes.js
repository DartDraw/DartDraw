import uuidv1 from 'uuid';
import multiplyMatrices from 'transformation-matrix-js';
import { calculateBoundingBox } from './groups';

export function addRectangle(shapes, action, fill, matrix) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;

    const rectangle = {
        id: uuidv1(),
        type: 'rectangle',
        x: (x - node.getBoundingClientRect().left - matrix[4]) / matrix[0],
        y: (y - node.getBoundingClientRect().top - matrix[5]) / matrix[3],
        width: 0,
        height: 0,
        fill: formatColor(fill)
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
        stroke: formatColor(fill)
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
        if (shape.type === "group") {
            shapes = moveShape(shapes, shape.members, action, matrix);
        }
        shape.x = shape.x + scaledDeltaX;
        shape.y = shape.y + scaledDeltaY;
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

    let boundingBox = calculateBoundingBox(group, shapes);
    group.x = boundingBox.x;
    group.y = boundingBox.y;
    group.width = boundingBox.x2 - boundingBox.x;
    group.height = boundingBox.y2 - boundingBox.y;
    group.originalWidth = group.width;
    group.originalHeight = group.height;

    group.transform = [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}];
    return group;
}

export function ungroupShapes(selected, shapes) {
    let members = [];
    selected.map((id) => {
        if (shapes.byId[id].type === "group") {
            let i = shapes.allIds.indexOf(id);
            shapes.allIds.splice(shapes.allIds.indexOf(id), 1);
            shapes.byId[id].members.map((memberId) => {
                members.push(memberId);
                shapes.allIds.splice(i, 0, memberId);
                i += 1;
                // APPLY TRANSOFRMATIONS HERE
            });
            delete shapes.byId[id];
        } else {
            members.push(id);
        }
    });
    return members;
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
        switch (handleIndex) {
            case 0:
                shape.width = shape.width + scaledDeltaX;
                shape.y = shape.y + scaledDeltaY;
                shape.height = shape.height - scaledDeltaY;

                if (shape.type === "group") {
                    shape.transform = updateTransform(shape.transform,
                        (scaledDeltaX + shape.width) / shape.originalWidth,
                        (scaledDeltaY + shape.height) / shape.originalHeight,
                        shape.x,
                        shape.y + shape.height);
                }
                break;
            case 1:
                shape.width = shape.width + scaledDeltaX;
                shape.height = shape.height + scaledDeltaY;

                if (shape.type === "group") {
                    shape.transform = updateTransform(shape.transform,
                        (scaledDeltaX + shape.width) / shape.originalWidth,
                        (scaledDeltaY + shape.height) / shape.originalHeight,
                        shape.x,
                        shape.y);
                }
                break;
            case 2:
                shape.x = shape.x + scaledDeltaX;
                shape.width = shape.width - scaledDeltaX;
                shape.height = shape.height + scaledDeltaY;

                if (shape.type === "group") {
                    shape.transform = updateTransform(shape.transform,
                        (scaledDeltaX + shape.width) / shape.originalWidth,
                        (scaledDeltaY + shape.height) / shape.originalHeight,
                        shape.x + shape.width,
                        shape.y);
                }
                break;
            case 3:
                shape.x = shape.x + scaledDeltaX;
                shape.width = shape.width - scaledDeltaX;
                shape.y = shape.y + scaledDeltaY;
                shape.height = shape.height - scaledDeltaY;

                if (shape.type === "group") {
                    shape.transform = updateTransform(shape.transform,
                        (scaledDeltaX + shape.width) / shape.originalWidth,
                        (scaledDeltaY + shape.height) / shape.originalHeight,
                        shape.x + shape.width,
                        shape.y + shape.height);
                }
                break;
            default:
                break;
        }
    });
    return shapes;
}

function updateTransform(transform, sx, sy, cx, cy) {
    let i = 0;
    transform[i].parameters[0] = sx;
    transform[i].parameters[3] = sy;
    transform[i].parameters[4] = cx - cx * transform[i].parameters[0];
    transform[i].parameters[5] = cy - cy * transform[i].parameters[3];
    return transform;
}
