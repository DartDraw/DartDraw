import guid from 'guid';

export function createRectangle({ x, y, width, height }) {
    return {
        id: guid.create().toString(),
        type: 'rectangle',
        originX: x,
        originY: y,
        x,
        y,
        width,
        height
    };
}

export function addShape(shapes, action) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;
    const rectangle = {
        x: x - node.getBoundingClientRect().left,
        y: y - node.getBoundingClientRect().top,
        width: 0,
        height: 0
    };
    const shape = createRectangle(rectangle);
    shapes.byId[shape.id] = shape;
    shapes.allIds.push(shape.id);
    return shapes;
}

export function removeShape(shapes, shapeId) {
    const index = shapes.allIds.indexOf(shapeId);
    delete shapes.byId[shapeId];
    shapes.allIds.splice(index, 1);
    return shapes;
}

export function resizeShape(shapes, selected, action) {
    const shape = shapes.byId[selected[0]];

    const mouseX = action.payload.draggableData.x - action.payload.draggableData.node.getBoundingClientRect().left;
    const mouseY = action.payload.draggableData.y - action.payload.draggableData.node.getBoundingClientRect().top;

    if (mouseX > shape.originX) {
        shape.x = shape.originX;
        shape.width = mouseX - shape.x;
    } else if (mouseX < shape.originX) {
        shape.x = mouseX;
        shape.width = shape.originX - mouseX;
    }

    if (mouseY > shape.originY) {
        shape.y = shape.originY;
        shape.height = mouseY - shape.y;
    } else if (mouseY < shape.originY) {
        shape.y = mouseY;
        shape.height = shape.originY - mouseY;
    }

    return shapes;
}

export function resizeShape2(shapes, lastSavedShapes, selected, action) {
    const { draggableData, handleIndex } = action.payload;
    const shape = shapes.byId[selected[0]];
    const lastSavedShape = lastSavedShapes.byId[selected[0]];

    const mouseX = draggableData.x - draggableData.node.getBoundingClientRect().left;
    const mouseY = draggableData.y - draggableData.node.getBoundingClientRect().top;

    switch (handleIndex) {
        case 0:
            if (mouseX > lastSavedShape.x) {
                shape.x = lastSavedShape.x;
                shape.width = mouseX - shape.x;
            } else {
                shape.x = mouseX;
                shape.width = lastSavedShape.x - mouseX;
            }
            if (mouseY < lastSavedShape.y + lastSavedShape.height) {
                shape.y = mouseY;
                shape.height = lastSavedShape.y + lastSavedShape.height - mouseY;
            } else {
                shape.y = lastSavedShape.y + lastSavedShape.height;
                shape.height = mouseY - shape.y;
            }
            break;
        case 1:
            if (mouseX > lastSavedShape.x) {
                shape.x = lastSavedShape.x;
                shape.width = mouseX - shape.x;
            } else {
                shape.x = mouseX;
                shape.width = lastSavedShape.x - mouseX;
            }
            if (mouseY > lastSavedShape.y) {
                shape.y = lastSavedShape.y;
                shape.height = mouseY - shape.y;
            } else if (mouseY < lastSavedShape.y) {
                shape.y = mouseY;
                shape.height = lastSavedShape.y - mouseY;
            }
            break;
        case 2:
            if (mouseX > lastSavedShape.x + lastSavedShape.width) {
                shape.x = lastSavedShape.x + lastSavedShape.width;
                shape.width = mouseX - shape.x;
            } else {
                shape.x = mouseX;
                shape.width = lastSavedShape.x + lastSavedShape.width - mouseX;
            }
            if (mouseY > lastSavedShape.y) {
                shape.y = lastSavedShape.y;
                shape.height = mouseY - shape.y;
            } else if (mouseY < lastSavedShape.y) {
                shape.y = mouseY;
                shape.height = lastSavedShape.y - mouseY;
            }
            break;
        case 3:
            if (mouseX > lastSavedShape.x + lastSavedShape.width) {
                shape.x = lastSavedShape.x + lastSavedShape.width;
                shape.width = mouseX - shape.x;
            } else {
                shape.x = mouseX;
                shape.width = lastSavedShape.x + lastSavedShape.width - mouseX;
            }
            if (mouseY < lastSavedShape.y + lastSavedShape.height) {
                shape.y = mouseY;
                shape.height = lastSavedShape.y + lastSavedShape.height - mouseY;
            } else {
                shape.y = lastSavedShape.y + lastSavedShape.height;
                shape.height = mouseY - shape.y;
            }
            break;
        default:
            break;
    }
    return shapes;
}

export function moveShape(shapes, action) {
    const { shapeId, draggableData } = action.payload;
    const shape = shapes.byId[shapeId];
    shape.x = shape.x + draggableData.deltaX;
    shape.y = shape.y + draggableData.deltaY;
    return shapes;
}
