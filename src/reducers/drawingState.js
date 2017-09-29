import * as canvas from './../actions/canvas';
import * as menu from './../actions/menu';
import * as drag from './functions/drag';
import * as selection from './functions/selection';
import * as undoredo from './functions/undoredo';

const initialState = {
    toolType: "",
    selected: [],
    editing: {},
    drawing: {},
    selectionBoxes: {},
    zIndexedShapeIds: [],
    past: [],
    future: []
};

function DartDraw(state = initialState, action) {
    switch (action.type) {
        case canvas.CANVAS_DRAG_START:
        case canvas.SHAPE_DRAG_START:
            return drag.start(state, action);
        case canvas.CANVAS_DRAG:
        case canvas.SHAPE_DRAG:
            return drag.drag(state, action);
        case canvas.CANVAS_DRAG_STOP:
        case canvas.SHAPE_DRAG_STOP:
            return drag.stop(state, action);
        case menu.UNDO_CLICK:
            return undoredo.undo(state);
        case menu.REDO_CLICK:
            return undoredo.redo(state);
        case menu.SELECT_TOOL:
            return selection.selectTool(state, action);
        default:
            return state;
    }
}

export default DartDraw;
