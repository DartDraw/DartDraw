import {
    reshape,
    updateHandles,
    updateLengthAndRefX,
    getArrowInfo,
    setArrowPreset,
    setArrowHeight,
    setArrowLength,
    setArrowBarbLength,
    setArrowRadiusX,
    setArrowRadiusY,
    newArrowPreset
} from '../utilities/arrow';
import * as constants from '../../constants';

const leftBufferX = constants.ARROW_GUI_BUFFER;
const rightBufferX = constants.ARROW_GUI_WIDTH - constants.ARROW_GUI_BUFFER;

export function arrowHandleDrag(stateCopy, action, root) {
    const { draggableData, handleIndex } = action.payload;
    const { arrowMode } = stateCopy;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowId, arrow } = getArrowInfo(arrowMode, lineId, stateCopy.shapes);

            stateCopy.shapes.arrows.byId[arrowId] = reshape(arrow, arrowMode, draggableData, handleIndex, stateCopy.lockAspectRatio);
            if (arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadLength = stateCopy.shapes.arrows.byId[arrowId].length;
            } else {
                stateCopy.shapes.byId[lineId].arrowTailLength = stateCopy.shapes.arrows.byId[arrowId].length;
            }
        }
    });

    return stateCopy;
}

export function changeArrowHeight(stateCopy, action, root) {
    const { lockAspectRatio, arrowMode } = stateCopy;
    var { height } = action.payload;
    console.log('here');

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowId, arrow } = getArrowInfo(stateCopy.arrowMode, lineId, stateCopy.shapes);

            var newHeight;

            switch (arrow.type) {
                case "triangle":
                    newHeight = height / 100.0 * constants.TRIANGLE_HEIGHT;
                    break;
                case "polyline":
                    newHeight = height / 100.0 * constants.POLYLINE_HEIGHT;
                    break;
                case "barbed":
                    newHeight = height / 100.0 * constants.BARBED_HEIGHT;
                    break;
                case "rectangle":
                    newHeight = height / 100.0 * constants.RECTANGLE_HEIGHT;
                    break;
                default: break;
            }

            console.log('hi:', arrow.type, newHeight);

            arrow = setArrowHeight(arrow, newHeight, 0, constants.ARROW_GUI_HEIGHT);

            if (lockAspectRatio && arrow.type !== "polyline") {
                arrow = setArrowLength(arrow, arrowMode, newHeight, rightBufferX - constants.ARROW_GUI_HEIGHT, rightBufferX);
            }

            arrow = updateLengthAndRefX(arrow, arrowMode);
            arrow = updateHandles(arrow);

            stateCopy.shapes.arrows.byId[arrowId] = arrow;

            if (arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadLength = arrow.length;
            } else {
                stateCopy.shapes.byId[lineId].arrowTailLength = arrow.length;
            }
        }
    });

    return stateCopy;
}

export function changeArrowLength(stateCopy, action, root) {
    const { lockAspectRatio, arrowMode } = stateCopy;
    var { length } = action.payload;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowId, arrow } = getArrowInfo(stateCopy.arrowMode, lineId, stateCopy.shapes);

            var newLength;

            switch (arrow.type) {
                case "triangle":
                    newLength = length / 100.0 * constants.TRIANGLE_LENGTH;
                    break;
                case "polyline":
                    newLength = length / 100.0 * constants.POLYLINE_LENGTH;
                    break;
                case "barbed":
                    newLength = length / 100.0 * constants.BARBED_LENGTH;
                    break;
                case "rectangle":
                    newLength = length / 100.0 * constants.RECTANGLE_LENGTH;
                    break;
                default: break;
            }

            if (lockAspectRatio && arrow.type !== "polyline") {
                arrow = setArrowHeight(arrow, newLength, 0, constants.ARROW_GUI_HEIGHT);
                arrow = setArrowLength(arrow, stateCopy.arrowMode, newLength, rightBufferX - constants.ARROW_GUI_HEIGHT, rightBufferX);
            } else {
                arrow = setArrowLength(arrow, arrowMode, newLength, leftBufferX, rightBufferX);
            }

            arrow = updateLengthAndRefX(arrow, arrowMode);
            arrow = updateHandles(arrow);

            stateCopy.shapes.arrows.byId[arrowId] = arrow;
            if (arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadLength = arrow.length;
            } else {
                stateCopy.shapes.byId[lineId].arrowTailLength = arrow.length;
            }
        }
    });

    return stateCopy;
}

export function changeArrowBarbLength(stateCopy, action, root) {
    const { length } = action.payload;
    const { arrowMode } = stateCopy;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowId, arrow } = getArrowInfo(arrowMode, lineId, stateCopy.shapes);

            arrow = setArrowBarbLength(arrow, length, leftBufferX, rightBufferX);

            arrow = updateLengthAndRefX(arrow, arrowMode);
            arrow = updateHandles(arrow);

            stateCopy.shapes.arrows.byId[arrowId] = arrow;
            if (arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadLength = arrow.length;
            } else {
                stateCopy.shapes.byId[lineId].arrowTailLength = arrow.length;
            }
        }
    });

    return stateCopy;
}

export function changeArrowRadiusX(stateCopy, action, root) {
    const { lockAspectRatio, arrowMode } = stateCopy;
    var { rx } = action.payload;

    rx = rx / 100.0 * constants.ELLIPSE_RX;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowId, arrow } = getArrowInfo(arrowMode, lineId, stateCopy.shapes);

            if (lockAspectRatio) {
                arrow = setArrowRadiusY(arrow, rx, 0, constants.ARROW_GUI_HEIGHT);
                arrow = setArrowRadiusX(arrow, rx, rightBufferX - constants.ARROW_GUI_HEIGHT, rightBufferX);
            } else {
                arrow = setArrowRadiusX(arrow, rx, leftBufferX, rightBufferX);
            }

            arrow = updateLengthAndRefX(arrow, arrowMode);
            arrow = updateHandles(arrow);

            stateCopy.shapes.arrows.byId[arrowId] = arrow;
            if (arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadLength = arrow.length;
            } else {
                stateCopy.shapes.byId[lineId].arrowTailLength = arrow.length;
            }
        }
    });

    return stateCopy;
}

export function changeArrowRadiusY(stateCopy, action, root) {
    const { lockAspectRatio, arrowMode } = stateCopy;
    var { ry } = action.payload;

    ry = ry / 100.0 * constants.ELLIPSE_RY;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowId, arrow } = getArrowInfo(arrowMode, lineId, stateCopy.shapes);

            arrow = setArrowRadiusY(arrow, ry, 0, constants.ARROW_GUI_HEIGHT);

            if (lockAspectRatio) {
                arrow = setArrowRadiusX(arrow, ry, rightBufferX - constants.ARROW_GUI_HEIGHT, rightBufferX);
            }

            arrow = updateLengthAndRefX(arrow, arrowMode);
            arrow = updateHandles(arrow);

            stateCopy.shapes.arrows.byId[arrowId] = arrow;
            if (arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadLength = arrow.length;
            } else {
                stateCopy.shapes.byId[lineId].arrowTailLength = arrow.length;
            }
        }
    });

    return stateCopy;
}

export function toggleArrowAspect(stateCopy) {
    stateCopy.lockAspectRatio = !stateCopy.lockAspectRatio;

    return stateCopy;
}

export function toggleArrowMode(stateCopy, action) {
    const { mode } = action.payload;
    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            stateCopy.arrowMode = mode;
        }
    });

    return stateCopy;
}

export function toggleArrowShow(stateCopy, action) {
    let status;
    if (stateCopy.arrowMode === "head") {
        status = !stateCopy.shapes.byId[stateCopy.selected[0]].arrowHeadShown;
    } else {
        status = !stateCopy.shapes.byId[stateCopy.selected[0]].arrowTailShown;
    }
    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            if (stateCopy.arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadShown = status;
            } else {
                stateCopy.shapes.byId[lineId].arrowTailShown = status;
            }
        }
    });

    return stateCopy;
}

export function toggleArrowFlip(stateCopy, action) {
    let { arrowId } = action.payload;

    let status = !stateCopy.shapes.arrows.byId[arrowId].flip;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            if (stateCopy.arrowMode === "head") {
                stateCopy.shapes.arrows.byId[stateCopy.shapes.byId[lineId].arrowHeadId].flip = status;
            } else {
                stateCopy.shapes.arrows.byId[stateCopy.shapes.byId[lineId].arrowTailId].flip = status;
            }
        }
    });

    return stateCopy;
}

export function addArrowPreset(stateCopy, action) {
    const { name, arrow } = action.payload;
    const { arrowMode } = stateCopy;

    stateCopy.shapes.arrows.presets[name] = newArrowPreset(name, arrow);

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            const { arrowId, arrow, line } = getArrowInfo(arrowMode, lineId, stateCopy.shapes);
            const updatedArrow = setArrowPreset(stateCopy.shapes.arrows.presets[name], arrow, arrowMode, line);

            stateCopy.shapes.arrows.byId[arrowId] = updatedArrow;
            if (arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadLength = updatedArrow.length;
            } else {
                stateCopy.shapes.byId[lineId].arrowTailLength = updatedArrow.length;
            }
        }
    });

    return stateCopy;
}

export function saveArrowPreset(stateCopy, action) {
    const { arrow } = action.payload;

    stateCopy.shapes.arrows.presets[arrow.preset] = newArrowPreset(arrow.preset, arrow);

    return stateCopy;
}

export function deleteArrowPreset(stateCopy, action) {
    const { presetName } = action.payload;

    delete stateCopy.shapes.arrows.presets[presetName];

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            stateCopy.shapes.arrows.byId[stateCopy.shapes.byId[lineId].arrowHeadId].preset = stateCopy.shapes.arrows.byId[stateCopy.shapes.byId[lineId].arrowHeadId].type;
            stateCopy.shapes.arrows.byId[stateCopy.shapes.byId[lineId].arrowTailId].preset = stateCopy.shapes.arrows.byId[stateCopy.shapes.byId[lineId].arrowTailId].type;
        }
    });

    return stateCopy;
}

export function selectArrowPreset(stateCopy, action, root) {
    var { name } = action.payload;
    const { arrowMode } = stateCopy;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            const { arrowId, arrow, line } = getArrowInfo(arrowMode, lineId, stateCopy.shapes);

            const updatedArrow = setArrowPreset(stateCopy.shapes.arrows.presets[name], arrow, arrowMode, line);

            stateCopy.shapes.arrows.byId[arrowId] = updatedArrow;
            if (arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadLength = updatedArrow.length;
            } else {
                stateCopy.shapes.byId[lineId].arrowTailLength = updatedArrow.length;
            }
        }
    });

    return stateCopy;
}
