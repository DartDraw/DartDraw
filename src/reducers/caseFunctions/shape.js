import { resizeShape, resizeTextBoundingBox, moveShape, initializeMoveShape, rotateShape,
    fillShape, changeZIndex, bringToFront, sendToBack, deleteShapes, copyShapes, pasteShapes } from '../utilities/shapes';

import { selectShape, updateSelectionBoxesCorners } from '../utilities/selection';

export function click(stateCopy, action, root) {
    switch (root.menuState.toolType) {
        case "selectTool":
            if (!stateCopy.editInProgress) {
                let shiftSelected = 16 in root.menuState.currentKeys;
                let selectMultiple = false;
                if (shiftSelected || (stateCopy.selected.length > 1 &&
                  stateCopy.selected.indexOf(action.payload.shapeId) > -1)) {
                    selectMultiple = true;
                }
                stateCopy.selected = selectShape(stateCopy.selected, action.payload.shapeId, selectMultiple, shiftSelected);
            }
            break;
        default: break;
    }
    stateCopy.editInProgress = false;
    return stateCopy;
}

export function dragStart(stateCopy, action, root) {
    switch (root.menuState.toolType) {
        default: break;
    }
    return stateCopy;
}

export function drag(stateCopy, action, root) {
    action.payload.draggableData.node = action.payload.draggableData.node.parentNode;

    if (!stateCopy.editInProgress) {
        stateCopy.editInProgress = true;
        stateCopy.lastSavedShapes = root.drawingState.shapes;
        switch (root.menuState.toolType) {
            case "selectTool":
                let shiftSelected = 16 in root.menuState.currentKeys;
                if (stateCopy.selected.indexOf(action.payload.shapeId) < 0) {
                    stateCopy.selected = selectShape(stateCopy.selected, action.payload.shapeId, shiftSelected, shiftSelected);
                }
                stateCopy.shapes = initializeMoveShape(stateCopy.shapes, stateCopy.selected, stateCopy.scale,
                    stateCopy.boundingBoxes, root.menuState.gridSnapping, root.menuState.minorGrid);
                break;
            default: break;
        }
    } else {
        switch (root.menuState.toolType) {
            case "selectTool":
                stateCopy.shapes = moveShape(stateCopy.shapes, stateCopy.selected, action, stateCopy.scale,
                    stateCopy.boundingBoxes, root.menuState.gridSnapping, root.menuState.minorGrid);
                break;
            default: break;
        }
    }
    return stateCopy;
}

export function dragStop(stateCopy, action, root) {
    switch (root.menuState.toolType) {
        default:
            break;
    }
    stateCopy.editInProgress = false;
    return stateCopy;
}

export function handleDragStart(stateCopy, action, root) {
    switch (root.menuState.toolType) {
        default: break;
    }
    return stateCopy;
}

export function handleDrag(stateCopy, action, root) {
    action.payload.draggableData.node = action.payload.draggableData.node.parentNode.parentNode;
    let shiftSelected = 16 in root.menuState.currentKeys;

    if (!stateCopy.editInProgress) {
        stateCopy.selectionBoxes = updateSelectionBoxesCorners(stateCopy.selected, stateCopy.selectionBoxes);
        stateCopy.editInProgress = true;
        stateCopy.lastSavedShapes = root.drawingState.shapes;
    } else {
        const { draggableData, handleIndex, shapeId } = action.payload;
        switch (root.menuState.toolType) {
            case "selectTool":
                if (stateCopy.shapes.byId[shapeId].type !== 'text') {
                    action.payload.draggableData.node = action.payload.draggableData.node.parentNode;
                    stateCopy.shapes = resizeShape(stateCopy.shapes, stateCopy.boundingBoxes,
                        stateCopy.selected, draggableData, handleIndex, stateCopy.panX, stateCopy.panY,
                        stateCopy.scale, shapeId, stateCopy.selectionBoxes, root.menuState.gridSnapping,
                        root.menuState.minorGrid, shiftSelected);
                } else {
                    stateCopy.shapes = resizeTextBoundingBox(stateCopy.shapes, stateCopy.selected,
                        draggableData, handleIndex, stateCopy.scale);
                }
                break;
            case "rotateTool":
                stateCopy.shapes = rotateShape(stateCopy.shapes, stateCopy.boundingBoxes, stateCopy.selected, draggableData, handleIndex, stateCopy.scale, shapeId, stateCopy.selectionBoxes);
                break;
            default: break;
        }
    }
    return stateCopy;
}

export function handleDragStop(stateCopy, action, root) {
    switch (root.menuState.toolType) {
        default:
            break;
    }
    stateCopy.editInProgress = false;
    return stateCopy;
}

export function textInputChange(stateCopy, action, root) {
    const { shapeId, value } = action.payload;
    stateCopy.textInputs[shapeId].value = value;
    stateCopy.shapes.byId[shapeId].text = value;
    return stateCopy;
}

export function setColor(stateCopy, action, root) {
    stateCopy.lastSavedShapes = root.drawingState.shapes;
    stateCopy.shapes = fillShape(stateCopy.shapes, stateCopy.selected, action);
    return stateCopy;
}

export function moveForward(stateCopy, action, root) {
    stateCopy.lastSavedShapes = root.drawingState.shapes;
    stateCopy.shapes = changeZIndex(stateCopy.shapes, stateCopy.selected, 1);
    return stateCopy;
}

export function moveBackward(stateCopy, action, root) {
    stateCopy.lastSavedShapes = root.drawingState.shapes;
    stateCopy.shapes = changeZIndex(stateCopy.shapes, stateCopy.selected, -1);
    return stateCopy;
}

export function bringFront(stateCopy, action, root) {
    stateCopy.lastSavedShapes = root.drawingState.shapes;
    stateCopy.shapes = bringToFront(stateCopy.shapes, stateCopy.selected);
    return stateCopy;
}

export function sendBack(stateCopy, action, root) {
    stateCopy.lastSavedShapes = root.drawingState.shapes;
    stateCopy.shapes = sendToBack(stateCopy.shapes, stateCopy.selected);
    return stateCopy;
}

export function keyDown(stateCopy, action, root) {
    const { keyCode } = action.payload;
    switch (keyCode) {
        case 8:
            if (!stateCopy.textInputFocused) {
                stateCopy.lastSavedShapes = root.drawingState.shapes;
                stateCopy.shapes = deleteShapes(stateCopy.shapes, stateCopy.selected);
                stateCopy.selected = [];
            }
            break;
        case 67:
            let commandSelected = 91 in root.menuState.currentKeys;
            if (commandSelected && !root.menuState.copied) {
                stateCopy.toCopy = copyShapes(stateCopy.shapes, stateCopy.selected);
            }
            break;
        case 86:
            commandSelected = 91 in root.menuState.currentKeys;
            if (commandSelected && !root.menuState.pasted && stateCopy.toCopy) {
                stateCopy.shapes = pasteShapes(stateCopy.shapes, stateCopy.toCopy);
                stateCopy.selected = stateCopy.shapes.allIds.slice(-1 * Object.keys(stateCopy.toCopy).length);
            }
            break;
        default: break;
    }
    return stateCopy;
}
