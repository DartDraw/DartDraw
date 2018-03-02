import jsondiffpatch from 'jsondiffpatch';
import * as canvasActions from './../actions/canvas';
import * as menuActions from './../actions/menu';
import * as canvas from './caseFunctions/canvas';
import * as file from './caseFunctions/file';
import * as shape from './caseFunctions/shape';
import * as menu from './caseFunctions/menu';
import * as zoom from './caseFunctions/zoom';
import * as rulers from './caseFunctions/rulers';
import * as arrowhead from './caseFunctions/arrowhead';
import { getArrowheadDefaultPresets } from './utilities/arrowhead';
import { deepCopy } from './utilities/object';

const initialState = {
    shapes: {
        byId: {},
        allIds: []
    },
    arrowheads: {
        byId: {},
        allIds: [],
        presets: getArrowheadDefaultPresets()
    },
    lockAspectRatio: false,
    selected: [],
    boundingBoxes: {},
    selectionBoxes: {},
    mouseCoords: {x: 0, y: 0},
    marqueeBox: null,
    lastSavedShapes: {},
    editInProgress: false,
    textInputFocused: false,
    canvasHeight: 816,
    canvasWidth: 1056,
    textInputs: {},
    scale: 1,
    panX: 0,
    panY: 0,
    pasteOffset: {x: 0, y: 0},
    duplicateOffset: {x: 0, y: 0},
    offset: {x: 0, y: 0},
    shiftDirection: null,
    past: [],
    future: [],
    gridSnapInterval: 48,
    ruler: {
        unitType: 'in',
        unitDivisions: 2,
        width: 30,
        pixelsPerUnit: 96,
        horizontal: {
            ticks: [],
            labels: []
        },
        vertical: {
            ticks: [],
            labels: []
        },
        current: 'Default',
        byName: {
            'Default': {
                unitType: 'in',
                unitDivisions: 2
            }
        }
    }
};

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
        case canvasActions.CONTROL_DRAG_START:
            updatedState = shape.controlDragStart(stateCopy, action, root);
            break;
        case canvasActions.CONTROL_DRAG:
            updatedState = shape.controlDrag(stateCopy, action, root);
            break;
        case canvasActions.CONTROL_DRAG_STOP:
            updatedState = shape.controlDragStop(stateCopy, action, root);
            break;
        case canvasActions.ADD_POINT_DRAG_STOP:
            updatedState = shape.addPointDragStop(stateCopy, action, root);
            break;
        case canvasActions.TEXT_INPUT_CHANGE:
            updatedState = shape.textInputChange(stateCopy, action, root);
            break;
        case canvasActions.UPDATE_BOUNDING_BOXES:
            updatedState = canvas.handleBoundingBoxUpdate(stateCopy, action, root);
            break;
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
        case menuActions.MOUSE_MOVE:
            updatedState = canvas.mouseMove(stateCopy, action, root);
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
        case menuActions.ALIGNMENT_CHANGE:
            updatedState = shape.alignClick(stateCopy, action, root);
            break;
        case menuActions.DISTRIBUTE_CLICK:
            updatedState = shape.distributeClick(stateCopy, action, root);
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
        case menuActions.SET_CUSTOM_ZOOM:
            updatedState = zoom.setCustomZoom(stateCopy, action, root);
            break;
        case menuActions.EXPORT_CLICK:
            return menu.exportClick(stateCopy);
        case menuActions.FILE_SAVE:
            file.fileSave(root, action);
            return stateCopy;
        case menuActions.FILE_OPEN:
            file.fileOpen(stateCopy, action);
            return stateCopy;
        case menuActions.EDIT_SHAPE:
            updatedState = shape.editShape(stateCopy, action, root);
            break;
        case menuActions.EDIT_TEXT:
            updatedState = shape.editText(stateCopy, action, root);
            break;
        case menuActions.SET_RULER_GRID:
            updatedState = rulers.setRulerGrid(stateCopy, action, root);
            break;
        case menuActions.SELECT_RULER:
            updatedState = rulers.selectRuler(stateCopy, action, root);
            break;
        case menuActions.ADD_RULER:
            updatedState = rulers.addRuler(stateCopy, action, root);
            break;
        case menuActions.SAVE_RULER:
            updatedState = rulers.saveRuler(stateCopy, action, root);
            break;
        case menuActions.DELETE_RULER:
            updatedState = rulers.deleteRuler(stateCopy, action, root);
            break;
        case menuActions.TOGGLE_RULER:
            updatedState = rulers.toggleRuler(stateCopy, action, root);
            break;
        case menuActions.RESIZE_SHAPE_TO:
            updatedState = shape.resizeShapes(stateCopy, action, root);
            break;
        case menuActions.MOVE_SHAPE_TO:
            updatedState = shape.moveShapes(stateCopy, action, root);
            break;
        case menuActions.ROTATE_SHAPE_TO:
            updatedState = shape.rotateShapes(stateCopy, action, root);
            break;
        case canvasActions.SCROLL:
            updatedState = canvas.scroll(stateCopy, action, root);
            break;
        case menuActions.ARROWHEAD_HANDLE_DRAG:
            updatedState = arrowhead.arrowheadHandleDrag(stateCopy, action, root);
            break;
        // case menuActions.CHANGE_ARROWHEAD_TYPE:
        //     updatedState = arrowhead.changeArrowheadType(stateCopy, action, root);
        //     break;
        case menuActions.CHANGE_ARROWHEAD_HEIGHT:
            updatedState = arrowhead.changeArrowheadHeight(stateCopy, action, root);
            break;
        case menuActions.CHANGE_ARROWHEAD_LENGTH:
            updatedState = arrowhead.changeArrowheadLength(stateCopy, action, root);
            break;
        case menuActions.CHANGE_ARROWHEAD_BARB_LENGTH:
            updatedState = arrowhead.changeArrowheadBarbLength(stateCopy, action, root);
            break;
        case menuActions.CHANGE_ARROWHEAD_RADIUS_X:
            updatedState = arrowhead.changeArrowheadRadiusX(stateCopy, action, root);
            break;
        case menuActions.CHANGE_ARROWHEAD_RADIUS_Y:
            updatedState = arrowhead.changeArrowheadRadiusY(stateCopy, action, root);
            break;
        case menuActions.SELECT_ARROWHEAD_PRESET:
            updatedState = arrowhead.selectArrowheadPreset(stateCopy, action, root);
            break;
        case menuActions.TOGGLE_ARROWHEAD_FILL:
            updatedState = arrowhead.toggleArrowheadFill(stateCopy, action, root);
            break;
        case menuActions.TOGGLE_ARROWHEAD_ASPECT:
            updatedState = arrowhead.toggleArrowheadAspect(stateCopy, action, root);
            break;
        case menuActions.ADD_ARROWHEAD_PRESET:
            updatedState = arrowhead.addArrowheadPreset(stateCopy, action, root);
            break;
        case menuActions.SAVE_ARROWHEAD_PRESET:
            updatedState = arrowhead.saveArrowheadPreset(stateCopy, action, root);
            break;
        case menuActions.DELETE_ARROWHEAD_PRESET:
            updatedState = arrowhead.deleteArrowheadPreset(stateCopy, action, root);
            break;
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
            }
        }
    }

    if (updatedState.editInProgress) {
        updatedState.justCopied = false;
        updatedState.pasteOffset = {x: 0, y: 0};
    }

    if (root.menuState && root.menuState.toolType !== 'selectTool' && stateCopy.mode === 'reshape') {
        if (root.menuState.toolType !== 'polygonTool' && root.menuState.toolType !== 'bezierTool') {
            stateCopy.mode = '';
            stateCopy.selected = [];
            stateCopy.selectionBoxes = [];
        }
    }

    return updatedState;
}

export default drawingState;
