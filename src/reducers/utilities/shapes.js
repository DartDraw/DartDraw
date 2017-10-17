import uuidv1 from 'uuid';
import { calculateBoundingBox } from './groups';

export function createRectangle(rectangle) {
    return {
        id: uuidv1(),
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

export function resizeShape(shapes, selected, draggableData, handleIndex, group, offSetX, offSetY, isMember) {
    const { deltaX, deltaY } = draggableData;

    selected.map((id) => {
        const shape = shapes.byId[id];
        if (shape.type === "group") {
            if (typeof (group) === "undefined") {
                group = calculateBoundingBox(shape, shapes, { x: Infinity, x2: 0, y: Infinity, y2: 0 });
            } else {
                group = calculateBoundingBox(shape, shapes, group);
            }
            shapes = resizeShape(shapes, shape.members, draggableData, handleIndex, group, deltaX, deltaY, true);
        } else {
            if (isMember) {
                group.width = group.x2 - group.x;
                group.height = group.y2 - group.y;
                switch (handleIndex) {
                    case 0:
                        shape.x += (shape.x - group.x) / group.width * deltaX;
                        shape.y += (group.y2 - shape.y) / group.height * deltaY;
                        shape.width += shape.width / group.width * deltaX;
                        shape.height -= shape.height / group.height * deltaY;
                        break;
                    case 1:
                        shape.x += (shape.x - group.x) / group.width * deltaX;
                        shape.y += (shape.y - group.y) / group.height * deltaY;
                        shape.width += shape.width / group.width * deltaX;
                        shape.height += shape.height / group.height * deltaY;
                        break;
                    case 2:
                        shape.x += (group.x2 - shape.x) / group.width * deltaX;
                        shape.y += (shape.y - group.y) / group.height * deltaY;
                        shape.width -= shape.width / group.width * deltaX;
                        shape.height += shape.height / group.height * deltaY;
                        break;
                    case 3:
                        shape.x += (group.x2 - shape.x) / group.width * deltaX;
                        shape.y += (group.y2 - shape.y) / group.height * deltaY;
                        shape.width -= shape.width / group.width * deltaX;
                        shape.height -= shape.height / group.height * deltaY;
                        break;
                    default:
                        break;
                }
                if (isNaN(group.width)) { group.width = 1; }
                if (isNaN(group.height)) { group.height = 1; }
            } else {
                switch (handleIndex) {
                    case 0:
                        shape.width += deltaX;
                        shape.y += deltaY;
                        shape.height -= deltaY;
                        break;
                    case 1:
                        shape.width += deltaX;
                        shape.height += deltaY;
                        break;
                    case 2:
                        shape.x += deltaX;
                        shape.width -= deltaX;
                        shape.height += deltaY;
                        break;
                    case 3:
                        shape.x += deltaX;
                        shape.width -= deltaX;
                        shape.y += deltaY;
                        shape.height -= deltaY;
                        break;
                    default:
                        break;
                }
            }
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
        const shape = shapes.byId[id];
        if (shape.type === "group") {
            shapes = fillShape(shapes, shape.members, action);
        } else {
            shape.fill = formatColor(color);
        }
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
        id: uuidv1(),
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

export function removeNegatives(selected, shapes) {
    return shapes;
}
