import jsondiffpatch from 'jsondiffpatch';
import { generateSelectionBoxes } from '../utilities/selection';

export function keyDown(stateCopy, action) {
    const { keyCode } = action.payload;
    if (!stateCopy.currentKeys[keyCode]) {
        stateCopy.currentKeys[keyCode] = true;
    }
    return stateCopy;
}

export function keyUp(stateCopy, action) {
    const { keyCode } = action.payload;
    if (stateCopy.currentKeys[keyCode]) {
        delete stateCopy.currentKeys[keyCode];
    }
    return stateCopy;
}

export function undoClick(stateCopy, action) {
    const delta = stateCopy.past.pop();

    if (delta) {
        stateCopy.shapes = jsondiffpatch.create().unpatch(stateCopy.shapes, delta);
        stateCopy.future.push(delta);
        stateCopy.selected = [];
        if (stateCopy.past.length > 0) {
            stateCopy.selected = Object.keys(stateCopy.past[stateCopy.past.length - 1].byId);
        }
        stateCopy.selectionBoxes = generateSelectionBoxes(stateCopy.selected, stateCopy.shapes);
    }

    return stateCopy;
}

export function redoClick(stateCopy, action) {
    const delta = stateCopy.future.pop();

    if (delta) {
        stateCopy.shapes = jsondiffpatch.create().patch(stateCopy.shapes, delta);
        stateCopy.past.push(delta);
        stateCopy.selected = Object.keys(delta.byId);
        stateCopy.selectionBoxes = generateSelectionBoxes(stateCopy.selected, stateCopy.shapes);
    }

    return stateCopy;
}

export function selectTool(stateCopy, action) {
    stateCopy.toolType = action.payload.toolType;
    return stateCopy;
}
