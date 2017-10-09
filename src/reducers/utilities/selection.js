import guid from 'guid';

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
        selectionBoxes[id] = {
            id: guid.create().toString(),
            shapeId: id,
            type: 'selectionBox',
            x: shape.x,
            y: shape.y,
            width: shape.width,
            height: shape.height
        };
    });
    return selectionBoxes;
}

export function updateSelectionBoxes(shapes, selectionBoxes) {
    Object.keys(selectionBoxes).map((shapeId) => {
        const shape = shapes.byId[shapeId];
        selectionBoxes[shapeId].x = shape.x;
        selectionBoxes[shapeId].y = shape.y;
        selectionBoxes[shapeId].width = shape.width;
        selectionBoxes[shapeId].height = shape.height;
    });
    return selectionBoxes;
}
