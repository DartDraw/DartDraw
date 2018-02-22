import { reshape, updateHandles, updateLengthAndRefX, setArrowheadType } from '../utilities/arrowhead';

const editorHeight = 150;
const editorWidth = 300;
const buffer = 25;

const leftBufferX = buffer;
const rightBufferX = editorWidth - buffer;

const halfHeight = editorHeight / 2;

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
            currentArrowhead.points[1] = clamp(halfHeight - height / 2, 0, halfHeight);
            currentArrowhead.points[5] = editorHeight - currentArrowhead.points[1];
            break;
        case "rectangle":
            currentArrowhead.y = clamp(halfHeight - height / 2, 0, halfHeight);
            currentArrowhead.height = clamp(height, 0, editorHeight);
            break;
        default: break;
    }

    currentArrowhead.handles = updateHandles(currentArrowhead);

    return stateCopy;
}

export function changeArrowheadLength(stateCopy, action, root) {
    var { length } = action.payload;
    var { currentArrowhead } = stateCopy;

    length = clamp(length, 0, rightBufferX - leftBufferX);

    switch (currentArrowhead.type) {
        case "triangle":
        case "polyline":
            currentArrowhead.points[0] = rightBufferX - length;
            currentArrowhead.points[4] = rightBufferX - length;
            break;
        case "barbed":
            const barbLength = currentArrowhead.points[6] - currentArrowhead.points[0];
            currentArrowhead.points[0] = rightBufferX - length;
            currentArrowhead.points[4] = rightBufferX - length;
            currentArrowhead.points[6] = clamp(currentArrowhead.points[0] + barbLength, leftBufferX, rightBufferX);
            break;
        case "rectangle":
            currentArrowhead.x = rightBufferX - length;
            currentArrowhead.width = length;
            break;
        default: break;
    }

    currentArrowhead = updateLengthAndRefX(currentArrowhead);
    currentArrowhead.handles = updateHandles(currentArrowhead);

    return stateCopy;
}

export function changeArrowheadBarbLength(stateCopy, action, root) {
    var { length } = action.payload;
    var { currentArrowhead } = stateCopy;

    length = clamp(length, leftBufferX - currentArrowhead.points[0], rightBufferX - currentArrowhead.points[0]);

    currentArrowhead.points[6] = currentArrowhead.points[0] + length;
    currentArrowhead.handles = updateHandles(currentArrowhead);

    return stateCopy;
}

export function changeArrowheadRadiusX(stateCopy, action, root) {
    var { rx } = action.payload;
    var { currentArrowhead } = stateCopy;

    rx = clamp(rx, 0, (rightBufferX - leftBufferX) / 2);

    currentArrowhead.cx += currentArrowhead.rx - rx;
    currentArrowhead.rx = rx;
    currentArrowhead.handles = updateHandles(currentArrowhead);
    currentArrowhead = updateLengthAndRefX(currentArrowhead);
    return stateCopy;
}

export function changeArrowheadRadiusY(stateCopy, action, root) {
    var { ry } = action.payload;
    var { currentArrowhead } = stateCopy;

    ry = clamp(ry, 0, halfHeight);

    currentArrowhead.ry = ry;
    currentArrowhead.handles = updateHandles(currentArrowhead);

    return stateCopy;
}

export function editArrowhead(stateCopy, action, root) {
    stateCopy.currentArrowhead = action.payload.arrowhead;
    return stateCopy;
}

export function applyArrowhead(stateCopy, action) {
    const { arrowhead, path } = action.payload;

    console.log(arrowhead, path);

    return stateCopy;
}

function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}
