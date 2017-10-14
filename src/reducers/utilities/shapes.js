import guid from 'guid';

export function createRectangle(rectangle) {
    return {
        id: guid.create().toString(),
        type: 'rectangle',
        ...rectangle
    };
}

export function addShape(shapes, action, fill) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;
    const rectangle = {
        x: x - node.getBoundingClientRect().left,
        y: y - node.getBoundingClientRect().top,
        width: 0,
        height: 0,
        fill: formatColor(fill)
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
    const { deltaX, deltaY } = draggableData;

    selected.map((id) => {
        const shape = shapes.byId[id];
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
    });
    return shapes;
}

export function moveShape(shapes, selected, action) {
    const { draggableData } = action.payload;
    selected.map((id) => {
        const shape = shapes.byId[id];
        if (shape.type === "group") {
            shapes = moveShape(shapes, shape.members, action);
        } else {
            shape.x = shape.x + draggableData.deltaX;
            shape.y = shape.y + draggableData.deltaY;
        }
    });
    return shapes;
}

export function fillShape(shapes, selected, action) {
    const { color } = action.payload;
    selected.map((id) => {
        shapes.byId[id].fill = formatColor(color);
    });
    return shapes;
}

export function formatColor(rgba) {
    const { r, g, b, a } = rgba;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

export function changeZIndex(shapes, selected, change) {
    if (change > 0) {
        for (let i = shapes.allIds.length - 1; i >= 0; i--) {
            if (selected.indexOf(shapes.allIds[i]) > -1) {
                if (i + 1 < shapes.allIds.length && selected.indexOf(shapes.allIds[i + 1]) < 0) {
                    let temp = shapes.allIds[i + 1];
                    shapes.allIds[i + 1] = shapes.allIds[i];
                    shapes.allIds[i] = temp;
                }
            }
        }
    } else {
        for (let i = 0; i < shapes.allIds.length; i++) {
            if (selected.indexOf(shapes.allIds[i]) > -1) {
                if (i - 1 >= 0 && selected.indexOf(shapes.allIds[i - 1]) < 0) {
                    let temp = shapes.allIds[i - 1];
                    shapes.allIds[i - 1] = shapes.allIds[i];
                    shapes.allIds[i] = temp;
                }
            }
        }
    }
    return shapes;
}

export function groupShapes(selected, shapes) {
    let group = {
        id: guid.create().toString(),
        type: "group",
        members: []
    };
    Object.keys(shapes.byId).map((id) => {
        if (selected.indexOf(id) > -1) {
            shapes.byId[id].groupID = group.id;
            group.members.push(id);
        }
    });
    return group;
}
