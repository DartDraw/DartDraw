import uuidv1 from 'uuid';
import * as constants from '../../constants';

export function getArrowDefaultPresets() {
    return ({
        "triangle": {
            type: 'triangle',
            preset: 'triangle',
            fillOpacity: 1,
            points: constants.TRIANGLE_POINTS
        },
        "barbed": {
            type: 'barbed',
            preset: 'barbed',
            fillOpacity: 1,
            points: constants.BARBED_POINTS
        },
        "ellipse": {
            type: 'ellipse',
            preset: 'ellipse',
            fillOpacity: 1,
            cx: constants.ELLIPSE_POINTS[0],
            cy: constants.ELLIPSE_POINTS[1],
            rx: constants.ELLIPSE_POINTS[2],
            ry: constants.ELLIPSE_POINTS[3]
        },
        "rectangle": {
            type: 'rectangle',
            preset: 'rectangle',
            fillOpacity: 1,
            x: constants.RECTANGLE_POINTS[0],
            y: constants.RECTANGLE_POINTS[1],
            width: constants.RECTANGLE_POINTS[2],
            height: constants.RECTANGLE_POINTS[3]
        },
        "polyline": {
            type: 'polyline',
            preset: 'polyline',
            fillOpacity: 0,
            points: constants.POLYLINE_POINTS
        }
    });
}

export function setArrowHeight(arrow, newHeight, min, max) {
    newHeight = clamp(newHeight, min, max - min);

    switch (arrow.type) {
        case "triangle":
        case "polyline":
        case "barbed":
            arrow.points[1] = (max - newHeight) / 2;
            arrow.points[5] = (max + newHeight) / 2;
            break;
        case "rectangle":
            arrow.y = (max - newHeight) / 2;
            arrow.height = newHeight;
            break;
        default: break;
    }

    return arrow;
}

export function setarrowHeadLength(arrow, arrowMode, newLength, min, max) {
    newLength = clamp(newLength, 0, max - min);

    switch (arrow.type) {
        case "triangle":
        case "polyline":
            arrow.points[0] = max - newLength;
            arrow.points[4] = max - newLength;
            break;
        case "barbed":
            const barbLength = findBarbLengthPercentage(arrow);
            arrow.points[6] = max - newLength;
            arrow = setArrowBarbLength(arrow, barbLength, min, max);
            break;
        case "rectangle":
            arrow.x = max - newLength;
            arrow.width = newLength;
            break;
        default: break;
    }

    return arrow;
}

export function setArrowBarbLength(arrow, newBarbLength, min, max) {
    newBarbLength = newBarbLength / 100.0 * (arrow.points[2] - arrow.points[6]);
    newBarbLength = clamp(newBarbLength, 0, max - min);

    arrow.points[0] = max - newBarbLength;
    arrow.points[4] = max - newBarbLength;

    return arrow;
}

export function setArrowRadiusX(arrow, newRx, min, max) {
    newRx = clamp(newRx, 0, (max - min) / 2);

    arrow.cx += arrow.rx - newRx;
    arrow.rx = newRx;

    return arrow;
}

export function setArrowRadiusY(arrow, newRy, min, max) {
    newRy = clamp(newRy, 0, (max - min) / 2);

    arrow.ry = newRy;

    return arrow;
}

export function reshape(arrow, arrowMode, draggableData, handleIndex, lockAspectRatio) {
    const { x, y, node } = draggableData;

    let offsetLeft = 0;
    let offsetTop = 0;

    if (node) {
        offsetLeft = node.parentNode.getBoundingClientRect().left;
        offsetTop = node.parentNode.getBoundingClientRect().top;
    }

    const leftBufferX = constants.ARROW_GUI_BUFFER;
    const rightBufferX = constants.ARROW_GUI_WIDTH - constants.ARROW_GUI_BUFFER;

    const halfHeight = constants.ARROW_GUI_HEIGHT / 2;

    const mouseX = clamp(x - offsetLeft, leftBufferX, rightBufferX);
    const mouseY = clamp(y - offsetTop, 0, halfHeight - (arrow.strokeWidth / 2));

    switch (arrow.type) {
        case 'triangle':
        case 'polyline':
            arrow.points[0] = mouseX;
            arrow.points[1] = mouseY;
            arrow.points[4] = mouseX;
            arrow.points[5] = constants.ARROW_GUI_HEIGHT - mouseY;
            break;
        case 'barbed':
            if (handleIndex === 0) {
                arrow.points[0] = mouseX;
                arrow.points[1] = mouseY;
                arrow.points[4] = mouseX;
                arrow.points[5] = constants.ARROW_GUI_HEIGHT - mouseY;
            } else if (handleIndex === 1) {
                arrow.points[6] = mouseX;
            }
            break;
        case 'ellipse':
            if (handleIndex === 0) {
                var rx = (rightBufferX - mouseX) / 2;

                if (lockAspectRatio) {
                    arrow = setArrowRadiusX(arrow, rx, 0, constants.ARROW_GUI_HEIGHT);
                    arrow = setArrowRadiusY(arrow, rx, 0, constants.ARROW_GUI_HEIGHT);
                } else {
                    arrow = setArrowRadiusX(arrow, rx, leftBufferX, rightBufferX);
                }
            } else if (handleIndex === 1) {
                var ry = halfHeight - mouseY;

                arrow = setArrowRadiusY(arrow, ry, 0, constants.ARROW_GUI_HEIGHT);

                if (lockAspectRatio) {
                    arrow = setArrowRadiusX(arrow, ry, 0, constants.ARROW_GUI_HEIGHT);
                }
            }
            break;
        case 'rectangle':
            if (handleIndex === 0) {
                var length = rightBufferX - mouseX;

                if (lockAspectRatio) {
                    arrow = setarrowHeadLength(arrow, arrowMode, length, rightBufferX - constants.ARROW_GUI_HEIGHT, rightBufferX);
                    arrow = setArrowHeight(arrow, length, 0, constants.ARROW_GUI_HEIGHT);
                } else {
                    arrow = setarrowHeadLength(arrow, arrowMode, length, leftBufferX, rightBufferX);
                }
            } else if (handleIndex === 1) {
                var height = constants.ARROW_GUI_HEIGHT - (mouseY * 2);

                arrow = setArrowHeight(arrow, height, 0, constants.ARROW_GUI_HEIGHT);

                if (lockAspectRatio) {
                    arrow = setarrowHeadLength(arrow, arrowMode, height, rightBufferX - constants.ARROW_GUI_HEIGHT, rightBufferX);
                }
            }
            break;
        default:
            break;
    }

    arrow = updateLengthAndRefX(arrow, arrowMode);
    arrow = updateHandles(arrow);

    return arrow;
}

export function updateHandles(arrow) {
    switch (arrow.type) {
        case 'triangle':
        case 'polyline':
            arrow.handles[0].x = arrow.points[0];
            arrow.handles[0].y = arrow.points[1];
            break;
        case 'barbed':
            arrow.handles[0].x = arrow.points[0];
            arrow.handles[0].y = arrow.points[1];
            arrow.handles[1].x = arrow.points[6];
            arrow.handles[1].y = arrow.points[7];
            break;
        case 'ellipse':
            arrow.handles[0].x = arrow.cx - arrow.rx;
            arrow.handles[0].y = arrow.cy;
            arrow.handles[1].x = arrow.cx;
            arrow.handles[1].y = arrow.cy - arrow.ry;
            break;
        case 'rectangle':
            arrow.handles[0].x = arrow.x;
            arrow.handles[0].y = arrow.y + arrow.height / 2;
            arrow.handles[1].x = arrow.x + arrow.width / 2;
            arrow.handles[1].y = arrow.y;
            break;
        default: break;
    }

    return arrow;
}

export function updateLengthAndRefX(arrow, arrowMode) {
    switch (arrow.type) {
        case 'triangle':
            arrow.refX = arrow.points[0];
            if (arrowMode === "head") {
                arrow.length = arrow.points[2] - arrow.points[0];
            }
            break;
        case 'barbed':
            arrow.refX = arrow.points[6];
            if (arrowMode === "head") {
                arrow.length = arrow.points[2] - arrow.points[6];
            }
            break;
        case 'ellipse':
            arrow.refX = arrow.cx - arrow.rx;
            if (arrowMode === "head") {
                arrow.length = arrow.rx * 2;
            }
            break;
        case 'rectangle':
            arrow.refX = arrow.x;
            if (arrowMode === "head") {
                arrow.length = arrow.width;
            }
            break;
        case 'polyline':
            arrow.refX = arrow.points[2];
            if (arrowMode === "head") {
                arrow.length = 0;
            }
            break;
        default: break;
    }

    return arrow;
}

export function setArrowPreset(preset, arrow, arrowMode, line) {
    var updatedArrow;

    updatedArrow = Object.assign(
        {},
        preset,
        {id: arrow.id, lineId: arrow.lineId, stroke: arrow.stroke, strokeWidth: arrow.strokeWidth, strokeDasharray: arrow.strokeDasharray}
    );

    updatedArrow = generateHandles(updatedArrow);
    updatedArrow = updateLengthAndRefX(updatedArrow, arrowMode);

    // updatedLine = Object.assign({}, line, {arrowHeadLength: updatedArrow.length});

    return updatedArrow;
}

export function scaleViewBox(width, height, strokeWidth, scale) {
    const strokeScale = strokeWidth / constants.ARROW_STROKE_WIDTH;

    var viewBox = "0 0 " + (width / strokeScale * scale) + " " + (height / strokeScale * scale);

    return viewBox;
}

export function getArrowInfo(mode, lineId, shapes, arrows) {
    const arrowId = mode === "head" ? shapes.byId[lineId].arrowheadId : shapes.byId[lineId].arrowtailId;
    const arrow = arrows.byId[arrowId];
    const line = shapes.byId[lineId];

    return { arrowId, arrow, line };
}

export function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}

export function newArrowPreset(name, arrow) {
    var newArrowPreset = {
        type: arrow.type,
        preset: name,
        fillOpacity: arrow.fillOpacity
    };

    switch (arrow.type) {
        case "triangle":
        case "barbed":
        case "polyline":
            newArrowPreset.points = arrow.points;
            break;
        case "ellipse":
            newArrowPreset.cx = arrow.cx;
            newArrowPreset.cy = arrow.cy;
            newArrowPreset.rx = arrow.rx;
            newArrowPreset.ry = arrow.ry;
            break;
        case "rectangle":
            newArrowPreset.x = arrow.x;
            newArrowPreset.y = arrow.y;
            newArrowPreset.width = arrow.width;
            newArrowPreset.height = arrow.height;
            break;
        default: break;
    }

    return newArrowPreset;
}

function generateHandles(arrow) {
    let numHandles;

    switch (arrow.type) {
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

    arrow.handles = [];

    for (let i = 0; i < numHandles; i++) {
        arrow.handles.push({id: uuidv1(), index: i});
    }

    return updateHandles(arrow);
}

export function findHeightPercentage(arrow) {
    switch (arrow.type) {
        case 'triangle':
            return Math.round(((arrow.points[5] - arrow.points[1]) / constants.TRIANGLE_HEIGHT) * 100);
        case 'barbed':
            return Math.round(((arrow.points[5] - arrow.points[1]) / constants.BARBED_HEIGHT) * 100);
        case 'rectangle':
            return Math.round(((arrow.height) / constants.RECTANGLE_HEIGHT) * 100);
        case 'polyline':
            return Math.round(((arrow.points[5] - arrow.points[1]) / constants.POLYLINE_HEIGHT) * 100);
        default: break;
    }
}

export function findLengthPercentage(arrow) {
    switch (arrow.type) {
        case 'triangle':
            return Math.round(((arrow.points[2] - arrow.points[0]) / constants.TRIANGLE_LENGTH) * 100);
        case 'barbed':
            return Math.round(((arrow.points[2] - arrow.points[6]) / constants.BARBED_LENGTH) * 100);
        case 'rectangle':
            return Math.round(((arrow.width) / constants.RECTANGLE_LENGTH) * 100);
        case 'polyline':
            return Math.round(((arrow.points[2] - arrow.points[0]) / constants.POLYLINE_LENGTH) * 100);
        default: break;
    }
}

export function findBarbLengthPercentage(arrow) {
    return Math.round((arrow.points[2] - arrow.points[0]) / (arrow.points[2] - arrow.points[6]) * 100);
}

export function findRxPercentage(rx) {
    return Math.round((rx / constants.ELLIPSE_RX) * 100);
}

export function findRyPercentage(ry) {
    return Math.round((ry / constants.ELLIPSE_RY) * 100);
}
