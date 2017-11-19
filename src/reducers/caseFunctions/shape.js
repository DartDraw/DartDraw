import { resizeShape, resizeTextBoundingBox, moveShape, endMoveShape, keyboardMoveShape, rotateShape,
    fillShape, changeZIndex, bringToFront, sendToBack, deleteShapes, copyShapes, pasteShapes, flipShape,
    removeTransformation } from '../utilities/shapes';

import { selectShape, updateSelectionBoxesCorners, determineShiftDirection } from '../utilities/selection';

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

                if (!stateCopy.justDuplicated) {
                    stateCopy.duplicateOffset.x = root.menuState.minorGrid;
                    stateCopy.duplicateOffset.y = root.menuState.minorGrid;
                }
            }
            stateCopy.editInProgress = false;
            break;
        case 'polygonTool':
            break;
        default:
            stateCopy.editInProgress = false;
            break;
    }

    return stateCopy;
}

export function dragStart(stateCopy, action, root) {
    switch (root.menuState.toolType) {
        default: break;
    }
    stateCopy.selectionBoxes = updateSelectionBoxesCorners(stateCopy.selected, stateCopy.selectionBoxes);
    return stateCopy;
}

export function drag(stateCopy, action, root) {
    action.payload.draggableData.node = action.payload.draggableData.node.parentNode;

    if (!stateCopy.editInProgress) {
        stateCopy.editInProgress = true;
        stateCopy.lastSavedShapes = root.drawingState.shapes;
        stateCopy.selectionBoxes = updateSelectionBoxesCorners(stateCopy.selected, stateCopy.selectionBoxes);
        switch (root.menuState.toolType) {
            case "selectTool":
                let shiftSelected = 16 in root.menuState.currentKeys;
                if (stateCopy.selected.indexOf(action.payload.shapeId) < 0) {
                    stateCopy.selected = selectShape(stateCopy.selected, action.payload.shapeId, shiftSelected, shiftSelected);
                }
                break;
            default: break;
        }
    } else {
        switch (root.menuState.toolType) {
            case "selectTool":
                let shiftSelected = 16 in root.menuState.currentKeys;
                if (shiftSelected && stateCopy.shiftDirection === null) {
                    stateCopy.shiftDirection = determineShiftDirection(action, stateCopy.scale, shiftSelected);
                }

                stateCopy.shapes = moveShape(stateCopy.shapes, stateCopy.selected, action, stateCopy.scale,
                    stateCopy.boundingBoxes, stateCopy.selectionBoxes, root.menuState.gridSnapping,
                    root.menuState.minorGrid, root.menuState.align, stateCopy.shiftDirection);

                if (stateCopy.justDuplicated) {
                    stateCopy.duplicateOffset.x += action.payload.draggableData.deltaX / stateCopy.scale;
                    stateCopy.duplicateOffset.y += action.payload.draggableData.deltaY / stateCopy.scale;
                }

                break;
            default: break;
        }
    }
    return stateCopy;
}

export function dragStop(stateCopy, action, root) {
    switch (root.menuState.toolType) {
        case "selectTool":
            stateCopy.shapes = endMoveShape(stateCopy.shapes, stateCopy.selected);
            break;
        case 'polygonTool':
            break;
        default:
            stateCopy.editInProgress = false;
            break;
    }

    if (!stateCopy.justDuplicated) {
        stateCopy.duplicateOffset.x = root.menuState.minorGrid;
        stateCopy.duplicateOffset.y = root.menuState.minorGrid;
    }
    stateCopy.justDuplicated = false;
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

    if (shiftSelected && stateCopy.shiftDirection === null) {
        stateCopy.shiftDirection = determineShiftDirection(action, stateCopy.scale, shiftSelected);
    }

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
                        root.menuState.minorGrid, stateCopy.shiftDirection, root.menuState.centeredControl);
                } else {
                    stateCopy.shapes = resizeTextBoundingBox(stateCopy.shapes, stateCopy.selected,
                        draggableData, handleIndex, stateCopy.scale);
                }
                break;
            case "rotateTool":
                stateCopy.shapes = rotateShape(stateCopy.shapes, stateCopy.boundingBoxes, stateCopy.selected,
                    draggableData, handleIndex, stateCopy.scale, shapeId, stateCopy.selectionBoxes, root.menuState.centeredControl);
                break;
            default: break;
        }
    }
    return stateCopy;
}

export function handleDragStop(stateCopy, action, root) {
    switch (root.menuState.toolType) {
        case 'polygonTool':
            break;
        default:
            stateCopy.editInProgress = false;
            break;
    }
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

export function flipVertical(stateCopy, action, root) {
    stateCopy.lastSavedShapes = root.drawingState.shapes;
    stateCopy.shapes = flipShape(stateCopy.shapes, stateCopy.selected,
        stateCopy.selectionBoxes, stateCopy.boundingBoxes, true);
    return stateCopy;
}

export function flipHorizontal(stateCopy, action, root) {
    stateCopy.lastSavedShapes = root.drawingState.shapes;
    stateCopy.shapes = flipShape(stateCopy.shapes, stateCopy.selected,
        stateCopy.selectionBoxes, stateCopy.boundingBoxes, false);
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
        case 37:
        case 38:
        case 39:
        case 40:
            stateCopy.shapes = keyboardMoveShape(stateCopy.shapes, stateCopy.selected, action, stateCopy.scale,
                stateCopy.boundingBoxes, stateCopy.selectionBoxes, root.menuState.gridSnapping, root.menuState.minorGrid, root.menuState.align);
            break;
        case 67: // copy
            let commandSelected = 91 in root.menuState.currentKeys;
            if (commandSelected && !root.menuState.copied) {
                stateCopy.toCopy = copyShapes(stateCopy.shapes, stateCopy.selected);
                stateCopy.justCopied = true;
            }
            break;
        case 68: // duplicate
            commandSelected = 91 in root.menuState.currentKeys;
            if (commandSelected && !root.menuState.copied) {
                stateCopy.toDuplicate = copyShapes(stateCopy.shapes, stateCopy.selected);
                stateCopy.shapes = pasteShapes(stateCopy.shapes, stateCopy.toDuplicate, stateCopy.duplicateOffset);
                stateCopy.selected = stateCopy.shapes.allIds.slice(-1 * Object.keys(stateCopy.toDuplicate).length);
                stateCopy.justDuplicated = true;
            }
            break;
        case 82: // paste
            if (stateCopy.selected.length === 1) {
                stateCopy.shapes = removeTransformation(stateCopy.shapes, stateCopy.selected);
            }
            break;
        case 86: // paste
            commandSelected = 91 in root.menuState.currentKeys;
            if (commandSelected && !root.menuState.pasted && stateCopy.toCopy) {
                if (stateCopy.justCopied) {
                    stateCopy.pasteOffset.x += root.menuState.minorGrid;
                    stateCopy.pasteOffset.y += root.menuState.minorGrid;
                    stateCopy.justCopied = false;
                }
                stateCopy.shapes = pasteShapes(stateCopy.shapes, stateCopy.toCopy, stateCopy.pasteOffset);
                stateCopy.selected = stateCopy.shapes.allIds.slice(-1 * Object.keys(stateCopy.toCopy).length);
                stateCopy.pasteOffset.x += root.menuState.minorGrid;
                stateCopy.pasteOffset.y += root.menuState.minorGrid;
            }
            break;
        default: break;
    }

    return stateCopy;
}

export function keyUp(stateCopy, action, root) {
    const { keyCode } = action.payload;
    switch (keyCode) {
        case 16:
            stateCopy.shiftDirection = null;
            break;
        default:
            break;
    }
    return stateCopy;
}

export function selectTool(stateCopy, action, root) {
    if (root.menuState.toolType === 'polygonTool' && action.toolType !== 'polygonTool') {
        stateCopy.editInProgress = false;
    }
    return stateCopy;
}
