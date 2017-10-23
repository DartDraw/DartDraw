import jsondiffpatch from 'jsondiffpatch';
import guid from 'guid';
import { generateSelectionBoxes } from '../utilities/selection';
import { groupShapes, createRectangle } from '../utilities/shapes';

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

export function zoomIn(stateCopy, action) {
    const scale = 2; // zoom in by factor of 2
    stateCopy.canvasTransformationMatrix = zoom(stateCopy, scale);
    return stateCopy;
}

export function zoomOut(stateCopy, action) {
    const scale = 0.5; // zoom out by factor of 2
    stateCopy.canvasTransformationMatrix = zoom(stateCopy, scale);
    return stateCopy;
}

export function zoom(stateCopy, scale) {
    const m = stateCopy.canvasTransformationMatrix;
    const len = m.length;
    for (let i = 0; i < len; i++) {
        m[i] *= scale;
    }
    m[4] += (1 - scale) * stateCopy.canvasWidth / 2;
    m[5] += (1 - scale) * stateCopy.canvasHeight / 2;
    return m;
}

export function zoomTo(stateCopy) {
    const { canvasTransformationMatrix, canvasWidth, canvasHeight, zoomShape } = stateCopy;

    const m = canvasTransformationMatrix;
    console.log(canvasTransformationMatrix);

    const scale = Math.min(Math.abs(canvasWidth / zoomShape.width), Math.abs(canvasHeight / zoomShape.height));
    const len = m.length;

    for (let i = 0; i < len; i++) {
        m[i] *= scale;
    }

    // m[4] += (1 - scale) * stateCopy.canvasWidth  / 2;
    // m[5] += (1 - scale) * stateCopy.canvasHeight / 2;

    m[4] = m[4] - (scale * (zoomShape.x + (zoomShape.width / 2))); // + (stateCopy.canvasWidth / 2);
    m[5] = m[5] - (scale * (zoomShape.y + (zoomShape.height / 2))); // + (stateCopy.canvasHeight / 2);

    console.log(m);

    return m;
}

export function addZoomShape(zoomShape, action, matrix) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;

    const rectangle = {
        id: guid.create().toString(),
        type: 'zoomShape',
        x: (x - node.getBoundingClientRect().left - matrix[4]) / matrix[0],
        y: (y - node.getBoundingClientRect().top - matrix[5]) / matrix[3],
        width: 0,
        height: 0,
        stroke: 'rgba(102, 204, 255, 0.7)',
        fill: 'none'
    };

    return createRectangle(rectangle);
}

export function resizeZoomShape(zoomShape, draggableData, matrix) {
    const { deltaX, deltaY } = draggableData;
    const scaledDeltaX = deltaX / matrix[0];
    const scaledDeltaY = deltaY / matrix[3];

    zoomShape.width = zoomShape.width + scaledDeltaX;
    zoomShape.height = zoomShape.height + scaledDeltaY;

    return zoomShape;
}

export function pan(matrix, draggableData) {
    const { deltaX, deltaY } = draggableData;
    const m = matrix;

    m[4] += deltaX;
    m[5] += deltaY;

    return m;
}

export function selectTool(stateCopy, action) {
    stateCopy.toolType = action.payload.toolType;
    return stateCopy;
}

export function selectColor(stateCopy, action) {
    stateCopy.color = action.payload.color;
    return stateCopy;
}

export function groupButtonClick(stateCopy, action) {
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
