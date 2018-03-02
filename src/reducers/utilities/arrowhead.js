import uuidv1 from 'uuid';

export function getArrowheadDefaultPresets() {
    return ({
        "triangle": {
            type: 'triangle',
            preset: 'triangle',
            fillOpacity: 1,
            points: [215, 55, 275, 75, 215, 95]
        },
        "barbed": {
            type: 'barbed',
            preset: 'barbed',
            fillOpacity: 1,
            points: [215, 55, 275, 75, 215, 95, 235, 75]
        },
        "ellipse": {
            type: 'ellipse',
            preset: 'ellipse',
            fillOpacity: 1,
            cx: 260,
            cy: 75,
            rx: 15,
            ry: 15
        },
        "rectangle": {
            type: 'rectangle',
            preset: 'rectangle',
            fillOpacity: 1,
            x: 245,
            y: 60,
            width: 30,
            height: 30
        },
        "polyline": {
            type: 'polyline',
            preset: 'polyline',
            fillOpacity: 0,
            points: [215, 55, 275, 75, 215, 95]
        }
    });
}

export function setArrowheadHeight(arrowhead, newHeight, min, max) {
    newHeight = clamp(newHeight, min, max - min);

    switch (arrowhead.type) {
        case "triangle":
        case "polyline":
        case "barbed":
            arrowhead.points[1] = (max - newHeight) / 2;
            arrowhead.points[5] = (max + newHeight) / 2;
            break;
        case "rectangle":
            arrowhead.y = (max - newHeight) / 2;
            arrowhead.height = newHeight;
            break;
        default: break;
    }

    return arrowhead;
}

export function setArrowheadLength(arrowhead, newLength, min, max) {
    newLength = clamp(newLength, 0, max - min);

    switch (arrowhead.type) {
        case "triangle":
        case "polyline":
            arrowhead.points[0] = max - newLength;
            arrowhead.points[4] = max - newLength;
            break;
        case "barbed":
            const barbLength = arrowhead.points[6] - arrowhead.points[0];
            arrowhead.points[0] = max - newLength;
            arrowhead.points[4] = max - newLength;
            arrowhead.points[6] = clamp(arrowhead.points[0] + barbLength, min, max);
            break;
        case "rectangle":
            arrowhead.x = max - newLength;
            arrowhead.width = newLength;
            break;
        default: break;
    }

    return arrowhead;
}

export function setArrowheadRadiusX(arrowhead, newRx, min, max) {
    newRx = clamp(newRx, 0, (max - min) / 2);

    arrowhead.cx += arrowhead.rx - newRx;
    arrowhead.rx = newRx;

    return arrowhead;
}

export function setArrowheadRadiusY(arrowhead, newRy, min, max) {
    newRy = clamp(newRy, 0, (max - min) / 2);

    arrowhead.ry = newRy;

    return arrowhead;
}

export function reshape(arrowhead, draggableData, handleIndex, editorHeight, editorWidth, buffer, lockAspectRatio) {
    const { x, y, node } = draggableData;

    let offsetLeft = 0;
    let offsetTop = 0;

    if (node) {
        offsetLeft = node.parentNode.getBoundingClientRect().left;
        offsetTop = node.parentNode.getBoundingClientRect().top;
    }

    const leftBufferX = buffer;
    const rightBufferX = editorWidth - buffer;

    const halfHeight = editorHeight / 2;

    const mouseX = clamp(x - offsetLeft, leftBufferX, rightBufferX);
    const mouseY = clamp(y - offsetTop, 0, halfHeight);

    switch (arrowhead.type) {
        case 'triangle':
        case 'polyline':
            arrowhead.points[0] = mouseX;
            arrowhead.points[1] = mouseY;
            arrowhead.points[4] = mouseX;
            arrowhead.points[5] = editorHeight - mouseY;
            break;
        case 'barbed':
            if (handleIndex === 0) {
                arrowhead.points[0] = mouseX;
                arrowhead.points[1] = mouseY;
                arrowhead.points[4] = mouseX;
                arrowhead.points[5] = editorHeight - mouseY;
            } else if (handleIndex === 1) {
                arrowhead.points[6] = mouseX;
            }
            break;
        case 'ellipse':
            if (handleIndex === 0) {
                var rx = (rightBufferX - mouseX) / 2;

                if (lockAspectRatio) {
                    arrowhead = setArrowheadRadiusX(arrowhead, rx, 0, editorHeight);
                    arrowhead = setArrowheadRadiusY(arrowhead, rx, 0, editorHeight);
                } else {
                    arrowhead = setArrowheadRadiusX(arrowhead, rx, leftBufferX, rightBufferX);
                }
            } else if (handleIndex === 1) {
                var ry = halfHeight - mouseY;

                arrowhead = setArrowheadRadiusY(arrowhead, ry, 0, editorHeight);

                if (lockAspectRatio) {
                    arrowhead = setArrowheadRadiusX(arrowhead, ry, 0, editorHeight);
                }
            }
            break;
        case 'rectangle':
            if (handleIndex === 0) {
                var length = rightBufferX - mouseX;

                if (lockAspectRatio) {
                    arrowhead = setArrowheadLength(arrowhead, length, rightBufferX - editorHeight, rightBufferX);
                    arrowhead = setArrowheadHeight(arrowhead, length, 0, editorHeight);
                } else {
                    arrowhead = setArrowheadLength(arrowhead, length, leftBufferX, rightBufferX);
                }
            } else if (handleIndex === 1) {
                var height = editorHeight - (mouseY * 2);

                arrowhead = setArrowheadHeight(arrowhead, height, 0, editorHeight);

                if (lockAspectRatio) {
                    arrowhead = setArrowheadLength(arrowhead, height, rightBufferX - editorHeight, rightBufferX);
                }
            }
            break;
        default:
            break;
    }

    arrowhead = updateLengthAndRefX(arrowhead);
    arrowhead = updateHandles(arrowhead);

    return arrowhead;
}

export function updateHandles(arrowhead) {
    switch (arrowhead.type) {
        case 'triangle':
        case 'polyline':
            arrowhead.handles[0].x = arrowhead.points[0];
            arrowhead.handles[0].y = arrowhead.points[1];
            break;
        case 'barbed':
            arrowhead.handles[0].x = arrowhead.points[0];
            arrowhead.handles[0].y = arrowhead.points[1];
            arrowhead.handles[1].x = arrowhead.points[6];
            arrowhead.handles[1].y = arrowhead.points[7];
            break;
        case 'ellipse':
            arrowhead.handles[0].x = arrowhead.cx - arrowhead.rx;
            arrowhead.handles[0].y = arrowhead.cy;
            arrowhead.handles[1].x = arrowhead.cx;
            arrowhead.handles[1].y = arrowhead.cy - arrowhead.ry;
            break;
        case 'rectangle':
            arrowhead.handles[0].x = arrowhead.x;
            arrowhead.handles[0].y = arrowhead.y + arrowhead.height / 2;
            arrowhead.handles[1].x = arrowhead.x + arrowhead.width / 2;
            arrowhead.handles[1].y = arrowhead.y;
            break;
        default: break;
    }

    return arrowhead;
}

export function updateLengthAndRefX(arrowhead) {
    switch (arrowhead.type) {
        case 'triangle':
            arrowhead.refX = arrowhead.points[0];
            arrowhead.length = arrowhead.points[2] - arrowhead.points[0];
            break;
        case 'barbed':
            arrowhead.refX = arrowhead.points[6];
            arrowhead.length = arrowhead.points[2] - arrowhead.points[6];
            break;
        case 'ellipse':
            arrowhead.refX = arrowhead.cx - arrowhead.rx;
            arrowhead.length = arrowhead.rx * 2;
            break;
        case 'rectangle':
            arrowhead.refX = arrowhead.x;
            arrowhead.length = arrowhead.width;
            break;
        case 'polyline':
            arrowhead.refX = arrowhead.points[2];
            arrowhead.length = 0;
            break;
        default: break;
    }

    return arrowhead;
}

export function setArrowheadPreset(preset, arrowhead, line) {
    var updatedArrowhead = Object.assign(
        {},
        preset,
        {id: arrowhead.id, lineId: arrowhead.lineId, stroke: arrowhead.stroke, strokeWidth: arrowhead.strokeWidth, strokeDasharray: arrowhead.strokeDasharray}
    );

    updatedArrowhead = generateHandles(updatedArrowhead);
    updatedArrowhead = updateLengthAndRefX(updatedArrowhead);

    const updatedLine = Object.assign({}, line, {arrowheadLength: updatedArrowhead.length});

    return { updatedArrowhead, updatedLine };
}

export function scaleViewBox(width, height, strokeWidth) {
    const originalStrokeWidth = 5;
    const scale = strokeWidth / originalStrokeWidth;

    var viewBox = "0 0 " + (width / scale) + " " + (height / scale);

    return viewBox;
}

export function getArrowInfo(lineId, shapes, arrowheads) {
    const arrowheadId = shapes.byId[lineId].arrowheadId;
    const arrowhead = arrowheads.byId[arrowheadId];
    const line = shapes.byId[lineId];

    return { arrowheadId, arrowhead, line };
}

export function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}

export function newArrowheadPreset(name, arrowhead) {
    var newArrowheadPreset = {
        type: arrowhead.type,
        preset: name,
        fillOpacity: arrowhead.fillOpacity
    };

    switch (arrowhead.type) {
        case "triangle":
        case "barbed":
        case "polyline":
            newArrowheadPreset.points = arrowhead.points;
            break;
        case "ellipse":
            newArrowheadPreset.cx = arrowhead.cx;
            newArrowheadPreset.cy = arrowhead.cy;
            newArrowheadPreset.rx = arrowhead.rx;
            newArrowheadPreset.ry = arrowhead.ry;
            break;
        case "rectangle":
            newArrowheadPreset.x = arrowhead.x;
            newArrowheadPreset.y = arrowhead.y;
            newArrowheadPreset.width = arrowhead.width;
            newArrowheadPreset.height = arrowhead.height;
            break;
        default: break;
    }

    return newArrowheadPreset;
}

function generateHandles(arrowhead) {
    let numHandles;

    switch (arrowhead.type) {
        case 'barbed':
        case 'ellipse':
        case 'rectangle':
            numHandles = 2;
            break;
        case 'triangle':
        case 'polyline':
            numHandles = 1;
            break;
        default: break;
    }

    arrowhead.handles = [];

    for (let i = 0; i < numHandles; i++) {
        arrowhead.handles.push({id: uuidv1(), index: i});
    }

    return updateHandles(arrowhead);
}
