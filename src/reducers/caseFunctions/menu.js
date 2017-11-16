import jsondiffpatch from 'jsondiffpatch';
import { groupShapes, ungroupShapes } from '../utilities/shapes';
import { generateEps } from '../../eps/eps';

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

    switch (keyCode) {
        case 91:
            stateCopy.copied = false;
            stateCopy.pasted = false;
            break;
        case 49: // TEMP: NEED FRONTEND
            stateCopy.centeredControl = !stateCopy.centeredControl;
            break;
        default:
            break;
    }

    return stateCopy;
}

export function undoClick(stateCopy, action, root) {
    const delta = stateCopy.past.pop();

    if (delta && delta.delta) {
        stateCopy.shapes = jsondiffpatch.create().unpatch(stateCopy.shapes, delta.delta);
        stateCopy.future.push(delta);
        stateCopy.selected = [];
        if (stateCopy.past.length > 0) {
            stateCopy.selected = stateCopy.past[stateCopy.past.length - 1].selected;
        }
    }

    return stateCopy;
}

export function redoClick(stateCopy, action, root) {
    const delta = stateCopy.future.pop();

    if (delta && delta.delta) {
        stateCopy.shapes = jsondiffpatch.create().patch(stateCopy.shapes, delta.delta);
        stateCopy.past.push(delta);
        stateCopy.selected = delta.selected;
    }

    return stateCopy;
}

export function selectTool(stateCopy, action) {
    stateCopy.toolType = action.payload.toolType;
    return stateCopy;
}

export function selectColor(stateCopy, action) {
    stateCopy.color = action.payload.color;
    return stateCopy;
}

export function groupButtonClick(stateCopy, action, root) {
    if (stateCopy.selected.length < 2) {
        // need at least 2 shapes
        return stateCopy;
    }

    const group = groupShapes(stateCopy.selected, stateCopy.shapes);
    stateCopy.selected.map((id) => {
        const i = stateCopy.shapes.allIds.indexOf(id);
        stateCopy.shapes.allIds.splice(i, 1);
    });
    stateCopy.shapes.allIds.push(group.id);
    stateCopy.shapes.byId[group.id] = group;
    stateCopy.selected = [group.id];
    return stateCopy;
}

export function ungroupButtonClick(stateCopy, action, root) {
    stateCopy.selected = ungroupShapes(stateCopy.selected, stateCopy.shapes);
    return stateCopy;
}

export function exportClick(stateCopy, action) {
    generateEps(stateCopy);
    return stateCopy;
}
