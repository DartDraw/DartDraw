import {
    reshape,
    updateHandles,
    updateLengthAndRefX,
    getArrowInfo,
    setArrowPreset,
    setArrowHeight,
    setarrowHeadLength,
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
            var { arrowId, arrow } = getArrowInfo(arrowMode, lineId, stateCopy.shapes, stateCopy.arrows);

            stateCopy.arrows.byId[arrowId] = reshape(arrow, arrowMode, draggableData, handleIndex, stateCopy.lockAspectRatio);
            if (arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadLength = stateCopy.arrows.byId[arrowId].length;
            }
        }
    });

    return stateCopy;
}

export function changeArrowHeight(stateCopy, action, root) {
    const { lockAspectRatio, arrowMode } = stateCopy;
    var { height } = action.payload;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowId, arrow } = getArrowInfo(stateCopy.arrowMode, lineId, stateCopy.shapes, stateCopy.arrows);

            switch (arrow.type) {
                case "triangle":
                    height = height / 100.0 * constants.TRIANGLE_HEIGHT;
                    break;
                case "polyline":
                    height = height / 100.0 * constants.POLYLINE_HEIGHT;
                    break;
                case "barbed":
                    height = height / 100.0 * constants.BARBED_HEIGHT;
                    break;
                case "rectangle":
                    height = height / 100.0 * constants.RECTANGLE_HEIGHT;
                    break;
                default: break;
            }

            arrow = setArrowHeight(arrow, height, 0, constants.ARROW_GUI_HEIGHT);

            if (lockAspectRatio && arrow.type !== "polyline") {
                arrow = setarrowHeadLength(arrow, arrowMode, height, rightBufferX - constants.ARROW_GUI_HEIGHT, rightBufferX);
            }

            arrow = updateLengthAndRefX(arrow, arrowMode);
            arrow = updateHandles(arrow);

            stateCopy.arrows.byId[arrowId] = arrow;
            if (arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadLength = arrow.length;
            }
        }
    });

    return stateCopy;
}

export function changearrowHeadLength(stateCopy, action, root) {
    const { lockAspectRatio, arrowMode } = stateCopy;
    var { length } = action.payload;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowId, arrow } = getArrowInfo(stateCopy.arrowMode, lineId, stateCopy.shapes, stateCopy.arrows);

            switch (arrow.type) {
                case "triangle":
                    length = length / 100.0 * constants.TRIANGLE_LENGTH;
                    break;
                case "polyline":
                    length = length / 100.0 * constants.POLYLINE_LENGTH;
                    break;
                case "barbed":
                    length = length / 100.0 * constants.BARBED_LENGTH;
                    break;
                case "rectangle":
                    length = length / 100.0 * constants.RECTANGLE_LENGTH;
                    break;
                default: break;
            }

            if (lockAspectRatio && arrow.type !== "polyline") {
                arrow = setArrowHeight(arrow, length, 0, constants.ARROW_GUI_HEIGHT);
                arrow = setarrowHeadLength(arrow, stateCopy.arrowMode, length, rightBufferX - constants.ARROW_GUI_HEIGHT, rightBufferX);
            } else {
                arrow = setarrowHeadLength(arrow, arrowMode, length, leftBufferX, rightBufferX);
            }

            arrow = updateLengthAndRefX(arrow, arrowMode);
            arrow = updateHandles(arrow);

            stateCopy.arrows.byId[arrowId] = arrow;
            if (arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadLength = arrow.length;
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
            var { arrowId, arrow } = getArrowInfo(arrowMode, lineId, stateCopy.shapes, stateCopy.arrows);

            arrow = setArrowBarbLength(arrow, length, leftBufferX, rightBufferX);

            arrow = updateLengthAndRefX(arrow, arrowMode);
            arrow = updateHandles(arrow);

            stateCopy.arrows.byId[arrowId] = arrow;
            if (arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadLength = arrow.length;
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
            var { arrowId, arrow } = getArrowInfo(arrowMode, lineId, stateCopy.shapes, stateCopy.arrows);

            if (lockAspectRatio) {
                arrow = setArrowRadiusY(arrow, rx, 0, constants.ARROW_GUI_HEIGHT);
                arrow = setArrowRadiusX(arrow, rx, rightBufferX - constants.ARROW_GUI_HEIGHT, rightBufferX);
            } else {
                arrow = setArrowRadiusX(arrow, rx, leftBufferX, rightBufferX);
            }

            arrow = updateLengthAndRefX(arrow, arrowMode);
            arrow = updateHandles(arrow);

            stateCopy.arrows.byId[arrowId] = arrow;
            if (arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadLength = arrow.length;
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
            var { arrowId, arrow } = getArrowInfo(arrowMode, lineId, stateCopy.shapes, stateCopy.arrows);

            arrow = setArrowRadiusY(arrow, ry, 0, constants.ARROW_GUI_HEIGHT);

            if (lockAspectRatio) {
                arrow = setArrowRadiusX(arrow, ry, rightBufferX - constants.ARROW_GUI_HEIGHT, rightBufferX);
            }

            arrow = updateLengthAndRefX(arrow, arrowMode);
            arrow = updateHandles(arrow);

            stateCopy.arrows.byId[arrowId] = arrow;
            if (arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadLength = arrow.length;
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
    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            if (stateCopy.arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadShown = !stateCopy.shapes.byId[lineId].arrowHeadShown;
            } else {
                stateCopy.shapes.byId[lineId].arrowTailShown = !stateCopy.shapes.byId[lineId].arrowTailShown;
            }
        }
    });

    return stateCopy;
}

export function addArrowPreset(stateCopy, action) {
    const { name, arrow } = action.payload;
    const { arrowMode } = stateCopy;

    stateCopy.arrows.presets[name] = newArrowPreset(name, arrow);

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            const { arrowId, arrow, line } = getArrowInfo(arrowMode, lineId, stateCopy.shapes, stateCopy.arrows);
            const updatedArrow = setArrowPreset(stateCopy.arrows.presets[name], arrow, arrowMode, line);

            stateCopy.arrows.byId[arrowId] = updatedArrow;
            if (arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadLength = updatedArrow.length;
            }
        }
    });

    return stateCopy;
}

export function saveArrowPreset(stateCopy, action) {
    const { arrow } = action.payload;

    stateCopy.arrows.presets[arrow.preset] = newArrowPreset(arrow.preset, arrow);

    return stateCopy;
}

export function deleteArrowPreset(stateCopy, action) {
    const { presetName } = action.payload;

    delete stateCopy.arrows.presets[presetName];

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            stateCopy.arrows.byId[stateCopy.shapes.byId[lineId].arrowheadId].preset = stateCopy.arrows.byId[stateCopy.shapes.byId[lineId].arrowheadId].type;
            stateCopy.arrows.byId[stateCopy.shapes.byId[lineId].arrowtailId].preset = stateCopy.arrows.byId[stateCopy.shapes.byId[lineId].arrowtailId].type;
        }
    });

    return stateCopy;
}

export function selectArrowPreset(stateCopy, action, root) {
    var { name } = action.payload;
    const { arrowMode } = stateCopy;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            const { arrowId, arrow, line } = getArrowInfo(arrowMode, lineId, stateCopy.shapes, stateCopy.arrows);

            const updatedArrow = setArrowPreset(stateCopy.arrows.presets[name], arrow, arrowMode, line);

            stateCopy.arrows.byId[arrowId] = updatedArrow;
            if (stateCopy.arrowMode === "head") {
                stateCopy.shapes.byId[lineId].arrowHeadLength = updatedArrow.length;
            }
        }
    });

    return stateCopy;
}
