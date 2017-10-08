import guid from 'guid';

export function createRectangle({ x, y, width, height }) {
    return {
        id: guid.create().toString(),
        type: 'rectangle',
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
    const { draggableData } = action.payload;
    const shape = shapes.byId[selected[0]];

    const mouseX = draggableData.x - draggableData.node.getBoundingClientRect().left;
    const mouseY = draggableData.y - draggableData.node.getBoundingClientRect().top;
    const originX = draggableData.originX - draggableData.node.getBoundingClientRect().left;
    const originY = draggableData.originY - draggableData.node.getBoundingClientRect().top;

    if (mouseX > originX) {
        shape.x = originX;
        shape.width = mouseX - shape.x;
    } else if (mouseX < originX) {
        shape.x = mouseX;
        shape.width = originX - mouseX;
    }

    if (mouseY > originY) {
        shape.y = originY;
        shape.height = mouseY - shape.y;
    } else if (mouseY < originY) {
        shape.y = mouseY;
        shape.height = originY - mouseY;
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
