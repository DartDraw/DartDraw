import jsondiffpatch from 'jsondiffpatch';
import * as canvasActions from './../actions/canvas';
import * as menuActions from './../actions/menu';
import * as canvas from './caseFunctions/canvas';
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
    lastSavedShapes: {},
    editInProgress: false,
    canvasHeight: 800,
    canvasWidth: 800,
    scale: 1,
    panX: 0,
    panY: 0,
    past: [],
    future: []
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
        case canvasActions.UPDATE_BOUNDING_BOXES:
            updatedState = canvas.handleBoundingBoxUpdate(stateCopy, action, root);
            break;
        case menuActions.SELECT_COLOR:
            updatedState = shape.setColor(stateCopy, action, root);
            break;
        case menuActions.BRING_FRONT:
            updatedState = shape.bringFront(stateCopy, action, root);
            break;
        case menuActions.SEND_BACK:
            updatedState = shape.sendBack(stateCopy, action, root);
            break;
        case menuActions.KEY_DOWN:
            updatedState = shape.keyDown(stateCopy, action, root);
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
        case menuActions.EXPORT_CLICK:
            return menu.exportClick(stateCopy);
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
    return updatedState;
}

export default drawingState;
