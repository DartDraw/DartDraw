import { reshape, updateHandles, setArrowheadType } from '../utilities/arrowhead';

export function arrowheadHandleDrag(stateCopy, action, root) {
    const { draggableData, handleIndex } = action.payload;

    stateCopy.currentArrowhead = reshape(stateCopy.currentArrowhead, draggableData, handleIndex);

    return stateCopy;
}

export function changeArrowheadType(stateCopy, action, root) {
    const { arrowheadType } = action.payload;

    stateCopy.currentArrowhead = setArrowheadType(arrowheadType);

    return stateCopy;
}

export function changeArrowheadHeight(stateCopy, action, root) {
    const { height } = action.payload;
    var { currentArrowhead } = stateCopy;

    switch (currentArrowhead.type) {
        case "triangle":
        case "polyline":
        case "barbed":
            currentArrowhead.points[1] = 75 - height / 2;
            currentArrowhead.points[5] = 75 + height / 2;
            break;
        case "rectangle":
            currentArrowhead.y = 75 - height / 2;
            currentArrowhead.height = height;
            break;
        default: break;
    }

    currentArrowhead.handles = updateHandles(currentArrowhead);

    return stateCopy;
}

export function changeArrowheadLength(stateCopy, action, root) {
    const { length } = action.payload;
    var { currentArrowhead } = stateCopy;

    switch (currentArrowhead.type) {
        case "triangle":
        case "polyline":
            currentArrowhead.points[0] = currentArrowhead.points[2] - length;
            currentArrowhead.points[4] = currentArrowhead.points[2] - length;
            break;
        case "barbed":
            const barbLength = currentArrowhead.points[6] - currentArrowhead.points[0];
            currentArrowhead.points[0] = currentArrowhead.points[2] - length;
            currentArrowhead.points[4] = currentArrowhead.points[2] - length;
            currentArrowhead.points[6] = currentArrowhead.points[0] + barbLength;
            break;
        case "rectangle":
            currentArrowhead.x += currentArrowhead.width - length;
            currentArrowhead.width = length;
            break;
        default: break;
    }

    currentArrowhead.handles = updateHandles(currentArrowhead);

    return stateCopy;
}

export function changeArrowheadBarbLength(stateCopy, action, root) {
    const { length } = action.payload;
    var { currentArrowhead } = stateCopy;

    currentArrowhead.points[6] = currentArrowhead.points[0] + length;

    currentArrowhead.handles = updateHandles(currentArrowhead);

    return stateCopy;
}

export function changeArrowheadRadiusX(stateCopy, action, root) {
    const { rx } = action.payload;
    var { currentArrowhead } = stateCopy;

    currentArrowhead.cx += currentArrowhead.rx - rx;
    currentArrowhead.rx = rx;
    currentArrowhead.handles = updateHandles(currentArrowhead);

    return stateCopy;
}

export function changeArrowheadRadiusY(stateCopy, action, root) {
    const { ry } = action.payload;
    var { currentArrowhead } = stateCopy;

    currentArrowhead.ry = ry;
    currentArrowhead.handles = updateHandles(currentArrowhead);

    return stateCopy;
}

export function editArrowhead(stateCopy, action, root) {
    stateCopy.currentArrowhead = action.payload.arrowhead;
    return stateCopy;
}
