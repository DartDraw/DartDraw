import uuidv1 from 'uuid';
import { calculateBoundingBox } from './groups';

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

export function generateSelectionBoxes(selected, shapes) {
    const selectionBoxes = {};
    selected.map((id) => {
        const shape = shapes.byId[id];
        if (shape.type === "group") {
            selectionBoxes[id] = generateGroupSelectionBox(id, shape, shapes);
        } else if (shape.type === "rectangle") {
            selectionBoxes[id] = generateShapeSelectionBox(id, shape);
        }
    });
    return selectionBoxes;
}

function generateShapeSelectionBox(id, shape) {
    return {
        id: uuidv1(),
        shapeId: id,
        type: 'selectionBox',
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
        handles: [
            {
                id: uuidv1(),
                x: shape.x + shape.width - 8,
                y: shape.y - 2,
                width: 10,
                height: 10,
                index: 0
            },
            {
                id: uuidv1(),
                x: shape.x + shape.width - 8,
                y: shape.y + shape.height - 8,
                width: 10,
                height: 10,
                index: 1
            },
            {
                id: uuidv1(),
                x: shape.x - 2,
                y: shape.y + shape.height - 8,
                width: 10,
                height: 10,
                index: 2
            },
            {
                id: uuidv1(),
                x: shape.x - 2,
                y: shape.y - 2,
                width: 10,
                height: 10,
                index: 3
            }
        ]
    };
}

function generateGroupSelectionBox(id, shape, shapes) {
    let group = {
        x: Infinity,
        x2: -Infinity,
        y: Infinity,
        y2: -Infinity
    };

    group = calculateBoundingBox(shape, shapes, group);
    const width = group.x2 - group.x;
    const height = group.y2 - group.y;
    return {
        id: uuidv1(),
        shapeId: id,
        type: 'selectionBox',
        x: group.x,
        y: group.y,
        width,
        height,
        handles: [
            {
                id: uuidv1(),
                x: group.x + width - 8,
                y: group.y - 2,
                width: 10,
                height: 10,
                index: 0
            },
            {
                id: uuidv1(),
                x: group.x + width - 8,
                y: group.y + height - 8,
                width: 10,
                height: 10,
                index: 1
            },
            {
                id: uuidv1(),
                x: group.x - 2,
                y: group.y + height - 8,
                width: 10,
                height: 10,
                index: 2
            },
            {
                id: uuidv1(),
                x: group.x - 2,
                y: group.y - 2,
                width: 10,
                height: 10,
                index: 3
            }
        ]
    };
}

function updateShapeSelectionBox(selectionBox, shape) {
    selectionBox.x = shape.x;
    selectionBox.y = shape.y;
    selectionBox.width = shape.width;
    selectionBox.height = shape.height;
    selectionBox.handles = selectionBox.handles.map(handle => {
        switch (handle.index) {
            case 0:
                handle.x = shape.x + shape.width - 8;
                handle.y = shape.y - 2;
                return handle;
            case 1:
                handle.x = shape.x + shape.width - 8;
                handle.y = shape.y + shape.height - 8;
                return handle;
            case 2:
                handle.x = shape.x - 2;
                handle.y = shape.y + shape.height - 8;
                return handle;
            case 3:
                handle.x = shape.x - 2;
                handle.y = shape.y - 2;
                return handle;
        }
    });
    return selectionBox;
}

function updateGroupSelectionBox(id, shape, shapes) {
    let group = {
        x: Infinity,
        x2: -Infinity,
        y: Infinity,
        y2: -Infinity
    };

    group = calculateBoundingBox(shape, shapes, group);

    return {
        id: uuidv1(),
        shapeId: id,
        type: 'selectionBox',
        x: group.x,
        y: group.y,
        width: group.x2 - group.x,
        height: group.y2 - group.y
    };
}

export function updateSelectionBoxes(shapes, selectionBoxes) {
    Object.keys(selectionBoxes).map((shapeId) => {
        const shape = shapes.byId[shapeId];
        if (typeof (shape) !== "undefined") {
            const selectionBox = selectionBoxes[shapeId];
            if (shape.type === "group") {
                selectionBoxes[shapeId] = generateGroupSelectionBox(selectionBox, shape, shapes);
            } else {
                selectionBoxes[shapeId] = updateShapeSelectionBox(selectionBox, shape);
            }
        }
    });
    return selectionBoxes;
}
