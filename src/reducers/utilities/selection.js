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

export function selectShapes(shapes, boundingBoxes, marqueeBox) {
    let selected = [];

    if (marqueeBox.width < 0) {
        marqueeBox.x += marqueeBox.width;
        marqueeBox.width *= -1;
    }

    if (marqueeBox.height < 0) {
        marqueeBox.y += marqueeBox.height;
        marqueeBox.height *= -1;
    }

    shapes.allIds.map((id) => {
        const shapeMatrix = shapes.byId[id].transform[0].parameters;
        const boundingBox = boundingBoxes[id];

        let inBox = 0;
        inBox += pointInBox(marqueeBox, transformPoint(boundingBox.x + boundingBox.width, boundingBox.y, shapeMatrix));
        inBox += pointInBox(marqueeBox, transformPoint(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height, shapeMatrix));
        inBox += pointInBox(marqueeBox, transformPoint(boundingBox.x, boundingBox.y + boundingBox.height, shapeMatrix));
        inBox += pointInBox(marqueeBox, transformPoint(boundingBox.x, boundingBox.y, shapeMatrix));

        if (inBox === 4) {
            selected.push(id);
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

export function updateSelectionBoxes(selected, shapes, selectionBoxes, boundingBoxes) {
    const updatedSelectionBoxes = {};
    selected.map((id) => {
        const shape = shapes.byId[id];
        const selectionBox = selectionBoxes[id];
        const boundingBox = boundingBoxes[id];
        if (selectionBox) {
            if (shape.type !== 'text') {
                updatedSelectionBoxes[id] = updateSelectionBox(selectionBox, shape.transform, boundingBox);
            } else {
                updatedSelectionBoxes[id] = updateSelectionBox(
                    selectionBox,
                    shape.transform,
                    {x: shape.x, y: shape.y, width: shape.width, height: shape.height}
                );
            }
        } else {
            if (shape.type !== 'text') {
                updatedSelectionBoxes[id] = generateSelectionBox(id, shape.transform, boundingBox);
            } else {
                updatedSelectionBoxes[id] = generateSelectionBox(
                    id,
                    shape.transform,
                    {x: shape.x, y: shape.y, width: shape.width, height: shape.height}
                );
            }
        }
    });
    return updatedSelectionBoxes;
}

function updateSelectionBox(selectionBox, transform, boundingBox) {
    const { x, y, height, width } = boundingBox;

    let handle0, handle1, handle2, handle3;
    if (transform && transform[0] && transform[0].parameters) {
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

    selectionBox.x = x;
    selectionBox.y = y;
    selectionBox.height = height;
    selectionBox.width = width;
    selectionBox.transform = transform;
    selectionBox.handles[0].x = handle0.x;
    selectionBox.handles[0].y = handle0.y;
    selectionBox.handles[1].x = handle1.x;
    selectionBox.handles[1].y = handle1.y;
    selectionBox.handles[2].x = handle2.x;
    selectionBox.handles[2].y = handle2.y;
    selectionBox.handles[3].x = handle3.x;
    selectionBox.handles[3].y = handle3.y;
    return selectionBox;
}

function generateSelectionBox(shapeId, transform, boundingBox) {
    // Still have to apply transform to x, y, height, width here:
    const { x, y, height, width } = boundingBox;

    let handle0, handle1, handle2, handle3;
    if (transform && transform[0] && transform[0].parameters) {
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

    return {
        id: uuidv1(),
        shapeId,
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
        ]
    };
}

export function updateSelectionBoxesCorners(selected, selectionBoxes) {
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
