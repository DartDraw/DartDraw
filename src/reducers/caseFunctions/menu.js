import jsondiffpatch from 'jsondiffpatch';
import { generateSelectionBoxes } from '../utilities/selection';

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
