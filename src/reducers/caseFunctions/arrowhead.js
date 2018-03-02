import {
    reshape,
    updateHandles,
    updateLengthAndRefX,
    getArrowInfo,
    clamp,
    setArrowheadPreset,
    setArrowheadHeight,
    setArrowheadLength,
    setArrowheadRadiusX,
    setArrowheadRadiusY,
    newArrowheadPreset
} from '../utilities/arrowhead';

const editorHeight = 150;
const editorWidth = 300;
const buffer = 25;

const leftBufferX = buffer;
const rightBufferX = editorWidth - buffer;

export function arrowheadHandleDrag(stateCopy, action, root) {
    const { draggableData, handleIndex } = action.payload;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowheadId, arrowhead } = getArrowInfo(lineId, stateCopy.shapes, stateCopy.arrowheads);

            stateCopy.arrowheads.byId[arrowheadId] = reshape(arrowhead, draggableData, handleIndex, editorHeight, editorWidth, buffer, stateCopy.lockAspectRatio);
            stateCopy.shapes.byId[lineId].arrowheadLength = stateCopy.arrowheads.byId[arrowheadId].length;
        }
    });

    return stateCopy;
}

// export function changeArrowheadType(stateCopy, action, root) {
//     const { arrowheadType } = action.payload;
//
//     stateCopy.selected.map((lineId) => {
//         var { arrowheadId, arrowhead, line } = getArrowInfo(lineId, stateCopy.shapes, stateCopy.arrowheads);
//
//         const newArrowhead = setArrowheadType(arrowheadType);
//
//         stateCopy.arrowheads.byId[arrowheadId] = Object.assign({}, arrowhead, {...newArrowhead});
//         stateCopy.shapes.byId[lineId] = Object.assign({}, line, {arrowheadLength: newArrowhead.length});
//     });
//
//     return stateCopy;
// }

export function changeArrowheadHeight(stateCopy, action, root) {
    const { lockAspectRatio } = stateCopy;
    const { height } = action.payload;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowheadId, arrowhead } = getArrowInfo(lineId, stateCopy.shapes, stateCopy.arrowheads);

            arrowhead = setArrowheadHeight(arrowhead, height, 0, editorHeight);

            if (lockAspectRatio && arrowhead.type !== "polyline") {
                arrowhead = setArrowheadLength(arrowhead, height, rightBufferX - editorHeight, rightBufferX);
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
    const { length } = action.payload;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowheadId, arrowhead } = getArrowInfo(lineId, stateCopy.shapes, stateCopy.arrowheads);

            if (lockAspectRatio && arrowhead.type !== "polyline") {
                arrowhead = setArrowheadHeight(arrowhead, length, 0, editorHeight);
                arrowhead = setArrowheadLength(arrowhead, length, rightBufferX - editorHeight, rightBufferX);
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
    var { length } = action.payload;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowheadId, arrowhead } = getArrowInfo(lineId, stateCopy.shapes, stateCopy.arrowheads);
            length = clamp(length, leftBufferX - arrowhead.points[0], rightBufferX - arrowhead.points[0]);

            arrowhead.points[6] = arrowhead.points[0] + length;

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
    const { rx } = action.payload;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowheadId, arrowhead } = getArrowInfo(lineId, stateCopy.shapes, stateCopy.arrowheads);

            if (lockAspectRatio) {
                arrowhead = setArrowheadRadiusY(arrowhead, rx, 0, editorHeight);
                arrowhead = setArrowheadRadiusX(arrowhead, rx, rightBufferX - editorHeight, rightBufferX);
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
    const { ry } = action.payload;

    stateCopy.selected.map((lineId) => {
        if (stateCopy.shapes.byId[lineId].type === "line") {
            var { arrowheadId, arrowhead } = getArrowInfo(lineId, stateCopy.shapes, stateCopy.arrowheads);

            arrowhead = setArrowheadRadiusY(arrowhead, ry, 0, editorHeight);

            if (lockAspectRatio) {
                arrowhead = setArrowheadRadiusX(arrowhead, ry, rightBufferX - editorHeight, rightBufferX);
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
