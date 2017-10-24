import uuidv1 from 'uuid';

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
        if (shape.type === "group" || shape.type === "rectangle") {
            selectionBoxes[id] = generateShapeSelectionBox(id, shape, shapes);
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
        transform: shape.transform
    };
}

export function updateSelectionBoxes(shapes, selectionBoxes) {
    Object.keys(selectionBoxes).map((shapeId) => {
        const shape = shapes.byId[shapeId];
        if (typeof (shape) !== "undefined") {
            let id = selectionBoxes[shapeId].id;
            if (shape.type === "group" || shape.type === "rectangle") {
                selectionBoxes[shapeId] = generateShapeSelectionBox(shapeId, shape, shapes);
                selectionBoxes[shapeId].id = id;
            }
        }
    });
    return selectionBoxes;
}
