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
    const matrix = transform[0].parameters;
    const handle0 = transformPoint(x + width, y, matrix);
    const handle1 = transformPoint(x + width, y + height, matrix);
    const handle2 = transformPoint(x, y + height, matrix);
    const handle3 = transformPoint(x, y, matrix);
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
    const matrix = transform[0].parameters;
    const handle0 = transformPoint(x + width, y, matrix);
    const handle1 = transformPoint(x + width, y + height, matrix);
    const handle2 = transformPoint(x, y + height, matrix);
    const handle3 = transformPoint(x, y, matrix);
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
