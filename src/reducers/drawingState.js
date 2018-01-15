import jsondiffpatch from 'jsondiffpatch';
import * as canvasActions from './../actions/canvas';
import * as menuActions from './../actions/menu';
import * as canvas from './caseFunctions/canvas';
import * as file from './caseFunctions/file';
import * as shape from './caseFunctions/shape';
import * as menu from './caseFunctions/menu';
import * as zoom from './caseFunctions/zoom';
import { deepCopy } from './utilities/object';

const initialState = {
    shapes: {
        byId: {},
        allIds: []
    },
    selected: [],
    boundingBoxes: {},
    selectionBoxes: {},
    marqueeBox: null,
    lastSavedShapes: {},
    editInProgress: false,
    textInputFocused: false,
    canvasHeight: 850,
    canvasWidth: 1000,
    canvasFill: 'white',
    textInputs: {},
    scale: 1,
    panX: 0,
    panY: 0,
    pasteOffset: {x: 0, y: 0},
    duplicateOffset: {x: 0, y: 0},
    shiftDirection: null,
    past: [],
    future: []
};

function setBackgroundColor(stateCopy, action) {
    const { color } = action.payload;
    stateCopy.canvasFill = color;
    return stateCopy;

}

// function openFile(stateCopy, action) {
//     var newState = JSON.parse(action.payload.data);
//     console.log(newState);
//     var newDrawingState = newState.drawingState;
//     stateCopy.shapes = newDrawingState.shapes;
//     stateCopy.selected = newDrawingState.selected;
//     stateCopy.boundingBoxes = newDrawingState.boundingBoxes;
//     stateCopy.selectionBoxes = newDrawingState.selectionBoxes;
//     stateCopy.marqueeBox = newDrawingState.marqueeBox;
//     stateCopy.lastSavedShapes = newDrawingState.lastSavedShapes;
//     stateCopy.editInProgress = newDrawingState.editInProgress;
//     stateCopy.canvasHeight = newDrawingState.canvasHeight;
//     stateCopy.canvasWidth = newDrawingState.canvasWidth;
//     stateCopy.canvasFill = newDrawingState.canvasFill;
//     stateCopy.scale = newDrawingState.scale;
//     stateCopy.panX = newDrawingState.panX;
//     stateCopy.panY = newDrawingState.panY;
//     stateCopy.past = newDrawingState.past;
//     stateCopy.future = newDrawingState.future;

//     return stateCopy;
// }

function drawingState(state = initialState, action, root) {
    const stateCopy = deepCopy(state);
    let updatedState = stateCopy;

    switch (action.type) {
        case canvasActions.CANVAS_DRAG_START:
            updatedState = canvas.dragStart(stateCopy, action, root);
            break;
        case canvasActions.CANVAS_DRAG:
            updatedState = canvas.drag(stateCopy, action, root);
            break;
        case canvasActions.CANVAS_DRAG_STOP:
            updatedState = canvas.dragStop(stateCopy, action, root);
            break;
        case canvasActions.SHAPE_DRAG_START:
        case canvasActions.GROUP_DRAG_START:
            updatedState = shape.dragStart(stateCopy, action, root);
            break;
        case canvasActions.SHAPE_CLICK:
        case canvasActions.GROUP_CLICK:
            updatedState = shape.click(stateCopy, action, root);
            break;
        case canvasActions.SHAPE_DRAG:
        case canvasActions.GROUP_DRAG:
            updatedState = shape.drag(stateCopy, action, root);
            break;
        case canvasActions.SHAPE_DRAG_STOP:
        case canvasActions.GROUP_DRAG_STOP:
            updatedState = shape.dragStop(stateCopy, action, root);
            break;
        case canvasActions.HANDLE_DRAG_START:
            updatedState = shape.handleDragStart(stateCopy, action, root);
            break;
        case canvasActions.HANDLE_DRAG:
            updatedState = shape.handleDrag(stateCopy, action, root);
            break;
        case canvasActions.HANDLE_DRAG_STOP:
            updatedState = shape.handleDragStop(stateCopy, action, root);
            break;
        case canvasActions.TEXT_INPUT_CHANGE:
            updatedState = shape.textInputChange(stateCopy, action, root);
            break;
        case canvasActions.TOGGLE_TEXT_INPUT_FOCUS:
            updatedState.textInputFocused = action.payload.textInputFocused;
            break;
        case canvasActions.UPDATE_BOUNDING_BOXES:
            updatedState = canvas.handleBoundingBoxUpdate(stateCopy, action, root);
            break;
        case canvasActions.CANVAS_COLOR_CHANGE:
            console.log(action.payload);
            updatedState = canvas.canvasColorChange(stateCopy, action, root);
        case menuActions.SELECT_COLOR:
            updatedState = shape.setColor(stateCopy, action, root);
            break;
        case menuActions.MOVE_FORWARD:
            updatedState = shape.moveForward(stateCopy, action, root);
            break;
        case menuActions.MOVE_BACKWARD:
            updatedState = shape.moveBackward(stateCopy, action, root);
            break;
        case menuActions.BRING_FRONT:
            updatedState = shape.bringFront(stateCopy, action, root);
            break;
        case menuActions.SEND_BACK:
            updatedState = shape.sendBack(stateCopy, action, root);
            break;
        case menuActions.FLIP_VERTICAL:
            updatedState = shape.flipVertical(stateCopy, action, root);
            break;
        case menuActions.FLIP_HORIZONTAL:
            updatedState = shape.flipHorizontal(stateCopy, action, root);
            break;
        case menuActions.KEY_DOWN:
            updatedState = shape.keyDown(stateCopy, action, root);
            break;
        case menuActions.KEY_UP:
            updatedState = shape.keyUp(stateCopy, action, root);
            break;
        case menuActions.SELECT_TOOL:
            updatedState = shape.selectTool(stateCopy, action, root);
            break;
        case menuActions.GROUP_BUTTON_CLICK:
            updatedState = menu.groupButtonClick(stateCopy, action, root);
            break;
        case menuActions.UNGROUP_BUTTON_CLICK:
            updatedState = menu.ungroupButtonClick(stateCopy, action, root);
            break;
        case menuActions.UNDO_CLICK:
            updatedState = menu.undoClick(stateCopy, action, root);
            break;
        case menuActions.REDO_CLICK:
            updatedState = menu.redoClick(stateCopy, action, root);
            break;
        case menuActions.ZOOM_IN:
            updatedState = zoom.zoomIn(stateCopy, action, root);
            break;
        case menuActions.ZOOM_OUT:
            updatedState = zoom.zoomOut(stateCopy, action, root);
            break;
        case menuActions.CUSTOM_ZOOM:
            updatedState = zoom.zoomToCustom(stateCopy, action, root);
            break;
        case menuActions.EXPORT_CLICK:
            return menu.exportClick(stateCopy);
        case menuActions.FILE_SAVE:
            console.log(stateCopy);
            file.fileSave(root, action);
            return stateCopy;
        // case menuActions.FILE_OPEN:
        //     file.fileOpen();
        //     return stateCopy;
        default: break;
    }

    if (action.type !== menuActions.UNDO_CLICK && action.type !== menuActions.REDO_CLICK) {
        if (!updatedState.editInProgress) {
            let delta;
            if (state.editInProgress) {
                delta = jsondiffpatch.create().diff(state.lastSavedShapes, updatedState.shapes);
            } else {
                delta = jsondiffpatch.create().diff(state.shapes, updatedState.shapes);
                updatedState.lastSavedShapes = null;
            }
            if (delta !== undefined) {
                updatedState.future = [];
                let selected = deepCopy(updatedState.selected);
                updatedState.past.push({ delta, selected });
                console.log(action.type, root.menuState);
            }
        }
    }

    if (updatedState.editInProgress) {
        updatedState.justCopied = false;
        updatedState.pasteOffset = {x: 0, y: 0};
    }

    if (root.menuState && root.menuState.toolType !== 'selectTool' && stateCopy.mode === 'reshape') {
        if (root.menuState.toolType !== 'polygonTool') {
            stateCopy.mode = '';
            stateCopy.selected = [];
            stateCopy.selectionBoxes = [];
        }
    }

    return updatedState;
}

export default drawingState;
