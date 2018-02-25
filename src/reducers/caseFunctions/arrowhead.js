import {
    reshape,
    updateHandles,
    updateLengthAndRefX,
    setArrowheadType,
    getArrowInfo,
    clamp,
    changeArrowheadPreset
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

    stateCopy.arrowheads.byId[arrowheadId] = reshape(arrowhead, draggableData, handleIndex, editorHeight, editorWidth, buffer);
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
    const { height } = action.payload;
    var { arrowheadId, arrowhead } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

    switch (arrowhead.type) {
        case "triangle":
        case "polyline":
        case "barbed":
            arrowhead.points[1] = clamp(halfHeight - height / 2, 0, halfHeight);
            arrowhead.points[5] = editorHeight - arrowhead.points[1];
            break;
        case "rectangle":
            arrowhead.y = clamp(halfHeight - height / 2, 0, halfHeight);
            arrowhead.height = clamp(height, 0, editorHeight);
            break;
        default: break;
    }

    arrowhead.handles = updateHandles(arrowhead);

    stateCopy.arrowheads.byId[arrowheadId] = arrowhead;

    return stateCopy;
}

export function changeArrowheadLength(stateCopy, action, root) {
    var { length } = action.payload;
    var { arrowheadId, arrowhead, pathId, path } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

    length = clamp(length, 0, rightBufferX - leftBufferX);

    switch (arrowhead.type) {
        case "triangle":
        case "polyline":
            arrowhead.points[0] = rightBufferX - length;
            arrowhead.points[4] = rightBufferX - length;
            break;
        case "barbed":
            const barbLength = arrowhead.points[6] - arrowhead.points[0];
            arrowhead.points[0] = rightBufferX - length;
            arrowhead.points[4] = rightBufferX - length;
            arrowhead.points[6] = clamp(arrowhead.points[0] + barbLength, leftBufferX, rightBufferX);
            break;
        case "rectangle":
            arrowhead.x = rightBufferX - length;
            arrowhead.width = length;
            break;
        default: break;
    }

    arrowhead = updateLengthAndRefX(arrowhead);
    arrowhead.handles = updateHandles(arrowhead);

    stateCopy.arrowheads.byId[arrowheadId] = arrowhead;
    console.log(arrowhead);
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
    var { rx } = action.payload;
    var { arrowheadId, arrowhead, pathId, path } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

    rx = clamp(rx, 0, (rightBufferX - leftBufferX) / 2);

    arrowhead.cx += arrowhead.rx - rx;
    arrowhead.rx = rx;

    arrowhead.handles = updateHandles(arrowhead);
    arrowhead = updateLengthAndRefX(arrowhead);

    stateCopy.arrowheads.byId[arrowheadId] = arrowhead;
    stateCopy.shapes.byId[pathId] = Object.assign({}, path, {arrowheadLength: arrowhead.length});

    return stateCopy;
}

export function changeArrowheadRadiusY(stateCopy, action, root) {
    var { ry } = action.payload;
    var { arrowheadId, arrowhead } = getArrowInfo(stateCopy.shapes, stateCopy.arrowheads, stateCopy.selected);

    ry = clamp(ry, 0, halfHeight);

    arrowhead.ry = ry;

    arrowhead.handles = updateHandles(arrowhead);

    stateCopy.arrowheads.byId[arrowheadId] = arrowhead;

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
