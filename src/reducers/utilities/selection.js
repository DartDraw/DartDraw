import uuidv1 from 'uuid';
import { transformPoint } from '../utilities/matrix';

export function selectShape(selected, shapeId, selectMultiple, shiftSelected) {
    if (!shapeId) { return selected; }

    if (!selectMultiple) {
        return [shapeId];
    }

    if (selected === null || typeof (selected) === "undefined") {
        selected = [];
    }

    if (shiftSelected) {
        if (selected.indexOf(shapeId) > -1) {
            selected.splice(selected.indexOf(shapeId), 1);
        } else {
            selected.push(shapeId);
        }
    }

    return selected;
}

export function selectShapes(shapes, selected, boundingBoxes, marqueeBox, commandSelected, shiftSelected) {
    if (!shiftSelected) {
        selected = [];
    }

    if (selected === null || typeof (selected) === "undefined") {
        selected = [];
    }

    // reverse negatives
    if (marqueeBox.width < 0) {
        marqueeBox.x += marqueeBox.width;
        marqueeBox.width *= -1;
    }

    // reverse negatives
    if (marqueeBox.height < 0) {
        marqueeBox.y += marqueeBox.height;
        marqueeBox.height *= -1;
    }

    shapes.allIds.map((id) => {
        const shapeMatrix = shapes.byId[id].transform[0].parameters;
        const boundingBox = boundingBoxes[id];

        if (!commandSelected) {
            let inBox = 0;
            inBox += pointInBox(marqueeBox, transformPoint(boundingBox.x + boundingBox.width, boundingBox.y, shapeMatrix));
            inBox += pointInBox(marqueeBox, transformPoint(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height, shapeMatrix));
            inBox += pointInBox(marqueeBox, transformPoint(boundingBox.x, boundingBox.y + boundingBox.height, shapeMatrix));
            inBox += pointInBox(marqueeBox, transformPoint(boundingBox.x, boundingBox.y, shapeMatrix));

            if (inBox === 4) {
                selected.push(id);
            }
        } else {
            if (polygonInSelection(marqueeBox, boundingBox, shapeMatrix)) {
                selected.push(id);
            }
        }
    });

    return selected;
}

function pointInBox(box, p) {
    if (box.x <= p.x && p.x <= (box.x + box.width) && box.y <= p.y && p.y <= (box.y + box.height)) {
        return 1;
    }
    return 0;
}

export function updateTextInputs(selected, shapes, textInputs) {
    Object.keys(textInputs).map((id) => {
        const textInput = textInputs[id];
        const shape = shapes.byId[textInput.shapeId];
        if (shape) {
            textInput.x = shape.x;
            textInput.y = shape.y;
            textInput.value = shape.text;
            textInput.visible = (selected.indexOf(shape.id) > -1);
        } else {
            delete textInputs[id];
        }
    });
    selected.map((id) => {
        const shape = shapes.byId[id];
        if (shape.type === 'text') {
            const textInput = textInputs[id];
            if (!textInput) {
                textInputs[id] = {
                    id: uuidv1(),
                    shapeId: id,
                    x: shape.x,
                    y: shape.y,
                    value: shape.text,
                    visible: true
                };
            }
        }
    });

    return textInputs;
}

export function updateSelectionBoxes(selected, shapes, selectionBoxes, boundingBoxes, mode) {
    const updatedSelectionBoxes = {};
    selected.map((id) => {
        const shape = shapes.byId[id];
        const selectionBox = selectionBoxes[id];
        const boundingBox = boundingBoxes[id];

        if (shape.type === 'arrowhead') {
            return;
        }

        if (selectionBox && selectionBox.mode === mode) {
            if (shape.type !== 'text') {
                updatedSelectionBoxes[id] = updateSelectionBox(shape, selectionBox, boundingBox, mode);
            } else {
                updatedSelectionBoxes[id] = updateSelectionBox(
                    shape,
                    selectionBox,
                    {x: shape.x, y: shape.y, width: shape.width, height: shape.height}
                );
            }
        } else {
            if (shape.type !== 'text') {
                updatedSelectionBoxes[id] = generateSelectionBox(shape, boundingBox, mode);
            } else {
                updatedSelectionBoxes[id] = generateSelectionBox(
                    shape,
                    {x: shape.x, y: shape.y, width: shape.width, height: shape.height}
                );
            }
        }

        if (shape.type === 'line' && mode !== 'reshape') {
            updatedSelectionBoxes[id].height = 0;
            updatedSelectionBoxes[id].width = 0;
        }
    });
    return updatedSelectionBoxes;
}

function updateSelectionBox(shape, selectionBox, boundingBox, mode) {
    const { x, y, height, width } = boundingBox;
    selectionBox.x = x;
    selectionBox.y = y;
    selectionBox.height = height;
    selectionBox.width = width;
    selectionBox.transform = shape.transform;
    switch (mode) {
        case 'reshape':
            selectionBox.height = 0;
            selectionBox.width = 0;
            for (let i = 0; i < shape.points.length / 2; i++) {
                if (selectionBox.handles[i]) {
                    selectionBox.handles[i].x = shape.points[i * 2];
                    selectionBox.handles[i].y = shape.points[i * 2 + 1];
                } else {
                    selectionBox.handles.push({ id: uuidv1(), index: i + 1, x: shape.points[i * 2], y: shape.points[i * 2 + 1] });
                }
            }
            return selectionBox;
        default:
            let handle0, handle1, handle2, handle3;
            if (shape.type === 'line') {
                handle0 = { x: Math.max(shape.points[0], shape.points[2]), y: Math.min(shape.points[1], shape.points[3]) };
                handle1 = { x: Math.max(shape.points[0], shape.points[2]), y: Math.max(shape.points[1], shape.points[3]) };
                handle2 = { x: Math.min(shape.points[0], shape.points[2]), y: Math.max(shape.points[1], shape.points[3]) };
                handle3 = { x: Math.min(shape.points[0], shape.points[2]), y: Math.min(shape.points[1], shape.points[3]) };
            } else if (shape.transform && shape.transform[0] && shape.transform[0].parameters) {
                const matrix = shape.transform[0].parameters;
                handle0 = transformPoint(x + width, y, matrix);
                handle1 = transformPoint(x + width, y + height, matrix);
                handle2 = transformPoint(x, y + height, matrix);
                handle3 = transformPoint(x, y, matrix);
            } else {
                handle0 = { x: x + width, y };
                handle1 = { x: x + width, y: y + height };
                handle2 = { x, y: y + height };
                handle3 = { x, y };
            }
            selectionBox.handles[0].x = handle0.x;
            selectionBox.handles[0].y = handle0.y;
            selectionBox.handles[1].x = handle1.x;
            selectionBox.handles[1].y = handle1.y;
            selectionBox.handles[2].x = handle2.x;
            selectionBox.handles[2].y = handle2.y;
            selectionBox.handles[3].x = handle3.x;
            selectionBox.handles[3].y = handle3.y;

            if (shape.type === 'line') {
                selectionBox.handles[4].x = shape.points[0];
                selectionBox.handles[4].y = shape.points[1];
                selectionBox.handles[5].x = shape.points[2];
                selectionBox.handles[5].y = shape.points[3];
                selectionBox.handles[4].index = findClosestHandle(selectionBox.handles[4], selectionBox.handles);
                selectionBox.handles[5].index = findClosestHandle(selectionBox.handles[5], selectionBox.handles);
            }

            return selectionBox;
    }
}

function findClosestHandle(point, handles) {
    let minHandle = 0;
    let minDistance = Math.sqrt((handles[0].x - point.x) ** 2 + (handles[0].y - point.y) ** 2);

    for (let i = 1; i <= 3; i++) {
        let distance = Math.sqrt((handles[i].x - point.x) ** 2 + (handles[i].y - point.y) ** 2);
        if (distance < minDistance) {
            minDistance = distance;
            minHandle = i;
        }
    }
    return minHandle;
}

function generateSelectionBox(shape, boundingBox, mode) {
    // Still have to apply transform to x, y, height, width here:
    const { x, y, height, width } = boundingBox;
    const transform = shape.transform;

    switch (mode) {
        case 'reshape':
            let handles = [];
            if (shape.points) {
                for (let i = 0; i < shape.points.length / 2; i++) {
                    handles.push({id: uuidv1(), index: i, x: shape.points[i * 2], y: shape.points[i * 2 + 1]});
                }
            }

            return {
                id: uuidv1(),
                shapeId: shape.id,
                shapeType: shape.type,
                type: 'selectionBox',
                x,
                y,
                height: 0,
                width: 0,
                transform,
                handles,
                mode
            };
        default:

            let handle0, handle1, handle2, handle3;
            if (shape.type === 'line') {
                handle0 = { x: Math.max(shape.points[0], shape.points[2]), y: Math.min(shape.points[1], shape.points[3]) };
                handle1 = { x: Math.max(shape.points[0], shape.points[2]), y: Math.max(shape.points[1], shape.points[3]) };
                handle2 = { x: Math.min(shape.points[0], shape.points[2]), y: Math.max(shape.points[1], shape.points[3]) };
                handle3 = { x: Math.min(shape.points[0], shape.points[2]), y: Math.min(shape.points[1], shape.points[3]) };
            } else if (transform && transform[0] && transform[0].parameters) {
                const matrix = transform[0].parameters;
                handle0 = transformPoint(x + width, y, matrix);
                handle1 = transformPoint(x + width, y + height, matrix);
                handle2 = transformPoint(x, y + height, matrix);
                handle3 = transformPoint(x, y, matrix);
            } else {
                handle0 = { x: x + width, y };
                handle1 = { x: x + width, y: y + height };
                handle2 = { x, y: y + height };
                handle3 = { x, y };
            }

            const box = {
                id: uuidv1(),
                shapeId: shape.id,
                shapeType: shape.type,
                type: 'selectionBox',
                x,
                y,
                height,
                width,
                transform,
                handles: [
                    { id: uuidv1(), index: 0, x: handle0.x, y: handle0.y },
                    { id: uuidv1(), index: 1, x: handle1.x, y: handle1.y },
                    { id: uuidv1(), index: 2, x: handle2.x, y: handle2.y },
                    { id: uuidv1(), index: 3, x: handle3.x, y: handle3.y }
                ],
                mode
            };

            if (shape.type === 'line') {
                box.handles.push({ id: uuidv1(), index: 3, x: shape.points[0], y: shape.points[1] });
                box.handles.push({ id: uuidv1(), index: 1, x: shape.points[2], y: shape.points[3] });
                box.handles[4].index = findClosestHandle(box.handles[4], box.handles);
                box.handles[5].index = findClosestHandle(box.handles[5], box.handles);
            }

            return box;
    }
}

export function updateSelectionBoxesCorners(selected, selectionBoxes, mode) {
    if (mode === 'reshape') return selectionBoxes;

    const updatedSelectionBoxes = {};
    selected.map((id) => {
        const selectionBox = selectionBoxes[id];
        if (selectionBox) {
            updatedSelectionBoxes[id] = updateSelectionBoxCorners(selectionBox);
        }
    });
    return updatedSelectionBoxes;
}

function updateSelectionBoxCorners(selectionBox) {
    let xValues = [selectionBox.handles[0].x, selectionBox.handles[1].x,
        selectionBox.handles[2].x, selectionBox.handles[3].x];
    let yValues = [selectionBox.handles[0].y, selectionBox.handles[1].y,
        selectionBox.handles[2].y, selectionBox.handles[3].y];

    for (let i = 0; i < 4; i++) {
        selectionBox[determineCornerOrientation(xValues, yValues, i)] = i;
    }

    return selectionBox;
}

function determineCornerOrientation(xValues, yValues, index) {
    let xGreaterCount = 0;
    let yGreaterCount = 0;

    for (let i = 0; i < 4; i++) {
        if (i !== index) {
            if (xValues[i] > xValues[index]) {
                xGreaterCount++;
            }
            if (yValues[i] > yValues[index]) {
                yGreaterCount++;
            }
        }
    }

    if (xGreaterCount >= 2 && yGreaterCount < 2) {
        return "lowerLeft";
    } else if (xGreaterCount >= 2 && yGreaterCount >= 2) {
        return "upperLeft";
    } else if (xGreaterCount < 2 && yGreaterCount >= 2) {
        return "upperRight";
    } else if (xGreaterCount < 2 && yGreaterCount < 2) {
        return "lowerRight";
    }
}

function polygonInSelection(marqueeBox, boundingBox, shapeMatrix) {
    // adapted from http://stackoverflow.com/questions/10962379/how-to-check-intersection-between-2-rotated-rectangles/12414951#12414951
    const rect1 = [{ x: marqueeBox.x + marqueeBox.width, y: marqueeBox.y },
        { x: marqueeBox.x + marqueeBox.width, y: marqueeBox.y + marqueeBox.height },
        { x: marqueeBox.x, y: marqueeBox.y + marqueeBox.height },
        { x: marqueeBox.x, y: marqueeBox.y }
    ];

    const rect2 = [transformPoint(boundingBox.x + boundingBox.width, boundingBox.y, shapeMatrix),
        transformPoint(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height, shapeMatrix),
        transformPoint(boundingBox.x, boundingBox.y + boundingBox.height, shapeMatrix),
        transformPoint(boundingBox.x, boundingBox.y, shapeMatrix)];

    var polygons = [rect1, rect2];
    var minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

            minA = maxA = undefined;

            for (let j = 0; j < rect1.length; j++) {
                projected = normal.x * rect1[j].x + normal.y * rect1[j].y;
                if (typeof (minA) === "undefined" || projected < minA) {
                    minA = projected;
                }
                if (typeof (maxA) === "undefined" || projected > maxA) {
                    maxA = projected;
                }
            }

            minB = maxB = undefined;
            for (j = 0; j < rect2.length; j++) {
                projected = normal.x * rect2[j].x + normal.y * rect2[j].y;
                if (typeof (minB) === "undefined" || projected < minB) {
                    minB = projected;
                }
                if (typeof (maxB) === "undefined" || projected > maxB) {
                    maxB = projected;
                }
            }

            if (maxA < minB || maxB < minA) {
                return false;
            }
        }
    }
    return true;
}

export function determineShiftDirection(action, scale, shiftSelected) {
    const { draggableData } = action.payload;
    const { deltaX, deltaY } = draggableData;
    let scaledDeltaX = deltaX / scale;
    let scaledDeltaY = deltaY / scale;

    if (shiftSelected) {
        if (scaledDeltaY === 0 && scaledDeltaX === 0) {
            return "diagonal";
        }

        let angle = Math.atan2(scaledDeltaY, scaledDeltaX) + Math.PI;
        angle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);

        if ((5 * Math.PI / 6 <= angle && angle <= 7 * Math.PI / 6) || angle >= 11 * Math.PI / 6) {
            return "x";
        } else if ((Math.PI / 3 <= angle && angle <= 2 * Math.PI / 3) || (4 * Math.PI / 3 <= angle && angle < 5 * Math.PI / 3)) {
            return "y";
        } else {
            return "diagonal";
        }
    }

    return null;
}
