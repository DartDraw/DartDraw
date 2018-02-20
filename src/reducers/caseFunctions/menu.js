import jsondiffpatch from 'jsondiffpatch';
import { groupShapes, ungroupShapes } from '../utilities/shapes';
import { generateEps } from '../../eps/eps';

export function keyDown(stateCopy, action, root) {
    const { keyCode } = action.payload;
    if (!stateCopy.currentKeys[keyCode]) {
        stateCopy.currentKeys[keyCode] = true;
    }

    switch (keyCode) {
        default:
            break;
    }
    return stateCopy;
}

export function selectAlignment(stateCopy, action, root) {
    const { id } = action.payload;
    let shiftSelected = 16 in stateCopy.currentKeys;
    if (shiftSelected) {
        switch (id) {
            case 'alignment-top':
                stateCopy.align[0] = 'top';
                break;
            case 'alignment-bottom':
                stateCopy.align[0] = 'bottom';
                break;
            case 'alignment-left':
                stateCopy.align[1] = 'left';
                break;
            case 'alignment-right':
                stateCopy.align[1] = 'right';
                break;
            case 'alignment-vertical':
                stateCopy.align[1] = 'center';
                break;
            case 'alignment-horizontal':
                stateCopy.align[0] = 'center';
                break;
            default:
                break;
        }
    }

    return stateCopy;
}

export function keyUp(stateCopy, action, root) {
    const { keyCode } = action.payload;
    if (stateCopy.currentKeys[keyCode]) {
        delete stateCopy.currentKeys[keyCode];
    }

    let commandSelected = 91 in root.menuState.currentKeys;
    switch (keyCode) {
        case 91:
            stateCopy.copied = false;
            stateCopy.pasted = false;
            break;
        case 49: // TEMP: NEED FRONTEND
            stateCopy.centeredControl = !stateCopy.centeredControl;
            break;
        case 84: // rotate mode
            if (commandSelected && root.drawingState.mode !== 'reshape' &&
              root.drawingState.selected.length > 0) {
                stateCopy.toolType = 'rotateTool';
            }
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

export function selectButton(stateCopy, action) {
    stateCopy.fillStrokeButton = action.payload.button;
    return stateCopy;
}

export function selectColor(stateCopy, action) {
    if (stateCopy.fillStrokeButton === "fill") {
        stateCopy.fillColor = action.payload.color;
    } else {
        stateCopy.strokeColor = action.payload.color;
    }
    stateCopy.color = action.payload.color;
    return stateCopy;
}

export function groupButtonClick(stateCopy, action, root) {
    if (stateCopy.selected.length < 2) {
        // need at least 2 shapes
        return stateCopy;
    }

    const group = groupShapes(stateCopy.selected, stateCopy.shapes);

    let toRemove = [];
    stateCopy.shapes.allIds.map((id, index) => {
        const i = stateCopy.selected.indexOf(id);
        if (i > -1) {
            toRemove.push(index);
        }
    });

    // bring group to highest z-index
    stateCopy.shapes.allIds[toRemove[toRemove.length - 1]] = group.id;
    toRemove.pop();

    for (let i = toRemove.length - 1; i >= 0; i--) {
        stateCopy.shapes.allIds.splice(toRemove[i], 1);
    }
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
