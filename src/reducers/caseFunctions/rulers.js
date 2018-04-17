// used as reference: https://github.com/Robbbb/VectorRuler/blob/master/rulerGenerator.js
import { setPan } from './zoom';
import { updateRulerGrid, changeRulerPreset, constrainInput, setPixelsPerUnit } from '../utilities/rulers';

export function toggleShowRulers(stateCopy) {
    stateCopy.showRulers = !stateCopy.showRulers;
    return stateCopy;
}

export function selectRuler(stateCopy, action) {
    const { rulerName } = action.payload;
    const { scale, panX, panY } = stateCopy;

    stateCopy.ruler = changeRulerPreset(stateCopy.ruler, rulerName);
    stateCopy.ruler = updateRulerGrid(stateCopy, scale, panX, panY);

    return stateCopy;
}

export function addRuler(stateCopy, action) {
    const { name, unitType, unitDivisions } = action.payload;

    var newRulerPreset = {
        unitType,
        unitDivisions
    };

    stateCopy.ruler.byName[name] = newRulerPreset;

    const { scale, panX, panY } = stateCopy;

    stateCopy.ruler = changeRulerPreset(stateCopy.ruler, name);
    stateCopy.ruler = updateRulerGrid(stateCopy, scale, panX, panY);

    return stateCopy;
}

export function saveRuler(stateCopy, action) {
    const { unitType, unitDivisions } = action.payload;

    var rulerObj = stateCopy.ruler.byName[stateCopy.ruler.current];

    rulerObj.unitType = unitType;
    rulerObj.unitDivisions = unitDivisions;

    const { scale, panX, panY } = stateCopy;

    stateCopy.ruler = changeRulerPreset(stateCopy.ruler, stateCopy.ruler.current);
    stateCopy.ruler = updateRulerGrid(stateCopy, scale, panX, panY);

    return stateCopy;
}

export function deleteRuler(stateCopy) {
    var names = Object.keys(stateCopy.ruler.byName);
    var current = stateCopy.ruler.current;
    var index = names.indexOf(current);

    stateCopy.ruler.current = names[index - 1];
    delete stateCopy.ruler.byName[current];

    const { scale, panX, panY } = stateCopy;

    stateCopy.ruler = changeRulerPreset(stateCopy.ruler, stateCopy.ruler.current);
    stateCopy.ruler = updateRulerGrid(stateCopy, scale, panX, panY);

    return stateCopy;
}

export function toggleRuler(stateCopy, action) {
    const { forward } = action.payload;
    const names = Object.keys(stateCopy.ruler.byName);

    console.log(forward);

    var current = stateCopy.ruler.current;
    var index = names.indexOf(current);

    if (forward) {
        index = (index + 1) % names.length;
    } else {
        if (index === 0) {
            index = names.length - 1;
        } else {
            index = index - 1;
        }
    }

    stateCopy.ruler.current = names[index];

    const { scale, panX, panY } = stateCopy;

    stateCopy.ruler = changeRulerPreset(stateCopy.ruler, stateCopy.ruler.current);
    stateCopy.ruler = updateRulerGrid(stateCopy, scale, panX, panY);

    return stateCopy;
}

export function setRulerGrid(stateCopy, action) {
    if (action.payload) {
        const { unitType, width, height, unitDivisions } = constrainInput(action.payload);
        stateCopy.ruler.unitDivisions = unitDivisions;
        stateCopy.ruler.unitType = unitType;
        stateCopy.ruler.pixelsPerUnit = setPixelsPerUnit(unitType);
        stateCopy.canvasWidth = width * stateCopy.ruler.pixelsPerUnit;
        stateCopy.canvasHeight = height * stateCopy.ruler.pixelsPerUnit;
    }

    const { panX, panY } = setPan(stateCopy, stateCopy.scale);

    stateCopy.panX = panX;
    stateCopy.panY = panY;

    stateCopy.ruler = updateRulerGrid(stateCopy, stateCopy.scale, stateCopy.panX, stateCopy.panY);

    stateCopy.gridSnapInterval = stateCopy.ruler.pixelsPerUnit / stateCopy.ruler.unitDivisions;

    return stateCopy;
}
