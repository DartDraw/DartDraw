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

export function resizeShape(shapes, selected, draggableData, handleIndex) {
    const shape = shapes.byId[selected[0]];
    const { deltaX, deltaY } = draggableData;
    switch (handleIndex) {
        case 0:
            shape.width = shape.width + deltaX;
            shape.y = shape.y + deltaY;
            shape.height = shape.height - deltaY;
            break;
        case 1:
            shape.width = shape.width + deltaX;
            shape.height = shape.height + deltaY;
            break;
        case 2:
            shape.x = shape.x + deltaX;
            shape.width = shape.width - deltaX;
            shape.height = shape.height + deltaY;
            break;
        case 3:
            shape.x = shape.x + deltaX;
            shape.width = shape.width - deltaX;
            shape.y = shape.y + deltaY;
            shape.height = shape.height - deltaY;
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
