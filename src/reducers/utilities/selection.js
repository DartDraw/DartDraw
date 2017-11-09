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

export function updateTextInputs(selected, shapes, textInputs) {
    const updatedTextInputs = {};
    selected.map((id) => {
        const shape = shapes.byId[id];
        if (shape.type === 'text') {
            const textInput = textInputs[id];
            if (textInput) {
                textInput.x = shape.x;
                textInput.y = shape.y;
                textInput.value = shape.text;
                updatedTextInputs[id] = textInput;
            } else {
                updatedTextInputs[id] = {
                    id: uuidv1(),
                    shapeId: id,
                    x: shape.x,
                    y: shape.y,
                    value: shape.text
                };
            }
        }
    });

    return updatedTextInputs;
}

export function updateSelectionBoxes(selected, shapes, selectionBoxes, boundingBoxes) {
    const updatedSelectionBoxes = {};
    selected.map((id) => {
        const shape = shapes.byId[id];
        const selectionBox = selectionBoxes[id];
        const boundingBox = boundingBoxes[id];
        if (selectionBox) {
            updatedSelectionBoxes[id] = updateSelectionBox(selectionBox, shape.transform, boundingBox);
        } else {
            updatedSelectionBoxes[id] = generateSelectionBox(id, shape.transform, boundingBox);
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
