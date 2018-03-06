import {
    reshape,
    updateHandles,
    updateLengthAndRefX,
    getArrowInfo,
    setArrowheadPreset,
    setArrowheadHeight,
    setArrowheadLength,
    setArrowheadBarbLength,
    setArrowheadRadiusX,
    setArrowheadRadiusY,
    newArrowheadPreset
} from '../utilities/arrowhead';
import * as constants from '../../constants';

const leftBufferX = constants.ARROWHEAD_GUI_BUFFER;
const rightBufferX = constants.ARROWHEAD_GUI_WIDTH - constants.ARROWHEAD_GUI_BUFFER;

export function arrowheadHandleDrag(stateCopy, action, root) {
    const { draggableData, handleIndex } = action.payload;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowheadId, arrowhead } = getArrowInfo(lineId, stateCopy.shapes, stateCopy.arrowheads);

            stateCopy.arrowheads.byId[arrowheadId] = reshape(arrowhead, draggableData, handleIndex, stateCopy.lockAspectRatio);
            stateCopy.shapes.byId[lineId].arrowheadLength = stateCopy.arrowheads.byId[arrowheadId].length;
        }
    });

    return stateCopy;
}

export function changeArrowheadHeight(stateCopy, action, root) {
    const { lockAspectRatio } = stateCopy;
    var { height } = action.payload;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowheadId, arrowhead } = getArrowInfo(lineId, stateCopy.shapes, stateCopy.arrowheads);

            switch (arrowhead.type) {
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

            arrowhead = setArrowheadHeight(arrowhead, height, 0, constants.ARROWHEAD_GUI_HEIGHT);

            if (lockAspectRatio && arrowhead.type !== "polyline") {
                arrowhead = setArrowheadLength(arrowhead, height, rightBufferX - constants.ARROWHEAD_GUI_HEIGHT, rightBufferX);
            }

            arrowhead = updateLengthAndRefX(arrowhead);
            arrowhead = updateHandles(arrowhead);

            stateCopy.arrowheads.byId[arrowheadId] = arrowhead;
            stateCopy.shapes.byId[lineId].arrowheadLength = arrowhead.length;
        }
    });

    return stateCopy;
}

export function changeArrowheadLength(stateCopy, action, root) {
    const { lockAspectRatio } = stateCopy;
    var { length } = action.payload;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowheadId, arrowhead } = getArrowInfo(lineId, stateCopy.shapes, stateCopy.arrowheads);

            switch (arrowhead.type) {
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

            if (lockAspectRatio && arrowhead.type !== "polyline") {
                arrowhead = setArrowheadHeight(arrowhead, length, 0, constants.ARROWHEAD_GUI_HEIGHT);
                arrowhead = setArrowheadLength(arrowhead, length, rightBufferX - constants.ARROWHEAD_GUI_HEIGHT, rightBufferX);
            } else {
                arrowhead = setArrowheadLength(arrowhead, length, leftBufferX, rightBufferX);
            }

            arrowhead = updateLengthAndRefX(arrowhead);
            arrowhead = updateHandles(arrowhead);

            stateCopy.arrowheads.byId[arrowheadId] = arrowhead;
            stateCopy.shapes.byId[lineId].arrowheadLength = arrowhead.length;
        }
    });

    return stateCopy;
}

export function changeArrowheadBarbLength(stateCopy, action, root) {
    const { length } = action.payload;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowheadId, arrowhead } = getArrowInfo(lineId, stateCopy.shapes, stateCopy.arrowheads);

            arrowhead = setArrowheadBarbLength(arrowhead, length, leftBufferX, rightBufferX);

            arrowhead = updateLengthAndRefX(arrowhead);
            arrowhead = updateHandles(arrowhead);

            stateCopy.arrowheads.byId[arrowheadId] = arrowhead;
            stateCopy.shapes.byId[lineId].arrowheadLength = arrowhead.length;
        }
    });

    return stateCopy;
}

export function changeArrowheadRadiusX(stateCopy, action, root) {
    const { lockAspectRatio } = stateCopy;
    var { rx } = action.payload;

    rx = rx / 100.0 * constants.ELLIPSE_RX;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowheadId, arrowhead } = getArrowInfo(lineId, stateCopy.shapes, stateCopy.arrowheads);

            if (lockAspectRatio) {
                arrowhead = setArrowheadRadiusY(arrowhead, rx, 0, constants.ARROWHEAD_GUI_HEIGHT);
                arrowhead = setArrowheadRadiusX(arrowhead, rx, rightBufferX - constants.ARROWHEAD_GUI_HEIGHT, rightBufferX);
            } else {
                arrowhead = setArrowheadRadiusX(arrowhead, rx, leftBufferX, rightBufferX);
            }

            arrowhead = updateLengthAndRefX(arrowhead);
            arrowhead = updateHandles(arrowhead);

            stateCopy.arrowheads.byId[arrowheadId] = arrowhead;
            stateCopy.shapes.byId[lineId].arrowheadLength = arrowhead.length;
        }
    });

    return stateCopy;
}

export function changeArrowheadRadiusY(stateCopy, action, root) {
    const { lockAspectRatio } = stateCopy;
    var { ry } = action.payload;

    ry = ry / 100.0 * constants.ELLIPSE_RY;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowheadId, arrowhead } = getArrowInfo(lineId, stateCopy.shapes, stateCopy.arrowheads);

            arrowhead = setArrowheadRadiusY(arrowhead, ry, 0, constants.ARROWHEAD_GUI_HEIGHT);

            if (lockAspectRatio) {
                arrowhead = setArrowheadRadiusX(arrowhead, ry, rightBufferX - constants.ARROWHEAD_GUI_HEIGHT, rightBufferX);
            }

            arrowhead = updateLengthAndRefX(arrowhead);
            arrowhead = updateHandles(arrowhead);

            stateCopy.arrowheads.byId[arrowheadId] = arrowhead;
            stateCopy.shapes.byId[lineId].arrowheadLength = arrowhead.length;
        }
    });

    return stateCopy;
}

export function toggleArrowheadAspect(stateCopy) {
    stateCopy.lockAspectRatio = !stateCopy.lockAspectRatio;

    return stateCopy;
}

export function addArrowheadPreset(stateCopy, action) {
    const { name, arrowhead } = action.payload;

    stateCopy.arrowheads.presets[name] = newArrowheadPreset(name, arrowhead);

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            const { arrowheadId, arrowhead, line } = getArrowInfo(lineId, stateCopy.shapes, stateCopy.arrowheads);
            const { updatedArrowhead, updatedLine } = setArrowheadPreset(stateCopy.arrowheads.presets[name], arrowhead, line);

            stateCopy.arrowheads.byId[arrowheadId] = updatedArrowhead;
            stateCopy.shapes.byId[lineId] = updatedLine;
        }
    });

    return stateCopy;
}

export function saveArrowheadPreset(stateCopy, action) {
    const { arrowhead } = action.payload;

    stateCopy.arrowheads.presets[arrowhead.preset] = newArrowheadPreset(arrowhead.preset, arrowhead);

    return stateCopy;
}

export function deleteArrowheadPreset(stateCopy, action) {
    const { presetName } = action.payload;

    delete stateCopy.arrowheads.presets[presetName];

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            const { arrowheadId } = getArrowInfo(lineId, stateCopy.shapes, stateCopy.arrowheads);
            stateCopy.arrowheads.byId[arrowheadId].preset = stateCopy.arrowheads.byId[arrowheadId].type;
        }
    });

    return stateCopy;
}

export function selectArrowheadPreset(stateCopy, action, root) {
    var { name } = action.payload;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            const { arrowheadId, arrowhead, line } = getArrowInfo(lineId, stateCopy.shapes, stateCopy.arrowheads);
            const { updatedArrowhead, updatedLine } = setArrowheadPreset(stateCopy.arrowheads.presets[name], arrowhead, line);

            stateCopy.arrowheads.byId[arrowheadId] = updatedArrowhead;
            stateCopy.shapes.byId[lineId] = updatedLine;
        }
    });

    return stateCopy;
}
