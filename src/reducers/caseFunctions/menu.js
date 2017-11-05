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

export function selectPalette(stateCopy, action) {
    if (action.payload.paletteName in stateCopy.palettes) {
        stateCopy.currentPalette = action.payload.paletteName;
    }
    return stateCopy;
}

export function addColor(stateCopy, action) {
    stateCopy.palettes[stateCopy.currentPalette].colors.push(colorToString(action.payload.color));
    return stateCopy;
}

export function removeColor(stateCopy, action) {
    const palette = stateCopy.palettes[stateCopy.currentPalette].colors;
    const i = palette.indexOf(colorToString(action.payload.color));

    if (i >= 0) {
        palette.splice(i, 1);
    }

    return stateCopy;
}

export function addPalette(stateCopy, action) {
    stateCopy.palettes[action.payload.paletteName] = {
        'type': "HEX", // should change this once we figure out the interface
        'colors': action.payload.paletteColors
    };
    return stateCopy;
}

export function removePalette(stateCopy, action) {
    const palette = action.payload.paletteName;
    // can't delete the default palette
    if (palette in stateCopy.palettes && palette !== "Default") {
        if (stateCopy.currentPalette === palette) {
            stateCopy.currentPalette = "Default";
        }
        delete stateCopy.palettes[palette];
    }
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

function colorToString(colorObj) {
    return "rgba(" + colorObj['r'] + "," + colorObj['g'] + "," + colorObj['b'] + "," + colorObj['a'] + ")";
}
