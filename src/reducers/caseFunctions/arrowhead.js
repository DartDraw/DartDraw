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

const halfHeight = editorHeight / 2;

export function arrowheadHandleDrag(stateCopy, action, root) {
    const { draggableData, handleIndex } = action.payload;
    var { arrowheadId, arrowhead, pathId, path } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

    stateCopy.arrowheads.byId[arrowheadId] = reshape(arrowhead, draggableData, handleIndex, editorHeight, editorWidth, buffer, stateCopy.lockAspectRatio);
    stateCopy.shapes.byId[pathId] = Object.assign({}, path, {arrowheadLength: stateCopy.arrowheads.byId[arrowheadId].length});

    return stateCopy;
}

export function changeArrowheadType(stateCopy, action, root) {
    const { arrowheadType } = action.payload;
    var { arrowheadId, arrowhead, pathId, path } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

    const newArrowhead = setArrowheadType(arrowheadType);

    stateCopy.arrowheads.byId[arrowheadId] = Object.assign({}, arrowhead, {...newArrowhead});
    stateCopy.shapes.byId[pathId] = Object.assign({}, path, {arrowheadLength: newArrowhead.length});

    return stateCopy;
}

export function changeArrowheadHeight(stateCopy, action, root) {
    const { lockAspectRatio } = stateCopy;
    const { height } = action.payload;
    var { arrowheadId, arrowhead, pathId, path } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

    arrowhead = setArrowheadHeight(height, arrowhead, halfHeight, editorHeight);

    if (lockAspectRatio) {
        arrowhead = setArrowheadLength(height, arrowhead, rightBufferX - editorHeight, rightBufferX);
        stateCopy.shapes.byId[pathId] = Object.assign({}, path, {arrowheadLength: arrowhead.length});
    }

    stateCopy.arrowheads.byId[arrowheadId] = arrowhead;

    return stateCopy;
}

export function changeArrowheadLength(stateCopy, action, root) {
    const { lockAspectRatio } = stateCopy;
    var { length } = action.payload;
    var { arrowheadId, arrowhead, pathId, path } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

    arrowhead = setArrowheadLength(length, arrowhead, rightBufferX - editorHeight, rightBufferX);

    if (lockAspectRatio) {
        arrowhead = setArrowheadHeight(length, arrowhead, halfHeight, editorHeight);
    }

    stateCopy.arrowheads.byId[arrowheadId] = arrowhead;
    stateCopy.shapes.byId[pathId] = Object.assign({}, path, {arrowheadLength: arrowhead.length});

    return stateCopy;
}

export function changeArrowheadBarbLength(stateCopy, action, root) {
    var { length } = action.payload;
    var { arrowheadId, arrowhead, pathId, path } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

    length = clamp(length, leftBufferX - arrowhead.points[0], rightBufferX - arrowhead.points[0]);

    arrowhead.points[6] = arrowhead.points[0] + length;

    arrowhead.handles = updateHandles(arrowhead);

    stateCopy.arrowheads.byId[arrowheadId] = arrowhead;
    stateCopy.shapes.byId[pathId] = Object.assign({}, path, {arrowheadLength: arrowhead.length});

    return stateCopy;
}

export function changeArrowheadRadiusX(stateCopy, action, root) {
    const { lockAspectRatio } = stateCopy;
    var { rx } = action.payload;
    var { arrowheadId, arrowhead, pathId, path } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

    arrowhead = setArrowheadRadiusX(rx, arrowhead, rightBufferX - editorHeight, rightBufferX);

    if (lockAspectRatio) {
        arrowhead = setArrowheadRadiusY(rx, arrowhead, halfHeight);
    }

    stateCopy.arrowheads.byId[arrowheadId] = arrowhead;
    stateCopy.shapes.byId[pathId] = Object.assign({}, path, {arrowheadLength: arrowhead.length});

    return stateCopy;
}

export function changeArrowheadRadiusY(stateCopy, action, root) {
    const { lockAspectRatio } = stateCopy;
    var { ry } = action.payload;
    var { arrowheadId, arrowhead, pathId, path } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

    arrowhead = setArrowheadRadiusY(ry, arrowhead, halfHeight);

    if (lockAspectRatio) {
        arrowhead = setArrowheadRadiusX(ry, arrowhead, rightBufferX - editorHeight, rightBufferX);
    }

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

    console.log(stateCopy.lockAspectRatio);

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
    const { name } = action.payload;
    const { arrowheadId, pathId } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

    const { updatedArrowhead, updatedPath } = changeArrowheadPreset(name, stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

    stateCopy.arrowheads.byId[arrowheadId] = updatedArrowhead;
    stateCopy.shapes.byId[pathId] = updatedPath;

    return stateCopy;
}
