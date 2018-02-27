import {
    reshape,
    updateHandles,
    updateLengthAndRefX,
    setArrowheadType,
    getArrowInfo,
    clamp,
    changeArrowheadPreset,
    setArrowheadHeight,
    setArrowheadLength,
    setArrowheadRadiusX,
    setArrowheadRadiusY
} from '../utilities/arrowhead';

const editorHeight = 150;
const editorWidth = 300;
const buffer = 25;

const leftBufferX = buffer;
const rightBufferX = editorWidth - buffer;

export function arrowheadHandleDrag(stateCopy, action, root) {
    var { arrowheadId, arrowhead, pathId, path } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);
    const { draggableData, handleIndex } = action.payload;

    stateCopy.arrowheads.byId[arrowheadId] = reshape(arrowhead, draggableData, handleIndex, editorHeight, editorWidth, buffer, stateCopy.lockAspectRatio);
    stateCopy.shapes.byId[pathId] = Object.assign({}, path, {arrowheadLength: stateCopy.arrowheads.byId[arrowheadId].length});

    return stateCopy;
}

export function changeArrowheadType(stateCopy, action, root) {
    var { arrowheadId, arrowhead, pathId, path } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);
    const { arrowheadType } = action.payload;

    const newArrowhead = setArrowheadType(arrowheadType);

    stateCopy.arrowheads.byId[arrowheadId] = Object.assign({}, arrowhead, {...newArrowhead});
    stateCopy.shapes.byId[pathId] = Object.assign({}, path, {arrowheadLength: newArrowhead.length});

    return stateCopy;
}

export function changeArrowheadHeight(stateCopy, action, root) {
    var { arrowheadId, arrowhead, pathId, path } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);
    const { lockAspectRatio } = stateCopy;
    const { height } = action.payload;

    arrowhead = setArrowheadHeight(arrowhead, height, 0, editorHeight);

    if (lockAspectRatio && arrowhead.type !== "polyline") {
        arrowhead = setArrowheadLength(arrowhead, height, rightBufferX - editorHeight, rightBufferX);
    }

    arrowhead = updateLengthAndRefX(arrowhead);
    arrowhead = updateHandles(arrowhead);

    stateCopy.arrowheads.byId[arrowheadId] = arrowhead;
    stateCopy.shapes.byId[pathId] = Object.assign({}, path, {arrowheadLength: arrowhead.length});

    return stateCopy;
}

export function changeArrowheadLength(stateCopy, action, root) {
    var { arrowheadId, arrowhead, pathId, path } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);
    const { lockAspectRatio } = stateCopy;
    const { length } = action.payload;

    if (lockAspectRatio && arrowhead.type !== "polyline") {
        arrowhead = setArrowheadHeight(arrowhead, length, 0, editorHeight);
        arrowhead = setArrowheadLength(arrowhead, length, rightBufferX - editorHeight, rightBufferX);
    } else {
        arrowhead = setArrowheadLength(arrowhead, length, leftBufferX, rightBufferX);
    }

    arrowhead = updateLengthAndRefX(arrowhead);
    arrowhead = updateHandles(arrowhead);

    stateCopy.arrowheads.byId[arrowheadId] = arrowhead;
    stateCopy.shapes.byId[pathId] = Object.assign({}, path, {arrowheadLength: arrowhead.length});

    return stateCopy;
}

export function changeArrowheadBarbLength(stateCopy, action, root) {
    var { arrowheadId, arrowhead, pathId, path } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);
    var { length } = action.payload;

    length = clamp(length, leftBufferX - arrowhead.points[0], rightBufferX - arrowhead.points[0]);

    arrowhead.points[6] = arrowhead.points[0] + length;

    arrowhead = updateLengthAndRefX(arrowhead);
    arrowhead = updateHandles(arrowhead);

    stateCopy.arrowheads.byId[arrowheadId] = arrowhead;
    stateCopy.shapes.byId[pathId] = Object.assign({}, path, {arrowheadLength: arrowhead.length});

    return stateCopy;
}

export function changeArrowheadRadiusX(stateCopy, action, root) {
    var { arrowheadId, arrowhead, pathId, path } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);
    const { lockAspectRatio } = stateCopy;
    const { rx } = action.payload;

    if (lockAspectRatio) {
        arrowhead = setArrowheadRadiusY(arrowhead, rx, 0, editorHeight);
        arrowhead = setArrowheadRadiusX(arrowhead, rx, rightBufferX - editorHeight, rightBufferX);
    } else {
        arrowhead = setArrowheadRadiusX(arrowhead, rx, leftBufferX, rightBufferX);
    }

    arrowhead = updateLengthAndRefX(arrowhead);
    arrowhead = updateHandles(arrowhead);

    stateCopy.arrowheads.byId[arrowheadId] = arrowhead;
    stateCopy.shapes.byId[pathId] = Object.assign({}, path, {arrowheadLength: arrowhead.length});

    return stateCopy;
}

export function changeArrowheadRadiusY(stateCopy, action, root) {
    var { arrowheadId, arrowhead, pathId, path } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);
    const { lockAspectRatio } = stateCopy;
    const { ry } = action.payload;

    arrowhead = setArrowheadRadiusY(arrowhead, ry, 0, editorHeight);

    if (lockAspectRatio) {
        arrowhead = setArrowheadRadiusX(arrowhead, ry, rightBufferX - editorHeight, rightBufferX);
    }

    arrowhead = updateLengthAndRefX(arrowhead);
    arrowhead = updateHandles(arrowhead);

    stateCopy.arrowheads.byId[arrowheadId] = arrowhead;
    stateCopy.shapes.byId[pathId] = Object.assign({}, path, {arrowheadLength: arrowhead.length});

    return stateCopy;
}

export function toggleArrowheadFill(stateCopy, action, root) {
    var { arrowheadId } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

    if (stateCopy.arrowheads.byId[arrowheadId].fillOpacity === 1) {
        stateCopy.arrowheads.byId[arrowheadId].fillOpacity = 0;
    } else {
        stateCopy.arrowheads.byId[arrowheadId].fillOpacity = 1;
    }

    return stateCopy;
}

export function toggleArrowheadAspect(stateCopy) {
    stateCopy.lockAspectRatio = !stateCopy.lockAspectRatio;

    return stateCopy;
}

export function addArrowheadPreset(stateCopy, action) {
    const { name, arrowhead } = action.payload;

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

    stateCopy.arrowheads.presets[name] = updateLengthAndRefX(newArrowheadPreset);

    const { updatedArrowhead, updatedPath } = changeArrowheadPreset(name, stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

    const { arrowheadId, pathId } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);
    stateCopy.arrowheads.byId[arrowheadId] = updatedArrowhead;
    stateCopy.shapes.byId[pathId] = updatedPath;

    return stateCopy;
}

export function saveArrowheadPreset(stateCopy, action) {
    const { arrowhead } = action.payload;

    stateCopy.arrowheads.presets[arrowhead.preset] = arrowhead;

    return stateCopy;
}

export function deleteArrowheadPreset(stateCopy, action) {
    const { presetName } = action.payload;

    var names = Object.keys(stateCopy.arrowheads.presets);
    var index = names.indexOf(presetName);

    delete stateCopy.arrowheads.presets[presetName];

    if (names.length !== 1) {
        var newPreset;

        if (index === 0) {
            newPreset = names[1];
        } else {
            newPreset = names[index - 1];
        }

        const { arrowheadId, pathId } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);
        const { updatedArrowhead, updatedPath } = changeArrowheadPreset(newPreset, stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

        stateCopy.arrowheads.byId[arrowheadId] = updatedArrowhead;
        stateCopy.shapes.byId[pathId] = updatedPath;
    }

    return stateCopy;
}

export function selectArrowheadPreset(stateCopy, action, root) {
    var { name } = action.payload;
    const { arrowheadId, pathId } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

    if (name) {
        const { updatedArrowhead, updatedPath } = changeArrowheadPreset(name, stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

        stateCopy.arrowheads.byId[arrowheadId] = updatedArrowhead;
        stateCopy.shapes.byId[pathId] = updatedPath;
    }

    return stateCopy;
}
