import _ from 'lodash';
import uuidv1 from 'uuid';
import DiffMatchPatch from 'diff-match-patch';
import { resizeShape, resizeTextBoundingBox, moveShape, endMoveShape, keyboardMoveShape, rotateShape,
    fillShape, strokeShape, changeZIndex, bringToFront, sendToBack, deleteShapes, copyShapes, pasteShapes,
    flipShape, moveShapeTo, removeTransformation, reshape, resizeShapeTo, rotateShapeTo, resetShapeSigns,
    prepareForReshape, moveControl, addPoint, removePoint, smoothShapes, unSmoothShapes, alignToShape } from '../utilities/shapes';

import { selectShape, updateSelectionBoxesCorners, determineShiftDirection, updateSelectionBoxes } from '../utilities/selection';
import * as menu from './menu';

export function editShape(stateCopy, action, root) {
    stateCopy.shapes.byId[action.payload.shape.id] = action.payload.shape;
    return stateCopy;
}

export function editText(stateCopy, action, root) {
    const { shape } = action.payload;
    const { id } = shape;
    const baseShape = stateCopy.shapes.byId[id];
    const { text, tspans, selectionRange } = baseShape;
    const baseStyle = {
        fontFamily: baseShape.fontFamily,
        fontSize: baseShape.fontSize,
        fontWeight: baseShape.fontWeight,
        fontStyle: baseShape.fontStyle,
        textAlign: baseShape.textAlign,
        textDecoration: baseShape.textDecoration,
        lineHeight: baseShape.lineHeight,
        fill: baseShape.fill,
        stroke: baseShape.stroke
    };
    const newStyle = {
        fontFamily: shape.fontFamily,
        fontSize: shape.fontSize,
        fontWeight: shape.fontWeight,
        fontStyle: shape.fontStyle,
        textAlign: shape.textAlign,
        textDecoration: shape.textDecoration,
        lineHeight: shape.lineHeight,
        fill: shape.fill,
        stroke: shape.stroke
    };
    // Remove undefined style keys:
    Object.keys(newStyle).forEach((key) => (newStyle[key] === undefined) && delete newStyle[key]);
    const updatedTspans = tspans.slice();
    if (selectionRange && selectionRange[0] !== selectionRange[1]) {
        if (tspans.length > 0) {
            // If there are other tspans, find overlaps and combine styles:
            tspans.map(tspan => {
                // Tspan overlaps with the selection range:
                if (
                    (selectionRange[0] >= tspan.range[0] && selectionRange[0] < tspan.range[1]) ||
                    (selectionRange[1] > tspan.range[0] && selectionRange[1] <= tspan.range[1]) ||
                    (selectionRange[0] <= tspan.range[0] && selectionRange[1] >= tspan.range[1])
                ) {
                    const tspanIndex = _.findIndex(updatedTspans, function(o) { return _.isEqual(tspan, o); });
                    // Tspan is equal to or entirely inside the selection range:
                    if (selectionRange[0] <= tspan.range[0] && selectionRange[1] >= tspan.range[1]) {
                        updatedTspans[tspanIndex].style = Object.assign({}, tspan.style, newStyle);
                    } else {
                        // Tspan is encloses or partially overlaps with selection range, so remove it and break it up:
                        updatedTspans.splice(tspanIndex, 1);
                        // Create new tspans in the place where it's not overlapping selection range and combine overlapping styles:
                        if (selectionRange[0] >= tspan.range[0] && selectionRange[1] <= tspan.range[1]) {
                            if (selectionRange[0] !== tspan.range[0]) {
                                updatedTspans.push({ id: uuidv1(), style: tspan.style, range: [tspan.range[0], selectionRange[0]] });
                            }
                            updatedTspans.push({ id: uuidv1(), style: Object.assign({}, tspan.style, newStyle), range: [selectionRange[0], selectionRange[1]] });
                            if (selectionRange[1] !== tspan.range[1]) {
                                updatedTspans.push({ id: uuidv1(), style: tspan.style, range: [selectionRange[1], tspan.range[1]] });
                            }
                        } else {
                            if (selectionRange[0] >= tspan.range[0]) {
                                if (selectionRange[0] !== tspan.range[0]) {
                                    updatedTspans.push({ id: uuidv1(), style: tspan.style, range: [tspan.range[0], selectionRange[0]] });
                                }
                                updatedTspans.push({ id: uuidv1(), style: Object.assign({}, tspan.style, newStyle), range: [selectionRange[0], tspan.range[1]] });
                            }
                            if (selectionRange[1] <= tspan.range[1]) {
                                updatedTspans.push({ id: uuidv1(), style: Object.assign({}, tspan.style, newStyle), range: [tspan.range[0], selectionRange[0]] });
                                if (selectionRange[1] !== tspan.range[1]) {
                                    updatedTspans.push({ id: uuidv1(), style: tspan.style, range: [selectionRange[1], tspan.range[1]] });
                                }
                            }
                        }
                    }
                }
            });
        } else {
            if (selectionRange[0] !== 0) {
                updatedTspans.push({ id: uuidv1(), style: baseStyle, range: [0, selectionRange[0]] });
            }
            updatedTspans.push({ id: uuidv1(), style: Object.assign({}, baseStyle, newStyle), range: selectionRange });
            if (selectionRange[1] < text.length) {
                updatedTspans.push({ id: uuidv1(), style: baseStyle, range: [selectionRange[1], text.length] });
            }
        }
        stateCopy.shapes.byId[shape.id].tspans = updatedTspans.sort((a, b) => {
            return a.range[0] - b.range[0];
        });
    } else {
        stateCopy.shapes.byId[shape.id] = Object.assign({}, baseShape, shape);
    }
    return stateCopy;
}

export function click(stateCopy, action, root) {
    if (stateCopy.mode === 'reshape') { return stateCopy; }

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
                    stateCopy.duplicateOffset.x = stateCopy.gridSnapInterval;
                    stateCopy.duplicateOffset.y = stateCopy.gridSnapInterval;
                }
            }
            stateCopy.editInProgress = false;
            stateCopy.shapes = removeTransformation(stateCopy.shapes, stateCopy.selected);
            break;
        case 'polygonTool':
        case 'bezierTool':
            stateCopy.mode = "reshape";
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

    return stateCopy;
}

export function drag(stateCopy, action, root) {
    if (stateCopy.mode === 'reshape') { return stateCopy; }

    action.payload.draggableData.node = action.payload.draggableData.node.parentNode;

    stateCopy.mouseCoords.x = action.payload.draggableData.x;
    stateCopy.mouseCoords.y = action.payload.draggableData.y;

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
                    stateCopy.gridSnapInterval, root.menuState.align, stateCopy.shiftDirection);

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
    if (stateCopy.mode === 'reshape') { return stateCopy; }

    switch (root.menuState.toolType) {
        case "selectTool":
            stateCopy.shapes = endMoveShape(stateCopy.shapes, stateCopy.selected);
            stateCopy.shapes = removeTransformation(stateCopy.shapes, stateCopy.selected);
            break;
        case 'polygonTool':
        case 'bezierTool':
            break;
        default:
            stateCopy.editInProgress = false;
            break;
    }

    if (!stateCopy.justDuplicated) {
        stateCopy.duplicateOffset.x = stateCopy.gridSnapInterval;
        stateCopy.duplicateOffset.y = stateCopy.gridSnapInterval;
    }
    stateCopy.justDuplicated = false;
    return stateCopy;
}

export function handleDragStart(stateCopy, action, root) {
    switch (root.menuState.toolType) {
        default: break;
    }

    const { handleIndex } = action.payload;
    if (stateCopy.mode === 'reshape') {
        stateCopy.selectedHandle = handleIndex;
        return stateCopy;
    }
    return stateCopy;
}

export function handleDrag(stateCopy, action, root) {
    action.payload.draggableData.node = action.payload.draggableData.node.parentNode.parentNode;
    let shiftSelected = 16 in root.menuState.currentKeys;

    const { draggableData, handleIndex, shapeId } = action.payload;

    if (shiftSelected && stateCopy.shiftDirection === null) {
        stateCopy.shiftDirection = determineShiftDirection(action, stateCopy.scale, shiftSelected);
    }

    if (!stateCopy.editInProgress && !stateCopy.mode === 'reshape') {
        stateCopy.selectionBoxes = updateSelectionBoxesCorners(stateCopy.selected, stateCopy.selectionBoxes);
        stateCopy.editInProgress = true;
        stateCopy.lastSavedShapes = root.drawingState.shapes;
    } else {
        if (stateCopy.mode === 'reshape') {
            stateCopy.shape = reshape(stateCopy.shapes, stateCopy.selected, draggableData, handleIndex,
                stateCopy.panX, stateCopy.panY, stateCopy.scale, root.menuState.gridSnapping, stateCopy.gridSnapInterval);
            stateCopy.selectedHandle = handleIndex;
            return stateCopy;
        }

        switch (root.menuState.toolType) {
            case "selectTool":
                if (stateCopy.shapes.byId[shapeId].type !== 'text') {
                    action.payload.draggableData.node = action.payload.draggableData.node.parentNode;
                    stateCopy.shapes = resizeShape(stateCopy.shapes, stateCopy.boundingBoxes,
                        stateCopy.selected, draggableData, handleIndex, stateCopy.panX, stateCopy.panY,
                        stateCopy.scale, shapeId, stateCopy.selectionBoxes, root.menuState.gridSnapping,
                        stateCopy.gridSnapInterval, stateCopy.shiftDirection, root.menuState.centeredControl);
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
        case 'bezierTool':
            break;
        case 'selectTool':
        case 'rotateTool':
            stateCopy.shapes = resetShapeSigns(stateCopy.shapes, stateCopy.selected);

            if (stateCopy.mode === "reshape") {
                stateCopy.shapes.byId[stateCopy.selected[0]].refreshSelection = true;
                stateCopy.selectionBoxes = updateSelectionBoxes(stateCopy.selected, stateCopy.shapes, stateCopy.selectionBoxes, stateCopy.boundingBoxes, stateCopy.mode);
            }
            break;
        default:
            stateCopy.editInProgress = false;
            break;
    }

    return stateCopy;
}

export function addPointDragStop(stateCopy, action, root) {
    switch (root.menuState.toolType) {
        case 'selectTool':
            stateCopy.shapes = addPoint(stateCopy.shapes, stateCopy.selected, action.payload.handleIndex, action.payload.draggableData, stateCopy.panX, stateCopy.panY, stateCopy.scale);
            stateCopy.selectionBoxes = updateSelectionBoxesCorners(stateCopy.selected, stateCopy.selectionBoxes, stateCopy.mode);
            break;
        default:
            stateCopy.editInProgress = false;
            break;
    }
    return stateCopy;
}

export function controlDragStart(stateCopy, action, root) {
    switch (root.menuState.toolType) {
        default: break;
    }
    return stateCopy;
}

export function controlDrag(stateCopy, action, root) {
    const { draggableData, handleIndex } = action.payload;

    stateCopy.mouseCoords.x = draggableData.x;
    stateCopy.mouseCoords.y = draggableData.y;

    if (!stateCopy.editInProgress) {
        stateCopy.editInProgress = true;
        stateCopy.lastSavedShapes = root.drawingState.shapes;
    } else {
        if (stateCopy.mode === 'reshape') {
            stateCopy.shape = moveControl(stateCopy.shapes, stateCopy.selected, draggableData, handleIndex,
                stateCopy.panX, stateCopy.panY, stateCopy.scale);
            stateCopy.selectionBoxes = updateSelectionBoxes(stateCopy.selected, stateCopy.shapes, stateCopy.selectionBoxes, stateCopy.boundingBoxes, stateCopy.mode);

            return stateCopy;
        }
    }
    return stateCopy;
}

export function controlDragStop(stateCopy, action, root) {
    switch (stateCopy.mode) {
        default: break;
    }

    if (stateCopy.mode === "reshape") {
        stateCopy.shapes.byId[stateCopy.selected[0]].refreshSelection = true;
        stateCopy.selectionBoxes = updateSelectionBoxes(stateCopy.selected, stateCopy.shapes, stateCopy.selectionBoxes, stateCopy.boundingBoxes, stateCopy.mode);
    }

    stateCopy.editInProgress = false;
    return stateCopy;
}

export function textInputChange(stateCopy, action, root) {
    const { shapeId, value, focused, selectionRange } = action.payload;

    const tspans = stateCopy.shapes.byId[shapeId].tspans;
    const updatedTspans = _.cloneDeep(tspans);
    const previousValue = stateCopy.shapes.byId[shapeId].text;
    const dmp = new DiffMatchPatch();
    let currentIndex = 0;
    dmp.diff_main(previousValue, value).map(diff => {
        if (diff[0] === DiffMatchPatch.DIFF_EQUAL) {
            currentIndex += diff[1].length;
        } else if (diff[0] === DiffMatchPatch.DIFF_INSERT) {
            // Expand whatever tspan this diff was inserted into and all the ones after:
            let editingTspans = false;
            tspans.map((tspan, tspanIndex) => {
                if (editingTspans) {
                    updatedTspans[tspanIndex].range[0] += diff[1].length;
                    updatedTspans[tspanIndex].range[1] += diff[1].length;
                } else if (currentIndex > tspan.range[0] && currentIndex <= tspan.range[1]) {
                    updatedTspans[tspanIndex].range[1] += diff[1].length;
                    editingTspans = true;
                }
            });
            currentIndex += diff[1].length;
        } else if (diff[0] === DiffMatchPatch.DIFF_DELETE) {
            diff[1].split('').map(char => {
                let editingTspans = false;
                tspans.map(tspan => {
                    const tspanIndex = _.findIndex(updatedTspans, function(o) { return tspan.id === o.id; });
                    if (editingTspans) {
                        updatedTspans[tspanIndex].range[0] -= 1;
                        updatedTspans[tspanIndex].range[1] -= 1;
                    } else if (currentIndex >= tspan.range[0] && currentIndex < tspan.range[1]) {
                        updatedTspans[tspanIndex].range[1] -= 1;
                        if (updatedTspans[tspanIndex].range[0] === updatedTspans[tspanIndex].range[1]) {
                            updatedTspans.splice(tspanIndex, 1);
                        }
                        editingTspans = true;
                    }
                });
                currentIndex += 1;
            });
            currentIndex -= diff[1].length;
        }
    });

    stateCopy.shapes.byId[shapeId].text = value;
    stateCopy.shapes.byId[shapeId].focused = focused;
    stateCopy.shapes.byId[shapeId].selectionRange = selectionRange;
    stateCopy.shapes.byId[shapeId].tspans = updatedTspans;
    return stateCopy;
}

export function setColor(stateCopy, action, root) {
    stateCopy.lastSavedShapes = root.drawingState.shapes;
    if (root.menuState.fillStrokeButton === "fill") {
        stateCopy.shapes = fillShape(stateCopy.shapes, stateCopy.selected, action);
    } else {
        stateCopy.shapes = strokeShape(stateCopy.shapes, stateCopy.selected, action);
    }
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

export function resizeShapes(stateCopy, action, root) {
    stateCopy.shapes = resizeShapeTo(stateCopy.shapes, stateCopy.selected, action, stateCopy.scale,
        stateCopy.boundingBoxes, stateCopy.selectionBoxes);
    return stateCopy;
}

export function moveShapes(stateCopy, action, root) {
    stateCopy.shapes = moveShapeTo(stateCopy.shapes, stateCopy.selected, action, stateCopy.scale,
        stateCopy.boundingBoxes, stateCopy.selectionBoxes);
    return stateCopy;
}

export function rotateShapes(stateCopy, action, root) {
    stateCopy.shapes = rotateShapeTo(stateCopy.shapes, stateCopy.selected, action, stateCopy.scale,
        stateCopy.boundingBoxes, stateCopy.selectionBoxes);
    return stateCopy;
}

export function keyDown(stateCopy, action, root) {
    // No keyboard shortcuts during text focus
    const shapeIds = stateCopy.shapes.allIds;
    for (let i = 0; i < shapeIds.length; i++) {
        const id = shapeIds[i];
        if (stateCopy.shapes.byId[id].focused) {
            return stateCopy;
        }
    }

    const { keyCode } = action.payload;
    let commandSelected = 91 in root.menuState.currentKeys;

    switch (keyCode) {
        case 8:
            stateCopy.lastSavedShapes = root.drawingState.shapes;
            if (stateCopy.mode === 'reshape') {
                stateCopy.shape = removePoint(stateCopy.shapes, stateCopy.selected, stateCopy.selectedHandle);
            } else {
                stateCopy.shapes = deleteShapes(stateCopy.shapes, stateCopy.selected);
                stateCopy.selected = [];
            }
            break;
        case 13: // finish reshape
            if (root.menuState.toolType === 'selectTool' && stateCopy.mode === 'reshape') {
                stateCopy.mode = "";
                stateCopy.shapes.byId[stateCopy.selected[0]].reshapeInProgress = false;
                stateCopy.selectionBoxes = updateSelectionBoxes(stateCopy.selected, stateCopy.shapes, stateCopy.selectionBoxes, stateCopy.boundingBoxes, stateCopy.mode);
            }
            break;
        case 37:
        case 38:
        case 39:
        case 40:
            stateCopy.shapes = keyboardMoveShape(stateCopy.shapes, stateCopy.selected, action, stateCopy.scale,
                stateCopy.boundingBoxes, stateCopy.selectionBoxes, root.menuState.gridSnapping, stateCopy.gridSnapInterval, root.menuState.align);
            break;
        case 67: // copy
            if (commandSelected && !root.menuState.copied) {
                stateCopy.toCopy = copyShapes(stateCopy.shapes, stateCopy.selected);
                stateCopy.justCopied = true;
            }
            break;
        case 68: // duplicate
            if (commandSelected && !root.menuState.copied) {
                stateCopy.toDuplicate = copyShapes(stateCopy.shapes, stateCopy.selected);
                stateCopy.shapes = pasteShapes(stateCopy.shapes, stateCopy.toDuplicate, stateCopy.duplicateOffset);
                stateCopy.selected = stateCopy.shapes.allIds.slice(-1 * Object.keys(stateCopy.toDuplicate).length);
                stateCopy.justDuplicated = true;
            }
            break;
        case 69: // smooth
            if (commandSelected) {
                stateCopy.shapes = smoothShapes(stateCopy.shapes, stateCopy.selected);
            } else {
                stateCopy.shapes = unSmoothShapes(stateCopy.shapes, stateCopy.selected);
            }
            break;
        case 70: // forward
            let upSelected = 38 in root.menuState.currentKeys;
            if (commandSelected && upSelected) {
                stateCopy = bringFront(stateCopy, action, root);
            } else if (commandSelected) {
                stateCopy = moveForward(stateCopy, action, root);
            }
            break;
        case 71: // group
            if (commandSelected) {
                stateCopy = menu.groupButtonClick(stateCopy, action, root);
            }
            break;
        case 74: // backward
            upSelected = 38 in root.menuState.currentKeys;
            if (commandSelected && upSelected) {
                stateCopy = sendBack(stateCopy, action, root);
            } else if (commandSelected) {
                stateCopy = moveBackward(stateCopy, action, root);
            }
            break;
        case 82: // reshape
            if (root.menuState.toolType === 'selectTool' && stateCopy.selected.length === 1) {
                const hasPoints = stateCopy.shapes.byId[stateCopy.selected[0]].points;
                if (hasPoints) {
                    stateCopy.mode = "reshape";
                    stateCopy.shapes = removeTransformation(stateCopy.shapes, stateCopy.selected);
                    stateCopy.selectionBoxes = updateSelectionBoxes(stateCopy.selected, stateCopy.shapes, stateCopy.selectionBoxes, stateCopy.boundingBoxes, stateCopy.mode);
                    stateCopy.shapes = prepareForReshape(stateCopy.shapes, stateCopy.selected);
                }
            }
            break;
        case 85: // ungroup
            if (commandSelected) {
                stateCopy = menu.ungroupButtonClick(stateCopy, action, root);
            }
            break;
        case 86: // paste
            if (commandSelected && !root.menuState.pasted && stateCopy.toCopy) {
                if (stateCopy.justCopied) {
                    stateCopy.pasteOffset.x += stateCopy.gridSnapInterval;
                    stateCopy.pasteOffset.y += stateCopy.gridSnapInterval;
                    stateCopy.justCopied = false;
                }
                stateCopy.shapes = pasteShapes(stateCopy.shapes, stateCopy.toCopy, stateCopy.pasteOffset);
                stateCopy.selected = stateCopy.shapes.allIds.slice(-1 * Object.keys(stateCopy.toCopy).length);
                stateCopy.pasteOffset.x += stateCopy.gridSnapInterval;
                stateCopy.pasteOffset.y += stateCopy.gridSnapInterval;
            }
            break;
        case 88: // cut
            if (commandSelected && !root.menuState.copied) {
                stateCopy.toCopy = copyShapes(stateCopy.shapes, stateCopy.selected);
                stateCopy.shapes = deleteShapes(stateCopy.shapes, stateCopy.selected);
                stateCopy.selected = [];
            }
            break;
        case 54: // TEMP Hard Coded Arc Flip
            if (stateCopy.selected.length > 0 && stateCopy.shapes.byId[stateCopy.selected[0]].type === 'arc') {
                stateCopy.shapes.byId[stateCopy.selected[0]].flipArc = !stateCopy.shapes.byId[stateCopy.selected[0]].flipArc;
            }
            break;
        default:
            break;
    }

    return stateCopy;
}

export function keyUp(stateCopy, action, root) {
    // No keyboard shortcuts during text focus
    const shapeIds = stateCopy.shapes.allIds;
    for (let i = 0; i < shapeIds.length; i++) {
        const id = shapeIds[i];
        if (stateCopy.shapes.byId[id].focused) {
            return stateCopy;
        }
    }
    const { keyCode } = action.payload;
    switch (keyCode) {
        case 16:
            stateCopy.shiftDirection = null;
            break;
        default:
            break;
    }

    stateCopy.editInProgress = false;
    return stateCopy;
}

export function selectTool(stateCopy, action, root) {
    if ((root.menuState.toolType === 'polygonTool' && action.toolType !== 'polygonTool') ||
        (root.menuState.toolType === 'bezierTool' && action.toolType !== 'bezierTool')) {
        stateCopy.editInProgress = false;
    }
    return stateCopy;
}

export function alignClick(stateCopy, action, root) {
    let shiftSelected = 16 in root.menuState.currentKeys;
    if (shiftSelected) {
        stateCopy.shapes = alignToShape(stateCopy.shapes, stateCopy.selected, stateCopy.boundingBoxes, stateCopy.selectionBoxes, action.payload.id);
    }
    return stateCopy;
}
